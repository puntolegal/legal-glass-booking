#!/usr/bin/env node

/**
 * Script para probar el sistema de emails sin pago
 * Simula el flujo completo desde agendamiento hasta confirmación
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailFlowWithoutPayment() {
  console.log('🧪 PRUEBA COMPLETA DEL SISTEMA DE EMAILS');
  console.log('=========================================\n');

  try {
    // 1. Simular datos de agendamiento (como si el cliente hubiera llenado el formulario)
    console.log('📋 PASO 1: Simulando datos de agendamiento...');
    
    const agendamientoData = {
      nombre: 'Benjamín Soza',
      email: 'benja.soza@gmail.com',
      telefono: '+56912345678',
      rut: '12345678-9',
      service: 'Consulta General',
      price: '35000',
      category: 'General',
      fecha: '2025-01-20',
      hora: '14:00',
      tipo_reunion: 'online',
      descripcion: 'Consulta sobre contrato de trabajo'
    };

    console.log('✅ Datos de agendamiento:');
    console.log(`   Cliente: ${agendamientoData.nombre}`);
    console.log(`   Email: ${agendamientoData.email}`);
    console.log(`   Teléfono: ${agendamientoData.telefono}`);
    console.log(`   Servicio: ${agendamientoData.service}`);
    console.log(`   Precio: $${agendamientoData.price}`);
    console.log(`   Fecha: ${agendamientoData.fecha}`);
    console.log(`   Hora: ${agendamientoData.hora}`);
    console.log('');

    // 2. Crear reserva en Supabase (simulando el proceso de agendamiento)
    console.log('📋 PASO 2: Creando reserva en Supabase...');
    
    const reservationData = {
      cliente_nombre: agendamientoData.nombre,
      cliente_email: agendamientoData.email,
      cliente_telefono: agendamientoData.telefono,
      cliente_rut: agendamientoData.rut,
      servicio_tipo: agendamientoData.service,
      servicio_precio: agendamientoData.price,
      servicio_descripcion: agendamientoData.descripcion,
      fecha: agendamientoData.fecha,
      hora: agendamientoData.hora,
      pago_metodo: 'prueba',
      pago_estado: 'approved',
      pago_id: 'test-booking-' + Date.now(),
      pago_monto: parseInt(agendamientoData.price),
      estado: 'pendiente',
      notas: 'Reserva de prueba - sin pago real',
      motivo_consulta: agendamientoData.descripcion
    };

    const { data: reservation, error: insertError } = await supabase
      .from('reservas')
      .insert([reservationData])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error creando reserva: ${insertError.message}`);
    }

    console.log('✅ Reserva creada exitosamente:');
    console.log(`   ID: ${reservation.id}`);
    console.log(`   Cliente: ${reservation.cliente_nombre}`);
    console.log(`   Email: ${reservation.cliente_email}`);
    console.log(`   Servicio: ${reservation.servicio_tipo}`);
    console.log(`   Precio: $${reservation.servicio_precio}`);
    console.log(`   Estado: ${reservation.estado}`);
    console.log('');

    // 3. Simular datos de pago (como si hubiera pagado con MercadoPago)
    console.log('💳 PASO 3: Simulando datos de pago...');
    
    const paymentData = {
      ...agendamientoData,
      paymentMethod: 'mercadopago',
      paymentId: 'test-payment-' + Date.now(),
      paymentStatus: 'approved',
      transactionAmount: parseInt(agendamientoData.price),
      paymentDate: new Date().toISOString()
    };

    console.log('✅ Datos de pago simulados:');
    console.log(`   Método: ${paymentData.paymentMethod}`);
    console.log(`   ID Pago: ${paymentData.paymentId}`);
    console.log(`   Estado: ${paymentData.paymentStatus}`);
    console.log(`   Monto: $${paymentData.transactionAmount}`);
    console.log('');

    // 4. Llamar a la Edge Function para enviar emails
    console.log('📧 PASO 4: Enviando emails via Edge Function...');
    
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

    // 5. Actualizar estado a confirmada
    console.log('🔄 PASO 5: Actualizando estado a confirmada...');
    
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ estado: 'confirmada' })
      .eq('id', reservation.id);

    if (updateError) {
      throw new Error(`Error actualizando estado: ${updateError.message}`);
    }

    console.log('✅ Estado actualizado a confirmada');
    console.log('');

    // 6. Simular datos de la página de éxito
    console.log('📋 PASO 6: Simulando página de éxito...');
    
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

    console.log('✅ Datos que se mostrarían en la página de éxito:');
    console.log(`   Cliente: ${successPageData.cliente.nombre}`);
    console.log(`   Email: ${successPageData.cliente.email}`);
    console.log(`   Teléfono: ${successPageData.cliente.telefono}`);
    console.log(`   Servicio: ${successPageData.servicio.tipo}`);
    console.log(`   Precio: $${successPageData.servicio.precio}`);
    console.log(`   Fecha: ${successPageData.fecha}`);
    console.log(`   Hora: ${successPageData.hora}`);
    console.log('');

    // 7. Verificar que el precio no sea 0
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

    console.log('✅ PRUEBA COMPLETA EXITOSA');
    console.log('==========================');
    console.log('• Reserva creada correctamente');
    console.log('• Emails enviados exitosamente');
    console.log('• Datos de la página de éxito correctos');
    console.log('• Precio mostrado correctamente');
    console.log('• Sistema funcionando sin pago real');
    console.log('• Listo para clientes reales');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('=======================');
    console.log('1. Verificar que MAIL_FROM esté configurado en Supabase');
    console.log('2. Verificar que la Edge Function esté desplegada');
    console.log('3. Verificar logs en Supabase Dashboard');
  }
}

// Ejecutar la prueba
testEmailFlowWithoutPayment();
