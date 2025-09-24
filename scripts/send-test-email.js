#!/usr/bin/env node

/**
 * Script para enviar email de prueba directamente usando la Edge Function
 */

console.log('📧 ENVIANDO EMAIL DE PRUEBA');
console.log('============================\n');

// Datos de la reserva de prueba
const testReservation = {
  id: 'test-email-' + Date.now(),
  cliente_nombre: 'Benjamín Soza',
  cliente_email: 'benja.soza@gmail.com',
  cliente_telefono: '+56912345678',
  servicio_tipo: 'Consulta General',
  servicio_precio: '35000',
  fecha: '2025-01-15',
  hora: '10:00:00',
  estado: 'confirmada',
  tipo_reunion: 'online'
};

console.log('📋 DATOS DE LA RESERVA:');
console.log('========================');
console.log(`ID: ${testReservation.id}`);
console.log(`Cliente: ${testReservation.cliente_nombre}`);
console.log(`Email: ${testReservation.cliente_email}`);
console.log(`Teléfono: ${testReservation.cliente_telefono}`);
console.log(`Servicio: ${testReservation.servicio_tipo}`);
console.log(`Precio: $${testReservation.servicio_precio}`);
console.log(`Fecha: ${testReservation.fecha}`);
console.log(`Hora: ${testReservation.hora}`);
console.log(`Estado: ${testReservation.estado}\n`);

console.log('🔧 COMANDO CURL PARA ENVIAR EMAIL:');
console.log('===================================');
console.log('curl -X POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/clever-action \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg" \\');
console.log('  -H "X-Admin-Token: puntolegal-admin-token-2025" \\');
console.log(`  -d '{"booking_id": "${testReservation.id}"}'\n`);

console.log('📧 RESULTADO ESPERADO:');
console.log('======================');
console.log('✅ Deberías recibir 2 emails:');
console.log('   - benja.soza@gmail.com (confirmación)');
console.log('   - puntolegalelgolf@gmail.com (admin)');
console.log('✅ Respuesta HTTP 200 del curl');
console.log('✅ Logs en Supabase Dashboard\n');

console.log('🔍 VERIFICAR LOGS:');
console.log('==================');
console.log('1. Supabase Dashboard → Logs → Edge Functions → clever-action');
console.log('2. Buscar mensajes que contengan:');
console.log('   - "Procesando emails para reserva"');
console.log('   - "Emails enviados exitosamente"');
console.log('   - "Cliente ID" y "Admin ID"\n');

console.log('❓ SI NO FUNCIONA:');
console.log('==================');
console.log('1. Verificar que la Edge Function esté desplegada');
console.log('2. Verificar que las variables de entorno estén configuradas');
console.log('3. Verificar que la reserva exista en la base de datos');
console.log('4. Verificar logs de la Edge Function\n');

console.log('✅ SISTEMA LISTO PARA PRUEBA');
console.log('=============================');
