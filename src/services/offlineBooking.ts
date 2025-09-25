/**
 * Servicio de reservas offline para cuando Supabase no está disponible
 * Almacena las reservas en localStorage como backup
 */

export interface OfflineBookingData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  cliente_empresa?: string;
  servicio: string;
  precio: string;
  categoria: string;
  fecha: string;
  hora: string;
  tipo_reunion: string;
  descripcion?: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  pago_metodo?: string;
  pago_estado?: string;
  pago_id?: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'punto_legal_reservas_offline';

// Obtener todas las reservas del localStorage
export const getOfflineBookings = (): OfflineBookingData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error leyendo reservas offline:', error);
    return [];
  }
};

// Guardar una nueva reserva offline
export const saveOfflineBooking = (bookingData: Omit<OfflineBookingData, 'id' | 'created_at' | 'updated_at'>): OfflineBookingData => {
  try {
    const existingBookings = getOfflineBookings();
    
    const newBooking: OfflineBookingData = {
      ...bookingData,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const updatedBookings = [...existingBookings, newBooking];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));
    
    console.log('✅ Reserva guardada offline:', newBooking.id);
    return newBooking;
    
  } catch (error) {
    console.error('❌ Error guardando reserva offline:', error);
    throw new Error('No se pudo guardar la reserva offline');
  }
};

// Actualizar una reserva offline
export const updateOfflineBooking = (id: string, updates: Partial<OfflineBookingData>): OfflineBookingData | null => {
  try {
    const existingBookings = getOfflineBookings();
    const bookingIndex = existingBookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      console.error('Reserva no encontrada:', id);
      return null;
    }
    
    const updatedBooking = {
      ...existingBookings[bookingIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    existingBookings[bookingIndex] = updatedBooking;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingBookings));
    
    console.log('✅ Reserva actualizada offline:', id);
    return updatedBooking;
    
  } catch (error) {
    console.error('❌ Error actualizando reserva offline:', error);
    return null;
  }
};

// Obtener una reserva específica
export const getOfflineBookingById = (id: string): OfflineBookingData | null => {
  const bookings = getOfflineBookings();
  return bookings.find(b => b.id === id) || null;
};

// Eliminar una reserva offline
export const deleteOfflineBooking = (id: string): boolean => {
  try {
    const existingBookings = getOfflineBookings();
    const filteredBookings = existingBookings.filter(b => b.id !== id);
    
    if (filteredBookings.length === existingBookings.length) {
      console.error('Reserva no encontrada para eliminar:', id);
      return false;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBookings));
    console.log('✅ Reserva eliminada offline:', id);
    return true;
    
  } catch (error) {
    console.error('❌ Error eliminando reserva offline:', error);
    return false;
  }
};

// Limpiar todas las reservas offline (usar con cuidado)
export const clearOfflineBookings = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Todas las reservas offline eliminadas');
  } catch (error) {
    console.error('❌ Error limpiando reservas offline:', error);
  }
};

// Exportar reservas offline (para migración futura)
export const exportOfflineBookings = (): string => {
  const bookings = getOfflineBookings();
  return JSON.stringify(bookings, null, 2);
};

// Obtener estadísticas de reservas offline
export const getOfflineBookingStats = () => {
  const bookings = getOfflineBookings();
  
  return {
    total: bookings.length,
    pendientes: bookings.filter(b => b.estado === 'pendiente').length,
    confirmadas: bookings.filter(b => b.estado === 'confirmada').length,
    completadas: bookings.filter(b => b.estado === 'completada').length,
    canceladas: bookings.filter(b => b.estado === 'cancelada').length,
    ultimaReserva: bookings.length > 0 ? bookings[bookings.length - 1].created_at : null
  };
};

// Simular envío de email (para desarrollo)
export const simulateEmailSend = (booking: OfflineBookingData): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log('📧 Simulando envío de email para reserva:', booking.id);
    console.log('📧 Cliente:', booking.nombre, '(' + booking.email + ')');
    console.log('📧 Servicio:', booking.servicio);
    console.log('📧 Fecha:', booking.fecha, 'a las', booking.hora);
    
    // Simular delay de envío
    setTimeout(() => {
      console.log('✅ Email simulado enviado exitosamente');
      resolve(true);
    }, 1000);
  });
};

// Función principal para crear reserva offline con envío real de emails
export const createOfflineBookingWithEmail = async (bookingData: Omit<OfflineBookingData, 'id' | 'created_at' | 'updated_at'>): Promise<OfflineBookingData> => {
  try {
    // Guardar la reserva
    const newBooking = saveOfflineBooking(bookingData);
    
    // Enviar emails REALES (cliente y admin)
    try {
      const { sendRealBookingEmails } = await import('@/services/realEmailService');
      const emailData = {
        id: newBooking.id,
        nombre: newBooking.nombre,
        email: newBooking.email,
        telefono: newBooking.telefono,
        servicio: newBooking.servicio,
        precio: String(newBooking.precio),
        fecha: newBooking.fecha,
        hora: newBooking.hora,
        created_at: newBooking.created_at
      };
      
      console.log('📧 Enviando emails REALES para reserva offline:', newBooking.id);
      await sendRealBookingEmails(emailData);
      console.log('✅ Emails enviados exitosamente para reserva offline');
    } catch (emailError) {
      console.error('❌ Error enviando emails reales, usando simulación:', emailError);
      // Fallback a simulación si falla el envío real
      await simulateEmailSend(newBooking);
      await simulateAdminNotification(newBooking);
    }
    
    // Actualizar estado para indicar que el email fue "enviado"
    const updatedBooking = updateOfflineBooking(newBooking.id, {
      estado: 'confirmada'
    });
    
    return updatedBooking || newBooking;
    
  } catch (error) {
    console.error('❌ Error creando reserva offline:', error);
    throw error;
  }
};

// Simular notificación al administrador
export const simulateAdminNotification = (booking: OfflineBookingData): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log('');
    console.log('🔔 SIMULANDO EMAIL AL ADMINISTRADOR:');
    console.log('📧 Para: puntolegalelgolf@gmail.com');
    console.log('📧 Asunto: 🔔 Nueva reserva - ' + booking.nombre);
    console.log('📧 Contenido:');
    console.log('   📋 NUEVA RESERVA REGISTRADA');
    console.log('   👤 Cliente:', booking.nombre);
    console.log('   📧 Email:', booking.email);
    console.log('   📞 Teléfono:', booking.telefono);
    if (booking.cliente_empresa) {
      console.log('   🏢 Empresa:', booking.cliente_empresa);
    }
    console.log('   🛎️  Servicio:', booking.servicio);
    console.log('   💰 Precio:', '$' + booking.precio);
    console.log('   📅 Fecha:', booking.fecha);
    console.log('   🕐 Hora:', booking.hora);
    console.log('   📍 Tipo:', booking.tipo_reunion);
    if (booking.descripcion) {
      console.log('   📝 Descripción:', booking.descripcion);
    }
    console.log('   🆔 ID Reserva:', booking.id);
    console.log('   📅 Creado:', new Date(booking.created_at).toLocaleString('es-CL'));
    console.log('');
    console.log('   🎯 ACCIONES REQUERIDAS:');
    console.log('   ✅ Revisar disponibilidad en calendario');
    console.log('   ✅ Confirmar cita con el cliente');
    console.log('   ✅ Preparar documentación relevante');
    console.log('   ✅ Programar recordatorio 24h antes');
    console.log('');
    
    // Simular delay de envío
    setTimeout(() => {
      console.log('✅ Email de notificación al admin simulado exitosamente');
      resolve(true);
    }, 500);
  });
};
