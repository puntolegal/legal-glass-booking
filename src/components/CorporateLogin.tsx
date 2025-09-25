import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Eye, EyeOff, Lock, User, Shield, TrendingUp, FileText, AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';

interface CorporateLoginProps {
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function CorporateLogin({ onClose, onLoginSuccess }: CorporateLoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [connectionChecked, setConnectionChecked] = useState(false);

  // Verificar conexión al cargar
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const online = await checkSupabaseConnection();
        setIsOnline(online);
        setConnectionChecked(true);
        
        // Verificar sesión existente si hay conexión
        if (online) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            onLoginSuccess(session.user);
          }
        }
      } catch (error) {
        console.log('Error verificando conexión:', error);
        setIsOnline(false);
        setConnectionChecked(true);
      }
    };
    
    checkConnection();
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!isOnline) {
        throw new Error('Sin conexión a internet. Por favor verifica tu conexión.');
      }

      if (isLogin) {
        // Iniciar sesión
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        setSuccess('Inicio de sesión exitoso');
        onLoginSuccess(data.user);
      } else {
        // Registrarse
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user && !data.user.email_confirmed_at) {
          setSuccess('Cuenta creada. Por favor verifica tu email antes de iniciar sesión.');
        } else {
          setSuccess('Cuenta creada exitosamente');
          onLoginSuccess(data.user);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Credenciales de desarrollo para testing
  const getDevCredentials = () => {
    return {
      email: 'admin@puntolegal.cl',
      password: 'admin123'
    };
  };

  const useDevCredentials = () => {
    const { email: devEmail, password: devPassword } = getDevCredentials();
    setEmail(devEmail);
    setPassword(devPassword);
  };

  if (!connectionChecked) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando conexión...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
      >
        {/* Estado de conexión */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <Wifi className="w-3 h-3" />
              <span>Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <WifiOff className="w-3 h-3" />
              <span>Sin conexión</span>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Acceso Corporativo' : 'Registro Corporativo'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isLogin ? 'Ingresa con tu cuenta administrativa' : 'Crea tu cuenta administrativa'}
          </p>
        </div>

        {/* Alertas */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Sin conexión</span>
            </div>
            <p className="text-red-600 text-xs mt-1">
              Verifica tu conexión a internet para acceder.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Éxito</span>
            </div>
            <p className="text-green-600 text-sm mt-1">{success}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Corporativo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin@empresa.com"
                required
                disabled={loading || !isOnline}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading || !isOnline}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isOnline}
            className="w-full bg-gradient-to-r from-primary to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </span>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Alternar modo */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            className="text-primary hover:text-orange-500 text-sm font-medium transition-colors"
            disabled={loading}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        {/* Credenciales de desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={useDevCredentials}
              className="w-full text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              🔧 Usar credenciales de desarrollo
            </button>
          </div>
        )}

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}