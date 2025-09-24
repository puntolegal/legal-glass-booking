import { loadMercadoPago } from '@mercadopago/sdk-js';
import { MERCADOPAGO_CONFIG } from '@/config/mercadopago';

// Configuración de MercadoPago con fallback
const MP_PUBLIC_KEY = MERCADOPAGO_CONFIG.publicKey;

// Interfaz para los datos de pago
export interface PaymentData {
  amount: number;
  description: string;
  payer: {
    name: string;
    email: string;
    phone?: string;
  };
  metadata?: {
    reservation_id?: string;
    service_name?: string;
    appointment_date?: string;
    appointment_time?: string;
  };
}

// Interfaz para la respuesta de MercadoPago
export interface MercadoPagoResponse {
  id: string;
  status: string;
  detail: string;
  payment_method: {
    id: string;
    type: string;
  };
  transaction_amount: number;
  date_created: string;
}

// Clase para manejar MercadoPago
class MercadoPagoService {
  private mp: any = null;
  private isInitialized = false;

  // Inicializar MercadoPago
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.mp = await loadMercadoPago();
      
      if (!MP_PUBLIC_KEY) {
        throw new Error('VITE_MERCADOPAGO_PUBLIC_KEY no está configurada');
      }

      this.mp.configure({
        publicKey: MP_PUBLIC_KEY,
        locale: 'es-CL'
      });

      this.isInitialized = true;
      console.log('✅ MercadoPago inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando MercadoPago:', error);
      throw error;
    }
  }

  // Crear preferencia de pago
  async createPaymentPreference(paymentData: PaymentData): Promise<string> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const preference = {
        items: [
          {
            title: paymentData.description,
            quantity: 1,
            unit_price: paymentData.amount,
            currency_id: 'CLP'
          }
        ],
        payer: {
          name: paymentData.payer.name,
          email: paymentData.payer.email,
          phone: {
            number: paymentData.payer.phone || ''
          }
        },
        back_urls: {
          success: `${window.location.origin}/payment-success`,
          failure: `${window.location.origin}/payment-failure`,
          pending: `${window.location.origin}/payment-pending`
        },
        auto_return: 'approved',
        external_reference: paymentData.metadata?.reservation_id,
        metadata: paymentData.metadata,
        notification_url: `${window.location.origin}/api/mercadopago/webhook`,
        statement_descriptor: 'PUNTO LEGAL'
      };

      // Por ahora usar API simulada (en producción usar backend real)
      const { createPaymentPreference } = await import('@/api/mercadopago');
      const preferenceResponse = await createPaymentPreference(preference);
      
      return preferenceResponse.id;

    } catch (error) {
      console.error('❌ Error creando preferencia de pago:', error);
      throw error;
    }
  }

  // Procesar pago con tarjeta
  async processCardPayment(paymentData: PaymentData, cardToken: string): Promise<MercadoPagoResponse> {
    try {
      const paymentPayload = {
        transaction_amount: paymentData.amount,
        token: cardToken,
        description: paymentData.description,
        installments: 1,
        payment_method_id: 'visa', // Se detecta automáticamente
        payer: {
          email: paymentData.payer.email,
          first_name: paymentData.payer.name.split(' ')[0],
          last_name: paymentData.payer.name.split(' ').slice(1).join(' ') || 'Sin apellido'
        },
        metadata: paymentData.metadata
      };

      // Por ahora usar API simulada (en producción usar backend real)
      const { processPayment } = await import('@/api/mercadopago');
      const paymentResponse = await processPayment(paymentPayload);
      
      return paymentResponse;

    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      throw error;
    }
  }

  // Obtener métodos de pago disponibles
  async getPaymentMethods(): Promise<any[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const response = await this.mp.getPaymentMethods();
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo métodos de pago:', error);
      return [];
    }
  }

  // Crear token de tarjeta
  async createCardToken(cardData: any): Promise<string> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const response = await this.mp.createCardToken(cardData);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.id;
    } catch (error) {
      console.error('❌ Error creando token de tarjeta:', error);
      throw error;
    }
  }

  // Validar configuración
  isConfigured(): boolean {
    return !!MP_PUBLIC_KEY;
  }

  // Obtener public key
  getPublicKey(): string | undefined {
    return MP_PUBLIC_KEY;
  }
}

// Instancia singleton
export const mercadoPagoService = new MercadoPagoService();

// Funciones de utilidad
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000000; // Límite de MP en CLP
};

export default mercadoPagoService;
