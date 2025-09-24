#!/usr/bin/env node

/**
 * Script para actualizar el sistema con el dominio verificado
 */

console.log('🎉 DOMINIO VERIFICADO EN RESEND');
console.log('===============================\n');

console.log('✅ CONFIGURACIÓN DEL DOMINIO:');
console.log('=============================');
console.log('• Dominio: comunicaciones.puntolegal.online');
console.log('• Email de envío: team@comunicaciones.puntolegal.online');
console.log('• Estado: Verificado (puede tomar unos minutos)');
console.log('• Región: sa-east-1 (São Paulo)');
console.log('');

console.log('📧 NUEVA CONFIGURACIÓN PARA SUPABASE:');
console.log('=====================================');
console.log('Ir a: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('Navegar a: Settings → Edge Functions');
console.log('');
console.log('Actualizar estas variables de entorno:');
console.log('');
console.log('1. RESEND_API_KEY');
console.log('   Value: re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW');
console.log('');
console.log('2. MAIL_FROM');
console.log('   Value: Punto Legal <team@comunicaciones.puntolegal.online>');
console.log('');
console.log('3. ADMIN_EMAIL');
console.log('   Value: puntolegalelgolf@gmail.com');
console.log('');
console.log('4. SUPABASE_URL');
console.log('   Value: https://qrgelocijmwnxcckxbdg.supabase.co');
console.log('');
console.log('5. SUPABASE_SERVICE_ROLE_KEY');
console.log('   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg');
console.log('');
console.log('6. EDGE_ADMIN_TOKEN');
console.log('   Value: puntolegal-admin-token-2025');
console.log('');

console.log('🧪 PROBAR CON DOMINIO VERIFICADO:');
console.log('=================================');
console.log('1. Esperar 5-10 minutos para propagación DNS');
console.log('2. Ejecutar: node scripts/test-email-with-domain.js');
console.log('3. Verificar que se envíen emails a cualquier dirección');
console.log('');

console.log('✅ VENTAJAS DEL DOMINIO VERIFICADO:');
console.log('===================================');
console.log('• Se puede enviar a cualquier email');
console.log('• Mejor deliverability');
console.log('• Emails más profesionales');
console.log('• Sistema completo funcionando');
console.log('');

console.log('🚀 SISTEMA LISTO PARA PRODUCCIÓN');
console.log('=================================');
