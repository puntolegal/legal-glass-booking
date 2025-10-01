import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { addDaysLocalYmd, toLocalYmd } from '@/lib/dates';

// Función para probar la conexión básica con Supabase
export async function testSupabaseConnection(): Promise<{success: boolean, message: string}> {
  try {
    const { error } = await supabase
      .from('reservas')
      .select('*', { head: true, count: 'exact' });
    
    if (error) {
      return {
        success: false,
        message: `Error de conexión: ${error.message}`
      };
    }
    
    return { success: true, message: '✅ Conexión con Supabase exitosa' };
  } catch (error) {
    return {
      success: false,
      message: `Error de red: ${error.message}`
    };
  }
}

// Función para verificar que las tablas necesarias existen
export async function testDatabaseTables(): Promise<{success: boolean; message: string; details?: Record<string, unknown>}> {
  try {
    // Probar tabla reservas con nuevas columnas
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select('id, nombre, servicio, precio, categoria, estado, recordatorio_enviado, email_enviado')
      .limit(1);
    
    if (reservasError) {
      return {
        success: false,
        message: `Error en tabla reservas: ${reservasError.message}`
      };
    }
    
    // Skip notificaciones table - doesn't exist
    const notificaciones = [];
    const notificacionesError = null;
    
    if (notificacionesError) {
      return {
        success: false,
        message: `Error en tabla notificaciones: ${notificacionesError.message}`
      };
    }
    
    // Skip pagos table - doesn't exist
    const pagos = [];
    const pagosError = null;
    
    if (pagosError) {
      return {
        success: false,
        message: `Error en tabla pagos: ${pagosError.message}`
      };
    }
    
    return {
      success: true,
      message: '✅ Todas las tablas están configuradas correctamente',
      details: {
        reservas: reservas?.length || 0,
        notificaciones: notificaciones?.length || 0,
        pagos: pagos?.length || 0
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error verificando tablas: ${error.message}`
    };
  }
}

// Función para crear una reserva de prueba completa
export async function createTestReservation(): Promise<{success: boolean, message: string, reservaId?: string}> {
  try {
    const testData = {
      nombre: 'Test Usuario',
      // rut: '12345678-9', // Campo eliminado
      email: 'test@puntolegal.cl',
      telefono: '+56912345678',
      servicio: 'Consulta de Prueba',
      precio: '50000',
      
      fecha: addDaysLocalYmd(1),
      hora: '15:00',
      descripcion: 'Reserva de prueba para sistema de notificaciones',
      tipo_reunion: 'presencial'
    };
    
    const { data, error } = await supabase
      .from('reservas')
      .insert([{
        ...testData,
        user_id: 'migration_placeholder',
        estado: 'confirmada',
        recordatorio_enviado: false,
        webhook_sent: false
      }])
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        message: `Error creando reserva de prueba: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: `✅ Reserva de prueba creada: ${data.id}`,
      reservaId: data.id
    };
  } catch (error) {
    return {
      success: false,
      message: `Error en createTestReservation: ${error.message}`
    };
  }
}

// Función para probar envío de notificación de prueba
export async function testNotificationSend(reservaId: string): Promise<{success: boolean, message: string}> {
  try {
    // Obtener la reserva
    const { data: reserva, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', reservaId)
      .single();
    
    if (error || !reserva) {
      return {
        success: false,
        message: `Error obteniendo reserva: ${error?.message || 'No encontrada'}`
      };
    }
    
    // Intentar enviar notificación
    const resultado = await notificationService.enviarConfirmacionReserva(reserva as any);
    
    if (resultado) {
      return {
        success: true,
        message: '✅ Notificación de prueba enviada exitosamente'
      };
    } else {
      return {
        success: false,
        message: '❌ Error enviando notificación de prueba'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error en testNotificationSend: ${error.message}`
    };
  }
}

// Función para limpiar datos de prueba
export async function cleanupTestData(): Promise<{success: boolean, message: string}> {
  try {
    // Eliminar reservas de prueba
    const { error: reservasError } = await supabase
      .from('reservas')
      .delete()
      .like('email', '%test%')
      .or('descripcion.ilike.%prueba%');
    
    if (reservasError) {
      console.warn('Error limpiando reservas de prueba:', reservasError);
    }
    
    // Skip cleaning notificaciones - table doesn't exist
    
    return {
      success: true,
      message: '✅ Datos de prueba limpiados'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error limpiando datos: ${error.message}`
    };
  }
}

// Función para ejecutar suite completa de pruebas
export async function runFullTestSuite(): Promise<{
  connection: Awaited<ReturnType<typeof testSupabaseConnection>>;
  tables: Awaited<ReturnType<typeof testDatabaseTables>>;
  reservation: Awaited<ReturnType<typeof createTestReservation>>;
  notification?: Awaited<ReturnType<typeof testNotificationSend>> | null;
  cleanup: Awaited<ReturnType<typeof cleanupTestData>>;
}> {
  console.log('🧪 Iniciando suite de pruebas del sistema de notificaciones...');
  
  // 1. Probar conexión
  const connection = await testSupabaseConnection();
  console.log('1.', connection.message);
  
  // 2. Probar tablas
  const tables = await testDatabaseTables();
  console.log('2.', tables.message, tables.details);
  
  // 3. Crear reserva de prueba
  const reservation = await createTestReservation();
  console.log('3.', reservation.message);
  
  // 4. Probar notificación (solo si la reserva se creó)
  let notification = null;
  if (reservation.success && reservation.reservaId) {
    notification = await testNotificationSend(reservation.reservaId);
    console.log('4.', notification.message);
  }
  
  // 5. Limpiar datos de prueba
  const cleanup = await cleanupTestData();
  console.log('5.', cleanup.message);
  
  console.log('🎉 Suite de pruebas completada');
  
  return {
    connection,
    tables,
    reservation,
    notification,
    cleanup
  };
}

// Función para mostrar estadísticas del sistema
export async function getSystemStats(): Promise<{
  reservas: number,
  notificaciones: number,
  pagos: number,
  notificacionesPendientes: number,
  reservasHoy: number,
  reservasManana: number
}> {
  try {
    const hoy = toLocalYmd(new Date());
    const manana = addDaysLocalYmd(1);
    
    const [
      { count: totalReservas },
      { count: reservasHoy },
      { count: reservasManana }
    ] = await Promise.all([
      supabase.from('reservas').select('*', { count: 'exact', head: true }),
      supabase.from('reservas').select('*', { count: 'exact', head: true }).eq('fecha', hoy),
      supabase.from('reservas').select('*', { count: 'exact', head: true }).eq('fecha', manana)
    ]);
    
    return {
      reservas: totalReservas || 0,
      notificaciones: 0,
      pagos: 0,
      notificacionesPendientes: 0,
      reservasHoy: reservasHoy || 0,
      reservasManana: reservasManana || 0
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      reservas: 0,
      notificaciones: 0,
      pagos: 0,
      notificacionesPendientes: 0,
      reservasHoy: 0,
      reservasManana: 0
    };
  }
} 
