// Configuración oficial de MercadoPago - Punto Legal  
// Solo variables VITE_ (públicas) en el frontend

// Configuración del frontend (solo variables públicas)
const MERCADOPAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
const APP_URL = import.meta.env.VITE_APP_URL || import.meta.env.VITE_APP_BASE_URL;
const APP_NAME = import.meta.env.VITE_APP_NAME || 'Punto Legal';

export const MERCADOPAGO_CONFIG = {
  // ✅ SEGURO - Solo claves públicas para el frontend
  publicKey: MERCADOPAGO_PUBLIC_KEY,
  // ❌ REMOVIDO - accessToken no debe estar en el frontend
  
  // Configuración regional
  locale: 'es-CL',
  currency: 'CLP',
  
  // URLs de retorno (configuradas en el backend)
  urls: {
    success: `${APP_URL}/payment-success?source=mercadopago`,
    failure: `${APP_URL}/payment-failure?source=mercadopago`,
    pending: `${APP_URL}/payment-pending?source=mercadopago`
  },
  
  // Configuración de la empresa
  business: {
    name: APP_NAME,
    email: import.meta.env.VITE_ADMIN_EMAIL || 'puntolegalelgolf@gmail.com',
    phone: '+56962321883',
    address: 'El Golf, Las Condes, Santiago'
  },
  
  // Límites y validaciones
  limits: {
    minAmount: 1000, // CLP
    maxAmount: 10000000, // CLP
    maxInstallments: 12
  },
  
  // Configuración de notificaciones (webhook se maneja en Supabase Edge Function)
  notifications: {
    webhookUrl: `${import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co'}/functions/v1/mercadopago-webhook`
  },
  
  // Información del entorno
  environment: import.meta.env.PROD ? 'production' : 'sandbox'
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
