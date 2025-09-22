#!/usr/bin/env node

/**
 * Script para verificar la estructura real de la tabla reservas
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla reservas...\n');

  try {
    // Intentar obtener una muestra de datos para ver la estructura
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error consultando tabla:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Estructura de la tabla reservas:');
      console.log('=====================================');
      const sample = data[0];
      Object.keys(sample).forEach(key => {
        console.log(`${key}: ${typeof sample[key]} = ${sample[key]}`);
      });
    } else {
      console.log('ℹ️ La tabla está vacía, verificando esquema...');
      
      // Intentar insertar un registro de prueba para ver qué campos acepta
      const testData = {
        nombre: 'Test User',
        email: 'test@test.com',
        telefono: '123456789',
        fecha: '2025-09-23',
        hora: '10:00',
        descripcion: 'Test description',
        servicio: 'Test Service',
        precio: '1000',
        categoria: 'Test',
        tipo_reunion: 'online',
        estado: 'pendiente',
        webhook_sent: false,
        recordatorio_enviado: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'test-user'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('reservas')
        .insert([testData])
        .select()
        .single();

      if (insertError) {
        console.log('❌ Error insertando datos de prueba:', insertError);
        console.log('📋 Campos que causan error:', insertError.details);
      } else {
        console.log('✅ Inserción exitosa, estructura confirmada:');
        console.log(insertData);
        
        // Limpiar el registro de prueba
        await supabase
          .from('reservas')
          .delete()
          .eq('id', insertData.id);
        console.log('🧹 Registro de prueba eliminado');
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkTableStructure();
