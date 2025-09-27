// Esquema de validación de variables de entorno para MercadoPago
// Adaptado para Vite + React + Supabase Edge Functions

import { z } from "zod";

export const EnvSchema = z.object({
  // Entorno general
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MODE: z.enum(["development", "production"]).default("development"),
  
  // MercadoPago - Backend (secreto, solo servidor)
  MP_ACCESS_TOKEN_PROD: z.string().min(10, "Falta MP_ACCESS_TOKEN_PROD").optional(),
  MP_ACCESS_TOKEN_TEST: z.string().min(10, "Falta MP_ACCESS_TOKEN_TEST").optional(),
  MP_INTEGRATOR_ID: z.string().optional(),
  MP_WEBHOOK_URL: z.string().url().optional(),

  // MercadoPago - Frontend (público/cliente) - Vite
  VITE_MP_PUBLIC_KEY_PROD: z.string().min(5).optional(),
  VITE_MP_PUBLIC_KEY_TEST: z.string().min(5).optional(),

  // URLs del sitio
  VITE_APP_BASE_URL: z.string().url().optional(),
  VITE_SUCCESS_URL: z.string().url().optional(),
  VITE_FAILURE_URL: z.string().url().optional(),
  VITE_PENDING_URL: z.string().url().optional(),

  // Supabase
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(10).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10).optional(),

  // Resend
  RESEND_API_KEY: z.string().min(10).optional(),
  MAIL_FROM: z.string().email().optional(),
  ADMIN_EMAIL: z.string().email().optional(),

  // Edge Functions
  EDGE_ADMIN_TOKEN: z.string().min(10).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

// Función para determinar el entorno de MercadoPago
export function getMercadoPagoEnv(): 'sandbox' | 'production' {
  // Prioridad 1: Variable de entorno explícita
  if (import.meta.env.VITE_MERCADOPAGO_ENV) {
    return import.meta.env.VITE_MERCADOPAGO_ENV as 'sandbox' | 'production';
  }
  
  // Prioridad 2: Modo de Vite
  if (import.meta.env.PROD) return 'production';
  if (import.meta.env.MODE === 'production') return 'production';
  
  // Prioridad 3: Hostname (solo si es explícitamente producción)
  const hostname = window.location.hostname;
  if (hostname === 'puntolegal.online' || hostname === 'www.puntolegal.online') {
    return 'production';
  }
  
  // Por defecto: sandbox
  return 'sandbox';
}

// Función para obtener el Access Token correcto
export function getMpAccessToken(): string {
  const env = getMercadoPagoEnv();
  
  // ❌ REMOVIDO - accessToken no debe estar en frontend
  // Las operaciones con accessToken se manejan en el backend
  throw new Error('Access Token no debe obtenerse en el frontend. Usar Supabase Edge Functions.');
}

// Función para obtener la Public Key correcta
export function getMpPublicKey(): string {
  const env = getMercadoPagoEnv();
  
  if (env === 'production') {
    return import.meta.env.VITE_MP_PUBLIC_KEY_PROD || 
           'CONFIGURAR_VITE_MP_PUBLIC_KEY_PROD';
  } else {
    return import.meta.env.VITE_MP_PUBLIC_KEY_TEST || 
           'CONFIGURAR_VITE_MP_PUBLIC_KEY_TEST';
  }
}

// Función para obtener URLs de retorno
export function getReturnUrls() {
  const baseUrl = import.meta.env.VITE_APP_URL || 
                  import.meta.env.VITE_APP_BASE_URL || 
                  window.location.origin || 
                  (import.meta.env.PROD ? 'https://puntolegal.online' : 'http://localhost:5173');
  
  return {
    success: `${baseUrl}/payment-success?source=mercadopago`,
    failure: `${baseUrl}/payment-failure?source=mercadopago`,
    pending: `${baseUrl}/payment-pending?source=mercadopago`
  };
}

// Función para obtener URL del webhook
export function getWebhookUrl(): string {
  // Usar la función de Supabase Edge Function para el webhook
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                      'https://tu-proyecto.supabase.co';
  
  return `${supabaseUrl}/functions/v1/mercadopago-webhook`;
}
