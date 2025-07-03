// Configuración para pasarelas de pago
export const PAYMENT_CONFIG = {
  // WebPay (Transbank) - Pasarela principal en Chile
  webpay: {
    commerceCode: process.env.VITE_WEBPAY_COMMERCE_CODE || '597055555532',
    apiKey: process.env.VITE_WEBPAY_API_KEY || '',
    environment: process.env.VITE_WEBPAY_ENVIRONMENT || 'integration', // 'integration' | 'production'
    returnUrl: process.env.VITE_WEBPAY_RETURN_URL || 'http://localhost:8080/payment/success',
    cancelUrl: process.env.VITE_WEBPAY_CANCEL_URL || 'http://localhost:8080/payment/cancel',
  },
  
  // PayPal - Pasarela internacional
  paypal: {
    clientId: process.env.VITE_PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.VITE_PAYPAL_CLIENT_SECRET || '',
    environment: process.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox', // 'sandbox' | 'production'
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