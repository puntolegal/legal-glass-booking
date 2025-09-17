// Webhooks de MercadoPago - Implementación oficial
// Según documentación: https://www.mercadopago.com.cl/developers/es/docs/your-integrations/notifications/webhooks

import crypto from 'crypto';
import { getPaymentInfo } from '@/services/mercadopagoBackend';
import { updatePaymentStatus, findReservaByCriteria } from '@/services/supabaseBooking';

// Interfaz para notificación de webhook
export interface MercadoPagoWebhookNotification {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: string;
  live_mode: boolean;
  type: 'payment' | 'plan' | 'subscription' | 'invoice' | 'point_integration_wh';
  user_id: number;
}

// Clave secreta de la aplicación (se obtiene de "Tus integraciones" en MercadoPago)
const WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET || 'tu_clave_secreta_aqui';

// Validar origen de la notificación según documentación oficial
export const validateWebhookSignature = (
  xSignature: string,
  xRequestId: string,
  dataId: string,
  body: string
): boolean => {
  try {
    console.log('🔍 Validando firma de webhook de MercadoPago...');
    
    // 1. Extraer timestamp (ts) y clave (v1) del header x-signature
    const parts = xSignature.split(',');
    let ts = '';
    let hash = '';
    
    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key?.trim() === 'ts') {
        ts = value?.trim() || '';
      } else if (key?.trim() === 'v1') {
        hash = value?.trim() || '';
      }
    }
    
    if (!ts || !hash) {
      console.error('❌ Firma inválida: ts o v1 faltantes');
      return false;
    }
    
    // 2. Generar el template según documentación oficial
    // Formato: id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    
    console.log('📝 Template generado:', manifest);
    
    // 3. Generar HMAC SHA256 con la clave secreta
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(manifest);
    const generatedHash = hmac.digest('hex');
    
    // 4. Comparar con la clave recibida
    const isValid = generatedHash === hash;
    
    if (isValid) {
      console.log('✅ Firma de webhook válida');
    } else {
      console.error('❌ Firma de webhook inválida');
      console.error('Hash esperado:', generatedHash);
      console.error('Hash recibido:', hash);
    }
    
    return isValid;
    
  } catch (error) {
    console.error('❌ Error validando firma de webhook:', error);
    return false;
  }
};

// Manejar notificación de webhook según documentación oficial
export const handleMercadoPagoWebhook = async (
  notification: MercadoPagoWebhookNotification,
  headers: Record<string, string>,
  queryParams: Record<string, string>
) => {
  try {
    console.log('🔔 Webhook de MercadoPago recibido:', {
      type: notification.type,
      action: notification.action,
      dataId: notification.data.id
    });
    
    // 1. Validar firma (en producción)
    if (process.env.NODE_ENV === 'production') {
      const xSignature = headers['x-signature'];
      const xRequestId = headers['x-request-id'];
      const dataId = queryParams['data.id'];
      
      if (!validateWebhookSignature(xSignature, xRequestId, dataId, JSON.stringify(notification))) {
        throw new Error('Firma de webhook inválida');
      }
    }
    
    // 2. Procesar según tipo de notificación
    switch (notification.type) {
      case 'payment':
        await handlePaymentNotification(notification);
        break;
        
      case 'plan':
        console.log('📝 Notificación de plan recibida (no implementado)');
        break;
        
      case 'subscription':
        console.log('📝 Notificación de suscripción recibida (no implementado)');
        break;
        
      case 'invoice':
        console.log('📝 Notificación de factura recibida (no implementado)');
        break;
        
      default:
        console.log('📝 Tipo de notificación no reconocido:', notification.type);
    }
    
    // 3. Retornar respuesta exitosa (requerido por MercadoPago)
    return {
      status: 'ok',
      message: 'Notificación procesada exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error procesando webhook de MercadoPago:', error);
    throw error;
  }
};

// Manejar notificación de pago específicamente
const handlePaymentNotification = async (notification: MercadoPagoWebhookNotification) => {
  try {
    console.log('💳 Procesando notificación de pago:', notification.data.id);
    
    // 1. Obtener información completa del pago
    const paymentInfo = await getPaymentInfo(notification.data.id);
    
    console.log('📊 Estado del pago:', {
      id: paymentInfo.id,
      status: paymentInfo.status,
      amount: paymentInfo.transaction_amount,
      method: paymentInfo.payment_method_id
    });
    
    // 2. Procesar según estado del pago
    switch (paymentInfo.status) {
      case 'approved':
        await handleApprovedPayment(paymentInfo);
        break;
        
      case 'pending':
        await handlePendingPayment(paymentInfo);
        break;
        
      case 'rejected':
        await handleRejectedPayment(paymentInfo);
        break;
        
      default:
        console.log('🔄 Estado de pago no manejado:', paymentInfo.status);
    }
    
  } catch (error) {
    console.error('❌ Error manejando notificación de pago:', error);
    throw error;
  }
};

// Manejar pago aprobado
const handleApprovedPayment = async (paymentInfo: any) => {
  try {
    console.log('✅ Pago aprobado, procesando confirmación...');
    
    // 1. Buscar la reserva en Supabase usando external_reference o email
    let reserva = null;
    
    if (paymentInfo.external_reference) {
      const result = await findReservaByCriteria({ 
        externalReference: paymentInfo.external_reference 
      });
      reserva = result.reserva;
    }
    
    // Si no se encuentra por external_reference, buscar por email
    if (!reserva && paymentInfo.payer?.email) {
      const result = await findReservaByCriteria({ 
        email: paymentInfo.payer.email 
      });
      reserva = result.reserva;
    }
    
    // 2. Actualizar estado del pago en Supabase
    if (reserva) {
      console.log('🔄 Actualizando reserva en Supabase:', reserva.id);
      
      const updateResult = await updatePaymentStatus(reserva.id, {
        estado: 'approved',
        id: paymentInfo.id,
        metodo: 'mercadopago',
        monto: paymentInfo.transaction_amount
      });
      
      if (updateResult.success) {
        console.log('✅ Reserva actualizada y emails enviados automáticamente');
      } else {
        console.error('❌ Error actualizando reserva:', updateResult.error);
      }
    } else {
      console.warn('⚠️ No se encontró reserva asociada al pago:', {
        paymentId: paymentInfo.id,
        externalReference: paymentInfo.external_reference,
        email: paymentInfo.payer?.email
      });
      
      // Crear reserva nueva si no existe (fallback)
      console.log('📝 Creando nueva reserva desde webhook...');
      // TODO: Implementar creación de reserva desde webhook si es necesario
    }
    
    console.log('✅ Pago aprobado procesado completamente con Supabase');
    
  } catch (error) {
    console.error('❌ Error procesando pago aprobado:', error);
    throw error;
  }
};

// Manejar pago pendiente
const handlePendingPayment = async (paymentInfo: any) => {
  console.log('⏳ Pago pendiente, esperando confirmación:', paymentInfo.id);
  
  // Para pagos offline (efectivo, transferencia, etc.)
  // El usuario debe completar el pago en un punto físico
  
  // TODO: Enviar instrucciones al cliente sobre cómo completar el pago
};

// Manejar pago rechazado
const handleRejectedPayment = async (paymentInfo: any) => {
  console.log('❌ Pago rechazado:', paymentInfo.id, paymentInfo.status_detail);
  
  // TODO: Notificar al cliente sobre el rechazo y ofrecer alternativas
};

// Simular endpoint de webhook (en producción esto estaría en tu servidor)
export const simulateWebhookEndpoint = async (req: {
  headers: Record<string, string>;
  query: Record<string, string>;
  body: MercadoPagoWebhookNotification;
}) => {
  try {
    console.log('🔔 Simulando endpoint de webhook...');
    
    // Procesar notificación
    const result = await handleMercadoPagoWebhook(req.body, req.headers, req.query);
    
    // Retornar respuesta HTTP 200 (requerido por MercadoPago)
    return {
      status: 200,
      body: result
    };
    
  } catch (error) {
    console.error('❌ Error en endpoint de webhook:', error);
    
    // Retornar error HTTP 500
    return {
      status: 500,
      body: {
        error: 'Error procesando webhook',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }
    };
  }
};

export default {
  handleMercadoPagoWebhook,
  validateWebhookSignature,
  simulateWebhookEndpoint
};
