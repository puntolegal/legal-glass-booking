#!/usr/bin/env node

/**
 * Script para probar el flujo completo del código PUNTOLEGALADMIN
 * Simula el proceso desde agendamiento hasta MercadoPago
 */

console.log('🧪 Probando flujo completo del código PUNTOLEGALADMIN...\n');

// Simular la lógica completa del sistema
const serviceCatalog = {
  'general': { name: 'Consulta General', price: '35.000', category: 'General', originalPrice: '70.000', discount: '50% OFF' }
};

const CODIGO_CONVENIO_VALIDO = "PUNTOLEGAL!";
const CODIGO_ADMIN_VALIDO = "PUNTOLEGALADMIN";

function simulateAgendamientoFlow(codigoConvenio, serviceKey) {
  console.log(`\n📋 SIMULANDO AGENDAMIENTO CON CÓDIGO: "${codigoConvenio}"`);
  console.log('='.repeat(60));
  
  const service = serviceCatalog[serviceKey];
  const isConvenioValido = codigoConvenio === CODIGO_CONVENIO_VALIDO;
  const isAdminValido = codigoConvenio === CODIGO_ADMIN_VALIDO;
  const descuentoConvenio = 0.8; // 80% de descuento
  const precioAdmin = 1000; // Precio fijo para código admin
  const precioOriginal = parseFloat(service.price?.replace(/\./g, '') || '0');
  
  let precioFinal;
  if (isAdminValido) {
    precioFinal = precioAdmin.toLocaleString('es-CL');
  } else if (isConvenioValido) {
    const precioConConvenio = precioOriginal * (1 - descuentoConvenio);
    precioFinal = Math.round(precioConConvenio).toLocaleString('es-CL');
  } else {
    precioFinal = precioOriginal.toLocaleString('es-CL');
  }

  // Simular datos que se guardarían en localStorage
  const agendamientoData = {
    cliente: {
      nombre: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      telefono: '+56912345678'
    },
    servicio: {
      tipo: service.name,
      precio: precioFinal,
      descripcion: `${service.category}${isAdminValido ? ' - ADMIN $1.000' : isConvenioValido ? ' - CONVENIO 80% OFF' : ''}`,
      fecha: '2024-01-15',
      hora: '10:00'
    },
    pago: {
      monto: parseInt(precioFinal.replace(/\./g, '')),
      estado: 'pending'
    },
    codigoConvenio: codigoConvenio,
    isAdminValido: isAdminValido,
    isConvenioValido: isConvenioValido
  };

  console.log(`✅ Servicio: ${service.name}`);
  console.log(`✅ Categoría: ${service.category}`);
  console.log(`✅ Precio original: $${precioOriginal.toLocaleString('es-CL')}`);
  console.log(`✅ Precio final: $${precioFinal}`);
  console.log(`✅ Código admin válido: ${isAdminValido ? 'SÍ' : 'NO'}`);
  console.log(`✅ Código convenio válido: ${isConvenioValido ? 'SÍ' : 'NO'}`);
  
  if (isAdminValido) {
    console.log(`🎯 BADGE ESPERADO: ADMIN - $1.000 (púrpura)`);
  } else if (isConvenioValido) {
    console.log(`🎯 BADGE ESPERADO: 80% OFF (verde)`);
  } else {
    console.log(`🎯 BADGE ESPERADO: 50% OFF (naranja)`);
  }

  return agendamientoData;
}

function simulateMercadoPagoFlow(agendamientoData) {
  console.log(`\n💳 SIMULANDO MERCADOPAGO`);
  console.log('='.repeat(60));
  
  const paymentData = {
    amount: agendamientoData.pago.monto,
    description: `${agendamientoData.servicio.tipo} - Punto Legal`,
    payer: {
      name: agendamientoData.cliente.nombre,
      email: agendamientoData.cliente.email,
      phone: {
        number: agendamientoData.cliente.telefono
      }
    },
    metadata: {
      codigo_convenio: agendamientoData.codigoConvenio || null,
      descuento_convenio: agendamientoData.isConvenioValido || false,
      precio_original: agendamientoData.servicio.precio,
      porcentaje_descuento: agendamientoData.isAdminValido ? 'ADMIN' : agendamientoData.isConvenioValido ? '80%' : '50%'
    }
  };

  console.log(`✅ Monto a pagar: $${paymentData.amount.toLocaleString('es-CL')}`);
  console.log(`✅ Descripción: ${paymentData.description}`);
  console.log(`✅ Código convenio: ${paymentData.metadata.codigo_convenio || 'Ninguno'}`);
  console.log(`✅ Descuento aplicado: ${paymentData.metadata.porcentaje_descuento}`);

  return paymentData;
}

// Probar diferentes escenarios
const testCases = [
  { codigo: '', descripcion: 'Sin código' },
  { codigo: 'PUNTOLEGAL!', descripcion: 'Código convenio' },
  { codigo: 'PUNTOLEGALADMIN', descripcion: 'Código admin' }
];

console.log('🚀 INICIANDO PRUEBAS DEL FLUJO COMPLETO\n');

testCases.forEach((testCase, index) => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`PRUEBA ${index + 1}: ${testCase.descripcion.toUpperCase()}`);
  console.log(`${'='.repeat(80)}`);
  
  const agendamientoData = simulateAgendamientoFlow(testCase.codigo, 'general');
  const paymentData = simulateMercadoPagoFlow(agendamientoData);
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`   Precio original: $35.000`);
  console.log(`   Precio final: $${paymentData.amount.toLocaleString('es-CL')}`);
  console.log(`   Ahorro: $${(35000 - paymentData.amount).toLocaleString('es-CL')}`);
  console.log(`   Descuento: ${paymentData.metadata.porcentaje_descuento}`);
});

console.log(`\n${'='.repeat(80)}`);
console.log('🎯 VERIFICACIÓN FINAL PARA PUNTOLEGALADMIN:');

const adminFlow = simulateAgendamientoFlow('PUNTOLEGALADMIN', 'general');
const adminPayment = simulateMercadoPagoFlow(adminFlow);

if (adminPayment.amount === 1000) {
  console.log('✅ PUNTOLEGALADMIN funciona perfectamente en todo el flujo');
  console.log(`   Precio reducido de $35.000 a $1.000`);
  console.log(`   Ahorro total: $34.000`);
} else {
  console.log('❌ PUNTOLEGALADMIN NO funciona correctamente');
  console.log(`   Precio esperado: $1.000`);
  console.log(`   Precio obtenido: $${adminPayment.amount.toLocaleString('es-CL')}`);
}

console.log('\n🎉 Prueba del flujo completo terminada!');
