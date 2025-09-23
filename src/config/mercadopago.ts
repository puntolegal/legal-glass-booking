// Configuración oficial de MercadoPago - Punto Legal
export const MERCADOPAGO_CONFIG = {
  // Credenciales oficiales de PRODUCCIÓN - Mercado Pago Punto Legal
  publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '',
  accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || '',
  
  // Configuración regional
  locale: 'es-CL',
  currency: 'CLP',
  
  // URLs de retorno (actualizadas para puerto 8081)
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
