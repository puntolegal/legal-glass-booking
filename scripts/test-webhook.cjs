// Script para probar el webhook de Make.com
// Uso: node scripts/test-webhook.js

require('dotenv').config();

const MAKE_WEBHOOK_URL = process.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.us2.make.com/qahisda8n5e6bh9my4f9fm6dkgdg71sq';

async function testWebhook() {
  console.log('🧪 Probando webhook de Make.com...');
  console.log('URL:', MAKE_WEBHOOK_URL);
  
  if (MAKE_WEBHOOK_URL === 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID') {
    console.error('❌ Error: URL del webhook no configurada');
    console.log('💡 Actualiza VITE_MAKE_WEBHOOK_URL en tu archivo .env');
    return;
  }

  // Datos de prueba
  const testData = {
    cliente: {
      nombre: "Juan Pérez",
      email: "juan.perez@test.com",
      telefono: "+56912345678"
    },
    servicio: {
      nombre: "Consulta Laboral",
      precio: 50000,
      duracion: 60
    },
    cita: {
      fecha: "2025-01-15",
      hora: "14:00",
      notas: "Consulta sobre despido injustificado"
    }
  };

  try {
    console.log('📤 Enviando datos de prueba...');
    console.log('Datos:', JSON.stringify(testData, null, 2));

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Respuesta recibida:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    if (response.ok) {
      const responseText = await response.text();
      console.log('✅ Webhook enviado exitosamente');
      console.log('Respuesta:', responseText);
    } else {
      console.error('❌ Error en el webhook');
      const errorText = await response.text();
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// Función para probar diferentes tipos de datos
async function testDifferentScenarios() {
  console.log('\n🔄 Probando diferentes escenarios...\n');

  const scenarios = [
    {
      name: "Consulta Gratuita",
      data: {
        cliente: {
          nombre: "María González",
          email: "maria@test.com",
          telefono: "+56987654321"
        },
        servicio: {
          nombre: "Consulta Gratuita",
          precio: 0,
          duracion: 30
        },
        cita: {
          fecha: "2025-01-16",
          hora: "10:00",
          notas: "Primera consulta gratuita"
        }
      }
    },
    {
      name: "Consulta Corporativa",
      data: {
        cliente: {
          nombre: "Empresa ABC Ltda.",
          email: "legal@empresaabc.cl",
          telefono: "+56223456789"
        },
        servicio: {
          nombre: "Asesoría Corporativa",
          precio: 150000,
          duracion: 90
        },
        cita: {
          fecha: "2025-01-17",
          hora: "15:30",
          notas: "Revisión de contratos comerciales"
        }
      }
    },
    {
      name: "Consulta Familiar",
      data: {
        cliente: {
          nombre: "Ana Rodríguez",
          email: "ana.rodriguez@test.com",
          telefono: "+56911223344"
        },
        servicio: {
          nombre: "Derecho de Familia",
          precio: 75000,
          duracion: 60
        },
        cita: {
          fecha: "2025-01-18",
          hora: "11:00",
          notas: "Divorcio de mutuo acuerdo"
        }
      }
    }
  ];

  for (const scenario of scenarios) {
    console.log(`📋 Probando: ${scenario.name}`);
    
    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenario.data)
      });

      if (response.ok) {
        console.log(`✅ ${scenario.name}: Exitoso`);
      } else {
        console.log(`❌ ${scenario.name}: Error ${response.status}`);
      }

      // Esperar 2 segundos entre pruebas
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.log(`❌ ${scenario.name}: Error de conexión`);
    }
  }
}

// Función principal
async function main() {
  console.log('🏢 Test de Webhook - Punto Legal');
  console.log('================================\n');

  // Verificar configuración
  if (!MAKE_WEBHOOK_URL || MAKE_WEBHOOK_URL === 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID') {
    console.error('❌ Error: Webhook URL no configurada');
    console.log('\n📝 Para configurar:');
    console.log('1. Ve a Make.com y crea un webhook');
    console.log('2. Copia la URL del webhook');
    console.log('3. Agrega VITE_MAKE_WEBHOOK_URL=tu_url en tu archivo .env');
    console.log('4. Ejecuta este script nuevamente');
    return;
  }

  // Probar webhook básico
  await testWebhook();

  // Preguntar si quiere probar más escenarios
  console.log('\n¿Quieres probar diferentes escenarios? (s/n)');
  // En un entorno real, aquí usarías readline para input
  // Por ahora, asumimos que sí
  await testDifferentScenarios();

  console.log('\n🎉 Pruebas completadas');
  console.log('\n📋 Verifica en Make.com:');
  console.log('1. Que los datos lleguen correctamente');
  console.log('2. Que se creen los eventos en Google Calendar');
  console.log('3. Que se envíen los emails');
  console.log('4. Que no haya errores en los logs');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testWebhook, testDifferentScenarios }; 