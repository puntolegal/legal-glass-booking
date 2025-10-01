// Edge Function: clever-action
// Maneja el envío de emails de confirmación para reservas
// Reemplaza a send-resend-emails con funcionalidad mejorada

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Función clever-action iniciada');
    console.log('🔍 Método:', req.method);
    console.log('🔍 URL:', req.url);
    console.log('🔍 Headers:', Object.fromEntries(req.headers.entries()));

    // Verificar token de admin
    const adminToken = req.headers.get('x-admin-token');
    const expectedToken = 'puntolegal-admin-token-2025';
    
    if (adminToken !== expectedToken) {
      console.log('❌ Token de admin inválido o faltante');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Token de admin requerido' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Token de admin válido');

    // Obtener datos del request
    const { booking_id } = await req.json();
    
    if (!booking_id) {
      console.log('❌ booking_id no proporcionado');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'booking_id es requerido' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📋 Booking ID recibido:', booking_id);

    // Configurar Supabase
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://qrgelocijmwnxcckxbdg.supabase.co';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.8q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar la reserva
    console.log('🔍 Buscando reserva en la base de datos...');
    const { data: reserva, error: reservaError } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (reservaError || !reserva) {
      console.error('❌ Error buscando reserva:', reservaError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Reserva no encontrada',
          detail: reservaError?.message 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Reserva encontrada:', reserva.nombre, reserva.email);

    // Preparar datos para el email
    const emailData = {
      cliente_nombre: reserva.nombre,
      cliente_email: reserva.email,
      cliente_telefono: reserva.telefono,
      servicio_tipo: reserva.servicio,
      servicio_precio: reserva.precio,
      fecha: reserva.fecha,
      hora: reserva.hora,
      tipo_reunion: reserva.tipo_reunion || 'online',
      descripcion: reserva.descripcion,
      pago_metodo: reserva.pago_metodo || 'MercadoPago',
      pago_estado: reserva.pago_estado || 'aprobado',
      created_at: reserva.created_at
    };

    console.log('📧 Datos preparados para email:', emailData);

    // Enviar emails usando Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C';
    const MAIL_FROM = Deno.env.get('MAIL_FROM') || 'Punto Legal <team@puntolegal.online>';
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'puntolegalelgolf@gmail.com';

    try {
      // Email al cliente
      const clienteEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: [emailData.cliente_email],
          subject: `✅ Confirmación de Consulta - ${emailData.servicio_tipo}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de Cita - Punto Legal</title>
                <style>
                    body { 
                        margin: 0; 
                        padding: 0; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        background-color: #f5f5f5;
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 20px auto; 
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    .header { 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .header p {
                        margin: 10px 0 0 0;
                        font-size: 16px;
                        opacity: 0.9;
                    }
                    .content { 
                        padding: 30px;
                    }
                    .info-box { 
                        background: #f8f9ff; 
                        padding: 25px; 
                        margin: 25px 0; 
                        border-radius: 10px; 
                        border-left: 4px solid #667eea;
                    }
                    .info-box h3 {
                        margin-top: 0;
                        color: #667eea;
                        font-size: 18px;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #555;
                    }
                    .info-value {
                        color: #333;
                        text-align: right;
                    }
                    .highlight {
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-weight: 600;
                    }
                    .contact-box {
                        background: #e8f4ff;
                        border: 1px solid #b3d9ff;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .footer { 
                        background: #f8f9fa;
                        padding: 25px;
                        text-align: center; 
                        color: #666; 
                        font-size: 14px;
                        border-top: 1px solid #eee;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    @media (max-width: 600px) {
                        .container { margin: 10px; }
                        .header, .content { padding: 20px; }
                        .info-row { flex-direction: column; text-align: left; }
                        .info-value { text-align: left; margin-top: 5px; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">⚖️ Punto Legal</div>
                        <h1>✅ Cita Confirmada</h1>
                        <p>Tu consulta jurídica ha sido agendada exitosamente</p>
                    </div>
                    
                    <div class="content">
                        <p>Estimado/a <strong>${emailData.cliente_nombre}</strong>,</p>
                        
                        <p>Nos complace confirmar que tu cita ha sido agendada correctamente. A continuación, encontrarás todos los detalles de tu consulta jurídica:</p>
                        
                        <div class="info-box">
                            <h3>📋 Detalles de tu Cita</h3>
                            <div class="info-row">
                                <span class="info-label">Servicio:</span>
                                <span class="info-value highlight">${emailData.servicio_tipo}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Fecha:</span>
                                <span class="info-value">${emailData.fecha}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Hora:</span>
                                <span class="info-value">${emailData.hora}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Tipo:</span>
                                <span class="info-value">${emailData.tipo_reunion}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Precio:</span>
                                <span class="info-value highlight">$${emailData.servicio_precio}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Estado del pago:</span>
                                <span class="info-value">${emailData.pago_estado}</span>
                            </div>
                        </div>
                        
                        <div class="contact-box">
                            <h3>📞 Información de Contacto</h3>
                            <p>Si tienes alguna pregunta o necesitas hacer cambios, no dudes en contactarnos:</p>
                            <p><strong>📧 Email:</strong> ${ADMIN_EMAIL}</p>
                            <p><strong>📱 Teléfono:</strong> +56962321883</p>
                        </div>
                        
                        <p>¡Gracias por confiar en Punto Legal para tus necesidades jurídicas!</p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>Punto Legal</strong> - Asesoría Jurídica Profesional</p>
                        <p>📍 El Golf, Las Condes, Santiago | 🌐 puntolegal.online</p>
                    </div>
                </div>
            </body>
            </html>
          `
        })
      });

      // Email al administrador
      const adminEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: [ADMIN_EMAIL],
          subject: `📅 Nueva Consulta Agendada - ${emailData.cliente_nombre}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nueva Reserva - Punto Legal Admin</title>
                <style>
                    body { 
                        margin: 0; 
                        padding: 0; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        background-color: #f5f5f5;
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 20px auto; 
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    .header { 
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .urgent-badge {
                        background: rgba(255,255,255,0.2);
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 14px;
                        margin-bottom: 15px;
                        display: inline-block;
                    }
                    .content { padding: 30px; }
                    .alert-box { 
                        background: #fff3cd; 
                        border: 1px solid #ffc107;
                        border-left: 4px solid #ffc107;
                        padding: 20px; 
                        margin: 20px 0; 
                        border-radius: 8px;
                    }
                    .info-box { 
                        background: #f8f9ff; 
                        padding: 25px; 
                        margin: 25px 0; 
                        border-radius: 10px; 
                        border-left: 4px solid #f5576c;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .info-row:last-child { border-bottom: none; }
                    .info-label { font-weight: 600; color: #555; }
                    .info-value { color: #333; text-align: right; font-weight: 500; }
                    .priority-high { background: #ffe6e6; border-left-color: #ff4757; }
                    .actions-box {
                        background: #e8f5e8;
                        border: 1px solid #4caf50;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .actions-box ul {
                        margin: 10px 0;
                        padding-left: 20px;
                    }
                    .actions-box li {
                        margin: 8px 0;
                        color: #2e7d32;
                    }
                    .footer { 
                        background: #f8f9fa;
                        padding: 25px;
                        text-align: center; 
                        color: #666; 
                        font-size: 14px;
                        border-top: 1px solid #eee;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="urgent-badge">🚨 ACCIÓN REQUERIDA</div>
                        <h1>🔔 Nueva Reserva</h1>
                        <p>Un cliente ha agendado una consulta jurídica</p>
                    </div>
                    
                    <div class="content">
                        <div class="alert-box">
                            <h3>⚡ Nueva Reserva Registrada</h3>
                            <p>Se ha registrado una nueva reserva que requiere tu atención inmediata.</p>
                            <p><strong>Fecha de la cita:</strong> ${emailData.fecha} a las ${emailData.hora}</p>
                        </div>
                        
                        <div class="info-box">
                            <h3>👤 Información del Cliente</h3>
                            <div class="info-row">
                                <span class="info-label">Nombre:</span>
                                <span class="info-value">${emailData.cliente_nombre}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${emailData.cliente_email}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Teléfono:</span>
                                <span class="info-value">${emailData.cliente_telefono}</span>
                            </div>
                        </div>
                        
                        <div class="info-box">
                            <h3>📋 Detalles de la Consulta</h3>
                            <div class="info-row">
                                <span class="info-label">Servicio:</span>
                                <span class="info-value">${emailData.servicio_tipo}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Fecha:</span>
                                <span class="info-value">${emailData.fecha}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Hora:</span>
                                <span class="info-value">${emailData.hora}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Tipo:</span>
                                <span class="info-value">${emailData.tipo_reunion}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Precio:</span>
                                <span class="info-value">$${emailData.servicio_precio}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Estado del pago:</span>
                                <span class="info-value">${emailData.pago_estado}</span>
                            </div>
                            ${emailData.descripcion ? `
                            <div class="info-row">
                                <span class="info-label">Descripción:</span>
                                <span class="info-value">${emailData.descripcion}</span>
                            </div>
                            ` : ''}
                            <div class="info-row">
                                <span class="info-label">ID de Reserva:</span>
                                <span class="info-value">${booking_id}</span>
                            </div>
                        </div>
                        
                        <div class="actions-box">
                            <h3>📋 Acciones Recomendadas</h3>
                            <ul>
                                <li>Contactar al cliente para confirmar detalles</li>
                                <li>Preparar materiales necesarios para la consulta</li>
                                <li>Agendar recordatorio 24 horas antes</li>
                                <li>Verificar disponibilidad en tu calendario</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p><strong>Punto Legal</strong> - Sistema de Administración</p>
                        <p>📍 El Golf, Las Condes, Santiago | 🌐 puntolegal.online</p>
                    </div>
                </div>
            </body>
            </html>
          `
        })
      });

      if (clienteEmailResponse.ok && adminEmailResponse.ok) {
        console.log('✅ Emails enviados exitosamente');
        
        // Actualizar estado de email enviado en la base de datos
        await supabase
          .from('reservas')
          .update({
            email_enviado: true,
            email_enviado_at: new Date().toISOString()
          })
          .eq('id', booking_id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Emails enviados exitosamente',
            booking_id: booking_id,
            cliente_email: emailData.cliente_email,
            admin_email: ADMIN_EMAIL
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        console.error('❌ Error enviando emails');
        const clienteError = await clienteEmailResponse.text();
        const adminError = await adminEmailResponse.text();
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Error enviando emails',
            detail: { cliente: clienteError, admin: adminError }
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

    } catch (emailError) {
      console.error('❌ Error en envío de emails:', emailError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error en envío de emails',
          detail: emailError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('❌ Error en clever-action:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error interno del servidor',
        detail: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
