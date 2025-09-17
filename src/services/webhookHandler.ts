// Handler de webhooks para desarrollo
// En producción, esto estaría en tu servidor backend

import { MercadoPagoWebhookNotification, handleMercadoPagoWebhook } from '@/api/mercadopagoWebhooks';

// Simular recepción de webhook
export const simulateWebhookReception = async (paymentId: string, status: string) => {
  try {
    console.log('🔔 Simulando recepción de webhook de MercadoPago...');
    
    // Crear notificación simulada según formato oficial
    const mockNotification: MercadoPagoWebhookNotification = {
      action: 'payment.updated',
      api_version: 'v1',
      data: {
        id: paymentId
      },
      date_created: new Date().toISOString(),
      id: `webhook-${Date.now()}`,
      live_mode: false,
      type: 'payment',
      user_id: 2685419265
    };
    
    // Headers simulados
    const mockHeaders = {
      'x-signature': 'ts=1742505638683,v1=ced36ab6d33566bb1e16c125819b8d840d6b8ef136b0b9127c76064466f5229b',
      'x-request-id': `req-${Date.now()}`,
      'content-type': 'application/json'
    };
    
    // Query params simulados
    const mockQueryParams = {
      'data.id': paymentId,
      'type': 'payment'
    };
    
    // Procesar webhook
    const result = await handleMercadoPagoWebhook(mockNotification, mockHeaders, mockQueryParams);
    
    console.log('✅ Webhook procesado exitosamente:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error simulando webhook:', error);
    throw error;
  }
};

// Configurar listener para simular webhooks en desarrollo
export const setupWebhookSimulation = () => {
  // En desarrollo, simular webhooks cuando se complete un pago
  if (import.meta.env.DEV) {
    console.log('🔧 Configurando simulación de webhooks para desarrollo');
    
    // Escuchar eventos de pago completado
    window.addEventListener('mercadopago-payment-completed', (event: any) => {
      const { paymentId, status } = event.detail;
      simulateWebhookReception(paymentId, status);
    });
  }
};

// Disparar evento de pago completado (para desarrollo)
export const triggerPaymentCompleted = (paymentId: string, status: string) => {
  if (import.meta.env.DEV) {
    const event = new CustomEvent('mercadopago-payment-completed', {
      detail: { paymentId, status }
    });
    window.dispatchEvent(event);
  }
};

export default {
  simulateWebhookReception,
  setupWebhookSimulation,
  triggerPaymentCompleted
};
