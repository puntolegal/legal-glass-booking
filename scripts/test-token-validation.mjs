// Test para verificar si el token de MercadoPago es válido
console.log('🔑 TEST VALIDACIÓN TOKEN MERCADOPAGO');
console.log('====================================');

// Función para probar el token
async function testToken(token) {
  try {
    console.log(`🔍 Probando token: ${token.substring(0, 20)}...`);
    
    // Probar con una preferencia mínima
    const minimalPreference = {
      items: [
        {
          title: "Test Punto Legal",
          quantity: 1,
          unit_price: 1000,
          currency_id: "CLP"
        }
      ],
      payer: {
        email: "test@example.com"
      },
      back_urls: {
        success: "https://www.puntolegal.online/payment-success",
        failure: "https://www.puntolegal.online/payment-failure",
        pending: "https://www.puntolegal.online/payment-pending"
      },
      external_reference: `TEST-${Date.now()}`
    };

    console.log('📤 Creando preferencia de prueba...');
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(minimalPreference)
    });

    console.log(`📊 Respuesta: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Token válido - Preferencia creada exitosamente');
      console.log(`📋 ID de preferencia: ${result.id}`);
      console.log(`🔗 init_point: ${result.init_point ? 'Disponible' : 'No disponible'}`);
      console.log(`🔗 sandbox_init_point: ${result.sandbox_init_point ? 'Disponible' : 'No disponible'}`);
      console.log(`🔍 Modo: ${result.live_mode ? 'Producción' : 'Sandbox'}`);
      
      return {
        valid: true,
        preference_id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        live_mode: result.live_mode
      };
    } else {
      const errorText = await response.text();
      console.log('❌ Token inválido o error');
      console.log(`📋 Error: ${errorText}`);
      
      return {
        valid: false,
        error: errorText,
        status: response.status
      };
    }
  } catch (error) {
    console.log('❌ Error de red o conexión');
    console.log(`📋 Error: ${error.message}`);
    
    return {
      valid: false,
      error: error.message
    };
  }
}

// Simular diferentes tokens para probar
const testTokens = [
  'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947', // Token del código
  // Agregar más tokens si es necesario
];

console.log('\n🧪 PROBANDO TOKENS:');
console.log('===================');

for (const token of testTokens) {
  console.log(`\n--- Probando token ---`);
  const result = await testToken(token);
  
  if (result.valid) {
    console.log('✅ TOKEN VÁLIDO');
    console.log(`   Ambiente: ${result.live_mode ? 'PRODUCCIÓN' : 'SANDBOX'}`);
    console.log(`   init_point disponible: ${!!result.init_point}`);
    console.log(`   sandbox_init_point disponible: ${!!result.sandbox_init_point}`);
  } else {
    console.log('❌ TOKEN INVÁLIDO');
    console.log(`   Error: ${result.error}`);
    console.log(`   Status: ${result.status || 'N/A'}`);
  }
}

console.log('\n🎯 ANÁLISIS DE RESULTADOS:');
console.log('==========================');
console.log('Si el token es válido pero sigue PXI03:');
console.log('1. ✅ Token OK - El problema no es credenciales');
console.log('2. 🔍 Verificar navegador/dispositivo específico');
console.log('3. 🔍 Verificar red/firewall');
console.log('4. 🔍 Verificar adblockers/extensions');
console.log('5. 🔍 Verificar WebView vs navegador real');

console.log('\nSi el token es inválido:');
console.log('1. ❌ Token expirado o incorrecto');
console.log('2. 🔧 Actualizar token en variables de entorno');
console.log('3. 🔧 Verificar que sea del ambiente correcto');

console.log('\n📋 INFORMACIÓN ADICIONAL:');
console.log('=========================');
console.log('- ¿El PXI03 ocurre en todos los dispositivos?');
console.log('- ¿Ocurre solo en móvil o también en desktop?');
console.log('- ¿Ocurre en navegador limpio/incógnito?');
console.log('- ¿Hay algún patrón específico (hora, red, etc.)?');

console.log('\n🚀 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. Ejecutar este test para verificar tokens');
console.log('2. Si token OK, probar en dispositivo diferente');
console.log('3. Si token OK, probar en navegador limpio');
console.log('4. Si token OK, verificar logs del backend en tiempo real');
console.log('5. Considerar crear preferencia mínima para aislar problema');
