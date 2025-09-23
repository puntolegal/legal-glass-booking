/**
 * Botón de MercadoPago optimizado para móvil
 * Funciona sin backend local, usando la API directamente
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

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

interface MobileMercadoPagoButtonProps {
  paymentData: PaymentData;
  onSuccess?: (payment: any) => void;
  onError?: (error: string) => void;
}

const MobileMercadoPagoButton: React.FC<MobileMercadoPagoButtonProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMobilePayment = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando pago móvil...');
      console.log('📋 Datos del pago:', paymentData);
      
      // Crear preferencia directamente usando la API de MercadoPago
      const preferenceData = {
        items: [
          {
            title: `${paymentData.description} - Punto Legal`,
            description: `Consulta legal agendada`,
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
          success: `https://puntolegal.online/payment-success?source=mercadopago`,
          failure: `https://puntolegal.online/payment-failure?source=mercadopago`,
          pending: `https://puntolegal.online/payment-pending?source=mercadopago`
        },
        external_reference: `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        notification_url: `https://puntolegal.online/api/mercadopago/webhook`,
        metadata: {
          client_name: paymentData.payer.name,
          client_email: paymentData.payer.email,
          service_type: paymentData.description,
          appointment_date: paymentData.metadata?.appointment_date || new Date().toISOString().split('T')[0],
          appointment_time: paymentData.metadata?.appointment_time || '10:00',
          source: 'punto-legal-mobile',
          integration_type: 'mobile_direct'
        },
        statement_descriptor: 'PUNTO LEGAL'
      };

      console.log('📤 Creando preferencia directamente...');

      // Usar la API de MercadoPago directamente desde el frontend
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || ''}`
        },
        body: JSON.stringify(preferenceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Preferencia creada:', result.id);

      // Guardar datos del pago
      localStorage.setItem('paymentData', JSON.stringify({
        ...paymentData,
        preferenceId: result.id,
        timestamp: Date.now(),
        method: 'mercadopago_mobile_direct'
      }));

      // Redirigir al Checkout Pro
      console.log('🚀 Redirigiendo a MercadoPago...');
      window.location.href = result.init_point;

    } catch (error) {
      console.error('❌ Error en pago móvil:', error);
      setIsLoading(false);
      onError?.(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botón principal */}
      <motion.button
        onClick={handleMobilePayment}
        disabled={isLoading}
        className="w-full bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando pago...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pagar con MercadoPago</span>
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </motion.button>

      {/* Información de seguridad */}
      <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">Pago 100% seguro</span>
        </div>
        <div className="mt-1 text-xs text-green-700">
          <p>• Encriptación SSL</p>
          <p>• Certificado PCI DSS</p>
          <p>• Procesado por MercadoPago</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMercadoPagoButton;
