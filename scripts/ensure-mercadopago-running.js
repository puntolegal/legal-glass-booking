/**
 * Script para asegurar que el servidor de MercadoPago esté ejecutándose
 * Se ejecuta automáticamente y reinicia el servidor si es necesario
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkServerStatus() {
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Servidor MercadoPago funcionando:', data.message);
      return true;
    }
  } catch (error) {
    console.log('⚠️ Servidor no responde');
    return false;
  }
  return false;
}

async function killExistingServer() {
  try {
    console.log('🔄 Deteniendo servidor existente...');
    await execAsync('pkill -f mercadopago-backend.js');
    console.log('✅ Servidor anterior detenido');
  } catch (error) {
    console.log('ℹ️ No había servidor ejecutándose');
  }
}

async function startServer() {
  try {
    console.log('🚀 Iniciando servidor MercadoPago...');
    
    // Cambiar al directorio del servidor e iniciarlo en background
    const { stdout, stderr } = await execAsync('cd server && node mercadopago-backend.js &');
    
    if (stderr) {
      console.log('⚠️ Advertencias del servidor:', stderr);
    }
    
    console.log('✅ Servidor iniciado en background');
    
    // Esperar un poco para que se inicie
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar que esté funcionando
    const isRunning = await checkServerStatus();
    if (isRunning) {
      console.log('✅ Servidor MercadoPago funcionando correctamente');
      return true;
    } else {
      console.log('❌ Servidor no se pudo iniciar correctamente');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Verificando servidor MercadoPago...');
  
  const isRunning = await checkServerStatus();
  
  if (isRunning) {
    console.log('✅ Servidor ya está funcionando');
    return;
  }
  
  console.log('⚠️ Servidor no está funcionando, reiniciando...');
  
  await killExistingServer();
  const started = await startServer();
  
  if (started) {
    console.log('🎉 Servidor MercadoPago listo para usar');
  } else {
    console.log('❌ No se pudo iniciar el servidor');
    console.log('💡 Ejecuta manualmente: cd server && node mercadopago-backend.js');
  }
}

main().catch(console.error);
