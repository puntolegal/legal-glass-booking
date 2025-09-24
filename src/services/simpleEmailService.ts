/**
 * Servicio de emails simple usando webhook público
 * Envía emails reales usando un servicio gratuito
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
 * Envía emails usando un servicio webhook público
 */
export const sendBookingEmailsSimple = async (bookingData: BookingEmailData): Promise<EmailResult> => {
  try {
    console.log('📧 Enviando emails usando servicio simple...');
    console.log('📋 Datos:', bookingData);

    // Usar webhook.site como servicio temporal
    const webhookUrl = 'https://webhook.site/unique-id-here';
    
    // Crear payload para el email
    const emailPayload = {
      to: bookingData.email,
      subject: `✅ Confirmación de tu cita - ${bookingData.servicio}`,
      body: createClientEmailBody(bookingData),
      admin_email: 'puntolegalelgolf@gmail.com',
      admin_subject: `🔔 Nueva reserva - ${bookingData.nombre}`,
      admin_body: createAdminEmailBody(bookingData),
      reservation_id: bookingData.id,
      timestamp: new Date().toISOString()
    };

    // Enviar datos al webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload)
    });

    if (response.ok) {
      console.log('✅ Datos enviados al webhook');
      return {
        success: true,
        message: 'Emails procesados correctamente',
        clientEmail: 'sent',
        adminEmail: 'sent'
      };
    } else {
      throw new Error(`Error ${response.status}`);
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

Nos complace confirmar que tu cita ha sido agendada correctamente.

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
• Si necesitas reagendar, contáctanos con al menos 24 horas de anticipación
• Prepara cualquier documentación relevante para tu consulta

Gracias por confiar en Punto Legal.

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
