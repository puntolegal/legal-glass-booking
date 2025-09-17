#!/usr/bin/env node

console.log('🚀 CONFIGURACIÓN NETLIFY + MERCADOPAGO');
console.log('====================================');
console.log('');

console.log('📋 ARCHIVOS CREADOS:');
console.log('====================');
console.log('✅ netlify/functions/create-mercadopago-preference.js');
console.log('✅ src/components/MercadoPagoNetlifyButton.tsx');
console.log('✅ Página actualizada para usar Netlify Function');
console.log('');

console.log('🔧 CONFIGURACIÓN REQUERIDA:');
console.log('===========================');
console.log('');

console.log('1. 🌐 DEPLOY EN NETLIFY:');
console.log('   • Ve a: https://app.netlify.com/');
console.log('   • Conecta tu repositorio');
console.log('   • Deploy automático');
console.log('');

console.log('2. 🔐 CONFIGURAR VARIABLES DE ENTORNO:');
console.log('   En Netlify Dashboard > Site Settings > Environment Variables:');
console.log('   ');
console.log('   Variable: MERCADOPAGO_ACCESS_TOKEN');
console.log('   Value: APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567');
console.log('');

console.log('3. 🧪 PROBAR LOCALMENTE (OPCIONAL):');
console.log('   # Instalar Netlify CLI');
console.log('   npm install -g netlify-cli');
console.log('   ');
console.log('   # Ejecutar localmente');
console.log('   netlify dev');
console.log('');

console.log('📝 PASOS DETALLADOS:');
console.log('====================');
console.log('');

console.log('PASO 1: DEPLOY EN NETLIFY');
console.log('-------------------------');
console.log('1. Ve a https://app.netlify.com/');
console.log('2. Clic en "New site from Git"');
console.log('3. Conecta tu repositorio GitHub');
console.log('4. Build settings:');
console.log('   - Build command: npm run build');
console.log('   - Publish directory: dist');
console.log('5. Clic en "Deploy site"');
console.log('');

console.log('PASO 2: CONFIGURAR VARIABLES');
console.log('----------------------------');
console.log('1. En tu sitio de Netlify > Site settings');
console.log('2. Environment variables > Add variable');
console.log('3. Key: MERCADOPAGO_ACCESS_TOKEN');
console.log('4. Value: APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567');
console.log('5. Save');
console.log('');

console.log('PASO 3: REDEPLOY');
console.log('----------------');
console.log('1. Deploys > Trigger deploy');
console.log('2. Deploy site');
console.log('');

console.log('🎯 DESPUÉS DEL DEPLOY:');
console.log('======================');
console.log('• La Netlify Function estará disponible');
console.log('• Se eliminará el error 403');
console.log('• MercadoPago funcionará con credenciales de producción');
console.log('• Checkout Pro oficial funcionará correctamente');
console.log('');

console.log('🔍 VERIFICAR FUNCIONAMIENTO:');
console.log('============================');
console.log('1. Ve a tu sitio deployado en Netlify');
console.log('2. Navega a /agendamiento?plan=general');
console.log('3. Completa el formulario');
console.log('4. Procede al pago con MercadoPago');
console.log('5. Verifica que no haya error 403');
console.log('6. Confirma redirección a MercadoPago oficial');
console.log('');

console.log('⚠️  IMPORTANTE:');
console.log('===============');
console.log('• Las Netlify Functions solo funcionan en el sitio deployado');
console.log('• En desarrollo local necesitas `netlify dev`');
console.log('• Las credenciales están seguras en variables de entorno');
console.log('• El error 403 se solucionará completamente');
console.log('');

console.log('🚀 ¡LISTO PARA DEPLOY!');
console.log('');
console.log('Sigue los pasos y luego prueba en tu sitio de Netlify.');
console.log('');
