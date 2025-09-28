#!/usr/bin/env node

console.log('🔍 Diagnosticando problema de políticas RLS...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function checkRLSStatus() {
  console.log('🔍 Verificando estado de RLS en la tabla reservas...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'reservas' AND schemaname = 'public';"
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('📊 Estado RLS:', data);
      return data;
    } else {
      console.log('❌ No se puede verificar estado RLS:', response.status);
      return null;
    }
  } catch (error) {
    console.log('❌ Error verificando RLS:', error.message);
    return null;
  }
}

async function checkPolicies() {
  console.log('\n🔍 Verificando políticas existentes...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: "SELECT policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE tablename = 'reservas' AND schemaname = 'public';"
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('📊 Políticas encontradas:', data.length);
      data.forEach((policy, index) => {
        console.log(`${index + 1}. ${policy.policyname}`);
        console.log(`   Comando: ${policy.cmd}`);
        console.log(`   Roles: ${policy.roles}`);
        console.log(`   Permisivo: ${policy.permissive}`);
      });
      return data;
    } else {
      console.log('❌ No se pueden verificar políticas:', response.status);
      return null;
    }
  } catch (error) {
    console.log('❌ Error verificando políticas:', error.message);
    return null;
  }
}

async function testDifferentAccessMethods() {
  console.log('\n🔍 Probando diferentes métodos de acceso...');
  
  // Test 1: Acceso directo sin headers especiales
  console.log('\n📋 Test 1: Acceso directo...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`);
    console.log(`   Status: ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      console.log(`   Datos: ${data.length} registros`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 2: Acceso con anon key
  console.log('\n📋 Test 2: Acceso con anon key...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    console.log(`   Status: ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      console.log(`   Datos: ${data.length} registros`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: Acceso con headers específicos
  console.log('\n📋 Test 3: Acceso con headers específicos...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });
    console.log(`   Status: ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      console.log(`   Datos: ${data.length} registros`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
}

async function checkTablePermissions() {
  console.log('\n🔍 Verificando permisos de tabla...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: `
          SELECT 
            schemaname, 
            tablename, 
            tableowner,
            hasindexes,
            hasrules,
            hastriggers
          FROM pg_tables 
          WHERE tablename = 'reservas' AND schemaname = 'public';
        `
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('📊 Información de tabla:', data);
    } else {
      console.log('❌ No se puede verificar información de tabla:', response.status);
    }
  } catch (error) {
    console.log('❌ Error verificando tabla:', error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando diagnóstico completo de RLS...\n');
  
  // 1. Verificar estado de RLS
  const rlsStatus = await checkRLSStatus();
  
  // 2. Verificar políticas
  const policies = await checkPolicies();
  
  // 3. Probar diferentes métodos de acceso
  await testDifferentAccessMethods();
  
  // 4. Verificar permisos de tabla
  await checkTablePermissions();
  
  console.log('\n📊 DIAGNÓSTICO COMPLETADO:');
  console.log('═'.repeat(50));
  
  if (!rlsStatus || rlsStatus.length === 0) {
    console.log('❌ No se pudo verificar el estado de RLS');
    console.log('💡 Posibles causas:');
    console.log('   • Función exec_sql no disponible');
    console.log('   • Permisos insuficientes');
    console.log('   • Problema de conectividad');
  } else {
    const rlsEnabled = rlsStatus[0]?.rowsecurity;
    console.log(`📊 RLS habilitado: ${rlsEnabled ? '✅ SÍ' : '❌ NO'}`);
    
    if (!rlsEnabled) {
      console.log('🚨 PROBLEMA IDENTIFICADO: RLS no está habilitado');
      console.log('💡 Solución: Ejecutar: ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;');
    }
  }
  
  if (!policies || policies.length === 0) {
    console.log('❌ No se encontraron políticas RLS');
    console.log('💡 Solución: Crear políticas de seguridad');
  } else {
    console.log(`📊 Políticas encontradas: ${policies.length}`);
    const hasAnonPolicy = policies.some(p => p.roles?.includes('anon'));
    const hasServicePolicy = policies.some(p => p.roles?.includes('service_role'));
    
    console.log(`📊 Política para anon: ${hasAnonPolicy ? '✅' : '❌'}`);
    console.log(`📊 Política para service_role: ${hasServicePolicy ? '✅' : '❌'}`);
  }
  
  console.log('\n✨ Diagnóstico completado');
}

main().catch(console.error);
