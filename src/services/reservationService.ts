import { supabase } from '@/integrations/supabase/client';
import { sendBookingEmailsDirect } from './emailService';

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
const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.us2.make.com/qahisda8n5e6bh9my4f9fm6dkgdg71sq';

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

// Función para confirmar reserva y enviar emails via Edge Function
export async function confirmReservation(reservationId: string): Promise<{ success: boolean; error?: string; trackingCode?: string; googleMeetLink?: string }> {
  try {
    console.log('📧 Confirmando reserva y enviando emails:', reservationId);
    
    // Obtener datos de la reserva
    const { data: reservation, error: fetchError } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', reservationId)
      .single();

    if (fetchError || !reservation) {
      console.error('❌ Error obteniendo reserva:', fetchError);
      return { success: false, error: fetchError?.message || 'Reserva no encontrada' };
    }

    // Actualizar estado de la reserva a confirmada
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ estado: 'confirmada' })
      .eq('id', reservationId);

    if (updateError) {
      console.error('❌ Error actualizando reserva:', updateError);
      return { success: false, error: updateError.message };
    }

    // Enviar emails directamente via Resend
    const emailResult = await sendBookingEmailsDirect({
      id: reservation.id,
      cliente_nombre: reservation.cliente_nombre,
      cliente_email: reservation.cliente_email,
      cliente_telefono: reservation.cliente_telefono,
      cliente_rut: reservation.cliente_rut,
      servicio_tipo: reservation.servicio_tipo,
      servicio_precio: reservation.servicio_precio,
      servicio_descripcion: reservation.servicio_descripcion,
      fecha: reservation.fecha,
      hora: reservation.hora,
      tipo_reunion: reservation.tipo_reunion
    });

    if (!emailResult.success) {
      console.error('❌ Error enviando emails:', emailResult.error);
      return { success: false, error: emailResult.error };
    }

    console.log('✅ Emails enviados exitosamente');
    console.log(`   Código de seguimiento: ${emailResult.trackingCode}`);
    console.log(`   Google Meet: ${emailResult.googleMeetLink}`);

    return { 
      success: true, 
      trackingCode: emailResult.trackingCode,
      googleMeetLink: emailResult.googleMeetLink
    };

  } catch (error) {
    console.error('❌ Error confirmando reserva:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

// Función para enviar datos a Make webhook
export async function sendToMakeWebhook(reservation: Reservation, tipo: 'nueva_reserva' | 'recordatorio' | 'comprobante'): Promise<boolean> {
  try {
    // Formato que espera Make.com según las instrucciones
    const webhookData = {
      cliente: {
        nombre: reservation.nombre,
        email: reservation.email,
        telefono: reservation.telefono
      },
      servicio: {
        nombre: reservation.servicio || 'Consulta Legal',
        precio: reservation.precio ? parseInt(reservation.precio) : 0,
        duracion: 60 // duración en minutos
      },
      cita: {
        fecha: reservation.fecha,
        hora: reservation.hora,
        notas: reservation.descripcion || ''
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

// Función para enviar emails usando Supabase Edge Function (fallback)
export async function sendBookingEmailsSupabase(reservationId: string): Promise<boolean> {
  try {
    console.log('📧 Enviando emails via Supabase Edge Function para reserva:', reservationId);
    
    const response = await fetch('/functions/v1/send-booking-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ booking_id: reservationId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Edge Function failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ Emails enviados exitosamente via Edge Function:', result);
    
    return result.ok === true;
  } catch (error) {
    console.error('❌ Error enviando emails via Edge Function:', error);
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