#!/usr/bin/env node

/**
 * Script para probar la inserción de reservas en Supabase
 * Verifica si las políticas RLS están funcionando correctamente
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhzLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testReservaInsert() {
  console.log('🧪 Probando inserción de reserva en Supabase...\n');

  try {
    // Datos de prueba similares a los del error
    const reservaData = {
      cliente_nombre: 'Juan Pérez',
      cliente_email: 'juan@ejemplo.com',
      cliente_telefono: '+56912345678',
      cliente_rut: '12345678-9',
      servicio_tipo: 'Consulta General',
      servicio_precio: '1.000',
      servicio_descripcion: 'General - ADMIN $1.000',
      fecha: '2024-01-15',
      hora: '10:00',
      pago_metodo: 'pendiente',
      pago_estado: 'pendiente',
      pago_id: null,
      pago_monto: 1000,
      notas: 'Tipo de reunión: videollamada | Código admin aplicado: PUNTOLEGALADMIN (Precio especial $1.000)',
      motivo_consulta: 'necesito asesoría con mi empresa',
      estado: 'pendiente'
    };

    console.log('📝 Datos de la reserva:');
    console.log(JSON.stringify(reservaData, null, 2));

    console.log('\n🔄 Intentando insertar reserva...');

    const { data: reserva, error } = await supabase
      .from('reservas')
      .insert(reservaData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error insertando reserva:');
      console.error('Código:', error.code);
      console.error('Mensaje:', error.message);
      console.error('Detalles:', error.details);
      console.error('Hint:', error.hint);

      if (error.code === '42501') {
        console.log('\n🔧 SOLUCIÓN:');
        console.log('1. Ve al SQL Editor de Supabase');
        console.log('2. Ejecuta el script: scripts/fix-rls-policies.sql');
        console.log('3. Esto creará las políticas RLS necesarias');
      }

      return false;
    }

    console.log('✅ Reserva insertada exitosamente:');
    console.log('ID:', reserva.id);
    console.log('Cliente:', reserva.cliente_nombre);
    console.log('Servicio:', reserva.servicio_tipo);
    console.log('Precio:', reserva.servicio_precio);

    // Limpiar la reserva de prueba
    console.log('\n🧹 Limpiando reserva de prueba...');
    await supabase
      .from('reservas')
      .delete()
      .eq('id', reserva.id);

    console.log('✅ Reserva de prueba eliminada');

    return true;

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return false;
  }
}

// Ejecutar prueba
testReservaInsert().then(success => {
  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('🎉 ¡PRUEBA EXITOSA! Las políticas RLS están funcionando correctamente');
  } else {
    console.log('❌ PRUEBA FALLIDA - Necesitas ejecutar el script SQL para corregir las políticas');
  }
  console.log('='.repeat(60));
});
