// Componente de botón de MercadoPago - Frontend
// Usa solo variables VITE_ (públicas) y llama al backend para crear preferencias

import React, { useState } from 'react';
import { MERCADOPAGO_CONFIG } from '@/config/mercadopago';
import { createPaymentPreference } from '@/api/mercadopago';

interface MercadoPagoButtonProps {
  amount: number;
  description: string;
  externalReference?: string;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  onSuccess?: (preferenceId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function MercadoPagoButton({
  amount,
  description,
  externalReference,
  customer,
  onSuccess,
  onError,
  className = '',
  children
}: MercadoPagoButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Crear preferencia en el backend (seguro)
      const preference = await createPaymentPreference({
        amount,
        description,
        external_reference: externalReference,
        customer
      });

      console.log('✅ Preferencia creada:', preference.id);

      // Redirigir a MercadoPago
      const initPoint = preference.init_point || preference.sandbox_init_point;
      if (initPoint) {
        window.location.href = initPoint;
        onSuccess?.(preference.id);
      } else {
        throw new Error('No se pudo obtener la URL de pago');
      }

    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      onError?.(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`
        inline-flex items-center justify-center px-6 py-3 
        border border-transparent text-base font-medium rounded-md 
        text-white bg-blue-600 hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </>
      ) : (
        children || 'Pagar con MercadoPago'
      )}
    </button>
  );
}

// Hook para usar MercadoPago en componentes
export function useMercadoPago() {
  const [loading, setLoading] = useState(false);

  const createPayment = async (paymentData: {
    amount: number;
    description: string;
    externalReference?: string;
    customer?: {
      name: string;
      email: string;
      phone?: string;
    };
  }) => {
    try {
      setLoading(true);
      const preference = await createPaymentPreference(paymentData);
      return preference;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading,
    config: MERCADOPAGO_CONFIG
  };
}
