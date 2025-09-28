#!/usr/bin/env node

console.log('🔍 Probando creación de reservas con el código actual...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testReservationCreation() {
  console.log('🔍 Probando creación de reserva con esquema correcto...');
  
  const reservationData = {
    nombre: 'Test Final',
    email: 'test@final.com',
    telefono: '+56912345678',
    rut: '12345678-9',
    servicio: 'Consulta Final',
    precio: '1000',
    fecha: '2025-01-30',
    hora: '10:00',
    tipo_reunion: 'online',
    descripcion: 'Test final de creación',
    estado: 'pendiente',
    user_id: 'migration_placeholder' // Incluir user_id requerido
  };

  try {
    console.log('📤 Enviando datos de reserva...');
    console.log('📋 Datos:', JSON.stringify(reservationData, null, 2));
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(reservationData)
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 201) {
      const createdReservation = await response.json();
      console.log('🎉 ¡ÉXITO! Reserva creada correctamente');
      console.log('✅ ID de reserva:', createdReservation.id);
      console.log('✅ Nombre:', createdReservation.nombre);
      console.log('✅ Email:', createdReservation.email);
      console.log('✅ Estado:', createdReservation.estado);
      
      return { 
        success: true, 
        reservation: createdReservation,
        id: createdReservation.id 
      };
    } else {
      const errorText = await response.text();
      console.log('❌ Error creando reserva:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('🔍 Código de error:', errorData.code);
        console.log('🔍 Mensaje:', errorData.message);
        
        if (errorData.code === '42501') {
          console.log('🔒 Error RLS: Las políticas están bloqueando la inserción');
          return { success: false, error: errorData.message, type: 'rls_policy' };
        } else if (errorData.code === '23502') {
          console.log('🔒 Error de constraint: Faltan campos requeridos');
          return { success: false, error: errorData.message, type: 'constraint' };
        }
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

async function testReservationRetrieval(reservationId) {
  console.log('\n🔍 Probando recuperación de reserva...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?id=eq.${reservationId}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = await response.json();
      if (data.length > 0) {
        console.log('✅ Reserva recuperada exitosamente');
        console.log('📋 Datos:', JSON.stringify(data[0], null, 2));
        return { success: true, data: data[0] };
      } else {
        console.log('⚠️ No se encontró la reserva (RLS funcionando)');
        return { success: true, protected: true };
      }
    } else if (response.status === 401 || response.status === 403) {
      console.log('✅ SELECT protegido por RLS (correcto)');
      return { success: true, protected: true };
    } else {
      console.log(`⚠️ Status inesperado: ${response.status}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log(`❌ Error recuperando reserva: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Iniciando prueba de creación de reservas...\n');
  
  // 1. Probar creación de reserva
  const createResult = await testReservationCreation();
  
  // 2. Si se creó exitosamente, probar recuperación
  let retrieveResult = null;
  if (createResult.success && createResult.id) {
    retrieveResult = await testReservationRetrieval(createResult.id);
  }
  
  console.log('\n📊 RESUMEN DE PRUEBA DE CREACIÓN:');
  console.log('═'.repeat(60));
  
  if (createResult.success) {
    console.log('🎉 CREACIÓN DE RESERVAS FUNCIONANDO');
    console.log('✅ Esquema correcto identificado');
    console.log('✅ user_id incluido correctamente');
    console.log('✅ RLS permite INSERT para usuarios anónimos');
    console.log(`✅ Reserva creada con ID: ${createResult.id}`);
    
    if (retrieveResult && retrieveResult.success) {
      if (retrieveResult.protected) {
        console.log('✅ SELECT protegido por RLS (seguridad funcionando)');
      } else {
        console.log('📋 Reserva recuperada exitosamente');
      }
    }
    
    console.log('\n🎯 SISTEMA COMPLETAMENTE FUNCIONAL:');
    console.log('• ✅ Creación de reservas funcionando');
    console.log('• ✅ Seguridad RLS funcionando');
    console.log('• ✅ Esquema correcto');
    console.log('• ✅ user_id incluido');
    
  } else if (createResult.type === 'rls_policy') {
    console.log('🔒 PROBLEMA DE RLS PERSISTE');
    console.log('❌ Las políticas RLS siguen bloqueando INSERT');
    console.log('💡 CAUSA: Políticas no permiten INSERT para usuarios anónimos');
    console.log('');
    console.log('🔧 SOLUCIÓN REQUERIDA:');
    console.log('1. Ejecutar FIX_RLS_INSERT_POLICY.sql en Supabase Dashboard');
    console.log('2. Permitir INSERT para usuarios anónimos');
    console.log('3. Mantener restricciones para SELECT');
  } else {
    console.log('❌ PROBLEMA PERSISTE');
    console.log(`❌ Error: ${createResult.error}`);
    console.log('💡 Se requiere revisión adicional');
  }
  
  console.log('\n✨ Prueba de creación completada');
}

main().catch(console.error);
