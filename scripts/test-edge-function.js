/**
 * Script para probar la Edge Function directamente
 * Ejecutar: node scripts/test-edge-function.js
 */

console.log('🧪 PROBANDO EDGE FUNCTION DE SUPABASE');
console.log('=====================================\n');

const testBookingId = 'test-reservation-' + Date.now();
const edgeFunctionUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-booking-emails';

console.log('📋 DATOS DE PRUEBA:');
console.log(`   Booking ID: ${testBookingId}`);
console.log(`   Edge Function URL: ${edgeFunctionUrl}\n`);

console.log('🔧 CONFIGURACIÓN REQUERIDA:');
console.log('Antes de probar, asegúrate de que estas variables estén configuradas en Supabase:');
console.log('• RESEND_API_KEY=re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('• MAIL_FROM=Punto Legal <puntolegalelgolf@gmail.com>');
console.log('• ADMIN_EMAIL=puntolegalelgolf@gmail.com');
console.log('• SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('• SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
console.log('• EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025\n');

console.log('🧪 COMANDO DE PRUEBA:');
console.log('curl -X POST ' + edgeFunctionUrl + ' \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-Admin-Token: puntolegal-admin-token-2025" \\');
console.log('  -d \'{"booking_id": "' + testBookingId + '"}\'\n');

console.log('📧 RESULTADO ESPERADO:');
console.log('• Si está configurado correctamente:');
console.log('  - Status: 200 OK');
console.log('  - Response: {"ok": true, "providerIds": ["resend_id_1", "resend_id_2"]}');
console.log('  - Emails enviados a cliente y admin');
console.log('');
console.log('• Si no está configurado:');
console.log('  - Status: 500 Internal Server Error');
console.log('  - Response: {"ok": false, "error": "RESEND_API_KEY no configurado"}');
console.log('  - No se envían emails\n');

console.log('🔍 VERIFICAR RESULTADOS:');
console.log('1. Resend Dashboard: https://resend.com/emails');
console.log('2. Supabase Logs: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('   Functions → send-booking-emails → Logs\n');

console.log('⚠️ TROUBLESHOOTING:');
console.log('• Error 500: Variables no configuradas en Supabase Secrets');
console.log('• Error 404: Edge Function no desplegada');
console.log('• Error 401: Token de autorización incorrecto');
console.log('• Error 422: Booking ID no encontrado en base de datos\n');

console.log('✅ SISTEMA LISTO PARA PROBAR');
console.log('🚀 Ejecuta el comando curl para probar la Edge Function');
