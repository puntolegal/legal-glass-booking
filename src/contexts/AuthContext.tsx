import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'curator'; // 'curator' suena más elevado que 'editor'
  badgeId: string;
  stats: {
    validatedNotes: number;
    accuracyRate: string;
    activeCases: number; // La recompensa real
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isCurator: boolean;
  login: (userType?: 'amanda' | 'benjamin') => void;
  logout: () => void;
  profile: UserProfile | null;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Simular sesión persistente
    const session = localStorage.getItem('pl_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.id === 'usr_amanda_legal') {
          setUser({
            ...parsed,
            name: 'Amanda G.'
          });
        } else if (parsed?.id === 'usr_benjamin_legal') {
          setUser({
            ...parsed,
            name: 'Benjamin'
          });
        } else {
          setUser(parsed);
        }
      } catch (error) {
        console.warn('Error al restaurar sesión:', error);
        localStorage.removeItem('pl_session');
      }
    }
  }, []);

  const login = (userType: 'amanda' | 'benjamin' = 'amanda') => {
    if (userType === 'amanda') {
      // Perfil de Amanda
      const amanda: UserProfile = {
        id: 'usr_amanda_legal',
        name: 'Amanda G.',
        role: 'curator',
        badgeId: 'CUR-001', // ID de empleado ficticio
        stats: {
          validatedNotes: 14,
          accuracyRate: '98.5%',
          activeCases: 1
        }
      };
      setUser(amanda);
      localStorage.setItem('pl_session', JSON.stringify(amanda));
    } else {
      // Perfil de Benjamin
      const benjamin: UserProfile = {
        id: 'usr_benjamin_legal',
        name: 'Benjamin',
        role: 'curator',
        badgeId: 'CUR-002',
        stats: {
          validatedNotes: 0,
          accuracyRate: '100%',
          activeCases: 0
        }
      };
      setUser(benjamin);
      localStorage.setItem('pl_session', JSON.stringify(benjamin));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pl_session');
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      profile: user,
      isAuthenticated: !!user, 
      isCurator: user?.role === 'curator',
      login, 
      logout,
      isAdmin: () => false // No hay rol admin en este sistema
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
