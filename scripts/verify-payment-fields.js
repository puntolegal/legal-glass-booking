#!/usr/bin/env node

/**
 * Script para verificar que los campos de pago existen en la tabla reservas
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyPaymentFields() {
  console.log('🔍 Verificando campos de pago en la tabla reservas...\n');

  try {
    // 1. Verificar estructura de la tabla
    console.log('📋 Verificando estructura de la tabla...');
    const { data: columns, error: columnsError } = await supabase
      .from('reservas')
      .select('*')
      .limit(1);

    if (columnsError) {
      console.error('❌ Error al verificar estructura:', columnsError);
      return;
    }

    if (columns && columns.length > 0) {
      const sampleRecord = columns[0];
      const expectedFields = [
        'pago_metodo',
        'pago_estado', 
        'pago_id',
        'pago_monto',
        'email_enviado'
      ];

      console.log('✅ Campos encontrados en la tabla:');
      expectedFields.forEach(field => {
        if (field in sampleRecord) {
          console.log(`   ✅ ${field}: ${typeof sampleRecord[field]} (${sampleRecord[field]})`);
        } else {
          console.log(`   ❌ ${field}: NO ENCONTRADO`);
        }
      });
    }

    // 2. Probar inserción con campos de pago
    console.log('\n🧪 Probando inserción con campos de pago...');
    const testData = {
      cliente_nombre: 'Test Payment Fields',
      cliente_rut: '12345678-9',
      cliente_email: 'test@payment.com',
      cliente_telefono: '+56912345678',
      fecha: '2025-09-23',
      hora: '10:00',
      descripcion: 'Prueba de campos de pago',
      servicio_tipo: 'Consulta General',
      servicio_precio: 1000.00,
      servicio_categoria: 'General',
      tipo_reunion: 'online',
      estado: 'pendiente',
      pago_metodo: 'mercadopago',
      pago_estado: 'pendiente',
      pago_id: 'test-payment-' + Date.now(),
      pago_monto: 1000.00,
      email_enviado: false
    };

    const { data: insertData, error: insertError } = await supabase
      .from('reservas')
      .insert([testData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error al insertar:', insertError);
      return;
    }

    console.log('✅ Inserción exitosa con campos de pago:');
    console.log(`   ID: ${insertData.id}`);
    console.log(`   Pago Método: ${insertData.pago_metodo}`);
    console.log(`   Pago Estado: ${insertData.pago_estado}`);
    console.log(`   Pago ID: ${insertData.pago_id}`);
    console.log(`   Pago Monto: ${insertData.pago_monto}`);

    // 3. Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .eq('cliente_email', 'test@payment.com');

    if (deleteError) {
      console.error('⚠️  Error al limpiar:', deleteError);
    } else {
      console.log('✅ Datos de prueba eliminados');
    }

    console.log('\n🎉 ¡Verificación completada! Los campos de pago están funcionando correctamente.');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
verifyPaymentFields();
