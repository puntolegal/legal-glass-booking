// Configuración oficial de MercadoPago - Punto Legal  
// Usar esquema de validación de entorno
import { getMercadoPagoEnv, getMpAccessToken, getMpPublicKey, getReturnUrls, getWebhookUrl } from './env.schema';

// Determinar entorno automáticamente
const MP_ENV = getMercadoPagoEnv();
const MERCADOPAGO_ACCESS_TOKEN = getMpAccessToken();
const MERCADOPAGO_PUBLIC_KEY = getMpPublicKey();

export const MERCADOPAGO_CONFIG = {
  // Credenciales oficiales de PRODUCCIÓN - Mercado Pago Punto Legal
  publicKey: MERCADOPAGO_PUBLIC_KEY,
  accessToken: MERCADOPAGO_ACCESS_TOKEN,
  
  // Configuración regional
  locale: 'es-CL',
  currency: 'CLP',
  
  // URLs de retorno dinámicas según entorno
  urls: getReturnUrls(),
  
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
    webhookUrl: getWebhookUrl()
  },
  
  // Información del entorno
  environment: MP_ENV
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
