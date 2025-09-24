#!/usr/bin/env node

/**
 * Script para corregir la configuración de la Edge Function
 */

console.log('🔧 CORRIGIENDO CONFIGURACIÓN DE EDGE FUNCTION');
console.log('==============================================\n');

console.log('❌ PROBLEMA IDENTIFICADO:');
console.log('=========================');
console.log('• Error 401: API key is invalid');
console.log('• La Edge Function no puede conectarse a Resend');
console.log('• Variables de entorno no configuradas correctamente');
console.log('');

console.log('🔧 SOLUCIÓN:');
console.log('============');
console.log('1. Ir a Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('');
console.log('2. Navegar a: Settings → Edge Functions');
console.log('');
console.log('3. Verificar/Configurar estas variables:');
console.log('');
console.log('✅ RESEND_API_KEY');
console.log('   Name: RESEND_API_KEY');
console.log('   Value: re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('   Estado: ⚠️  VERIFICAR - Debe estar configurada');
console.log('');
console.log('✅ MAIL_FROM');
console.log('   Name: MAIL_FROM');
console.log('   Value: Punto Legal <team@puntolegal.online>');
console.log('   Estado: ✅ Ya configurado');
console.log('');
console.log('✅ ADMIN_EMAIL');
console.log('   Name: ADMIN_EMAIL');
console.log('   Value: puntolegalelgolf@gmail.com');
console.log('   Estado: ⚠️  VERIFICAR - Debe estar configurada');
console.log('');
console.log('✅ SUPABASE_URL');
console.log('   Name: SUPABASE_URL');
console.log('   Value: https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('   Estado: ⚠️  VERIFICAR - Debe estar configurada');
console.log('');
console.log('✅ SUPABASE_SERVICE_ROLE_KEY');
console.log('   Name: SUPABASE_SERVICE_ROLE_KEY');
console.log('   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg');
console.log('   Estado: ⚠️  VERIFICAR - Debe estar configurada');
console.log('');
console.log('✅ EDGE_ADMIN_TOKEN');
console.log('   Name: EDGE_ADMIN_TOKEN');
console.log('   Value: puntolegal-admin-token-2025');
console.log('   Estado: ⚠️  VERIFICAR - Debe estar configurada');
console.log('');

console.log('📋 PASOS PARA CONFIGURAR:');
console.log('==========================');
console.log('1. En Supabase Dashboard → Settings → Edge Functions');
console.log('2. Hacer clic en "Add new secret" para cada variable');
console.log('3. Agregar cada variable una por una con los valores exactos');
console.log('4. Guardar todas las variables');
console.log('5. La Edge Function se reiniciará automáticamente');
console.log('');

console.log('🧪 DESPUÉS DE CONFIGURAR:');
console.log('=========================');
console.log('1. Ejecutar: node scripts/test-email-flow-without-payment.js');
console.log('2. Verificar que se envíen los emails');
console.log('3. Revisar logs en Supabase Dashboard');
console.log('');

console.log('✅ CONFIGURACIÓN CORRECTA REQUERIDA');
console.log('===================================');
