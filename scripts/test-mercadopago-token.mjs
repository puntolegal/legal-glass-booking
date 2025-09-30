// Test del token de MercadoPago para verificar PXI03
console.log('🔑 VERIFICANDO TOKEN MERCADOPAGO PARA PXI03');
console.log('==========================================');

// Token hardcoded del código
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947';

// Datos de prueba para móvil (que causan PXI03)
const testPreferenceData = {
  items: [{
    id: 'servicio_legal_familia_mobile',
    title: 'Punto Legal Familia - Punto Legal',
    description: 'Consulta legal especializada: Punto Legal Familia. Servicio profesional de asesoría jurídica.',
    category_id: 'services', // ✅ CORRECTO para móvil
    quantity: 1,
    unit_price: 30000,
    currency_id: 'CLP'
  }],
  payer: {
    name: 'Cliente Test Móvil',
    first_name: 'Cliente',
    last_name: 'Test Móvil',
    email: 'test@example.com',
    phone: {
      number: '912345678',
      area_code: '56'
    },
    identification: {
      type: 'DNI', // ✅ CORRECTO para móvil
      number: '12345678-9'
    }
  },
  back_urls: {
    success: 'https://www.puntolegal.online/payment-success?source=mercadopago',
    failure: 'https://www.puntolegal.online/payment-failure?source=mercadopago',
    pending: 'https://www.puntolegal.online/payment-pending?source=mercadopago'
  },
  auto_return: 'approved',
  external_reference: `PL-FAMILIA-MOBILE-TEST-${Date.now()}`,
  notification_url: 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook',
  metadata: {
    service_type: 'Punto Legal Familia',
    source: 'web',
    device_type: 'mobile'
  }
};

console.log('🔍 Token de MercadoPago:', MERCADOPAGO_ACCESS_TOKEN.substring(0, 20) + '...');
console.log('📋 Datos de prueba (móvil):');
console.log('  - category_id:', testPreferenceData.items[0].category_id);
console.log('  - identification.type:', testPreferenceData.payer.identification.type);
console.log('  - metadata keys:', Object.keys(testPreferenceData.metadata).join(', '));

console.log('\n🚀 PROBANDO CREACIÓN DE PREFERENCIA...');
console.log('=====================================');

// Probar la API de MercadoPago
fetch('https://api.mercadopago.com/checkout/preferences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
  },
  body: JSON.stringify(testPreferenceData)
})
.then(response => {
  console.log('📤 Respuesta de MercadoPago:', response.status, response.statusText);
  
  if (!response.ok) {
    return response.text().then(errorText => {
      console.error('❌ Error API MercadoPago:', response.status, errorText);
      
      if (errorText.includes('PXI03') || errorText.includes('PXI')) {
        console.error('🚨 ERROR PXI03 DETECTADO:', errorText);
        console.error('📋 Datos que causaron el error:', JSON.stringify(testPreferenceData, null, 2));
      }
      
      throw new Error(`Error ${response.status}: ${errorText}`);
    });
  }
  
  return response.json();
})
.then(result => {
  console.log('✅ Preferencia creada exitosamente!');
  console.log('🔍 ID de preferencia:', result.id);
  console.log('🔗 Init Point:', result.init_point);
  console.log('🔍 Status:', result.status);
  console.log('🔍 Modo:', result.live_mode ? 'Producción' : 'Sandbox');
  
  console.log('\n🎉 ¡SOLUCIÓN PXI03 FUNCIONANDO!');
  console.log('===============================');
  console.log('✅ Token válido');
  console.log('✅ Datos móviles correctos');
  console.log('✅ Preferencia creada sin PXI03');
})
.catch(error => {
  console.error('❌ Error en la prueba:', error.message);
  
  console.log('\n🔧 POSIBLES SOLUCIONES:');
  console.log('=======================');
  console.log('1. Verificar que el token sea válido');
  console.log('2. Verificar que la cuenta de MercadoPago esté activa');
  console.log('3. Verificar que no haya restricciones en la cuenta');
  console.log('4. Contactar soporte de MercadoPago si persiste');
});
