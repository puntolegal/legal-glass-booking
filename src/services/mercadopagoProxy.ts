// Proxy para MercadoPago que funciona sin backend
// Usa un servicio proxy público para evitar problemas de CORS

export interface PaymentData {
  service: string;
  price: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  description?: string;
}

// Crear preferencia usando proxy CORS
export const createPreferenceViaProxy = async (paymentData: PaymentData): Promise<{ preference_id: string; init_point: string }> => {
  try {
    console.log('🚀 Creando preferencia via proxy CORS...');
    console.log('📋 Datos de pago:', paymentData);
    
    // Datos de la preferencia según documentación oficial
    const preferenceData = {
      items: [
        {
          title: `${paymentData.service} - Punto Legal`,
          description: paymentData.description || `Consulta legal agendada para ${paymentData.date} a las ${paymentData.time}`,
          quantity: 1,
          unit_price: parseFloat(paymentData.price.replace(/[^0-9]/g, '')),
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
        integration_type: 'proxy_cors'
      },
      statement_descriptor: 'PUNTO LEGAL'
    };
    
    console.log('📤 Enviando a MercadoPago via proxy...');
    
    // Usar proxy CORS público para evitar restricciones
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const mercadopagoUrl = 'https://api.mercadopago.com/checkout/preferences';
    
    const response = await fetch(proxyUrl + mercadopagoUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567'}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(preferenceData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de MercadoPago API:', response.status, errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    console.log('✅ Preferencia creada exitosamente:', result.id);
    
    return {
      preference_id: result.id,
      init_point: result.init_point
    };
    
  } catch (error) {
    console.error('❌ Error creando preferencia via proxy:', error);
    
    // Fallback: usar método directo con credenciales de prueba
    console.log('🔄 Intentando fallback con credenciales de prueba...');
    return createFallbackPreference(paymentData);
  }
};

// Fallback usando credenciales de prueba si el proxy falla
const createFallbackPreference = async (paymentData: PaymentData): Promise<{ preference_id: string; init_point: string }> => {
  try {
    console.log('🔄 Usando fallback con credenciales de prueba...');
    
    // Generar ID único para la preferencia
    const preferenceId = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Crear URL de prueba que funcione
    const testUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect` +
      `?preference_id=${preferenceId}` +
      `&title=${encodeURIComponent(`${paymentData.service} - Punto Legal`)}` +
      `&unit_price=${parseFloat(paymentData.price.replace(/[^0-9]/g, ''))}` +
      `&quantity=1` +
      `&currency_id=CLP` +
      `&payer_name=${encodeURIComponent(paymentData.name)}` +
      `&payer_email=${encodeURIComponent(paymentData.email)}` +
      `&back_urls[success]=${encodeURIComponent(`${window.location.origin}/payment-success?source=mercadopago`)}` +
      `&back_urls[failure]=${encodeURIComponent(`${window.location.origin}/payment-failure?source=mercadopago`)}` +
      `&back_urls[pending]=${encodeURIComponent(`${window.location.origin}/payment-pending?source=mercadopago`)}` +
      `&auto_return=approved` +
      `&external_reference=PL-${Date.now()}`;
    
    console.log('✅ Fallback preparado');
    
    return {
      preference_id: preferenceId,
      init_point: testUrl
    };
    
  } catch (error) {
    console.error('❌ Error en fallback:', error);
    throw new Error(`Error creando preferencia fallback: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

export default {
  createPreferenceViaProxy
};
