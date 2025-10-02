#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

console.log('🔍 VERIFICACIÓN POST-CORRECCIÓN DE SEGURIDAD');
console.log('=' .repeat(60));

async function testDataProtection() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    console.log('\n📋 Probando acceso a datos con clave anónima...');
    
    const { data, error } = await supabase
      .from('reservas')
      .select('id, nombre, email, telefono, servicio, precio')
      .limit(3);
    
    if (error) {
      console.log('✅ Acceso bloqueado:', error.message);
      console.log('🔒 Datos protegidos por RLS');
      return true;
    } else if (data && data.length > 0) {
      console.log('❌ PROBLEMA PERSISTE: Datos aún expuestos');
      console.log('📋 Datos accesibles:', JSON.stringify(data, null, 2));
      return false;
    } else {
      console.log('✅ Sin datos accesibles (protegido correctamente)');
      return true;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function testReservationCreation() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    console.log('\n📋 Probando creación de reserva...');
    
    const { data, error } = await supabase
      .from('reservas')
      .insert({
        nombre: 'Test Security Fix',
        email: 'test.security@puntolegal.online',
        telefono: '+56912345678',
        rut: '12345678-9',
        servicio: 'Test de Seguridad',
        precio: '10000',
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:00:00',
        descripcion: 'Prueba de seguridad post-corrección',
        estado: 'pendiente'
      })
      .select();
    
    if (error) {
      console.log('❌ Error creando reserva:', error.message);
      return false;
    } else {
      console.log('✅ Reserva creada exitosamente');
      console.log('📋 ID:', data[0].id);
      
      // Limpiar datos de prueba
      await supabase
        .from('reservas')
        .delete()
        .eq('id', data[0].id);
      
      console.log('🧹 Datos de prueba eliminados');
      return true;
    }
  } catch (error) {
    console.log('❌ Error general:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación post-corrección...\n');
  
  const dataProtected = await testDataProtection();
  const creationWorks = await testReservationCreation();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESULTADO DE LA VERIFICACIÓN');
  console.log('=' .repeat(60));
  
  console.log(`• Datos protegidos: ${dataProtected ? '✅' : '❌'}`);
  console.log(`• Creación de reservas: ${creationWorks ? '✅' : '❌'}`);
  
  if (dataProtected && creationWorks) {
    console.log('\n🎉 CORRECCIÓN EXITOSA');
    console.log('✅ Datos de clientes protegidos');
    console.log('✅ Formulario público sigue funcionando');
    console.log('✅ Seguridad implementada correctamente');
  } else {
    console.log('\n⚠️ CORRECCIÓN INCOMPLETA');
    console.log('❌ Se requieren ajustes adicionales');
    console.log('💡 Revisar políticas RLS en Supabase');
  }
  
  console.log('=' .repeat(60));
}

main().catch(console.error);

