#!/usr/bin/env node

console.log('🔍 Verificando que las funciones de debug funcionen correctamente...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function testDebugFunctionData() {
  console.log('🔍 Probando inserción con datos que usarían las funciones de debug...');
  
  // Simular los datos que usaría quickDatabaseSetup
  const debugReservationData = {
    nombre: 'Juan Pérez Test',
    rut: '12345678-9',
    email: 'juan.test@puntolegal.cl',
    telefono: '+56912345678',
    servicio: 'Consulta laboral de prueba',
    precio: '35000',
    fecha: '2025-01-31',
    hora: '15:00',
    descripcion: 'Consulta laboral de prueba - sistema de notificaciones',
    tipo_reunion: 'online',
    estado: 'pendiente',
    recordatorio_enviado: false,
    webhook_sent: false,
    user_id: 'migration_placeholder' // Valor corregido
  };

  try {
    console.log('📤 Enviando datos de debug...');
    console.log('📋 Datos:', JSON.stringify(debugReservationData, null, 2));
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(debugReservationData)
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 201) {
      console.log('🎉 ¡ÉXITO! Datos de debug funcionan correctamente');
      console.log('✅ PuntoLegalDebug.quickSetup() debería funcionar ahora');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('🔍 Código de error:', errorData.code);
        console.log('🔍 Mensaje:', errorData.message);
        
        if (errorData.code === '42501') {
          console.log('🔒 Error RLS persistente');
          return { success: false, error: errorData.message, type: 'rls_policy' };
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

async function main() {
  console.log('🚀 Verificando funciones de debug...\n');
  
  const result = await testDebugFunctionData();
  
  console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
  console.log('═'.repeat(50));
  
  if (result.success) {
    console.log('🎉 FUNCIONES DE DEBUG CORREGIDAS');
    console.log('✅ user_id: migration_placeholder funciona correctamente');
    console.log('✅ PuntoLegalDebug.quickSetup() debería funcionar');
    console.log('✅ PuntoLegalDebug.testEmails() debería funcionar');
    console.log('');
    console.log('🔄 PASOS PARA APLICAR LA CORRECCIÓN:');
    console.log('1. Refrescar la página del navegador (F5 o Ctrl+R)');
    console.log('2. Ejecutar PuntoLegalDebug.quickSetup() en la consola');
    console.log('3. Verificar que no aparezcan errores 42501');
  } else if (result.type === 'rls_policy') {
    console.log('🔒 PROBLEMA DE RLS PERSISTE');
    console.log('❌ Las políticas RLS siguen bloqueando la inserción');
    console.log('💡 Aunque el código está corregido, las políticas necesitan actualización');
    console.log('');
    console.log('🔧 SOLUCIÓN REQUERIDA:');
    console.log('1. Ejecutar FIX_RLS_INSERT_POLICY.sql en Supabase Dashboard');
    console.log('2. Permitir INSERT para usuarios anónimos');
    console.log('3. Refrescar la página y probar nuevamente');
  } else {
    console.log('❌ PROBLEMA PERSISTE');
    console.log(`❌ Error: ${result.error}`);
    console.log('💡 Se requiere revisión adicional');
  }
  
  console.log('\n✨ Verificación completada');
}

main().catch(console.error);
