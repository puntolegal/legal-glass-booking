// Servicio directo de MercadoPago - Sin Edge Function
// Usa la API de MercadoPago directamente desde el frontend

import { SITE_ORIGIN } from "@/config/siteUrl";

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
// Función de validación para prevenir errores PXI03
const validatePreferenceData = (data: MercadoPagoPreferenceData): void => {
  const errors: string[] = [];
  
  console.log('🔍 VALIDANDO DATOS DE PREFERENCIA (Prevención PXI03):');
  
  // Detectar dispositivo para validación específica
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log(`📱 Validación para: ${isMobile ? 'MÓVIL' : 'PC'}`);
  
  // Validar items
  if (!data.items || data.items.length === 0) {
    errors.push('Items requeridos');
  } else {
    data.items.forEach((item, index) => {
      if (!item.title || item.title.trim() === '') {
        errors.push(`Item ${index + 1}: Título requerido`);
      }
      if (!item.unit_price || item.unit_price <= 0) {
        errors.push(`Item ${index + 1}: Precio debe ser mayor a 0`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Cantidad debe ser mayor a 0`);
      }
      if (!item.currency_id || item.currency_id !== 'CLP') {
        errors.push(`Item ${index + 1}: Currency_id debe ser 'CLP'`);
      }
      
      // 🔧 VALIDACIÓN ESPECÍFICA MÓVIL: Verificar category_id
      if (isMobile && item.category_id === 'services_legal') {
        console.warn(`⚠️ MÓVIL: category_id "services_legal" puede causar PXI03, se cambiará a "services"`);
      }
    });
  }
  
  // Validar payer
  if (!data.payer) {
    errors.push('Payer requerido');
  } else {
    if (!data.payer.email || !data.payer.email.includes('@')) {
      errors.push('Email del pagador inválido');
    }
    if (!data.payer.name || data.payer.name.trim() === '') {
      errors.push('Nombre del pagador requerido');
    }
  }
  
  // Validar URLs de retorno
  if (!data.back_urls) {
    errors.push('Back URLs requeridas');
  } else {
    if (!data.back_urls.success || !data.back_urls.success.includes('puntolegal.online')) {
      errors.push('URL de éxito inválida');
    }
    if (!data.back_urls.failure || !data.back_urls.failure.includes('puntolegal.online')) {
      errors.push('URL de fallo inválida');
    }
    if (!data.back_urls.pending || !data.back_urls.pending.includes('puntolegal.online')) {
      errors.push('URL de pendiente inválida');
    }
  }
  
  // Validar external_reference
  if (!data.external_reference || data.external_reference.trim() === '') {
    errors.push('External reference requerido');
  }
  
  // Validar auto_return
  if (data.auto_return !== 'approved') {
    errors.push('Auto return debe ser "approved"');
  }
  
  if (errors.length > 0) {
    console.error('❌ ERROR PXI03 PREVENIDO - Datos inválidos:', errors);
    throw new Error(`Datos inválidos para prevenir PXI03: ${errors.join(', ')}`);
  }
  
  console.log('✅ Validación PXI03 exitosa - Datos válidos');
};

export async function createMercadoPagoPreferenceDirect(
  preferenceData: MercadoPagoPreferenceData
): Promise<MercadoPagoPreferenceResponse> {
  try {
    console.log('🚀 Creando preferencia DIRECTAMENTE con MercadoPago API...');
    console.log('📋 Datos de la preferencia:', preferenceData);

    // 🔧 VALIDACIÓN PXI03: Validar datos antes de enviar
    validatePreferenceData(preferenceData);

    // ❌ ERROR: MERCADOPAGO_ACCESS_TOKEN debe usarse solo en Supabase Edge Functions
    console.error('❌ createMercadoPagoPreferenceDirect debe llamarse desde Edge Function');
    
    return {
      success: false,
      error: 'MercadoPago preference creation must be done from backend (Edge Function). Use Supabase Edge Function instead.'
    };
    
    /* Esta función debe moverse a una Edge Function
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` // Solo disponible en backend
      },
      body: JSON.stringify(preferenceData)
    });
    */

    /* Código debe ejecutarse en backend
    console.log('📤 Respuesta de MercadoPago:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error API MercadoPago:', response.status, errorText);
      
      // 🔧 DETECCIÓN ESPECÍFICA DE ERROR PXI03
      if (errorText.includes('PXI03') || errorText.includes('PXI')) {
        console.error('🚨 ERROR PXI03 DETECTADO:', errorText);
        console.error('📋 Datos que causaron el error:', preferenceData);
        
        return {
          success: false,
          error: `Error PXI03 detectado: ${errorText}. Datos validados pero rechazados por MercadoPago.`
        };
      }
      
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

    */
  } catch (error) {
    console.error('❌ Error creando preferencia directa:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Función para detectar si es dispositivo móvil
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

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
  // Detectar si es móvil
  const isMobile = isMobileDevice();
  console.log(`📱 Dispositivo detectado: ${isMobile ? 'MÓVIL' : 'PC'}`);
  
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
      // 🔧 AJUSTE MÓVIL: Usar categoría genérica en móvil para evitar PXI03
      category_id: isMobile ? 'services' : 'services_legal',
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
          // 🔧 AJUSTE MÓVIL: Usar área automática en móvil
          area_code: isMobile ? (phoneNumber.startsWith('56') ? '56' : '56') : areaCode
        } 
      }),
      identification: {
        // 🔧 AJUSTE MÓVIL: Usar DNI en móvil para evitar PXI03
        type: isMobile ? 'DNI' : 'RUT',
        number: '12345678-9' // Placeholder - se puede mejorar con datos reales
      }
    },
    back_urls: {
      success: `${SITE_ORIGIN}/payment-success?source=mercadopago`,
      failure: `${SITE_ORIGIN}/payment-failure?source=mercadopago`,
      pending: `${SITE_ORIGIN}/payment-pending?source=mercadopago`,
    },
    auto_return: 'approved',
    external_reference: externalReference,
    notification_url: `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook`,
    // 🔧 AJUSTE MÓVIL: Metadata limpia para evitar PXI03
    ...(metadata && { 
      metadata: isMobile ? {
        // Solo metadata esencial para móvil
        service_type: service,
        source: 'web',
        ...metadata
      } : metadata
    })
  };
}

export default {
  createMercadoPagoPreferenceDirect,
  createStandardPreferenceData
};
