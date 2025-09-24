#!/usr/bin/env node

/**
 * Script para probar la conexión con Supabase usando diferentes métodos
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1iozmO5fKALjbI';

console.log('🔍 PROBANDO CONEXIÓN CON SUPABASE');
console.log('================================');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey.length);
console.log('Key preview:', supabaseKey.substring(0, 50) + '...');

// Método 1: Verificar con fetch directo
async function testDirectFetch() {
  console.log('\n📡 Método 1: Fetch directo a la API');
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Conexión exitosa con fetch directo');
      return true;
    } else {
      console.log('❌ Error con fetch directo');
      return false;
    }
  } catch (error) {
    console.log('❌ Error en fetch directo:', error.message);
    return false;
  }
}

// Método 2: Verificar con Supabase client
async function testSupabaseClient() {
  console.log('\n📡 Método 2: Supabase client');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('reservas')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Error con Supabase client:', error.message);
      console.log('Código:', error.code);
      console.log('Detalles:', error.details);
      return false;
    } else {
      console.log('✅ Conexión exitosa con Supabase client');
      console.log('Datos:', data);
      return true;
    }
  } catch (error) {
    console.log('❌ Error en Supabase client:', error.message);
    return false;
  }
}

// Método 3: Verificar con ping simple
async function testPing() {
  console.log('\n📡 Método 3: Ping simple');
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      console.log('✅ Ping exitoso');
      return true;
    } else {
      console.log('❌ Ping falló');
      return false;
    }
  } catch (error) {
    console.log('❌ Error en ping:', error.message);
    return false;
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log('🚀 Iniciando pruebas de conexión...\n');
  
  const results = await Promise.all([
    testDirectFetch(),
    testSupabaseClient(),
    testPing()
  ]);
  
  const successCount = results.filter(r => r).length;
  
  console.log('\n📊 RESUMEN DE PRUEBAS');
  console.log('====================');
  console.log(`Pruebas exitosas: ${successCount}/3`);
  
  if (successCount === 0) {
    console.log('\n❌ TODAS LAS PRUEBAS FALLARON');
    console.log('Posibles causas:');
    console.log('1. API key inválida o expirada');
    console.log('2. Proyecto de Supabase inactivo');
    console.log('3. Problema de red o DNS');
    console.log('4. Configuración incorrecta del proyecto');
  } else if (successCount < 3) {
    console.log('\n⚠️ ALGUNAS PRUEBAS FALLARON');
    console.log('El sistema puede funcionar parcialmente');
  } else {
    console.log('\n✅ TODAS LAS PRUEBAS EXITOSAS');
    console.log('La conexión con Supabase está funcionando correctamente');
  }
}

runAllTests().catch(console.error);
