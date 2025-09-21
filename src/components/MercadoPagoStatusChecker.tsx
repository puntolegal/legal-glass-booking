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
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus('available');
        setLastCheck(new Date());
        onStatusChange?.(true);
        console.log('✅ Servidor MercadoPago disponible:', data);
      } else {
        setStatus('unavailable');
        onStatusChange?.(false);
        console.log('⚠️ Servidor respondió con error:', response.status);
      }
    } catch (error) {
      setStatus('unavailable');
      onStatusChange?.(false);
      console.log('⚠️ Servidor MercadoPago no disponible:', error.message);
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
