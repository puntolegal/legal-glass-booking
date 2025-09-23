// Simulación de backend para MercadoPago
// En producción, estos endpoints deberían estar en un servidor Node.js/Python

import { MERCADOPAGO_CONFIG } from '@/config/mercadopago';
import { updatePaymentStatus, type PaymentStatusUpdate } from './supabaseBooking';

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
  metadata?: Record<string, unknown>;
  notification_url?: string;
}

interface MercadoPagoWebhookNotification {
  type?: string;
  data: {
    id: string;
    external_reference?: string;
  };
  external_reference?: string;
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

    // Llamada real a la API de MercadoPago
    console.log('🔑 Usando token de acceso:', MERCADOPAGO_CONFIG.accessToken ? 'Configurado' : 'No configurado');
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error de MercadoPago:', errorData);
      throw new Error(`MercadoPago API Error: ${errorData.message || response.statusText}`);
    }
    
    const preferenceResponse = await response.json();
    console.log('✅ Preferencia creada exitosamente:', preferenceResponse.id);
    
    return preferenceResponse;

  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    throw new Error('Error al crear la preferencia de pago');
  }
};

const createMockPaymentInfo = (paymentId: string) => ({
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
  external_reference: null,
  preference_id: null,
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
});

// Obtener información de pago
export const getPaymentInfo = async (paymentId: string) => {
  try {
    console.log('🔍 Obteniendo información del pago:', paymentId);

    // 0) Intentar via backend local (si está disponible) para no exponer token
    try {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
      const t = setTimeout(() => ctrl?.abort(), 2500);
      const localRes = await fetch(`http://localhost:3001/payment/${paymentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl?.signal
      } as RequestInit);
      clearTimeout(t);
      if (localRes.ok) {
        const payload = await localRes.json();
        if (payload?.success && payload?.payment) {
          return payload.payment;
        }
      }
    } catch (e) {
      console.log('ℹ️ Backend local no disponible para /payment, usando fallback');
    }

    const accessToken =
      MERCADOPAGO_CONFIG.accessToken ||
      (typeof process !== 'undefined' ? (process as any).env?.MERCADOPAGO_ACCESS_TOKEN : '') ||
      (typeof process !== 'undefined' ? (process as any).env?.VITE_MERCADOPAGO_ACCESS_TOKEN : '');

    if (!accessToken) {
      console.warn('⚠️ Access token de MercadoPago no configurado, utilizando datos simulados.');
      return createMockPaymentInfo(paymentId);
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error consultando API de MercadoPago:', response.status, errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const paymentInfo = await response.json();

    console.log('✅ Información real obtenida de MercadoPago:', {
      id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      amount: paymentInfo.transaction_amount
    });

    return paymentInfo;

  } catch (error) {
    console.error('❌ Error obteniendo información de pago real, usando fallback:', error);
    return createMockPaymentInfo(paymentId);
  }
};

// Manejar notificación de webhook
export const handlePaymentNotification = async (notification: MercadoPagoWebhookNotification) => {
  try {
    console.log('🔔 Notificación de pago recibida:', notification);

    if (!notification.data || !notification.data.id) {
      console.warn('⚠️ Notificación de MercadoPago sin identificador de pago');
      return { status: 'ignored' };
    }
    
    // En producción, validar la notificación
    // 1. Verificar que viene de MercadoPago
    // 2. Obtener detalles del pago
    // 3. Actualizar estado en base de datos
    // 4. Enviar confirmaciones
    
    if (notification.type === 'payment') {
      const paymentInfo = await getPaymentInfo(notification.data.id);

      const reservaId = paymentInfo.external_reference || notification?.data?.external_reference;

      if (reservaId) {
        const paymentUpdate: PaymentStatusUpdate = {
          estado: paymentInfo.status,
          id: paymentInfo.id?.toString() ?? notification.data.id,
          metodo: paymentInfo.payment_method?.id || paymentInfo.payment_method_id || paymentInfo.payment_type_id,
          tipo: paymentInfo.payment_type_id || undefined,
          monto: paymentInfo.transaction_amount,
          externalReference: paymentInfo.external_reference ?? null,
          preferenceId: paymentInfo.preference_id ?? null,
          statusDetail: paymentInfo.status_detail ?? null
        };

        await updatePaymentStatus(reservaId, paymentUpdate);
      } else {
        console.warn('⚠️ Notificación de pago sin external_reference, no se pudo actualizar la reserva');
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
