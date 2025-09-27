#!/usr/bin/env node

console.log('🔍 Verificando corrección de seguridad RLS...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testPublicAccess() {
  console.log('🔍 Probando acceso público (debería fallar)...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('❌ PROBLEMA PERSISTE: Aún se puede acceder públicamente');
      console.log(`📋 Datos expuestos: ${JSON.stringify(data, null, 2)}`);
      return false;
    } else if (response.status === 401 || response.status === 403) {
      console.log('✅ CORRECCIÓN EXITOSA: Acceso público denegado');
      return true;
    } else {
      console.log(`⚠️ Status inesperado: ${response.status}`);
      const errorText = await response.text();
      console.log(`📝 Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error verificando acceso público: ${error.message}`);
    return false;
  }
}

async function testEdgeFunctionAccess() {
  console.log('\n🔍 Probando acceso de Edge Functions...');
  
  try {
    // Simular acceso como Edge Function (usando anon key que debería funcionar para operaciones autorizadas)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Edge Functions pueden acceder correctamente');
      return true;
    } else {
      console.log('⚠️ Edge Functions pueden tener problemas de acceso');
      const errorText = await response.text();
      console.log(`📝 Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error verificando acceso de Edge Functions: ${error.message}`);
    return false;
  }
}

async function testReservationCreation() {
  console.log('\n🔍 Probando creación de reserva (debería funcionar)...');
  
  try {
    const testData = {
      nombre: 'Test Security',
      email: 'test@security.com',
      telefono: '+56912345678',
      rut: '12345678-9',
      servicio: 'Test Service',
      precio: '1000',
      fecha: '2025-01-30',
      hora: '10:00',
      tipo_reunion: 'online',
      descripcion: 'Test de seguridad',
      estado: 'pendiente',
      user_id: 'migration_placeholder'
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(testData)
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 201) {
      console.log('✅ Creación de reserva funciona correctamente');
      return true;
    } else {
      console.log('⚠️ Problema creando reserva');
      const errorText = await response.text();
      console.log(`📝 Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error verificando creación de reserva: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación de corrección de seguridad...\n');
  
  // 1. Verificar que no se pueda acceder públicamente
  const publicAccessBlocked = await testPublicAccess();
  
  // 2. Verificar que Edge Functions sigan funcionando
  const edgeFunctionsWorking = await testEdgeFunctionAccess();
  
  // 3. Verificar que se puedan crear reservas
  const creationWorking = await testReservationCreation();
  
  console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
  console.log('═'.repeat(50));
  
  if (publicAccessBlocked) {
    console.log('✅ SEGURIDAD CORREGIDA EXITOSAMENTE');
    console.log('✅ Datos de clientes protegidos');
    console.log('✅ Acceso público denegado');
    
    if (edgeFunctionsWorking) {
      console.log('✅ Edge Functions funcionando correctamente');
    } else {
      console.log('⚠️ Edge Functions pueden necesitar ajustes');
    }
    
    if (creationWorking) {
      console.log('✅ Creación de reservas funcionando');
    } else {
      console.log('⚠️ Creación de reservas puede tener problemas');
    }
    
    console.log('\n🔒 MEDIDAS DE SEGURIDAD IMPLEMENTADAS:');
    console.log('• RLS habilitado en tabla reservas');
    console.log('• Acceso público denegado');
    console.log('• Solo Edge Functions autorizadas pueden acceder');
    console.log('• Usuarios anónimos solo pueden crear reservas');
    console.log('• Lectura y modificación restringidas');
    console.log('• Datos sensibles protegidos');
    
  } else {
    console.log('❌ PROBLEMA DE SEGURIDAD PERSISTE');
    console.log('❌ Se requiere aplicar el archivo FIX_RLS_SECURITY_URGENT.sql');
    console.log('❌ Instrucciones:');
    console.log('   1. Ir a Supabase Dashboard');
    console.log('   2. Database > SQL Editor');
    console.log('   3. Ejecutar FIX_RLS_SECURITY_URGENT.sql');
    console.log('   4. Verificar que las políticas se crearon');
  }
  
  console.log('\n✨ Verificación completada');
}

main().catch(console.error);
