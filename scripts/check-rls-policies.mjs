#!/usr/bin/env node

console.log('🔍 Verificando políticas RLS de la tabla reservas...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function checkPublicAccess() {
  console.log('🔍 Verificando acceso público a la tabla reservas...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('❌ PROBLEMA DE SEGURIDAD: La tabla es públicamente accesible');
      console.log(`📋 Se pueden acceder a ${data.length} registros sin autenticación`);
      
      if (data.length > 0) {
        console.log('\n🚨 DATOS SENSIBLES EXPUESTOS:');
        data.forEach((reserva, index) => {
          console.log(`\n${index + 1}. Cliente: ${reserva.nombre || 'N/A'}`);
          console.log(`   Email: ${reserva.email || 'N/A'}`);
          console.log(`   Teléfono: ${reserva.telefono || 'N/A'}`);
          console.log(`   RUT: ${reserva.rut || 'N/A'}`);
          console.log(`   ID: ${reserva.id}`);
        });
      }
      return true; // Hay problema de seguridad
    } else {
      console.log('✅ La tabla está protegida (no accesible públicamente)');
      return false; // No hay problema
    }
  } catch (error) {
    console.log(`❌ Error verificando acceso: ${error.message}`);
    return true; // Asumir que hay problema si hay error
  }
}

async function checkTotalRecords() {
  console.log('\n🔍 Verificando número total de registros...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?select=count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log(`📊 Total de registros accesibles: ${data.length || 'No disponible'}`);
    } else {
      console.log('✅ No se puede acceder al conteo (tabla protegida)');
    }
  } catch (error) {
    console.log(`❌ Error obteniendo conteo: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Iniciando verificación de seguridad RLS...\n');
  
  const hasSecurityIssue = await checkPublicAccess();
  await checkTotalRecords();
  
  console.log('\n📊 RESUMEN DE SEGURIDAD:');
  console.log('═'.repeat(50));
  
  if (hasSecurityIssue) {
    console.log('❌ PROBLEMA CRÍTICO DE SEGURIDAD IDENTIFICADO');
    console.log('\n🚨 RIESGOS:');
    console.log('• Datos personales de clientes expuestos');
    console.log('• Posible robo de identidad');
    console.log('• Violación de privacidad');
    console.log('• Incumplimiento de normativas de protección de datos');
    
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    console.log('1. Deshabilitar acceso público a la tabla reservas');
    console.log('2. Implementar políticas RLS apropiadas');
    console.log('3. Permitir acceso solo a usuarios autenticados');
    console.log('4. Restringir acceso a Edge Functions autorizadas');
    console.log('5. Auditar todos los accesos a datos sensibles');
  } else {
    console.log('✅ La tabla reservas está correctamente protegida');
    console.log('✅ No hay exposición de datos sensibles');
  }
  
  console.log('\n✨ Verificación de seguridad completada');
}

main().catch(console.error);
