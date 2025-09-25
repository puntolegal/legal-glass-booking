// Servicio para manejar reservas con Supabase
// Reemplaza Make.com con funcionalidad nativa

import { supabase } from '@/integrations/supabase/client';
import { sendRealBookingEmails, type BookingEmailData } from './realEmailService';

// Función para mapear datos de la base de datos a la interfaz Reserva
const mapDatabaseToReserva = (data: any): Reserva => ({
  id: data.id,
  nombre: data.nombre,
  email: data.email,
  telefono: data.telefono,
  rut: data.rut,
  servicio: data.servicio || '',
  precio: data.precio || '0',
  categoria: null, // No existe en la tabla actual
  fecha: data.fecha,
  hora: data.hora,
  descripcion: data.descripcion,
  tipo_reunion: data.tipo_reunion,
  external_reference: null, // No existe en la tabla actual
  preference_id: null, // No existe en la tabla actual
  estado: data.estado,
    recordatorio_enviado: data.recordatorio_enviado || false,
    created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString()
});

export interface BookingData {
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    rut?: string;
  };
  servicio: {
    tipo: string;
    precio: string;
    descripcion?: string;
    fecha: string;
    hora: string;
    categoria?: string;
    tipoReunion?: string;
  };
  pago?: {
    metodo: string;
    estado: string;
    id?: string;
    monto?: number;
  };
  descripcion?: string;
  motivoConsulta?: string;
  notas?: string;
}

export interface Reserva {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rut: string | null;
  servicio: string;
  precio: string;
  categoria?: string | null;
  fecha: string;
  hora: string;
  descripcion?: string | null;
  tipo_reunion?: string | null;
  external_reference?: string | null;
  preference_id?: string | null;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  email_enviado: boolean;
  recordatorio_enviado: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentStatusUpdate {
  estado: string;
  id?: string | null;
  metodo?: string | null;
  monto?: number | null;
  tipo?: string | null;
  externalReference?: string | null;
  preferenceId?: string | null;
  statusDetail?: string | null;
}

// Crear nueva reserva y enviar emails automáticamente
export const createBookingWithEmails = async (bookingData: BookingData): Promise<{ success: boolean; reserva?: Reserva; error?: string }> => {
  try {
    console.log('📦 Creando reserva con emails automáticos...', bookingData);

    // 1. Crear la reserva en Supabase
    const reservaResult = await createBooking(bookingData);
    
    if (!reservaResult.success || !reservaResult.reserva) {
      return {
        success: false,
        error: reservaResult.error || 'Error creando la reserva'
      };
    }

    console.log('✅ Reserva creada exitosamente:', reservaResult.reserva.id);

    // 2. Preparar datos para el email
    const emailData: BookingEmailData = {
      id: reservaResult.reserva.id,
      nombre: reservaResult.reserva.nombre,
      email: reservaResult.reserva.email,
      telefono: reservaResult.reserva.telefono,
      servicio: reservaResult.reserva.servicio,
      precio: String(reservaResult.reserva.precio),
      fecha: reservaResult.reserva.fecha,
      hora: reservaResult.reserva.hora,
      created_at: reservaResult.reserva.created_at
    };

    // 3. Enviar emails REALES de confirmación
    console.log('📧 Enviando emails REALES de confirmación...');
    const emailResult = await sendRealBookingEmails(emailData);
    
    if (emailResult.success) {
      console.log('✅ Emails enviados exitosamente');
    } else {
      console.warn('⚠️ Error enviando emails, pero reserva creada:', emailResult.error);
    }

    // Note: email_enviado field removed as it doesn't exist in database schema

    return {
      success: true,
      reserva: reservaResult.reserva
    };

  } catch (error) {
    console.error('❌ Error creando reserva con emails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Crear reserva simple (sin emails)
export const createBooking = async (bookingData: BookingData): Promise<{ success: boolean; reserva?: Reserva; error?: string }> => {
  try {
    console.log('📦 Creando reserva...', bookingData);

    // Validar y limpiar email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const emailValido = emailRegex.test(bookingData.cliente.email) 
      ? bookingData.cliente.email 
      : `cliente-${Date.now()}@puntolegal.cl`;

    const reservaData = {
      nombre: bookingData.cliente.nombre,
      email: emailValido,
      telefono: bookingData.cliente.telefono,
      rut: bookingData.cliente.rut || 'No especificado',
      servicio: bookingData.servicio.tipo,
      precio: bookingData.servicio.precio,
      tipo_reunion: bookingData.servicio.tipoReunion || null,
      fecha: bookingData.servicio.fecha,
      hora: bookingData.servicio.hora,
      descripcion:
        bookingData.descripcion ||
        bookingData.motivoConsulta ||
        bookingData.notas ||
        bookingData.servicio.descripcion ||
        'Consulta legal',
      // Campos de pago removidos - no existen en la tabla actual
      estado: 'pendiente' as const
    };

    const { data: reserva, error } = await supabase
      .from('reservas')
      .insert(reservaData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error insertando reserva:', error);
      
      // Si es error de RLS, usar modo offline
      if (error.code === '42501') {
        console.warn('⚠️ Error RLS detectado, usando modo offline...');
        return createOfflineReserva(bookingData);
      }
      
      throw error;
    }

    console.log('✅ Reserva creada exitosamente:', reserva);
    
    return {
      success: true,
      reserva: mapDatabaseToReserva(reserva)
    };

  } catch (error) {
    console.error('❌ Error creando reserva:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Crear reserva en modo offline cuando falla Supabase
const createOfflineReserva = (bookingData: BookingData): { success: boolean; reserva?: Reserva; error?: string } => {
  try {
    console.log('📦 Creando reserva en modo offline...');
    
    // Generar ID único para la reserva offline
    const offlineId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const reservaOffline: Reserva = {
      id: offlineId,
      nombre: bookingData.cliente.nombre,
      email: bookingData.cliente.email,
      telefono: bookingData.cliente.telefono,
      rut: bookingData.cliente.rut || 'No especificado',
      servicio: bookingData.servicio.tipo,
      precio: bookingData.servicio.precio,
      categoria: bookingData.servicio.categoria || null,
      tipo_reunion: bookingData.servicio.tipoReunion || null,
      fecha: bookingData.servicio.fecha,
      hora: bookingData.servicio.hora,
      descripcion:
        bookingData.descripcion ||
        bookingData.motivoConsulta ||
        bookingData.notas ||
        bookingData.servicio.descripcion ||
        null,
      estado: 'pendiente',
      recordatorio_enviado: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Guardar en localStorage para persistencia
    const existingReservas = JSON.parse(localStorage.getItem('offline_reservas') || '[]');
    existingReservas.push(reservaOffline);
    localStorage.setItem('offline_reservas', JSON.stringify(existingReservas));

    console.log('✅ Reserva offline creada exitosamente:', reservaOffline.id);
    
    return {
      success: true,
      reserva: reservaOffline
    };

  } catch (error) {
    console.error('❌ Error creando reserva offline:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido en modo offline'
    };
  }
};

const mapPaymentStatusToReservaEstado = (
  status: string,
  currentEstado?: Reserva['estado']
): Reserva['estado'] => {
  switch (status) {
    case 'approved':
    case 'authorized':
      return 'confirmada';
    case 'pending':
    case 'in_process':
    case 'in_mediation':
      return 'pendiente';
    case 'rejected':
    case 'cancelled':
    case 'refunded':
    case 'charged_back':
      return 'cancelada';
    default:
      return currentEstado || 'pendiente';
  }
};

// Actualizar estado de pago cuando MercadoPago confirma
export const updatePaymentStatus = async (
  reservaId: string,
  paymentData: PaymentStatusUpdate
): Promise<{ success: boolean; reserva?: Reserva; emailSent?: boolean; alreadyConfirmed?: boolean; error?: string }> => {
  try {
    console.log('💳 Actualizando estado de pago...', { reservaId, paymentData });

    const { data: existingReservation, error: fetchError } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', reservaId)
      .single();

    if (fetchError || !existingReservation) {
      console.error('❌ Error obteniendo reserva para actualizar pago:', fetchError);
      return {
        success: false,
        error: fetchError?.message || 'Reserva no encontrada'
      };
    }

    const currentReservation = mapDatabaseToReserva(existingReservation);
    const previousStatus = (currentReservation.pago_estado || '').toLowerCase();
    const normalizedEstado = (paymentData.estado || '').toLowerCase() || 'pending';

    const updates: Record<string, unknown> = {
      pago_estado: normalizedEstado,
      pago_id: paymentData.id ?? currentReservation.pago_id ?? null,
      pago_metodo: paymentData.metodo || paymentData.tipo || currentReservation.pago_metodo || 'mercadopago',
      pago_monto: paymentData.monto ?? currentReservation.pago_monto ?? null,
      preference_id: paymentData.preferenceId ?? currentReservation.preference_id ?? null,
      external_reference: paymentData.externalReference ?? currentReservation.external_reference ?? null,
      estado: mapPaymentStatusToReservaEstado(normalizedEstado, currentReservation.estado),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('reservas')
      .update(updates)
      .eq('id', reservaId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando pago:', error);
      throw error;
    }

    const updatedReservation = mapDatabaseToReserva(data);
    const shouldSendEmail = normalizedEstado === 'approved' && previousStatus !== 'approved';

    if (shouldSendEmail) {
      await sendPaymentConfirmationEmail(updatedReservation);
    }

    return {
      success: true,
      reserva: updatedReservation,
      emailSent: shouldSendEmail,
      alreadyConfirmed: previousStatus === 'approved' || currentReservation.estado === 'confirmada'
    };

  } catch (error) {
    console.error('❌ Error actualizando estado de pago:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Enviar email de confirmación de pago
const sendPaymentConfirmationEmail = async (reserva: Reserva) => {
  try {
    console.log('📧 Enviando email de confirmación de pago...');

    const emailData: BookingEmailData = {
      id: reserva.id,
      nombre: reserva.nombre,
      email: reserva.email,
      telefono: reserva.telefono,
      servicio: reserva.servicio,
      precio: String(reserva.precio ?? ''),
      fecha: reserva.fecha,
      hora: reserva.hora,
      tipo_reunion: reserva.tipo_reunion || undefined,
      descripcion: reserva.descripcion || undefined,
      pago_metodo: reserva.pago_metodo || undefined,
      pago_estado: reserva.pago_estado || undefined,
      created_at: reserva.created_at
    };

    const emailResult = await sendRealBookingEmails(emailData);

    if (!emailResult.success) {
      console.error('❌ Error enviando email de confirmación:', emailResult.error);
      return;
    }

    console.log('✅ Email de confirmación enviado');
    
    // Marcar email como enviado
    await supabase
    // Note: email_enviado field removed as it doesn't exist in database schema

  } catch (error) {
    console.error('❌ Error en confirmación de pago:', error);
  }
};

// Obtener reservas (solo para admins)
export const getReservas = async (filtros?: {
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  limite?: number;
}): Promise<{ success: boolean; reservas?: Reserva[]; error?: string }> => {
  try {
    let query = supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: false });

    if (filtros?.estado) {
      query = query.eq('estado', filtros.estado);
    }

    if (filtros?.fechaDesde) {
      query = query.gte('fecha', filtros.fechaDesde);
    }

    if (filtros?.fechaHasta) {
      query = query.lte('fecha', filtros.fechaHasta);
    }

    if (filtros?.limite) {
      query = query.limit(filtros.limite);
    }

    const { data: reservas, error } = await query;

    if (error) {
      console.error('❌ Error obteniendo reservas:', error);
      throw error;
    }

    return {
      success: true,
      reservas: reservas.map(mapDatabaseToReserva)
    };

  } catch (error) {
    console.error('❌ Error obteniendo reservas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Buscar reserva por email o ID de pago
export const findReservaByCriteria = async (criteria: {
  reservationId?: string;
  email?: string;
  pagoId?: string;
  externalReference?: string;
  preferenceId?: string;
}): Promise<{ success: boolean; reserva?: Reserva; error?: string }> => {
  try {
    let query = supabase.from('reservas').select('*');

    if (criteria.reservationId) {
      query = query.eq('id', criteria.reservationId);
    } else if (criteria.pagoId) {
      query = query.eq('pago_id', criteria.pagoId);
    } else if (criteria.preferenceId) {
      query = query.eq('preference_id', criteria.preferenceId);
    } else if (criteria.externalReference) {
      // Buscar por columna dedicada external_reference
      query = query.eq('external_reference', criteria.externalReference);
    } else if (criteria.email) {
      query = query.eq('email', criteria.email);
    }

    const { data: reservas, error } = await query.order('created_at', { ascending: false }).limit(1);

    if (error) {
      console.error('❌ Error buscando reserva:', error);
      throw error;
    }

    return {
      success: true,
      reserva: reservas?.[0] ? mapDatabaseToReserva(reservas[0]) : undefined
    };

  } catch (error) {
    console.error('❌ Error buscando reserva:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export default {
  createBookingWithEmails,
  createBooking,
  updatePaymentStatus,
  getReservas,
  findReservaByCriteria
};
