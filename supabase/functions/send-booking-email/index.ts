// Supabase Edge Function para enviar emails automáticos
// Archivo: supabase/functions/send-booking-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingData {
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
  };
  servicio: {
    tipo: string;
    precio: string;
    fecha: string;
    hora: string;
  };
  pago?: {
    metodo: string;
    estado: string;
    id?: string;
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingData }: { bookingData: BookingData } = await req.json()
    
    console.log('📧 Enviando emails para reserva:', bookingData)

    // Configurar cliente de Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. EMAIL AL ADMINISTRADOR (tú)
    const adminEmailData = {
      to: ['puntolegalelgolf@gmail.com'],
      subject: `🔔 Nueva Consulta Legal - ${bookingData.cliente.nombre}`,
      html: generateAdminEmailHTML(bookingData)
    }

    // 2. EMAIL AL CLIENTE
    const clientEmailData = {
      to: [bookingData.cliente.email],
      subject: `✅ Consulta Confirmada - Punto Legal`,
      html: generateClientEmailHTML(bookingData)
    }

    // Enviar emails usando Supabase Auth (método nativo)
    const adminResult = await sendEmail(supabase, adminEmailData)
    const clientResult = await sendEmail(supabase, clientEmailData)

    // 3. Guardar en base de datos
    const { data: reservation, error: dbError } = await supabase
      .from('reservas')
      .insert({
        cliente_nombre: bookingData.cliente.nombre,
        cliente_email: bookingData.cliente.email,
        cliente_telefono: bookingData.cliente.telefono,
        servicio_tipo: bookingData.servicio.tipo,
        servicio_precio: bookingData.servicio.precio,
        fecha: bookingData.servicio.fecha,
        hora: bookingData.servicio.hora,
        pago_metodo: bookingData.pago?.metodo || 'pendiente',
        pago_estado: bookingData.pago?.estado || 'pendiente',
        pago_id: bookingData.pago?.id,
        estado: 'confirmada',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Error guardando en BD:', dbError)
      throw dbError
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails enviados y reserva guardada exitosamente',
        reservation_id: reservation.id,
        emails_sent: {
          admin: adminResult.success,
          client: clientResult.success
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Error en función de email:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// Función para enviar email usando Supabase
async function sendEmail(supabase: any, emailData: any) {
  try {
    // Usar Supabase Auth para enviar emails
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'invite',
      email: emailData.to[0],
      options: {
        data: {
          custom_email: true,
          subject: emailData.subject,
          html: emailData.html
        }
      }
    })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('❌ Error enviando email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

// Plantilla HTML para email del administrador
function generateAdminEmailHTML(booking: BookingData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nueva Consulta Legal</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .highlight { color: #667eea; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Nueva Consulta Legal</h1>
          <p>Se ha registrado una nueva consulta en Punto Legal</p>
        </div>
        
        <div class="content">
          <h2>📋 Detalles del Cliente</h2>
          <div class="info-box">
            <p><strong>👤 Nombre:</strong> <span class="highlight">${booking.cliente.nombre}</span></p>
            <p><strong>📧 Email:</strong> <span class="highlight">${booking.cliente.email}</span></p>
            <p><strong>📱 Teléfono:</strong> <span class="highlight">${booking.cliente.telefono}</span></p>
          </div>
          
          <h2>⚖️ Detalles del Servicio</h2>
          <div class="info-box">
            <p><strong>🏷️ Tipo:</strong> <span class="highlight">${booking.servicio.tipo}</span></p>
            <p><strong>💰 Precio:</strong> <span class="highlight">$${booking.servicio.precio}</span></p>
            <p><strong>📅 Fecha:</strong> <span class="highlight">${booking.servicio.fecha}</span></p>
            <p><strong>🕐 Hora:</strong> <span class="highlight">${booking.servicio.hora}</span></p>
          </div>
          
          ${booking.pago ? `
          <h2>💳 Información de Pago</h2>
          <div class="info-box">
            <p><strong>💳 Método:</strong> <span class="highlight">${booking.pago.metodo}</span></p>
            <p><strong>📊 Estado:</strong> <span class="highlight">${booking.pago.estado}</span></p>
            ${booking.pago.id ? `<p><strong>🆔 ID Pago:</strong> <span class="highlight">${booking.pago.id}</span></p>` : ''}
          </div>
          ` : ''}
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3>📞 Próximos Pasos</h3>
            <p>Contacta al cliente para confirmar los detalles y agendar la reunión.</p>
            <a href="https://wa.me/56${booking.cliente.telefono.replace(/[^0-9]/g, '')}" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px;">
              💬 Contactar por WhatsApp
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>📧 Email automático generado por Punto Legal</p>
          <p>🕐 ${new Date().toLocaleString('es-CL')}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Plantilla HTML para email del cliente
function generateClientEmailHTML(booking: BookingData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Consulta Confirmada - Punto Legal</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .highlight { color: #667eea; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Consulta Confirmada</h1>
          <p>Hola ${booking.cliente.nombre}, tu consulta ha sido registrada exitosamente</p>
        </div>
        
        <div class="content">
          <div class="success-box">
            <h2>🎉 ¡Perfecto!</h2>
            <p>Hemos recibido tu solicitud de consulta legal. Nos pondremos en contacto contigo pronto.</p>
          </div>
          
          <h2>📋 Resumen de tu Consulta</h2>
          <div class="info-box">
            <p><strong>⚖️ Servicio:</strong> <span class="highlight">${booking.servicio.tipo}</span></p>
            <p><strong>💰 Precio:</strong> <span class="highlight">$${booking.servicio.precio}</span></p>
            <p><strong>📅 Fecha solicitada:</strong> <span class="highlight">${booking.servicio.fecha}</span></p>
            <p><strong>🕐 Hora solicitada:</strong> <span class="highlight">${booking.servicio.hora}</span></p>
          </div>
          
          ${booking.pago?.estado === 'approved' ? `
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3>✅ Pago Confirmado</h3>
            <p>Tu pago de <strong>$${booking.servicio.precio}</strong> ha sido procesado exitosamente.</p>
            <p><strong>Método:</strong> ${booking.pago.metodo}</p>
          </div>
          ` : ''}
          
          <h2>📞 Próximos Pasos</h2>
          <div class="info-box">
            <p><strong>1.</strong> Revisaremos tu solicitud</p>
            <p><strong>2.</strong> Te contactaremos para confirmar fecha y hora</p>
            <p><strong>3.</strong> Te enviaremos el enlace de la reunión virtual</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3>💬 ¿Tienes preguntas?</h3>
            <p>No dudes en contactarnos si necesitas ayuda</p>
            <a href="https://wa.me/56962321883" 
               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px;">
              📱 WhatsApp: +56 9 6232 1883
            </a>
            <br>
            <a href="mailto:puntolegalelgolf@gmail.com" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px;">
              📧 puntolegalelgolf@gmail.com
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Punto Legal</strong> - Asesoría Legal Profesional</p>
          <p>El Golf, Las Condes, Santiago</p>
          <p>🕐 ${new Date().toLocaleString('es-CL')}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/* Para deployar esta función:
1. Instalar Supabase CLI: npm install -g supabase
2. Login: supabase login
3. Deploy: supabase functions deploy send-booking-email
4. Configurar variables de entorno en Supabase Dashboard
*/
