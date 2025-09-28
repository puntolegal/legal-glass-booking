#!/usr/bin/env node

console.log('🔍 Verificación final de seguridad RLS...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testSecurityScenarios() {
  console.log('🔒 Probando escenarios de seguridad...\n');
  
  const scenarios = [
    {
      name: 'Acceso sin autenticación (debería fallar)',
      headers: {},
      expectedStatus: [401, 403],
      shouldHaveData: false
    },
    {
      name: 'Acceso con anon key (debería estar restringido)',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      expectedStatus: [200],
      shouldHaveData: false // No debería ver datos sensibles
    },
    {
      name: 'Creación de reserva (debería funcionar)',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        nombre: 'Test Security Final',
        email: 'test@security-final.com',
        telefono: '+56912345678',
        rut: '12345678-9',
        servicio: 'Test Service Final',
        precio: '1000',
        fecha: '2025-01-30',
        hora: '10:00',
        tipo_reunion: 'online',
        descripcion: 'Test final de seguridad',
        estado: 'pendiente',
        user_id: 'security_test_final'
      },
      expectedStatus: [201],
      shouldHaveData: true
    }
  ];

  let allTestsPassed = true;

  for (const scenario of scenarios) {
    console.log(`📋 ${scenario.name}...`);
    
    try {
      const options = {
        method: scenario.method || 'GET',
        headers: scenario.headers
      };
      
      if (scenario.body) {
        options.body = JSON.stringify(scenario.body);
      }
      
      const url = scenario.method === 'POST' 
        ? `${SUPABASE_URL}/rest/v1/reservas`
        : `${SUPABASE_URL}/rest/v1/reservas?limit=5`;
      
      const response = await fetch(url, options);
      const status = response.status;
      
      console.log(`   Status: ${status}`);
      
      // Verificar si el status es el esperado
      const statusExpected = scenario.expectedStatus.includes(status);
      console.log(`   Status esperado: ${statusExpected ? '✅' : '❌'}`);
      
      if (response.ok && scenario.shouldHaveData !== undefined) {
        const data = await response.json();
        const hasData = Array.isArray(data) ? data.length > 0 : !!data;
        
        if (scenario.shouldHaveData === hasData) {
          console.log(`   Datos: ${hasData ? '✅ Presentes' : '✅ Sin datos (protegido)'}`);
        } else {
          console.log(`   Datos: ❌ ${hasData ? 'Inesperadamente presentes' : 'Faltan datos esperados'}`);
          allTestsPassed = false;
        }
      }
      
      if (!statusExpected) {
        allTestsPassed = false;
      }
      
    } catch (error) {
      console.log(`   Error: ❌ ${error.message}`);
      allTestsPassed = false;
    }
    
    console.log('');
  }
  
  return allTestsPassed;
}

async function testEdgeFunctionAccess() {
  console.log('🔍 Probando acceso de Edge Functions...\n');
  
  try {
    // Simular acceso como Edge Function
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log(`📊 Datos accesibles: ${data.length} registros`);
      
      if (data.length === 0) {
        console.log('✅ Edge Functions pueden acceder pero datos están protegidos por RLS');
        return true;
      } else {
        console.log('⚠️ Edge Functions pueden ver datos - verificar políticas');
        return false;
      }
    } else {
      console.log('❌ Edge Functions no pueden acceder');
      return false;
    }
  } catch (error) {
    console.log(`❌ Error verificando Edge Functions: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación final de seguridad...\n');
  
  // 1. Probar escenarios de seguridad
  const securityTestsPassed = await testSecurityScenarios();
  
  // 2. Verificar acceso de Edge Functions
  const edgeFunctionsWorking = await testEdgeFunctionAccess();
  
  console.log('\n📊 RESUMEN FINAL DE SEGURIDAD:');
  console.log('═'.repeat(60));
  
  if (securityTestsPassed && edgeFunctionsWorking) {
    console.log('🎉 ¡SEGURIDAD CORREGIDA EXITOSAMENTE!');
    console.log('');
    console.log('✅ ACCESO SIN AUTENTICACIÓN DENEGADO');
    console.log('✅ DATOS SENSIBLES PROTEGIDOS');
    console.log('✅ CREACIÓN DE RESERVAS FUNCIONANDO');
    console.log('✅ EDGE FUNCTIONS OPERATIVAS');
    console.log('');
    console.log('🔒 MEDIDAS DE SEGURIDAD ACTIVAS:');
    console.log('• RLS habilitado en tabla reservas');
    console.log('• Políticas de acceso implementadas');
    console.log('• Datos de clientes protegidos');
    console.log('• Solo operaciones autorizadas permitidas');
    console.log('');
    console.log('✨ El sistema está seguro y operativo');
    
  } else {
    console.log('❌ AÚN HAY PROBLEMAS DE SEGURIDAD');
    console.log('');
    if (!securityTestsPassed) {
      console.log('❌ Tests de seguridad fallaron');
    }
    if (!edgeFunctionsWorking) {
      console.log('❌ Edge Functions tienen problemas');
    }
    console.log('');
    console.log('💡 Se requiere revisión adicional de las políticas RLS');
  }
  
  console.log('\n✨ Verificación final completada');
}

main().catch(console.error);
