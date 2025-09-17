#!/usr/bin/env node

console.log('🚀 DEPLOYMENT DE EDGE FUNCTION - PRODUCCIÓN');
console.log('==========================================');
console.log('');

console.log('📋 EDGE FUNCTION PREPARADO:');
console.log('===========================');
console.log('✅ Archivo: supabase/functions/create-mercadopago-preference/index.ts');
console.log('✅ Credenciales de producción configuradas');
console.log('✅ CORS configurado');
console.log('✅ Manejo de errores implementado');
console.log('');

console.log('🔧 COMANDOS PARA DEPLOYMENT:');
console.log('============================');
console.log('');

console.log('1. 📦 INSTALAR SUPABASE CLI (si no está instalado):');
console.log('   npm install -g supabase');
console.log('');

console.log('2. 🔐 CONFIGURAR SECRET DE PRODUCCIÓN:');
console.log('   supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567');
console.log('');

console.log('3. 🚀 DEPLOYAR FUNCIÓN:');
console.log('   supabase functions deploy create-mercadopago-preference');
console.log('');

console.log('4. 🧪 PROBAR FUNCIÓN:');
console.log('   supabase functions invoke create-mercadopago-preference --data \'{"paymentData":{"service":"Test","price":"1000","name":"Test User","email":"test@test.com","phone":"+56912345678","date":"2025-01-15","time":"10:00"}}\'');
console.log('');

console.log('📝 COMANDOS COMPLETOS (copia y pega):');
console.log('====================================');
console.log('');
console.log('# Instalar CLI');
console.log('npm install -g supabase');
console.log('');
console.log('# Configurar secret');
console.log('supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567');
console.log('');
console.log('# Deployar función');
console.log('supabase functions deploy create-mercadopago-preference');
console.log('');

console.log('🎯 DESPUÉS DEL DEPLOYMENT:');
console.log('==========================');
console.log('• La aplicación creará preferencias REALES');
console.log('• Se eliminará el error 403');
console.log('• Checkout Pro funcionará correctamente');
console.log('• Pagos se procesarán con credenciales de producción');
console.log('');

console.log('⚠️  ALTERNATIVA SIN CLI:');
console.log('========================');
console.log('Si no puedes instalar Supabase CLI:');
console.log('');
console.log('1. Ve a: https://supabase.com/dashboard');
console.log('2. Selecciona tu proyecto');
console.log('3. Ve a "Edge Functions"');
console.log('4. Crea función "create-mercadopago-preference"');
console.log('5. Copia el código de: supabase/functions/create-mercadopago-preference/index.ts');
console.log('6. En "Settings" > "Environment Variables":');
console.log('   MERCADOPAGO_ACCESS_TOKEN = APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567');
console.log('');

console.log('🚀 UNA VEZ DEPLOYADO:');
console.log('=====================');
console.log('• Reinicia la aplicación');
console.log('• Prueba el flujo completo');
console.log('• Verifica que no haya error 403');
console.log('• Usa tarjetas de prueba para testing');
console.log('');

console.log('💡 NOTA IMPORTANTE:');
console.log('===================');
console.log('Sin el Edge Function deployado, la aplicación intentará');
console.log('crear preferencias desde el frontend, lo cual puede fallar');
console.log('por restricciones de CORS o seguridad.');
console.log('');
