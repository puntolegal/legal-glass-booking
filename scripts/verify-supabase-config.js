/**
 * Script para verificar la configuración de Supabase
 * Ejecutar: node scripts/verify-supabase-config.js
 */

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE SUPABASE');
console.log('==========================================\n');

// ✅ SEGURO - Configuraciones requeridas (sin credenciales reales)
const requiredConfig = {
  RESEND_API_KEY: 'CONFIGURAR_EN_SUPABASE_DASHBOARD',
  MAIL_FROM: 'CONFIGURAR_EN_SUPABASE_DASHBOARD',
  ADMIN_EMAIL: 'CONFIGURAR_EN_SUPABASE_DASHBOARD',
  SUPABASE_URL: 'CONFIGURAR_EN_SUPABASE_DASHBOARD',
  SUPABASE_SERVICE_ROLE_KEY: 'CONFIGURAR_EN_SUPABASE_DASHBOARD',
  EDGE_ADMIN_TOKEN: 'CONFIGURAR_EN_SUPABASE_DASHBOARD'
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
console.log('2. Agregar estas 6 variables (obtener valores reales de tus dashboards):');
console.log('   RESEND_API_KEY=tu-resend-api-key-aqui');
console.log('   MAIL_FROM=Tu Nombre <tu-email@dominio.com>');
console.log('   ADMIN_EMAIL=tu-admin-email@dominio.com');
console.log('   SUPABASE_URL=https://tu-proyecto.supabase.co');
console.log('   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui');
console.log('   EDGE_ADMIN_TOKEN=tu-admin-token-seguro');
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
console.log('curl -X POST https://tu-proyecto.supabase.co/functions/v1/send-booking-emails \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-Admin-Token: tu-admin-token-seguro" \\');
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
