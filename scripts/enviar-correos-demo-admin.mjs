#!/usr/bin/env node

/**
 * Script para enviar correos de demostración al admin
 * Muestra cómo se ven los diseños actuales
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';
const ADMIN_TOKEN = 'puntolegal-admin-token-2025';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function enviarCorreosDemo() {
  try {
    console.log('🎨 Enviando correos de demostración al admin...\n');

    // Obtener el último registro para usar datos reales
    const { data: reserva, error } = await supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !reserva) {
      console.error('❌ Error al buscar registro:', error?.message);
      console.log('ℹ️  Usando datos de ejemplo...');
      
      // Datos de ejemplo si no hay registros
      await enviarConDatosEjemplo();
      return;
    }

    console.log('✅ Usando datos del último registro:');
    console.log('=' .repeat(60));
    console.log(`👤 Nombre: ${reserva.nombre}`);
    console.log(`🏢 Servicio: ${reserva.servicio}`);
    console.log(`📅 Fecha: ${reserva.fecha}`);
    console.log(`⏰ Hora: ${reserva.hora}`);
    console.log('=' .repeat(60));

    console.log('\n📧 Enviando correos a: puntolegalelgolf@gmail.com');
    console.log('   - Correo de confirmación al cliente (diseño actual)');
    console.log('   - Correo de notificación al admin (diseño actual)');

    // Llamar a la Edge Function clever-action
    const { data: response, error: emailError } = await supabase.functions.invoke(
      'clever-action',
      {
        body: { booking_id: reserva.id },
        headers: {
          'x-admin-token': ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (emailError) {
      console.error('\n❌ Error al enviar correos:', emailError);
      console.error('Detalles:', JSON.stringify(emailError, null, 2));
      process.exit(1);
    }

    console.log('\n✅ ¡Correos enviados exitosamente!');
    console.log('📬 Revisa la bandeja de entrada de: puntolegalelgolf@gmail.com');
    console.log('\n📋 Deberías recibir 2 correos:');
    console.log('   1️⃣  Correo de confirmación (como cliente)');
    console.log('   2️⃣  Correo de notificación (como admin)');
    console.log('\n🎨 Podrás ver el diseño actual con:');
    console.log('   • Header negro (#1d1d1f)');
    console.log('   • Tipografía SF Pro Display / -apple-system');
    console.log('   • Cards con fondo #f5f5f7');
    console.log('   • Botones con azul Apple (#0071e3)');
    
    if (response) {
      console.log('\n📊 Respuesta del servidor:');
      console.log(JSON.stringify(response, null, 2));
    }

  } catch (error) {
    console.error('\n❌ Error general:', error);
    process.exit(1);
  }
}

async function enviarConDatosEjemplo() {
  // Crear una reserva de ejemplo
  const { data: nuevaReserva, error } = await supabase
    .from('reservas')
    .insert({
      nombre: 'Demo Cliente',
      email: 'puntolegalelgolf@gmail.com',
      telefono: '+56962321883',
      servicio: 'Punto Legal Familia',
      precio: '35.000',
      fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: '15:00:00',
      estado: 'pendiente',
      descripcion: 'Reserva de demostración para ver el diseño de los correos',
      tipo_reunion: 'videollamada',
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error al crear reserva de ejemplo:', error);
    process.exit(1);
  }

  console.log('✅ Reserva de ejemplo creada:', nuevaReserva.id);
  
  // Enviar correos con la reserva de ejemplo
  const { data: response, error: emailError } = await supabase.functions.invoke(
    'clever-action',
    {
      body: { booking_id: nuevaReserva.id },
      headers: {
        'x-admin-token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
    }
  );

  if (emailError) {
    console.error('❌ Error:', emailError);
  } else {
    console.log('✅ Correos enviados exitosamente');
    console.log('📬 Revisa: puntolegalelgolf@gmail.com');
  }
}

// Ejecutar
enviarCorreosDemo();

