#!/usr/bin/env node

/**
 * Script para probar el sistema de emails solo para admin
 * (debido a limitaciones de Resend sin dominio verificado)
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailSystemAdminOnly() {
  console.log('🧪 PROBANDO SISTEMA DE EMAILS (SOLO ADMIN)');
  console.log('===========================================\n');

  try {
    // 1. Crear una reserva de prueba
    console.log('📝 Paso 1: Creando reserva de prueba...');
    
    const testReservation = {
      cliente_nombre: 'Benjamín Soza',
      cliente_email: 'benja.soza@gmail.com', // Cliente real
      cliente_telefono: '+56912345678',
      cliente_rut: '12345678-9',
      servicio_tipo: 'Consulta General',
      servicio_precio: '35000',
      servicio_descripcion: 'Prueba del sistema de emails',
      fecha: '2025-01-15',
      hora: '10:00:00',
      pago_metodo: 'prueba',
      pago_estado: 'approved',
      pago_id: 'test-payment-' + Date.now(),
      pago_monto: 35000,
      estado: 'pendiente',
      notas: 'Reserva de prueba para verificar sistema de emails',
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

    console.log('✅ Reserva creada exitosamente:', reservation.id);
    console.log(`   Cliente: ${reservation.cliente_nombre}`);
    console.log(`   Email Cliente: ${reservation.cliente_email}`);
    console.log(`   Servicio: ${reservation.servicio_tipo}`);
    console.log(`   Precio: $${reservation.servicio_precio}\n`);

    // 2. Llamar a la Edge Function para enviar emails
    console.log('📧 Paso 2: Enviando emails via Edge Function...');
    console.log('   ⚠️  NOTA: Solo se enviará al admin (puntolegalelgolf@gmail.com)');
    console.log('   ⚠️  El email del cliente no se enviará hasta verificar dominio');
    console.log('');
    
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

    // 3. Actualizar estado de la reserva a confirmada
    console.log('🔄 Paso 3: Actualizando estado a confirmada...');
    
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ estado: 'confirmada' })
      .eq('id', reservation.id);

    if (updateError) {
      console.warn('⚠️ Error actualizando estado:', updateError.message);
    } else {
      console.log('✅ Estado actualizado a confirmada');
    }

    console.log('\n📧 RESULTADO ESPERADO:');
    console.log('======================');
    console.log('✅ Deberías recibir 1 email:');
    console.log('   - puntolegalelgolf@gmail.com (notificación admin)');
    console.log('');
    console.log('❌ NO se enviará email a:');
    console.log('   - benja.soza@gmail.com (cliente) - requiere dominio verificado');
    console.log('');
    console.log('🔍 VERIFICAR:');
    console.log('=============');
    console.log('1. Revisar bandeja de entrada de puntolegalelgolf@gmail.com');
    console.log('2. Buscar email con asunto: "Nueva reserva pagada"');
    console.log('3. Verificar logs en Supabase Dashboard → Edge Functions → clever-action');
    console.log('');

    console.log('⚠️  LIMITACIÓN ACTUAL:');
    console.log('======================');
    console.log('• Solo se puede enviar a puntolegalelgolf@gmail.com');
    console.log('• Para enviar a clientes, verificar dominio en resend.com/domains');
    console.log('• El sistema funciona pero solo notifica al admin');
    console.log('');

    console.log('✅ PRUEBA COMPLETADA (MODO ADMIN)');
    console.log('=================================');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('=======================');
    console.log('1. Verificar que las variables de entorno estén configuradas en Supabase');
    console.log('2. Verificar que la Edge Function esté desplegada');
    console.log('3. Verificar logs en Supabase Dashboard');
  }
}

// Ejecutar la prueba
testEmailSystemAdminOnly();
