#!/usr/bin/env node

/**
 * Script para crear el archivo .env.local correctamente
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Creando archivo .env.local...');

const envContent = `# ❌ CRÍTICO - NO usar credenciales secretas en frontend
# VITE_MERCADOPAGO_ACCESS_TOKEN=NO_USAR_EN_FRONTEND
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key-aqui
# VITE_RESEND_API_KEY=NO_USAR_EN_FRONTEND
VITE_MAIL_FROM=Tu Nombre <tu-email@dominio.com>
VITE_ADMIN_EMAIL=tu-admin-email@dominio.com
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu-anon-key-aqui`;

const envPath = path.join(__dirname, '..', '.env.local');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Archivo .env.local creado correctamente');
  
  // Verificar que se creó bien
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  console.log(`📋 Líneas creadas: ${lines.length}`);
  
  // Verificar la API key de Supabase
  const supabaseLine = lines.find(line => line.startsWith('VITE_SUPABASE_ANON_KEY='));
  if (supabaseLine) {
    const key = supabaseLine.split('=')[1];
    console.log(`🔑 API Key de Supabase: ${key.length} caracteres`);
    if (key.length === 207) {
      console.log('✅ API Key de Supabase correcta');
    } else {
      console.log('❌ API Key de Supabase incorrecta');
    }
  }
  
} catch (error) {
  console.error('❌ Error creando archivo:', error.message);
  process.exit(1);
}
