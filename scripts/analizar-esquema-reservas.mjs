#!/usr/bin/env node

/**
 * 🔍 ANÁLISIS: Esquema de tabla reservas
 * Identifica columnas duplicadas, redundantes y problemáticas
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 ANÁLISIS DEL ESQUEMA DE RESERVAS\n');
console.log('='.repeat(60));

async function analizarEsquemaReservas() {
  try {
    // 1. Obtener una muestra de datos para analizar
    console.log('📋 1. ANALIZANDO ESTRUCTURA DE DATOS...\n');
    
    const { data: muestraReservas, error: errorMuestra } = await supabase
      .from('reservas')
      .select('*')
      .limit(3);

    if (errorMuestra) {
      console.error('❌ Error obteniendo muestra:', errorMuestra);
      return;
    }

    if (muestraReservas && muestraReservas.length > 0) {
      const columnas = Object.keys(muestraReservas[0]);
      console.log(`📊 Total de columnas: ${columnas.length}`);
      console.log('📋 Columnas encontradas:');
      columnas.forEach((columna, index) => {
        console.log(`   ${index + 1}. ${columna}`);
      });
    }

    // 2. Identificar columnas duplicadas/redundantes
    console.log('\n🚨 2. IDENTIFICANDO PROBLEMAS...\n');
    
    const problemas = [
      {
        tipo: 'DUPLICADAS',
        columnas: [
          { original: 'nombre', duplicada: 'cliente_nombre' },
          { original: 'email', duplicada: 'cliente_email' },
          { original: 'telefono', duplicada: 'cliente_telefono' },
          { original: 'servicio', duplicada: 'servicio_nombre' },
          { original: 'precio', duplicada: 'servicio_precio' },
          { original: 'fecha', duplicada: 'fecha_agendada' },
          { original: 'hora', duplicada: 'hora_agendada' }
        ]
      },
      {
        tipo: 'REDUNDANTES',
        columnas: [
          'descripcion',
          'motivo_consulta',
          'notas'
        ]
      },
      {
        tipo: 'NO UTILIZADAS',
        columnas: [
          'rut',
          'recordatorio_enviado',
          'webhook_sent',
          'user_id',
          'categoria',
          'preference_id',
          'pago_id',
          'pago_metodo'
        ]
      }
    ];

    problemas.forEach(problema => {
      console.log(`🔍 ${problema.tipo}:`);
      if (Array.isArray(problema.columnas)) {
        problema.columnas.forEach(columna => {
          if (typeof columna === 'string') {
            console.log(`   ❌ ${columna}`);
          } else {
            console.log(`   ❌ ${columna.duplicada} (duplica ${columna.original})`);
          }
        });
      }
      console.log('');
    });

    // 3. Analizar uso real de las columnas
    console.log('📊 3. ANÁLISIS DE USO REAL...\n');
    
    const { data: analisisUso, error: errorAnalisis } = await supabase
      .from('reservas')
      .select('nombre, cliente_nombre, email, cliente_email, servicio, servicio_nombre, fecha, fecha_agendada')
      .limit(10);

    if (!errorAnalisis && analisisUso) {
      console.log('🔍 Comparación de columnas duplicadas:');
      
      const duplicadas = [
        { original: 'nombre', duplicada: 'cliente_nombre' },
        { original: 'email', duplicada: 'cliente_email' },
        { original: 'servicio', duplicada: 'servicio_nombre' },
        { original: 'fecha', duplicada: 'fecha_agendada' }
      ];

      duplicadas.forEach(dup => {
        const valoresOriginales = analisisUso.map(r => r[dup.original]).filter(v => v !== null);
        const valoresDuplicadas = analisisUso.map(r => r[dup.duplicada]).filter(v => v !== null);
        
        console.log(`\n📋 ${dup.original} vs ${dup.duplicada}:`);
        console.log(`   ${dup.original}: ${valoresOriginales.length} valores`);
        console.log(`   ${dup.duplicada}: ${valoresDuplicadas.length} valores`);
        
        if (valoresOriginales.length > 0 && valoresDuplicadas.length === 0) {
          console.log(`   ✅ ${dup.original} se usa, ${dup.duplicada} está vacía`);
        } else if (valoresOriginales.length === 0 && valoresDuplicadas.length > 0) {
          console.log(`   ⚠️  ${dup.original} está vacía, ${dup.duplicada} se usa`);
        } else if (valoresOriginales.length > 0 && valoresDuplicadas.length > 0) {
          console.log(`   ❌ Ambas se usan - DUPLICACIÓN CONFIRMADA`);
        }
      });
    }

    // 4. Recomendaciones de limpieza
    console.log('\n🎯 4. RECOMENDACIONES DE LIMPIEZA...\n');
    
    console.log('✅ COLUMNAS A MANTENER (ESENCIALES):');
    const mantener = [
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
    
    mantener.forEach(columna => {
      console.log(`   ✅ ${columna}`);
    });

    console.log('\n❌ COLUMNAS A ELIMINAR (REDUNDANTES/NO USADAS):');
    const eliminar = [
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
    
    eliminar.forEach(columna => {
      console.log(`   ❌ ${columna}`);
    });

    // 5. Script de migración sugerido
    console.log('\n🔧 5. SCRIPT DE MIGRACIÓN SUGERIDO...\n');
    
    console.log('-- Limpiar tabla reservas eliminando columnas redundantes');
    console.log('-- PASO 1: Backup de datos importantes');
    console.log('-- PASO 2: Eliminar columnas duplicadas');
    console.log('-- PASO 3: Verificar integridad de datos');
    console.log('-- PASO 4: Actualizar código para usar solo columnas esenciales');

    console.log('\n📋 BENEFICIOS DE LA LIMPIEZA:');
    console.log('   ✅ Menos confusión en el código');
    console.log('   ✅ Mejor rendimiento de consultas');
    console.log('   ✅ Esquema más claro y mantenible');
    console.log('   ✅ Menos errores de datos inconsistentes');
    console.log('   ✅ Código más limpio y fácil de mantener');

  } catch (error) {
    console.error('❌ Error en análisis:', error);
  }
}

// Ejecutar análisis
analizarEsquemaReservas();
