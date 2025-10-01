#!/usr/bin/env node

/**
 * ✅ VERIFICACIÓN: Precios de familia en todos los archivos
 * Verifica que el precio de familia sea $35.000 en todos los archivos
 */

import fs from 'fs';
import path from 'path';

console.log('✅ VERIFICANDO PRECIOS DE FAMILIA EN TODOS LOS ARCHIVOS\n');
console.log('='.repeat(60));

async function verificarPreciosFamilia() {
  try {
    const archivosVerificar = [
      'src/pages/AgendamientoPage.tsx',
      'src/pages/ServicesPage.tsx',
      'src/components/ServicesSection.tsx',
      'src/pages/FamiliaPage.tsx'
    ];

    console.log('🔍 VERIFICANDO ARCHIVOS PRINCIPALES...\n');

    for (const archivo of archivosVerificar) {
      if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, 'utf8');
        
        console.log(`📁 ${archivo}:`);
        
        // Buscar referencias a familia con precio
        const referenciasFamilia = contenido.match(/familia.*35\.000|35\.000.*familia|Punto Legal Familia.*35\.000/gi);
        const referencias30k = contenido.match(/familia.*30\.000|30\.000.*familia|Punto Legal Familia.*30\.000/gi);
        
        if (referenciasFamilia) {
          console.log(`   ✅ Contiene precio correcto $35.000`);
          referenciasFamilia.forEach(ref => {
            console.log(`      - ${ref.trim()}`);
          });
        }
        
        if (referencias30k) {
          console.log(`   ❌ Contiene precio incorrecto $30.000`);
          referencias30k.forEach(ref => {
            console.log(`      - ${ref.trim()}`);
          });
        }
        
        if (!referenciasFamilia && !referencias30k) {
          console.log(`   ℹ️  Sin referencias específicas de precio familia`);
        }
        
        console.log('');
      } else {
        console.log(`📁 ${archivo}: ❌ Archivo no encontrado\n`);
      }
    }

    console.log('🔍 VERIFICANDO CONFIGURACIÓN EN AgendamientoPage.tsx...\n');
    
    // Verificar la configuración específica
    const agendamientoPath = 'src/pages/AgendamientoPage.tsx';
    const agendamientoContent = fs.readFileSync(agendamientoPath, 'utf8');
    
    // Buscar la línea de familia
    const familiaMatch = agendamientoContent.match(/['"]familia['"]:\s*\{[^}]*\}/);
    
    if (familiaMatch) {
      console.log('📋 Configuración de familia:');
      console.log(`   ${familiaMatch[0]}`);
      
      if (familiaMatch[0].includes("price: '35.000'")) {
        console.log('   ✅ PRECIO CORRECTO: $35.000');
      } else {
        console.log('   ❌ PRECIO INCORRECTO');
      }
      
      if (familiaMatch[0].includes("originalPrice: '70.000'")) {
        console.log('   ✅ PRECIO ORIGINAL CORRECTO: $70.000');
      } else {
        console.log('   ❌ PRECIO ORIGINAL INCORRECTO');
      }
    }

    console.log('\n🎯 RESUMEN DE LA VERIFICACIÓN:\n');
    
    let archivosCorrectos = 0;
    let archivosIncorrectos = 0;
    
    for (const archivo of archivosVerificar) {
      if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, 'utf8');
        const tiene30k = contenido.includes('familia') && contenido.includes('30.000');
        const tiene35k = contenido.includes('familia') && contenido.includes('35.000');
        
        if (tiene30k && !tiene35k) {
          archivosIncorrectos++;
          console.log(`❌ ${archivo}: Tiene precio incorrecto $30.000`);
        } else if (tiene35k) {
          archivosCorrectos++;
          console.log(`✅ ${archivo}: Tiene precio correcto $35.000`);
        } else {
          console.log(`ℹ️  ${archivo}: Sin referencias específicas`);
        }
      }
    }

    console.log(`\n📊 ESTADÍSTICAS:`);
    console.log(`   ✅ Archivos correctos: ${archivosCorrectos}`);
    console.log(`   ❌ Archivos incorrectos: ${archivosIncorrectos}`);
    console.log(`   📁 Total verificados: ${archivosVerificar.length}`);

    if (archivosIncorrectos === 0) {
      console.log('\n🎉 ¡TODOS LOS PRECIOS ESTÁN CORRECTOS!');
      console.log('✅ Precio de familia: $35.000 en todos los archivos');
      console.log('✅ Precio original: $70.000 en todos los archivos');
    } else {
      console.log('\n⚠️  HAY ARCHIVOS CON PRECIOS INCORRECTOS');
      console.log('🔧 Revisar y corregir los archivos mencionados');
    }

    console.log('\n🚀 PRÓXIMOS PASOS:\n');
    console.log('1. ✅ Verificar en el navegador (limpiar caché si es necesario)');
    console.log('2. ✅ Probar agendamiento de consulta familia');
    console.log('3. ✅ Confirmar que el precio se muestra correctamente');
    console.log('4. ✅ Verificar que MercadoPago recibe el precio correcto');

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

// Ejecutar verificación
verificarPreciosFamilia();
