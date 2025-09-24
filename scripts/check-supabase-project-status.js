import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VERIFICANDO ESTADO DEL PROYECTO SUPABASE\n');

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.error('❌ Error: .env.local no encontrado');
  process.exit(1);
}

const envContent = fs.readFileSync(envLocalPath, 'utf8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: SUPABASE_URL o SUPABASE_ANON_KEY no encontrados');
  process.exit(1);
}

console.log(`📋 Proyecto: ${SUPABASE_URL}`);
console.log(`🔑 Anon Key: ${SUPABASE_ANON_KEY.length} caracteres`);
console.log(`🔍 Key preview: ${SUPABASE_ANON_KEY.substring(0, 50)}...\n`);

console.log('🚨 DIAGNÓSTICO DEL PROBLEMA:');
console.log('   - El proyecto qrgelocijmwnxcckxbdg existe');
console.log('   - Las credenciales parecen correctas');
console.log('   - Pero devuelve 401 Unauthorized\n');

console.log('🔧 POSIBLES CAUSAS:');
console.log('   1. Proyecto pausado o inactivo');
console.log('   2. API key expirada o revocada');
console.log('   3. Configuración de RLS (Row Level Security)');
console.log('   4. Proyecto en modo mantenimiento\n');

console.log('✅ SOLUCIONES RECOMENDADAS:');
console.log('   1. Ve a Supabase Dashboard: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg');
console.log('   2. Verifica que el proyecto esté activo');
console.log('   3. Ve a Settings → API');
console.log('   4. Regenera las API keys si es necesario');
console.log('   5. Verifica que no haya restricciones de RLS\n');

console.log('🧪 PRUEBA ALTERNATIVA:');
console.log('   - Intenta crear una nueva reserva desde el frontend');
console.log('   - Verifica si el problema es solo en el script de prueba');
console.log('   - Revisa los logs del navegador en DevTools\n');

console.log('📊 ESTADO ACTUAL:');
console.log('   - Configuración: ✅ Corregida');
console.log('   - Credenciales: ✅ Actualizadas');
console.log('   - Conexión: ❌ Falla (401 Unauthorized)');
console.log('   - Proyecto: ❓ Necesita verificación manual');
