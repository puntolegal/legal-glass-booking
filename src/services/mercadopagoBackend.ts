// Simulación de backend para MercadoPago
// En producción, estos endpoints deberían estar en un servidor Node.js/Python

import { MERCADOPAGO_CONFIG } from '@/config/mercadopago';

// Interfaz para crear preferencia
export interface CreatePreferenceRequest {
  items: {
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }[];
  payer: {
    name: string;
    email: string;
    phone?: {
      number: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  external_reference: string;
  metadata?: any;
  notification_url?: string;
}

// Crear preferencia según documentación oficial de MercadoPago
export const createCheckoutPreference = async (preferenceData: CreatePreferenceRequest) => {
  try {
    console.log('🚀 Creando preferencia de Checkout Pro (oficial):', preferenceData);
    
    // Configuración de preferencia según documentación oficial
    const preference = {
      // Items - información del producto/servicio
      items: preferenceData.items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'CLP' // Moneda chilena
      })),
      
      // Payer - información del comprador
      payer: {
        name: preferenceData.payer.name,
        email: preferenceData.payer.email,
        phone: preferenceData.payer.phone || undefined
      },
      
      // URLs de retorno según documentación oficial
      back_urls: {
        success: preferenceData.back_urls.success,
        failure: preferenceData.back_urls.failure,
        pending: preferenceData.back_urls.pending
      },
      
      // Auto return - redirigir automáticamente cuando se aprueba
      auto_return: 'approved',
      
      // Referencia externa para sincronizar con tu sistema
      external_reference: preferenceData.external_reference,
      
      // Metadata adicional
      metadata: {
        ...preferenceData.metadata,
        integration_type: 'checkout_pro',
        platform: 'react',
        version: '1.0.0'
      },
      
      // URL de notificaciones (webhooks)
      notification_url: preferenceData.notification_url,
      
      // Configuración adicional para Chile
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      
      // Personalización
      statement_descriptor: 'PUNTO LEGAL'
    };

    // En producción, esta sería la llamada real:
    /*
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });
    
    const preferenceResponse = await response.json();
    */
    
    // Por ahora, simular respuesta oficial
    const mockPreference = {
      // ID único según formato oficial
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 12)}`,
      
      collector_id: 2685419265,
      operation_type: 'regular_payment',
      
      // URLs de checkout según documentación
      init_point: `https://www.mercadopago.com.cl/checkout/v1/redirect?pref_id=${Date.now()}`,
      sandbox_init_point: `https://sandbox.mercadopago.com.cl/checkout/v1/redirect?pref_id=${Date.now()}`,
      
      // Datos de la preferencia
      ...preference,
      
      // Metadatos del sistema
      date_created: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      status: 'active'
    };

    // Simular delay de red real
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('✅ Preferencia creada según estándares oficiales:', {
      id: mockPreference.id,
      init_point: mockPreference.init_point,
      items: mockPreference.items
    });
    
    return mockPreference;

  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    throw new Error('Error al crear la preferencia de pago');
  }
};

// Obtener información de pago
export const getPaymentInfo = async (paymentId: string) => {
  try {
    console.log('🔍 Obteniendo información del pago:', paymentId);
    
    // En producción: GET https://api.mercadopago.com/v1/payments/{payment_id}
    
    const mockPaymentInfo = {
      id: paymentId,
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 35000,
      currency_id: 'CLP',
      payment_method_id: 'visa',
      payment_type_id: 'credit_card',
      date_created: new Date().toISOString(),
      date_approved: new Date().toISOString(),
      date_last_updated: new Date().toISOString(),
      
      payer: {
        id: 'USER-123',
        email: 'cliente@test.com',
        identification: {
          type: 'RUT',
          number: '12345678-9'
        },
        first_name: 'Juan',
        last_name: 'Pérez'
      },
      
      payment_method: {
        id: 'visa',
        type: 'credit_card',
        issuer_id: '310'
      },
      
      transaction_details: {
        net_received_amount: 35000,
        total_paid_amount: 35000,
        installment_amount: 35000,
        financial_institution: 'Transbank'
      }
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPaymentInfo;
    
  } catch (error) {
    console.error('❌ Error obteniendo información de pago:', error);
    throw error;
  }
};

// Manejar notificación de webhook
export const handlePaymentNotification = async (notification: any) => {
  try {
    console.log('🔔 Notificación de pago recibida:', notification);
    
    // En producción, validar la notificación
    // 1. Verificar que viene de MercadoPago
    // 2. Obtener detalles del pago
    // 3. Actualizar estado en base de datos
    // 4. Enviar confirmaciones
    
    if (notification.type === 'payment') {
      const paymentInfo = await getPaymentInfo(notification.data.id);
      
      // Aquí integrar con Make.com o sistema de notificaciones
      if (paymentInfo.status === 'approved') {
        console.log('✅ Pago aprobado, enviando confirmaciones...');
        
        // Enviar a Make.com para emails automáticos
        const makeWebhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
        if (makeWebhookUrl) {
          await fetch(makeWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'pago_confirmado',
              payment: paymentInfo,
              cliente: paymentInfo.payer,
              cita: {
                // Recuperar datos de la cita desde external_reference
                external_reference: notification.external_reference
              }
            })
          });
        }
      }
    }
    
    return { status: 'ok' };
    
  } catch (error) {
    console.error('❌ Error procesando notificación:', error);
    throw error;
  }
};

// Configuración de Checkout Pro
export const getCheckoutProConfig = () => {
  return {
    publicKey: MERCADOPAGO_CONFIG.publicKey,
    locale: MERCADOPAGO_CONFIG.locale,
    theme: {
      elementsColor: '#ff6b35', // Color primary de Punto Legal
      headerColor: '#1e3c72'
    },
    customization: {
      visual: {
        buttonBackground: 'blue',
        buttonHeight: '48px',
        borderRadius: '16px'
      },
      paymentMethods: {
        creditCard: 'all',
        debitCard: 'all',
        maxInstallments: 12
      }
    }
  };
};

export default {
  createCheckoutPreference,
  getPaymentInfo,
  handlePaymentNotification,
  getCheckoutProConfig
};
