// Servicio para obtener información de pagos de MercadoPago
// Versión corregida que no depende de localhost

export interface MercadoPagoPaymentInfo {
  id: string;
  status: string;
  transaction_amount: number;
  description: string;
  external_reference: string;
  payment_method_id: string;
  payment_type_id: string;
  date_approved: string;
  date_created: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface PaymentInfoResponse {
  success: boolean;
  payment?: MercadoPagoPaymentInfo;
  error?: string;
}

// Obtener información de pago directamente de MercadoPago
export async function getMercadoPagoPaymentInfo(paymentId: string): Promise<PaymentInfoResponse> {
  try {
    console.log('🔍 Obteniendo información del pago desde MercadoPago:', paymentId);

    // Usar token de acceso de MercadoPago directamente
    // ❌ REMOVIDO: Access token no debe estar en el frontend
    // const MERCADOPAGO_ACCESS_TOKEN = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📤 Respuesta de MercadoPago Payment API:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error consultando API de MercadoPago:', response.status, errorText);
      
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`
      };
    }

    const paymentInfo = await response.json();

    console.log('✅ Información de pago obtenida:', paymentInfo);
    console.log('🔍 Status del pago:', paymentInfo.status);
    console.log('🔍 Amount:', paymentInfo.transaction_amount);
    console.log('🔍 External Reference:', paymentInfo.external_reference);

    return {
      success: true,
      payment: {
        id: paymentInfo.id,
        status: paymentInfo.status,
        transaction_amount: paymentInfo.transaction_amount,
        description: paymentInfo.description || 'Consulta Legal - Punto Legal',
        external_reference: paymentInfo.external_reference,
        payment_method_id: paymentInfo.payment_method_id,
        payment_type_id: paymentInfo.payment_type_id,
        date_approved: paymentInfo.date_approved,
        date_created: paymentInfo.date_created,
        payer: {
          email: paymentInfo.payer?.email || '',
          identification: {
            type: paymentInfo.payer?.identification?.type || '',
            number: paymentInfo.payer?.identification?.number || ''
          }
        }
      }
    };

  } catch (error) {
    console.error('❌ Error obteniendo información de pago:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Función helper para crear datos simulados si falla la API
export function createMockPaymentInfo(paymentId: string): MercadoPagoPaymentInfo {
  console.log('⚠️ Usando datos simulados para el pago:', paymentId);
  
  return {
    id: paymentId,
    status: 'approved',
    transaction_amount: 35000,
    description: 'Consulta Legal - Punto Legal',
    external_reference: `PL-${Date.now()}`,
    payment_method_id: 'account_money',
    payment_type_id: 'account_money',
    date_approved: new Date().toISOString(),
    date_created: new Date().toISOString(),
    payer: {
      email: 'cliente@puntolegal.online',
      identification: {
        type: 'DNI',
        number: '12345678'
      }
    }
  };
}

export default {
  getMercadoPagoPaymentInfo,
  createMockPaymentInfo
};
