// Script simple para probar el webhook de Make.com
// Uso: node scripts/test-webhook-simple.cjs

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/qahisda8n5e6bh9my4f9fm6dkgdg71sq';

async function testWebhook() {
  console.log('🧪 Probando webhook de Make.com...');
  console.log('URL:', MAKE_WEBHOOK_URL);
  console.log('Nombre: PuntoLegalWebHook');
  console.log('Clave API: BFj99mgn5NzmF-x\n');
  
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
        'Authorization': 'Bearer BFj99mgn5NzmF-x',
        'X-API-Key': 'BFj99mgn5NzmF-x'
      },
      body: JSON.stringify(testData)
    });

    console.log('\n📥 Respuesta recibida:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    if (response.ok) {
      const responseText = await response.text();
      console.log('✅ Webhook enviado exitosamente');
      console.log('Respuesta:', responseText);
      
      console.log('\n🎉 ¡El webhook está funcionando correctamente!');
      console.log('\n📋 Próximos pasos:');
      console.log('1. Ve a Make.com y verifica que los datos llegaron');
      console.log('2. Configura los módulos de Google Calendar y Gmail');
      console.log('3. Prueba desde la aplicación: http://localhost:8080/agendamiento');
      
    } else {
      console.error('❌ Error en el webhook');
      const errorText = await response.text();
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verifica que la URL del webhook sea correcta');
    console.log('2. Confirma que el webhook esté activo en Make.com');
    console.log('3. Revisa la conexión a internet');
  }
}

// Función para probar diferentes escenarios
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

  // Probar webhook básico
  await testWebhook();

  // Preguntar si quiere probar más escenarios
  console.log('\n¿Quieres probar diferentes escenarios? (s/n)');
  // Por ahora, asumimos que sí
  await testDifferentScenarios();

  console.log('\n🎉 Pruebas completadas');
  console.log('\n📋 Verifica en Make.com:');
  console.log('1. Que los datos lleguen correctamente');
  console.log('2. Que se creen los eventos en Google Calendar');
  console.log('3. Que se envíen los emails');
  console.log('4. Que no haya errores en los logs');
}

// Ejecutar
main().catch(console.error); 