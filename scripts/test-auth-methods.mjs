#!/usr/bin/env node

console.log('🔍 Probando diferentes métodos de autenticación para Edge Functions...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

// Métodos de autenticación a probar
const authMethods = [
  {
    name: 'Bearer Token',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'API Key Header',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'Both Headers',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'Service Role (if available)',
    headers: {
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTMxNTU3NiwiZXhwIjoyMDUwODkxNTc2fQ.3ZJ9vZQzJ9vZQzJ9vZQzJ9vZQzJ9vZQzJ9vZQzJ9vZQzJ9vZQ`,
      'Content-Type': 'application/json'
    }
  }
];

async function testAuthMethod(method, functionName) {
  console.log(`\n🧪 Probando: ${method.name}`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: method.headers,
      body: JSON.stringify({
        bookingData: {
          id: 'test-123',
          cliente_nombre: 'Test User',
          cliente_email: 'test@example.com',
          cliente_telefono: '+56912345678',
          servicio_tipo: 'Consulta Legal',
          servicio_precio: '35000',
          fecha: '2025-01-30',
          hora: '10:00',
          tipo_reunion: 'online',
          created_at: new Date().toISOString()
        }
      })
    });

    const responseText = await response.text();
    
    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ ¡ÉXITO! Esta autenticación funciona');
      console.log(`📝 Response: ${responseText.substring(0, 200)}...`);
      return { success: true, method: method.name };
    } else if (response.status === 401) {
      console.log('❌ Error de autenticación');
      console.log(`📝 Response: ${responseText}`);
    } else {
      console.log(`❌ Error ${response.status}`);
      console.log(`📝 Response: ${responseText}`);
    }
    
    return { success: false, status: response.status };
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  const functionsToTest = ['send-resend-emails'];
  
  for (const functionName of functionsToTest) {
    console.log(`\n🎯 Probando función: ${functionName}`);
    console.log('═'.repeat(50));
    
    let successfulMethod = null;
    
    for (const method of authMethods) {
      const result = await testAuthMethod(method, functionName);
      
      if (result.success) {
        successfulMethod = result.method;
        break;
      }
      
      // Esperar un poco entre intentos
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (successfulMethod) {
      console.log(`\n🎉 ¡ENCONTRADO! Método exitoso para ${functionName}: ${successfulMethod}`);
    } else {
      console.log(`\n❌ Ningún método de autenticación funcionó para ${functionName}`);
      console.log('\n🔧 Posibles soluciones:');
      console.log('1. Verificar que la Edge Function esté desplegada correctamente');
      console.log('2. Verificar que las variables de entorno estén configuradas');
      console.log('3. Verificar permisos de la función en Supabase');
      console.log('4. Considerar usar autenticación de usuario en lugar de anónima');
    }
  }
  
  console.log('\n✨ Pruebas de autenticación completadas');
}

main().catch(console.error);
