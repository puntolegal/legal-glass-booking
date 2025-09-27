#!/usr/bin/env node

console.log('🔍 Verificador de credenciales de Supabase...\n');

// Credenciales actuales (pueden estar incorrectas)
const CURRENT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMTU1NzYsImV4cCI6MjA1MDg5MTU3Nn0.3ZJ9vZQzJ9vZQzJ9vZQzJ9vZQzJ9vZQzJ9vZQzJ9vZQzJ9vZQ';
const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';

async function verifyCredentials() {
  console.log('🧪 Verificando credenciales actuales...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CURRENT_ANON_KEY}`,
        'apikey': CURRENT_ANON_KEY
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Credenciales actuales son válidas');
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Credenciales actuales son inválidas');
      console.log(`📝 Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return false;
  }
}

async function testWithNewCredentials(newAnonKey) {
  console.log('\n🧪 Probando con nuevas credenciales...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${newAnonKey}`,
        'apikey': newAnonKey
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Nuevas credenciales son válidas');
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Nuevas credenciales también son inválidas');
      console.log(`📝 Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación de credenciales...\n');
  
  const currentCredentialsValid = await verifyCredentials();
  
  if (!currentCredentialsValid) {
    console.log('\n🔧 INSTRUCCIONES PARA OBTENER CREDENCIALES CORRECTAS:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto "Punto Legal"');
    console.log('3. Ve a Settings → API');
    console.log('4. Copia la "anon public" key');
    console.log('5. Actualiza el script con la nueva key');
    
    console.log('\n📋 CREDENCIALES ACTUALES (INVÁLIDAS):');
    console.log(`URL: ${SUPABASE_URL}`);
    console.log(`Anon Key: ${CURRENT_ANON_KEY}`);
    
    console.log('\n💡 Una vez que tengas las credenciales correctas, actualiza:');
    console.log('   • src/config/supabaseConfig.ts');
    console.log('   • scripts/diagnostic-edge-functions.mjs');
    console.log('   • scripts/test-auth-methods.mjs');
    
    console.log('\n🧪 Para probar nuevas credenciales, ejecuta:');
    console.log('   node scripts/verify-supabase-credentials.mjs NEW_ANON_KEY');
  } else {
    console.log('\n✅ Las credenciales actuales son válidas');
    console.log('El problema puede estar en la configuración de las Edge Functions');
  }
  
  // Si se proporciona una nueva key como argumento, probarla
  const newKey = process.argv[2];
  if (newKey && newKey !== CURRENT_ANON_KEY) {
    console.log(`\n🔍 Probando con nueva key: ${newKey.substring(0, 20)}...`);
    await testWithNewCredentials(newKey);
  }
  
  console.log('\n✨ Verificación completada');
}

main().catch(console.error);
