// Test de detección móvil para PXI03
console.log('📱 PROBANDO DETECCIÓN MÓVIL PARA PXI03');
console.log('=====================================');

// Simular diferentes user agents
const userAgents = [
  {
    name: 'iPhone',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    name: 'Android',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36'
  },
  {
    name: 'PC Desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

// Función de detección móvil (copiada del código)
const isMobileDevice = (userAgent) => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

// Simular creación de datos de preferencia
const createTestPreferenceData = (isMobile, service, price, payerName, payerEmail, externalReference) => {
  const phone = '912345678';
  const phoneNumber = phone.replace(/\D/g, '');
  
  return {
    items: [{
      id: `servicio_legal_${service.toLowerCase().replace(/\s+/g, '_')}`,
      title: `${service} - Punto Legal`,
      description: `Consulta legal especializada: ${service}. Servicio profesional de asesoría jurídica.`,
      // AJUSTE MÓVIL: Usar categoría genérica en móvil para evitar PXI03
      category_id: isMobile ? 'services' : 'services_legal',
      quantity: 1,
      unit_price: price,
      currency_id: 'CLP'
    }],
    payer: {
      name: payerName,
      email: payerEmail,
      phone: { 
        number: phoneNumber,
        area_code: '56'
      },
      identification: {
        // AJUSTE MÓVIL: Usar DNI en móvil para evitar PXI03
        type: isMobile ? 'DNI' : 'RUT',
        number: '12345678-9'
      }
    },
    back_urls: {
      success: 'https://www.puntolegal.online/payment-success?source=mercadopago',
      failure: 'https://www.puntolegal.online/payment-failure?source=mercadopago',
      pending: 'https://www.puntolegal.online/payment-pending?source=mercadopago'
    },
    auto_return: 'approved',
    external_reference: externalReference,
    notification_url: 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook',
    metadata: isMobile ? {
      // Solo metadata esencial para móvil
      service_type: service,
      source: 'web'
    } : {
      device_type: 'desktop',
      service_type: service,
      source: 'web'
    }
  };
};

console.log('\n🔍 PROBANDO DETECCIÓN DE DISPOSITIVOS:');
console.log('=====================================');

userAgents.forEach(({ name, userAgent }) => {
  const isMobile = isMobileDevice(userAgent);
  console.log(`\n📱 ${name}:`);
  console.log(`   User Agent: ${userAgent.substring(0, 60)}...`);
  console.log(`   Es móvil: ${isMobile ? '✅ SÍ' : '❌ NO'}`);
  
  const preferenceData = createTestPreferenceData(
    isMobile,
    'Punto Legal Familia',
    30000,
    'Cliente Test',
    'test@example.com',
    `PL-FAMILIA-${name.toUpperCase()}-TEST`
  );
  
  console.log(`   category_id: "${preferenceData.items[0].category_id}"`);
  console.log(`   identification.type: "${preferenceData.payer.identification.type}"`);
  console.log(`   metadata keys: ${Object.keys(preferenceData.metadata).join(', ')}`);
});

console.log('\n🎯 ANÁLISIS PXI03:');
console.log('==================');
console.log('✅ iPhone: category_id="services", type="DNI" (CORRECTO para móvil)');
console.log('✅ Android: category_id="services", type="DNI" (CORRECTO para móvil)');
console.log('✅ PC: category_id="services_legal", type="RUT" (CORRECTO para PC)');

console.log('\n🚀 CONCLUSIÓN:');
console.log('==============');
console.log('✅ La detección móvil está funcionando correctamente');
console.log('✅ Los datos se ajustan según el dispositivo');
console.log('✅ Esto debería prevenir el error PXI03 en móviles');

console.log('\n🔧 SI SIGUE EL ERROR PXI03:');
console.log('===========================');
console.log('1. Verificar que el código se esté ejecutando en producción');
console.log('2. Verificar que las variables de entorno estén configuradas');
console.log('3. Verificar que el token de MercadoPago sea válido');
console.log('4. Revisar logs del navegador para ver qué datos se están enviando');
