#!/usr/bin/env node

/**
 * Script para verificar variables de entorno en el build
 * Ejecutar: node scripts/check-env-build.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VERIFICANDO VARIABLES DE ENTORNO EN BUILD\n');

// Cargar configuración de producción
const configPath = path.join(__dirname, '..', 'production-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('📋 Variables que deben estar en el build:');
Object.entries(config.variables).forEach(([key, value]) => {
  console.log(`   ${key}: ${value.substring(0, 20)}...`);
});

// Verificar si existe el build
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.log('\n❌ No se encontró el build. Ejecuta primero:');
  console.log('   node scripts/deploy-ionos.js');
  process.exit(1);
}

console.log('\n✅ Build encontrado en dist/');
console.log(`📁 Ruta del build: ${distPath}`);

// Leer archivos del build para verificar si las variables están incluidas
let allContent = '';

// Leer index.html
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  allContent += fs.readFileSync(indexPath, 'utf8');
  console.log(`📄 index.html leído: ${fs.readFileSync(indexPath, 'utf8').length} caracteres`);
}

// Leer archivos JS
const assetsPath = path.join(distPath, 'assets');
console.log(`🔍 Buscando carpeta assets en: ${assetsPath}`);
console.log(`🔍 Existe: ${fs.existsSync(assetsPath)}`);

if (fs.existsSync(assetsPath)) {
  const jsFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.js'));
  console.log(`📁 Archivos JS encontrados: ${jsFiles.length}`);
  jsFiles.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    allContent += content;
    console.log(`📄 ${file}: ${content.length} caracteres`);
  });
} else {
  console.log('❌ Carpeta assets no encontrada');
}

  console.log('\n🔍 Verificando variables en el build...');
  console.log(`📏 Tamaño del contenido leído: ${allContent.length} caracteres`);

  let foundVariables = 0;
  Object.entries(config.variables).forEach(([key, value]) => {
    // Buscar el valor de la variable en el código compilado
    const found = allContent.includes(value);
    console.log(`   ${found ? '✅' : '❌'} ${key}: ${found ? 'Valor encontrado' : 'Valor NO encontrado'} (buscando: ${value.substring(0, 20)}...)`);
    if (found) foundVariables++;
  });

console.log(`\n📊 Resumen: ${foundVariables}/${Object.keys(config.variables).length} variables encontradas`);

if (foundVariables === Object.keys(config.variables).length) {
  console.log('\n🎉 ¡Todas las variables están en el build!');
  console.log('✅ El build está listo para producción');
} else {
  console.log('\n⚠️ Algunas variables faltan en el build');
  console.log('❌ Revisar configuración de variables de entorno');
}

// Verificar archivos de assets
if (fs.existsSync(assetsPath)) {
  const assets = fs.readdirSync(assetsPath);
  console.log(`\n📁 Assets generados: ${assets.length}`);
  
  // Buscar archivos JS que contengan las variables
  const jsFiles = assets.filter(file => file.endsWith('.js'));
  console.log(`📄 Archivos JS: ${jsFiles.length}`);
  
  jsFiles.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    let varsInFile = 0;
    Object.entries(config.variables).forEach(([key, value]) => {
      if (content.includes(value)) {
        varsInFile++;
      }
    });
    
    if (varsInFile > 0) {
      console.log(`   📄 ${file}: ${varsInFile} variables encontradas`);
    }
  });
}

console.log('\n🚀 Para deploy en IONOS:');
console.log('1. Subir archivos de dist/ al servidor');
console.log('2. Configurar variables de entorno en IONOS');
console.log('3. Verificar que las variables se carguen correctamente');
