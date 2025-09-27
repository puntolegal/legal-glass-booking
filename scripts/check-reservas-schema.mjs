#!/usr/bin/env node

console.log('🔍 Verificando esquema de la tabla reservas...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function checkSchema() {
  console.log('🔍 Consultando esquema de la tabla reservas...');
  
  try {
    // Hacer una consulta simple para ver qué columnas están disponibles
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`❌ Error consultando tabla: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.length > 0) {
      console.log('✅ Columnas disponibles en la tabla reservas:');
      const columns = Object.keys(data[0]);
      columns.forEach((column, index) => {
        console.log(`   ${index + 1}. ${column}: ${typeof data[0][column]}`);
      });
      
      console.log('\n📋 Estructura de la reserva de ejemplo:');
      console.log(JSON.stringify(data[0], null, 2));
      
      return columns;
    } else {
      console.log('❌ No hay datos en la tabla');
      return null;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Verificando esquema de la tabla reservas...\n');
  
  const columns = await checkSchema();
  
  if (columns) {
    console.log('\n📊 RESUMEN:');
    console.log(`✅ Se encontraron ${columns.length} columnas en la tabla reservas`);
    console.log('✅ El esquema está disponible para consulta');
  } else {
    console.log('\n❌ No se pudo obtener el esquema de la tabla');
  }
  
  console.log('\n✨ Verificación completada');
}

main().catch(console.error);
