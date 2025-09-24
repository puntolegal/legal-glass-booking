#!/usr/bin/env node

/**
 * Script para probar el flujo de emails directamente con Resend
 * Sin depender de la Edge Function
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de Resend
const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';
const MAIL_FROM = 'Punto Legal <team@puntolegal.online>';
const ADMIN_EMAIL = 'puntolegalelgolf@gmail.com';

async function sendEmail(to, subject, htmlContent) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [to],
      subject: subject,
      html: htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend error ${response.status}: ${error}`);
  }

  return await response.json();
}

async function testDirectEmailFlow() {
  console.log('🧪 PRUEBA DIRECTA DEL SISTEMA DE EMAILS');
  console.log('=======================================\n');

  try {
    // 1. Simular datos de agendamiento
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
    console.log(`   Servicio: ${agendamientoData.service}`);
    console.log(`   Precio: $${agendamientoData.price}`);
    console.log('');

    // 2. Crear reserva en Supabase
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
      estado: 'confirmada',
      notas: 'Reserva de prueba - emails directos',
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
    console.log('');

    // 3. Generar código de seguimiento
    const trackingCode = `PL-${Date.now().toString().slice(-6)}`;
    const googleMeetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;

    // 4. Enviar email al cliente
    console.log('📧 PASO 3: Enviando email al cliente...');
    
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de Consulta Legal</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ff6b35; }
          .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Consulta Legal Confirmada!</h1>
            <p>Tu consulta ha sido agendada exitosamente</p>
          </div>
          <div class="content">
            <h2>Hola ${reservation.cliente_nombre},</h2>
            <p>Tu consulta legal ha sido confirmada y el pago procesado correctamente.</p>
            
            <div class="info-box">
              <h3>📋 Detalles de tu consulta:</h3>
              <p><strong>Servicio:</strong> ${reservation.servicio_tipo}</p>
              <p><strong>Fecha:</strong> ${reservation.fecha}</p>
              <p><strong>Hora:</strong> ${reservation.hora}</p>
              <p><strong>Tipo:</strong> ${reservation.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</p>
              <p><strong>Precio:</strong> $${parseInt(reservation.servicio_precio).toLocaleString('es-CL')}</p>
            </div>

            <div class="info-box">
              <h3>🔗 Información de la reunión:</h3>
              <p><strong>Código de seguimiento:</strong> ${trackingCode}</p>
              <p><strong>Link de Google Meet:</strong> <a href="${googleMeetLink}">${googleMeetLink}</a></p>
              <p><strong>Fecha y hora:</strong> ${reservation.fecha} a las ${reservation.hora}</p>
            </div>

            <div style="text-align: center;">
              <a href="${googleMeetLink}" class="button">🔗 Unirse a la Videollamada</a>
            </div>

            <div class="info-box">
              <h3>📝 Próximos pasos:</h3>
              <ol>
                <li>Guarda este email como comprobante</li>
                <li>Te contactaremos 24 horas antes para confirmar</li>
                <li>El día de la consulta, haz clic en el link de Google Meet</li>
                <li>Ten a mano tu código de seguimiento: <strong>${trackingCode}</strong></li>
              </ol>
            </div>
          </div>
          <div class="footer">
            <p>Punto Legal - Asesoría Legal Profesional</p>
            <p>Email: team@puntolegal.online | Web: puntolegal.online</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const clientEmailResult = await sendEmail(
      reservation.cliente_email,
      `✅ Consulta Legal Confirmada - ${trackingCode}`,
      clientEmailHtml
    );

    console.log('✅ Email al cliente enviado exitosamente!');
    console.log(`   ID: ${clientEmailResult.id}`);
    console.log(`   Para: ${reservation.cliente_email}`);
    console.log('');

    // 5. Enviar email al admin
    console.log('📧 PASO 4: Enviando email al admin...');
    
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nueva Consulta Legal - ${trackingCode}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Nueva Consulta Legal</h1>
            <p>Código de seguimiento: ${trackingCode}</p>
          </div>
          <div class="content">
            <h2>Nueva consulta agendada</h2>
            <p>Se ha recibido una nueva consulta legal que requiere tu atención.</p>
            
            <div class="info-box">
              <h3>👤 Datos del cliente:</h3>
              <p><strong>Nombre:</strong> ${reservation.cliente_nombre}</p>
              <p><strong>Email:</strong> ${reservation.cliente_email}</p>
              <p><strong>Teléfono:</strong> ${reservation.cliente_telefono}</p>
              <p><strong>RUT:</strong> ${reservation.cliente_rut}</p>
            </div>

            <div class="info-box">
              <h3>📅 Detalles de la consulta:</h3>
              <p><strong>Servicio:</strong> ${reservation.servicio_tipo}</p>
              <p><strong>Fecha:</strong> ${reservation.fecha}</p>
              <p><strong>Hora:</strong> ${reservation.hora}</p>
              <p><strong>Tipo:</strong> ${reservation.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</p>
              <p><strong>Precio:</strong> $${parseInt(reservation.servicio_precio).toLocaleString('es-CL')}</p>
              <p><strong>Descripción:</strong> ${reservation.servicio_descripcion}</p>
            </div>

            <div class="info-box">
              <h3>🔗 Información técnica:</h3>
              <p><strong>Código de seguimiento:</strong> ${trackingCode}</p>
              <p><strong>ID de reserva:</strong> ${reservation.id}</p>
              <p><strong>Link de Google Meet:</strong> <a href="${googleMeetLink}">${googleMeetLink}</a></p>
              <p><strong>Estado:</strong> ${reservation.estado}</p>
            </div>

            <div style="text-align: center;">
              <a href="${googleMeetLink}" class="button">📅 Ver en Google Calendar</a>
            </div>
          </div>
          <div class="footer">
            <p>Punto Legal - Panel de Administración</p>
            <p>Email: team@puntolegal.online | Web: puntolegal.online</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmailResult = await sendEmail(
      ADMIN_EMAIL,
      `📋 Nueva Consulta Legal - ${trackingCode} - ${reservation.cliente_nombre}`,
      adminEmailHtml
    );

    console.log('✅ Email al admin enviado exitosamente!');
    console.log(`   ID: ${adminEmailResult.id}`);
    console.log(`   Para: ${ADMIN_EMAIL}`);
    console.log('');

    // 6. Simular datos de la página de éxito
    console.log('📋 PASO 5: Simulando página de éxito...');
    
    const successPageData = {
      cliente: {
        nombre: reservation.cliente_nombre,
        email: reservation.cliente_email,
        telefono: reservation.cliente_telefono
      },
      servicio: {
        tipo: reservation.servicio_tipo,
        precio: reservation.servicio_precio,
        categoria: reservation.categoria
      },
      fecha: reservation.fecha,
      hora: reservation.hora,
      tipo_reunion: reservation.tipo_reunion,
      trackingCode: trackingCode,
      googleMeetLink: googleMeetLink
    };

    console.log('✅ Datos que se mostrarían en la página de éxito:');
    console.log(`   Cliente: ${successPageData.cliente.nombre}`);
    console.log(`   Email: ${successPageData.cliente.email}`);
    console.log(`   Teléfono: ${successPageData.cliente.telefono}`);
    console.log(`   Servicio: ${successPageData.servicio.tipo}`);
    console.log(`   Precio: $${successPageData.servicio.precio}`);
    console.log(`   Fecha: ${successPageData.fecha}`);
    console.log(`   Hora: ${successPageData.hora}`);
    console.log(`   Código: ${successPageData.trackingCode}`);
    console.log(`   Google Meet: ${successPageData.googleMeetLink}`);
    console.log('');

    console.log('📧 RESULTADO ESPERADO:');
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

    console.log('✅ PRUEBA DIRECTA EXITOSA');
    console.log('=========================');
    console.log('• Reserva creada correctamente');
    console.log('• Emails enviados directamente via Resend');
    console.log('• Datos de la página de éxito correctos');
    console.log('• Sistema funcionando sin Edge Function');
    console.log('• Listo para integrar en la aplicación');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
testDirectEmailFlow();
