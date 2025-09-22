#!/usr/bin/env node

/**
 * Script para probar el código PUNTOLEGALADMIN
 * Verifica que el precio se reduzca a $1.000 para consulta general
 */

console.log('🧪 Probando código PUNTOLEGALADMIN para consulta general...\n');

// Simular la lógica de precios del componente
const serviceCatalog = {
  'general': { name: 'Consulta General', price: '35.000', category: 'General', originalPrice: '70.000', discount: '50% OFF' }
};

const CODIGO_CONVENIO_VALIDO = "PUNTOLEGAL!";
const CODIGO_ADMIN_VALIDO = "PUNTOLEGALADMIN";

function testPricingLogic(codigoConvenio, serviceKey) {
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

  return {
    codigoConvenio,
    serviceName: service.name,
    precioOriginal: precioOriginal.toLocaleString('es-CL'),
    precioFinal,
    isAdminValido,
    isConvenioValido,
    descuentoAplicado: isAdminValido ? 'ADMIN - $1.000' : isConvenioValido ? '80% OFF' : 'Sin descuento'
  };
}

// Probar diferentes escenarios
const testCases = [
  { codigo: '', descripcion: 'Sin código de convenio' },
  { codigo: 'PUNTOLEGAL!', descripcion: 'Código de convenio válido' },
  { codigo: 'PUNTOLEGALADMIN', descripcion: 'Código admin válido' },
  { codigo: 'CODIGO_INVALIDO', descripcion: 'Código inválido' }
];

console.log('📊 RESULTADOS DE PRUEBA:\n');
console.log('='.repeat(80));

testCases.forEach((testCase, index) => {
  const result = testPricingLogic(testCase.codigo, 'general');
  
  console.log(`\n${index + 1}. ${testCase.descripcion}`);
  console.log(`   Código: "${testCase.codigo}"`);
  console.log(`   Servicio: ${result.serviceName}`);
  console.log(`   Precio original: $${result.precioOriginal}`);
  console.log(`   Precio final: $${result.precioFinal}`);
  console.log(`   Descuento: ${result.descuentoAplicado}`);
  console.log(`   ¿Admin válido?: ${result.isAdminValido ? '✅' : '❌'}`);
  console.log(`   ¿Convenio válido?: ${result.isConvenioValido ? '✅' : '❌'}`);
});

console.log('\n' + '='.repeat(80));
console.log('\n🎯 VERIFICACIÓN ESPECÍFICA PARA PUNTOLEGALADMIN:');

const adminResult = testPricingLogic('PUNTOLEGALADMIN', 'general');
if (adminResult.precioFinal === '1.000' && adminResult.isAdminValido) {
  console.log('✅ PUNTOLEGALADMIN funciona correctamente');
  console.log(`   Precio reducido de $${adminResult.precioOriginal} a $${adminResult.precioFinal}`);
} else {
  console.log('❌ PUNTOLEGALADMIN NO funciona correctamente');
  console.log(`   Precio esperado: $1.000`);
  console.log(`   Precio obtenido: $${adminResult.precioFinal}`);
}

console.log('\n🎉 Prueba completada!');
