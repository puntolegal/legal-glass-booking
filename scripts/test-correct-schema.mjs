#!/usr/bin/env node

console.log('🔍 Probando esquema correcto de la tabla reservas...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testCorrectSchema() {
  console.log('🔍 Probando esquema correcto...');
  
  // Basándome en los errores, el esquema parece ser:
  // - nombre (no cliente_nombre)
  // - email (no cliente_email)  
  // - telefono (no cliente_telefono)
  // - rut es NOT NULL
  // - No hay servicio_tipo, probablemente es servicio
  
  const correctReservation = {
    nombre: 'Test Correcto',
    email: 'test@correcto.com',
    telefono: '+56912345678',
    rut: '12345678-9', // NOT NULL según el error
    servicio: 'Consulta Test', // Probablemente no es servicio_tipo
    precio: '1000',
    fecha: '2025-01-30',
    hora: '10:00',
    tipo_reunion: 'online',
    descripcion: 'Test con esquema correcto',
    estado: 'pendiente'
  };

  try {
    console.log('📤 Enviando datos:', JSON.stringify(correctReservation, null, 2));
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(correctReservation)
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 201) {
      console.log('🎉 ¡ÉXITO! Esquema correcto identificado');
      console.log('✅ Inserción exitosa');
      return { success: true, schema: correctReservation };
    } else {
      const errorText = await response.text();
      console.log('📝 Error:', errorText);
      
      // Intentar parsear el error para más información
      try {
        const errorData = JSON.parse(errorText);
        console.log('🔍 Código de error:', errorData.code);
        console.log('🔍 Mensaje:', errorData.message);
        
        if (errorData.message && errorData.message.includes('column')) {
          console.log('💡 Este error indica qué columna está causando problemas');
        }
      } catch (parseError) {
        console.log('❌ No se pudo parsear el error');
      }
      
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.log(`❌ Error en la prueba: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testWithMinimalData() {
  console.log('\n🔍 Probando con datos mínimos...');
  
  const minimalReservation = {
    nombre: 'Test Mínimo',
    email: 'test@minimo.com',
    telefono: '+56912345678',
    rut: '12345678-9',
    servicio: 'Test',
    precio: '1000',
    fecha: '2025-01-30',
    hora: '10:00'
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(minimalReservation)
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 201) {
      console.log('✅ Inserción exitosa con datos mínimos');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.log('📝 Error:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Iniciando prueba de esquema correcto...\n');
  
  // 1. Probar esquema completo
  const fullResult = await testCorrectSchema();
  
  // 2. Si falla, probar con datos mínimos
  let minimalResult = null;
  if (!fullResult.success) {
    minimalResult = await testWithMinimalData();
  }
  
  console.log('\n📊 RESUMEN DE PRUEBA DE ESQUEMA:');
  console.log('═'.repeat(50));
  
  if (fullResult.success) {
    console.log('🎉 ESQUEMA CORRECTO IDENTIFICADO');
    console.log('✅ La tabla reservas usa el esquema esperado');
    console.log('✅ Se pueden crear reservas correctamente');
    console.log('');
    console.log('📋 ESQUEMA FUNCIONANDO:');
    Object.keys(fullResult.schema).forEach(key => {
      console.log(`   • ${key}: ${fullResult.schema[key]}`);
    });
  } else if (minimalResult && minimalResult.success) {
    console.log('⚠️ ESQUEMA PARCIALMENTE CORRECTO');
    console.log('✅ Inserción exitosa con datos mínimos');
    console.log('❌ Esquema completo no funcionó');
    console.log('💡 Se necesita identificar campos adicionales requeridos');
  } else {
    console.log('❌ PROBLEMA PERSISTE');
    console.log('❌ Ningún esquema probado funcionó');
    console.log('💡 Se requiere revisión manual del esquema en Supabase');
    console.log('');
    console.log('🔧 ACCIONES REQUERIDAS:');
    console.log('1. Ir a Supabase Dashboard → Database → Tables');
    console.log('2. Revisar la tabla reservas y su esquema');
    console.log('3. Comparar con el código de inserción');
    console.log('4. Corregir las diferencias');
  }
  
  console.log('\n✨ Prueba de esquema completada');
}

main().catch(console.error);
