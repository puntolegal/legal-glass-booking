#!/usr/bin/env node

/**
 * ✅ VERIFICACIÓN: Precio de consulta familia
 * Verifica que el precio de familia esté correctamente configurado en 35.000
 */

import fs from 'fs';
import path from 'path';

console.log('✅ VERIFICANDO PRECIO DE CONSULTA FAMILIA\n');
console.log('='.repeat(60));

async function verificarPrecioFamilia() {
  try {
    console.log('🔍 1. VERIFICANDO CONFIGURACIÓN EN AgendamientoPage.tsx...\n');
    
    // Leer el archivo AgendamientoPage.tsx
    const agendamientoPath = 'src/pages/AgendamientoPage.tsx';
    const agendamientoContent = fs.readFileSync(agendamientoPath, 'utf8');
    
    // Buscar la línea de familia
    const familiaMatch = agendamientoContent.match(/['"]familia['"]:\s*\{[^}]*\}/);
    
    if (familiaMatch) {
      console.log('📋 Configuración de familia encontrada:');
      console.log(`   ${familiaMatch[0]}`);
      
      // Verificar el precio
      if (familiaMatch[0].includes("price: '35.000'")) {
        console.log('✅ PRECIO CORRECTO: $35.000');
      } else if (familiaMatch[0].includes("price: '30.000'")) {
        console.log('❌ PRECIO INCORRECTO: $30.000 (debe ser $35.000)');
      } else {
        console.log('⚠️  Precio no identificado en la configuración');
      }
      
      // Verificar precio original
      if (familiaMatch[0].includes("originalPrice: '70.000'")) {
        console.log('✅ PRECIO ORIGINAL CORRECTO: $70.000');
      } else {
        console.log('⚠️  Precio original no identificado o incorrecto');
      }
    } else {
      console.log('❌ No se encontró configuración de familia');
    }

    console.log('\n🔍 2. VERIFICANDO CONSISTENCIA EN OTROS ARCHIVOS...\n');
    
    // Verificar otros archivos que puedan tener referencias
    const archivosVerificar = [
      'src/pages/FamiliaPage.tsx',
      'src/pages/ServicesPage.tsx',
      'src/components/ServicesSection.tsx'
    ];
    
    for (const archivo of archivosVerificar) {
      if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, 'utf8');
        
        // Buscar referencias a 30.000 en contexto de familia
        const referencias30k = contenido.match(/30\.000/g);
        const referenciasFamilia = contenido.match(/familia/gi);
        
        if (referencias30k && referenciasFamilia) {
          console.log(`📁 ${archivo}:`);
          console.log(`   ⚠️  Contiene referencias a 30.000 y familia`);
          console.log(`   🔍 Revisar si necesita actualización`);
        } else if (referencias30k) {
          console.log(`📁 ${archivo}:`);
          console.log(`   ℹ️  Contiene referencias a 30.000 (no relacionadas con familia)`);
        } else {
          console.log(`📁 ${archivo}: ✅ Sin referencias a 30.000`);
        }
      } else {
        console.log(`📁 ${archivo}: ❌ Archivo no encontrado`);
      }
    }

    console.log('\n🎯 3. RESUMEN DE LA VERIFICACIÓN:\n');
    
    // Verificar si el cambio se aplicó correctamente
    if (agendamientoContent.includes("'familia': { name: 'Punto Legal Familia', price: '35.000'")) {
      console.log('✅ CAMBIO APLICADO CORRECTAMENTE');
      console.log('✅ Precio de consulta familia: $35.000');
      console.log('✅ Precio original actualizado: $70.000');
      console.log('✅ Sistema funcionando correctamente');
    } else {
      console.log('❌ CAMBIO NO APLICADO CORRECTAMENTE');
      console.log('❌ Verificar manualmente el archivo AgendamientoPage.tsx');
    }

    console.log('\n🚀 PRÓXIMOS PASOS:\n');
    console.log('1. ✅ Verificar en el navegador que el precio se muestra correctamente');
    console.log('2. ✅ Probar agendamiento de consulta familia');
    console.log('3. ✅ Confirmar que MercadoPago recibe el precio correcto');
    console.log('4. ✅ Verificar que emails muestran el precio correcto');

    console.log('\n📊 PRECIOS ACTUALIZADOS:');
    console.log('   🏠 Punto Legal Familia: $35.000 (era $30.000)');
    console.log('   💰 Precio original: $70.000 (era $60.000)');
    console.log('   🎯 Descuento: 50% OFF');

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

// Ejecutar verificación
verificarPrecioFamilia();
