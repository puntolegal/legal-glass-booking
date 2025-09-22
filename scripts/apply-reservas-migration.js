#!/usr/bin/env node

/**
 * Script para aplicar la migración de la tabla reservas
 * Usa la service role key para poder crear/modificar la tabla
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnGg';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyMigration() {
  console.log('🚀 Aplicando migración de tabla reservas...\n');

  try {
    // Leer el archivo SQL
    const sqlContent = readFileSync('scripts/create-reservas-table.sql', 'utf8');
    
    console.log('📋 Ejecutando SQL de migración...');
    
    // Ejecutar la migración
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error ejecutando migración:', error);
      return;
    }

    console.log('✅ Migración aplicada exitosamente!');
    
    // Verificar que la tabla se creó correctamente
    console.log('\n🔍 Verificando estructura de la tabla...');
    
    const { data: tableData, error: tableError } = await supabase
      .from('reservas')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error verificando tabla:', tableError);
    } else {
      console.log('✅ Tabla reservas creada correctamente');
      console.log('📋 Estructura verificada');
    }

    // Probar inserción de datos
    console.log('\n🧪 Probando inserción de datos...');
    
    const testData = {
      cliente_nombre: 'Juan Pérez',
      cliente_rut: '12345678-9',
      cliente_email: 'juan@ejemplo.com',
      cliente_telefono: '+56912345678',
      fecha: '2025-09-23',
      hora: '10:00',
      descripcion: 'Consulta de prueba',
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
      .insert([testData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error insertando datos de prueba:', insertError);
    } else {
      console.log('✅ Inserción de prueba exitosa!');
      console.log('📋 Datos insertados:', insertData);
      
      // Limpiar el registro de prueba
      await supabase
        .from('reservas')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Registro de prueba eliminado');
    }

    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('✅ La tabla reservas está lista para usar');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

applyMigration();
