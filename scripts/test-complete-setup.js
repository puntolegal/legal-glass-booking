import { NOTIFICATION_CONFIG, generateMakePayload } from '../src/config/notifications.ts';

// Datos de prueba
const testReservation = {
  id: 'test-123',
  nombre: 'María González',
  email: 'maria.gonzalez@ejemplo.com',
  telefono: '+56987654321',
  servicio: 'Consultoría Legal Corporativa',
  fecha: '2025-01-20',
  hora: '15:30',
  descripcion: 'Necesito asesoría sobre contratos comerciales para mi empresa',
  user_id: 'user-456'
};

// Datos de Google (opcional)
const testGoogleData = {
  meet_link: 'https://meet.google.com/abc-defg-hij',
  calendar_event_id: 'event_123456'
};

// Datos de pago (opcional)
const testPagoData = {
  numero_comprobante: 'COMP-2025-001',
  monto: '150000',
  metodo: 'transferencia',
  estado: 'pagado'
};

function testConfiguration() {
  console.log('🧪 Test Suite - Configuración de Make.com');
  console.log('==========================================\n');
  
  // 1. Verificar configuración
  console.log('📋 1. Verificando configuración...');
  console.log('URL del webhook:', NOTIFICATION_CONFIG.makeWebhookUrl);
  console.log('Email de la empresa:', NOTIFICATION_CONFIG.empresa.email);
  console.log('Teléfono:', NOTIFICATION_CONFIG.empresa.telefono);
  console.log('Website:', NOTIFICATION_CONFIG.empresa.website);
  
  if (NOTIFICATION_CONFIG.makeWebhookUrl.includes('YOUR_WEBHOOK_ID')) {
    console.log('⚠️  ADVERTENCIA: URL del webhook no configurada\n');
  } else {
    console.log('✅ URL del webhook configurada\n');
  }
  
  // 2. Generar payload de prueba
  console.log('📋 2. Generando payload de prueba...');
  const payload = generateMakePayload(testReservation, 'website', testGoogleData, testPagoData);
  console.log('Payload generado:', JSON.stringify(payload, null, 2));
  
  // 3. Verificar estructura del payload
  console.log('\n📋 3. Verificando estructura del payload...');
  const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time', 'source', 'created_at'];
  const missingFields = requiredFields.filter(field => !payload[field]);
  
  if (missingFields.length === 0) {
    console.log('✅ Todos los campos requeridos están presentes');
  } else {
    console.log('❌ Campos faltantes:', missingFields);
  }
  
  // 4. Verificar formato de datos
  console.log('\n📋 4. Verificando formato de datos...');
  
  // Verificar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(payload.email)) {
    console.log('✅ Email válido');
  } else {
    console.log('❌ Email inválido');
  }
  
  // Verificar teléfono
  const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
  if (phoneRegex.test(payload.phone)) {
    console.log('✅ Teléfono válido');
  } else {
    console.log('❌ Teléfono inválido');
  }
  
  // Verificar fecha
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(payload.date)) {
    console.log('✅ Fecha válida');
  } else {
    console.log('❌ Fecha inválida');
  }
  
  // Verificar hora
  const timeRegex = /^\d{2}:\d{2}$/;
  if (timeRegex.test(payload.time)) {
    console.log('✅ Hora válida');
  } else {
    console.log('❌ Hora inválida');
  }
  
  // 5. Mostrar instrucciones
  console.log('\n📋 5. Próximos pasos:');
  console.log('1. Configura el escenario en Make.com siguiendo MAKE_SETUP_GUIDE.md');
  console.log('2. Actualiza la URL del webhook en tu aplicación');
  console.log('3. Ejecuta: node scripts/test-make-webhook.js');
  console.log('4. Verifica que los emails se envíen correctamente');
  console.log('5. Revisa la base de datos para las notificaciones');
  
  console.log('\n🎯 Datos de prueba para Make.com:');
  console.log('================================');
  console.log(JSON.stringify(payload, null, 2));
  
  return payload;
}

// Función para simular envío al webhook
async function simulateWebhookCall(payload) {
  console.log('\n🚀 Simulando envío al webhook...');
  
  if (NOTIFICATION_CONFIG.makeWebhookUrl.includes('YOUR_WEBHOOK_ID')) {
    console.log('⚠️  No se puede simular - URL del webhook no configurada');
    return;
  }
  
  try {
    const response = await fetch(NOTIFICATION_CONFIG.makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PuntoLegal-Test/1.0'
      },
      body: JSON.stringify(payload)
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
  
  // Preguntar si quiere simular el webhook
  console.log('\n❓ ¿Quieres simular el envío al webhook? (s/n)');
  
  // En un entorno real, aquí se pediría input del usuario
  // Por ahora, solo mostramos la información
  console.log('💡 Para simular el webhook, ejecuta:');
  console.log('node scripts/test-make-webhook.js');
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testConfiguration, simulateWebhookCall }; 