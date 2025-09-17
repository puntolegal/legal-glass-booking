import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, CreditCard, Shield, Lock } from 'lucide-react';
import { MERCADOPAGO_CONFIG } from '@/config/mercadopago';
import { createRealPreferenceViaEdgeFunction } from '@/services/mercadopagoEdgeFunction';

interface WalletBrickProps {
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

// Declarar MercadoPago globalmente
declare global {
  interface Window {
    MercadoPago: any;
  }
}

const MercadoPagoWalletBrick: React.FC<WalletBrickProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const walletContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [mp, setMp] = useState<any>(null);

  // Cargar SDK de MercadoPago
  useEffect(() => {
    const loadMercadoPagoSDK = () => {
      return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        if (window.MercadoPago) {
          resolve(window.MercadoPago);
          return;
        }

        // Crear script tag para cargar SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.async = true;
        
        script.onload = () => {
          if (window.MercadoPago) {
            resolve(window.MercadoPago);
          } else {
            reject(new Error('MercadoPago SDK no se cargó correctamente'));
          }
        };
        
        script.onerror = () => {
          reject(new Error('Error cargando MercadoPago SDK'));
        };

        document.head.appendChild(script);
      });
    };

    loadMercadoPagoSDK()
      .then(() => {
        // Inicializar MercadoPago con Public Key
        const mercadoPago = new window.MercadoPago(MERCADOPAGO_CONFIG.publicKey, {
          locale: 'es-CL'
        });
        setMp(mercadoPago);
        console.log('✅ MercadoPago SDK cargado exitosamente');
      })
      .catch((err) => {
        console.error('❌ Error cargando MercadoPago SDK:', err);
        setError('Error cargando sistema de pagos');
        onError?.('Error cargando sistema de pagos');
      });
  }, [onError]);

  // Crear preferencia y renderizar Wallet Brick
  useEffect(() => {
    if (!mp || preferenceId) return;

    const createPreferenceAndRender = async () => {
      try {
        setIsLoading(true);
        
        // Crear preferencia según documentación oficial
        const preference = await createRealPreferenceViaEdgeFunction({
          service: paymentData.description,
          price: paymentData.amount.toString(),
          name: paymentData.payer.name,
          email: paymentData.payer.email,
          phone: paymentData.payer.phone || '',
          date: paymentData.metadata?.appointment_date || new Date().toISOString().split('T')[0],
          time: paymentData.metadata?.appointment_time || '10:00',
          description: paymentData.description
        });

        setPreferenceId(preference.preference_id);
        
        // Renderizar Wallet Brick según documentación oficial
        const bricksBuilder = mp.bricks();
        
        await bricksBuilder.create('wallet', 'walletBrick_container', {
          initialization: {
            preferenceId: preference.preference_id
          },
          customization: {
            texts: {
              valueProp: 'smart_option'
            },
            visual: {
              buttonBackground: 'blue',
              borderRadius: '16px'
            }
          },
          callbacks: {
            onReady: () => {
              console.log('✅ Wallet Brick listo');
              setIsLoading(false);
            },
            onSubmit: (data: any) => {
              console.log('🚀 Iniciando pago:', data);
              // El pago se procesa automáticamente en MercadoPago
            },
            onError: (error: any) => {
              console.error('❌ Error en Wallet Brick:', error);
              setError('Error en el sistema de pagos');
              onError?.('Error en el sistema de pagos');
            }
          }
        });
        
      } catch (err: any) {
        console.error('❌ Error configurando Wallet Brick:', err);
        setError(err.message || 'Error configurando el pago');
        onError?.(err.message || 'Error configurando el pago');
        setIsLoading(false);
      }
    };

    createPreferenceAndRender();
  }, [mp, paymentData, onError, preferenceId]);

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
            <p className="text-muted-foreground">Checkout Pro - Pago oficial</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-foreground mb-2">{paymentData.description}</h3>
          <p className="text-3xl font-bold text-primary">${paymentData.amount.toLocaleString('es-CL')}</p>
          <p className="text-sm text-muted-foreground mt-2">Pago único o hasta 12 cuotas sin interés</p>
        </div>
      </div>

      {/* Mostrar loading */}
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando sistema de pagos seguro...</p>
        </div>
      )}

      {/* Mostrar errores */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-400">Error en el pago</h4>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Contenedor oficial para Wallet Brick */}
      <div 
        id="walletBrick_container" 
        ref={walletContainerRef}
        className="min-h-[200px] transition-all duration-300"
      />

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
          Procesado por MercadoPago - Plataforma oficial de pagos
        </p>
      </div>

      {/* Debug info (solo en desarrollo) */}
      {preferenceId && import.meta.env.DEV && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <h4 className="font-semibold text-yellow-400 mb-2">Debug Info (desarrollo):</h4>
          <p className="text-xs text-yellow-300/80 font-mono">Preference ID: {preferenceId}</p>
          <p className="text-xs text-yellow-300/80">SDK: {mp ? '✅ Cargado' : '❌ No cargado'}</p>
        </div>
      )}
    </motion.div>
  );
};

export default MercadoPagoWalletBrick;
