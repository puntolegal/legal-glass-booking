/**
 * Componente para verificar y asegurar que el servidor de MercadoPago esté funcionando
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, CheckCircle, AlertTriangle, RefreshCw, Play } from 'lucide-react';

interface MercadoPagoStatusCheckerProps {
  onStatusChange?: (isAvailable: boolean) => void;
}

export const MercadoPagoStatusChecker: React.FC<MercadoPagoStatusCheckerProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkServerStatus = async () => {
    try {
      setStatus('checking');
      
      // Debug: Verificar variables de entorno
      console.log('🔍 DEBUG - Verificando variables de entorno:');
      console.log('import.meta.env:', import.meta.env);
      // ❌ REMOVIDO: No exponer claves en logs
      // console.log('VITE_MERCADOPAGO_ACCESS_TOKEN:', import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN);
      console.log('VITE_MERCADOPAGO_PUBLIC_KEY:', import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY ? 'Configurado' : 'No configurado');
      console.log('NODE_ENV:', import.meta.env.MODE);
      
      // Verificar que las credenciales de MercadoPago estén configuradas
      const { MERCADOPAGO_CONFIG } = await import('@/config/mercadopago');
      const publicKey = MERCADOPAGO_CONFIG.publicKey;
      
      if (!publicKey) {
        setStatus('unavailable');
        onStatusChange?.(false);
        console.log('⚠️ Credenciales de MercadoPago no configuradas');
        console.log('Public Key:', publicKey ? 'Configurado' : 'No configurado');
        return;
      }
      
      console.log('✅ Credenciales de MercadoPago configuradas');
      console.log('Public Key:', publicKey ? 'Configurado' : 'No configurado');
      
      // Verificar conectividad con Supabase (nuestro backend)
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('reservas')
        .select('id')
        .limit(1);
      
      if (error) {
        setStatus('unavailable');
        onStatusChange?.(false);
        console.log('⚠️ Error conectando con Supabase:', error.message);
      } else {
        setStatus('available');
        setLastCheck(new Date());
        onStatusChange?.(true);
        console.log('✅ Backend Supabase disponible para MercadoPago');
      }
    } catch (error) {
      setStatus('unavailable');
      onStatusChange?.(false);
      console.log('⚠️ Error verificando backend:', error.message);
    }
  };

  const retryConnection = async () => {
    setIsRetrying(true);
    await checkServerStatus();
    setIsRetrying(false);
  };

  const startServer = async () => {
    try {
      setIsRetrying(true);
      console.log('🚀 Intentando iniciar servidor...');
      
      // Llamar al script de inicio
      const response = await fetch('/api/start-mercadopago', {
        method: 'POST'
      });
      
      if (response.ok) {
        // Esperar un poco y verificar
        setTimeout(async () => {
          await checkServerStatus();
          setIsRetrying(false);
        }, 3000);
      } else {
        console.log('⚠️ No se pudo iniciar el servidor automáticamente');
        setIsRetrying(false);
      }
    } catch (error) {
      console.log('⚠️ Error iniciando servidor:', error);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (status === 'available') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-3"
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Servidor MercadoPago funcionando
          </span>
          {lastCheck && (
            <span className="text-xs text-green-600">
              (Verificado: {lastCheck.toLocaleTimeString()})
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border rounded-lg p-3 ${
        status === 'unavailable'
          ? 'bg-red-50 border-red-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'checking' ? (
            <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${
            status === 'unavailable'
              ? 'text-red-800'
              : 'text-yellow-800'
          }`}>
            {status === 'checking' 
              ? 'Verificando servidor...'
              : 'Servidor MercadoPago no disponible'
            }
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={retryConnection}
            disabled={isRetrying}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            {isRetrying ? 'Verificando...' : 'Reintentar'}
          </button>
          
          <button
            onClick={startServer}
            disabled={isRetrying}
            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <Play className="w-3 h-3" />
            Iniciar
          </button>
        </div>
      </div>
      
      {status === 'unavailable' && (
        <div className="mt-2 text-xs text-red-700">
          <p>Para usar MercadoPago:</p>
          <code className="bg-red-100 px-2 py-1 rounded">npm run mercadopago:start</code>
          <p className="mt-1">O ejecuta: <code className="bg-red-100 px-1 rounded">cd server && node mercadopago-backend.js</code></p>
        </div>
      )}
    </motion.div>
  );
};

export default MercadoPagoStatusChecker;
