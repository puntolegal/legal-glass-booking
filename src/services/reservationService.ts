import { supabase } from '@/integrations/supabase/client';
import { sendBookingEmailsDirect } from './emailService';
import type { Reserva } from './supabaseBooking';

export type Reservation = Reserva;

export interface ReservationInput {
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_rut?: string | null;
  servicio_tipo: string;
  servicio_precio: string | number;
  servicio_categoria?: string | null;
  fecha: string;
  hora: string;
  descripcion?: string | null;
  tipo_reunion?: string | null;
  estado?: Reservation['estado'];
  pago_metodo?: string | null;
  pago_estado?: string | null;
  pago_id?: string | null;
  pago_monto?: number | null;
  external_reference?: string | null;
  preference_id?: string | null;
}

export interface TimeSlot {
  hora: string;
  disponible: boolean;
}

export const HORARIOS_DISPONIBLES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const mapToReservation = (data: any): Reservation => ({
  id: data.id ?? '',
  cliente_nombre: data.nombre ?? '',
  cliente_email: data.email ?? '',
  cliente_telefono: data.telefono ?? '',
  cliente_rut: data.rut ?? null,
  servicio_tipo: data.servicio ?? '',
  servicio_precio: data.precio ?? '0',
  servicio_categoria: data.categoria ?? null,
  fecha: data.fecha ?? new Date().toISOString().split('T')[0],
  hora: data.hora ?? '10:00',
  descripcion: data.descripcion ?? null,
  pago_metodo: data.pago_metodo ?? null,
  pago_estado: data.pago_estado ?? null,
  pago_id: data.pago_id ?? null,
  pago_monto: data.pago_monto ?? null,
  tipo_reunion: data.tipo_reunion ?? null,
  external_reference: data.external_reference ?? null,
  preference_id: data.preference_id ?? null,
  estado: data.estado ?? 'pendiente',
  email_enviado: data.email_enviado ?? false,
  recordatorio_enviado: data.recordatorio_enviado ?? false,
  created_at: data.created_at ?? new Date().toISOString(),
  updated_at: data.updated_at ?? new Date().toISOString()
});

export async function createReservation(reservationData: ReservationInput): Promise<Reservation> {
  try {
    const timestamp = new Date().toISOString();

    const payload = {
      nombre: reservationData.cliente_nombre,
      email: reservationData.cliente_email,
      telefono: reservationData.cliente_telefono,
      rut: reservationData.cliente_rut || 'No especificado',
      servicio: reservationData.servicio_tipo,
      precio: reservationData.servicio_precio.toString(),
      fecha: reservationData.fecha,
      hora: reservationData.hora,
      descripcion: `Consulta ${reservationData.servicio_tipo} - Pago pendiente`,
      tipo_reunion: reservationData.tipo_reunion || 'online',
      estado: reservationData.estado || 'pendiente',
      recordatorio_enviado: false,
      webhook_sent: false,
      created_at: timestamp,
      updated_at: timestamp
    };

    const { data, error } = await supabase
      .from('reservas')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }

    return mapToReservation(data);
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function confirmReservation(reservationId: string): Promise<{ success: boolean; error?: string; trackingCode?: string; googleMeetLink?: string }> {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', reservationId)
      .single();

    if (fetchError || !existing) {
      console.error('Error fetching reservation:', fetchError);
      return { success: false, error: fetchError?.message || 'Reserva no encontrada' };
    }

    const now = new Date().toISOString();

    const { data: updatedData, error: updateError } = await supabase
      .from('reservas')
      .update({ estado: 'confirmada', updated_at: now })
      .eq('id', reservationId)
      .select()
      .single();

    if (updateError || !updatedData) {
      console.error('Error updating reservation:', updateError);
      return { success: false, error: updateError?.message || 'No se pudo confirmar la reserva' };
    }

    const updatedReservation = mapToReservation(updatedData);

    const emailResult = await sendBookingEmailsDirect({
      id: updatedReservation.id,
      cliente_nombre: updatedReservation.cliente_nombre,
      cliente_email: updatedReservation.cliente_email,
      cliente_telefono: updatedReservation.cliente_telefono,
      cliente_rut: updatedReservation.cliente_rut || 'No especificado',
      servicio_tipo: updatedReservation.servicio_tipo,
      servicio_precio: String(updatedReservation.servicio_precio ?? ''),
      fecha: updatedReservation.fecha,
      hora: updatedReservation.hora,
      tipo_reunion: updatedReservation.tipo_reunion || 'online',
      descripcion: updatedReservation.descripcion || undefined
    });

    if (emailResult.success) {
      await supabase
        .from('reservas')
        .update({ email_enviado: true, updated_at: new Date().toISOString() })
        .eq('id', reservationId);
    }

    return {
      success: emailResult.success,
      error: emailResult.error,
      trackingCode: emailResult.trackingCode,
      googleMeetLink: emailResult.googleMeetLink
    };
  } catch (error) {
    console.error('Error confirming reservation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

export async function getReservationsByDate(fecha: string): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('fecha', fecha);

  if (error) {
    console.error('Error fetching reservations by date:', error);
    throw error;
  }

  return (data || []).map(mapToReservation);
}

export async function isTimeSlotAvailable(fecha: string, hora: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('reservas')
    .select('id, estado')
    .eq('fecha', fecha)
    .eq('hora', hora)
    .neq('estado', 'cancelada');

  if (error) {
    console.error('Error checking time slot availability:', error);
    throw error;
  }

  return !data || data.length === 0;
}

export async function getAvailableTimeSlots(fecha: string): Promise<TimeSlot[]> {
  const reservas = await getReservationsByDate(fecha);
  return HORARIOS_DISPONIBLES.map((hora) => ({
    hora,
    disponible: !reservas.some((reserva) => reserva.hora === hora && reserva.estado !== 'cancelada')
  }));
}

export async function getAllReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }

  return (data || []).map(mapToReservation);
}
