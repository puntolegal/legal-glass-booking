// Verificar credenciales de Supabase
// Archivo: scripts/verify-supabase-credentials.cjs

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando credenciales de Supabase...');

// Leer credenciales del .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Extraer credenciales
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
const secretMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error('❌ No se encontraron credenciales de Supabase en .env');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();
const supabaseSecret = secretMatch ? secretMatch[1].trim() : 'No encontrado';

console.log('\n📊 CREDENCIALES ACTUALES:');
console.log('🌐 URL:', supabaseUrl);
console.log('🔑 Publishable Key:', supabaseKey);
console.log('🔐 Secret Key:', supabaseSecret.substring(0, 20) + '...');

// Analizar las credenciales
console.log('\n🔍 ANÁLISIS DE CREDENCIALES:');

// Verificar formato de URL
const urlPattern = /https:\/\/([a-zA-Z0-9]+)\.supabase\.co/;
const urlMatch2 = supabaseUrl.match(urlPattern);

if (urlMatch2) {
  const projectRef = urlMatch2[1];
  console.log('✅ Formato de URL correcto');
  console.log('🎯 Project Ref extraído:', projectRef);
  
  // Verificar si el project ref coincide con las keys
  if (supabaseKey.includes(projectRef)) {
    console.log('✅ Project Ref coincide con Publishable Key');
  } else {
    console.log('⚠️  Project Ref NO coincide con Publishable Key');
    
    // Intentar extraer project ref de la key
    const keyPattern = /sb_publishable_([a-zA-Z0-9]+)_/;
    const keyMatch2 = supabaseKey.match(keyPattern);
    
    if (keyMatch2) {
      const keyProjectRef = keyMatch2[1];
      console.log('🔑 Project Ref en la key:', keyProjectRef);
      console.log('🔧 URL correcta debería ser: https://' + keyProjectRef + '.supabase.co');
    }
  }
} else {
  console.log('❌ Formato de URL incorrecto');
}

// Verificar formato de keys
if (supabaseKey.startsWith('sb_publishable_')) {
  console.log('✅ Formato de Publishable Key correcto');
} else {
  console.log('❌ Formato de Publishable Key incorrecto (debe empezar con sb_publishable_)');
}

if (supabaseSecret.startsWith('sb_secret_')) {
  console.log('✅ Formato de Secret Key correcto');
} else {
  console.log('❌ Formato de Secret Key incorrecto (debe empezar con sb_secret_)');
}

// Recomendaciones
console.log('\n💡 RECOMENDACIONES:');

if (!urlMatch2 || !supabaseKey.includes(urlMatch2[1])) {
  console.log('⚠️  Las credenciales no parecen coincidir entre sí');
  console.log('📝 Verifica que hayas copiado las credenciales del mismo proyecto');
  console.log('🌐 Ve a: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api');
  console.log('🔄 Copia nuevamente URL y API Keys del mismo proyecto');
} else {
  console.log('✅ Las credenciales parecen ser consistentes');
  console.log('🔍 Verifica que el proyecto exista en tu dashboard de Supabase');
}

console.log('\n🔗 ENLACES ÚTILES:');
console.log('- Dashboard: https://supabase.com/dashboard');
console.log('- Crear proyecto: https://supabase.com/dashboard/new');
console.log('- Configuración API: https://supabase.com/dashboard/project/[proyecto]/settings/api');

console.log('\n🔧 SOLUCIÓN:');
console.log('1. Verifica que el proyecto exista en tu dashboard');
console.log('2. Si no existe, crea un nuevo proyecto');
console.log('3. Copia las credenciales correctas');
console.log('4. Ejecuta: node scripts/update-supabase-keys.cjs');
console.log('5. Aplica la migración SQL nuevamente');

