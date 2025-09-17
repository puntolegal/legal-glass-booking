import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Shield, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface NetlifyButtonProps {
  paymentData: {
    amount: number;
    description: string;
    payer: {
      name: string;
      email: string;
      phone?: string;
    };
    metadata?: any;
  };
  onSuccess?: (payment: any) => void;
  onError?: (error: string) => void;
}

const MercadoPagoNetlifyButton: React.FC<NetlifyButtonProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleNetlifyCheckout = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando Checkout via Netlify Function...');
      
      console.log('📋 Datos del pago:', paymentData);
      
      // Llamar a la Netlify Function
      const response = await fetch('/.netlify/functions/create-mercadopago-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentData: {
            service: paymentData.description,
            price: paymentData.amount.toString(),
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
        const errorText = await response.text();
        console.error('❌ Error en Netlify Function:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        console.error('❌ Error en respuesta:', result.error);
        throw new Error(`Error creando preferencia: ${result.error}`);
      }
      
      console.log('✅ Preferencia creada:', result.preference_id);
      
      // Guardar datos del pago en localStorage
      localStorage.setItem('pendingPayment', JSON.stringify({
        ...paymentData,
        preferenceId: result.preference_id,
        timestamp: Date.now(),
        method: 'mercadopago_netlify'
      }));
      
      // Redirigir al Checkout Pro oficial
      console.log('🚀 Redirigiendo a MercadoPago...');
      window.location.href = result.init_point;
      
    } catch (error) {
      console.error('❌ Error en Netlify checkout:', error);
      setIsLoading(false);
      onError?.(`Error iniciando el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botón principal de pago */}
      <motion.button
        onClick={handleNetlifyCheckout}
        disabled={isLoading}
        className="w-full bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Creando preferencia...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Checkout Pro - MercadoPago</span>
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </motion.button>

      {/* Información de seguridad */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Pago 100% Seguro</p>
            <ul className="space-y-1 text-blue-700">
              <li className="flex items-center space-x-2">
                <Lock className="h-3 w-3" />
                <span>Encriptación SSL</span>
              </li>
              <li>• Datos protegidos por MercadoPago</li>
              <li>• Certificado PCI DSS</li>
              <li>• Hasta 12 cuotas sin interés</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Información sobre Netlify Function */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
          <div className="text-xs text-green-800">
            <p className="font-medium">Integración Profesional</p>
            <p>Usando Netlify Functions para crear preferencias de forma segura con la API oficial de MercadoPago.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoNetlifyButton;
