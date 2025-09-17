/**
 * Servicio para envío de emails de confirmación de reservas
 * Utiliza Edge Functions de Supabase para enviar emails
 */

import { supabase } from '@/integrations/supabase/client';

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
 * Envía emails de confirmación al cliente y notificación al admin
 */
export const sendBookingEmails = async (bookingData: BookingEmailData): Promise<EmailResult> => {
  try {
    console.log('📧 Enviando emails para reserva:', bookingData.id);

    // Llamar a la Edge Function de Supabase
    const { data, error } = await supabase.functions.invoke('send-booking-emails', {
      body: { bookingData }
    });

    if (error) {
      console.error('❌ Error llamando Edge Function:', error);
      
      // Fallback: simular envío de emails si la Edge Function no está disponible
      return simulateEmailSending(bookingData);
    }

    console.log('✅ Emails enviados exitosamente:', data);
    return data as EmailResult;

  } catch (error) {
    console.error('❌ Error enviando emails:', error);
    
    // Fallback: simular envío de emails
    return simulateEmailSending(bookingData);
  }
};

/**
 * Simula el envío de emails cuando el servicio real no está disponible
 */
const simulateEmailSending = (bookingData: BookingEmailData): EmailResult => {
  console.log('📧 SIMULANDO ENVÍO DE EMAILS:');
  console.log('');
  
  // Simular email al cliente
  console.log('📧 EMAIL AL CLIENTE:');
  console.log(`Para: ${bookingData.cliente_email}`);
  console.log(`Asunto: ✅ Confirmación de tu cita - ${bookingData.servicio_tipo}`);
  console.log(`Contenido:`);
  console.log(`  Estimado/a ${bookingData.cliente_nombre},`);
  console.log(`  Tu cita ha sido confirmada para el ${bookingData.fecha} a las ${bookingData.hora}.`);
  console.log(`  Servicio: ${bookingData.servicio_tipo}`);
  console.log(`  Precio: $${bookingData.servicio_precio}`);
  console.log(`  ID de Reserva: ${bookingData.id}`);
  console.log('');
  
  // Simular email al admin
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
  console.log(`  Estado de Pago: ${bookingData.pago_estado || 'Pendiente'}`);
  console.log(`  ID: ${bookingData.id}`);
  console.log('');
  
  return {
    success: true,
    message: 'Emails simulados enviados correctamente (modo desarrollo)',
    clientEmail: 'simulated',
    adminEmail: 'simulated'
  };
};

/**
 * Envía un email de recordatorio 24 horas antes de la cita
 */
export const sendReminderEmail = async (bookingData: BookingEmailData): Promise<EmailResult> => {
  try {
    console.log('📧 Enviando recordatorio para reserva:', bookingData.id);

    // Llamar a Edge Function específica para recordatorios (por implementar)
    const { data, error } = await supabase.functions.invoke('send-reminder-email', {
      body: { bookingData }
    });

    if (error) {
      console.error('❌ Error enviando recordatorio:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return data as EmailResult;

  } catch (error) {
    console.error('❌ Error enviando recordatorio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Envía un email cuando se actualiza el estado de una reserva
 */
export const sendStatusUpdateEmail = async (
  bookingData: BookingEmailData, 
  newStatus: string, 
  message?: string
): Promise<EmailResult> => {
  try {
    console.log('📧 Enviando actualización de estado para reserva:', bookingData.id);

    const { data, error } = await supabase.functions.invoke('send-status-update-email', {
      body: { 
        bookingData, 
        newStatus, 
        message 
      }
    });

    if (error) {
      console.error('❌ Error enviando actualización:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return data as EmailResult;

  } catch (error) {
    console.error('❌ Error enviando actualización:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Verifica si el servicio de emails está disponible
 */
export const checkEmailServiceStatus = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('send-booking-emails', {
      body: { test: true }
    });

    return !error;
  } catch (error) {
    console.warn('⚠️ Servicio de emails no disponible:', error);
    return false;
  }
};
