// Test para verificar la creación de preferencia y detectar problemas
console.log('🧪 TEST CREACIÓN DE PREFERENCIA MERCADOPAGO');
console.log('==========================================');

// Simular los datos que se envían desde el frontend
const testPaymentData = {
  service: 'Punto Legal Familia',
  description: 'Consulta legal especializada',
  price: 30000,
  name: 'Cliente Test',
  email: 'test@example.com',
  phone: '912345678',
  date: new Date().toISOString().split('T')[0],
  time: '10:00',
  external_reference: `PL-TEST-${Date.now()}`
};

console.log('\n📋 DATOS DE ENTRADA:');
console.log('===================');
console.log(JSON.stringify(testPaymentData, null, 2));

// Simular la estructura que crea el backend
const preferenceData = {
  items: [
    {
      title: `${testPaymentData.service} - Punto Legal`,
      description: testPaymentData.description || `Consulta legal agendada para ${testPaymentData.date} a las ${testPaymentData.time}`,
      quantity: 1,
      unit_price: parseFloat(testPaymentData.price),
      currency_id: 'CLP'
    }
  ],
  payer: {
    name: testPaymentData.name,
    email: testPaymentData.email,
    phone: {
      number: testPaymentData.phone
    }
  },
  back_urls: {
    success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
    failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
    pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
  },
  external_reference: testPaymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  notification_url: `https://www.puntolegal.online/api/mercadopago/webhook`,
  metadata: {
    client_name: testPaymentData.name,
    client_email: testPaymentData.email,
    service_type: testPaymentData.service,
    appointment_date: testPaymentData.date,
    appointment_time: testPaymentData.time,
    source: 'punto-legal-web',
    integration_type: 'checkout_pro_official'
  },
  statement_descriptor: 'PUNTO LEGAL'
};

console.log('\n📤 PREFERENCIA GENERADA:');
console.log('========================');
console.log(JSON.stringify(preferenceData, null, 2));

console.log('\n🔍 VALIDACIÓN DE CAMPOS:');
console.log('=======================');

// Validar items
console.log('📦 ITEMS:');
preferenceData.items.forEach((item, index) => {
  console.log(`  Item ${index + 1}:`);
  console.log(`    ✅ title: "${item.title}" (${item.title ? 'OK' : 'VACÍO'})`);
  console.log(`    ✅ description: "${item.description}" (${item.description ? 'OK' : 'VACÍO'})`);
  console.log(`    ✅ quantity: ${item.quantity} (${item.quantity === 1 ? 'OK' : 'PROBLEMA'})`);
  console.log(`    ✅ unit_price: ${item.unit_price} (${item.unit_price > 0 ? 'OK' : 'PROBLEMA'})`);
  console.log(`    ✅ currency_id: "${item.currency_id}" (${item.currency_id === 'CLP' ? 'OK' : 'PROBLEMA'})`);
});

// Validar payer
console.log('\n👤 PAYER:');
console.log(`  ✅ name: "${preferenceData.payer.name}" (${preferenceData.payer.name ? 'OK' : 'VACÍO'})`);
console.log(`  ✅ email: "${preferenceData.payer.email}" (${preferenceData.payer.email.includes('@') ? 'OK' : 'INVÁLIDO'})`);
console.log(`  ✅ phone: "${preferenceData.payer.phone.number}" (${preferenceData.payer.phone.number ? 'OK' : 'VACÍO'})`);

// Validar back_urls
console.log('\n🔗 BACK_URLS:');
Object.entries(preferenceData.back_urls).forEach(([key, url]) => {
  const isHttps = url.startsWith('https://');
  const isPublic = !url.includes('localhost') && !url.includes('127.0.0.1');
  console.log(`  ✅ ${key}: "${url}" (HTTPS: ${isHttps ? 'OK' : 'PROBLEMA'}, Público: ${isPublic ? 'OK' : 'PROBLEMA'})`);
});

// Validar external_reference
console.log('\n🔖 EXTERNAL_REFERENCE:');
console.log(`  ✅ external_reference: "${preferenceData.external_reference}" (${preferenceData.external_reference ? 'OK' : 'VACÍO'})`);

// Validar notification_url
console.log('\n🔔 NOTIFICATION_URL:');
const isHttps = preferenceData.notification_url.startsWith('https://');
const isPublic = !preferenceData.notification_url.includes('localhost');
console.log(`  ✅ notification_url: "${preferenceData.notification_url}" (HTTPS: ${isHttps ? 'OK' : 'PROBLEMA'}, Público: ${isPublic ? 'OK' : 'PROBLEMA'})`);

// Validar metadata
console.log('\n📊 METADATA:');
Object.entries(preferenceData.metadata).forEach(([key, value]) => {
  const hasValue = value !== null && value !== undefined && value !== '';
  console.log(`  ✅ ${key}: "${value}" (${hasValue ? 'OK' : 'PROBLEMA'})`);
});

console.log('\n🎯 POSIBLES PROBLEMAS DETECTADOS:');
console.log('=================================');

const problems = [];

// Verificar problemas comunes
if (preferenceData.items[0].unit_price <= 0) {
  problems.push('❌ unit_price es 0 o negativo');
}

if (preferenceData.items[0].currency_id !== 'CLP') {
  problems.push('❌ currency_id no es CLP');
}

if (!preferenceData.payer.email.includes('@')) {
  problems.push('❌ email no tiene formato válido');
}

if (!preferenceData.external_reference) {
  problems.push('❌ external_reference está vacío');
}

if (problems.length === 0) {
  console.log('✅ No se detectaron problemas obvios en la preferencia');
} else {
  problems.forEach(problem => console.log(problem));
}

console.log('\n🚀 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. Verificar que el token de MercadoPago sea válido');
console.log('2. Probar crear esta preferencia con curl/Postman');
console.log('3. Verificar logs del backend en tiempo real');
console.log('4. Probar en navegador limpio/incógnito');
console.log('5. Verificar que no haya adblockers');

console.log('\n📋 COMANDO CURL PARA PROBAR:');
console.log('============================');
console.log('curl -X POST https://api.mercadopago.com/checkout/preferences \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer TU_ACCESS_TOKEN" \\');
console.log('  -d \'[PREFERENCIA_JSON]\'');
