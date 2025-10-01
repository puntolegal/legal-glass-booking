// Configuración para pasarelas de pago
export const PAYMENT_CONFIG = {
  // WebPay (Transbank) - Pasarela principal en Chile
  webpay: {
    commerceCode: import.meta.env.VITE_WEBPAY_COMMERCE_CODE || '597055555532',
    // ❌ REMOVIDO: API key no debe estar en el frontend
    // apiKey: import.meta.env.VITE_WEBPAY_API_KEY || '',
    environment: import.meta.env.VITE_WEBPAY_ENVIRONMENT || 'integration', // 'integration' | 'production'
    returnUrl: import.meta.env.VITE_WEBPAY_RETURN_URL || 'http://localhost:8080/payment/success',
    cancelUrl: import.meta.env.VITE_WEBPAY_CANCEL_URL || 'http://localhost:8080/payment/cancel',
  },
  
  // PayPal - Pasarela internacional
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    // ❌ REMOVIDO: Client secret no debe estar en el frontend
    // clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET || '',
    environment: import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox', // 'sandbox' | 'production'
    currency: 'CLP',
  },
  
  // Configuración general
  currency: 'CLP',
  taxRate: 0.19, // IVA 19%
  baseAmount: 15000, // $15.000 CLP
};

// Tipos para los métodos de pago
export type PaymentMethod = 'webpay' | 'paypal';

// Interfaz para la respuesta de pago
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  timestamp: Date;
  error?: string;
}

// Función para calcular el total con IVA
export const calculateTotal = (baseAmount: number): number => {
  return Math.round(baseAmount * (1 + PAYMENT_CONFIG.taxRate));
};

// Función para formatear moneda chilena
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// URLs de las APIs de pago
export const PAYMENT_URLS = {
  webpay: {
    integration: 'https://webpay3gint.transbank.cl',
    production: 'https://webpay3g.transbank.cl',
  },
  paypal: {
    sandbox: 'https://www.sandbox.paypal.com',
    production: 'https://www.paypal.com',
  },
}; 