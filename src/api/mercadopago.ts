// API para MercadoPago - Backend
// Maneja la creación de preferencias de pago de forma segura

interface PaymentData {
  amount: number;
  description: string;
  external_reference?: string;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export class MercadoPagoAPI {
  private accessToken: string;
  private baseUrl: string;

  constructor() {
    // Solo usar en el backend - nunca en el frontend
    this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.mercadopago.com' 
      : 'https://api.mercadopago.com/sandbox';
  }

  async createPreference(paymentData: PaymentData): Promise<MercadoPagoPreference> {
    const preference = {
      items: [
        {
          title: paymentData.description,
          quantity: 1,
          unit_price: paymentData.amount,
          currency_id: 'CLP'
        }
      ],
      back_urls: {
        success: process.env.SUCCESS_URL || `https://www.puntolegal.online/payment-success?source=mercadopago`,
        failure: process.env.FAILURE_URL || `https://www.puntolegal.online/payment-failure?source=mercadopago`,
        pending: process.env.PENDING_URL || `https://www.puntolegal.online/payment-pending?source=mercadopago`
      },
      auto_return: 'approved',
      external_reference: paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: process.env.MP_WEBHOOK_URL,
      payer: paymentData.customer ? {
        name: paymentData.customer.name,
        email: paymentData.customer.email,
        phone: paymentData.customer.phone ? {
          number: paymentData.customer.phone
        } : undefined
      } : undefined
    };

    const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error creando preferencia: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  async getPayment(paymentId: string) {
    const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo pago: ${response.status}`);
    }

    return await response.json();
  }
}

// Función helper para crear preferencia desde el frontend
export async function createPaymentPreference(paymentData: PaymentData): Promise<MercadoPagoPreference> {
  const response = await fetch('/api/mercadopago/create-preference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error creando preferencia de pago');
  }

  return await response.json();
}