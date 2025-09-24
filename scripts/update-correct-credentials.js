import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 ACTUALIZANDO CREDENCIALES CORRECTAS DE SUPABASE\n');

const envLocalPath = path.join(__dirname, '..', '.env.local');

// Credenciales correctas proporcionadas por el usuario
const correctCredentials = {
  VITE_MERCADOPAGO_ACCESS_TOKEN: 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947',
  VITE_MERCADOPAGO_PUBLIC_KEY: 'APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e',
  VITE_RESEND_API_KEY: 're_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C',
  VITE_MAIL_FROM: 'Punto Legal <team@puntolegal.online>',
  VITE_ADMIN_EMAIL: 'puntolegalelgolf@gmail.com',
  VITE_SUPABASE_URL: 'https://qrgelocijmwnxcckxbdg.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI',
  VITE_SUPABASE_SERVICE_ROLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg'
};

try {
  console.log('📝 Escribiendo credenciales correctas en .env.local...');
  
  // Crear contenido del archivo .env.local
  const envContent = Object.entries(correctCredentials)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envLocalPath, envContent + '\n');
  console.log('✅ Archivo .env.local actualizado con credenciales correctas');
  
  console.log('\n📋 Credenciales actualizadas:');
  Object.entries(correctCredentials).forEach(([key, value]) => {
    const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
    console.log(`   ${key}: ${preview}`);
  });
  
  console.log('\n🔑 Verificación de claves:');
  console.log(`   Anon Key: ${correctCredentials.VITE_SUPABASE_ANON_KEY.length} caracteres`);
  console.log(`   Service Role: ${correctCredentials.VITE_SUPABASE_SERVICE_ROLE.length} caracteres`);
  
  console.log('\n🔄 Reinicia el servidor de desarrollo:');
  console.log('   npm run dev');
  
  console.log('\n🧪 Luego prueba la conexión:');
  console.log('   node scripts/test-supabase-connection-final.js');

} catch (error) {
  console.error('❌ Error al actualizar las credenciales:', error);
  process.exit(1);
}
