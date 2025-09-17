// Script para actualizar credenciales de Supabase
// Archivo: scripts/update-supabase-keys.cjs

const fs = require('fs');
const path = require('path');

console.log('🔑 Actualizando credenciales de Supabase...');

// Nuevas credenciales proporcionadas
const SUPABASE_CREDENTIALS = {
  SECRET_KEY: 'sb_secret_3iFfSjSLf7OC5ewkCLLmVQ_jnsyd0UI',
  PUBLISHABLE_KEY: 'sb_publishable_nEzZtRLnXmnOGNJgNU3gMQ_1yGhX0l9'
};

// Extraer URL del proyecto desde la publishable key
// Formato: sb_publishable_[PROJECT_REF]_[RANDOM]
const projectRef = SUPABASE_CREDENTIALS.PUBLISHABLE_KEY.split('_')[2]; // nEzZtRLnXmnOGNJgNU3gMQ
const SUPABASE_URL = `https://${projectRef}.supabase.co`;

console.log('🎯 Proyecto Supabase detectado:', projectRef);
console.log('🌐 URL:', SUPABASE_URL);

// Leer archivo .env actual
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Archivo .env encontrado');
  
  // Crear backup
  const backupPath = envPath + '.backup.' + Date.now();
  fs.writeFileSync(backupPath, envContent);
  console.log('💾 Backup creado:', backupPath);
} else {
  console.log('📄 Creando nuevo archivo .env');
}

// Actualizar o agregar credenciales de Supabase
let updatedContent = envContent;

// Remover credenciales anteriores de Supabase si existen
updatedContent = updatedContent.replace(/VITE_SUPABASE_URL=.*/g, '');
updatedContent = updatedContent.replace(/VITE_SUPABASE_ANON_KEY=.*/g, '');
updatedContent = updatedContent.replace(/SUPABASE_SERVICE_ROLE_KEY=.*/g, '');
updatedContent = updatedContent.replace(/VITE_SUPABASE_FUNCTIONS_URL=.*/g, '');

// Limpiar líneas vacías múltiples
updatedContent = updatedContent.replace(/\n\s*\n\s*\n/g, '\n\n');

// Agregar nuevas credenciales
const supabaseConfig = `
# Configuración de Supabase - Proyecto: ${projectRef}
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_CREDENTIALS.PUBLISHABLE_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_CREDENTIALS.SECRET_KEY}
VITE_SUPABASE_FUNCTIONS_URL=${SUPABASE_URL}/functions/v1
`;

updatedContent += supabaseConfig;

// Escribir archivo actualizado
try {
  fs.writeFileSync(envPath, updatedContent);
  console.log('✅ Credenciales de Supabase actualizadas exitosamente');
} catch (error) {
  console.error('❌ Error escribiendo .env:', error.message);
  process.exit(1);
}

// Mostrar configuración
console.log('\n📊 CONFIGURACIÓN ACTUALIZADA:');
console.log('🌐 URL:', SUPABASE_URL);
console.log('🔑 Publishable Key:', SUPABASE_CREDENTIALS.PUBLISHABLE_KEY.substring(0, 20) + '...');
console.log('🔐 Secret Key:', SUPABASE_CREDENTIALS.SECRET_KEY.substring(0, 20) + '...');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('1. 🗄️ Aplicar migración de base de datos');
console.log('2. 📧 Deployar Edge Function para emails');
console.log('3. 💳 Integrar con MercadoPago');
console.log('4. 🧪 Probar sistema completo');

console.log('\n✅ ¡Credenciales actualizadas! Reinicia el servidor: npm run dev');

