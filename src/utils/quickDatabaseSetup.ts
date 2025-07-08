import { supabase } from '@/integrations/supabase/client';

// Función para configurar rápidamente el sistema básico
export async function quickDatabaseSetup(): Promise<{success: boolean, message: string, details: any[]}> {
  const results: any[] = [];
  let allSuccess = true;

  try {
    console.log('🚀 Iniciando configuración rápida de la base de datos...');

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
        fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hora: '15:00',
        descripcion: 'Consulta laboral de prueba - sistema de notificaciones'
      },
      {
        nombre: 'María González Test',
        rut: '98765432-1',
        email: 'maria.test@puntolegal.cl',
        telefono: '+56987654321',
        fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hora: '10:30',
        descripcion: 'Constitución de sociedad de prueba'
      }
    ];

    for (const reserva of reservasPrueba) {
      const { error: reservaError } = await supabase
        .from('reservas')
        .insert([reserva]);
      
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
    const { data: reservasCount, error: countError } = await supabase
      .from('reservas')
      .select('id', { count: 'exact', head: true });
    
    if (countError) {
      results.push({ step: 'Conteo reservas', success: false, error: countError.message });
      allSuccess = false;
    } else {
      results.push({ 
        step: 'Conteo reservas', 
        success: true, 
        message: `${reservasCount?.length || 0} reservas en total` 
      });
    }

    // 4. Probar funciones básicas de notificaciones (modo degradado)
    console.log('4. Probando sistema de notificaciones básico...');
    try {
      const { notificationService } = await import('@/services/notificationService');
      
      // Crear datos de prueba para notificación
      const reservaPruebaNoti = {
        id: 'test-' + Date.now(),
        nombre: 'Test Notificación',
        email: 'test@puntolegal.cl',
        telefono: '+56912345678',
        fecha: new Date().toISOString().split('T')[0],
        hora: '15:00',
        servicio: 'Consulta General',
        precio: '50000',
        categoria: 'testing'
      };

      // Intentar enviar notificación (fallará sin Make configurado, pero probará la lógica)
      const resultadoNoti = await notificationService.enviarConfirmacionReserva(reservaPruebaNoti);
      
      results.push({ 
        step: 'Prueba notificación', 
        success: true, 
        message: `Notificación ${resultadoNoti ? 'enviada' : 'falló (normal sin Make)'}` 
      });
    } catch (notiError) {
      results.push({ 
        step: 'Prueba notificación', 
        success: false, 
        error: notiError.message 
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
      message: `Error general: ${error.message}`,
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

// Función para probar webhook simplificado
export async function testBasicWebhook(): Promise<{success: boolean, message: string}> {
  try {
    const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/YOUR_WEBHOOK_ID';
    
    if (webhookUrl.includes('YOUR_WEBHOOK_ID')) {
      return {
        success: false,
        message: '❌ Webhook URL no configurada. Agrega VITE_MAKE_WEBHOOK_URL a tu .env'
      };
    }

    const testData = {
      tipo_evento: 'test',
      timestamp: new Date().toISOString(),
      test: true,
      mensaje: 'Prueba desde Punto Legal'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      return {
        success: true,
        message: '✅ Webhook respondió correctamente'
      };
    } else {
      return {
        success: false,
        message: `❌ Webhook falló: ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Error de red: ${error.message}`
    };
  }
}

// Función para limpiar datos de prueba
export async function cleanupTestData(): Promise<{success: boolean, message: string}> {
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
  webhook: boolean,
  reservas: number,
  message: string
}> {
  const basicStats = await getBasicStats();
  const webhookTest = await testBasicWebhook();

  const message = `
🗄️ Base de datos: ${basicStats.functioning ? '✅ Funcionando' : '❌ Error'}
📧 Webhook: ${webhookTest.success ? '✅ Configurado' : '❌ Sin configurar'}
📋 Reservas: ${basicStats.reservas}
👥 Perfiles: ${basicStats.profiles}
  `.trim();

  return {
    database: basicStats.functioning,
    webhook: webhookTest.success,
    reservas: basicStats.reservas,
    message
  };
}

// Exponer funciones globalmente para fácil acceso desde consola
if (typeof window !== 'undefined') {
  (window as any).PuntoLegalDebug = {
    quickSetup: quickDatabaseSetup,
    getStats: getBasicStats,
    testWebhook: testBasicWebhook,
    cleanup: cleanupTestData,
    getStatus: getSystemStatus
  };
  
  console.log('🛠️ Funciones de debug disponibles:');
  console.log('• PuntoLegalDebug.quickSetup() - Configuración rápida');
  console.log('• PuntoLegalDebug.getStats() - Estadísticas básicas');
  console.log('• PuntoLegalDebug.testWebhook() - Probar webhook');
  console.log('• PuntoLegalDebug.getStatus() - Estado del sistema');
  console.log('• PuntoLegalDebug.cleanup() - Limpiar datos de prueba');
} 