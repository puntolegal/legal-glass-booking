import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 CORRIGIENDO ARCHIVO .env.local\n');

const envLocalPath = path.join(__dirname, '..', '.env.local');

// API key completa de Supabase
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const envContent = `VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e
VITE_RESEND_API_KEY=re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C
VITE_MAIL_FROM=Punto Legal <team@puntolegal.online>
VITE_ADMIN_EMAIL=puntolegalelgolf@gmail.com
VITE_SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
`;

try {
  console.log('📝 Escribiendo archivo .env.local...');
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ Archivo .env.local corregido');
  
  // Verificar que se escribió correctamente
  const writtenContent = fs.readFileSync(envLocalPath, 'utf8');
  const lines = writtenContent.split('\n');
  console.log(`📋 Líneas escritas: ${lines.length}`);
  
  // Verificar la API key
  const supabaseKeyLine = lines.find(line => line.startsWith('VITE_SUPABASE_ANON_KEY='));
  if (supabaseKeyLine) {
    const key = supabaseKeyLine.split('=')[1];
    console.log(`🔑 API Key de Supabase: ${key.length} caracteres`);
    if (key.length === 207) {
      console.log('✅ API Key de Supabase correcta');
    } else {
      console.warn(`⚠️ API Key de Supabase tiene ${key.length} caracteres (esperado: 207)`);
    }
  }
  
  console.log('\n🔄 Reinicia el servidor de desarrollo para aplicar los cambios:');
  console.log('   npm run dev');
  
} catch (error) {
  console.error('❌ Error al corregir el archivo .env.local:', error);
  process.exit(1);
}
