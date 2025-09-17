// Script para configurar Supabase con tabla de reservas
// Archivo: scripts/setup-supabase-reservas.cjs

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Supabase para sistema de reservas...');

// Leer configuración actual de Supabase
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Archivo .env encontrado');
} else {
  console.log('📄 Creando nuevo archivo .env');
}

// Configuración de Supabase para reservas
const supabaseConfig = `
# Configuración de Supabase para reservas
# Obtener desde: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Configuración de Edge Functions
VITE_SUPABASE_FUNCTIONS_URL=https://tu-proyecto.supabase.co/functions/v1
`;

// Verificar si ya existe configuración de Supabase
if (!envContent.includes('VITE_SUPABASE_URL')) {
  // Agregar configuración de Supabase
  const updatedContent = envContent + supabaseConfig;
  
  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ Configuración de Supabase agregada al .env');
  } catch (error) {
    console.error('❌ Error escribiendo .env:', error.message);
  }
} else {
  console.log('ℹ️ Configuración de Supabase ya existe en .env');
}

// Crear archivo de configuración para deployment
const deployConfig = `-- Comandos para configurar Supabase
-- Ejecutar en el SQL Editor de Supabase Dashboard

-- 1. Aplicar migración de tabla de reservas
-- Copiar y pegar el contenido de: supabase/migrations/20250113000000-create-reservas-table.sql

-- 2. Configurar Edge Function para emails
-- Ejecutar en terminal:
-- supabase functions deploy send-booking-email

-- 3. Configurar variables de entorno en Supabase
-- Ir a: Project Settings > Edge Functions > Environment Variables
-- Agregar:
-- SUPABASE_URL: https://tu-proyecto.supabase.co
-- SUPABASE_SERVICE_ROLE_KEY: tu-service-role-key

-- 4. Habilitar autenticación por email (opcional)
-- Ir a: Authentication > Settings > Email Auth
-- Configurar SMTP para envío de emails

-- 5. Configurar políticas RLS si es necesario
-- Las políticas ya están incluidas en la migración

-- 6. Probar Edge Function
-- curl -X POST 'https://tu-proyecto.supabase.co/functions/v1/send-booking-email' \
--   -H 'Authorization: Bearer tu-anon-key' \
--   -H 'Content-Type: application/json' \
--   -d '{
--     "bookingData": {
--       "cliente": {
--         "nombre": "Test User",
--         "email": "test@example.com",
--         "telefono": "+56912345678"
--       },
--       "servicio": {
--         "tipo": "Consulta Test",
--         "precio": "0",
--         "fecha": "2025-01-15",
--         "hora": "10:00"
--       }
--     }
--   }'
`;

const deployPath = path.join(__dirname, '..', 'SUPABASE_SETUP_COMMANDS.sql');
fs.writeFileSync(deployPath, deployConfig);
console.log('📋 Comandos de configuración creados en: SUPABASE_SETUP_COMMANDS.sql');

// Mostrar instrucciones
console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('\n1. 🌐 Crear proyecto en Supabase:');
console.log('   - Ir a: https://supabase.com/dashboard');
console.log('   - Crear nuevo proyecto');
console.log('   - Copiar URL y API Keys');

console.log('\n2. 🔑 Actualizar credenciales en .env:');
console.log('   - VITE_SUPABASE_URL=https://tu-proyecto.supabase.co');
console.log('   - VITE_SUPABASE_ANON_KEY=tu-anon-key');
console.log('   - SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key');

console.log('\n3. 🗄️ Aplicar migración de base de datos:');
console.log('   - Ir a: Supabase Dashboard > SQL Editor');
console.log('   - Ejecutar: supabase/migrations/20250113000000-create-reservas-table.sql');

console.log('\n4. 📧 Configurar Edge Function para emails:');
console.log('   - Instalar CLI: npm install -g supabase');
console.log('   - Login: supabase login');
console.log('   - Deploy: supabase functions deploy send-booking-email');

console.log('\n5. 🧪 Probar el sistema:');
console.log('   - npm run dev');
console.log('   - Ir a: http://localhost:8081/agendamiento?plan=gratis');
console.log('   - Completar formulario y verificar emails');

console.log('\n📧 CONFIGURACIÓN DE EMAILS:');
console.log('   - Los emails se envían automáticamente via Supabase Auth');
console.log('   - Para producción, configurar SMTP en Supabase Dashboard');
console.log('   - Authentication > Settings > SMTP Settings');

console.log('\n✅ ¡Configuración inicial completada!');
console.log('\n💡 Tip: Revisa SUPABASE_SETUP_COMMANDS.sql para comandos detallados');

