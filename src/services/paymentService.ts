import { PAYMENT_CONFIG, PAYMENT_URLS, PaymentMethod, PaymentResponse } from '@/config/payment';

// Servicio para manejar pagos
export class PaymentService {
  
  // Iniciar pago con WebPay
  static async initiateWebPayPayment(amount: number, orderId: string, description: string): Promise<PaymentResponse> {
    try {
      const totalAmount = Math.round(amount * (1 + PAYMENT_CONFIG.taxRate));
      
      // En producción, aquí harías la llamada real a la API de WebPay
      const webpayData = {
        amount: totalAmount,
        commerce_code: PAYMENT_CONFIG.webpay.commerceCode,
        buy_order: orderId,
        session_id: `session_${Date.now()}`,
        return_url: PAYMENT_CONFIG.webpay.returnUrl,
        cancel_url: PAYMENT_CONFIG.webpay.cancelUrl,
      };

      console.log('Iniciando pago WebPay:', webpayData);
      
      // Simular respuesta de WebPay
      const mockResponse = {
        success: true,
        transactionId: `webpay_${Date.now()}`,
        amount: totalAmount,
        currency: PAYMENT_CONFIG.currency,
        method: 'webpay' as PaymentMethod,
        timestamp: new Date(),
        url: `${PAYMENT_URLS.webpay[PAYMENT_CONFIG.webpay.environment]}/webpay/init`,
        token: `token_${Date.now()}`,
      };

      return mockResponse;
    } catch (error) {
      console.error('Error iniciando pago WebPay:', error);
      return {
        success: false,
        amount,
        currency: PAYMENT_CONFIG.currency,
        method: 'webpay',
        timestamp: new Date(),
        error: 'Error al iniciar el pago con WebPay',
      };
    }
  }

  // Iniciar pago con PayPal
  static async initiatePayPalPayment(amount: number, orderId: string, description: string): Promise<PaymentResponse> {
    try {
      const totalAmount = Math.round(amount * (1 + PAYMENT_CONFIG.taxRate));
      
      // En producción, aquí harías la llamada real a la API de PayPal
      const paypalData = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: PAYMENT_CONFIG.currency,
            value: (totalAmount / 100).toFixed(2), // PayPal espera el valor en formato decimal
          },
          description,
          custom_id: orderId,
        }],
        application_context: {
          return_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
        },
      };

      console.log('Iniciando pago PayPal:', paypalData);
      
      // Simular respuesta de PayPal
      const mockResponse = {
        success: true,
        transactionId: `paypal_${Date.now()}`,
        amount: totalAmount,
        currency: PAYMENT_CONFIG.currency,
        method: 'paypal' as PaymentMethod,
        timestamp: new Date(),
        approvalUrl: `${PAYMENT_URLS.paypal[PAYMENT_CONFIG.paypal.environment]}/checkoutnow?token=EC_${Date.now()}`,
      };

      return mockResponse;
    } catch (error) {
      console.error('Error iniciando pago PayPal:', error);
      return {
        success: false,
        amount,
        currency: PAYMENT_CONFIG.currency,
        method: 'paypal',
        timestamp: new Date(),
        error: 'Error al iniciar el pago con PayPal',
      };
    }
  }

  // Verificar estado de pago
  static async verifyPayment(transactionId: string, method: PaymentMethod): Promise<PaymentResponse> {
    try {
      console.log(`Verificando pago ${method}:`, transactionId);
      
      // Simular verificación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        transactionId,
        amount: PAYMENT_CONFIG.baseAmount * (1 + PAYMENT_CONFIG.taxRate),
        currency: PAYMENT_CONFIG.currency,
        method,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error verificando pago:', error);
      return {
        success: false,
        amount: PAYMENT_CONFIG.baseAmount,
        currency: PAYMENT_CONFIG.currency,
        method,
        timestamp: new Date(),
        error: 'Error al verificar el pago',
      };
    }
  }

  // Generar ID único para la orden
  static generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validar datos de pago
  static validatePaymentData(amount: number, description: string): boolean {
    return amount > 0 && description.length > 0;
  }
}

// Hook personalizado para manejar pagos
export const usePayment = () => {
  const processPayment = async (
    method: PaymentMethod,
    amount: number,
    description: string
  ): Promise<PaymentResponse> => {
    const orderId = PaymentService.generateOrderId();
    
    if (!PaymentService.validatePaymentData(amount, description)) {
      return {
        success: false,
        amount,
        currency: PAYMENT_CONFIG.currency,
        method,
        timestamp: new Date(),
        error: 'Datos de pago inválidos',
      };
    }

    try {
      let response: PaymentResponse;
      
      if (method === 'webpay') {
        response = await PaymentService.initiateWebPayPayment(amount, orderId, description);
      } else {
        response = await PaymentService.initiatePayPalPayment(amount, orderId, description);
      }

      if (response.success) {
        // Redirigir al usuario a la pasarela de pago
        if (method === 'webpay' && 'url' in response && typeof response.url === 'string') {
          // Para WebPay, redirigir a la URL de pago
          window.location.href = response.url;
        } else if (method === 'paypal' && 'approvalUrl' in response && typeof response.approvalUrl === 'string') {
          // Para PayPal, abrir en nueva ventana
          window.open(response.approvalUrl, '_blank');
        }
      }

      return response;
    } catch (error) {
      console.error('Error procesando pago:', error);
      return {
        success: false,
        amount,
        currency: PAYMENT_CONFIG.currency,
        method,
        timestamp: new Date(),
        error: 'Error al procesar el pago',
      };
    }
  };

  return { processPayment };
}; 