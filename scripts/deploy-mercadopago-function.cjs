#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DEPLOYANDO EDGE FUNCTION DE MERCADOPAGO');
console.log('==========================================');

// Verificar que Supabase CLI esté instalado
try {
  execSync('supabase --version', { stdio: 'pipe' });
  console.log('✅ Supabase CLI encontrado');
} catch (error) {
  console.error('❌ Supabase CLI no encontrado. Instálalo con:');
  console.error('npm install -g supabase');
  process.exit(1);
}

// Verificar que estemos en el directorio correcto
const currentDir = process.cwd();
const expectedFiles = ['supabase', 'src', 'package.json'];
const hasRequiredFiles = expectedFiles.every(file => 
  fs.existsSync(path.join(currentDir, file))
);

if (!hasRequiredFiles) {
  console.error('❌ Ejecuta este script desde la raíz del proyecto');
  process.exit(1);
}

console.log('📁 Directorio correcto verificado');

// Verificar que el Edge Function existe
const functionPath = path.join(currentDir, 'supabase', 'functions', 'create-mercadopago-preference', 'index.ts');
if (!fs.existsSync(functionPath)) {
  console.error('❌ Edge Function no encontrado en:', functionPath);
  process.exit(1);
}

console.log('📄 Edge Function encontrado');

// Instrucciones para el usuario
console.log('\\n📋 PASOS PARA COMPLETAR EL DEPLOYMENT:');
console.log('=====================================');

console.log('\\n1. 🔐 CONFIGURAR VARIABLES DE ENTORNO:');
console.log('   Ejecuta este comando para configurar tu Access Token de MercadoPago:');
console.log('   ');
console.log('   supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-4010337867785275-091313-920eb61517cac97567e501a9b30592eb-2685419265');
console.log('   ');

console.log('\\n2. 🚀 DEPLOYAR LA FUNCIÓN:');
console.log('   Ejecuta este comando para deployar:');
console.log('   ');
console.log('   supabase functions deploy create-mercadopago-preference');
console.log('   ');

console.log('\\n3. 🧪 PROBAR LA FUNCIÓN:');
console.log('   Después del deployment, podrás probar MercadoPago con preferencias reales');
console.log('   ');

console.log('\\n4. 📝 COMANDOS COMPLETOS:');
console.log('   # Configurar secret');
console.log('   supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-4010337867785275-091313-920eb61517cac97567e501a9b30592eb-2685419265');
console.log('   ');
console.log('   # Deployar función');
console.log('   supabase functions deploy create-mercadopago-preference');
console.log('   ');

console.log('\\n✨ DESPUÉS DEL DEPLOYMENT:');
console.log('========================');
console.log('- La aplicación creará preferencias REALES en MercadoPago');
console.log('- Los IDs de preferencia serán válidos');
console.log('- El Wallet Brick funcionará correctamente');
console.log('- Podrás usar tarjetas de prueba para testing');
console.log('');

console.log('🎯 ¿LISTO PARA DEPLOYAR?');
console.log('Copia y pega los comandos de arriba uno por uno.');
console.log('');
