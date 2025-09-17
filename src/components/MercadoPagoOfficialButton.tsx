import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Shield, Lock, CheckCircle, Server, AlertTriangle } from 'lucide-react';

interface PaymentData {
  amount: number;
  description: string;
  payer: {
    name: string;
    email: string;
    phone?: string;
  };
  metadata?: any;
}

interface MercadoPagoOfficialButtonProps {
  paymentData: PaymentData;
  onSuccess?: (payment: any) => void;
  onError?: (error: string) => void;
}

const MercadoPagoOfficialButton: React.FC<MercadoPagoOfficialButtonProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Verificar estado del backend al montar el componente
  React.useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        setBackendStatus('available');
        console.log('✅ Backend MercadoPago disponible');
      } else {
        setBackendStatus('unavailable');
      }
    } catch (error) {
      setBackendStatus('unavailable');
      console.log('⚠️ Backend MercadoPago no disponible');
    }
  };

  const handleOfficialCheckout = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando Checkout Pro OFICIAL...');
      console.log('📋 Datos del pago:', paymentData);
      
      // Verificar backend antes de proceder
      if (backendStatus !== 'available') {
        throw new Error('Backend no disponible. Ejecuta: cd server && npm install && npm start');
      }
      
      // Llamar al backend oficial
      const response = await fetch('http://localhost:3001/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentData: {
            service: paymentData.description,
            price: paymentData.amount,
            name: paymentData.payer.name,
            email: paymentData.payer.email,
            phone: paymentData.payer.phone || '',
            date: paymentData.metadata?.appointment_date || new Date().toISOString().split('T')[0],
            time: paymentData.metadata?.appointment_time || '10:00',
            description: paymentData.description
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error creando preferencia');
      }
      
      console.log('✅ Preferencia oficial creada:', result.preference_id);
      
      // Guardar datos del pago
      localStorage.setItem('pendingPayment', JSON.stringify({
        ...paymentData,
        preferenceId: result.preference_id,
        timestamp: Date.now(),
        method: 'mercadopago_official'
      }));
      
      // Redirigir al Checkout Pro oficial
      console.log('🚀 Redirigiendo a Checkout Pro oficial...');
      window.location.href = result.init_point;
      
    } catch (error) {
      console.error('❌ Error en checkout oficial:', error);
      setIsLoading(false);
      onError?.(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Estado del backend - Solo mostrar si no está disponible */}
      {backendStatus !== 'available' && (
        <div className={`border rounded-lg p-3 ${
          backendStatus === 'unavailable'
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Server className={`h-4 w-4 ${
              backendStatus === 'unavailable'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`} />
            <span className={`text-sm font-medium ${
              backendStatus === 'unavailable'
                ? 'text-red-800'
                : 'text-yellow-800'
            }`}>
              Backend MercadoPago: {
                backendStatus === 'unavailable'
                  ? 'No disponible'
                  : 'Verificando...'
              }
            </span>
          </div>
          
          {backendStatus === 'unavailable' && (
            <div className="mt-2 text-xs text-red-700">
              <p>Para usar la integración oficial:</p>
              <code className="bg-red-100 px-2 py-1 rounded">cd server && npm install && npm start</code>
            </div>
          )}
        </div>
      )}

      {/* Botón principal */}
      <motion.button
        onClick={handleOfficialCheckout}
        disabled={isLoading || backendStatus !== 'available'}
        className="w-full bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: backendStatus === 'available' ? 1.02 : 1 }}
        whileTap={{ scale: backendStatus === 'available' ? 0.98 : 1 }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Creando preferencia oficial...</span>
          </>
        ) : backendStatus === 'unavailable' ? (
          <>
            <AlertTriangle className="h-5 w-5" />
            <span>Backend requerido</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pagar con MercadoPago</span>
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </motion.button>

      {/* Información de seguridad minimalista */}
      {backendStatus === 'available' && (
        <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Integración oficial verificada</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MercadoPagoOfficialButton;