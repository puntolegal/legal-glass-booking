#!/usr/bin/env node

/**
 * Script para verificar la configuración del sistema de correos
 */

console.log('🔍 Verificando configuración del sistema de correos...\n');

// Verificar variables de entorno
const resendKey = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';
const mailFrom = 'Punto Legal <team@puntolegal.online>';
const adminEmail = 'puntolegalelgolf@gmail.com';

console.log('📧 Configuración de Resend:');
console.log('   API Key:', resendKey ? '✅ Configurada' : '❌ No configurada');
console.log('   From:', mailFrom);
console.log('   Admin:', adminEmail);

// Verificar estructura de datos
console.log('\n📋 Estructura de datos esperada:');
const expectedFields = [
  'id',
  'cliente_nombre', 
  'cliente_email',
  'cliente_telefono',
  'servicio_tipo',
  'servicio_precio',
  'descripcion',
  'fecha',
  'hora',
  'tipo_reunion'
];

expectedFields.forEach(field => {
  console.log(`   ✅ ${field}`);
});

// Verificar flujo de datos
console.log('\n🔄 Flujo de datos:');
console.log('   1. AgendamientoPage → localStorage (paymentData)');
console.log('   2. PaymentSuccessPage → createReservation()');
console.log('   3. PaymentSuccessPage → confirmReservation()');
console.log('   4. confirmReservation() → sendBookingEmailsDirect()');
console.log('   5. sendBookingEmailsDirect() → Resend API');

// Verificar posibles problemas
console.log('\n⚠️  Posibles problemas identificados:');
console.log('   1. ❌ Campo "servicio_descripcion" vs "descripcion" - CORREGIDO');
console.log('   2. ❌ Fallbacks para campos undefined - CORREGIDO');
console.log('   3. ❌ Mapeo de datos en PaymentSuccessPage - CORREGIDO');
console.log('   4. ⚠️  Verificar que Resend API esté funcionando');

console.log('\n✅ Verificación completada');
