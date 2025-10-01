import { supabase } from '@/integrations/supabase/client';
import { sendBookingEmailsDirect } from './emailService';
import type { Reserva } from './supabaseBooking';

export type Reservation = Reserva;

export interface ReservationInput {
  nombre: string;
  email: string;
  telefono: string;
  // rut?: string | null; // Campo eliminado en limpieza de esquema
  servicio: string;
  precio: string | number;
  categoria?: string | null;
  fecha: string;
  hora: string;
  descripcion?: string | null;
  tipo_reunion?: string | null;
  estado?: Reservation['estado'];
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
  nombre: data.nombre ?? '',
  email: data.email ?? '',
  telefono: data.telefono ?? '',
  // rut: data.rut ?? null, // Campo eliminado
  servicio: data.servicio ?? '',
  precio: data.precio ?? '0',
  categoria: data.categoria ?? null,
  fecha: data.fecha ?? new Date().toISOString().split('T')[0],
  hora: data.hora ?? '10:00',
  descripcion: data.descripcion ?? null,
  tipo_reunion: data.tipo_reunion ?? null,
  external_reference: data.external_reference ?? null,
  preference_id: data.preference_id ?? null,
  estado: data.estado ?? 'pendiente',
  recordatorio_enviado: data.recordatorio_enviado ?? false,
  created_at: data.created_at ?? new Date().toISOString(),
  updated_at: data.updated_at ?? new Date().toISOString()
});

export async function createReservation(reservationData: ReservationInput): Promise<Reservation> {
  try {
    const timestamp = new Date().toISOString();

    const payload = {
      nombre: reservationData.nombre,
      email: reservationData.email,
      telefono: reservationData.telefono,
      // rut: reservationData.rut || 'No especificado', // Campo eliminado
      servicio: reservationData.servicio,
      precio: reservationData.precio.toString(),
      fecha: reservationData.fecha,
      hora: reservationData.hora,
      descripcion: `Consulta ${reservationData.servicio} - Pago pendiente`,
      tipo_reunion: reservationData.tipo_reunion || 'online',
      estado: reservationData.estado || 'pendiente',
      user_id: 'migration_placeholder', // Required field for RLS
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
      nombre: updatedReservation.nombre,
      email: updatedReservation.email,
      telefono: updatedReservation.telefono,
      // rut: updatedReservation.rut || 'No especificado', // Campo eliminado
      servicio: updatedReservation.servicio,
      precio: String(updatedReservation.precio ?? ''),
      fecha: updatedReservation.fecha,
      hora: updatedReservation.hora,
      tipo_reunion: updatedReservation.tipo_reunion || 'online',
      descripcion: updatedReservation.descripcion || undefined
    });

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