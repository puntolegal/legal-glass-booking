#!/usr/bin/env node

/**
 * Script para enviar correos del último registro en Supabase
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function enviarCorreosUltimoRegistro() {
  try {
    console.log('🔍 Buscando último registro en Supabase...\n');

    // Obtener el último registro
    const { data: reserva, error } = await supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Error al buscar registro:', error.message);
      process.exit(1);
    }

    if (!reserva) {
      console.error('❌ No se encontraron registros en la base de datos');
      process.exit(1);
    }

    console.log('✅ Último registro encontrado:');
    console.log('=' .repeat(60));
    console.log(`📋 ID: ${reserva.id}`);
    console.log(`👤 Nombre: ${reserva.nombre}`);
    console.log(`📧 Email: ${reserva.email}`);
    console.log(`📱 Teléfono: ${reserva.telefono}`);
    console.log(`🏢 Servicio: ${reserva.servicio}`);
    console.log(`💰 Precio: $${reserva.precio}`);
    console.log(`📅 Fecha: ${reserva.fecha}`);
    console.log(`⏰ Hora: ${reserva.hora}`);
    console.log(`🎯 Estado: ${reserva.estado}`);
    console.log(`📝 External Reference: ${reserva.external_reference || 'N/A'}`);
    console.log(`🕐 Creado: ${reserva.created_at}`);
    console.log('=' .repeat(60));

    // Formatear fecha para el email
    const fechaFormateada = new Date(reserva.fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Preparar datos para el email
    const emailData = {
      reservationId: reserva.id,
      nombre: reserva.nombre,
      email: reserva.email,
      telefono: reserva.telefono,
      servicio: reserva.servicio,
      precio: reserva.precio,
      fecha: fechaFormateada,
      hora: reserva.hora,
      pagoEstado: reserva.pago_estado || 'Aprobado',
      pagoMetodo: 'MercadoPago',
      trackingCode: reserva.external_reference || `PL-${reserva.id.substring(0, 8).toUpperCase()}`,
      googleMeetLink: 'https://meet.google.com/abc-defg-hij',
    };

    console.log('\n📧 Enviando correos...');
    console.log('Datos del email:');
    console.log(JSON.stringify(emailData, null, 2));

    // Llamar a la Edge Function
    const { data: response, error: emailError } = await supabase.functions.invoke(
      'send-booking-email',
      {
        body: emailData,
      }
    );

    if (emailError) {
      console.error('\n❌ Error al enviar correos:', emailError);
      console.error('Detalles:', JSON.stringify(emailError, null, 2));
      process.exit(1);
    }

    console.log('\n✅ ¡Correos enviados exitosamente!');
    console.log('Respuesta:', JSON.stringify(response, null, 2));
    
    console.log('\n🎉 PROCESO COMPLETADO');
    console.log('=' .repeat(60));
    console.log('📧 Se enviaron correos a:');
    console.log(`   • Cliente: ${reserva.email}`);
    console.log(`   • Admin: puntolegalelgolf@gmail.com`);
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('\n❌ Error general:', error);
    process.exit(1);
  }
}

// Ejecutar
enviarCorreosUltimoRegistro();

