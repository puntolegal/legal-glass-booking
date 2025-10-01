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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; text-align: center;">✅ Consulta Confirmada</h1>
              </div>
              
              <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
                <p style="font-size: 18px; margin-bottom: 20px;">Hola <strong>${emailData.cliente_nombre}</strong>,</p>
                
                <p>Tu consulta legal ha sido confirmada exitosamente. Aquí están los detalles:</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
                  <h3 style="color: #f97316; margin-top: 0;">📋 Detalles de la Consulta</h3>
                  <p><strong>Servicio:</strong> ${emailData.servicio_tipo}</p>
                  <p><strong>Fecha:</strong> ${emailData.fecha}</p>
                  <p><strong>Hora:</strong> ${emailData.hora}</p>
                  <p><strong>Tipo:</strong> ${emailData.tipo_reunion}</p>
                  <p><strong>Precio:</strong> $${emailData.servicio_precio}</p>
                  <p><strong>Estado del pago:</strong> ${emailData.pago_estado}</p>
                </div>
                
                <p>Si tienes alguna pregunta o necesitas hacer cambios, no dudes en contactarnos.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #6b7280; font-size: 14px;">
                    Punto Legal - Asesoría Jurídica Profesional<br>
                    📧 ${ADMIN_EMAIL} | 📱 +56962321883
                  </p>
                </div>
              </div>
            </div>
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; text-align: center;">📅 Nueva Consulta Agendada</h1>
              </div>
              
              <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
                <h3 style="color: #1e40af;">Información del Cliente</h3>
                <p><strong>Nombre:</strong> ${emailData.cliente_nombre}</p>
                <p><strong>Email:</strong> ${emailData.cliente_email}</p>
                <p><strong>Teléfono:</strong> ${emailData.cliente_telefono}</p>
                
                <h3 style="color: #1e40af;">Detalles de la Consulta</h3>
                <p><strong>Servicio:</strong> ${emailData.servicio_tipo}</p>
                <p><strong>Fecha:</strong> ${emailData.fecha}</p>
                <p><strong>Hora:</strong> ${emailData.hora}</p>
                <p><strong>Tipo:</strong> ${emailData.tipo_reunion}</p>
                <p><strong>Precio:</strong> $${emailData.servicio_precio}</p>
                <p><strong>Estado del pago:</strong> ${emailData.pago_estado}</p>
                
                ${emailData.descripcion ? `<p><strong>Descripción:</strong> ${emailData.descripcion}</p>` : ''}
                
                <p><strong>ID de Reserva:</strong> ${booking_id}</p>
              </div>
            </div>
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
