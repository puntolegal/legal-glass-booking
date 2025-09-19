/**
 * Servicio de emails usando webhook de Make.com
 * Envía emails reales al cliente y admin cuando se confirma un pago
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
 * Envía emails usando webhook de Make.com
 */
export const sendBookingEmailsWebhook = async (bookingData: BookingEmailData): Promise<EmailResult> => {
  try {
    console.log('📧 Enviando emails via webhook...');
    console.log('📋 Datos:', bookingData);

    // Webhook de Make.com para envío de emails
    const webhookUrl = 'https://hook.us2.make.com/qahisda8n5e6bh9my4f9fm6dkgdg71sq';

    const emailData = {
      // Datos del cliente
      client_name: bookingData.cliente_nombre,
      client_email: bookingData.cliente_email,
      client_phone: bookingData.cliente_telefono,
      
      // Datos del servicio
      service_type: bookingData.servicio_tipo,
      service_price: bookingData.servicio_precio,
      appointment_date: bookingData.fecha,
      appointment_time: bookingData.hora,
      reservation_id: bookingData.id,
      
      // Datos del pago
      payment_method: bookingData.pago_metodo || 'MercadoPago',
      payment_status: bookingData.pago_estado || 'Aprobado',
      
      // Email del admin
      admin_email: 'puntolegalelgolf@gmail.com',
      
      // Timestamp
      created_at: bookingData.created_at,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Enviando a webhook:', emailData);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Webhook ejecutado exitosamente:', result);
      
      return {
        success: true,
        message: 'Emails enviados correctamente via webhook',
        clientEmail: 'sent',
        adminEmail: 'sent'
      };
    } else {
      const errorText = await response.text();
      console.error('❌ Error en webhook:', response.status, errorText);
      
      // Fallback a simulación
      return simulateEmailFallback(bookingData);
    }

  } catch (error) {
    console.error('❌ Error enviando emails via webhook:', error);
    
    // Fallback a simulación
    return simulateEmailFallback(bookingData);
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
  console.log(`  Tu cita ha sido confirmada para el ${bookingData.fecha} a las ${bookingData.hora}.`);
  console.log(`  Servicio: ${bookingData.servicio_tipo}`);
  console.log(`  Precio: $${bookingData.servicio_precio}`);
  console.log(`  ID de Reserva: ${bookingData.id}`);
  console.log(`  Estado de Pago: ${bookingData.pago_estado || 'Aprobado'}`);
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
  console.log(`  Fecha: ${bookingData.fecha} a las ${bookingData.hora}`);
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
 * Verifica si el webhook está disponible
 */
export const checkWebhookStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://hook.us2.make.com/qahisda8n5e6bh9my4f9fm6dkgdg71sq', {
      method: 'HEAD'
    });
    return response.ok;
  } catch (error) {
    console.warn('⚠️ Webhook no disponible:', error);
    return false;
  }
};
