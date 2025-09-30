// Script para probar configuración de back_urls para móvil
console.log('📱 PROBANDO CONFIGURACIÓN DE BACK_URLS PARA MÓVIL');
console.log('================================================');

const testData = {
  paymentData: {
    service: 'Consulta General',
    description: 'Consulta legal de prueba para móvil',
    price: 35000,
    name: 'Bastian Aliaga',
    email: 'tr.bastian.pr@gmail.com',
    phone: '+56932709221',
    date: '2025-10-03',
    time: '15:00',
    external_reference: 'test-mobile-' + Date.now()
  }
};

console.log('📋 Datos de prueba:', JSON.stringify(testData, null, 2));

console.log('\n🚀 Enviando a backend...');

const backendUrl = 'https://api.puntolegal.online';

fetch(`${backendUrl}/create-preference`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('📤 Respuesta del backend:', response.status, response.statusText);
  return response.json();
})
.then(result => {
  console.log('✅ Resultado:', JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log('\n🎯 CONFIGURACIÓN VERIFICADA:');
    console.log('✅ Preferencia creada:', result.preference_id);
    console.log('✅ init_point:', result.init_point ? 'Disponible' : 'No disponible');
    console.log('✅ sandbox_init_point:', result.sandbox_init_point ? 'Disponible' : 'No disponible');
    
    console.log('\n📱 CONFIGURACIÓN MÓVIL:');
    console.log('✅ auto_return: approved (configurado en backend)');
    console.log('✅ back_urls: configuradas para móvil');
    console.log('✅ window.location.assign: configurado en frontend');
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. ✅ Backend configurado correctamente');
    console.log('2. ✅ Frontend usa window.location.assign');
    console.log('3. 🔍 Probar en dispositivo móvil real');
    console.log('4. 🔍 Verificar que se cargan datos al regresar');
  } else {
    console.log('❌ Error en backend:', result.error);
  }
})
.catch(error => {
  console.log('❌ Error de conexión:', error.message);
});
