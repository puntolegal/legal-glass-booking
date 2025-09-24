#!/usr/bin/env node

/**
 * Script de verificación completa del sistema
 * Punto Legal - Sistema de Agendamiento
 */

import { createClient } from '@supabase/supabase-js';

// Configuración
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 VERIFICANDO SISTEMA COMPLETO - PUNTO LEGAL\n');

async function verifyDatabase() {
  console.log('📊 1. Verificando Base de Datos...');
  
  try {
    // Verificar que la tabla reservas existe
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'reservas');
    
    if (tablesError) {
      console.log('❌ Error verificando tablas:', tablesError.message);
      return false;
    }
    
    if (tables.length === 0) {
      console.log('❌ Tabla "reservas" no encontrada');
      return false;
    }
    
    console.log('✅ Tabla "reservas" existe');
    
    // Verificar estructura de la tabla
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'reservas')
      .order('ordinal_position');
    
    if (columnsError) {
      console.log('❌ Error verificando columnas:', columnsError.message);
      return false;
    }
    
    const requiredColumns = [
      'id', 'cliente_nombre', 'cliente_email', 'cliente_telefono',
      'servicio_tipo', 'servicio_precio', 'fecha', 'hora', 'estado'
    ];
    
    const existingColumns = columns.map(col => col.column_name);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('❌ Columnas faltantes:', missingColumns.join(', '));
      return false;
    }
    
    console.log('✅ Estructura de tabla correcta');
    
    // Verificar datos de prueba
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select('*')
      .limit(5);
    
    if (reservasError) {
      console.log('❌ Error consultando reservas:', reservasError.message);
      return false;
    }
    
    console.log(`✅ ${reservas.length} reservas encontradas`);
    
    return true;
  } catch (error) {
    console.log('❌ Error en verificación de base de datos:', error.message);
    return false;
  }
}

async function verifyEdgeFunctions() {
  console.log('\n🔧 2. Verificando Edge Functions...');
  
  try {
    // Verificar función send-resend-emails
    const response = await fetch(`${supabaseUrl}/functions/v1/send-resend-emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingData: {
          id: 'test-verification',
          cliente_nombre: 'Test Usuario',
          cliente_email: 'test@verification.com',
          cliente_telefono: '+56912345678',
          servicio_tipo: 'Consulta de Verificación',
          servicio_precio: '35000',
          fecha: '2025-01-25',
          hora: '10:00',
          tipo_reunion: 'online',
          descripcion: 'Verificación del sistema',
          pago_metodo: 'mercadopago',
          pago_estado: 'approved',
          created_at: new Date().toISOString()
        }
      })
    });
    
    if (!response.ok) {
      console.log('❌ Error en Edge Function:', response.status, response.statusText);
      return false;
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Edge Function "send-resend-emails" funcionando');
      console.log('✅ Emails enviados correctamente');
      return true;
    } else {
      console.log('❌ Error en Edge Function:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Error verificando Edge Functions:', error.message);
    return false;
  }
}

async function verifyFrontend() {
  console.log('\n🌐 3. Verificando Frontend...');
  
  try {
    const response = await fetch('http://localhost:8080');
    
    if (!response.ok) {
      console.log('❌ Frontend no disponible:', response.status);
      return false;
    }
    
    console.log('✅ Frontend funcionando en http://localhost:8080');
    
    // Verificar página de agendamiento
    const agendamientoResponse = await fetch('http://localhost:8080/agendamiento');
    
    if (!agendamientoResponse.ok) {
      console.log('❌ Página de agendamiento no disponible:', agendamientoResponse.status);
      return false;
    }
    
    console.log('✅ Página de agendamiento disponible');
    
    return true;
  } catch (error) {
    console.log('❌ Error verificando frontend:', error.message);
    return false;
  }
}

async function testReservationFlow() {
  console.log('\n🧪 4. Probando Flujo de Reserva...');
  
  try {
    // Crear una reserva de prueba
    const testReservation = {
      cliente_nombre: 'Usuario de Prueba',
      cliente_email: 'prueba@test.com',
      cliente_telefono: '+56998765432',
      cliente_rut: '12.345.678-9',
      servicio_tipo: 'Consulta de Prueba',
      servicio_precio: 25000,
      servicio_categoria: 'General',
      descripcion: 'Reserva de prueba del sistema',
      fecha: '2025-01-30',
      hora: '15:00',
      tipo_reunion: 'online',
      pago_metodo: 'mercadopago',
      pago_estado: 'approved',
      estado: 'confirmada'
    };
    
    const { data: reserva, error: insertError } = await supabase
      .from('reservas')
      .insert([testReservation])
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Error creando reserva de prueba:', insertError.message);
      return false;
    }
    
    console.log('✅ Reserva de prueba creada:', reserva.id);
    
    // Probar envío de emails
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-resend-emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingData: {
          id: reserva.id,
          cliente_nombre: reserva.cliente_nombre,
          cliente_email: reserva.cliente_email,
          cliente_telefono: reserva.cliente_telefono,
          servicio_tipo: reserva.servicio_tipo,
          servicio_precio: reserva.servicio_precio.toString(),
          fecha: reserva.fecha,
          hora: reserva.hora,
          tipo_reunion: reserva.tipo_reunion,
          descripcion: reserva.descripcion,
          pago_metodo: reserva.pago_metodo,
          pago_estado: reserva.pago_estado,
          created_at: reserva.created_at
        }
      })
    });
    
    if (!emailResponse.ok) {
      console.log('❌ Error enviando emails:', emailResponse.status);
      return false;
    }
    
    const emailResult = await emailResponse.json();
    
    if (emailResult.success) {
      console.log('✅ Emails enviados correctamente');
      console.log('✅ Email al cliente:', emailResult.clientEmail?.id || 'N/A');
      console.log('✅ Email al admin:', emailResult.adminEmail?.id || 'N/A');
    } else {
      console.log('❌ Error en envío de emails:', emailResult.error);
      return false;
    }
    
    // Limpiar reserva de prueba
    await supabase
      .from('reservas')
      .delete()
      .eq('id', reserva.id);
    
    console.log('✅ Reserva de prueba eliminada');
    
    return true;
  } catch (error) {
    console.log('❌ Error en flujo de reserva:', error.message);
    return false;
  }
}

async function main() {
  const results = {
    database: await verifyDatabase(),
    edgeFunctions: await verifyEdgeFunctions(),
    frontend: await verifyFrontend(),
    reservationFlow: await testReservationFlow()
  };
  
  console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
  console.log('========================');
  console.log(`Base de Datos: ${results.database ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Edge Functions: ${results.edgeFunctions ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Frontend: ${results.frontend ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Flujo de Reserva: ${results.reservationFlow ? '✅ OK' : '❌ ERROR'}`);
  
  const allOk = Object.values(results).every(result => result);
  
  if (allOk) {
    console.log('\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
    console.log('✅ Todas las verificaciones pasaron exitosamente');
    console.log('✅ El sistema está listo para producción');
  } else {
    console.log('\n⚠️ ALGUNAS VERIFICACIONES FALLARON');
    console.log('❌ Revisar los errores anteriores');
  }
  
  return allOk;
}

main().catch(console.error);
