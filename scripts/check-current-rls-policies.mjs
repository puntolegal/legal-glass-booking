#!/usr/bin/env node

console.log('🔍 Verificando políticas RLS actuales...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testCurrentPolicies() {
  console.log('🔍 Probando políticas actuales...');
  
  const testReservation = {
    nombre: 'Test Políticas Actuales',
    email: 'test@politicas.com',
    telefono: '+56912345678',
    rut: '12345678-9',
    servicio: 'Test Políticas',
    precio: '1000',
    fecha: '2025-01-30',
    hora: '10:00',
    tipo_reunion: 'online',
    descripcion: 'Test de políticas actuales',
    estado: 'pendiente',
    user_id: 'test-politicas'
  };

  try {
    console.log('📤 Probando INSERT con políticas actuales...');
    
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(testReservation)
    });

    console.log(`📊 INSERT Status: ${insertResponse.status}`);
    
    let insertResult = { success: false, status: insertResponse.status };
    
    if (insertResponse.status === 201) {
      console.log('✅ INSERT funcionando - Política anon insert existe y funciona');
      insertResult = { success: true, status: insertResponse.status };
    } else if (insertResponse.status === 42501) {
      console.log('❌ INSERT bloqueado - Política anon insert no funciona');
      const errorText = await insertResponse.text();
      console.log('📝 Error:', errorText);
    } else {
      const errorText = await insertResponse.text();
      console.log('⚠️ INSERT status inesperado:', errorText);
    }

    // Probar SELECT
    console.log('\n📖 Probando SELECT con políticas actuales...');
    
    const selectResponse = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 SELECT Status: ${selectResponse.status}`);
    
    let selectResult = { success: false, protected: false, status: selectResponse.status };
    
    if (selectResponse.status === 200) {
      const data = await selectResponse.json();
      if (data.length === 0) {
        console.log('✅ SELECT protegido - RLS funcionando (0 registros)');
        selectResult = { success: true, protected: true };
      } else {
        console.log('❌ SELECT no protegido - RLS fallando');
        console.log(`📋 Registros encontrados: ${data.length}`);
      }
    } else if (selectResponse.status === 401 || selectResponse.status === 403) {
      console.log('✅ SELECT protegido - RLS funcionando');
      selectResult = { success: true, protected: true };
    } else {
      const errorText = await selectResponse.text();
      console.log('⚠️ SELECT status inesperado:', errorText);
    }

    return { insertResult, selectResult };
  } catch (error) {
    console.log(`❌ Error en la prueba: ${error.message}`);
    return { 
      insertResult: { success: false, error: error.message },
      selectResult: { success: false, error: error.message }
    };
  }
}

async function main() {
  console.log('🚀 Verificando estado actual de políticas RLS...\n');
  
  const results = await testCurrentPolicies();
  
  console.log('\n📊 RESUMEN DE POLÍTICAS ACTUALES:');
  console.log('═'.repeat(50));
  
  console.log(`📝 INSERT (Crear reservas): ${results.insertResult.success ? '✅ FUNCIONANDO' : '❌ FALLANDO'}`);
  if (!results.insertResult.success) {
    console.log(`   Status: ${results.insertResult.status}`);
  }
  
  console.log(`📖 SELECT (Leer reservas): ${results.selectResult.protected ? '✅ PROTEGIDO' : '❌ NO PROTEGIDO'}`);
  if (!results.selectResult.protected) {
    console.log(`   Status: ${results.selectResult.status}`);
  }
  
  if (results.insertResult.success && results.selectResult.protected) {
    console.log('\n🎉 POLÍTICAS RLS FUNCIONANDO CORRECTAMENTE');
    console.log('✅ INSERT permitido para usuarios anónimos');
    console.log('✅ SELECT protegido para usuarios anónimos');
    console.log('✅ Sistema completamente funcional');
    console.log('');
    console.log('💡 NOTA: El error 42710 indica que la política ya existe');
    console.log('   Esto es normal y significa que la corrección ya se aplicó');
  } else if (!results.insertResult.success) {
    console.log('\n🔒 PROBLEMA CON POLÍTICAS RLS');
    console.log('❌ INSERT no funcionando');
    console.log('💡 Aunque la política existe, no está funcionando correctamente');
    console.log('');
    console.log('🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que la política esté activa en Supabase Dashboard');
    console.log('2. Recrear la política con un nombre diferente');
    console.log('3. Verificar que RLS esté habilitado en la tabla');
  } else {
    console.log('\n⚠️ PROBLEMA MENOR');
    console.log('✅ INSERT funcionando');
    console.log('❌ SELECT no protegido');
    console.log('💡 Se requiere revisar políticas de SELECT');
  }
  
  console.log('\n✨ Verificación de políticas completada');
}

main().catch(console.error);
