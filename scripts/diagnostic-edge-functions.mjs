#!/usr/bin/env node

console.log('🔍 Diagnóstico completo de Edge Functions...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testEdgeFunction(functionName, data = {}) {
  console.log(`\n🧪 Probando Edge Function: ${functionName}`);
  console.log(`📡 URL: ${SUPABASE_URL}/functions/v1/${functionName}`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log(`📝 Response:`, responseText);
    
    if (response.status === 200) {
      console.log('✅ Edge Function funcionando correctamente');
    } else if (response.status === 401) {
      console.log('❌ Error de autenticación - JWT inválido');
      console.log('🔧 Posibles soluciones:');
      console.log('   1. Verificar que la Edge Function esté desplegada');
      console.log('   2. Verificar variables de entorno en Supabase');
      console.log('   3. Verificar que el código no tenga errores de sintaxis');
    } else {
      console.log(`❌ Error ${response.status}: ${responseText}`);
    }
    
    return { status: response.status, response: responseText };
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return { status: 'error', response: error.message };
  }
}

async function main() {
  console.log('🚀 Iniciando diagnóstico de Edge Functions...\n');
  
  // Test data for different functions
  const testData = {
    'send-resend-emails': {
      bookingData: {
        id: 'test-reservation-123',
        cliente_nombre: 'Juan Pérez Test',
        cliente_email: 'juan.test@puntolegal.online',
        cliente_telefono: '+56912345678',
        servicio_tipo: 'Consulta Legal',
        servicio_precio: '35000',
        fecha: '2025-01-30',
        hora: '10:00',
        tipo_reunion: 'online',
        descripcion: 'Consulta de prueba',
        pago_metodo: 'MercadoPago',
        pago_estado: 'aprobado',
        created_at: new Date().toISOString()
      }
    },
    'create-mercadopago-preference': {
      paymentData: {
        service: 'Consulta Legal',
        price: 35000.0,
        name: 'Juan Pérez Test',
        email: 'juan.test@puntolegal.online',
        external_reference: 'test-123'
      }
    },
    'mercadopago-webhook': {
      topic: 'payment',
      id: '123456789'
    }
  };

  const functionsToTest = [
    'send-resend-emails',
    'create-mercadopago-preference', 
    'mercadopago-webhook'
  ];

  const results = {};
  
  for (const functionName of functionsToTest) {
    results[functionName] = await testEdgeFunction(
      functionName, 
      testData[functionName] || {}
    );
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
  console.log('┌─────────────────────────────────────┬─────────┬─────────────────┐');
  console.log('│ Edge Function                       │ Estado  │ Detalles        │');
  console.log('├─────────────────────────────────────┼─────────┼─────────────────┤');
  
  for (const [functionName, result] of Object.entries(results)) {
    const status = result.status === 200 ? '✅ OK' : 
                   result.status === 401 ? '❌ JWT' : 
                   result.status === 'error' ? '❌ Error' : 
                   `❌ ${result.status}`;
    
    const details = result.status === 200 ? 'Funcionando' :
                   result.status === 401 ? 'JWT inválido' :
                   result.status === 'error' ? 'Error conexión' :
                   `Error ${result.status}`;
    
    console.log(`│ ${functionName.padEnd(35)} │ ${status.padEnd(7)} │ ${details.padEnd(15)} │`);
  }
  
  console.log('└─────────────────────────────────────┴─────────┴─────────────────┘');
  
  console.log('\n🔧 ACCIONES RECOMENDADAS:');
  
  const failedFunctions = Object.entries(results).filter(([_, result]) => result.status !== 200);
  
  if (failedFunctions.length === 0) {
    console.log('✅ Todas las Edge Functions están funcionando correctamente');
  } else {
    console.log('❌ Se encontraron problemas con las siguientes Edge Functions:');
    failedFunctions.forEach(([functionName, result]) => {
      console.log(`   • ${functionName}: ${result.status === 401 ? 'Error de autenticación' : 'Error de conexión'}`);
    });
    
    console.log('\n🛠️ SOLUCIONES:');
    console.log('1. Verificar que todas las Edge Functions estén desplegadas en Supabase');
    console.log('2. Verificar que las variables de entorno estén configuradas:');
    console.log('   • RESEND_API_KEY');
    console.log('   • MERCADOPAGO_ACCESS_TOKEN');
    console.log('   • MAIL_FROM');
    console.log('   • ADMIN_EMAIL');
    console.log('3. Verificar que el código no tenga errores de sintaxis');
    console.log('4. Re-desplegar las Edge Functions si es necesario');
  }
  
  console.log('\n✨ Diagnóstico completado');
}

main().catch(console.error);
