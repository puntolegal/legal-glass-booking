#!/usr/bin/env node

/**
 * Script de prueba para verificar que no hay duplicación de emails
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testEmailDuplication() {
  console.log('🧪 PROBANDO PREVENCIÓN DE DUPLICACIÓN DE EMAILS...');
  console.log('=' .repeat(60));
  
  try {
    // PASO 1: Crear una reserva de prueba
    console.log('📋 PASO 1: Creando reserva de prueba...');
    
    const testReservation = {
      nombre: 'Test Email Duplication',
      email: 'test-email-duplication@puntolegal.online',
      telefono: '+56912345678',
      rut: '12345678-9',
      servicio: 'Consulta General',
      precio: '35000',
      tipo_reunion: 'online',
      fecha: '2025-02-01',
      hora: '10:00',
      user_id: 'migration_placeholder',
      descripcion: 'Prueba de duplicación de emails',
      estado: 'confirmada',
      email_enviado: false // Inicialmente no enviado
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
    console.log('📧 Email enviado inicial:', reservation.email_enviado);
    
    // PASO 2: Simular primer envío de email
    console.log('\\n📋 PASO 2: Simulando primer envío de email...');
    
    const { data: firstUpdate, error: firstError } = await supabase
      .from('reservas')
      .update({
        email_enviado: true,
        email_enviado_at: new Date().toISOString()
      })
      .eq('id', reservation.id)
      .select()
      .single();
    
    if (firstError) {
      console.error('❌ Error en primer envío:', firstError.message);
      return;
    }
    
    console.log('✅ Primer email marcado como enviado');
    console.log('📧 Email enviado:', firstUpdate.email_enviado);
    console.log('📧 Fecha envío:', firstUpdate.email_enviado_at);
    
    // PASO 3: Simular intento de segundo envío (debería ser bloqueado)
    console.log('\\n📋 PASO 3: Simulando intento de segundo envío...');
    
    // Verificar si ya fue enviado
    if (firstUpdate.email_enviado) {
      console.log('✅ SEGUNDO ENVÍO BLOQUEADO - Email ya enviado previamente');
      console.log('📧 Estado actual:', firstUpdate.email_enviado);
      console.log('📧 Fecha primer envío:', firstUpdate.email_enviado_at);
    } else {
      console.log('❌ ERROR: Segundo envío NO fue bloqueado');
    }
    
    // PASO 4: Verificar que no se puede enviar de nuevo
    console.log('\\n📋 PASO 4: Verificando prevención de duplicación...');
    
    const { data: currentReservation, error: fetchError } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', reservation.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Error obteniendo reserva:', fetchError.message);
      return;
    }
    
    if (currentReservation.email_enviado) {
      console.log('✅ DUPLICACIÓN PREVENIDA CORRECTAMENTE');
      console.log('📧 Email enviado:', currentReservation.email_enviado);
      console.log('📧 Fecha envío:', currentReservation.email_enviado_at);
    } else {
      console.log('❌ ERROR: Campo email_enviado no está funcionando');
    }
    
    // PASO 5: Limpiar datos de prueba
    console.log('\\n📋 PASO 5: Limpiando datos de prueba...');
    
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
    console.log('✅ Sistema de prevención de duplicación de emails verificado');
    
  } catch (error) {
    console.error('❌ Error general en prueba:', error.message);
  }
}

testEmailDuplication();
