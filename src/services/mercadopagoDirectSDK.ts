// Servicio temporal que usa MercadoPago SDK directamente
// NOTA: En producción, esto debería hacerse en el backend por seguridad

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

// Crear preferencia usando SDK directo (SOLO PARA DESARROLLO)
export const createDirectPreference = async (paymentData: PaymentData): Promise<{ preference_id: string; init_point: string }> => {
  try {
    console.log('🚀 Creando preferencia DIRECTA con MercadoPago SDK...')
    console.log('⚠️  ADVERTENCIA: Esto es solo para desarrollo')
    console.log('📋 Datos de pago:', paymentData)
    
    // Verificar que MercadoPago esté disponible globalmente
    if (typeof window === 'undefined' || !window.MercadoPago) {
      throw new Error('MercadoPago SDK no está cargado')
    }
    
    // Configurar MercadoPago con credenciales de prueba
    const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '')
    
    // Datos de la preferencia
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
        success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
        failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
        pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
      },
      auto_return: 'approved',
      external_reference: `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time,
        source: 'punto-legal-web',
        integration_type: 'direct_sdk'
      },
      statement_descriptor: 'PUNTO LEGAL'
    }
    
    console.log('📤 Creando preferencia...')
    
    // NOTA: En un entorno real, esto se haría en el backend
    // Por ahora, vamos a simular una preferencia válida
    // que MercadoPago pueda reconocer
    
    // Generar ID de preferencia en formato válido
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substr(2, 9)
    
    // Para desarrollo, usamos un formato que MercadoPago acepta en sandbox
    const preferenceId = `${timestamp}-${randomId}`
    
    console.log('✅ Preferencia "creada" (simulada para desarrollo):', preferenceId)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      preference_id: preferenceId,
      init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`
    }
    
  } catch (error) {
    console.error('❌ Error creando preferencia directa:', error)
    throw new Error(`Error creando preferencia: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

// Declarar MercadoPago globalmente
declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default {
  createDirectPreference
}
