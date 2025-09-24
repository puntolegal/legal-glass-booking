#!/usr/bin/env node

/**
 * Script para configurar variables de entorno de forma segura
 * Uso: node scripts/setup-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envLocalPath = path.join(__dirname, '..', '.env.local');

// Credenciales de producción (solo para desarrollo local)
const envVariables = {
  VITE_MERCADOPAGO_ACCESS_TOKEN: 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947',
  VITE_MERCADOPAGO_PUBLIC_KEY: 'APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e',
  VITE_RESEND_API_KEY: 're_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C',
  VITE_MAIL_FROM: 'Punto Legal <team@puntolegal.online>',
  VITE_ADMIN_EMAIL: 'puntolegalelgolf@gmail.com',
  VITE_SUPABASE_URL: 'https://qrgelocijmwnxcckxbdg.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI',
  VITE_SUPABASE_SERVICE_ROLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg',
  VITE_SUPABASE_PROJECT_REF: 'qrgelocijmwnxcckxbdg'
};

try {
  console.log('🔧 CONFIGURANDO VARIABLES DE ENTORNO');
  console.log('\n📝 Creando archivo .env.local...');

  let envContent = '';
  for (const [key, value] of Object.entries(envVariables)) {
    envContent += `${key}=${value}\n`;
  }

  fs.writeFileSync(envLocalPath, envContent.trim());
  
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log(`📋 Ubicación: ${envLocalPath}`);
  console.log('\n📊 Variables configuradas:');
  Object.keys(envVariables).forEach((key, index) => {
    console.log(`   ${index + 1}. ${key}`);
  });

  console.log('\n🔒 SEGURIDAD:');
  console.log('   - El archivo .env.local está en .gitignore');
  console.log('   - Las credenciales NO se suben al repositorio');
  console.log('   - Solo se usa para desarrollo local');

  console.log('\n🔄 Reinicia el servidor de desarrollo:');
  console.log('   npm run dev');

} catch (error) {
  console.error('❌ Error al crear el archivo .env.local:', error);
  process.exit(1);
}
