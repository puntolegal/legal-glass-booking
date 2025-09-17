import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingData {
  id: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  servicio_tipo: string;
  servicio_precio: string;
  fecha: string;
  hora: string;
  pago_metodo?: string;
  pago_estado?: string;
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingData }: { bookingData: BookingData } = await req.json()
    
    console.log('📧 Procesando emails para reserva:', bookingData.id)

    // Configurar cliente de email (usando Resend como ejemplo)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY no configurado, simulando envío de emails')
      
      // Simular envío de emails
      console.log('📧 EMAIL AL CLIENTE:')
      console.log(`Para: ${bookingData.cliente_email}`)
      console.log(`Asunto: Confirmación de tu cita - ${bookingData.servicio_tipo}`)
      console.log(`Fecha: ${bookingData.fecha} a las ${bookingData.hora}`)
      
      console.log('📧 EMAIL AL ADMINISTRADOR:')
      console.log('Para: puntolegalelgolf@gmail.com')
      console.log(`Asunto: Nueva reserva - ${bookingData.cliente_nombre}`)
      console.log(`Cliente: ${bookingData.cliente_nombre} (${bookingData.cliente_email})`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Emails simulados enviados correctamente',
          clientEmail: 'simulated',
          adminEmail: 'simulated'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Plantilla de email para el cliente
    const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Confirmación de Cita - Punto Legal</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Cita Confirmada</h1>
                <p>Tu consulta ha sido agendada exitosamente</p>
            </div>
            <div class="content">
                <p>Estimado/a <strong>${bookingData.cliente_nombre}</strong>,</p>
                
                <p>Nos complace confirmar que tu cita ha sido agendada correctamente. A continuación, los detalles de tu consulta:</p>
                
                <div class="info-box">
                    <h3>📋 Detalles de tu Cita</h3>
                    <p><strong>Servicio:</strong> ${bookingData.servicio_tipo}</p>
                    <p><strong>Fecha:</strong> ${new Date(bookingData.fecha).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Hora:</strong> ${bookingData.hora} hrs</p>
                    <p><strong>Precio:</strong> $${bookingData.servicio_precio}</p>
                    <p><strong>ID de Reserva:</strong> ${bookingData.id}</p>
                </div>
                
                <div class="info-box">
                    <h3>📞 Información de Contacto</h3>
                    <p><strong>Email:</strong> puntolegalelgolf@gmail.com</p>
                    <p><strong>Teléfono:</strong> +56 9 6232 1883</p>
                </div>
                
                <p><strong>¿Qué sigue?</strong></p>
                <ul>
                    <li>Recibirás un recordatorio 24 horas antes de tu cita</li>
                    <li>Si necesitas reagendar, contáctanos con al menos 24 horas de anticipación</li>
                    <li>Prepara cualquier documentación relevante para tu consulta</li>
                </ul>
                
                <p>Gracias por confiar en Punto Legal. Esperamos poder ayudarte con tu consulta jurídica.</p>
            </div>
            <div class="footer">
                <p>© 2025 Punto Legal - Soluciones Jurídicas Especializadas</p>
                <p>Este email fue enviado automáticamente, por favor no respondas a este mensaje.</p>
            </div>
        </div>
    </body>
    </html>
    `

    // Plantilla de email para el administrador
    const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Nueva Reserva - Punto Legal</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f5576c; }
            .urgent { background: #fff3cd; border-left-color: #ffc107; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔔 Nueva Reserva</h1>
                <p>Un cliente ha agendado una consulta</p>
            </div>
            <div class="content">
                <div class="info-box urgent">
                    <h3>⚡ Acción Requerida</h3>
                    <p>Se ha registrado una nueva reserva que requiere tu atención.</p>
                </div>
                
                <div class="info-box">
                    <h3>👤 Información del Cliente</h3>
                    <p><strong>Nombre:</strong> ${bookingData.cliente_nombre}</p>
                    <p><strong>Email:</strong> ${bookingData.cliente_email}</p>
                    <p><strong>Teléfono:</strong> ${bookingData.cliente_telefono}</p>
                </div>
                
                <div class="info-box">
                    <h3>📅 Detalles de la Cita</h3>
                    <p><strong>Servicio:</strong> ${bookingData.servicio_tipo}</p>
                    <p><strong>Fecha:</strong> ${new Date(bookingData.fecha).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Hora:</strong> ${bookingData.hora} hrs</p>
                    <p><strong>Precio:</strong> $${bookingData.servicio_precio}</p>
                    <p><strong>Estado de Pago:</strong> ${bookingData.pago_estado || 'Pendiente'}</p>
                    <p><strong>Método de Pago:</strong> ${bookingData.pago_metodo || 'No especificado'}</p>
                </div>
                
                <div class="info-box">
                    <h3>🔍 Información Técnica</h3>
                    <p><strong>ID de Reserva:</strong> ${bookingData.id}</p>
                    <p><strong>Fecha de Creación:</strong> ${new Date(bookingData.created_at).toLocaleString('es-CL')}</p>
                </div>
                
                <p><strong>Próximos pasos:</strong></p>
                <ul>
                    <li>Revisar la disponibilidad en tu calendario</li>
                    <li>Confirmar la cita con el cliente si es necesario</li>
                    <li>Preparar la documentación relevante</li>
                    <li>Enviar recordatorio 24 horas antes</li>
                </ul>
            </div>
            <div class="footer">
                <p>© 2025 Punto Legal - Sistema de Gestión de Reservas</p>
                <p>Este es un email automático del sistema de reservas.</p>
            </div>
        </div>
    </body>
    </html>
    `

    // Enviar email al cliente
    const clientEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Punto Legal <noreply@puntolegal.cl>',
        to: [bookingData.cliente_email],
        subject: `✅ Confirmación de tu cita - ${bookingData.servicio_tipo}`,
        html: clientEmailHtml,
      }),
    })

    // Enviar email al administrador
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sistema Punto Legal <sistema@puntolegal.cl>',
        to: ['puntolegalelgolf@gmail.com'],
        subject: `🔔 Nueva reserva - ${bookingData.cliente_nombre} - ${bookingData.servicio_tipo}`,
        html: adminEmailHtml,
      }),
    })

    const clientResult = await clientEmailResponse.json()
    const adminResult = await adminEmailResponse.json()

    console.log('📧 Resultado email cliente:', clientResult)
    console.log('📧 Resultado email admin:', adminResult)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Emails enviados correctamente',
        clientEmail: clientResult,
        adminEmail: adminResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error enviando emails:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
