#!/usr/bin/env node

/**
 * Script para iniciar el backend de MercadoPago
 * Verifica dependencias y inicia el servidor
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando backend de MercadoPago...\n');

// Verificar si existe el directorio server
const serverDir = path.join(__dirname, '..', 'server');
if (!fs.existsSync(serverDir)) {
  console.error('❌ Directorio server no encontrado');
  process.exit(1);
}

// Verificar si existe package.json
const packageJsonPath = path.join(serverDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json no encontrado en server/');
  process.exit(1);
}

// Verificar si existe node_modules
const nodeModulesPath = path.join(serverDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Instalando dependencias...');
  
  const install = spawn('npm', ['install'], {
    cwd: serverDir,
    stdio: 'inherit',
    shell: true
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencias instaladas correctamente');
      startServer();
    } else {
      console.error('❌ Error instalando dependencias');
      process.exit(1);
    }
  });
} else {
  console.log('✅ Dependencias ya instaladas');
  startServer();
}

function startServer() {
  console.log('\n🚀 Iniciando servidor de MercadoPago...');
  
  const server = spawn('npm', ['start'], {
    cwd: serverDir,
    stdio: 'inherit',
    shell: true
  });
  
  server.on('close', (code) => {
    console.log(`\n📡 Servidor terminado con código ${code}`);
  });
  
  server.on('error', (error) => {
    console.error('❌ Error iniciando servidor:', error);
  });
  
  // Manejar Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo servidor...');
    server.kill('SIGINT');
    process.exit(0);
  });
}
