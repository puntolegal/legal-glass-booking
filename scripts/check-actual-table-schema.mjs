#!/usr/bin/env node

console.log('🔍 Verificando esquema real de la tabla reservas...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function checkTableSchema() {
  console.log('🔍 Verificando esquema de la tabla reservas...');
  
  try {
    // Intentar insertar una reserva con datos mínimos para ver qué columnas son requeridas
    const minimalReservation = {
      nombre: 'Test Schema',
      email: 'test@schema.com',
      telefono: '+56912345678'
    };

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
      console.log('✅ Inserción exitosa con esquema mínimo');
      return { success: true, schema: 'minimal' };
    } else {
      const errorText = await response.text();
      console.log('📝 Error:', errorText);
      
      // Intentar parsear el error para obtener información del esquema
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message && errorData.message.includes('column')) {
          console.log('🔍 Información del esquema obtenida del error');
          return { success: false, error: errorData.message, schema: 'error_info' };
        }
      } catch (parseError) {
        console.log('❌ No se pudo parsear el error');
      }
      
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.log(`❌ Error verificando esquema: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function checkExistingData() {
  console.log('\n🔍 Verificando si hay datos existentes...');
  
  try {
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
      console.log(`📋 Registros encontrados: ${data.length}`);
      
      if (data.length > 0) {
        console.log('\n📊 ESTRUCTURA DE DATOS EXISTENTE:');
        console.log('═'.repeat(50));
        
        const reserva = data[0];
        Object.keys(reserva).forEach((key, index) => {
          const value = reserva[key];
          const type = typeof value;
          console.log(`${index + 1}. ${key}: ${type} = ${value}`);
        });
        
        return { success: true, hasData: true, structure: Object.keys(reserva) };
      } else {
        console.log('📋 No hay datos existentes');
        return { success: true, hasData: false };
      }
    } else {
      console.log(`⚠️ Status: ${response.status}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log(`❌ Error verificando datos: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testDifferentSchemas() {
  console.log('\n🔍 Probando diferentes esquemas posibles...');
  
  const schemas = [
    {
      name: 'Esquema original (cliente_*)',
      data: {
        cliente_nombre: 'Test Cliente',
        cliente_email: 'test@cliente.com',
        cliente_telefono: '+56912345678',
        servicio_tipo: 'Consulta Test',
        servicio_precio: '1000',
        fecha: '2025-01-30',
        hora: '10:00'
      }
    },
    {
      name: 'Esquema simple (sin prefijo)',
      data: {
        nombre: 'Test Simple',
        email: 'test@simple.com',
        telefono: '+56912345678',
        servicio: 'Consulta Test',
        precio: '1000',
        fecha: '2025-01-30',
        hora: '10:00'
      }
    },
    {
      name: 'Esquema básico (solo campos esenciales)',
      data: {
        nombre: 'Test Básico',
        email: 'test@basico.com',
        telefono: '+56912345678'
      }
    }
  ];

  for (const schema of schemas) {
    console.log(`\n📋 Probando: ${schema.name}`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(schema.data)
      });

      console.log(`   Status: ${response.status}`);
      
      if (response.status === 201) {
        console.log(`   ✅ ${schema.name} - FUNCIONANDO`);
        return { success: true, workingSchema: schema.name };
      } else {
        const errorText = await response.text();
        console.log(`   ❌ ${schema.name} - Error: ${errorText.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ ${schema.name} - Exception: ${error.message}`);
    }
  }
  
  return { success: false, workingSchema: null };
}

async function main() {
  console.log('🚀 Iniciando verificación de esquema real...\n');
  
  // 1. Verificar esquema con inserción mínima
  const schemaResult = await checkTableSchema();
  
  // 2. Verificar datos existentes
  const dataResult = await checkExistingData();
  
  // 3. Probar diferentes esquemas
  const testResult = await testDifferentSchemas();
  
  console.log('\n📊 RESUMEN DE VERIFICACIÓN DE ESQUEMA:');
  console.log('═'.repeat(60));
  
  if (testResult.success) {
    console.log(`🎉 ESQUEMA FUNCIONANDO: ${testResult.workingSchema}`);
    console.log('✅ Se puede insertar datos con este esquema');
  } else {
    console.log('❌ PROBLEMA DE ESQUEMA IDENTIFICADO');
    console.log('💡 Ningún esquema probado funcionó');
    console.log('');
    console.log('🔧 POSIBLES CAUSAS:');
    console.log('1. La tabla reservas no existe');
    console.log('2. Las columnas tienen nombres diferentes');
    console.log('3. Faltan columnas requeridas (NOT NULL)');
    console.log('4. Problemas de RLS impidiendo inserción');
    console.log('');
    console.log('📋 ACCIONES REQUERIDAS:');
    console.log('1. Verificar que la tabla reservas existe');
    console.log('2. Revisar el esquema real en Supabase Dashboard');
    console.log('3. Comparar con el esquema esperado en el código');
    console.log('4. Corregir las diferencias de esquema');
  }
  
  if (dataResult.success && dataResult.hasData) {
    console.log('\n📊 ESTRUCTURA DE DATOS EXISTENTE ENCONTRADA:');
    dataResult.structure.forEach((column, index) => {
      console.log(`   ${index + 1}. ${column}`);
    });
  }
  
  console.log('\n✨ Verificación de esquema completada');
}

main().catch(console.error);
