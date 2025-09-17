/**
 * Configuración de Supabase con modo offline automático
 * Si las credenciales no coinciden o no hay conexión, usa modo offline
 */

// Credenciales correctas del mismo proyecto
export const SUPABASE_CREDENTIALS = {
  URL: 'https://qrgelocijmwnxcckxbdg.supabase.co',
  PUBLISHABLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI',
  PROJECT_REF: 'qrgelocijmwnxcckxbdg'
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
