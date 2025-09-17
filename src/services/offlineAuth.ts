// Sistema de autenticación offline para desarrollo
export interface OfflineUser {
  id: string;
  email: string;
  user_metadata: {
    nombre: string;
    empresa?: string;
    role: string;
  };
  created_at: string;
}

// Solo para desarrollo - NO USAR EN PRODUCCIÓN
const isDevelopment = import.meta.env.DEV;

// Hash simple para credenciales (NO seguro para producción)
const hashCredential = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

// Credenciales hasheadas para desarrollo
const DEV_CREDENTIALS: Record<string, { user: OfflineUser; passwordHash: string }> = {
  // Solo disponible en modo desarrollo
  ...(isDevelopment && {
    [hashCredential('dev@puntolegal.cl')]: {
      user: {
        id: 'dev-user-001',
        email: 'dev@puntolegal.cl',
        user_metadata: {
          nombre: 'Usuario Desarrollo',
          empresa: 'Punto Legal Dev',
          role: 'admin'
        },
        created_at: new Date().toISOString()
      },
      passwordHash: hashCredential('dev123')
    }
  })
};

// Simular login offline (solo en desarrollo)
export const authenticateOffline = async (email: string, password: string): Promise<{ user: OfflineUser | null; error: string | null }> => {
  // Solo funciona en modo desarrollo
  if (!isDevelopment) {
    return { user: null, error: 'Modo offline no disponible en producción' };
  }

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  const emailHash = hashCredential(email);
  const passwordHash = hashCredential(password);
  const credential = DEV_CREDENTIALS[emailHash];

  if (!credential) {
    return { user: null, error: 'Acceso no autorizado. Contacta al administrador.' };
  }

  if (passwordHash !== credential.passwordHash) {
    return { user: null, error: 'Credenciales incorrectas' };
  }

  // Guardar sesión offline en localStorage
  localStorage.setItem('offline_session', JSON.stringify({
    user: credential.user,
    expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  }));

  return { user: credential.user, error: null };
};

// Verificar sesión offline existente
export const getOfflineSession = (): OfflineUser | null => {
  try {
    const session = localStorage.getItem('offline_session');
    if (!session) return null;

    const { user, expires_at } = JSON.parse(session);
    
    // Verificar si la sesión ha expirado
    if (Date.now() > expires_at) {
      localStorage.removeItem('offline_session');
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error al obtener sesión offline:', error);
    localStorage.removeItem('offline_session');
    return null;
  }
};

// Cerrar sesión offline
export const signOutOffline = (): void => {
  localStorage.removeItem('offline_session');
};

// Registrar usuario offline (solo desarrollo)
export const registerOffline = async (email: string, password: string): Promise<{ user: OfflineUser | null; error: string | null }> => {
  // Solo funciona en modo desarrollo
  if (!isDevelopment) {
    return { user: null, error: 'Registro offline no disponible en producción' };
  }

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500));

  // En modo desarrollo, requerir autorización del administrador
  return { 
    user: null, 
    error: 'Registro deshabilitado. Contacta al administrador para obtener acceso.' 
  };
};

// Función para obtener credenciales de desarrollo (solo para uso interno)
export const getDevCredentials = (): string | null => {
  if (!isDevelopment) return null;
  
  // Solo mostrar en consola para desarrolladores
  console.group('🔧 Credenciales de Desarrollo');
  console.log('Email: dev@puntolegal.cl');
  console.log('Password: dev123');
  console.log('⚠️  Solo para desarrollo local');
  console.groupEnd();
  
  return 'Credenciales mostradas en consola del navegador';
};