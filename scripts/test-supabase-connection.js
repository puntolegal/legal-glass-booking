#!/usr/bin/env node

/**
 * Script para probar la conexión a Supabase y verificar las políticas RLS
 */

import { createClient } from '@supabase/supabase-js';

// Credenciales correctas
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔌 Probando conexión a Supabase...\n');

  try {
    // 1. Probar conexión básica
    console.log('1️⃣ Probando conexión básica...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('reservas')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ Error de conexión:', healthError);
      return false;
    }

    console.log('✅ Conexión básica exitosa');

    // 2. Probar inserción simple
    console.log('\n2️⃣ Probando inserción de reserva...');
    
    const reservaData = {
      cliente_nombre: 'Test User',
      cliente_email: 'test@ejemplo.com',
      cliente_telefono: '+56912345678',
      servicio_tipo: 'Consulta General',
      servicio_precio: '1.000',
      fecha: '2024-01-15',
      hora: '10:00',
      pago_metodo: 'pendiente',
      pago_estado: 'pendiente',
      estado: 'pendiente'
    };

    const { data: reserva, error: insertError } = await supabase
      .from('reservas')
      .insert(reservaData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error insertando reserva:');
      console.error('Código:', insertError.code);
      console.error('Mensaje:', insertError.message);
      console.error('Detalles:', insertError.details);
      console.error('Hint:', insertError.hint);

      if (insertError.code === '42501') {
        console.log('\n🔧 DIAGNÓSTICO: Problema con políticas RLS');
        console.log('📋 SOLUCIÓN:');
        console.log('1. Ve al Dashboard de Supabase');
        console.log('2. Ve a Authentication > Policies');
        console.log('3. O ejecuta el script SQL: scripts/fix-rls-policies.sql');
        console.log('4. Esto creará las políticas necesarias para permitir inserción');
      }

      return false;
    }

    console.log('✅ Reserva insertada exitosamente');
    console.log('ID:', reserva.id);

    // 3. Limpiar datos de prueba
    console.log('\n3️⃣ Limpiando datos de prueba...');
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .eq('id', reserva.id);

    if (deleteError) {
      console.warn('⚠️ Error eliminando reserva de prueba:', deleteError);
    } else {
      console.log('✅ Datos de prueba eliminados');
    }

    return true;

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return false;
  }
}

// Ejecutar prueba
testSupabaseConnection().then(success => {
  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('🎉 ¡CONEXIÓN EXITOSA! Supabase está funcionando correctamente');
  } else {
    console.log('❌ CONEXIÓN FALLIDA - Revisa las políticas RLS en Supabase');
  }
  console.log('='.repeat(60));
});
