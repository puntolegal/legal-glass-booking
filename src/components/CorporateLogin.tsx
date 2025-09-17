import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Eye, EyeOff, Lock, User, Shield, TrendingUp, FileText, AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  // Verificar sesión existente al cargar
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          onLoginSuccess(session.user);
        }
      } catch (error) {
        console.log('No hay sesión activa');
      }
    };
    
    checkExistingSession();
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Verificar conectividad primero
      const online = await checkSupabaseConnection();
      setIsOnline(online);

      if (isLogin) {
        if (online) {
          // Modo online - usar Supabase
          const timeoutId = setTimeout(() => {
            setLoading(false);
            setError('Tiempo de espera agotado. Cambiando a modo offline...');
          }, 8000);

          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            clearTimeout(timeoutId);

            if (error) {
              // Si hay error de Supabase, intentar modo offline
              console.warn('Error de Supabase, intentando modo offline:', error);
              const offlineResult = await authenticateOffline(email, password);
              
              if (offlineResult.error) {
                throw new Error(offlineResult.error);
              }
              
              setSuccess('Inicio de sesión exitoso (Modo Offline)');
              onLoginSuccess(offlineResult.user);
              return;
            }

            setSuccess('Inicio de sesión exitoso');
            onLoginSuccess(data.user);
          } catch (supabaseError: any) {
            clearTimeout(timeoutId);
            // Fallback a modo offline
            const offlineResult = await authenticateOffline(email, password);
            
            if (offlineResult.error) {
              throw new Error(`Conexión fallida. ${offlineResult.error}`);
            }
            
            setSuccess('Inicio de sesión exitoso (Modo Offline)');
            onLoginSuccess(offlineResult.user);
          }
        } else {
          // Modo offline directo
          const offlineResult = await authenticateOffline(email, password);
          
          if (offlineResult.error) {
            throw new Error(offlineResult.error);
          }
          
          setSuccess('Inicio de sesión exitoso (Modo Offline)');
          onLoginSuccess(offlineResult.user);
        }
      } else {
        // Registro
        if (online) {
          // Modo online - usar Supabase
          const timeoutId = setTimeout(() => {
            setLoading(false);
            setError('Tiempo de espera agotado. Cambiando a modo offline...');
          }, 8000);

          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  role: 'corporativo',
                  is_active: true
                }
              }
            });

            clearTimeout(timeoutId);

            if (error) {
              // Fallback a registro offline
              const offlineResult = await registerOffline(email, password);
              if (offlineResult.error) {
                throw new Error(offlineResult.error);
              }
              setSuccess('Registro exitoso (Modo Offline)');
              return;
            }

            // Crear perfil corporativo
            if (data.user) {
              await supabase.from('profiles').insert({
                user_id: data.user.id,
                email: data.user.email,
                nombre: 'Usuario Corporativo',
                telefono: '+56962321883'
              });
            }

            setSuccess('Registro exitoso. Verifica tu email para confirmar la cuenta.');
          } catch (supabaseError: any) {
            clearTimeout(timeoutId);
            // Fallback a registro offline
            const offlineResult = await registerOffline(email, password);
            if (offlineResult.error) {
              throw new Error(`Conexión fallida. ${offlineResult.error}`);
            }
            setSuccess('Registro exitoso (Modo Offline)');
          }
        } else {
          // Modo offline directo
          const offlineResult = await registerOffline(email, password);
          if (offlineResult.error) {
            throw new Error(offlineResult.error);
          }
          setSuccess('Registro exitoso (Modo Offline)');
        }
      }
    } catch (error: any) {
      // Intentar modo offline como último recurso
      try {
        if (isLogin) {
          const offlineResult = await authenticateOffline(email, password);
          if (!offlineResult.error) {
            setSuccess('Inicio de sesión exitoso (Modo Offline)');
            onLoginSuccess(offlineResult.user);
            return;
          }
        }
      } catch (offlineError) {
        console.error('Error en modo offline:', offlineError);
      }
      
      // Si todo falla, mostrar error
      setError(error.message || 'Error de conexión. Verifica tu internet e intenta nuevamente.');
      console.error('Error de autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md"
      >
        {/* Fondo con gradiente cobre metálico */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl blur-xl opacity-20" />
        
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/30 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Iniciar Sesión' : 'Registro Empresa'}
            </h2>
            <p className="text-white/70 text-sm">
              {isLogin ? 'Accede a tu panel corporativo' : 'Crea tu cuenta empresarial'}
            </p>
            
            {/* Indicador de estado de conexión */}
            {connectionChecked && (
              <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium ${
                isOnline 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? 'Modo Online' : 'Modo Offline'}
              </div>
            )}
          </div>

          {/* Indicador de modo offline */}
          {!isOnline && connectionChecked && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <WifiOff className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200 font-medium text-sm">Modo Desarrollo Offline</span>
              </div>
              <p className="text-blue-100/80 text-xs leading-relaxed mb-3">
                Servidor no disponible. Solo para desarrollo local.
              </p>
              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={() => getDevCredentials()}
                  className="text-xs text-blue-300 hover:text-blue-200 underline"
                >
                  Ver credenciales en consola (F12)
                </button>
              )}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-amber-500/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  placeholder="empresa@dominio.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-amber-500/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando credenciales...</span>
                </div>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Registrar Empresa'
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          {/* Admin Info */}
          {/* Sección eliminada por solicitud del usuario */}

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-amber-500/20">
            <h3 className="text-white font-semibold mb-4 text-center">Funcionalidades Incluidas</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Seguimiento de causas</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Comparendos DT</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>Proyecciones juicio</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Gestión completa</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
} 