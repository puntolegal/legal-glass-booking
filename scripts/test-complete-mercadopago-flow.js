#!/usr/bin/env node

/**
 * Script para probar el flujo completo de MercadoPago
 * Verifica que el backend esté funcionando y que se puedan crear preferencias
 */

// Usar fetch nativo de Node.js (disponible desde v18)

const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:8081';

async function testBackendHealth() {
  console.log('🔍 Verificando salud del backend...');
  
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Backend funcionando correctamente');
      return true;
    } else {
      console.log('❌ Backend no responde correctamente');
      return false;
    }
  } catch (error) {
    console.log('❌ Error conectando al backend:', error.message);
    return false;
  }
}

async function testCreatePreference() {
  console.log('\n🔍 Probando creación de preferencia...');
  
  const testPaymentData = {
    service: 'Consulta General - Punto Legal',
    price: 1000,
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    phone: '+56912345678',
    date: '2025-09-23',
    time: '10:00',
    description: 'Consulta legal agendada para 2025-09-23 a las 10:00'
  };

  try {
    const response = await fetch(`${BACKEND_URL}/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentData: testPaymentData })
    });

    const data = await response.json();
    
    if (data.success && data.preference_id) {
      console.log('✅ Preferencia creada exitosamente');
      console.log('   ID:', data.preference_id);
      console.log('   Init Point:', data.init_point);
      return true;
    } else {
      console.log('❌ Error creando preferencia:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Error en la petición:', error.message);
    return false;
  }
}

async function testFrontendConnection() {
  console.log('\n🔍 Verificando conexión al frontend...');
  
  try {
    const response = await fetch(FRONTEND_URL);
    
    if (response.ok) {
      console.log('✅ Frontend accesible');
      return true;
    } else {
      console.log('❌ Frontend no accesible:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Error conectando al frontend:', error.message);
    return false;
  }
}

async function runCompleteTest() {
  console.log('🚀 Iniciando prueba completa del flujo MercadoPago\n');
  
  const backendOk = await testBackendHealth();
  const frontendOk = await testFrontendConnection();
  const preferenceOk = backendOk ? await testCreatePreference() : false;
  
  console.log('\n📊 Resumen de pruebas:');
  console.log('====================');
  console.log(`Backend MercadoPago: ${backendOk ? '✅ OK' : '❌ FALLO'}`);
  console.log(`Frontend React: ${frontendOk ? '✅ OK' : '❌ FALLO'}`);
  console.log(`Creación de preferencias: ${preferenceOk ? '✅ OK' : '❌ FALLO'}`);
  
  if (backendOk && frontendOk && preferenceOk) {
    console.log('\n🎉 ¡Todas las pruebas pasaron! El sistema está listo para producción.');
    console.log('\n🌐 URLs disponibles:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   Backend: ${BACKEND_URL}`);
    console.log('\n💡 Para probar el flujo completo:');
    console.log('   1. Ve a http://localhost:8081/agendamiento?plan=general');
    console.log('   2. Completa el formulario');
    console.log('   3. Usa el código PUNTOLEGALADMIN para precio de $1.000');
    console.log('   4. Procede al pago con MercadoPago');
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron. Revisa la configuración.');
  }
}

runCompleteTest().catch(console.error);
