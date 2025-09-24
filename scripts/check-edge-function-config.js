#!/usr/bin/env node

/**
 * Script para verificar la configuración de la Edge Function
 */

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE EDGE FUNCTION');
console.log('==============================================\n');

console.log('❌ PROBLEMA IDENTIFICADO:');
console.log('=========================');
console.log('• Error 401: API key is invalid');
console.log('• La Edge Function no puede conectarse a Resend');
console.log('• Variables de entorno no configuradas correctamente\n');

console.log('🔧 SOLUCIÓN:');
console.log('============');
console.log('1. Ir a Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('');
console.log('2. Navegar a: Settings → Edge Functions');
console.log('');
console.log('3. Verificar que estas variables estén configuradas:');
console.log('   RESEND_API_KEY = re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('   MAIL_FROM = Punto Legal <puntolegalelgolf@gmail.com>');
console.log('   ADMIN_EMAIL = puntolegalelgolf@gmail.com');
console.log('   SUPABASE_URL = https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
console.log('   EDGE_ADMIN_TOKEN = puntolegal-admin-token-2025');
console.log('');

console.log('📋 PASOS PARA CONFIGURAR:');
console.log('==========================');
console.log('1. En Supabase Dashboard → Settings → Edge Functions');
console.log('2. Hacer clic en "Add new secret"');
console.log('3. Agregar cada variable una por una:');
console.log('   - Name: RESEND_API_KEY');
console.log('   - Value: re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('   - Repetir para cada variable');
console.log('4. Guardar todas las variables');
console.log('5. La Edge Function se reiniciará automáticamente');
console.log('');

console.log('🧪 DESPUÉS DE CONFIGURAR:');
console.log('=========================');
console.log('1. Ejecutar nuevamente: node scripts/test-email-direct.js');
console.log('2. Verificar que se envíen los emails');
console.log('3. Revisar logs en Supabase Dashboard');
console.log('');

console.log('✅ CONFIGURACIÓN CORRECTA REQUERIDA');
console.log('===================================');
