// Script de diagnóstico para verificar respuesta de MercadoPago
// Ejecutar en la consola del navegador en www.puntolegal.online

console.log('🔍 DIAGNÓSTICO DE MERCADOPAGO - PUNTO LEGAL');
console.log('==========================================');

// 1. Verificar configuración de MercadoPago
console.log('\n1. VERIFICANDO CONFIGURACIÓN:');
console.log('Hostname actual:', window.location.hostname);
console.log('URL actual:', window.location.href);
console.log('Es producción:', window.location.hostname === 'www.puntolegal.online' || window.location.hostname === 'puntolegal.online');

// 2. Verificar localStorage
console.log('\n2. VERIFICANDO LOCALSTORAGE:');
const paymentData = localStorage.getItem('paymentData');
const pendingPayment = localStorage.getItem('pendingPayment');
console.log('paymentData:', paymentData ? JSON.parse(paymentData) : 'No encontrado');
console.log('pendingPayment:', pendingPayment ? JSON.parse(pendingPayment) : 'No encontrado');

// 3. Función para probar la creación de preferencia
async function testMercadoPagoPreference() {
  console.log('\n3. PROBANDO CREACIÓN DE PREFERENCIA:');
  
  try {
    // Importar la función de creación de preferencia
    const { createCheckoutPreference } = await import('./src/services/mercadopagoBackend.ts');
    
    // Datos de prueba
    const testData = {
      items: [{
        title: 'Consulta Legal - Prueba',
        quantity: 1,
        unit_price: 50000,
        currency_id: 'CLP'
      }],
      payer: {
        name: 'Cliente Prueba',
        email: 'test@puntolegal.online',
        phone: {
          number: '+56912345678'
        }
      },
      back_urls: {
        success: 'https://www.puntolegal.online/payment-success?source=mercadopago',
        failure: 'https://www.puntolegal.online/payment-failure?source=mercadopago',
        pending: 'https://www.puntolegal.online/payment-pending?source=mercadopago'
      },
      auto_return: 'approved',
      external_reference: `TEST-${Date.now()}`,
      metadata: {
        test: true,
        source: 'debug-script'
      },
      notification_url: 'https://www.puntolegal.online/api/mercadopago/webhook'
    };
    
    console.log('📋 Datos de prueba:', testData);
    
    const result = await createCheckoutPreference(testData);
    
    console.log('✅ RESULTADO EXITOSO:');
    console.log('Preference ID:', result.preference_id);
    console.log('Init Point:', result.init_point);
    console.log('Sandbox Init Point:', result.sandbox_init_point);
    console.log('Status:', result.status);
    console.log('Live Mode:', result.live_mode);
    
    // Verificar que los campos estén presentes
    if (!result.preference_id) {
      console.error('❌ ERROR: preference_id no está presente');
    }
    
    if (!result.init_point) {
      console.error('❌ ERROR: init_point no está presente');
    }
    
    if (result.preference_id && result.init_point) {
      console.log('✅ TODOS LOS CAMPOS NECESARIOS ESTÁN PRESENTES');
      console.log('🔗 URL de MercadoPago:', result.init_point);
      
      // Opcional: abrir en nueva ventana para probar
      console.log('💡 Para probar, ejecuta: window.open("' + result.init_point + '")');
    }
    
  } catch (error) {
    console.error('❌ ERROR EN PRUEBA:', error);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
  }
}

// 4. Función para verificar conectividad con Supabase
async function testSupabaseConnection() {
  console.log('\n4. VERIFICANDO CONECTIVIDAD CON SUPABASE:');
  
  try {
    const { supabase } = await import('./src/integrations/supabase/client.ts');
    
    const { data, error } = await supabase
      .from('reservas')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Error conectando con Supabase:', error);
    } else {
      console.log('✅ Supabase conectado correctamente');
      console.log('Datos de prueba:', data);
    }
    
  } catch (error) {
    console.error('❌ Error en conexión Supabase:', error);
  }
}

// 5. Función para verificar función de Supabase
async function testSupabaseFunction() {
  console.log('\n5. VERIFICANDO FUNCIÓN DE SUPABASE:');
  
  try {
    const { SUPABASE_CREDENTIALS } = await import('./src/config/supabaseConfig.ts');
    
    console.log('URL de Supabase:', SUPABASE_CREDENTIALS.URL);
    console.log('Project Ref:', SUPABASE_CREDENTIALS.PROJECT_REF);
    
    // Probar OPTIONS request
    const response = await fetch(`${SUPABASE_CREDENTIALS.URL}/functions/v1/create-mercadopago-preference`, {
      method: 'OPTIONS',
      headers: {
        'Authorization': `Bearer ${SUPABASE_CREDENTIALS.PUBLISHABLE_KEY}`
      }
    });
    
    console.log('Status de OPTIONS:', response.status);
    console.log('Headers de respuesta:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Función de Supabase disponible');
    } else {
      console.error('❌ Función de Supabase no disponible');
    }
    
  } catch (error) {
    console.error('❌ Error verificando función Supabase:', error);
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  await testSupabaseConnection();
  await testSupabaseFunction();
  await testMercadoPagoPreference();
  
  console.log('\n🏁 DIAGNÓSTICO COMPLETADO');
  console.log('Revisa los logs anteriores para identificar problemas');
}

// Ejecutar automáticamente
runAllTests();

// Exportar funciones para uso manual
window.debugMercadoPago = {
  testPreference: testMercadoPagoPreference,
  testSupabase: testSupabaseConnection,
  testFunction: testSupabaseFunction,
  runAll: runAllTests
};

console.log('\n💡 FUNCIONES DISPONIBLES:');
console.log('- debugMercadoPago.testPreference() - Probar creación de preferencia');
console.log('- debugMercadoPago.testSupabase() - Probar conexión Supabase');
console.log('- debugMercadoPago.testFunction() - Probar función Supabase');
console.log('- debugMercadoPago.runAll() - Ejecutar todas las pruebas');
