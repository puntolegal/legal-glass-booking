/**
 * Configuración de Supabase - Solo variables de entorno
 * No usar credenciales hardcodeadas para evitar conflictos
 */

// ✅ SEGURO - Solo usar variables de entorno, sin fallbacks con credenciales reales
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_PROJECT_REF = import.meta.env.VITE_SUPABASE_PROJECT_REF;

// Debug: Verificar configuración de Supabase
console.log('🔍 DEBUG Supabase Config:');
console.log('VITE_SUPABASE_URL:', SUPABASE_URL ? 'Configurado' : '❌ No configurado');
console.log('VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Configurado' : '❌ No configurado');
console.log('VITE_SUPABASE_PROJECT_REF:', SUPABASE_PROJECT_REF ? 'Configurado' : '❌ No configurado');

// Validar credenciales requeridas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: Credenciales de Supabase no configuradas');
  console.error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env');
}

export const SUPABASE_CREDENTIALS = {
  URL: SUPABASE_URL || '',
  PUBLISHABLE_KEY: SUPABASE_ANON_KEY || '',
  PROJECT_REF: SUPABASE_PROJECT_REF || ''
};

// Verificar si las credenciales son válidas
export const areCredentialsValid = (): boolean => {
  return Boolean(
    SUPABASE_CREDENTIALS.URL &&
    SUPABASE_CREDENTIALS.PUBLISHABLE_KEY
  );
};

// Configuración del modo
export const SUPABASE_CONFIG = {
  url: SUPABASE_CREDENTIALS.URL,
  anonKey: SUPABASE_CREDENTIALS.PUBLISHABLE_KEY,
  projectRef: SUPABASE_CREDENTIALS.PROJECT_REF,
  isValid: areCredentialsValid(),
  forceOffline: !areCredentialsValid()
};

// Información de diagnóstico
export const getDiagnosticInfo = () => {
  return {
    projectRef: SUPABASE_CREDENTIALS.PROJECT_REF,
    url: SUPABASE_CREDENTIALS.URL,
    credentialsValid: areCredentialsValid(),
    mode: areCredentialsValid() ? 'online' : 'offline',
    reason: areCredentialsValid() 
      ? 'Credenciales válidas configuradas' 
      : 'Credenciales incompletas o inválidas - Configura las variables de entorno'
  };
};
