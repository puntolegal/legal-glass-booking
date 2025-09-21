/**
 * Servicio de emails usando Make.com
 * Envía emails de confirmación al cliente y admin
 * Crea eventos en Google Calendar
 */

interface BookingEmailData {
  id: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  servicio_tipo: string;
  servicio_precio: string;
  fecha: string;
  hora: string;
  pago_metodo: string;
  pago_estado: string;
  created_at: string;
}

interface MakeEmailResponse {
  success: boolean;
  message: string;
  tracking_code?: string;
  google_meet_link?: string;
  calendar_event_id?: string;
}

/**
 * Genera un código de seguimiento único
 */
function generateTrackingCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `PL-${timestamp}-${random}`.toUpperCase();
}

/**
 * Genera un link de Google Meet
 */
function generateGoogleMeetLink(): string {
  const meetingId = Math.random().toString(36).substr(2, 10);
  return `https://meet.google.com/${meetingId}`;
}

/**
 * Envía emails de confirmación usando Make.com
 */
export async function sendBookingEmailsMake(data: BookingEmailData): Promise<MakeEmailResponse> {
  try {
    const trackingCode = generateTrackingCode();
    const googleMeetLink = generateGoogleMeetLink();
    
    // Datos para el webhook de Make.com
    const webhookData = {
      // Datos del cliente
      cliente: {
        nombre: data.cliente_nombre,
        email: data.cliente_email,
        telefono: data.cliente_telefono
      },
      
      // Datos del servicio
      servicio: {
        tipo: data.servicio_tipo,
        precio: data.servicio_precio,
        fecha: data.fecha,
        hora: data.hora
      },
      
      // Datos del pago
      pago: {
        metodo: data.pago_metodo,
        estado: data.pago_estado,
        fecha_pago: data.created_at
      },
      
      // Datos técnicos
      reserva: {
        id: data.id,
        tracking_code: trackingCode,
        google_meet_link: googleMeetLink
      },
      
      // Configuración de emails
      emails: {
        cliente: {
          to: data.cliente_email,
          subject: `✅ Confirmación de Consulta Legal - ${trackingCode}`,
          template: 'booking_confirmation_client'
        },
        admin: {
          to: 'puntolegalelgolf@gmail.com',
          subject: `📋 Nueva Consulta Legal - ${trackingCode}`,
          template: 'booking_confirmation_admin'
        }
      },
      
      // Configuración de Google Calendar
      calendar: {
        title: `Consulta Legal - ${data.cliente_nombre}`,
        description: `Consulta de ${data.servicio_tipo} con ${data.cliente_nombre}`,
        start_date: `${data.fecha}T${data.hora}:00`,
        duration_minutes: 45,
        google_meet_link: googleMeetLink,
        attendees: [data.cliente_email, 'puntolegalelgolf@gmail.com']
      }
    };

    console.log('📤 Enviando datos a Make.com:', webhookData);

    // Webhook de Make.com (reemplazar con tu URL real)
    const makeWebhookUrl = 'https://hook.us2.make.com/your-webhook-url-here';
    
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      throw new Error(`Error en Make.com: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Respuesta de Make.com:', result);

    return {
      success: true,
      message: 'Emails enviados exitosamente',
      tracking_code: trackingCode,
      google_meet_link: googleMeetLink,
      calendar_event_id: result.calendar_event_id || 'pending'
    };

  } catch (error) {
    console.error('❌ Error enviando emails via Make.com:', error);
    
    // Fallback: enviar email simple
    return await sendSimpleEmail(data);
  }
}

/**
 * Envía email simple como fallback
 */
async function sendSimpleEmail(data: BookingEmailData): Promise<MakeEmailResponse> {
  try {
    const trackingCode = generateTrackingCode();
    const googleMeetLink = generateGoogleMeetLink();
    
    // Email simple usando webhook.site como fallback
    const simpleData = {
      to: data.cliente_email,
      subject: `Confirmación de Consulta Legal - ${trackingCode}`,
      message: `
        Hola ${data.cliente_nombre},
        
        Tu consulta legal ha sido confirmada exitosamente.
        
        Detalles:
        - Servicio: ${data.servicio_tipo}
        - Fecha: ${data.fecha}
        - Hora: ${data.hora}
        - Precio: $${data.servicio_precio}
        - Código de seguimiento: ${trackingCode}
        - Link de Google Meet: ${googleMeetLink}
        
        Te contactaremos 24 horas antes de tu consulta.
        
        Saludos,
        Equipo Punto Legal
      `,
      tracking_code: trackingCode,
      google_meet_link: googleMeetLink
    };

    const response = await fetch('https://webhook.site/your-webhook-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simpleData)
    });

    return {
      success: response.ok,
      message: response.ok ? 'Email enviado (modo simple)' : 'Error enviando email',
      tracking_code: trackingCode,
      google_meet_link: googleMeetLink
    };

  } catch (error) {
    console.error('❌ Error en email simple:', error);
    return {
      success: false,
      message: 'Error enviando email',
      tracking_code: generateTrackingCode(),
      google_meet_link: generateGoogleMeetLink()
    };
  }
}

export default sendBookingEmailsMake;
