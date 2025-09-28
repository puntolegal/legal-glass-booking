#!/usr/bin/env node

console.log('🔍 Verificando columnas de la tabla reservas...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function checkTableColumns() {
  console.log('🔍 Verificando columnas de la tabla reservas...');
  
  try {
    // Intentar obtener una reserva para ver qué columnas existen
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log(`📋 Datos obtenidos: ${data.length} registros`);
      
      if (data.length > 0) {
        const reserva = data[0];
        console.log('\n📊 COLUMNAS DISPONIBLES EN LA TABLA:');
        console.log('═'.repeat(50));
        
        Object.keys(reserva).forEach((key, index) => {
          const value = reserva[key];
          const type = typeof value;
          console.log(`${index + 1}. ${key}: ${type} = ${value}`);
        });
        
        // Verificar columnas específicas
        const hasExternalReference = 'external_reference' in reserva;
        const hasPreferenceId = 'preference_id' in reserva;
        
        console.log('\n🔍 VERIFICACIÓN DE COLUMNAS ESPECÍFICAS:');
        console.log(`external_reference: ${hasExternalReference ? '✅ SÍ' : '❌ NO'}`);
        console.log(`preference_id: ${hasPreferenceId ? '✅ SÍ' : '❌ NO'}`);
        
        if (!hasExternalReference) {
          console.log('\n⚠️ PROBLEMA: La tabla NO tiene columna external_reference');
          console.log('💡 Esto explica por qué no se puede encontrar la reserva');
          console.log('🔧 SOLUCIÓN: Agregar columna external_reference a la tabla');
        }
        
        if (!hasPreferenceId) {
          console.log('\n⚠️ PROBLEMA: La tabla NO tiene columna preference_id');
          console.log('💡 Esto explica por qué no se puede buscar por preference_id');
          console.log('🔧 SOLUCIÓN: Agregar columna preference_id a la tabla');
        }
        
      } else {
        console.log('📋 No hay datos en la tabla para verificar columnas');
      }
    } else if (response.status === 401 || response.status === 403) {
      console.log('✅ Tabla protegida (RLS funcionando)');
      console.log('⚠️ No se puede verificar columnas sin autenticación');
    } else {
      console.log(`❌ Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error verificando columnas: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Iniciando verificación de columnas...\n');
  
  await checkTableColumns();
  
  console.log('\n✨ Verificación completada');
}

main().catch(console.error);
