#!/usr/bin/env node

/**
 * Script para probar el trigger de emails directamente
 */

console.log('🧪 PROBANDO TRIGGER DE EMAILS');
console.log('==============================\n');

// Simular una reserva de prueba
const testReservation = {
  id: 'test-trigger-' + Date.now(),
  nombre: 'Benjamín Soza',
  email: 'benja.soza@gmail.com',
  telefono: '+56912345678',
  servicio: 'Consulta General',
  fecha: '2025-01-15',
  hora: '10:00',
  precio: '35000',
  estado: 'confirmada',
  tipo_reunion: 'online',
  duracion: '45 minutos',
  ubicacion: 'Google Meet'
};

console.log('📋 RESERVA DE PRUEBA:');
console.log('=====================');
console.log(`ID: ${testReservation.id}`);
console.log(`Cliente: ${testReservation.nombre}`);
console.log(`Email: ${testReservation.email}`);
console.log(`Teléfono: ${testReservation.telefono}`);
console.log(`Servicio: ${testReservation.servicio}`);
console.log(`Fecha: ${testReservation.fecha}`);
console.log(`Hora: ${testReservation.hora}`);
console.log(`Precio: $${testReservation.precio}`);
console.log(`Estado: ${testReservation.estado}\n`);

console.log('🔧 COMANDO PARA PROBAR TRIGGER:');
console.log('===============================');
console.log('Ejecuta este comando en Supabase SQL Editor:');
console.log('');
console.log(`SELECT public.test_email_trigger('${testReservation.id}');`);
console.log('');

console.log('📧 RESULTADO ESPERADO:');
console.log('======================');
console.log('✅ Deberías recibir 2 emails:');
console.log('   - benja.soza@gmail.com (confirmación)');
console.log('   - puntolegalelgolf@gmail.com (admin)');
console.log('✅ Respuesta JSON con datos de la reserva');
console.log('✅ Logs en Supabase Dashboard\n');

console.log('🔍 VERIFICAR LOGS:');
console.log('==================');
console.log('1. Supabase Dashboard → Logs → Database');
console.log('2. Buscar: "Sending email notification for reservation ID"');
console.log('3. Verificar que no haya errores\n');

console.log('❓ SI NO FUNCIONA:');
console.log('==================');
console.log('1. Verificar que el trigger esté creado:');
console.log('   SELECT * FROM pg_trigger WHERE tgname = \'trg_notify_email_on_paid\';');
console.log('');
console.log('2. Verificar que la función exista:');
console.log('   SELECT * FROM pg_proc WHERE proname = \'notify_email_on_paid\';');
console.log('');
console.log('3. Verificar que la Edge Function esté desplegada:');
console.log('   curl -X POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/clever-action \\');
console.log('     -H "Authorization: Bearer [SERVICE_ROLE_KEY]" \\');
console.log('     -H "X-Admin-Token: puntolegal-admin-token-2025" \\');
console.log('     -d \'{"booking_id": "test-manual-123"}\'\n');

console.log('✅ SISTEMA LISTO PARA PRUEBA');
console.log('=============================');
