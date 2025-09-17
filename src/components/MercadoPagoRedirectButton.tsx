import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Shield, Lock } from 'lucide-react';

interface RedirectButtonProps {
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

const MercadoPagoRedirectButton: React.FC<RedirectButtonProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRedirectPayment = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando Checkout Pro de MercadoPago...');
      
      // Para producción, necesitamos crear una preferencia real
      // usando la API oficial de MercadoPago
      console.log('📋 Datos del pago:', paymentData);
      
      // Crear preferencia usando la API de MercadoPago
      const preferenceData = {
        items: [
          {
            title: paymentData.description,
            quantity: 1,
            unit_price: paymentData.amount,
            currency_id: 'CLP'
          }
        ],
        payer: {
          name: paymentData.payer.name,
          email: paymentData.payer.email,
          phone: {
            number: paymentData.payer.phone || ''
          }
        },
        back_urls: {
          success: `${window.location.origin}/payment-success?source=mercadopago`,
          failure: `${window.location.origin}/payment-failure?source=mercadopago`,
          pending: `${window.location.origin}/payment-pending?source=mercadopago`
        },
        auto_return: 'approved',
        external_reference: `PL-${Date.now()}`,
        statement_descriptor: 'PUNTO LEGAL'
      };
      
      console.log('📤 Creando preferencia via Supabase Edge Function...');
      
      // Usar Edge Function de Supabase para crear preferencia de forma segura
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('create-mercadopago-preference', {
        body: { 
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
        }
      });
      
      if (error) {
        console.error('❌ Error en Edge Function:', error);
        throw new Error(`Error creando preferencia: ${error.message}`);
      }
      
      if (!data.success) {
        console.error('❌ Error en respuesta:', data.error);
        throw new Error(`Error creando preferencia: ${data.error}`);
      }
      
      console.log('✅ Preferencia creada:', data.preference_id);
      const preference = { id: data.preference_id, init_point: data.init_point };
      
      // Guardar datos del pago en localStorage
      localStorage.setItem('pendingPayment', JSON.stringify({
        ...paymentData,
        preferenceId: preference.id,
        timestamp: Date.now(),
        method: 'mercadopago_checkout_pro'
      }));
      
      // Redirigir al Checkout Pro oficial
      window.location.href = preference.init_point;
      
    } catch (error) {
      console.error('❌ Error en redirección:', error);
      setIsLoading(false);
      onError?.('Error iniciando el pago');
    }
  };

  return (
    <div className="space-y-4">
      {/* Botón principal de pago */}
      <motion.button
        onClick={handleRedirectPayment}
        disabled={isLoading}
        className="w-full bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Redirigiendo...</span>
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

      {/* Información de desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-800">
            <strong>Modo Producción:</strong> Usando Checkout Pro oficial con credenciales reales.
            Las preferencias se crean via Supabase Edge Function de forma segura.
          </p>
        </div>
      )}
    </div>
  );
};

export default MercadoPagoRedirectButton;
