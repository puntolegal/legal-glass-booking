import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 PROBANDO CONEXIÓN DESDE FRONTEND\n');

// Leer variables de entorno del archivo .env.local
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

console.log(`📋 URL: ${SUPABASE_URL}`);
console.log(`🔑 Anon Key: ${SUPABASE_ANON_KEY.length} caracteres`);
console.log(`🔍 Key preview: ${SUPABASE_ANON_KEY.substring(0, 50)}...\n`);

// Crear cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🚀 Probando conexión con Supabase...\n');

async function testConnection() {
  try {
    // Probar consulta simple a la tabla reservas
    console.log('📡 Probando consulta a tabla reservas...');
    const { data, error } = await supabase
      .from('reservas')
      .select('id, nombre, email')
      .limit(5);
    
    if (error) {
      console.error('❌ Error en consulta:', error.message);
      console.error('Código:', error.code);
      console.error('Detalles:', error.details);
      return false;
    }
    
    console.log('✅ Consulta exitosa!');
    console.log(`📊 Registros encontrados: ${data.length}`);
    if (data.length > 0) {
      console.log('📋 Primeros registros:');
      data.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.nombre} (${record.email})`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 ¡CONEXIÓN EXITOSA!');
    console.log('✅ Supabase está funcionando correctamente');
    console.log('✅ El sistema debería funcionar en el frontend');
  } else {
    console.log('\n❌ CONEXIÓN FALLIDA');
    console.log('❌ Revisar configuración de Supabase');
  }
});
