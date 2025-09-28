#!/usr/bin/env node

console.log('🔍 Probando inserción con user_id...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testWithUserId() {
  console.log('🔍 Probando inserción con user_id...');
  
  const reservationWithUserId = {
    nombre: 'Test con User ID',
    email: 'test@userid.com',
    telefono: '+56912345678',
    rut: '12345678-9',
    servicio: 'Consulta Test',
    precio: '1000',
    fecha: '2025-01-30',
    hora: '10:00',
    tipo_reunion: 'online',
    descripcion: 'Test con user_id incluido',
    estado: 'pendiente',
    user_id: 'anon-user-test' // Agregar user_id requerido
  };

  try {
    console.log('📤 Enviando datos con user_id...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(reservationWithUserId)
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 201) {
      console.log('🎉 ¡ÉXITO! Inserción exitosa con user_id');
      console.log('✅ Esquema correcto identificado');
      return { success: true, schema: reservationWithUserId };
    } else if (response.status === 42501) {
      console.log('❌ Error 42501: Violación de política RLS');
      const errorText = await response.text();
      console.log('📝 Error:', errorText);
      return { success: false, error: errorText, type: 'rls_policy' };
    } else {
      const errorText = await response.text();
      console.log('📝 Error:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('🔍 Código de error:', errorData.code);
        console.log('🔍 Mensaje:', errorData.message);
      } catch (parseError) {
        console.log('❌ No se pudo parsear el error');
      }
      
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.log(`❌ Error en la prueba: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testWithDifferentUserId() {
  console.log('\n🔍 Probando con diferentes valores de user_id...');
  
  const userIds = [
    'anon-user',
    'anonymous',
    'guest-user',
    null, // Probar si acepta null
    '', // Probar string vacío
    'test-user-123'
  ];

  for (const userId of userIds) {
    console.log(`\n📋 Probando user_id: ${userId}`);
    
    const testReservation = {
      nombre: 'Test User ID',
      email: `test@user-${userId}.com`,
      telefono: '+56912345678',
      rut: '12345678-9',
      servicio: 'Consulta Test',
      precio: '1000',
      fecha: '2025-01-30',
      hora: '10:00',
      tipo_reunion: 'online',
      descripcion: `Test con user_id: ${userId}`,
      estado: 'pendiente',
      ...(userId !== null && { user_id: userId })
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

      console.log(`   Status: ${response.status}`);
      
      if (response.status === 201) {
        console.log(`   ✅ ÉXITO con user_id: ${userId}`);
        return { success: true, workingUserId: userId };
      } else if (response.status === 42501) {
        console.log(`   🔒 Error RLS con user_id: ${userId}`);
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Error con user_id: ${userId}`);
        console.log(`   📝 ${errorText.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Exception con user_id: ${userId} - ${error.message}`);
    }
  }
  
  return { success: false, workingUserId: null };
}

async function main() {
  console.log('🚀 Iniciando prueba con user_id...\n');
  
  // 1. Probar con user_id básico
  const basicResult = await testWithUserId();
  
  // 2. Si falla por RLS, probar con diferentes user_ids
  let advancedResult = null;
  if (!basicResult.success && basicResult.type === 'rls_policy') {
    console.log('\n🔒 Error RLS detectado, probando diferentes user_ids...');
    advancedResult = await testWithDifferentUserId();
  }
  
  console.log('\n📊 RESUMEN DE PRUEBA CON USER_ID:');
  console.log('═'.repeat(50));
  
  if (basicResult.success) {
    console.log('🎉 ESQUEMA Y USER_ID CORRECTOS');
    console.log('✅ Inserción exitosa con user_id');
    console.log('✅ El problema era la falta de user_id');
    console.log('');
    console.log('📋 ESQUEMA FUNCIONANDO:');
    Object.keys(basicResult.schema).forEach(key => {
      console.log(`   • ${key}: ${basicResult.schema[key]}`);
    });
  } else if (advancedResult && advancedResult.success) {
    console.log('🎉 USER_ID CORRECTO ENCONTRADO');
    console.log(`✅ user_id funcional: ${advancedResult.workingUserId}`);
    console.log('✅ El problema era el valor específico de user_id');
  } else if (basicResult.type === 'rls_policy') {
    console.log('🔒 PROBLEMA DE RLS IDENTIFICADO');
    console.log('❌ Las políticas RLS están bloqueando la inserción');
    console.log('💡 CAUSA: Políticas RLS no permiten INSERT para usuarios anónimos');
    console.log('');
    console.log('🔧 SOLUCIÓN REQUERIDA:');
    console.log('1. Ejecutar FIX_RLS_INSERT_POLICY.sql en Supabase');
    console.log('2. Permitir INSERT para usuarios anónimos');
    console.log('3. Mantener restricciones para SELECT');
  } else {
    console.log('❌ PROBLEMA PERSISTE');
    console.log('❌ Inserción falló por otro motivo');
    console.log('💡 Se requiere revisión adicional del esquema');
  }
  
  console.log('\n✨ Prueba con user_id completada');
}

main().catch(console.error);
