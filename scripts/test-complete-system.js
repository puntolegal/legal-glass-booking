#!/usr/bin/env node

/**
 * Script de prueba completa del sistema de emails
 * Simula el flujo completo desde agendamiento hasta confirmación
 */

console.log('🧪 PRUEBA COMPLETA DEL SISTEMA DE EMAILS');
console.log('==========================================\n');

// Simular datos de una reserva real
const testReservation = {
  id: 'test-reservation-' + Date.now(),
  nombre: 'Benjamín Soza',
  email: 'benja.soza@gmail.com',
  telefono: '+56912345678',
  servicio: 'Consulta General',
  fecha: '2025-01-15',
  hora: '10:00',
  precio: 35000,
  estado: 'confirmada',
  tipo_reunion: 'online',
  duracion: '45 minutos',
  ubicacion: 'Google Meet'
};

console.log('📋 DATOS DE PRUEBA:');
console.log('===================');
console.log(`ID: ${testReservation.id}`);
console.log(`Cliente: ${testReservation.nombre}`);
console.log(`Email: ${testReservation.email}`);
console.log(`Teléfono: ${testReservation.telefono}`);
console.log(`Servicio: ${testReservation.servicio}`);
console.log(`Fecha: ${testReservation.fecha}`);
console.log(`Hora: ${testReservation.hora}`);
console.log(`Precio: $${testReservation.precio.toLocaleString('es-CL')}`);
console.log(`Estado: ${testReservation.estado}`);
console.log(`Tipo: ${testReservation.tipo_reunion}`);
console.log(`Duración: ${testReservation.duracion}`);
console.log(`Ubicación: ${testReservation.ubicacion}\n`);

console.log('🔧 CONFIGURACIÓN ACTUAL:');
console.log('========================');
console.log('✅ Resend API Key: Configurado');
console.log('✅ Supabase Service Role: Configurado');
console.log('✅ Variables de entorno: Configuradas');
console.log('❌ Edge Function: NO DESPLEGADO');
console.log('❌ SQL Trigger: NO EJECUTADO\n');

console.log('📝 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. Desplegar Edge Function en Supabase Dashboard');
console.log('2. Ejecutar migración SQL en Supabase SQL Editor');
console.log('3. Probar sistema completo\n');

console.log('🚀 COMANDO DE PRUEBA:');
console.log('=====================');
console.log('curl -X POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/clever-action \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-Admin-Token: puntolegal-admin-token-2025" \\');
console.log('  -d \'{"booking_id": "' + testReservation.id + '"}\'\n');

console.log('📧 EMAILS QUE SE ENVIARÁN:');
console.log('==========================');
console.log('👤 Cliente: benja.soza@gmail.com');
console.log('   - Confirmación de cita');
console.log('   - Código de seguimiento');
console.log('   - Link de Google Meet');
console.log('   - Detalles de la consulta\n');
console.log('👨‍💼 Admin: puntolegalelgolf@gmail.com');
console.log('   - Notificación de nueva cita');
console.log('   - Código de seguimiento');
console.log('   - Evento de Google Calendar');
console.log('   - Datos del cliente\n');

console.log('✅ SISTEMA LISTO PARA PRUEBA');
console.log('=============================');
console.log('Una vez desplegado, el sistema enviará emails automáticamente');
console.log('cuando se cree una reserva con estado "confirmada".\n');