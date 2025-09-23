/**
 * Configuración de Supabase con modo offline automático
 * Si las credenciales no coinciden o no hay conexión, usa modo offline
 */

// Credenciales desde variables de entorno
export const SUPABASE_CREDENTIALS = {
  URL: import.meta.env.VITE_SUPABASE_URL || '',
  PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  PROJECT_REF: import.meta.env.VITE_SUPABASE_PROJECT_REF || ''
};

// Verificar si las credenciales son válidas
export const areCredentialsValid = (): boolean => {
  return SUPABASE_CREDENTIALS.URL && 
         SUPABASE_CREDENTIALS.PUBLISHABLE_KEY && 
         SUPABASE_CREDENTIALS.PROJECT_REF;
};

// Configuración del modo
export const SUPABASE_CONFIG = {
  url: SUPABASE_CREDENTIALS.URL,
  anonKey: SUPABASE_CREDENTIALS.PUBLISHABLE_KEY,
  projectRef: SUPABASE_CREDENTIALS.PROJECT_REF,
  isValid: areCredentialsValid(),
  forceOffline: false // Credenciales válidas, permitir modo online
};

// Información de diagnóstico
export const getDiagnosticInfo = () => {
  return {
    projectRef: SUPABASE_CREDENTIALS.PROJECT_REF,
    url: SUPABASE_CREDENTIALS.URL,
    credentialsValid: areCredentialsValid(),
    mode: areCredentialsValid() ? 'online' : 'offline',
    reason: areCredentialsValid() 
      ? 'Credenciales válidas del mismo proyecto' 
      : 'Credenciales incompletas o inválidas'
  };
};
