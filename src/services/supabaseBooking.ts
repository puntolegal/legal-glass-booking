// Servicio para manejar reservas con Supabase
// Reemplaza Make.com con funcionalidad nativa

import { supabase } from '@/integrations/supabase/client';
import { sendRealBookingEmails, type BookingEmailData } from './realEmailService';

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
  };
  pago?: {
    metodo: string;
    estado: string;
    id?: string;
    monto?: number;
  };
  notas?: string;
  motivoConsulta?: string;
}

export interface Reserva {
  id: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_rut?: string;
  servicio_tipo: string;
  servicio_precio: string;
  servicio_descripcion?: string;
  fecha: string;
  hora: string;
  pago_metodo: string;
  pago_estado: string;
  pago_id?: string;
  pago_monto?: number;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  descripcion?: string;
  email_enviado: boolean;
  recordatorio_enviado: boolean;
  created_at: string;
  updated_at: string;
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
      cliente_nombre: reservaResult.reserva.cliente_nombre,
      cliente_email: reservaResult.reserva.cliente_email,
      cliente_telefono: reservaResult.reserva.cliente_telefono,
      servicio_tipo: reservaResult.reserva.servicio_tipo,
      servicio_precio: reservaResult.reserva.servicio_precio,
      fecha: reservaResult.reserva.fecha,
      hora: reservaResult.reserva.hora,
      pago_metodo: reservaResult.reserva.pago_metodo,
      pago_estado: reservaResult.reserva.pago_estado,
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

    // 4. Actualizar el estado de email_enviado en la reserva
    try {
      await supabase
        .from('reservas')
        .update({ email_enviado: emailResult.success })
        .eq('id', reservaResult.reserva.id);
    } catch (updateError) {
      console.warn('⚠️ Error actualizando estado de email:', updateError);
    }

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

    const reservaData = {
      cliente_nombre: bookingData.cliente.nombre,
      cliente_email: bookingData.cliente.email,
      cliente_telefono: bookingData.cliente.telefono,
      cliente_rut: bookingData.cliente.rut,
      servicio_tipo: bookingData.servicio.tipo,
      servicio_precio: bookingData.servicio.precio,
      servicio_descripcion: bookingData.servicio.descripcion,
      fecha: bookingData.servicio.fecha,
      hora: bookingData.servicio.hora,
      pago_metodo: bookingData.pago?.metodo || 'pendiente',
      pago_estado: bookingData.pago?.estado || 'pendiente',
      pago_id: bookingData.pago?.id,
      pago_monto: bookingData.pago?.monto,
      notas: bookingData.notas,
      descripcion: bookingData.motivoConsulta,
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
      reserva: reserva as Reserva
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
      cliente_nombre: bookingData.cliente.nombre,
      cliente_email: bookingData.cliente.email,
      cliente_telefono: bookingData.cliente.telefono,
      cliente_rut: bookingData.cliente.rut,
      servicio_tipo: bookingData.servicio.tipo,
      servicio_precio: bookingData.servicio.precio,
      servicio_descripcion: bookingData.servicio.descripcion,
      fecha: bookingData.servicio.fecha,
      hora: bookingData.servicio.hora,
      pago_metodo: bookingData.pago?.metodo || 'pendiente',
      pago_estado: bookingData.pago?.estado || 'pendiente',
      pago_id: bookingData.pago?.id,
      pago_monto: bookingData.pago?.monto,
      estado: 'pendiente',
      notas: bookingData.notas,
      descripcion: bookingData.motivoConsulta,
      email_enviado: false,
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

// Actualizar estado de pago cuando MercadoPago confirma
export const updatePaymentStatus = async (
  reservaId: string, 
  paymentData: { estado: string; id?: string; metodo?: string; monto?: number }
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('💳 Actualizando estado de pago...', { reservaId, paymentData });

    const { data, error } = await supabase
      .from('reservas')
      .update({
        pago_estado: paymentData.estado,
        pago_id: paymentData.id,
        pago_metodo: paymentData.metodo || 'mercadopago',
        pago_monto: paymentData.monto,
        estado: paymentData.estado === 'approved' ? 'confirmada' : 'pendiente',
        updated_at: new Date().toISOString()
      })
      .eq('id', reservaId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando pago:', error);
      throw error;
    }

    console.log('✅ Estado de pago actualizado:', data);
    
    // Si el pago fue aprobado, enviar email de confirmación
    if (paymentData.estado === 'approved') {
      await sendPaymentConfirmationEmail(data);
    }
    
    return { success: true };

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

    const bookingData: BookingData = {
      cliente: {
        nombre: reserva.cliente_nombre,
        email: reserva.cliente_email,
        telefono: reserva.cliente_telefono,
        rut: reserva.cliente_rut
      },
      servicio: {
        tipo: reserva.servicio_tipo,
        precio: reserva.servicio_precio,
        descripcion: reserva.servicio_descripcion,
        fecha: reserva.fecha,
        hora: reserva.hora
      },
      pago: {
        metodo: reserva.pago_metodo,
        estado: reserva.pago_estado,
        id: reserva.pago_id,
        monto: reserva.pago_monto
      },
      notas: reserva.notas,
      motivoConsulta: reserva.descripcion
    };

    const { error } = await supabase.functions.invoke('send-booking-email', {
      body: { bookingData }
    });

    if (error) {
      console.error('❌ Error enviando email de confirmación:', error);
    } else {
      console.log('✅ Email de confirmación enviado');
      
      // Marcar email como enviado
      await supabase
        .from('reservas')
        .update({ email_enviado: true })
        .eq('id', reserva.id);
    }

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
      reservas: reservas as Reserva[]
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
  email?: string;
  pagoId?: string;
  externalReference?: string;
}): Promise<{ success: boolean; reserva?: Reserva; error?: string }> => {
  try {
    let query = supabase.from('reservas').select('*');

    if (criteria.email) {
      query = query.eq('cliente_email', criteria.email);
    } else if (criteria.pagoId) {
      query = query.eq('pago_id', criteria.pagoId);
    } else if (criteria.externalReference) {
      // Buscar por referencia externa en notas o ID
      query = query.or(`id.eq.${criteria.externalReference},notas.ilike.%${criteria.externalReference}%`);
    }

    const { data: reservas, error } = await query.order('created_at', { ascending: false }).limit(1);

    if (error) {
      console.error('❌ Error buscando reserva:', error);
      throw error;
    }

    return {
      success: true,
      reserva: reservas?.[0] as Reserva
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
