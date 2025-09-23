#!/usr/bin/env node

/**
 * Verificación simple del sistema
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 VERIFICACIÓN SIMPLE DEL SISTEMA\n');

async function testReservation() {
  console.log('📊 Probando creación de reserva...');
  
  try {
    const testData = {
      cliente_nombre: 'Test Usuario',
      cliente_email: 'test@example.com',
      cliente_telefono: '+56912345678',
      cliente_rut: '12.345.678-9',
      servicio_tipo: 'Consulta de Prueba',
      servicio_precio: 25000,
      servicio_categoria: 'General',
      descripcion: 'Prueba del sistema',
      fecha: '2025-01-30',
      hora: '15:00',
      tipo_reunion: 'online',
      pago_metodo: 'mercadopago',
      pago_estado: 'approved',
      estado: 'confirmada'
    };
    
    const { data, error } = await supabase
      .from('reservas')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.log('❌ Error creando reserva:', error.message);
      return false;
    }
    
    console.log('✅ Reserva creada exitosamente:', data.id);
    
    // Limpiar
    await supabase
      .from('reservas')
      .delete()
      .eq('id', data.id);
    
    console.log('✅ Reserva eliminada');
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function testEdgeFunction() {
  console.log('\n🔧 Probando Edge Function...');
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-resend-emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingData: {
          id: 'test-123',
          cliente_nombre: 'Test Usuario',
          cliente_email: 'test@example.com',
          cliente_telefono: '+56912345678',
          servicio_tipo: 'Consulta de Prueba',
          servicio_precio: '25000',
          fecha: '2025-01-30',
          hora: '15:00',
          tipo_reunion: 'online',
          descripcion: 'Prueba del sistema',
          pago_metodo: 'mercadopago',
          pago_estado: 'approved',
          created_at: new Date().toISOString()
        }
      })
    });
    
    if (!response.ok) {
      console.log('❌ Error en Edge Function:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return false;
    }
    
    const result = await response.json();
    console.log('✅ Edge Function funcionando:', result.success);
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  const reservationOk = await testReservation();
  const edgeFunctionOk = await testEdgeFunction();
  
  console.log('\n📋 RESUMEN:');
  console.log(`Reservas: ${reservationOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Edge Function: ${edgeFunctionOk ? '✅ OK' : '❌ ERROR'}`);
  
  if (reservationOk && edgeFunctionOk) {
    console.log('\n🎉 ¡SISTEMA FUNCIONANDO!');
  } else {
    console.log('\n⚠️ ALGUNOS PROBLEMAS DETECTADOS');
  }
}

main().catch(console.error);
