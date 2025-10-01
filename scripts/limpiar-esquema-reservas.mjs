#!/usr/bin/env node

/**
 * 🧹 LIMPIEZA: Esquema de tabla reservas
 * Elimina columnas redundantes y no utilizadas para simplificar el esquema
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧹 LIMPIEZA DEL ESQUEMA DE RESERVAS\n');
console.log('='.repeat(60));

async function limpiarEsquemaReservas() {
  try {
    console.log('⚠️  IMPORTANTE: Este script solo muestra los comandos SQL necesarios');
    console.log('⚠️  NO ejecuta cambios automáticamente por seguridad\n');

    // Columnas a eliminar
    const columnasAEliminar = [
      'rut',
      'cliente_nombre',
      'cliente_email', 
      'cliente_telefono',
      'servicio_nombre',
      'servicio_precio',
      'fecha_agendada',
      'hora_agendada',
      'motivo_consulta',
      'notas',
      'recordatorio_enviado',
      'webhook_sent',
      'user_id',
      'categoria',
      'preference_id',
      'pago_id',
      'pago_metodo'
    ];

    console.log('📋 COLUMNAS A ELIMINAR:');
    columnasAEliminar.forEach((columna, index) => {
      console.log(`   ${index + 1}. ${columna}`);
    });

    console.log('\n🔧 COMANDOS SQL PARA LIMPIEZA:\n');
    
    console.log('-- PASO 1: Backup de la tabla actual');
    console.log('CREATE TABLE reservas_backup AS SELECT * FROM reservas;');
    console.log('');

    console.log('-- PASO 2: Eliminar columnas redundantes');
    columnasAEliminar.forEach(columna => {
      console.log(`ALTER TABLE reservas DROP COLUMN IF EXISTS ${columna};`);
    });

    console.log('\n-- PASO 3: Verificar estructura final');
    console.log('\\d reservas');

    console.log('\n📊 ESTRUCTURA FINAL ESPERADA (17 columnas):');
    const columnasFinales = [
      'id',
      'nombre',
      'email', 
      'telefono',
      'servicio',
      'precio',
      'fecha',
      'hora',
      'descripcion',
      'tipo_reunion',
      'estado',
      'created_at',
      'updated_at',
      'external_reference',
      'pago_estado',
      'email_enviado',
      'email_enviado_at'
    ];

    columnasFinales.forEach((columna, index) => {
      console.log(`   ${index + 1}. ${columna}`);
    });

    console.log('\n🎯 BENEFICIOS DE LA LIMPIEZA:');
    console.log('   ✅ Reducción de 34 a 17 columnas (50% menos)');
    console.log('   ✅ Eliminación de duplicaciones');
    console.log('   ✅ Esquema más claro y mantenible');
    console.log('   ✅ Mejor rendimiento de consultas');
    console.log('   ✅ Menos confusión en el código');
    console.log('   ✅ Datos más consistentes');

    console.log('\n⚠️  PASOS PARA EJECUTAR:');
    console.log('   1. Ejecutar comandos SQL en Supabase Dashboard');
    console.log('   2. Verificar que no hay errores');
    console.log('   3. Actualizar código para usar solo columnas esenciales');
    console.log('   4. Probar funcionalidad completa');

    console.log('\n🔍 VERIFICACIÓN POST-LIMPIEZA:');
    console.log('   - Verificar que emails siguen funcionando');
    console.log('   - Confirmar que webhook actualiza datos correctamente');
    console.log('   - Probar creación de nuevas reservas');
    console.log('   - Validar que no hay errores en el código');

  } catch (error) {
    console.error('❌ Error en análisis:', error);
  }
}

// Ejecutar limpieza
limpiarEsquemaReservas();
