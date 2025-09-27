import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Shield, Lock, AlertCircle } from 'lucide-react';

interface CheckoutButtonProps {
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

const MercadoPagoCheckoutButton: React.FC<CheckoutButtonProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckoutPro = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando Checkout Pro temporal...');
      
      // Crear URL temporal para Checkout Pro usando el método oficial
      // Esta es una implementación temporal hasta que se deploye el Edge Function
      
      const checkoutData = {
        // Información del producto
        title: paymentData.description,
        unit_price: paymentData.amount,
        quantity: 1,
        currency_id: 'CLP',
        
        // Información del pagador
        payer_name: paymentData.payer.name,
        payer_email: paymentData.payer.email,
        
        // URLs de retorno
        back_urls: {
          success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
          failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
          pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
        },
        
        // Configuración adicional
        auto_return: 'approved',
        external_reference: `PL-${Date.now()}`,
        statement_descriptor: 'PUNTO LEGAL'
      };
      
      console.log('📋 Datos del checkout:', checkoutData);
      
      // Guardar datos del pago en localStorage
      localStorage.setItem('pendingPayment', JSON.stringify({
        ...paymentData,
        timestamp: Date.now(),
        method: 'mercadopago_checkout_pro_temp',
        checkoutData
      }));
      
      // Para producción temporal, usar el link directo de MercadoPago
      // con el formato correcto para Checkout Pro
      const checkoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect` +
        `?back_urls[success]=${encodeURIComponent(checkoutData.back_urls.success)}` +
        `&back_urls[failure]=${encodeURIComponent(checkoutData.back_urls.failure)}` +
        `&back_urls[pending]=${encodeURIComponent(checkoutData.back_urls.pending)}` +
        `&items[0][title]=${encodeURIComponent(checkoutData.title)}` +
        `&items[0][unit_price]=${checkoutData.unit_price}` +
        `&items[0][quantity]=${checkoutData.quantity}` +
        `&items[0][currency_id]=${checkoutData.currency_id}` +
        `&payer[name]=${encodeURIComponent(checkoutData.payer_name)}` +
        `&payer[email]=${encodeURIComponent(checkoutData.payer_email)}` +
        `&external_reference=${checkoutData.external_reference}` +
        `&auto_return=${checkoutData.auto_return}`;
      
      console.log('🔗 URL de Checkout Pro generada');
      console.log('🚀 Redirigiendo a MercadoPago...');
      
      // Redirigir al Checkout Pro
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('❌ Error en Checkout Pro:', error);
      setIsLoading(false);
      onError?.(`Error iniciando el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botón principal de pago */}
      <motion.button
        onClick={handleCheckoutPro}
        disabled={isLoading}
        className="w-full bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Iniciando Checkout Pro...</span>
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

      {/* Información temporal */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
          <div className="text-xs text-orange-800">
            <p className="font-medium">Implementación Temporal</p>
            <p>Usando Checkout Pro con credenciales de producción. Para la versión final se recomienda deployar el Edge Function de Supabase para mayor seguridad.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoCheckoutButton;
