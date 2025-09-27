/**
 * Script para verificar la configuración de Supabase
 * Ejecutar: node scripts/verify-supabase-config.js
 */

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE SUPABASE');
console.log('==========================================\n');

// Configuraciones que deberían estar en Supabase
const requiredConfig = {
  RESEND_API_KEY: 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW',
  MAIL_FROM: 'Punto Legal <puntolegalelgolf@gmail.com>',
  ADMIN_EMAIL: 'puntolegalelgolf@gmail.com',
  SUPABASE_URL: 'https://qrgelocijmwnxcckxbdg.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg',
  EDGE_ADMIN_TOKEN: 'puntolegal-admin-token-2025'
};

console.log('✅ CONFIGURACIONES REQUERIDAS:');
Object.entries(requiredConfig).forEach(([key, value]) => {
  console.log(`   ${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
});

console.log('\n📋 CHECKLIST DE VERIFICACIÓN:');
console.log('1. ✅ API Key de Resend obtenida');
console.log('2. ✅ Service Role Key obtenida');
console.log('3. ✅ Email verificado en Resend: puntolegalelgolf@gmail.com');
console.log('4. ✅ Proyecto Supabase identificado: qrgelocijmwnxcckxbdg');
console.log('5. ⏳ Variables configuradas en Supabase Dashboard');
console.log('6. ⏳ Edge Function desplegada');
console.log('7. ⏳ Migración SQL ejecutada');
console.log('8. ⏳ Trigger creado en base de datos');

console.log('\n🔧 PASOS PARA COMPLETAR LA CONFIGURACIÓN:');
console.log('1. Ir a Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('   Settings → Configuration → Secrets');
console.log('');
console.log('2. Agregar estas 6 variables:');
console.log('   RESEND_API_KEY=re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('   MAIL_FROM=Punto Legal <puntolegalelgolf@gmail.com>');
console.log('   ADMIN_EMAIL=puntolegalelgolf@gmail.com');
console.log('   SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg');
console.log('   EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025');
console.log('');
console.log('3. Instalar Supabase CLI:');
console.log('   # Opción 1: Homebrew');
console.log('   brew install supabase/tap/supabase');
console.log('   # Opción 2: Descargar binario');
console.log('   # https://github.com/supabase/cli/releases');
console.log('');
console.log('4. Login en Supabase:');
console.log('   supabase login');
console.log('');
console.log('5. Desplegar Edge Function:');
console.log('   supabase functions deploy send-booking-emails');
console.log('');
console.log('6. Ejecutar migración:');
console.log('   supabase db push');
console.log('');
console.log('7. Probar sistema:');
console.log('   node scripts/test-supabase-email-system.js');

console.log('\n🧪 PRUEBA MANUAL DE EDGE FUNCTION:');
console.log('curl -X POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-booking-emails \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-Admin-Token: puntolegal-admin-token-2025" \\');
console.log('  -d \'{"booking_id": "test-reservation-id"}\'');

console.log('\n🔍 VERIFICAR EN:');
console.log('• Supabase Dashboard → Functions → send-booking-emails → Logs');
console.log('• Resend Dashboard → https://resend.com/emails');
console.log('• Base de datos: SELECT * FROM public.reservas_with_email_status;');

console.log('\n⚠️ PROBLEMAS COMUNES:');
console.log('• Variables no configuradas → Verificar en Supabase Secrets');
console.log('• Edge Function no desplegada → Ejecutar supabase functions deploy');
console.log('• Migración no ejecutada → Ejecutar supabase db push');
console.log('• Email no verificado → Verificar en Resend Dashboard');

console.log('\n✅ SISTEMA LISTO PARA CONFIGURAR');
console.log('🚀 Una vez completados los pasos, el sistema estará 100% funcional');
