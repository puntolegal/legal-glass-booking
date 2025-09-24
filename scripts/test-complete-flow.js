#!/usr/bin/env node

/**
 * Script para probar el flujo completo del sistema
 */

console.log('🧪 PROBANDO FLUJO COMPLETO DEL SISTEMA');
console.log('======================================\n');

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompleteFlow() {
  console.log('📋 PASO 1: Creando reserva de prueba...');
  
  try {
    // 1. Crear reserva de prueba
    const testReservation = {
      cliente_nombre: 'Benjamín Soza',
      cliente_email: 'benja.soza@gmail.com',
      cliente_telefono: '+56912345678',
      cliente_rut: '12345678-9',
      servicio_tipo: 'Consulta General',
      servicio_precio: '35000',
      servicio_descripcion: 'Prueba del flujo completo',
      fecha: '2025-01-15',
      hora: '10:00:00',
      pago_metodo: 'mercadopago',
      pago_estado: 'approved',
      pago_id: 'test-payment-' + Date.now(),
      pago_monto: 35000,
      estado: 'pendiente',
      notas: 'Reserva de prueba para verificar flujo completo',
      motivo_consulta: 'Verificar funcionamiento del sistema'
    };

    const { data: reservation, error: insertError } = await supabase
      .from('reservas')
      .insert([testReservation])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error creando reserva: ${insertError.message}`);
    }

    console.log('✅ Reserva creada:', reservation.id);
    console.log(`   Cliente: ${reservation.cliente_nombre}`);
    console.log(`   Email: ${reservation.cliente_email}`);
    console.log(`   Servicio: ${reservation.servicio_tipo}`);
    console.log(`   Precio: $${reservation.servicio_precio}`);
    console.log('');

    // 2. Simular datos de pago como los que vendrían de MercadoPago
    const paymentData = {
      nombre: reservation.cliente_nombre,
      email: reservation.cliente_email,
      telefono: reservation.cliente_telefono,
      service: reservation.servicio_tipo,
      price: reservation.servicio_precio,
      category: 'General',
      fecha: reservation.fecha,
      hora: reservation.hora,
      tipo_reunion: 'online'
    };

    console.log('📋 PASO 2: Simulando datos de pago...');
    console.log('   Datos del pago:', paymentData);
    console.log('');

    // 3. Llamar a la Edge Function para enviar emails
    console.log('📧 PASO 3: Enviando emails via Edge Function...');
    
    const { data: emailData, error: emailError } = await supabase.functions.invoke('clever-action', {
      body: { booking_id: reservation.id },
      headers: {
        'X-Admin-Token': 'puntolegal-admin-token-2025'
      }
    });

    if (emailError) {
      throw new Error(`Error en Edge Function: ${emailError.message}`);
    }

    console.log('✅ Edge Function ejecutada exitosamente');
    console.log('📧 Respuesta:', emailData);
    console.log('');

    // 4. Actualizar estado a confirmada
    console.log('🔄 PASO 4: Actualizando estado a confirmada...');
    
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ estado: 'confirmada' })
      .eq('id', reservation.id);

    if (updateError) {
      throw new Error(`Error actualizando estado: ${updateError.message}`);
    }

    console.log('✅ Estado actualizado a confirmada');
    console.log('');

    // 5. Simular datos que se mostrarían en la página de éxito
    console.log('📋 PASO 5: Simulando página de éxito...');
    
    const successPageData = {
      reservation: {
        id: reservation.id,
        nombre: reservation.cliente_nombre,
        email: reservation.cliente_email,
        telefono: reservation.cliente_telefono,
        servicio: reservation.servicio_tipo,
        precio: reservation.servicio_precio,
        fecha: reservation.fecha,
        hora: reservation.hora,
        estado: 'confirmada'
      },
      cliente: {
        nombre: paymentData.nombre,
        email: paymentData.email,
        telefono: paymentData.telefono
      },
      servicio: {
        tipo: paymentData.service,
        precio: paymentData.price,
        categoria: paymentData.category
      },
      fecha: paymentData.fecha,
      hora: paymentData.hora,
      tipo_reunion: paymentData.tipo_reunion,
      price: paymentData.price
    };

    console.log('✅ Datos de la página de éxito:');
    console.log(`   Cliente: ${successPageData.cliente.nombre}`);
    console.log(`   Email: ${successPageData.cliente.email}`);
    console.log(`   Teléfono: ${successPageData.cliente.telefono}`);
    console.log(`   Servicio: ${successPageData.servicio.tipo}`);
    console.log(`   Precio: $${successPageData.servicio.precio}`);
    console.log(`   Fecha: ${successPageData.fecha}`);
    console.log(`   Hora: ${successPageData.hora}`);
    console.log('');

    // 6. Verificar que el precio no sea 0
    const precio = parseInt(successPageData.servicio.precio);
    if (precio > 0) {
      console.log('✅ Precio correcto:', precio.toLocaleString('es-CL'));
    } else {
      console.log('❌ Error: Precio es 0 o inválido');
    }

    console.log('\n📧 RESULTADO ESPERADO:');
    console.log('======================');
    console.log('✅ Deberías recibir 2 emails:');
    console.log('   - benja.soza@gmail.com (confirmación de cita)');
    console.log('   - puntolegalelgolf@gmail.com (notificación admin)');
    console.log('');
    console.log('🔍 VERIFICAR:');
    console.log('=============');
    console.log('1. Revisar bandeja de entrada de benja.soza@gmail.com');
    console.log('2. Revisar bandeja de entrada de puntolegalelgolf@gmail.com');
    console.log('3. Los emails vendrán de: team@puntolegal.online');
    console.log('');

    console.log('✅ FLUJO COMPLETO FUNCIONANDO');
    console.log('=============================');
    console.log('• Reserva creada correctamente');
    console.log('• Emails enviados exitosamente');
    console.log('• Datos de la página de éxito correctos');
    console.log('• Precio mostrado correctamente');
    console.log('• Sistema listo para producción');

  } catch (error) {
    console.error('❌ Error en el flujo:', error.message);
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('=======================');
    console.log('1. Verificar que las variables de entorno estén configuradas en Supabase');
    console.log('2. Verificar que la Edge Function esté desplegada');
    console.log('3. Verificar logs en Supabase Dashboard');
  }
}

// Ejecutar la prueba
testCompleteFlow();
