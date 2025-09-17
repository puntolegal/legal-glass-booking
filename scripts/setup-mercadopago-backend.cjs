#!/usr/bin/env node

console.log('🚀 CONFIGURACIÓN DE BACKEND MERCADOPAGO');
console.log('=====================================');
console.log('');

console.log('📋 HEMOS CREADO UN EDGE FUNCTION PARA MERCADOPAGO');
console.log('==============================================');
console.log('');
console.log('El Edge Function está en:');
console.log('📁 supabase/functions/create-mercadopago-preference/index.ts');
console.log('');

console.log('🔧 OPCIONES PARA CONTINUAR:');
console.log('==========================');
console.log('');

console.log('OPCIÓN 1: 🚀 USAR SUPABASE CLI (RECOMENDADO)');
console.log('--------------------------------------------');
console.log('1. Instalar Supabase CLI:');
console.log('   npm install -g supabase');
console.log('');
console.log('2. Configurar secret de MercadoPago:');
console.log('   supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-4010337867785275-091313-920eb61517cac97567e501a9b30592eb-2685419265');
console.log('');
console.log('3. Deployar la función:');
console.log('   supabase functions deploy create-mercadopago-preference');
console.log('');

console.log('OPCIÓN 2: 🌐 USAR DASHBOARD DE SUPABASE');
console.log('--------------------------------------');
console.log('1. Ve a: https://supabase.com/dashboard');
console.log('2. Selecciona tu proyecto');
console.log('3. Ve a "Edge Functions"');
console.log('4. Crea nueva función llamada "create-mercadopago-preference"');
console.log('5. Copia el código de: supabase/functions/create-mercadopago-preference/index.ts');
console.log('6. En "Settings" > "Environment Variables", agrega:');
console.log('   MERCADOPAGO_ACCESS_TOKEN = APP_USR-4010337867785275-091313-920eb61517cac97567e501a9b30592eb-2685419265');
console.log('');

console.log('OPCIÓN 3: 🧪 PROBAR SIN BACKEND (TEMPORAL)');
console.log('-----------------------------------------');
console.log('Podemos crear una versión que use el SDK directamente');
console.log('(menos seguro pero funcional para desarrollo)');
console.log('');

console.log('🎯 ¿QUÉ OPCIÓN PREFIERES?');
console.log('========================');
console.log('1. Instalar Supabase CLI y deployar (más profesional)');
console.log('2. Usar dashboard web de Supabase (más visual)');
console.log('3. Implementar versión temporal sin backend');
console.log('');

console.log('💡 RECOMENDACIÓN:');
console.log('================');
console.log('Para desarrollo rápido: Opción 3');
console.log('Para producción: Opción 1 o 2');
console.log('');
