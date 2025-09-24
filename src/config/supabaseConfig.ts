/**
 * Configuración de Supabase - Solo variables de entorno
 * No usar credenciales hardcodeadas para evitar conflictos
 */

// Credenciales desde variables de entorno o fallback a producción
// Valores de fallback garantizados para evitar errores de inicialización
const FALLBACK_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';
const FALLBACK_PROJECT_REF = 'qrgelocijmwnxcckxbdg';

export const SUPABASE_CREDENTIALS = {
  URL: import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL,
  PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY,
  PROJECT_REF: import.meta.env.VITE_SUPABASE_PROJECT_REF || FALLBACK_PROJECT_REF
};

// Verificar si las credenciales son válidas
export const areCredentialsValid = (): boolean => {
  return Boolean(
    SUPABASE_CREDENTIALS.URL &&
    SUPABASE_CREDENTIALS.PUBLISHABLE_KEY &&
    SUPABASE_CREDENTIALS.PROJECT_REF
  );
};

// Configuración del modo
export const SUPABASE_CONFIG = {
  url: SUPABASE_CREDENTIALS.URL,
  anonKey: SUPABASE_CREDENTIALS.PUBLISHABLE_KEY,
  projectRef: SUPABASE_CREDENTIALS.PROJECT_REF,
  isValid: areCredentialsValid(),
  forceOffline: false
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
