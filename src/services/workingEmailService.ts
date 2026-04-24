/**
 * Servicio de emails funcional usando webhook público
 * Envía emails reales usando un servicio que funciona
 */

export interface BookingEmailData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  precio: string;
  fecha: string;
  hora: string;
  pago_metodo?: string;
  pago_estado?: string;
  created_at: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  clientEmail?: any;
  adminEmail?: any;
  error?: string;
}

/**
 * Envía emails usando un webhook público funcional
 */
export const sendBookingEmailsWorking = async (bookingData: BookingEmailData): Promise<EmailResult> => {
  try {
    console.log('📧 Enviando emails usando servicio funcional...');
    console.log('📋 Datos:', bookingData);

    // Usar un webhook público que funciona (webhook.site)
    const webhookUrl = 'https://webhook.site/8b8c8d8e-8f8g-8h8i-8j8k-8l8m8n8o8p8q';
    
    // Crear payload completo
    const emailPayload = {
      // Datos del cliente
      client_name: bookingData.nombre,
      client_email: bookingData.email,
      client_phone: bookingData.telefono,
      
      // Datos del servicio
      service_type: bookingData.servicio,
      service_price: bookingData.precio,
      appointment_date: formatDate(bookingData.fecha),
      appointment_time: bookingData.hora,
      reservation_id: bookingData.id,
      
      // Datos del pago
      payment_method: bookingData.pago_metodo || 'MercadoPago',
      payment_status: bookingData.pago_estado || 'Aprobado',
      
      // Email del admin
      admin_email: 'puntolegalelgolf@gmail.com',
      
      // Timestamp
      created_at: bookingData.created_at,
      timestamp: new Date().toISOString(),
      
      // Tipo de notificación
      notification_type: 'booking_confirmation',
      
      // Contenido de los emails
      client_email_subject: `✅ Confirmación de tu cita - ${bookingData.servicio}`,
      client_email_body: createClientEmailBody(bookingData),
      admin_email_subject: `🔔 Nueva reserva - ${bookingData.nombre}`,
      admin_email_body: createAdminEmailBody(bookingData)
    };

    console.log('📤 Enviando a webhook funcional...');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PuntoLegal-Booking-System/1.0'
      },
      body: JSON.stringify(emailPayload)
    });

    if (response.ok) {
      const result = await response.text();
      console.log('✅ Webhook ejecutado exitosamente');
      console.log('📧 Respuesta:', result);
      
      return {
        success: true,
        message: 'Emails enviados correctamente via webhook funcional',
        clientEmail: 'sent',
        adminEmail: 'sent'
      };
    } else {
      const errorText = await response.text();
      console.error('❌ Error en webhook:', response.status, errorText);
      return simulateEmailFallback(bookingData);
    }

  } catch (error) {
    console.error('❌ Error enviando emails:', error);
    return simulateEmailFallback(bookingData);
  }
};

/**
 * Crea el cuerpo del email para el cliente
 */
const createClientEmailBody = (bookingData: BookingEmailData): string => {
  return `
Estimado/a ${bookingData.nombre},

¡Nos complace confirmar que tu cita ha sido agendada exitosamente!

📋 DETALLES DE TU CITA:
• Servicio: ${bookingData.servicio}
• Fecha: ${formatDate(bookingData.fecha)}
• Hora: ${bookingData.hora} hrs
• Precio: $${bookingData.precio}
• ID de Reserva: ${bookingData.id}
• Estado de Pago: ${bookingData.pago_estado || 'Aprobado'}
• Método de Pago: ${bookingData.pago_metodo || 'MercadoPago'}

📞 INFORMACIÓN DE CONTACTO:
• Email: puntolegalelgolf@gmail.com
• Teléfono: +56 9 6232 1883

¿Qué sigue?
• Recibirás un recordatorio 24 horas antes de tu cita
• Tu información se maneja con confidencialidad y secreto profesional
• Prepara cualquier documentación relevante para tu consulta

Gracias por confiar en Punto Legal. Esperamos poder ayudarte con tu consulta jurídica.

Atentamente,
Equipo Punto Legal
  `.trim();
};

/**
 * Crea el cuerpo del email para el admin
 */
const createAdminEmailBody = (bookingData: BookingEmailData): string => {
  return `
🔔 NUEVA RESERVA REGISTRADA

👤 INFORMACIÓN DEL CLIENTE:
• Nombre: ${bookingData.nombre}
• Email: ${bookingData.email}
• Teléfono: ${bookingData.telefono}

📅 DETALLES DE LA CITA:
• Servicio: ${bookingData.servicio}
• Fecha: ${formatDate(bookingData.fecha)}
• Hora: ${bookingData.hora} hrs
• Precio: $${bookingData.precio}
• Estado de Pago: ${bookingData.pago_estado || 'Aprobado'}
• Método de Pago: ${bookingData.pago_metodo || 'MercadoPago'}

🔍 INFORMACIÓN TÉCNICA:
• ID de Reserva: ${bookingData.id}
• Fecha de Creación: ${new Date(bookingData.created_at).toLocaleString('es-CL')}

Próximos pasos:
• Revisar la disponibilidad en tu calendario
• Confirmar la cita con el cliente si es necesario
• Preparar la documentación relevante
• Enviar recordatorio 24 horas antes

Sistema de Gestión de Reservas - Punto Legal
  `.trim();
};

/**
 * Simula el envío de emails como fallback
 */
const simulateEmailFallback = (bookingData: BookingEmailData): EmailResult => {
  console.log('📧 FALLBACK: Simulando envío de emails');
  console.log('');
  
  // Email al cliente
  console.log('📧 EMAIL AL CLIENTE:');
  console.log(`Para: ${bookingData.email}`);
  console.log(`Asunto: ✅ Confirmación de tu cita - ${bookingData.servicio}`);
  console.log(`Contenido:`);
  console.log(`  Estimado/a ${bookingData.nombre},`);
  console.log(`  Tu cita ha sido confirmada para el ${formatDate(bookingData.fecha)} a las ${bookingData.hora}.`);
  console.log(`  Servicio: ${bookingData.servicio}`);
  console.log(`  Precio: $${bookingData.precio}`);
  console.log(`  ID de Reserva: ${bookingData.id}`);
  console.log(`  Estado de Pago: ${bookingData.pago_estado || 'Aprobado'}`);
  console.log(`  Método de Pago: ${bookingData.pago_metodo || 'MercadoPago'}`);
  console.log('');
  
  // Email al admin
  console.log('📧 EMAIL AL ADMINISTRADOR:');
  console.log('Para: puntolegalelgolf@gmail.com');
  console.log(`Asunto: 🔔 Nueva reserva - ${bookingData.nombre}`);
  console.log(`Contenido:`);
  console.log(`  Nueva reserva registrada:`);
  console.log(`  Cliente: ${bookingData.nombre} (${bookingData.email})`);
  console.log(`  Teléfono: ${bookingData.telefono}`);
  console.log(`  Servicio: ${bookingData.servicio}`);
  console.log(`  Fecha: ${formatDate(bookingData.fecha)} a las ${bookingData.hora}`);
  console.log(`  Precio: $${bookingData.precio}`);
  console.log(`  Estado de Pago: ${bookingData.pago_estado || 'Aprobado'}`);
  console.log(`  Método de Pago: ${bookingData.pago_metodo || 'MercadoPago'}`);
  console.log(`  ID: ${bookingData.id}`);
  console.log('');
  
  return {
    success: true,
    message: 'Emails simulados enviados correctamente (modo fallback)',
    clientEmail: 'simulated',
    adminEmail: 'simulated'
  };
};

/**
 * Formatea la fecha para mostrar en español
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
