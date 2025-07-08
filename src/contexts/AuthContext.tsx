import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  nombre: string | null;
  email: string | null;
  telefono: string | null;
  role: 'admin' | 'abogado' | 'cliente';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isAbogado: () => boolean;
  isCliente: () => boolean;
  canViewAllReservations: () => boolean;
  canEditAnyReservation: () => boolean;
  canDeleteAnyReservation: () => boolean;
  canViewAllProfiles: () => boolean;
  canEditAnyProfile: () => boolean;
  canDeleteAnyProfile: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Role checking functions
  const isAdmin = () => {
    return profile?.role === 'admin' && profile?.is_active === true;
  };

  const isAbogado = () => {
    return (profile?.role === 'abogado' || profile?.role === 'admin') && profile?.is_active === true;
  };

  const isCliente = () => {
    return profile?.role === 'cliente' && profile?.is_active === true;
  };

  // Permission checking functions
  const canViewAllReservations = () => {
    return isAdmin() || isAbogado();
  };

  const canEditAnyReservation = () => {
    return isAdmin() || isAbogado();
  };

  const canDeleteAnyReservation = () => {
    return isAdmin();
  };

  const canViewAllProfiles = () => {
    return isAdmin();
  };

  const canEditAnyProfile = () => {
    return isAdmin();
  };

  const canDeleteAnyProfile = () => {
    return isAdmin();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
    isAdmin,
    isAbogado,
    isCliente,
    canViewAllReservations,
    canEditAnyReservation,
    canDeleteAnyReservation,
    canViewAllProfiles,
    canEditAnyProfile,
    canDeleteAnyProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};