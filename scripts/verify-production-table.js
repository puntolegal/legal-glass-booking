#!/usr/bin/env node

/**
 * Script para verificar que la tabla reservas en producción tenga la estructura correcta
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyProductionTable() {
  console.log('🔍 Verificando tabla reservas en producción...\n');

  try {
    // Intentar insertar un registro de prueba con la estructura correcta
    console.log('🧪 Probando inserción con estructura correcta...');
    
    const testData = {
      cliente_nombre: 'Test Producción',
      cliente_rut: '12345678-9',
      cliente_email: 'test@produccion.com',
      cliente_telefono: '+56912345678',
      fecha: '2025-09-23',
      hora: '10:00',
      descripcion: 'Prueba de estructura de tabla en producción',
      servicio_tipo: 'Consulta General',
      servicio_precio: 1000,
      servicio_categoria: 'General',
      tipo_reunion: 'online',
      estado: 'pendiente',
      webhook_sent: false,
      recordatorio_enviado: false
    };

    const { data, error } = await supabase
      .from('reservas')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error insertando en producción:', error);
      
      if (error.message.includes('Could not find the')) {
        console.log('\n📋 La tabla necesita ser migrada en producción.');
        console.log('🔧 Ejecuta el SQL de migración en el Dashboard de Supabase:');
        console.log('   https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql');
        console.log('\n📄 Usa el archivo: MIGRATION_RESERVAS_TABLE.sql');
      }
      return;
    }

    console.log('✅ Inserción exitosa en producción!');
    console.log('📋 Datos insertados:', data);

    // Limpiar el registro de prueba
    await supabase
      .from('reservas')
      .delete()
      .eq('id', data.id);
    console.log('🧹 Registro de prueba eliminado');

    console.log('\n🎉 ¡La tabla reservas en producción está correctamente configurada!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyProductionTable();
