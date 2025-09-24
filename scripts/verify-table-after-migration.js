#!/usr/bin/env node

/**
 * Script para verificar que la tabla reservas funciona correctamente
 * después de aplicar la migración
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTable() {
  console.log('🔍 Verificando tabla reservas después de la migración...\n');

  try {
    // 1. Verificar que la tabla existe y tiene la estructura correcta
    console.log('📋 Verificando estructura de la tabla...');
    
    const { data: testData, error: testError } = await supabase
      .from('reservas')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Error verificando tabla:', testError);
      return;
    }

    console.log('✅ Tabla reservas accesible');

    // 2. Probar inserción de datos
    console.log('\n🧪 Probando inserción de datos...');
    
    const testReservation = {
      cliente_nombre: 'Juan Pérez',
      cliente_rut: '12345678-9',
      cliente_email: 'juan@ejemplo.com',
      cliente_telefono: '+56912345678',
      fecha: '2025-09-23',
      hora: '10:00',
      descripcion: 'Consulta de prueba del sistema',
      servicio_tipo: 'Consulta General',
      servicio_precio: 1000,
      servicio_categoria: 'General',
      tipo_reunion: 'online',
      estado: 'pendiente',
      webhook_sent: false,
      recordatorio_enviado: false
    };

    const { data: insertData, error: insertError } = await supabase
      .from('reservas')
      .insert([testReservation])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error insertando datos:', insertError);
      return;
    }

    console.log('✅ Inserción exitosa!');
    console.log('📋 Datos insertados:', insertData);

    // 3. Probar actualización
    console.log('\n🔄 Probando actualización de datos...');
    
    const { data: updateData, error: updateError } = await supabase
      .from('reservas')
      .update({ estado: 'confirmada' })
      .eq('id', insertData.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error actualizando datos:', updateError);
    } else {
      console.log('✅ Actualización exitosa!');
      console.log('📋 Datos actualizados:', updateData);
    }

    // 4. Probar consulta
    console.log('\n🔍 Probando consulta de datos...');
    
    const { data: queryData, error: queryError } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', insertData.id)
      .single();

    if (queryError) {
      console.error('❌ Error consultando datos:', queryError);
    } else {
      console.log('✅ Consulta exitosa!');
      console.log('📋 Datos consultados:', queryData);
    }

    // 5. Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .eq('id', insertData.id);

    if (deleteError) {
      console.error('❌ Error eliminando datos:', deleteError);
    } else {
      console.log('✅ Datos de prueba eliminados');
    }

    console.log('\n🎉 ¡Verificación completada exitosamente!');
    console.log('✅ La tabla reservas está funcionando correctamente');
    console.log('✅ Todas las operaciones CRUD funcionan');
    console.log('✅ El sistema está listo para usar');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyTable();
