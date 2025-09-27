#!/usr/bin/env node

/**
 * Script para verificar que las variables de entorno se cargan correctamente
 * Ejecutar: node scripts/test-env-variables.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VERIFICANDO VARIABLES DE ENTORNO EN DESARROLLO\n');

// Leer archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local no encontrado');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
console.log('✅ Archivo .env.local encontrado');

// Parsear variables
const variables = {};
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      variables[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log(`📋 Variables encontradas: ${Object.keys(variables).length}`);

// ❌ CRÍTICO - NO verificar credenciales secretas en frontend
const requiredVars = [
  // 'VITE_MERCADOPAGO_ACCESS_TOKEN', // NO_USAR_EN_FRONTEND
  'VITE_MERCADOPAGO_PUBLIC_KEY',
  // 'VITE_RESEND_API_KEY', // NO_USAR_EN_FRONTEND
  'VITE_MAIL_FROM',
  'VITE_ADMIN_EMAIL',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

console.log('\n🔍 Verificando variables requeridas:');
let allPresent = true;

requiredVars.forEach(varName => {
  if (variables[varName]) {
    console.log(`   ✅ ${varName}: Configurada`);
  } else {
    console.log(`   ❌ ${varName}: Faltante`);
    allPresent = false;
  }
});

if (allPresent) {
  console.log('\n🎉 ¡Todas las variables están configuradas!');
  console.log('✅ El servidor de desarrollo debería cargar las variables correctamente');
  console.log('🔄 Si el problema persiste, reinicia el servidor con: npm run dev');
} else {
  console.log('\n⚠️ Algunas variables faltan');
  console.log('❌ Revisar el archivo .env.local');
}

console.log('\n📝 Para verificar en el navegador:');
console.log('1. Abre DevTools (F12)');
console.log('2. Ve a Console');
console.log('3. Escribe: console.log(import.meta.env)');
console.log('4. Verifica que las variables aparezcan con el prefijo VITE_');
