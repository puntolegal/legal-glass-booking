// Configuración oficial de MercadoPago - Punto Legal
// Valores de fallback para producción
const FALLBACK_PUBLIC_KEY = 'APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e';
const FALLBACK_ACCESS_TOKEN = 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947';

// Debug: Verificar configuración de MercadoPago
console.log('🔍 DEBUG MercadoPago Config:');
console.log('VITE_MERCADOPAGO_PUBLIC_KEY:', import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY ? 'Configurado' : 'No configurado');
console.log('VITE_MERCADOPAGO_ACCESS_TOKEN:', import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN ? 'Configurado' : 'No configurado');
console.log('FALLBACK_PUBLIC_KEY:', FALLBACK_PUBLIC_KEY ? 'Configurado' : 'No configurado');
console.log('FALLBACK_ACCESS_TOKEN:', FALLBACK_ACCESS_TOKEN ? 'Configurado' : 'No configurado');

export const MERCADOPAGO_CONFIG = {
  // Credenciales oficiales de PRODUCCIÓN - Mercado Pago Punto Legal
  publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || FALLBACK_PUBLIC_KEY,
  accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || FALLBACK_ACCESS_TOKEN,
  
  // Configuración regional
  locale: 'es-CL',
  currency: 'CLP',
  
  // URLs de retorno (configuradas para puerto 8081)
  urls: {
    success: `http://localhost:8081/payment-success`,
    failure: `http://localhost:8081/payment-failure`,
    pending: `http://localhost:8081/payment-pending`
  },
  
  // Configuración de la empresa
  business: {
    name: 'Punto Legal',
    email: 'puntolegalelgolf@gmail.com',
    phone: '+56962321883',
    address: 'El Golf, Las Condes, Santiago'
  },
  
  // Límites y validaciones
  limits: {
    minAmount: 1000, // CLP
    maxAmount: 10000000, // CLP
    maxInstallments: 12
  },
  
  // Configuración de notificaciones
  notifications: {
    webhookUrl: `${window.location.origin}/api/mercadopago/webhook`
  }
};

// Tipos de pago soportados
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash'
};

// Estados de pago
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  AUTHORIZED: 'authorized',
  IN_PROCESS: 'in_process',
  IN_MEDIATION: 'in_mediation',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  CHARGED_BACK: 'charged_back'
};

// Configuración de sandbox/producción
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_SANDBOX = !IS_PRODUCTION;

// URLs de la API
export const API_URLS = {
  sandbox: 'https://api.mercadopago.com/sandbox',
  production: 'https://api.mercadopago.com'
};

export default MERCADOPAGO_CONFIG;
