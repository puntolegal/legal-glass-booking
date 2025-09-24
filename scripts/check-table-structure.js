/**
 * Script para verificar la estructura de la tabla reservas
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla reservas...\n');

  try {
    // Intentar insertar una reserva mínima para ver qué columnas acepta
    const testData = {
      nombre: 'Test',
      email: 'test@test.com'
    };

    const { data, error } = await supabase
      .from('reservas')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.log('❌ Error (esperado):', error.message);
      console.log('📋 Esto nos dice qué columnas están disponibles');
    } else {
      console.log('✅ Datos insertados:', data);
    }

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

checkTableStructure();
