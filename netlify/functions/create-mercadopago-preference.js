// Netlify Function para crear preferencias de MercadoPago
// Evita problemas de CORS y mantiene las credenciales seguras

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Manejar preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { paymentData } = JSON.parse(event.body);
    
    console.log('🚀 Creando preferencia con Netlify Function...');
    console.log('📋 Datos recibidos:', paymentData);

    // Credenciales de MercadoPago (desde variables de entorno)
    const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567';
    
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
        success: `https://${event.headers.host}/payment-success?source=mercadopago`,
        failure: `https://${event.headers.host}/payment-failure?source=mercadopago`,
        pending: `https://${event.headers.host}/payment-pending?source=mercadopago`
      },
      auto_return: 'approved',
      external_reference: `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `https://${event.headers.host}/api/mercadopago/webhook`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time,
        source: 'punto-legal-web',
        integration_type: 'netlify_function',
        mobile_compatible: 'true', // 🔧 CRÍTICO: Marcar como compatible con móvil
        auto_return_enabled: 'true', // 🔧 CRÍTICO: Confirmar auto_return habilitado
        platform: 'web_mobile' // 🔧 CRÍTICO: Identificar plataforma
      },
      statement_descriptor: 'PUNTO LEGAL'
    };
    
    console.log('📤 Enviando a MercadoPago API...');
    
    // Llamar a la API real de MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
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
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        preference_id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point
      }),
    };
    
  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      }),
    };
  }
};
