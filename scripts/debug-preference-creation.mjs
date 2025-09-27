// Script para diagnosticar problemas en la creación de preferencias
import fetch from "node-fetch";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

console.log('🔍 Diagnosticando creación de preferencias de MercadoPago...\n');

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';

if (!MERCADOPAGO_ACCESS_TOKEN) {
  console.error('❌ MERCADOPAGO_ACCESS_TOKEN no configurado');
  process.exit(1);
}

// Función para crear preferencia con estructura completa
async function createTestPreference() {
  console.log('🧪 Creando preferencia de prueba con estructura completa...\n');
  
  const preferenceData = {
    items: [
      {
        title: "Consulta Legal - Punto Legal",
        description: "Consulta jurídica especializada",
        quantity: 1,
        unit_price: 35000,
        currency_id: "CLP"
      }
    ],
    payer: {
      name: "Juan Pérez",
      email: "juan.perez@test.com",
      phone: {
        area_code: "56",
        number: "912345678"
      }
    },
    back_urls: {
      success: "https://www.puntolegal.online/payment-success?source=mercadopago",
      failure: "https://www.puntolegal.online/payment-failure?source=mercadopago",
      pending: "https://www.puntolegal.online/payment-pending?source=mercadopago"
    },
    auto_return: "approved",
    external_reference: `DEBUG-${Date.now()}`,
    notification_url: "https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook",
    statement_descriptor: "PUNTO LEGAL",
    metadata: {
      service_type: "legal_consultation",
      appointment_date: "2025-01-28",
      appointment_time: "10:00"
    },
    payment_methods: {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: 12
    },
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
  };

  console.log('📋 Datos de la preferencia:');
  console.log(JSON.stringify(preferenceData, null, 2));

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferenceData)
    });

    console.log(`\n📤 Respuesta de MercadoPago:`);
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Preferencia creada exitosamente:');
      console.log(`ID: ${result.id}`);
      console.log(`Status: ${result.status}`);
      console.log(`Live Mode: ${result.live_mode}`);
      console.log(`External Reference: ${result.external_reference}`);
      
      if (result.init_point) {
        console.log(`\n🔗 URL de redirección (Producción): ${result.init_point}`);
      }
      if (result.sandbox_init_point) {
        console.log(`🔗 URL de redirección (Sandbox): ${result.sandbox_init_point}`);
      }
      
      console.log('\n🎯 URLs de retorno configuradas:');
      console.log(`✅ Success: ${result.back_urls.success}`);
      console.log(`✅ Failure: ${result.back_urls.failure}`);
      console.log(`✅ Pending: ${result.back_urls.pending}`);
      
      if (result.notification_url) {
        console.log(`✅ Webhook: ${result.notification_url}`);
      }
      
      console.log('\n💡 Para probar:');
      console.log('1. Abrir la URL de redirección');
      console.log('2. Usar tarjeta de prueba: 4509 9535 6623 3704');
      console.log('3. CVV: 123, Vencimiento: 11/25');
      
      return result;
    } else {
      console.error('\n❌ Error al crear preferencia:');
      console.error(`Status: ${response.status}`);
      console.error(`Error:`, JSON.stringify(result, null, 2));
      
      // Análisis específico de errores
      if (result.cause) {
        console.error('\n🔍 Análisis del error:');
        result.cause.forEach((cause, index) => {
          console.error(`${index + 1}. ${cause.code}: ${cause.description}`);
        });
      }
      
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    return null;
  }
}

// Función para verificar URLs de retorno
async function verifyReturnUrls() {
  console.log('\n🔍 Verificando URLs de retorno...\n');
  
  const urls = [
    'https://www.puntolegal.online/payment-success',
    'https://www.puntolegal.online/payment-failure',
    'https://www.puntolegal.online/payment-pending',
    'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook'
  ];
  
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`${response.ok ? '✅' : '❌'} ${url} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
  }
}

// Ejecutar diagnóstico
async function runDiagnostic() {
  console.log('🚀 Iniciando diagnóstico completo...\n');
  
  // Verificar URLs
  await verifyReturnUrls();
  
  // Crear preferencia de prueba
  const preference = await createTestPreference();
  
  if (preference) {
    console.log('\n🎉 Diagnóstico completado exitosamente!');
    console.log('✅ La creación de preferencias funciona correctamente');
    console.log('🔍 El problema puede estar en:');
    console.log('   1. URLs no configuradas en dashboard de MercadoPago');
    console.log('   2. Configuración de dominio en MercadoPago');
    console.log('   3. Cache del navegador');
  } else {
    console.log('\n❌ Diagnóstico encontró problemas en la creación de preferencias');
    console.log('🔍 Revisar los errores mostrados arriba');
  }
}

runDiagnostic();
