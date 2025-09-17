import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Database, AlertCircle } from 'lucide-react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

interface SupabaseStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export default function SupabaseStatusIndicator({ 
  showDetails = false, 
  className = "" 
}: SupabaseStatusIndicatorProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      try {
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-2 ${className}`}
      >
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        {showDetails && (
          <span className="text-sm text-gray-600">Verificando conexión...</span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 ${className}`}
    >
      {isConnected ? (
        <>
          <div className="flex items-center gap-1">
            <Wifi className="w-4 h-4 text-green-500" />
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          {showDetails && (
            <div className="text-sm">
              <span className="text-green-600 font-medium">Online</span>
              <span className="text-gray-500 ml-1">• Base de datos conectada</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-1">
            <WifiOff className="w-4 h-4 text-orange-500" />
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
          {showDetails && (
            <div className="text-sm">
              <span className="text-orange-600 font-medium">Offline</span>
              <span className="text-gray-500 ml-1">• Usando almacenamiento local</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// Componente más detallado para páginas administrativas
export function SupabaseStatusCard() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      try {
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);
        setLastCheck(new Date());
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsConnected(false);
        setLastCheck(new Date());
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Estado de la Base de Datos</h3>
        </div>
        <SupabaseStatusIndicator />
      </div>

      {isChecking ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span>Verificando conexión...</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Conectado a Supabase</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-600">Modo Offline</span>
              </>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            {isConnected ? (
              <div>
                <p>✅ Reservas se guardan en Supabase</p>
                <p>✅ Emails se envían automáticamente</p>
                <p>✅ Sincronización en tiempo real</p>
              </div>
            ) : (
              <div>
                <p>💾 Reservas se guardan localmente</p>
                <p>📧 Emails se simulan en consola</p>
                <p>⚠️ Sincronizar cuando se restaure la conexión</p>
              </div>
            )}
          </div>
          
          {lastCheck && (
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
              Última verificación: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
