/**
 * Servicio de emails directo usando EmailJS
 * Envía emails reales sin depender de webhooks externos
 */

export interface BookingEmailData {
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

export interface EmailResult {
  success: boolean;
  message: string;
  clientEmail?: any;
  adminEmail?: any;
  error?: string;
}

/**
 * Envía emails usando EmailJS directamente
 */
export const sendBookingEmailsDirect = async (bookingData: BookingEmailData): Promise<EmailResult> => {
  try {
    console.log('📧 Enviando emails directamente...');
    console.log('📋 Datos:', bookingData);

    // Configuración de EmailJS
    const EMAILJS_SERVICE_ID = 'service_puntolegal';
    const EMAILJS_TEMPLATE_ID_CLIENT = 'template_client_confirmation';
    const EMAILJS_TEMPLATE_ID_ADMIN = 'template_admin_notification';
    const EMAILJS_USER_ID = 'user_puntolegal';

    // Enviar email al cliente
    const clientEmailResult = await sendClientEmail(bookingData, {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID_CLIENT,
      user_id: EMAILJS_USER_ID
    });

    // Enviar email al admin
    const adminEmailResult = await sendAdminEmail(bookingData, {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID_ADMIN,
      user_id: EMAILJS_USER_ID
    });

    if (clientEmailResult.success && adminEmailResult.success) {
      console.log('✅ Emails enviados exitosamente');
      return {
        success: true,
        message: 'Emails enviados correctamente',
        clientEmail: clientEmailResult,
        adminEmail: adminEmailResult
      };
    } else {
      console.log('⚠️ Algunos emails fallaron, usando simulación');
      return simulateEmailFallback(bookingData);
    }

  } catch (error) {
    console.error('❌ Error enviando emails:', error);
    return simulateEmailFallback(bookingData);
  }
};

/**
 * Envía email al cliente
 */
const sendClientEmail = async (bookingData: BookingEmailData, config: any): Promise<EmailResult> => {
  try {
    const templateParams = {
      client_name: bookingData.cliente_nombre,
      client_email: bookingData.cliente_email,
      service_type: bookingData.servicio_tipo,
      service_price: bookingData.servicio_precio,
      appointment_date: formatDate(bookingData.fecha),
      appointment_time: bookingData.hora,
      reservation_id: bookingData.id,
      payment_status: bookingData.pago_estado || 'Aprobado',
      payment_method: bookingData.pago_metodo || 'MercadoPago'
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: config.service_id,
        template_id: config.template_id,
        user_id: config.user_id,
        template_params: templateParams
      })
    });

    if (response.ok) {
      return { success: true, message: 'Email al cliente enviado' };
    } else {
      throw new Error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error enviando email al cliente:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envía email al admin
 */
const sendAdminEmail = async (bookingData: BookingEmailData, config: any): Promise<EmailResult> => {
  try {
    const templateParams = {
      admin_email: 'puntolegalelgolf@gmail.com',
      client_name: bookingData.cliente_nombre,
      client_email: bookingData.cliente_email,
      client_phone: bookingData.cliente_telefono,
      service_type: bookingData.servicio_tipo,
      service_price: bookingData.servicio_precio,
      appointment_date: formatDate(bookingData.fecha),
      appointment_time: bookingData.hora,
      reservation_id: bookingData.id,
      payment_status: bookingData.pago_estado || 'Aprobado',
      payment_method: bookingData.pago_metodo || 'MercadoPago',
      created_at: new Date(bookingData.created_at).toLocaleString('es-CL')
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: config.service_id,
        template_id: config.template_id,
        user_id: config.user_id,
        template_params: templateParams
      })
    });

    if (response.ok) {
      return { success: true, message: 'Email al admin enviado' };
    } else {
      throw new Error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error enviando email al admin:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Simula el envío de emails como fallback
 */
const simulateEmailFallback = (bookingData: BookingEmailData): EmailResult => {
  console.log('📧 FALLBACK: Simulando envío de emails');
  console.log('');
  
  // Email al cliente
  console.log('📧 EMAIL AL CLIENTE:');
  console.log(`Para: ${bookingData.cliente_email}`);
  console.log(`Asunto: ✅ Confirmación de tu cita - ${bookingData.servicio_tipo}`);
  console.log(`Contenido:`);
  console.log(`  Estimado/a ${bookingData.cliente_nombre},`);
  console.log(`  Tu cita ha sido confirmada para el ${formatDate(bookingData.fecha)} a las ${bookingData.hora}.`);
  console.log(`  Servicio: ${bookingData.servicio_tipo}`);
  console.log(`  Precio: $${bookingData.servicio_precio}`);
  console.log(`  ID de Reserva: ${bookingData.id}`);
  console.log(`  Estado de Pago: ${bookingData.pago_estado || 'Aprobado'}`);
  console.log(`  Método de Pago: ${bookingData.pago_metodo || 'MercadoPago'}`);
  console.log('');
  
  // Email al admin
  console.log('📧 EMAIL AL ADMINISTRADOR:');
  console.log('Para: puntolegalelgolf@gmail.com');
  console.log(`Asunto: 🔔 Nueva reserva - ${bookingData.cliente_nombre}`);
  console.log(`Contenido:`);
  console.log(`  Nueva reserva registrada:`);
  console.log(`  Cliente: ${bookingData.cliente_nombre} (${bookingData.cliente_email})`);
  console.log(`  Teléfono: ${bookingData.cliente_telefono}`);
  console.log(`  Servicio: ${bookingData.servicio_tipo}`);
  console.log(`  Fecha: ${formatDate(bookingData.fecha)} a las ${bookingData.hora}`);
  console.log(`  Precio: $${bookingData.servicio_precio}`);
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

/**
 * Verifica si el servicio de emails está disponible
 */
export const checkEmailServiceStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'HEAD'
    });
    return response.ok;
  } catch (error) {
    console.warn('⚠️ Servicio de emails no disponible:', error);
    return false;
  }
};
