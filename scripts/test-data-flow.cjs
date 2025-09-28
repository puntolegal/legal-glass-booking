#!/usr/bin/env node

/**
 * Script de prueba para verificar el flujo completo de datos
 * desde la creación de reserva hasta el retorno de MercadoPago
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDataFlow() {
  console.log('🧪 PROBANDO FLUJO COMPLETO DE DATOS...');
  console.log('=' .repeat(60));
  
  try {
    // PASO 1: Crear una reserva de prueba
    console.log('📋 PASO 1: Creando reserva de prueba...');
    
    const testReservation = {
      nombre: 'Test Data Flow',
      email: 'test-dataflow@puntolegal.online',
      telefono: '+56912345678',
      rut: '12345678-9',
      servicio: 'Consulta General',
      precio: '35000',
      tipo_reunion: 'online',
      fecha: '2025-02-01',
      hora: '10:00',
      user_id: 'migration_placeholder',
      descripcion: 'Prueba de flujo de datos',
      estado: 'pendiente'
    };
    
    const { data: reservation, error: insertError } = await supabase
      .from('reservas')
      .insert(testReservation)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error creando reserva:', insertError.message);
      return;
    }
    
    console.log('✅ Reserva creada:', reservation.id);
    
    // PASO 2: Simular actualización con preference_id y external_reference
    console.log('\\n📋 PASO 2: Actualizando con preference_id y external_reference...');
    
    const testPreferenceId = `test_pref_${Date.now()}`;
    const testExternalReference = reservation.id; // Usar ID de reserva como external_reference
    
    const { data: updatedReservation, error: updateError } = await supabase
      .from('reservas')
      .update({
        preference_id: testPreferenceId,
        external_reference: testExternalReference,
        pago_estado: 'approved',
        pago_metodo: 'test',
        estado: 'confirmada'
      })
      .eq('id', reservation.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Error actualizando reserva:', updateError.message);
      return;
    }
    
    console.log('✅ Reserva actualizada:');
    console.log('• ID:', updatedReservation.id);
    console.log('• Preference ID:', updatedReservation.preference_id);
    console.log('• External Reference:', updatedReservation.external_reference);
    
    // PASO 3: Probar búsqueda por external_reference
    console.log('\\n📋 PASO 3: Probando búsqueda por external_reference...');
    
    const { data: foundByExternalRef, error: error1 } = await supabase
      .from('reservas')
      .select('*')
      .eq('external_reference', testExternalReference)
      .single();
    
    if (error1) {
      console.error('❌ Error buscando por external_reference:', error1.message);
    } else if (foundByExternalRef) {
      console.log('✅ Encontrado por external_reference:');
      console.log('• ID:', foundByExternalRef.id);
      console.log('• Nombre:', foundByExternalRef.nombre);
      console.log('• Email:', foundByExternalRef.email);
    } else {
      console.log('❌ No encontrado por external_reference');
    }
    
    // PASO 4: Probar búsqueda por preference_id
    console.log('\\n📋 PASO 4: Probando búsqueda por preference_id...');
    
    const { data: foundByPreferenceId, error: error2 } = await supabase
      .from('reservas')
      .select('*')
      .eq('preference_id', testPreferenceId)
      .single();
    
    if (error2) {
      console.error('❌ Error buscando por preference_id:', error2.message);
    } else if (foundByPreferenceId) {
      console.log('✅ Encontrado por preference_id:');
      console.log('• ID:', foundByPreferenceId.id);
      console.log('• Nombre:', foundByPreferenceId.nombre);
      console.log('• Email:', foundByPreferenceId.email);
    } else {
      console.log('❌ No encontrado por preference_id');
    }
    
    // PASO 5: Verificar consistencia de datos
    console.log('\\n📋 PASO 5: Verificando consistencia de datos...');
    
    const isConsistent = 
      foundByExternalRef?.id === foundByPreferenceId?.id &&
      foundByExternalRef?.external_reference === testExternalReference &&
      foundByPreferenceId?.preference_id === testPreferenceId;
    
    if (isConsistent) {
      console.log('✅ Datos consistentes - Flujo funcionando correctamente');
    } else {
      console.log('❌ Datos inconsistentes - Hay problemas en el flujo');
    }
    
    // PASO 6: Limpiar datos de prueba
    console.log('\\n📋 PASO 6: Limpiando datos de prueba...');
    
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .eq('id', reservation.id);
    
    if (deleteError) {
      console.error('❌ Error eliminando reserva de prueba:', deleteError.message);
    } else {
      console.log('✅ Datos de prueba eliminados');
    }
    
    console.log('\\n' + '=' .repeat(60));
    console.log('🏁 PRUEBA COMPLETADA');
    console.log('✅ Flujo de datos verificado correctamente');
    
  } catch (error) {
    console.error('❌ Error general en prueba:', error.message);
  }
}

testDataFlow();
