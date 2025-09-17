// Servicio real de MercadoPago usando su API oficial
// Este reemplaza el backend simulado

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

// Crear preferencia usando la API real de MercadoPago
export const createRealPreference = async (paymentData: PaymentData): Promise<{ preference_id: string; init_point: string }> => {
  try {
    console.log('🚀 Creando preferencia REAL con MercadoPago API...');
    
    // En un entorno real, esto se haría en el backend
    // Por ahora, vamos a usar un approach diferente
    
    // Generar un ID único para la preferencia
    const preferenceId = `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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
      external_reference: preferenceId,
      notification_url: `${window.location.origin}/api/mercadopago/webhook`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time
      },
      statement_descriptor: 'PUNTO LEGAL'
    };
    
    console.log('📋 Datos de preferencia preparados:', preferenceData);
    
    // Llamar a la API real de MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.MERCADOPAGO_ACCESS_TOKEN}`
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
    console.error('❌ Error creando preferencia real:', error);
    throw new Error(`Error creando preferencia: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Verificar estado de un pago
export const getPaymentStatus = async (paymentId: string) => {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.MERCADOPAGO_ACCESS_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error obteniendo estado del pago:', error);
    throw error;
  }
};

export default {
  createRealPreference,
  getPaymentStatus
};
