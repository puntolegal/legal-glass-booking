#!/usr/bin/env node

/**
 * Script para hacer build de producción con variables de entorno
 * Ejecutar: node scripts/build-production.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 BUILD DE PRODUCCIÓN - PUNTO LEGAL\n');

// Cargar configuración de producción
const configPath = path.join(__dirname, '..', 'production-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('📋 Configuración cargada:');
console.log(`   Entorno: ${config.environment}`);
console.log(`   Variables: ${Object.keys(config.variables).length}`);
console.log(`   URLs: ${Object.keys(config.urls).length}`);

// Crear archivo .env temporal para el build
const envContent = Object.entries(config.variables)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

const envPath = path.join(__dirname, '..', '.env.production.temp');
fs.writeFileSync(envPath, envContent);

console.log('✅ Archivo .env temporal creado');

try {
  // Hacer build de producción
  console.log('\n🔨 Iniciando build de producción...');
  
  const buildCommand = 'npm run build';
  console.log(`Ejecutando: ${buildCommand}`);
  
  execSync(buildCommand, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      ...config.variables,
      NODE_ENV: 'production'
    }
  });
  
  console.log('✅ Build de producción completado');
  
  // Limpiar archivo temporal
  fs.unlinkSync(envPath);
  console.log('🧹 Archivo temporal eliminado');
  
  console.log('\n🎉 ¡BUILD DE PRODUCCIÓN EXITOSO!');
  console.log('📁 Archivos generados en: dist/');
  console.log('🚀 Listo para deploy');
  
} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  
  // Limpiar archivo temporal en caso de error
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
  }
  
  process.exit(1);
}
