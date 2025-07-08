import { supabase } from '@/integrations/supabase/client';

export interface Reservation {
  id: string;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  descripcion: string;
  created_at?: string;
  servicio?: string;
  precio?: string;
  categoria?: string;
  tipo_reunion?: string;
  estado?: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  webhook_sent?: boolean;
}

export interface TimeSlot {
  hora: string;
  disponible: boolean;
}

// Horarios disponibles
export const HORARIOS_DISPONIBLES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

// URL del webhook de Make (configurable)
const MAKE_WEBHOOK_URL = process.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/YOUR_WEBHOOK_ID';

// Función para crear una nueva reserva con integración Make
export async function createReservation(reservationData: Omit<Reservation, 'id' | 'created_at'>): Promise<Reservation> {
  try {
    // Crear la reserva en Supabase
    const { data, error } = await supabase
      .from('reservas')
      .insert([{
        ...reservationData,
        estado: 'pendiente',
        webhook_sent: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    const newReservation = data as Reservation;

    // Enviar datos a Make para procesamiento de emails
    await sendToMakeWebhook(newReservation, 'nueva_reserva');

    return newReservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

// Función para enviar datos a Make webhook
export async function sendToMakeWebhook(reservation: Reservation, tipo: 'nueva_reserva' | 'recordatorio' | 'comprobante'): Promise<boolean> {
  try {
    const webhookData = {
      tipo_evento: tipo,
      reserva: {
        id: reservation.id,
        nombre: reservation.nombre,
        email: reservation.email,
        telefono: reservation.telefono,
        fecha: reservation.fecha,
        hora: reservation.hora,
        servicio: reservation.servicio,
        precio: reservation.precio,
        categoria: reservation.categoria,
        tipo_reunion: reservation.tipo_reunion,
        estado: reservation.estado
      },
      timestamp: new Date().toISOString(),
      // Datos adicionales para personalización
      empresa: 'Punto Legal',
      logo_url: 'https://tu-dominio.com/logo.png',
      contacto: {
        telefono: '+56962321883',
        email: 'puntolegalelgolf@gmail.com',
        whatsapp: 'https://wa.me/56962321883'
      }
    };

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    // Marcar como enviado
    await supabase
      .from('reservas')
      .update({ webhook_sent: true })
      .eq('id', reservation.id);

    console.log(`Webhook enviado exitosamente para reserva ${reservation.id}`);
    return true;
  } catch (error) {
    console.error('Error sending webhook to Make:', error);
    return false;
  }
}

// Función para obtener reservas por fecha
export async function getReservationsByDate(fecha: string): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('fecha', fecha);
  
  if (error) throw error;
  return data || [];
}

// Función para verificar si un horario está disponible
export async function isTimeSlotAvailable(fecha: string, hora: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('reservas')
    .select('id')
    .eq('fecha', fecha)
    .eq('hora', hora)
    .neq('estado', 'cancelada');
  
  if (error) throw error;
  return !data || data.length === 0;
}

// Función para obtener horarios disponibles para una fecha
export async function getAvailableTimeSlots(fecha: string): Promise<TimeSlot[]> {
  const reservas = await getReservationsByDate(fecha);
  return HORARIOS_DISPONIBLES.map(hora => ({
    hora,
    disponible: !reservas.some(r => r.hora === hora && r.estado !== 'cancelada')
  }));
}

// Función para obtener todas las reservas
export async function getAllReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Función para programar recordatorios automáticos
export async function scheduleReminders(): Promise<void> {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Obtener citas de mañana que necesitan recordatorio
    const { data: reservations, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('fecha', tomorrowStr)
      .eq('estado', 'confirmada')
      .eq('recordatorio_enviado', false);

    if (error) throw error;

    // Enviar recordatorio para cada cita
    for (const reservation of reservations || []) {
      await sendToMakeWebhook(reservation, 'recordatorio');
      
      // Marcar recordatorio como enviado
      await supabase
        .from('reservas')
        .update({ recordatorio_enviado: true })
        .eq('id', reservation.id);
    }

    console.log(`Recordatorios programados para ${reservations?.length || 0} citas`);
  } catch (error) {
    console.error('Error scheduling reminders:', error);
  }
}