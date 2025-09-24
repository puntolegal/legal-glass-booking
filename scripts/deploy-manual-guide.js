/**
 * Guía para desplegar manualmente el sistema de emails
 * Ejecutar: node scripts/deploy-manual-guide.js
 */

console.log('🚀 GUÍA DE DESPLIEGUE MANUAL - SISTEMA DE EMAILS');
console.log('================================================\n');

console.log('✅ VARIABLES CONFIGURADAS EN SUPABASE');
console.log('• RESEND_API_KEY: re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('• MAIL_FROM: Punto Legal <puntolegalelgolf@gmail.com>');
console.log('• ADMIN_EMAIL: puntolegalelgolf@gmail.com');
console.log('• SUPABASE_URL: https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('• SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
console.log('• EDGE_ADMIN_TOKEN: puntolegal-admin-token-2025\n');

console.log('📋 PASOS PARA DESPLEGAR MANUALMENTE:');
console.log('');
console.log('1. DESPLEGAR EDGE FUNCTION:');
console.log('   a. Ir a: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('   b. Functions → Create a new function');
console.log('   c. Nombre: send-booking-emails');
console.log('   d. Copiar el código desde: supabase/functions/send-booking-emails/index.ts');
console.log('   e. Deploy function');
console.log('');
console.log('2. EJECUTAR MIGRACIÓN SQL:');
console.log('   a. Ir a: SQL Editor');
console.log('   b. New query');
console.log('   c. Copiar el código desde: supabase/migrations/20250113000001-send-booking-emails-trigger.sql');
console.log('   d. Run query');
console.log('');
console.log('3. VERIFICAR DESPLIEGUE:');
console.log('   a. Functions → send-booking-emails → Logs');
console.log('   b. Verificar que aparezca en la lista de functions');
console.log('   c. Probar con el comando curl de abajo');

console.log('\n🧪 COMANDO DE PRUEBA:');
console.log('curl -X POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-booking-emails \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-Admin-Token: puntolegal-admin-token-2025" \\');
console.log('  -d \'{"booking_id": "test-manual-1758496157144"}\'');

console.log('\n📧 RESULTADO ESPERADO:');
console.log('• Status: 200 OK');
console.log('• Response: {"ok": true, "providerIds": ["resend_id_1", "resend_id_2"]}');
console.log('• Email enviado a: benja.soza@gmail.com');
console.log('• Email enviado a: puntolegalelgolf@gmail.com');

console.log('\n🔍 VERIFICAR EN:');
console.log('• Resend Dashboard: https://resend.com/emails');
console.log('• Supabase Logs: Functions → send-booking-emails → Logs');
console.log('• Bandeja de entrada: benja.soza@gmail.com');

console.log('\n📁 ARCHIVOS A COPIAR:');
console.log('1. Edge Function: supabase/functions/send-booking-emails/index.ts');
console.log('2. Migración SQL: supabase/migrations/20250113000001-send-booking-emails-trigger.sql');

console.log('\n⚠️ IMPORTANTE:');
console.log('• Asegúrate de que las variables estén configuradas antes de desplegar');
console.log('• La Edge Function debe tener el nombre exacto: send-booking-emails');
console.log('• La migración SQL debe ejecutarse completamente');

console.log('\n✅ SISTEMA LISTO PARA DESPLEGAR MANUALMENTE');
console.log('🚀 ¡Sigue los pasos y tendrás el sistema funcionando!');
