// Edge Function para envío de emails con Resend
// Sistema de Agendamiento Legal - Punto Legal

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configuración de Resend
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const MAIL_FROM = Deno.env.get('MAIL_FROM') || 'Punto Legal <team@puntolegal.online>'
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'puntolegalelgolf@gmail.com'

interface BookingData {
  id: string
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  servicio_tipo: string
  servicio_precio: string
  fecha: string
  hora: string
  tipo_reunion?: string
  descripcion?: string
  pago_metodo?: string
  pago_estado?: string
  created_at: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingData }: { bookingData: BookingData } = await req.json()
    
    console.log('📧 Enviando emails con Resend para reserva:', bookingData.id)

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurada')
    }

    // Generar plantillas HTML
    const clientHTML = generateClientEmailHTML(bookingData)
    const adminHTML = generateAdminEmailHTML(bookingData)

    // Enviar email al cliente
    const clientResult = await sendEmailWithResend({
      from: MAIL_FROM,
      to: [bookingData.cliente_email],
      subject: `✅ Confirmación de tu cita - ${bookingData.servicio_tipo} - Punto Legal`,
      html: clientHTML
    })

    // Enviar email al admin
    const adminResult = await sendEmailWithResend({
      from: MAIL_FROM,
      to: [ADMIN_EMAIL],
      subject: `🔔 Nueva reserva - ${bookingData.cliente_nombre} - ${bookingData.servicio_tipo}`,
      html: adminHTML
    })

    console.log('✅ Emails enviados exitosamente')
    console.log('✅ Email al cliente:', clientResult.id)
    console.log('✅ Email al admin:', adminResult.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails enviados correctamente',
        clientEmail: clientResult,
        adminEmail: adminResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Error enviando emails:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

// Función para enviar email con Resend
async function sendEmailWithResend(emailData: {
  from: string
  to: string[]
  subject: string
  html: string
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend error ${response.status}: ${error}`)
  }

  return await response.json()
}

// Plantilla HTML para email del cliente
function generateClientEmailHTML(booking: BookingData): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmación de Consulta Legal</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
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
            <h2>Hola ${booking.cliente_nombre},</h2>
            <p>Tu consulta legal ha sido confirmada y el pago procesado correctamente.</p>
            
            <div class="info-box">
                <h3>📋 Detalles de tu consulta:</h3>
                <p><strong>Servicio:</strong> ${booking.servicio_tipo}</p>
                <p><strong>Fecha:</strong> ${new Date(booking.fecha).toLocaleDateString('es-CL')}</p>
                <p><strong>Hora:</strong> ${booking.hora}</p>
                <p><strong>Modalidad:</strong> ${booking.tipo_reunion || 'Online'}</p>
                <p><strong>Precio:</strong> $${parseInt(booking.servicio_precio).toLocaleString('es-CL')} CLP</p>
            </div>
            
            <div class="info-box">
                <h3>📞 Información de contacto:</h3>
                <p><strong>Teléfono:</strong> ${booking.cliente_telefono}</p>
                <p><strong>Email:</strong> ${booking.cliente_email}</p>
            </div>
            
            <p style="text-align: center;">
                <a href="https://puntolegal.online" class="button">Visitar Punto Legal</a>
            </p>
        </div>
        
        <div class="footer">
            <p><strong>⚖️ Punto Legal</strong></p>
            <p>El Golf, Las Condes, Santiago</p>
            <p>© 2025 Punto Legal. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
  `
}

// Plantilla HTML para email del admin
function generateAdminEmailHTML(booking: BookingData): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nueva Reserva - Punto Legal</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2c3e50; }
        .urgent { background: #e74c3c; color: white; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Nueva Reserva Recibida</h1>
            <p>Sistema de Agendamiento Legal</p>
        </div>
        <div class="content">
            <div class="info-box urgent">
                <h3>⚡ Acción Requerida</h3>
                <p>Se ha recibido una nueva consulta legal que requiere tu atención inmediata.</p>
            </div>
            
            <div class="info-box">
                <h3>👤 Datos del Cliente</h3>
                <p><strong>Nombre:</strong> ${booking.cliente_nombre}</p>
                <p><strong>Email:</strong> ${booking.cliente_email}</p>
                <p><strong>Teléfono:</strong> ${booking.cliente_telefono}</p>
            </div>
            
            <div class="info-box">
                <h3>📋 Detalles de la Consulta</h3>
                <p><strong>Servicio:</strong> ${booking.servicio_tipo}</p>
                <p><strong>Fecha:</strong> ${new Date(booking.fecha).toLocaleDateString('es-CL')}</p>
                <p><strong>Hora:</strong> ${booking.hora}</p>
                <p><strong>Modalidad:</strong> ${booking.tipo_reunion || 'Online'}</p>
                <p><strong>Precio:</strong> $${parseInt(booking.servicio_precio).toLocaleString('es-CL')} CLP</p>
                <p><strong>Estado del Pago:</strong> ${booking.pago_estado || 'Pendiente'}</p>
            </div>
            
            ${booking.descripcion ? `
            <div class="info-box">
                <h3>📝 Descripción</h3>
                <p><em>"${booking.descripcion}"</em></p>
            </div>
            ` : ''}
            
            <div class="info-box">
                <h3>🔍 Información Técnica</h3>
                <p><strong>ID de Reserva:</strong> ${booking.id}</p>
                <p><strong>Fecha de Registro:</strong> ${new Date(booking.created_at).toLocaleString('es-CL')}</p>
            </div>
            
            <div class="info-box">
                <h3>🎯 Próximos Pasos</h3>
                <ul>
                    <li>Revisar calendario y confirmar disponibilidad</li>
                    <li>Contactar al cliente para confirmar asistencia</li>
                    <li>Preparar material según el tipo de consulta</li>
                    <li>Configurar modalidad de reunión</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>⚖️ Punto Legal - Sistema de Gestión</strong></p>
            <p>Este email fue generado automáticamente por el sistema de reservas</p>
        </div>
    </div>
</body>
</html>
  `
}
