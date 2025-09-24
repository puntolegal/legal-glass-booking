#!/usr/bin/env node

/**
 * Script para obtener las columnas reales de la tabla reservas
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getTableColumns() {
  console.log('🔍 Obteniendo columnas de la tabla reservas...\n');

  try {
    // Intentar insertar con diferentes combinaciones de campos para ver cuáles existen
    const testFields = [
      'id', 'nombre', 'email', 'telefono', 'fecha', 'hora', 'descripcion',
      'servicio', 'precio', 'categoria', 'tipo_reunion', 'estado',
      'webhook_sent', 'recordatorio_enviado', 'created_at', 'updated_at', 'user_id'
    ];

    console.log('📋 Probando campos uno por uno...\n');

    const existingFields = [];
    const missingFields = [];

    for (const field of testFields) {
      try {
        const testData = { [field]: 'test' };
        const { error } = await supabase
          .from('reservas')
          .insert([testData])
          .select();

        if (error && error.message.includes(`Could not find the '${field}' column`)) {
          missingFields.push(field);
          console.log(`❌ ${field}: NO EXISTE`);
        } else if (error) {
          // Otro tipo de error, probablemente el campo existe pero hay otros problemas
          existingFields.push(field);
          console.log(`✅ ${field}: EXISTE`);
        } else {
          existingFields.push(field);
          console.log(`✅ ${field}: EXISTE`);
        }
      } catch (err) {
        console.log(`❓ ${field}: ERROR - ${err.message}`);
      }
    }

    console.log('\n📊 Resumen:');
    console.log('============');
    console.log('✅ Campos que EXISTEN:');
    existingFields.forEach(field => console.log(`   - ${field}`));
    
    console.log('\n❌ Campos que NO EXISTEN:');
    missingFields.forEach(field => console.log(`   - ${field}`));

    // Intentar una inserción con solo los campos que existen
    console.log('\n🧪 Probando inserción con campos existentes...');
    const validData = {};
    existingFields.forEach(field => {
      if (field === 'id') return; // Skip ID, es auto-generado
      if (field === 'created_at' || field === 'updated_at') {
        validData[field] = new Date().toISOString();
      } else if (field === 'estado') {
        validData[field] = 'pendiente';
      } else if (field === 'webhook_sent' || field === 'recordatorio_enviado') {
        validData[field] = false;
      } else {
        validData[field] = 'test';
      }
    });

    const { data, error } = await supabase
      .from('reservas')
      .insert([validData])
      .select()
      .single();

    if (error) {
      console.log('❌ Error en inserción de prueba:', error);
    } else {
      console.log('✅ Inserción exitosa con campos existentes!');
      console.log('📋 Datos insertados:', data);
      
      // Limpiar el registro de prueba
      await supabase
        .from('reservas')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Registro de prueba eliminado');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

getTableColumns();
