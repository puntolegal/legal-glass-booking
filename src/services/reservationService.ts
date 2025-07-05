import { supabase } from "@/lib/supabaseClient";

// Tipos para las reservas
export interface Reservation {
  id?: string;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  descripcion: string;
  fecha: string;
  hora: string;
  user_id?: string;
  created_at?: string;
}

export interface TimeSlot {
  hora: string;
  disponible: boolean;
  reservaId?: string;
}

// Horarios disponibles
export const HORARIOS_DISPONIBLES = [
  '09:00', '10:00', '11:00', '12:00', 
  '14:00', '15:00', '16:00', '17:00'
];

// Función para guardar reservas en localStorage (legacy)
const saveReservas = () => {
  // No longer used as we're using Supabase
};

// Función para verificar si un horario está disponible
export async function isTimeSlotAvailable(fecha: string, hora: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('reservas')
    .select('id')
    .eq('fecha', fecha)
    .eq('hora', hora);
  if (error) throw error;
  return !data || data.length === 0;
}

// Función para obtener horarios disponibles para una fecha
export async function getAvailableTimeSlots(fecha: string): Promise<TimeSlot[]> {
  const reservas = await getReservationsByDate(fecha);
  return HORARIOS_DISPONIBLES.map(hora => ({
    hora,
    disponible: !reservas.some(r => r.hora === hora)
  }));
}

// Función para crear una nueva reserva
export async function createReservation(reservation: Reservation): Promise<Reservation> {
  const { data, error } = await supabase
    .from('reservas')
    .insert([reservation])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Función para obtener todas las reservas
export async function getAllReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .order('fecha', { ascending: true });
  if (error) throw error;
  return data || [];
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

// Función para limpiar reservas antiguas (más de 30 días)
export const cleanupOldReservations = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { error } = await supabase
    .from('reservas')
    .delete()
    .lt('fecha', thirtyDaysAgo.toISOString().split('T')[0]);
    
  if (error) throw error;
};