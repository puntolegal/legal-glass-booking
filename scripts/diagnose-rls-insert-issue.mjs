#!/usr/bin/env node

console.log('🔍 Diagnosticando problema de INSERT en políticas RLS...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testReservationInsert() {
  console.log('🔍 Probando inserción de reserva...');
  
  const testReservation = {
    cliente_nombre: 'Test RLS Fix',
    cliente_email: 'test@rls-fix.com',
    cliente_telefono: '+56912345678',
    rut: '12345678-9',
    servicio_tipo: 'Consulta Test',
    servicio_precio: '1000',
    fecha: '2025-01-30',
    hora: '10:00',
    tipo_reunion: 'online',
    descripcion: 'Test de corrección RLS',
    estado: 'pendiente',
    user_id: 'test-rls-fix'
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(testReservation)
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 201) {
      console.log('✅ Inserción exitosa - RLS funcionando correctamente');
      return { success: true, status: response.status };
    } else if (response.status === 401) {
      console.log('❌ Error 401: No autorizado');
      const errorText = await response.text();
      console.log('📝 Error:', errorText);
      return { success: false, status: response.status, error: errorText };
    } else if (response.status === 42501) {
      console.log('❌ Error 42501: Violación de política RLS');
      const errorText = await response.text();
      console.log('📝 Error:', errorText);
      return { success: false, status: response.status, error: errorText };
    } else {
      console.log(`⚠️ Status inesperado: ${response.status}`);
      const errorText = await response.text();
      console.log('📝 Respuesta:', errorText);
      return { success: false, status: response.status, error: errorText };
    }
  } catch (error) {
    console.log(`❌ Error en la prueba: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testReservationSelect() {
  console.log('\n🔍 Probando lectura de reservas (debería fallar)...');
  
  try {
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
      if (data.length === 0) {
        console.log('✅ SELECT protegido - RLS funcionando (0 registros)');
        return { success: true, protected: true };
      } else {
        console.log('❌ SELECT no protegido - RLS fallando');
        return { success: false, protected: false };
      }
    } else if (response.status === 401 || response.status === 403) {
      console.log('✅ SELECT protegido - RLS funcionando');
      return { success: true, protected: true };
    } else {
      console.log(`⚠️ Status inesperado: ${response.status}`);
      return { success: false, protected: false };
    }
  } catch (error) {
    console.log(`❌ Error en la prueba SELECT: ${error.message}`);
    return { success: false, protected: false };
  }
}

async function main() {
  console.log('🚀 Iniciando diagnóstico de problema RLS INSERT...\n');
  
  // 1. Probar inserción de reserva
  const insertResult = await testReservationInsert();
  
  // 2. Probar lectura de reservas
  const selectResult = await testReservationSelect();
  
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
  console.log('═'.repeat(50));
  
  console.log(`📝 INSERT (Crear reservas): ${insertResult.success ? '✅ FUNCIONANDO' : '❌ FALLANDO'}`);
  if (!insertResult.success) {
    console.log(`   Status: ${insertResult.status}`);
    console.log(`   Error: ${insertResult.error}`);
  }
  
  console.log(`📖 SELECT (Leer reservas): ${selectResult.protected ? '✅ PROTEGIDO' : '❌ NO PROTEGIDO'}`);
  
  if (!insertResult.success) {
    console.log('\n🚨 PROBLEMA IDENTIFICADO:');
    console.log('❌ No se pueden crear nuevas reservas');
    console.log('💡 CAUSA: Políticas RLS bloqueando INSERT para usuarios anónimos');
    console.log('🔧 SOLUCIÓN: Ejecutar FIX_RLS_INSERT_POLICY.sql');
    console.log('');
    console.log('📋 PASOS PARA CORREGIR:');
    console.log('1. Ir a Supabase Dashboard → Database → SQL Editor');
    console.log('2. Ejecutar el archivo FIX_RLS_INSERT_POLICY.sql');
    console.log('3. Verificar que las políticas se crearon correctamente');
    console.log('4. Probar nuevamente la creación de reservas');
  } else if (!selectResult.protected) {
    console.log('\n⚠️ PROBLEMA MENOR:');
    console.log('❌ SELECT no está protegido');
    console.log('💡 Las reservas pueden ser leídas públicamente');
    console.log('🔧 SOLUCIÓN: Revisar políticas de SELECT');
  } else {
    console.log('\n🎉 DIAGNÓSTICO EXITOSO:');
    console.log('✅ INSERT funcionando correctamente');
    console.log('✅ SELECT protegido correctamente');
    console.log('✅ Políticas RLS configuradas apropiadamente');
  }
  
  console.log('\n✨ Diagnóstico completado');
}

main().catch(console.error);
