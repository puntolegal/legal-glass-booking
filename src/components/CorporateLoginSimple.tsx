import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Eye, EyeOff, Lock, User, Shield, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CorporateLoginProps {
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  isModal?: boolean; // Nueva prop para indicar si es un modal
}

export default function CorporateLoginSimple({ onClose, onLoginSuccess, isModal = false }: CorporateLoginProps) {
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
      if (isLogin) {
        // Verificar credenciales de demostración primero
        if (email === 'admin@miempresa.cl' && password === 'demo123') {
          // Usuario de demostración - crear objeto de usuario simulado
          const demoUser = {
            id: 'demo-user-123',
            email: 'admin@miempresa.cl',
            user_metadata: {
              role: 'corporate',
              empresa: 'Mi Empresa Demo',
              access_level: 'admin'
            },
            app_metadata: {
              provider: 'demo'
            }
          };
          
          setSuccess('Inicio de sesión exitoso (Modo Demostración)');
          onLoginSuccess(demoUser);
          return;
        }

        // Intentar login con Supabase para otros usuarios
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            throw new Error(error.message);
          }

          setSuccess('Inicio de sesión exitoso');
          onLoginSuccess(data.user);
        } catch (supabaseError: any) {
          // Si falla Supabase, mostrar error genérico
          throw new Error('Credenciales inválidas. Usa las credenciales de demostración o verifica tu cuenta.');
        }
      } else {
        // Registro con Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'corporate'
            }
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        setSuccess('Registro exitoso. Revisa tu email para confirmar tu cuenta.');
        setIsLogin(true);
      }
    } catch (error: any) {
      setError(error.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const quickLoginDemo = () => {
    setEmail('admin@miempresa.cl');
    setPassword('demo123');
  };

  const modalContent = (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl"
    >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Portal Corporativo</h2>
              <p className="text-blue-100">Punto Legal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-blue-100">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Acceso seguro para empresas</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Toggle Login/Register */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Quick Demo Button */}
          {isLogin && (
            <div className="mb-4">
              <button
                type="button"
                onClick={quickLoginDemo}
                className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Usar credenciales de demostración
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Corporativo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="empresa@dominio.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Portal Corporativo</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Gestión de contratos y documentos</li>
              <li>• Seguimiento de casos jurídicos</li>
              <li>• Acceso a biblioteca legal</li>
              <li>• Soporte prioritario 24/7</li>
            </ul>
          </div>
        </div>
      </motion.div>
  );

  // Si es modal, solo retornar el contenido
  if (isModal) {
    return modalContent;
  }

  // Si no es modal, retornar con posicionamiento fijo
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {modalContent}
    </motion.div>
  );
}
