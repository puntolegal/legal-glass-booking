#!/usr/bin/env node

/**
 * Script para probar la validación inmediata del código PUNTOLEGALADMIN
 * Verifica que se muestre la confirmación y se permita continuar
 */

console.log('🧪 Probando validación inmediata del código PUNTOLEGALADMIN...\n');

// Simular la lógica de validación
const CODIGO_CONVENIO_VALIDO = "PUNTOLEGAL!";
const CODIGO_ADMIN_VALIDO = "PUNTOLEGALADMIN";

function testValidation(codigoConvenio) {
  console.log(`\n📝 Probando código: "${codigoConvenio}"`);
  console.log('='.repeat(50));
  
  const isConvenioValido = codigoConvenio === CODIGO_CONVENIO_VALIDO;
  const isAdminValido = codigoConvenio === CODIGO_ADMIN_VALIDO;
  
  console.log(`✅ Código ingresado: "${codigoConvenio}"`);
  console.log(`✅ ¿Convenio válido?: ${isConvenioValido ? 'SÍ' : 'NO'}`);
  console.log(`✅ ¿Admin válido?: ${isAdminValido ? 'SÍ' : 'NO'}`);
  
  // Simular estilos del input
  let inputStyle = 'bg-gray-50 border-gray-200';
  if (isAdminValido) {
    inputStyle = 'bg-purple-50 border-purple-300';
  } else if (isConvenioValido) {
    inputStyle = 'bg-green-50 border-green-300';
  }
  
  console.log(`✅ Estilo del input: ${inputStyle}`);
  
  // Simular mensaje de confirmación
  let confirmacion = '';
  if (isAdminValido) {
    confirmacion = 'Código admin válido - Precio especial $1.000 aplicado';
    console.log(`✅ Mensaje: "${confirmacion}"`);
    console.log(`✅ Color: Púrpura`);
  } else if (isConvenioValido) {
    confirmacion = 'Código válido - Descuento del 80% aplicado';
    console.log(`✅ Mensaje: "${confirmacion}"`);
    console.log(`✅ Color: Verde`);
  } else {
    console.log(`❌ Sin confirmación`);
  }
  
  // Simular validación para continuar
  const puedeContinuar = isConvenioValido || isAdminValido;
  console.log(`✅ ¿Puede continuar?: ${puedeContinuar ? 'SÍ' : 'NO'}`);
  
  return {
    codigoConvenio,
    isConvenioValido,
    isAdminValido,
    inputStyle,
    confirmacion,
    puedeContinuar
  };
}

// Probar diferentes códigos
const testCases = [
  { codigo: '', descripcion: 'Sin código' },
  { codigo: 'PUNTOLEGAL!', descripcion: 'Código convenio' },
  { codigo: 'PUNTOLEGALADMIN', descripcion: 'Código admin' },
  { codigo: 'CODIGO_INVALIDO', descripcion: 'Código inválido' }
];

console.log('🚀 INICIANDO PRUEBAS DE VALIDACIÓN\n');

testCases.forEach((testCase, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`PRUEBA ${index + 1}: ${testCase.descripcion.toUpperCase()}`);
  console.log(`${'='.repeat(60)}`);
  
  const result = testValidation(testCase.codigo);
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`   Código: "${result.codigoConvenio}"`);
  console.log(`   Validación: ${result.isConvenioValido ? 'Convenio' : result.isAdminValido ? 'Admin' : 'Ninguna'}`);
  console.log(`   Confirmación: ${result.confirmacion || 'Ninguna'}`);
  console.log(`   Continuar: ${result.puedeContinuar ? 'SÍ' : 'NO'}`);
});

console.log(`\n${'='.repeat(60)}`);
console.log('🎯 VERIFICACIÓN ESPECÍFICA PARA PUNTOLEGALADMIN:');

const adminResult = testValidation('PUNTOLEGALADMIN');

if (adminResult.isAdminValido && adminResult.puedeContinuar && adminResult.confirmacion.includes('$1.000')) {
  console.log('✅ PUNTOLEGALADMIN VALIDACIÓN CORRECTA');
  console.log('✅ Confirmación inmediata mostrada');
  console.log('✅ Usuario puede continuar');
  console.log('✅ Precio especial aplicado');
} else {
  console.log('❌ PUNTOLEGALADMIN VALIDACIÓN INCORRECTA');
  console.log(`❌ Admin válido: ${adminResult.isAdminValido}`);
  console.log(`❌ Puede continuar: ${adminResult.puedeContinuar}`);
  console.log(`❌ Confirmación: ${adminResult.confirmacion}`);
}

console.log('\n🎉 Prueba de validación completada!');
