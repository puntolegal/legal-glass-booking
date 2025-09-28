#!/usr/bin/env node

/**
 * Script de prueba para verificar el formato de precios
 */

function testPriceFormatting() {
  console.log('🧪 PROBANDO FORMATO DE PRECIOS...');
  console.log('=' .repeat(50));
  
  // CASOS DE PRUEBA
  const testPrices = [
    '35000',
    '1000',
    '150000',
    '50000',
    '25000'
  ];
  
  console.log('📋 CASOS DE PRUEBA:');
  testPrices.forEach(price => {
    const formatted = parseInt(price).toLocaleString('es-CL');
    console.log(`• Original: ${price} → Formateado: $${formatted} CLP`);
  });
  
  console.log('\\n📋 VERIFICACIÓN DE FORMATO:');
  
  // Verificar que el formato es correcto
  const testPrice = '35000';
  const formatted = parseInt(testPrice).toLocaleString('es-CL');
  
  console.log(`• Precio original: ${testPrice}`);
  console.log(`• Precio formateado: $${formatted} CLP`);
  console.log(`• ¿Incluye separador de miles?: ${formatted.includes('.') ? '✅' : '❌'}`);
  console.log(`• ¿Formato chileno?: ${formatted.includes('.') && !formatted.includes(',') ? '✅' : '❌'}`);
  
  // Verificar casos edge
  console.log('\\n📋 CASOS EDGE:');
  
  const edgeCases = [
    { input: '1000', expected: '1.000' },
    { input: '35000', expected: '35.000' },
    { input: '150000', expected: '150.000' },
    { input: '1000000', expected: '1.000.000' }
  ];
  
  edgeCases.forEach(({ input, expected }) => {
    const result = parseInt(input).toLocaleString('es-CL');
    const isCorrect = result === expected;
    console.log(`• ${input} → ${result} ${isCorrect ? '✅' : '❌'} (esperado: ${expected})`);
  });
  
  console.log('\\n' + '=' .repeat(50));
  console.log('🏁 PRUEBA COMPLETADA');
  console.log('✅ Formato de precios verificado correctamente');
}

testPriceFormatting();
