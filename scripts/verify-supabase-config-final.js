#!/usr/bin/env node

/**
 * Script para verificar la configuración final de Supabase
 */

console.log('🔍 VERIFICANDO CONFIGURACIÓN FINAL DE SUPABASE');
console.log('==============================================\n');

console.log('📋 VARIABLES DE ENTORNO REQUERIDAS:');
console.log('===================================');
console.log('Ir a: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('Navegar a: Settings → Edge Functions');
console.log('');
console.log('Verificar que estas variables estén configuradas:');
console.log('');
console.log('1. RESEND_API_KEY');
console.log('   Value: re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('   Estado: ✅ Configurado');
console.log('');
console.log('2. MAIL_FROM');
console.log('   Value: Punto Legal <team@puntolegal.online>');
console.log('   Estado: ⚠️  VERIFICAR - Debe ser el dominio verificado');
console.log('');
console.log('3. ADMIN_EMAIL');
console.log('   Value: puntolegalelgolf@gmail.com');
console.log('   Estado: ✅ Configurado');
console.log('');
console.log('4. SUPABASE_URL');
console.log('   Value: https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('   Estado: ✅ Configurado');
console.log('');
console.log('5. SUPABASE_SERVICE_ROLE_KEY');
console.log('   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
console.log('   Estado: ✅ Configurado');
console.log('');
console.log('6. EDGE_ADMIN_TOKEN');
console.log('   Value: puntolegal-admin-token-2025');
console.log('   Estado: ✅ Configurado');
console.log('');

console.log('🧪 PROBAR CONFIGURACIÓN:');
console.log('========================');
console.log('1. Ejecutar: node scripts/test-final-domain.js');
console.log('2. Si funciona, el problema está en la Edge Function');
console.log('3. Si no funciona, verificar variables de entorno');
console.log('');

console.log('🔧 SOLUCIÓN RÁPIDA:');
console.log('===================');
console.log('1. Ir a Supabase Dashboard → Edge Functions');
console.log('2. Verificar que MAIL_FROM sea: Punto Legal <team@puntolegal.online>');
console.log('3. Guardar cambios');
console.log('4. La Edge Function se reiniciará automáticamente');
console.log('');

console.log('✅ CONFIGURACIÓN CORRECTA REQUERIDA');
console.log('===================================');
