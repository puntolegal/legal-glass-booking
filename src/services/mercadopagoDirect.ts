// Servicio directo de MercadoPago - Sin Edge Function
// Usa la API de MercadoPago directamente desde el frontend

export interface MercadoPagoPreferenceData {
  items: Array<{
    id?: string;
    title: string;
    description?: string;
    category_id?: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }>;
  payer: {
    name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: {
      number: string;
      area_code?: string;
    };
    identification?: {
      type: string;
      number: string;
    };
    address?: {
      street_name: string;
      street_number: number;
      zip_code: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: 'approved';
  external_reference: string;
  notification_url?: string;
  metadata?: Record<string, any>;
}

export interface MercadoPagoPreferenceResponse {
  success: boolean;
  preference_id?: string;
  init_point?: string;
  sandbox_init_point?: string;
  status?: string;
  live_mode?: boolean;
  error?: string;
}

// Crear preferencia directamente con la API de MercadoPago
export async function createMercadoPagoPreferenceDirect(
  preferenceData: MercadoPagoPreferenceData
): Promise<MercadoPagoPreferenceResponse> {
  try {
    console.log('🚀 Creando preferencia DIRECTAMENTE con MercadoPago API...');
    console.log('📋 Datos de la preferencia:', preferenceData);

    // Usar token de acceso de MercadoPago
    const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947';

    // Llamada directa a la API REST de MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    });

    console.log('📤 Respuesta de MercadoPago:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error API MercadoPago:', response.status, errorText);
      
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`
      };
    }

    const result = await response.json();

    console.log('✅ Preferencia creada exitosamente:', result.id);
    console.log('🔍 Resultado completo de MercadoPago:', JSON.stringify(result, null, 2));
    console.log('🔗 Init Point:', result.init_point);
    console.log('🔗 Sandbox Init Point:', result.sandbox_init_point);
    console.log('🔍 Status de la preferencia:', result.status);
    console.log('🔍 Modo de la preferencia:', result.live_mode ? 'Producción' : 'Sandbox');

    // Verificar que los campos necesarios estén presentes
    if (!result.id) {
      console.error('❌ ERROR: result.id no está presente');
      throw new Error('ID de preferencia no recibido de MercadoPago');
    }

    if (!result.init_point) {
      console.error('❌ ERROR: result.init_point no está presente');
      throw new Error('Init Point no recibido de MercadoPago');
    }

    return {
      success: true,
      preference_id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      status: result.status,
      live_mode: result.live_mode
    };

  } catch (error) {
    console.error('❌ Error creando preferencia directa:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Función helper para crear datos de preferencia estándar con campos optimizados
export function createStandardPreferenceData(
  service: string,
  price: number,
  payerName: string,
  payerEmail: string,
  externalReference: string,
  phone?: string,
  metadata?: Record<string, any>
): MercadoPagoPreferenceData {
  // Separar nombre en first_name y last_name para mejor aprobación
  const nameParts = payerName.trim().split(' ');
  const firstName = nameParts[0] || payerName;
  const lastName = nameParts.slice(1).join(' ') || firstName;

  // Extraer código de área del teléfono si está disponible
  const phoneNumber = phone?.replace(/\D/g, '') || '';
  const areaCode = phoneNumber.startsWith('56') ? '56' : '56'; // Chile por defecto
  const number = phoneNumber.replace(/^56/, '') || phoneNumber;

  return {
    items: [{
      id: `servicio_legal_${service.toLowerCase().replace(/\s+/g, '_')}`,
      title: `${service} - Punto Legal`,
      description: `Consulta legal especializada: ${service}. Servicio profesional de asesoría jurídica.`,
      category_id: 'services_legal', // Categoría para servicios legales
      quantity: 1,
      unit_price: price,
      currency_id: 'CLP'
    }],
    payer: {
      name: payerName,
      first_name: firstName,
      last_name: lastName,
      email: payerEmail,
      ...(phone && { 
        phone: { 
          number: number,
          area_code: areaCode
        } 
      }),
      identification: {
        type: 'RUT',
        number: '12345678-9' // Placeholder - se puede mejorar con datos reales
      }
    },
    back_urls: {
      success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
      failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
      pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
    },
    auto_return: 'approved',
    external_reference: externalReference,
    notification_url: `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook`,
    ...(metadata && { metadata })
  };
}

export default {
  createMercadoPagoPreferenceDirect,
  createStandardPreferenceData
};
