// Implementación oficial de MercadoPago siguiendo la documentación exacta
// https://www.mercadopago.com/developers/es/docs/checkout-pro/landing

export interface MercadoPagoPreferenceData {
  service: string;
  price: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  description?: string;
}

// Credenciales oficiales de producción
export const MERCADOPAGO_CREDENTIALS = {
  publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '',
  // ❌ REMOVIDO - accessToken no debe estar en frontend
  // accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || ''
};

// Crear preferencia siguiendo la documentación oficial exacta
export const createOfficialPreference = async (paymentData: MercadoPagoPreferenceData): Promise<{ preference_id: string; init_point: string }> => {
  try {
    console.log('🚀 Creando preferencia OFICIAL de MercadoPago...');
    console.log('📋 Datos:', paymentData);
    
    // Estructura exacta según documentación oficial
    const preferencePayload = {
      items: [
        {
          title: `${paymentData.service} - Punto Legal`,
          description: paymentData.description || `Consulta legal agendada para ${paymentData.date} a las ${paymentData.time}`,
          quantity: 1,
          unit_price: paymentData.price,
          currency_id: 'CLP'
        }
      ],
      payer: {
        name: paymentData.name,
        email: paymentData.email,
        phone: {
          number: paymentData.phone
        }
      },
      back_urls: {
        success: `${window.location.origin}/payment-success?source=mercadopago`,
        failure: `${window.location.origin}/payment-failure?source=mercadopago`,
        pending: `${window.location.origin}/payment-pending?source=mercadopago`
      },
      auto_return: 'approved',
      external_reference: `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `${window.location.origin}/api/mercadopago/webhook`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time,
        source: 'punto-legal-web',
        integration_type: 'checkout_pro_official'
      },
      statement_descriptor: 'PUNTO LEGAL'
    };
    // ❌ REMOVIDO - No usar accessToken en frontend
    // Las operaciones de pago se manejan en el backend (Supabase Edge Functions)
    
    // Usar Supabase Edge Function en su lugar
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('create-mercadopago-preference', {
      body: preferencePayload
    });
    
    if (error) {
      console.error('❌ Error creando preferencia via Supabase:', error);
      throw new Error(`Error del servidor: ${error.message}`);
    }
    
    if (!data?.preference_id) {
      throw new Error('No se recibió preference_id del servidor');
    }
    
    return {
      preference_id: data.preference_id,
      init_point: data.init_point || `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.preference_id}`
    };
    
  } catch (error) {
    console.error('❌ Error completo en creación de preferencia:', error);
    
    // Si es error de CORS, sugerir alternativa
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Error de CORS: Necesitas un backend para crear preferencias en producción');
    }
    
    throw new Error(`Error creando preferencia: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Inicializar SDK oficial de MercadoPago
export const initializeMercadoPagoSDK = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Verificar si ya está cargado
    if (window.MercadoPago) {
      console.log('✅ SDK MercadoPago ya cargado');
      resolve(window.MercadoPago);
      return;
    }
    
    // Cargar SDK oficial
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      if (window.MercadoPago) {
        console.log('✅ SDK MercadoPago cargado exitosamente');
        resolve(window.MercadoPago);
      } else {
        reject(new Error('Error cargando SDK de MercadoPago'));
      }
    };
    script.onerror = () => {
      reject(new Error('Error cargando script de MercadoPago'));
    };
    
    document.head.appendChild(script);
  });
};

// Declarar tipos globales
declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default {
  createOfficialPreference,
  initializeMercadoPagoSDK,
  MERCADOPAGO_CREDENTIALS
};
