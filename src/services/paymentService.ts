import { ServicePricing } from '@/config/pricing';

export interface PaymentData {
  service: ServicePricing;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    rut: string;
  };
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  redirectUrl?: string;
  error?: string;
}

export type PaymentMethod = 'webpay' | 'transfer' | 'paypal';

// Servicio para manejar pagos
export class PaymentService {
  private static instance: PaymentService;
  
  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Procesar pago con WebPay (Transbank)
  async processWebPayPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      // Aquí iría la integración real con WebPay
      console.log('Procesando pago con WebPay:', paymentData);
      
      // Simular respuesta de WebPay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        transactionId: `WEBPAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Pago procesado exitosamente con WebPay',
        redirectUrl: `/payment-success/${paymentData.service.id}`
      };
    } catch (error) {
      console.error('Error en WebPay:', error);
      return {
        success: false,
        message: 'Error al procesar el pago con WebPay',
        error: 'Error al procesar el pago con WebPay'
      };
    }
  }

  // Procesar pago con Transferencia Bancaria
  async processBankTransferPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      console.log('Procesando pago por transferencia bancaria:', paymentData);
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        transactionId: `TRANSFER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Instrucciones de transferencia enviadas',
        redirectUrl: `/payment-success/${paymentData.service.id}`
      };
    } catch (error) {
      console.error('Error en transferencia bancaria:', error);
      return {
        success: false,
        message: 'Error al procesar la transferencia bancaria',
        error: 'Error al procesar la transferencia bancaria'
      };
    }
  }

  // Procesar pago con PayPal
  async processPayPalPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      console.log('Procesando pago con PayPal:', paymentData);
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      return {
        success: true,
        transactionId: `PAYPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Pago procesado exitosamente con PayPal',
        redirectUrl: `/payment-success/${paymentData.service.id}`
      };
    } catch (error) {
      console.error('Error en PayPal:', error);
      return {
        success: false,
        message: 'Error al procesar el pago con PayPal',
        error: 'Error al procesar el pago con PayPal'
      };
    }
  }

  // Procesar pago según el método seleccionado
  async processPayment(paymentData: PaymentData, method: PaymentMethod): Promise<PaymentResponse> {
    switch (method) {
      case 'webpay':
        return this.processWebPayPayment(paymentData);
      case 'transfer':
        return this.processBankTransferPayment(paymentData);
      case 'paypal':
        return this.processPayPalPayment(paymentData);
      default:
        return {
          success: false,
          message: 'Método de pago no válido',
          error: 'Método de pago no válido'
        };
  }
}

  // Validar datos del cliente
  validateCustomerData(customer: PaymentData['customer']): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!customer.firstName.trim()) errors.push('El nombre es requerido');
    if (!customer.lastName.trim()) errors.push('El apellido es requerido');
    if (!customer.email.trim()) errors.push('El email es requerido');
    if (!this.isValidEmail(customer.email)) errors.push('El email no es válido');
    if (!customer.phone.trim()) errors.push('El teléfono es requerido');
    if (!customer.rut.trim()) errors.push('El RUT es requerido');
    if (!this.isValidRUT(customer.rut)) errors.push('El RUT no es válido');

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validar email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar RUT chileno
  private isValidRUT(rut: string): boolean {
    // Eliminar puntos y guión
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
    
    if (cleanRut.length < 2) return false;
    
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();
    
    // Validar que el cuerpo sea numérico
    if (!/^\d+$/.test(body)) return false;
    
    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedDV = 11 - (sum % 11);
    let calculatedDV: string;
    
    if (expectedDV === 11) calculatedDV = '0';
    else if (expectedDV === 10) calculatedDV = 'K';
    else calculatedDV = expectedDV.toString();
    
    return dv === calculatedDV;
  }

  // Obtener métodos de pago disponibles
  getAvailablePaymentMethods(): Array<{
    id: PaymentMethod;
    name: string;
    description: string;
    icon: string;
    processingTime: string;
  }> {
    return [
      {
        id: 'webpay',
        name: 'WebPay',
        description: 'Tarjeta de crédito/débito',
        icon: '💳',
        processingTime: 'Inmediato'
      },
      {
        id: 'transfer',
        name: 'Transferencia Bancaria',
        description: 'Transferencia desde tu banco',
        icon: '🏦',
        processingTime: '1-2 días hábiles'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pago con PayPal',
        icon: '🔵',
        processingTime: 'Inmediato'
      }
    ];
    }
}

export default PaymentService.getInstance(); 

// Hook for React components
import { useState } from 'react';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentService = PaymentService.getInstance();

  const processPayment = async (method: PaymentMethod, amount: number, description: string) => {
    setIsProcessing(true);
    try {
      const paymentData: PaymentData = {
        service: { id: 'generic', name: description, price: amount },
        customer: {
          firstName: 'Cliente',
          lastName: 'Test',
          email: 'test@example.com',
          phone: '+56912345678',
          rut: '12345678-9'
        },
        amount,
        currency: 'CLP'
      } as any;

      const result = await paymentService.processPayment(paymentData, method);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
    validateCustomerData: paymentService.validateCustomerData.bind(paymentService),
    getAvailablePaymentMethods: paymentService.getAvailablePaymentMethods.bind(paymentService)
  };
};