// Script simple para probar la configuración de Make.com
const testData = {
  name: "Juan Pérez",
  email: "juan.perez@ejemplo.com",
  phone: "+56912345678",
  service: "Consultoría Legal Corporativa",
  date: "2025-01-15",
  time: "14:00",
  message: "Necesito asesoría sobre contratos comerciales para mi empresa",
  user_id: "test-user-123",
  source: "website",
  created_at: new Date().toISOString(),
  empresa: {
    nombre: "Punto Legal",
    email: "puntolegalelgolf@gmail.com",
    telefono: "+56962321883",
    website: "https://punto-legal.cl"
  }
};

function testConfiguration() {
  console.log('🧪 Test Suite - Configuración de Make.com');
  console.log('==========================================\n');
  
  // 1. Verificar datos de prueba
  console.log('📋 1. Verificando datos de prueba...');
  console.log('Nombre:', testData.name);
  console.log('Email:', testData.email);
  console.log('Teléfono:', testData.phone);
  console.log('Servicio:', testData.service);
  console.log('Fecha:', testData.date);
  console.log('Hora:', testData.time);
  
  // 2. Verificar estructura del payload
  console.log('\n📋 2. Verificando estructura del payload...');
  const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time', 'source', 'created_at'];
  const missingFields = requiredFields.filter(field => !testData[field]);
  
  if (missingFields.length === 0) {
    console.log('✅ Todos los campos requeridos están presentes');
  } else {
    console.log('❌ Campos faltantes:', missingFields);
  }
  
  // 3. Verificar formato de datos
  console.log('\n📋 3. Verificando formato de datos...');
  
  // Verificar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(testData.email)) {
    console.log('✅ Email válido');
  } else {
    console.log('❌ Email inválido');
  }
  
  // Verificar teléfono
  const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
  if (phoneRegex.test(testData.phone)) {
    console.log('✅ Teléfono válido');
  } else {
    console.log('❌ Teléfono inválido');
  }
  
  // Verificar fecha
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(testData.date)) {
    console.log('✅ Fecha válida');
  } else {
    console.log('❌ Fecha inválida');
  }
  
  // Verificar hora
  const timeRegex = /^\d{2}:\d{2}$/;
  if (timeRegex.test(testData.time)) {
    console.log('✅ Hora válida');
  } else {
    console.log('❌ Hora inválida');
  }
  
  // 4. Mostrar instrucciones
  console.log('\n📋 4. Próximos pasos:');
  console.log('1. Configura el escenario en Make.com siguiendo MAKE_SETUP_GUIDE.md');
  console.log('2. Actualiza la URL del webhook en tu aplicación');
  console.log('3. Ejecuta: node scripts/test-make-webhook.js');
  console.log('4. Verifica que los emails se envíen correctamente');
  console.log('5. Revisa la base de datos para las notificaciones');
  
  console.log('\n🎯 Datos de prueba para Make.com:');
  console.log('================================');
  console.log(JSON.stringify(testData, null, 2));
  
  return testData;
}

// Función para simular envío al webhook
async function simulateWebhookCall(webhookUrl) {
  console.log('\n🚀 Simulando envío al webhook...');
  console.log('📡 URL:', webhookUrl);
  
  if (!webhookUrl || webhookUrl.includes('YOUR_WEBHOOK_ID')) {
    console.log('⚠️  No se puede simular - URL del webhook no configurada');
    console.log('💡 Configura la URL del webhook primero');
    return;
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PuntoLegal-Test/1.0'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📊 Respuesta del webhook:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const responseText = await response.text();
      console.log('✅ Webhook respondió exitosamente!');
      console.log('📄 Respuesta:', responseText);
    } else {
      console.log('❌ Error en el webhook');
      const errorText = await response.text();
      console.log('📄 Error:', errorText);
    }
    
  } catch (error) {
    console.error('💥 Error al simular webhook:', error.message);
  }
}

// Función principal
async function main() {
  const payload = testConfiguration();
  
  // Mostrar instrucciones para configurar el webhook
  console.log('\n🔗 Configuración del Webhook:');
  console.log('============================');
  console.log('1. Ve a https://eu2.make.com');
  console.log('2. Crea un nuevo escenario con Webhook como primer módulo');
  console.log('3. Copia la URL del webhook generada');
  console.log('4. Configura el resto del escenario siguiendo MAKE_SETUP_GUIDE.md');
  console.log('5. Para probar, ejecuta:');
  console.log('   export MAKE_WEBHOOK_URL="tu-url-del-webhook"');
  console.log('   node scripts/test-make-webhook.js');
  
  // Si hay una URL de webhook configurada, preguntar si quiere probarla
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (webhookUrl && !webhookUrl.includes('YOUR_WEBHOOK_ID')) {
    console.log('\n💡 URL del webhook detectada en variables de entorno');
    console.log('Para probar ahora, ejecuta:');
    console.log('node -e "import(\'./scripts/quick-make-test.js\').then(m => m.simulateWebhookCall(process.env.MAKE_WEBHOOK_URL))"');
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testConfiguration, simulateWebhookCall }; 