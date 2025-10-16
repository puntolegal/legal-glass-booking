import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2, ExternalLink, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createCheckoutPreference } from '@/services/mercadopagoBackend';
import { MERCADOPAGO_CONFIG } from '@/config/mercadopago';

interface CheckoutProProps {
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

const MercadoPagoCheckoutPro: React.FC<CheckoutProProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Crear preferencia de Checkout Pro
  const createPreference = async () => {
    setIsLoading(true);
    setError('');

    try {
      const preference = await createCheckoutPreference({
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
          phone: paymentData.payer.phone ? {
            number: paymentData.payer.phone
          } : undefined
        },
        back_urls: {
          success: `https://puntolegal.online/payment-success?source=mercadopago`,
          failure: `https://puntolegal.online/payment-failure?source=mercadopago`,
          pending: `https://puntolegal.online/payment-pending?source=mercadopago`
        },
        auto_return: 'approved',
        external_reference: paymentData.metadata?.reservation_id || `PL-${Date.now()}`,
        metadata: {
          ...paymentData.metadata,
          source: 'punto-legal-web',
          integration_type: 'checkout_pro'
        },
        notification_url: `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook`
      });

      setPreferenceId(preference.preference_id);
      setCheckoutUrl(preference.sandbox_init_point || preference.init_point);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear la preferencia de pago';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir Checkout Pro
  const openCheckout = () => {
    if (checkoutUrl) {
      // Abrir en la misma ventana para mejor UX
      window.location.href = checkoutUrl;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-foreground">MercadoPago</h2>
            <p className="text-muted-foreground">Checkout Pro - Pago seguro</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-foreground mb-2">{paymentData.description}</h3>
          <p className="text-3xl font-bold text-primary">${paymentData.amount.toLocaleString('es-CL')}</p>
          <p className="text-sm text-muted-foreground mt-2">Pago único o hasta 12 cuotas sin interés</p>
        </div>
      </div>

      {/* Características de Checkout Pro */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground mb-3">Ventajas de MercadoPago:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Hasta 12 cuotas sin interés</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Protección al comprador</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Devolución de dinero</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Soporte 24/7</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground mb-3">Métodos aceptados:</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-blue-400 font-bold text-sm">VISA</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-orange-400 font-bold text-sm">MASTERCARD</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-green-400 font-bold text-sm">MAGNA</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-purple-400 font-bold text-sm">AMEX</div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón principal */}
      <div className="space-y-4">
        {!checkoutUrl ? (
          <Button
            onClick={createPreference}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Preparando pago seguro...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Crear pago seguro
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={openCheckout}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Ir a MercadoPago - Pagar ${paymentData.amount.toLocaleString('es-CL')}
          </Button>
        )}
      </div>

      {/* Mostrar errores */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-400">Error en el pago</h4>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Información de seguridad */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Certificado SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" />
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-500" />
            <span>Datos protegidos</span>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          Procesado por MercadoPago - Líder en pagos online de América Latina
        </p>
      </div>

      {/* Preview de preferencia (solo en desarrollo) */}
      {preferenceId && import.meta.env.DEV && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <h4 className="font-semibold text-yellow-400 mb-2">Debug Info (solo desarrollo):</h4>
          <p className="text-xs text-yellow-300/80">Preference ID: {preferenceId}</p>
          <p className="text-xs text-yellow-300/80">Checkout URL: {checkoutUrl}</p>
        </div>
      )}
    </motion.div>
  );
};

export default MercadoPagoCheckoutPro;
