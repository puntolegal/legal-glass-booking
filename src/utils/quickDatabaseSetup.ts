import { supabase } from '@/integrations/supabase/client';
import { NOTIFICATION_CONFIG } from '@/config/notifications';
import type { Reserva } from '@/services/supabaseBooking';
import { addDaysLocalYmd, toLocalYmd } from '@/lib/dates';

// Función para crear la tabla reservas si no existe
export async function createReservasTableIfNotExists(): Promise<{success: boolean; message: string}> {
  try {
    console.log('🔍 Verificando si la tabla reservas existe...');
    
    // Intentar hacer una consulta simple a la tabla reservas
    const { data, error } = await supabase
      .from('reservas')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'PGRST205') {
      // Tabla no existe
      console.log('📝 La tabla reservas no existe, necesita ser creada manualmente');
      return { 
        success: false, 
        message: 'La tabla reservas no existe. Ejecuta el script CREATE_TABLE_RESERVAS.sql en el SQL Editor de Supabase: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql' 
      };
    } else if (error) {
      console.warn('⚠️ Error verificando tabla:', error.message);
      return { success: false, message: `Error verificando tabla: ${error.message}` };
    } else {
      console.log('✅ La tabla reservas existe y es accesible');
      return { success: true, message: 'Tabla reservas existe y es accesible' };
    }
    
  } catch (error) {
    console.error('❌ Error verificando tabla reservas:', error);
    return { 
      success: false, 
      message: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}` 
    };
  }
}

// Función para configurar rápidamente el sistema básico
export async function quickDatabaseSetup(): Promise<{success: boolean; message: string; details: Array<Record<string, unknown>>}> {
  const results: Array<Record<string, unknown>> = [];
  let allSuccess = true;

  try {
    console.log('🚀 Iniciando configuración rápida de la base de datos...');

    // 0. Crear tabla reservas si no existe
    console.log('0. Verificando/creando tabla reservas...');
    const tableResult = await createReservasTableIfNotExists();
    results.push({ 
      step: 'Tabla reservas', 
      success: tableResult.success, 
      message: tableResult.message 
    });
    if (!tableResult.success) {
      allSuccess = false;
    }

    // 1. Verificar conexión básica
    console.log('1. Verificando conexión...');
    const { error: connectionError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      results.push({ step: 'Conexión', success: false, error: connectionError.message });
      allSuccess = false;
    } else {
      results.push({ step: 'Conexión', success: true, message: 'Conexión exitosa' });
    }

    // 2. Crear algunas reservas de prueba básicas (sin las nuevas columnas)
    console.log('2. Creando reservas de prueba...');
    const reservasPrueba = [
      {
        nombre: 'Juan Pérez Test',
        rut: '12345678-9',
        email: 'juan.test@puntolegal.cl',
        telefono: '+56912345678',
        servicio: 'Consulta laboral de prueba',
        precio: '35000',
        
        fecha: addDaysLocalYmd(1),
        hora: '15:00',
        descripcion: 'Consulta laboral de prueba - sistema de notificaciones',
        tipo_reunion: 'online',
        estado: 'pendiente' as const,
        recordatorio_enviado: false,
        webhook_sent: false
      },
      {
        nombre: 'María González Test',
        rut: '98765432-1',
        email: 'maria.test@puntolegal.cl',
        telefono: '+56987654321',
        servicio: 'Constitución de sociedad (demo)',
        precio: '50000',
        
        fecha: addDaysLocalYmd(2),
        hora: '10:30',
        descripcion: 'Constitución de sociedad de prueba',
        tipo_reunion: 'presencial',
        estado: 'pendiente' as const,
        recordatorio_enviado: false,
        webhook_sent: false
      }
    ];

    for (const reserva of reservasPrueba) {
      const { error: reservaError } = await supabase
        .from('reservas')
        .insert([{...reserva, /* user_id: 'migration_placeholder' */}]); // Campo eliminado
      
      if (reservaError) {
        console.warn('Error creando reserva de prueba:', reservaError);
        results.push({
          step: `Reserva ${reserva.nombre}`,
          success: false,
          error: reservaError.message
        });
      } else {
        results.push({
          step: `Reserva ${reserva.nombre}`,
          success: true,
          message: 'Reserva creada'
        });
      }
    }

    // 3. Verificar datos existentes
    console.log('3. Verificando datos...');
    const { count: reservasCount, error: countError } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      results.push({ step: 'Conteo reservas', success: false, error: countError.message });
      allSuccess = false;
    } else {
      results.push({ 
        step: 'Conteo reservas', 
        success: true, 
        message: `${reservasCount || 0} reservas en total` 
      });
    }

    // 4. Probar funciones básicas de notificaciones (modo degradado)
    console.log('4. Probando sistema de notificaciones básico...');
    try {
      const { notificationService } = await import('@/services/notificationService');

      const ahora = new Date();
      const reservaPruebaNoti: Reserva = {
        id: `demo-${ahora.getTime()}`,
        nombre: 'Cliente Prueba Notificación',
        email: NOTIFICATION_CONFIG.email.testRecipient || 'test@puntolegal.online',
        telefono: '+56912345678',
        rut: '11.111.111-1',
        servicio: 'Consulta Demo',
        precio: '45000',
        
        fecha: toLocalYmd(ahora),
        hora: '15:00',
        descripcion: 'Generada por quickDatabaseSetup para validar Resend.',
        tipo_reunion: 'online',
        estado: 'pendiente' as const,
        
        recordatorio_enviado: false,
        created_at: ahora.toISOString(),
        updated_at: ahora.toISOString()
      };

      const resultadoNoti = await notificationService.enviarConfirmacionReserva(reservaPruebaNoti);

      results.push({
        step: 'Prueba notificación',
        success: resultadoNoti,
        message: resultadoNoti
          ? 'Notificación enviada correctamente via Resend'
          : 'No se pudo enviar la notificación de prueba'
      });
    } catch (notiError) {
      results.push({
        step: 'Prueba notificación',
        success: false,
        error: notiError instanceof Error ? notiError.message : 'Error desconocido'
      });
    }

    const message = allSuccess 
      ? '✅ Configuración básica completada exitosamente'
      : '⚠️ Configuración parcial - revisar detalles';

    return {
      success: allSuccess,
      message,
      details: results
    };

  } catch (error) {
    console.error('Error en configuración rápida:', error);
    return {
      success: false,
      message: `Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      details: results
    };
  }
}

// Función para mostrar estadísticas básicas
export async function getBasicStats(): Promise<{
  reservas: number,
  profiles: number,
  functioning: boolean
}> {
  try {
    const [
      { count: reservasCount },
      { count: profilesCount }
    ] = await Promise.all([
      supabase.from('reservas').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
    ]);

    return {
      reservas: reservasCount || 0,
      profiles: profilesCount || 0,
      functioning: true
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas básicas:', error);
    return {
      reservas: 0,
      profiles: 0,
      functioning: false
    };
  }
}

// Función para probar el canal de emails
export async function testEmailDelivery(): Promise<{success: boolean, message: string}> {
  try {
    const { notificationService } = await import('@/services/notificationService');
    const result = await notificationService.probarConexion();
    return {
      success: result.success,
      message: result.success ? '✅ Conexión de emails funcionando' : result.error || 'Error de conexión'
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Error probando envío de emails: ${error instanceof Error ? error.message : 'Desconocido'}`
    };
  }
}

// Función para limpiar datos de prueba
export async function cleanupTestDataQuick(): Promise<{success: boolean, message: string}> {
  try {
    const { error } = await supabase
      .from('reservas')
      .delete()
      .or('email.like.%test@puntolegal.cl,descripcion.ilike.%prueba%');

    if (error) {
      return {
        success: false,
        message: `Error limpiando: ${error.message}`
      };
    }

    return {
      success: true,
      message: '✅ Datos de prueba limpiados'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

// Función para mostrar el estado del sistema
export async function getSystemStatus(): Promise<{
  database: boolean,
  emails: boolean,
  reservas: number,
  message: string
}> {
  const basicStats = await getBasicStats();
  const emailTest = await testEmailDelivery();

  const message = `
🗄️ Base de datos: ${basicStats.functioning ? '✅ Funcionando' : '❌ Error'}
📧 Emails: ${emailTest.success ? '✅ Funcionando' : '❌ Error'}
📋 Reservas: ${basicStats.reservas}
👥 Perfiles: ${basicStats.profiles}
  `.trim();

  return {
    database: basicStats.functioning,
    emails: emailTest.success,
    reservas: basicStats.reservas,
    message
  };
}

// Exponer funciones globalmente para fácil acceso desde consola
if (typeof window !== 'undefined') {
  type PuntoLegalDebugHelpers = {
    quickSetup: typeof quickDatabaseSetup;
    getStats: typeof getBasicStats;
    testEmails: typeof testEmailDelivery;
    cleanup: typeof cleanupTestDataQuick;
    getStatus: typeof getSystemStatus;
    createTable: typeof createReservasTableIfNotExists;
  };

  const globalWindow = window as typeof window & { PuntoLegalDebug?: PuntoLegalDebugHelpers };

  globalWindow.PuntoLegalDebug = {
    quickSetup: quickDatabaseSetup,
    getStats: getBasicStats,
    testEmails: testEmailDelivery,
    cleanup: cleanupTestDataQuick,
    getStatus: getSystemStatus,
    createTable: createReservasTableIfNotExists
  };

  console.log('🛠️ Funciones de debug disponibles:');
  console.log('• PuntoLegalDebug.quickSetup() - Configuración rápida');
  console.log('• PuntoLegalDebug.getStats() - Estadísticas básicas');
  console.log('• PuntoLegalDebug.testEmails() - Probar envío de emails');
  console.log('• PuntoLegalDebug.getStatus() - Estado del sistema');
  console.log('• PuntoLegalDebug.cleanup() - Limpiar datos de prueba');
  console.log('• PuntoLegalDebug.createTable() - Crear tabla reservas');
}
