// Backend para MercadoPago
// Usa el servidor Node.js local para crear preferencias de forma segura

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
    
    // Determinar si usar backend local o función de Supabase
    const isProduction = import.meta.env.PROD || window.location.hostname === 'www.puntolegal.online' || window.location.hostname === 'puntolegal.online';
    const useSupabaseFunction = isProduction;
    
    console.log('🔍 DEBUG MercadoPago Backend:', {
      'import.meta.env.PROD': import.meta.env.PROD,
      'window.location.hostname': window.location.hostname,
      'isProduction': isProduction,
      'useSupabaseFunction': useSupabaseFunction
    });
    
    if (useSupabaseFunction) {
      console.log('🌐 Usando función de Supabase para producción');
      return await createPreferenceWithSupabase(preferenceData);
    } else {
      console.log('🏠 Usando backend local para desarrollo');
      return await createPreferenceWithLocalBackend(preferenceData);
    }
  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    throw new Error(`Error al crear la preferencia de pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Función para usar Supabase Functions (producción)
const createPreferenceWithSupabase = async (preferenceData: CreatePreferenceRequest) => {
  try {
    // Preparar datos para la función de Supabase
    const paymentData = {
      service: preferenceData.items[0]?.title || 'Consulta Legal',
      description: preferenceData.items[0]?.title || 'Consulta Legal',
      price: preferenceData.items[0]?.unit_price || 0,
      name: preferenceData.payer.name,
      email: preferenceData.payer.email,
      phone: preferenceData.payer.phone?.number || '',
      date: preferenceData.metadata?.appointment_date || '',
      time: preferenceData.metadata?.appointment_time || '',
      external_reference: preferenceData.external_reference
    };
    
    // Llamada a la función de Supabase
    const { SUPABASE_CREDENTIALS } = await import('@/config/supabaseConfig');
    const response = await fetch(`${SUPABASE_CREDENTIALS.URL}/functions/v1/create-mercadopago-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_CREDENTIALS.PUBLISHABLE_KEY}`
      },
      body: JSON.stringify({ paymentData })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error de Supabase Function:', errorData);
      throw new Error(`Supabase Function Error: ${errorData.error || 'Error desconocido'}`);
    }
    
    const result = await response.json();
    
    console.log('✅ Preferencia creada exitosamente:', result.preference_id);
    console.log('🔗 Init Point:', result.init_point);
    
    return {
      success: true,
      preference_id: result.preference_id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    };
    
  } catch (error) {
    console.error('❌ Error con Supabase Function:', error);
    throw error;
  }
};

// Función para usar backend local (desarrollo)
const createPreferenceWithLocalBackend = async (preferenceData: CreatePreferenceRequest) => {
  try {
    // Preparar datos para el backend local
    const paymentData = {
      service: preferenceData.items[0]?.title || 'Consulta Legal',
      description: preferenceData.items[0]?.title || 'Consulta Legal',
      price: preferenceData.items[0]?.unit_price || 0,
      name: preferenceData.payer.name,
      email: preferenceData.payer.email,
      phone: preferenceData.payer.phone?.number || '',
      date: preferenceData.metadata?.appointment_date || '',
      time: preferenceData.metadata?.appointment_time || '',
      external_reference: preferenceData.external_reference
    };
    
    // Llamada al backend local
    const response = await fetch('http://localhost:3001/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentData })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error del backend local:', errorData);
      throw new Error(`Backend Error: ${errorData.error || 'Error desconocido'}`);
    }
    
    const result = await response.json();
    
    console.log('✅ Preferencia creada exitosamente:', result.preference_id);
    console.log('🔗 Init Point:', result.init_point);
    
    return {
      success: true,
      preference_id: result.preference_id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    };
    
  } catch (error) {
    console.error('❌ Error con backend local:', error);
    throw error;
  }
};

// Función original (mantener para compatibilidad)
const createPreferenceOriginal = async (preferenceData: CreatePreferenceRequest) => {
  try {
    
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
      // Nota: auto_return solo funciona con URLs HTTPS en producción
      auto_return: preferenceData.back_urls.success.startsWith('https://') ? 'approved' : undefined,
      
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

    // Debug: Verificar URLs de retorno
    console.log('🔍 URLs de retorno recibidas:', preferenceData.back_urls);
    console.log('🔍 URLs de retorno individuales:', {
      success: preferenceData.back_urls.success,
      failure: preferenceData.back_urls.failure,
      pending: preferenceData.back_urls.pending
    });
    
    // Validar que las URLs estén definidas y sean válidas
    if (!preferenceData.back_urls || !preferenceData.back_urls.success) {
      console.error('❌ back_urls o back_urls.success no está definido:', preferenceData.back_urls);
      throw new Error('back_urls.success no está definido');
    }
    if (!preferenceData.back_urls.failure) {
      console.error('❌ back_urls.failure no está definido');
      throw new Error('back_urls.failure no está definido');
    }
    if (!preferenceData.back_urls.pending) {
      console.error('❌ back_urls.pending no está definido');
      throw new Error('back_urls.pending no está definido');
    }

    // Validar formato de URLs para MercadoPago
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(preferenceData.back_urls.success)) {
      console.error('❌ back_urls.success no tiene formato de URL válido:', preferenceData.back_urls.success);
      throw new Error('back_urls.success debe ser una URL válida');
    }
    if (!urlPattern.test(preferenceData.back_urls.failure)) {
      console.error('❌ back_urls.failure no tiene formato de URL válido:', preferenceData.back_urls.failure);
      throw new Error('back_urls.failure debe ser una URL válida');
    }
    if (!urlPattern.test(preferenceData.back_urls.pending)) {
      console.error('❌ back_urls.pending no tiene formato de URL válido:', preferenceData.back_urls.pending);
      throw new Error('back_urls.pending debe ser una URL válida');
    }
    
    // Llamada real a la API de MercadoPago
    console.log('🔑 Usando token de acceso:', MERCADOPAGO_CONFIG.accessToken ? 'Configurado' : 'No configurado');
    console.log('🔍 Token completo:', MERCADOPAGO_CONFIG.accessToken ? `${MERCADOPAGO_CONFIG.accessToken.substring(0, 20)}...` : 'No disponible');
    console.log('🔄 Auto return configurado:', preference.back_urls.success.startsWith('https://') ? 'Sí (HTTPS)' : 'No (HTTP local)');
    
    if (!MERCADOPAGO_CONFIG.accessToken) {
      throw new Error('Token de acceso de MercadoPago no configurado');
    }
    
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
          externalReference: paymentInfo.external_reference ?? null,
          preferenceId: paymentInfo.preference_id ?? null
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
