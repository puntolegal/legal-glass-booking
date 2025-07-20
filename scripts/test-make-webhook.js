// Usar fetch nativo (disponible en Node.js 18+)

// URL del webhook (reemplaza con tu URL real)
const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/YOUR_WEBHOOK_ID';

// Datos de prueba
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
    created_at: new Date().toISOString()
};

async function testWebhook() {
    try {
        console.log('🧪 Probando webhook de Make.com...');
        console.log('📡 URL:', WEBHOOK_URL);
        console.log('📋 Datos de prueba:', JSON.stringify(testData, null, 2));
        
        const response = await fetch(WEBHOOK_URL, {
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
        console.error('💥 Error al probar webhook:', error.message);
    }
}

// Función para probar con datos aleatorios
function generateRandomTestData() {
    const names = ["María González", "Carlos Rodríguez", "Ana Silva", "Luis Martínez"];
    const services = [
        "Consultoría Legal Corporativa",
        "Derecho Laboral",
        "Derecho de Familia",
        "Derecho Tributario",
        "Protección de Datos"
    ];
    
    return {
        name: names[Math.floor(Math.random() * names.length)],
        email: `test${Date.now()}@ejemplo.com`,
        phone: `+569${Math.floor(Math.random() * 90000000) + 10000000}`,
        service: services[Math.floor(Math.random() * services.length)],
        date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 12) + 9}:${Math.random() > 0.5 ? '00' : '30'}`,
        message: "Solicitud de prueba generada automáticamente",
        user_id: `test-user-${Date.now()}`,
        source: "test-script",
        created_at: new Date().toISOString()
    };
}

async function testWithRandomData() {
    console.log('🎲 Probando con datos aleatorios...\n');
    
    const randomData = generateRandomTestData();
    console.log('📋 Datos aleatorios:', JSON.stringify(randomData, null, 2));
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'PuntoLegal-Test/1.0'
            },
            body: JSON.stringify(randomData)
        });
        
        console.log('📊 Respuesta:', response.status, response.statusText);
        
        if (response.ok) {
            console.log('✅ Prueba exitosa!');
        } else {
            console.log('❌ Prueba fallida');
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

// Función principal
async function main() {
    console.log('🚀 Test Suite para Webhook de Make.com');
    console.log('=====================================\n');
    
    if (WEBHOOK_URL.includes('YOUR_WEBHOOK_ID')) {
        console.log('⚠️  ADVERTENCIA: URL del webhook no configurada');
        console.log('💡 Configura la variable de entorno MAKE_WEBHOOK_URL');
        console.log('💡 O actualiza la URL en el script\n');
        return;
    }
    
    // Prueba con datos fijos
    await testWebhook();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Prueba con datos aleatorios
    await testWithRandomData();
    
    console.log('\n📝 Próximos pasos:');
    console.log('1. Verifica en Make.com que el escenario se ejecutó');
    console.log('2. Revisa los logs de ejecución');
    console.log('3. Verifica que se enviaron los emails');
    console.log('4. Revisa la base de datos para las notificaciones');
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { testWebhook, testWithRandomData }; 