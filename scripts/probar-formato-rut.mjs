#!/usr/bin/env node

console.log('🧪 PROBANDO FORMATEO AUTOMÁTICO DE RUT\n');

// Función para formatear RUT automáticamente (copiada del componente)
function formatRUT(value) {
  // Eliminar todo excepto números y letras
  const cleanValue = value.replace(/[^0-9kK]/g, '');
  
  // Si está vacío, retornar vacío
  if (!cleanValue) return '';
  
  // Si solo tiene números (sin dígito verificador)
  if (cleanValue.length <= 8) {
    return cleanValue;
  }
  
  // Si tiene 9 caracteres o más, formatear
  if (cleanValue.length >= 9) {
    const rut = cleanValue.slice(0, -1); // Todos excepto el último
    const dv = cleanValue.slice(-1).toUpperCase(); // Último carácter (dígito verificador)
    
    // Formatear con puntos
    const formattedRut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Retornar con guión
    return `${formattedRut}-${dv}`;
  }
  
  return cleanValue;
}

// Casos de prueba
const testCases = [
  { input: '123456789', expected: '12.345.678-9', description: 'RUT sin formato' },
  { input: '12345678k', expected: '12.345.678-K', description: 'RUT con K minúscula' },
  { input: '12345678K', expected: '12.345.678-K', description: 'RUT con K mayúscula' },
  { input: '1234567', expected: '1234567', description: 'RUT incompleto (sin DV)' },
  { input: '12.345.678-9', expected: '12.345.678-9', description: 'RUT ya formateado' },
  { input: '12.345.678-k', expected: '12.345.678-K', description: 'RUT formateado con k minúscula' },
  { input: '12345', expected: '12345', description: 'Números parciales' },
  { input: '', expected: '', description: 'Cadena vacía' },
  { input: 'abc123456789', expected: '12.345.678-9', description: 'RUT con caracteres no válidos' },
  { input: '1234567890', expected: '123.456.789-0', description: 'RUT de 10 dígitos' },
  { input: '111111111', expected: '11.111.111-1', description: 'RUT con dígitos repetidos' }
];

console.log('📋 CASOS DE PRUEBA:');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = formatRUT(testCase.input);
  const success = result === testCase.expected;
  
  console.log(`\n${index + 1}. ${testCase.description}`);
  console.log(`   Entrada:    "${testCase.input}"`);
  console.log(`   Esperado:   "${testCase.expected}"`);
  console.log(`   Resultado:  "${result}"`);
  console.log(`   Estado:     ${success ? '✅ PASÓ' : '❌ FALLÓ'}`);
  
  if (success) {
    passed++;
  } else {
    failed++;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`📊 RESUMEN: ${passed} pasaron, ${failed} fallaron`);
console.log(`${failed === 0 ? '🎉 ¡TODAS LAS PRUEBAS PASARON!' : '⚠️ Algunas pruebas fallaron'}`);

console.log('\n💡 FUNCIONALIDAD IMPLEMENTADA:');
console.log('✅ Formateo automático de RUT con puntos y guión');
console.log('✅ Manejo de K mayúscula y minúscula');
console.log('✅ Limpieza de caracteres no válidos');
console.log('✅ Preservación de RUTs incompletos');
console.log('✅ Manejo de RUTs ya formateados');

console.log('\n🎯 LISTO PARA USAR EN EL FORMULARIO DE AGENDAMIENTO');
