#!/usr/bin/env node

/**
 * Script para verificar el estado del trigger de emails
 */

console.log('🔍 VERIFICACIÓN DEL TRIGGER DE EMAILS');
console.log('=====================================\n');

console.log('📋 COMANDOS SQL PARA VERIFICAR:');
console.log('===============================');
console.log('');
console.log('1. Verificar que el trigger existe:');
console.log('   SELECT * FROM pg_trigger WHERE tgname = \'trg_notify_email_on_paid\';');
console.log('');
console.log('2. Verificar que la función existe:');
console.log('   SELECT * FROM pg_proc WHERE proname = \'notify_email_on_paid\';');
console.log('');
console.log('3. Verificar que la tabla reservas existe:');
console.log('   SELECT * FROM information_schema.tables WHERE table_name = \'reservas\';');
console.log('');
console.log('4. Verificar estructura de la tabla reservas:');
console.log('   SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'reservas\';');
console.log('');
console.log('5. Probar el trigger manualmente:');
console.log('   INSERT INTO public.reservas (id, cliente_nombre, cliente_email, cliente_telefono, servicio_tipo, servicio_precio, fecha, hora, estado)');
console.log('   VALUES (');
console.log('     gen_random_uuid(),');
console.log('     \'Test Cliente\',');
console.log('     \'benja.soza@gmail.com\',');
console.log('     \'+56912345678\',');
console.log('     \'Consulta General\',');
console.log('     \'35000\',');
console.log('     \'2025-01-15\',');
console.log('     \'10:00:00\',');
console.log('     \'confirmada\'');
console.log('   );');
console.log('');

console.log('📧 VERIFICAR EMAILS:');
console.log('====================');
console.log('Después de ejecutar el INSERT, deberías recibir:');
console.log('✅ Email a benja.soza@gmail.com');
console.log('✅ Email a puntolegalelgolf@gmail.com');
console.log('');

console.log('🔍 VERIFICAR LOGS:');
console.log('==================');
console.log('1. Supabase Dashboard → Logs → Database');
console.log('2. Buscar mensajes que contengan:');
console.log('   - "Sending email notification for reservation ID"');
console.log('   - "Email sent successfully for reservation ID"');
console.log('   - "Edge Function response"');
console.log('');

console.log('❌ SI HAY ERRORES:');
console.log('==================');
console.log('1. Verificar que la Edge Function esté desplegada');
console.log('2. Verificar que las variables de entorno estén configuradas');
console.log('3. Verificar que la extensión pg_net esté habilitada');
console.log('4. Verificar permisos de la función');
console.log('');

console.log('✅ SISTEMA DE VERIFICACIÓN LISTO');
console.log('=================================');
