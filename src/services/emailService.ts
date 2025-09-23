/**
 * Servicio de emails directo con Resend
 * Alternativa a la Edge Function para mayor confiabilidad
 */

const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';
const MAIL_FROM = 'Punto Legal <team@puntolegal.online>';
const ADMIN_EMAIL = 'puntolegalelgolf@gmail.com';

interface EmailData {
  to: string;
  subject: string;
  html: string;
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
  tipo_reunion: string;
  descripcion?: string;
  cliente_rut?: string;
}

async function sendEmail(emailData: EmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend error ${response.status}: ${error}`);
    }

    const result = await response.json();
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

function generateTrackingCode(): string {
  return `PL-${Date.now().toString().slice(-6)}`;
}

function generateGoogleMeetLink(): string {
  return `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;
}

export async function sendBookingEmailsDirect(booking: BookingData): Promise<{
  success: boolean;
  clientEmail?: { id: string };
  adminEmail?: { id: string };
  trackingCode?: string;
  googleMeetLink?: string;
  error?: string;
}> {
  try {
    console.log('📧 Enviando emails directos via Resend...');
    
    const trackingCode = generateTrackingCode();
    const googleMeetLink = generateGoogleMeetLink();

    // Generar HTML para emails
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
            <h2>Hola ${booking.cliente_nombre},</h2>
            <p>Tu consulta legal ha sido confirmada y el pago procesado correctamente.</p>
            
            <div class="info-box">
              <h3>📋 Detalles de tu consulta:</h3>
              <p><strong>Servicio:</strong> ${booking.servicio_tipo}</p>
              <p><strong>Fecha:</strong> ${booking.fecha}</p>
              <p><strong>Hora:</strong> ${booking.hora}</p>
              <p><strong>Tipo:</strong> ${booking.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</p>
              <p><strong>Precio:</strong> $${parseInt(booking.servicio_precio).toLocaleString('es-CL')}</p>
            </div>

            <div class="info-box">
              <h3>🔗 Información de la reunión:</h3>
              <p><strong>Código de seguimiento:</strong> ${trackingCode}</p>
              <p><strong>Link de Google Meet:</strong> <a href="${googleMeetLink}">${googleMeetLink}</a></p>
              <p><strong>Fecha y hora:</strong> ${booking.fecha} a las ${booking.hora}</p>
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
              <p><strong>Nombre:</strong> ${booking.cliente_nombre}</p>
              <p><strong>Email:</strong> ${booking.cliente_email}</p>
              <p><strong>Teléfono:</strong> ${booking.cliente_telefono}</p>
              <p><strong>RUT:</strong> ${booking.cliente_rut || 'No especificado'}</p>
            </div>

            <div class="info-box">
              <h3>📅 Detalles de la consulta:</h3>
              <p><strong>Servicio:</strong> ${booking.servicio_tipo}</p>
              <p><strong>Fecha:</strong> ${booking.fecha}</p>
              <p><strong>Hora:</strong> ${booking.hora}</p>
              <p><strong>Tipo:</strong> ${booking.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</p>
              <p><strong>Precio:</strong> $${parseInt(booking.servicio_precio).toLocaleString('es-CL')}</p>
              <p><strong>Descripción:</strong> ${booking.descripcion || 'No especificada'}</p>
            </div>

            <div class="info-box">
              <h3>🔗 Información técnica:</h3>
              <p><strong>Código de seguimiento:</strong> ${trackingCode}</p>
              <p><strong>ID de reserva:</strong> ${booking.id}</p>
              <p><strong>Link de Google Meet:</strong> <a href="${googleMeetLink}">${googleMeetLink}</a></p>
              <p><strong>Estado:</strong> confirmada</p>
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

    // Enviar email al cliente
    const clientEmailResult = await sendEmail({
      to: booking.cliente_email,
      subject: `✅ Consulta Legal Confirmada - ${trackingCode}`,
      html: clientEmailHtml
    });

    if (!clientEmailResult.success) {
      throw new Error(`Error enviando email al cliente: ${clientEmailResult.error}`);
    }

    // Enviar email al admin
    const adminEmailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `📋 Nueva Consulta Legal - ${trackingCode} - ${booking.cliente_nombre}`,
      html: adminEmailHtml
    });

    if (!adminEmailResult.success) {
      throw new Error(`Error enviando email al admin: ${adminEmailResult.error}`);
    }

    console.log('✅ Emails enviados exitosamente');
    console.log(`   Cliente: ${clientEmailResult.id}`);
    console.log(`   Admin: ${adminEmailResult.id}`);
    console.log(`   Código: ${trackingCode}`);

    return {
      success: true,
      clientEmail: { id: clientEmailResult.id! },
      adminEmail: { id: adminEmailResult.id! },
      trackingCode,
      googleMeetLink
    };

  } catch (error) {
    console.error('❌ Error enviando emails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}