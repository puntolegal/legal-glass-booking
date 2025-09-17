#!/usr/bin/env node

console.log('🔍 DEBUG: DATOS DE PAGO');
console.log('======================');
console.log('');

console.log('📋 ESTRUCTURA ESPERADA EN LOCALSTORAGE:');
console.log('=====================================');
console.log('');

const expectedStructure = {
  service: 'Consulta General',
  category: 'general',
  price: '35.000',
  fecha: '2025-01-15',
  hora: '10:00',
  tipo_reunion: 'presencial',
  cliente: {
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    telefono: '+56912345678',
    empresa: 'Empresa Test'
  },
  descripcion: 'Consulta sobre...',
  id: '1757805220824'
};

console.log(JSON.stringify(expectedStructure, null, 2));
console.log('');

console.log('🔧 CORRECCIONES APLICADAS:');
console.log('==========================');
console.log('');
console.log('✅ Acceso a datos corregido:');
console.log('   - paymentData.name → paymentData.cliente?.nombre');
console.log('   - paymentData.email → paymentData.cliente?.email');
console.log('   - paymentData.phone → paymentData.cliente?.telefono');
console.log('   - paymentData.date → paymentData.fecha');
console.log('   - paymentData.time → paymentData.hora');
console.log('');

console.log('🧪 PARA PROBAR:');
console.log('===============');
console.log('1. Ve a: http://localhost:8080/agendamiento?plan=general');
console.log('2. Completa el formulario con datos reales');
console.log('3. Haz clic en "Proceder al Pago"');
console.log('4. Selecciona "MercadoPago"');
console.log('5. Verifica que la URL ahora contenga:');
console.log('   - payer_name=[tu nombre real]');
console.log('   - payer_email=[tu email real]');
console.log('');

console.log('🎯 URL ESPERADA (ejemplo):');
console.log('==========================');
const exampleUrl = 'https://www.mercadopago.com.ar/checkout/v1/redirect?' +
  'title=Consulta+General+-+Punto+Legal&' +
  'price=35000&' +
  'currency=CLP&' +
  'payer_name=Juan+Pérez&' +
  'payer_email=juan@ejemplo.com&' +
  'success_url=http://localhost:8080/payment-success?source=mercadopago&' +
  'external_reference=PL-1757805220824';

console.log(exampleUrl);
console.log('');

console.log('✨ AHORA DEBERÍAS VER DATOS REALES EN LA URL');
console.log('');
