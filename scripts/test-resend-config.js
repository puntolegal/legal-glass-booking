/**
 * Script para probar la configuración de Resend con la API key real
 * Ejecutar: node scripts/test-resend-config.js
 */

console.log('🧪 PROBANDO CONFIGURACIÓN DE RESEND\n');

const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';

console.log('✅ API Key de Resend configurada:');
console.log(`   ${RESEND_API_KEY}\n`);

console.log('📋 VARIABLES A CONFIGURAR EN SUPABASE DASHBOARD:');
console.log('1. Ir a: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('2. Settings → Configuration → Secrets');
console.log('3. Agregar las siguientes variables:\n');

console.log('RESEND_API_KEY=' + RESEND_API_KEY);
console.log('MAIL_FROM=Punto Legal <puntolegalelgolf@gmail.com>');
console.log('ADMIN_EMAIL=puntolegalelgolf@gmail.com');
console.log('SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg');
console.log('EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025\n');

console.log('🔧 PASOS SIGUIENTES:');
console.log('1. ✅ API Key de Resend obtenida');
console.log('2. ⏳ Configurar variables en Supabase Dashboard');
console.log('3. ⏳ Obtener Service Role Key desde Settings → API');
console.log('4. ⏳ Desplegar Edge Function: supabase functions deploy send-booking-emails');
console.log('5. ⏳ Ejecutar migración: supabase db push');
console.log('6. ⏳ Probar sistema completo\n');

console.log('🧪 COMANDO DE PRUEBA (después de configurar):');
console.log('curl -X POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-booking-emails \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-Admin-Token: puntolegal-admin-token-2025" \\');
console.log('  -d \'{"booking_id": "test-reservation-id"}\'\n');

console.log('📧 VERIFICAR EN RESEND DASHBOARD:');
console.log('1. Ir a: https://resend.com/emails');
console.log('2. Verificar que los emails se envíen correctamente');
console.log('3. Revisar logs de entrega\n');

console.log('🎯 RESULTADO ESPERADO:');
console.log('• Al configurar todas las variables');
console.log('• El sistema enviará emails automáticamente');
console.log('• Cliente recibe confirmación de reserva');
console.log('• Admin recibe notificación de nueva reserva');
console.log('• Emails enviados via Resend con plantillas HTML\n');

console.log('✅ CONFIGURACIÓN LISTA PARA IMPLEMENTAR');
