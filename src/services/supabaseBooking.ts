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
  google_meet_link: data.google_meet_link ?? undefined,
  confirmation_email_status: data.confirmation_email_status ?? undefined,
  agendamiento_intake_id: data.agendamiento_intake_id ?? null,
  pago_estado: data.pago_estado ?? undefined,
  qualification_data: data.qualification_data ?? undefined,
  risk_level: data.risk_level ?? undefined,
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
  /** Lead del paso 1 (tabla agendamiento_intakes), si existe */
  agendamiento_intake_id?: string | null;
  /** Micro-cualificación inmobiliaria (JSON en columna qualification_data) */
  qualificationData?: Record<string, unknown> | null;
  riskLevel?: string | null;
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
  google_meet_link?: string | null;
  /** pending_calendar: esperando Zapier; sent: correo listo; failed: error previo al envío */
  confirmation_email_status?: string | null;
  agendamiento_intake_id?: string | null;
  pago_estado?: string | null;
  qualification_data?: Record<string, unknown> | null;
  risk_level?: string | null;
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
  external_reference?: string | null;
  agendamiento_intake_id?: string | null;
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
    
    const pagoEstado = bookingData.pago?.estado?.trim();
    const pLower = pagoEstado?.toLowerCase() ?? '';
    const estadoInicial =
      pLower &&
      (['approved', 'completed', 'success', 'pagado'].includes(pLower) ||
        pLower === 'waived_inmobiliario')
        ? ('confirmada' as const)
        : ('pendiente' as const);

    const reservaData: Record<string, unknown> = {
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
      estado: estadoInicial,
      ...(pagoEstado ? { pago_estado: pagoEstado } : {}),
      ...(bookingData.agendamiento_intake_id
        ? { agendamiento_intake_id: bookingData.agendamiento_intake_id }
        : {}),
      ...(bookingData.qualificationData != null
        ? { qualification_data: bookingData.qualificationData as object }
        : {}),
      ...(bookingData.riskLevel ? { risk_level: bookingData.riskLevel } : {}),
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

    // CRÍTICO: Actualizar external_reference = id para que siempre esté disponible
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ external_reference: reserva.id })
      .eq('id', reserva.id);

    if (updateError) {
      console.warn('⚠️ Error actualizando external_reference:', updateError);
      // No fallar la operación por esto, solo loguearlo
    } else {
      console.log('✅ external_reference actualizado:', reserva.id);
    }

    return {
      success: true,
      reserva: {
        ...mapDatabaseToReserva(reserva),
        external_reference: reserva.id // Asegurar que el campo esté en el objeto retornado
      }
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
      created_at: reserva.created_at || new Date().toISOString(),
      external_reference: reserva.external_reference ?? undefined,
      agendamiento_intake_id: reserva.agendamiento_intake_id ?? undefined,
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

// Búsqueda simplificada con prioridad clara
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
    console.log('🔍 Buscando reserva con:', criteria);
    
    // PRIORIDAD 1: external_reference (99% de los casos)
    if (criteria.external_reference) {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('external_reference', criteria.external_reference)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error buscando por external_reference:', error);
        return { success: false, error: error.message };
      }
      
      if (data) {
        console.log('✅ Reserva encontrada por external_reference');
        return { success: true, reserva: mapDatabaseToReserva(data) };
      }
    }
    
    // PRIORIDAD 2: preference_id (fallback)
    if (criteria.preference_id) {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('preference_id', criteria.preference_id)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error buscando por preference_id:', error);
        return { success: false, error: error.message };
      }
      
      if (data) {
        console.log('✅ Reserva encontrada por preference_id');
        return { success: true, reserva: mapDatabaseToReserva(data) };
      }
    }
    
    console.log('❌ Reserva no encontrada');
    return { success: false, error: 'Reserva no encontrada' };
    
  } catch (error) {
    console.error('❌ Error en findReservaByCriteria:', error);
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