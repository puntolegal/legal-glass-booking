/**
 * Script para iniciar automáticamente el servidor de MercadoPago
 * Verifica si está ejecutándose y lo inicia si es necesario
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const SERVER_PORT = 3001;
const SERVER_SCRIPT = 'mercadopago-backend.js';
const SERVER_DIR = 'server';

async function checkServerStatus() {
  try {
    const response = await fetch(`http://localhost:${SERVER_PORT}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Servidor MercadoPago ya está ejecutándose:', data.message);
      return true;
    }
  } catch (error) {
    console.log('⚠️ Servidor no está ejecutándose');
    return false;
  }
  return false;
}

async function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = join(process.cwd(), SERVER_DIR, SERVER_SCRIPT);
    
    if (!existsSync(serverPath)) {
      reject(new Error(`Archivo del servidor no encontrado: ${serverPath}`));
      return;
    }

    console.log('🚀 Iniciando servidor MercadoPago...');
    
    const serverProcess = spawn('node', [SERVER_SCRIPT], {
      cwd: join(process.cwd(), SERVER_DIR),
      stdio: 'pipe'
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    serverProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Servidor terminó con código ${code}`));
      }
    });

    // Esperar un poco para que el servidor se inicie
    setTimeout(async () => {
      const isRunning = await checkServerStatus();
      if (isRunning) {
        console.log('✅ Servidor MercadoPago iniciado exitosamente');
        resolve();
      } else {
        reject(new Error('Servidor no se pudo iniciar correctamente'));
      }
    }, 3000);
  });
}

async function main() {
  console.log('🔍 Verificando estado del servidor MercadoPago...');
  
  const isRunning = await checkServerStatus();
  
  if (isRunning) {
    console.log('✅ Servidor ya está ejecutándose');
    process.exit(0);
  } else {
    try {
      await startServer();
      console.log('✅ Servidor iniciado correctamente');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error iniciando servidor:', error.message);
      process.exit(1);
    }
  }
}

main();
