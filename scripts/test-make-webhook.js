/**
 * Script para probar el webhook de Make.com
 * Ejecutar: node scripts/test-make-webhook.js
 */

const testData = {
  cliente: {
    nombre: "Juan Pérez",
    email: "juan@ejemplo.com",
    telefono: "+56 9 1234 5678"
  },
  servicio: {
    tipo: "Consulta Laboral",
    precio: "30000",
    fecha: "2024-01-15",
    hora: "10:00"
  },
  pago: {
    metodo: "MercadoPago",
    estado: "Aprobado",
    fecha_pago: "2024-01-10T10:30:00Z"
  },
  reserva: {
    id: "12345",
    tracking_code: "PL-ABC123",
    google_meet_link: "https://meet.google.com/abc-def-ghi"
  },
  emails: {
    cliente: {
      to: "juan@ejemplo.com",
      subject: "✅ Confirmación de Consulta Legal - PL-ABC123",
      template: "booking_confirmation_client"
    },
    admin: {
      to: "puntolegalelgolf@gmail.com",
      subject: "📋 Nueva Consulta Legal - PL-ABC123",
      template: "booking_confirmation_admin"
    }
  },
  calendar: {
    title: "Consulta Legal - Juan Pérez",
    description: "Consulta de Consulta Laboral con Juan Pérez",
    start_date: "2024-01-15T10:00:00",
    duration_minutes: 45,
    google_meet_link: "https://meet.google.com/abc-def-ghi",
    attendees: ["juan@ejemplo.com", "puntolegalelgolf@gmail.com"]
  }
};

async function testMakeWebhook() {
  try {
    console.log('🧪 PROBANDO WEBHOOK DE MAKE.COM\n');
    
    // URL del webhook (reemplazar con tu URL real)
    const webhookUrl = 'https://hook.us2.make.com/your-webhook-url-here';
    
    console.log('📤 Enviando datos de prueba...');
    console.log('📋 Datos:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\n📊 RESULTADO:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Respuesta exitosa:');
      console.log(JSON.stringify(result, null, 2));
      
      console.log('\n🎯 VERIFICAR:');
      console.log('1. Email enviado a:', testData.cliente.email);
      console.log('2. Email enviado a:', testData.emails.admin.to);
      console.log('3. Evento creado en Google Calendar');
      console.log('4. Código de seguimiento:', testData.reserva.tracking_code);
      
    } else {
      console.log('❌ Error en la respuesta');
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error probando webhook:', error.message);
    console.log('\n🔧 SOLUCIONES:');
    console.log('1. Verificar que la URL del webhook sea correcta');
    console.log('2. Confirmar que Make.com esté activo');
    console.log('3. Revisar configuración de módulos');
    console.log('4. Probar con datos más simples');
  }
}

// Ejecutar prueba
testMakeWebhook();