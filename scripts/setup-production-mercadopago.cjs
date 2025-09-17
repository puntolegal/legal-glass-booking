#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 CONFIGURANDO MERCADOPAGO PRODUCCIÓN');
console.log('====================================');
console.log('');

// Credenciales de producción
const PRODUCTION_CREDENTIALS = {
  publicKey: 'APP_USR-e02e0cc8-f3aa-422e-b0df-87b6ce44f3f8',
  accessToken: 'APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567'
};

console.log('📋 CREDENCIALES DE PRODUCCIÓN:');
console.log('=============================');
console.log(`✅ Public Key: ${PRODUCTION_CREDENTIALS.publicKey}`);
console.log(`✅ Access Token: ${PRODUCTION_CREDENTIALS.accessToken.substring(0, 20)}...`);
console.log('');

// Ruta del archivo .env
const envPath = path.join(process.cwd(), '.env');

console.log('🔧 CONFIGURANDO VARIABLES DE ENTORNO:');
console.log('====================================');

try {
  let envContent = '';
  
  // Leer .env existente si existe
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 Archivo .env existente encontrado');
  } else {
    console.log('📄 Creando nuevo archivo .env');
  }
  
  // Variables a agregar/actualizar
  const envVars = {
    'VITE_MERCADOPAGO_PUBLIC_KEY': PRODUCTION_CREDENTIALS.publicKey,
    'MERCADOPAGO_ACCESS_TOKEN': PRODUCTION_CREDENTIALS.accessToken,
    'MERCADOPAGO_ENVIRONMENT': 'production'
  };
  
  // Actualizar o agregar cada variable
  Object.entries(envVars).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${value}`;
    
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, newLine);
      console.log(`✅ Actualizado: ${key}`);
    } else {
      envContent += `\n${newLine}`;
      console.log(`✅ Agregado: ${key}`);
    }
  });
  
  // Escribir archivo .env
  fs.writeFileSync(envPath, envContent.trim() + '\n');
  console.log('');
  console.log('✅ Archivo .env configurado exitosamente');
  
} catch (error) {
  console.error('❌ Error configurando .env:', error.message);
  console.log('');
  console.log('📝 CONFIGURACIÓN MANUAL:');
  console.log('=======================');
  console.log('Crea/edita el archivo .env en la raíz del proyecto con:');
  console.log('');
  console.log(`VITE_MERCADOPAGO_PUBLIC_KEY=${PRODUCTION_CREDENTIALS.publicKey}`);
  console.log(`MERCADOPAGO_ACCESS_TOKEN=${PRODUCTION_CREDENTIALS.accessToken}`);
  console.log('MERCADOPAGO_ENVIRONMENT=production');
  console.log('');
}

console.log('');
console.log('🎯 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. ✅ Credenciales de producción configuradas');
console.log('2. 🔄 Reinicia el servidor de desarrollo');
console.log('3. 🧪 Prueba con tarjetas reales (¡cuidado con los cobros!)');
console.log('4. 📧 Configura webhooks para notificaciones');
console.log('');

console.log('⚠️  IMPORTANTE - PRODUCCIÓN:');
console.log('============================');
console.log('• Ahora se procesarán PAGOS REALES');
console.log('• Usa tarjetas de prueba para testing');
console.log('• Configura URLs de producción antes del deploy');
console.log('• Verifica que los webhooks funcionen');
console.log('');

console.log('🧪 TARJETAS DE PRUEBA PARA PRODUCCIÓN:');
console.log('=====================================');
console.log('• Visa: 4509 9535 6623 3704');
console.log('• Mastercard: 5031 7557 3453 0604');
console.log('• CVV: 123');
console.log('• Fecha: 11/25');
console.log('• Nombre: APRO (para aprobar)');
console.log('');

console.log('🚀 ¡LISTO PARA PRODUCCIÓN!');
console.log('');
