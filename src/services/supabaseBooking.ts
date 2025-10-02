import { supabase } from '@/integrations/supabase/client';
import { sendRealBookingEmails } from './realEmailService';

// Map database result to Reserva type (corregido para incluir campos reales)
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
  external_reference: data.external_reference, // Campo real en la base de datos
  preference_id: data.preference_id, // Campo real en la base de datos
  estado: data.estado,
  recordatorio_enviado: data.recordatorio_enviado || false,
  email_enviado: data.email_enviado || false, // Campo real en la base de datos
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
    categoria?: string;
    tipoReunion?: string;
    fecha: string;
    hora: string;
    descripcion?: string;
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
  recordatorio_enviado?: boolean;
  email_enviado?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentStatusUpdate {
  estado: string;
  id?: string | null;
  externalReference?: string | null;
  preferenceId?: string | null;
}

export interface BookingEmailData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  precio: string;
  fecha: string;
  hora: string;
  tipo_reunion?: string;
  descripcion?: string;
  created_at: string;
}

// Crear una nueva reserva con sistema de email real
export const createBookingWithRealEmail = async (
  bookingData: BookingData
): Promise<{
  success: boolean;
  reserva?: Reserva;
  error?: string;
  externalReference?: string;
}> => {
  try {
    console.log('📦 Creando reserva con email real...');

    // 1. Crear reserva en Supabase
    const reservaResult = await crearReserva(bookingData);
    
    if (!reservaResult.success || !reservaResult.reserva) {
      return {
        success: false,
        error: reservaResult.error || 'Error creando reserva'
      };
    }

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

    // 3. NO enviar emails aquí - se enviarán cuando se confirme el pago
    console.log('📦 Reserva creada en Supabase:', reservaResult.reserva.id);
    console.log('📧 Emails se enviarán cuando se confirme el pago');

    // 4. Note: email_enviado field removed as it doesn't exist in database schema

    return {
      success: true,
      reserva: reservaResult.reserva,
      externalReference: reservaResult.reserva.id
    };

  } catch (error) {
    console.error('❌ Error en createBookingWithRealEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Función principal para crear reserva en Supabase
export const crearReserva = async (bookingData: BookingData): Promise<{
  success: boolean;
  reserva?: Reserva;
  error?: string;
}> => {
  try {
    console.log('💾 Insertando reserva en Supabase...');
    
    // Validar longitud del teléfono antes de insertar
    const telefonoValidado = bookingData.cliente.telefono?.trim() || '';
    if (telefonoValidado.length > 50) {
      console.warn('⚠️ Teléfono demasiado largo, truncando a 50 caracteres');
    }
    
    const reservaData = {
      nombre: bookingData.cliente.nombre,
      email: bookingData.cliente.email,
      telefono: telefonoValidado.substring(0, 50), // Limitar a 50 caracteres
      rut: bookingData.cliente.rut || 'No especificado',
      servicio: bookingData.servicio.tipo,
      precio: bookingData.servicio.precio,
      tipo_reunion: bookingData.servicio.tipoReunion || null,
      fecha: bookingData.servicio.fecha,
      hora: bookingData.servicio.hora,
      // user_id: 'migration_placeholder', // Campo eliminado en limpieza de esquema
      descripcion:
        bookingData.descripcion ||
        bookingData.motivoConsulta ||
        bookingData.descripcion ||
        bookingData.servicio.descripcion ||
        'Consulta legal',
      estado: 'pendiente' as const
    };

    const { data: reserva, error } = await supabase
      .from('reservas')
      .insert(reservaData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error insertando reserva:', error);
      return {
        success: false,
        error: `Error de base de datos: ${error.message}`
      };
    }

    if (!reserva) {
      return {
        success: false,
        error: 'No se pudo crear la reserva'
      };
    }

    console.log('✅ Reserva creada exitosamente:', reserva.id);

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

// Crear reserva directa (función simplificada)
export const createReservationDirect = async (formData: any): Promise<{
  success: boolean;
  reserva?: Reserva;
  error?: string;
}> => {
  try {
    // Validar longitud del teléfono antes de insertar
    const telefonoValidado = formData.telefono?.trim() || '';
    if (telefonoValidado.length > 50) {
      console.warn('⚠️ Teléfono demasiado largo, truncando a 50 caracteres');
    }
    
    const reservaData = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: telefonoValidado.substring(0, 50), // Limitar a 50 caracteres
      rut: formData.rut || 'No especificado',
      servicio: formData.servicio || 'Consulta General',
      precio: String(formData.precio || '15000'),
      tipo_reunion: formData.tipo_reunion || 'online',
      fecha: formData.fecha,
      hora: formData.hora,
      // user_id: 'migration_placeholder', // Campo eliminado en limpieza de esquema
      descripcion: formData.descripcion,
      estado: 'pendiente'
    };

    const { data, error } = await supabase
      .from('reservas')
      .insert([reservaData])
      .select()
      .single();

    if (error) {
      console.error('Error creating direct reservation:', error);
      return { success: false, error: error.message };
    }

    const reserva = mapDatabaseToReserva(data);

    return {
      success: true,
      reserva
    };

  } catch (error) {
    console.error('Error in createReservationDirect:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Actualizar estado de pago (función simplificada por cambios de esquema)
export const updatePaymentStatus = async (
  reservaId: string,
  paymentData: PaymentStatusUpdate
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`🔄 Actualizando estado de pago para reserva ${reservaId}...`);

    // Get existing reservation
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

    // Simple status mapping
    const mapPaymentStatusToReservaEstado = (paymentStatus: string, currentEstado: string): 'pendiente' | 'confirmada' | 'completada' | 'cancelada' => {
      const normalizedStatus = paymentStatus.toLowerCase();
      
      if (['approved', 'completed', 'success', 'pagado'].includes(normalizedStatus)) {
        return 'confirmada';
      }
      if (['cancelled', 'failed', 'rejected', 'cancelado', 'fallido'].includes(normalizedStatus)) {
        return 'cancelada';
      }
      return currentEstado as any || 'pendiente';
    };

    const updates: Record<string, unknown> = {
      estado: mapPaymentStatusToReservaEstado(paymentData.estado, existingReservation.estado),
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('reservas')
      .update(updates)
      .eq('id', reservaId);

    if (updateError) {
      console.error('❌ Error actualizando pago:', updateError);
      return {
        success: false,
        error: updateError.message
      };
    }

    console.log('✅ Estado de pago actualizado exitosamente');
    return { success: true };

  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Confirmar pago y enviar comprobante (función simplificada)
export const confirmarPagoYEnviarComprobante = async (reserva: Reserva): Promise<void> => {
  try {
    console.log('💳 Confirmando pago y enviando comprobante...');
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
      created_at: reserva.created_at
    };

    const emailResult = await sendRealBookingEmails(emailData);

    if (!emailResult.success) {
      console.error('❌ Error enviando comprobante:', emailResult.error);
    } else {
      console.log('✅ Comprobante enviado exitosamente');
    }

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
      query = query.eq('estado', filtros.estado as any);
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

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    const reservas = (data || []).map(mapDatabaseToReserva);

    return { success: true, reservas };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Obtener una reserva por ID
export const getReservaById = async (id: string): Promise<{
  success: boolean;
  reserva?: Reserva;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Reserva no encontrada' };
    }

    return { success: true, reserva: mapDatabaseToReserva(data) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Add missing findReservaByCriteria function
export const findReservaByCriteria = async (criteria: {
  external_reference?: string;
  preference_id?: string;
  email?: string;
}): Promise<{
  success: boolean;
  reserva?: Reserva;
  error?: string;
}> => {
  try {
    console.log('🔍 findReservaByCriteria - Criterios recibidos:', criteria);
    
    // Si solo hay un criterio, usar búsqueda simple
    const criteriaCount = Object.values(criteria).filter(v => v).length;
    
    if (criteriaCount === 1) {
      let result: any;
      
      if (criteria.external_reference) {
        console.log('🔍 Buscando por external_reference:', criteria.external_reference);
        result = await (supabase as any)
          .from('reservas')
          .select('*')
          .eq('external_reference', criteria.external_reference)
          .maybeSingle();
      } else if (criteria.preference_id) {
        console.log('🔍 Buscando por preference_id:', criteria.preference_id);
        result = await (supabase as any)
          .from('reservas')
          .select('*')
          .eq('preference_id', criteria.preference_id)
          .maybeSingle();
      } else if (criteria.email) {
        console.log('🔍 Buscando por email:', criteria.email);
        result = await (supabase as any)
          .from('reservas')
          .select('*')
          .eq('email', criteria.email)
          .maybeSingle();
      }
      
      if (result?.error) {
        console.error('❌ Error en búsqueda simple:', result.error.message);
        return { success: false, error: result.error.message };
      }
      
      if (!result?.data) {
        console.log('❌ No se encontró reserva con criterio único');
        return { success: false, error: 'Reserva no encontrada' };
      }
      
      console.log('✅ Reserva encontrada con criterio único:', result.data.id);
      return { success: true, reserva: mapDatabaseToReserva(result.data) };
    }
    
    // Si hay múltiples criterios o criterio complejo, usar búsqueda múltiple
    // Si hay múltiples criterios, buscar por cada uno por separado
    console.log('🔍 Múltiples criterios - buscando por separado...');
    
    // 1. Buscar por external_reference primero (más confiable)
    if (criteria.external_reference) {
      console.log('🔍 Intentando por external_reference:', criteria.external_reference);
      const { data, error } = await (supabase as any)
        .from('reservas')
        .select('*')
        .eq('external_reference', criteria.external_reference)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error buscando por external_reference:', error.message);
      } else if (data) {
        console.log('✅ Encontrado por external_reference:', data.id);
        return { success: true, reserva: mapDatabaseToReserva(data) };
      }
    }
    
    // 2. Buscar por preference_id
    if (criteria.preference_id) {
      console.log('🔍 Intentando por preference_id:', criteria.preference_id);
      const { data, error } = await (supabase as any)
        .from('reservas')
        .select('*')
        .eq('preference_id', criteria.preference_id)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error buscando por preference_id:', error.message);
      } else if (data) {
        console.log('✅ Encontrado por preference_id:', data.id);
        return { success: true, reserva: mapDatabaseToReserva(data) };
      }
    }
    
    // 3. Buscar por email
    if (criteria.email) {
      console.log('🔍 Intentando por email:', criteria.email);
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('email', criteria.email)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error buscando por email:', error.message);
      } else if (data) {
        console.log('✅ Encontrado por email:', data.id);
        return { success: true, reserva: mapDatabaseToReserva(data) };
      }
    }
    
    console.log('❌ No se encontró reserva con ningún criterio');
    return { success: false, error: 'Reserva no encontrada' };
    
  } catch (error) {
    console.error('❌ Error general en findReservaByCriteria:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Función para actualizar una reserva
export const updateReservation = async (reservationId: string, updates: Partial<Reserva>): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log('🔄 Actualizando reserva:', reservationId, 'con datos:', updates);
    
    const { error } = await supabase
      .from('reservas')
      .update(updates)
      .eq('id', reservationId);
    
    if (error) {
      console.error('❌ Error actualizando reserva:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Reserva actualizada exitosamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error en updateReservation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export default {
  createBookingWithRealEmail,
  crearReserva,
  createReservationDirect,
  updatePaymentStatus,
  confirmarPagoYEnviarComprobante,
  getReservas,
  getReservaById,
  findReservaByCriteria
};