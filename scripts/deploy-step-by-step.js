#!/usr/bin/env node

/**
 * Guía paso a paso para desplegar el sistema de emails
 */

console.log('🚀 GUÍA DE DESPLIEGUE PASO A PASO');
console.log('==================================\n');

console.log('📋 PASO 1: DESPLEGAR EDGE FUNCTION');
console.log('===================================');
console.log('1. Ve a: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('2. Navega a: Edge Functions → Create a new function');
console.log('3. Nombre: send-booking-emails');
console.log('4. Copia el código del archivo: supabase/functions/send-booking-emails/index.ts');
console.log('5. Pega el código en el editor');
console.log('6. Haz clic en "Deploy function"\n');

console.log('📋 PASO 2: EJECUTAR MIGRACIÓN SQL');
console.log('=================================');
console.log('1. Ve a: SQL Editor → New query');
console.log('2. Copia el código del archivo: supabase/migrations/20250113000001-send-booking-emails-trigger.sql');
console.log('3. Pega el código en el editor');
console.log('4. Haz clic en "Run"\n');

console.log('📋 PASO 3: VERIFICAR CONFIGURACIÓN');
console.log('==================================');
console.log('1. Ve a: Settings → Edge Functions');
console.log('2. Verifica que las variables estén configuradas:');
console.log('   - RESEND_API_KEY: re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('   - MAIL_FROM: Punto Legal <puntolegalelgolf@gmail.com>');
console.log('   - ADMIN_EMAIL: puntolegalelgolf@gmail.com');
console.log('   - SUPABASE_URL: https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('   - SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
console.log('   - EDGE_ADMIN_TOKEN: puntolegal-admin-token-2025\n');

console.log('📋 PASO 4: PROBAR EL SISTEMA');
console.log('=============================');
console.log('Ejecuta este comando para probar:');
console.log('');
console.log('curl -X POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-booking-emails \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-Admin-Token: puntolegal-admin-token-2025" \\');
console.log('  -d \'{"booking_id": "test-manual-1758502031417"}\'\n');

console.log('📋 PASO 5: VERIFICAR RESULTADOS');
console.log('===============================');
console.log('✅ Deberías recibir 2 emails:');
console.log('   - benja.soza@gmail.com (confirmación)');
console.log('   - puntolegalelgolf@gmail.com (admin)');
console.log('✅ Respuesta HTTP 200 del curl');
console.log('✅ Logs en Supabase Dashboard\n');

console.log('🔧 CÓDIGO DE LA EDGE FUNCTION:');
console.log('==============================');
console.log('Archivo: supabase/functions/send-booking-emails/index.ts\n');

console.log('🔧 CÓDIGO DE LA MIGRACIÓN SQL:');
console.log('==============================');
console.log('Archivo: supabase/migrations/20250113000001-send-booking-emails-trigger.sql\n');

console.log('❓ ¿NECESITAS AYUDA?');
console.log('====================');
console.log('Si tienes problemas, revisa:');
console.log('- Logs en Supabase Dashboard → Edge Functions → send-booking-emails');
console.log('- Logs en Supabase Dashboard → Logs → Database');
console.log('- Verifica que todas las variables estén configuradas correctamente\n');

console.log('✅ ¡SISTEMA LISTO PARA DESPLEGAR!');
console.log('=================================');
