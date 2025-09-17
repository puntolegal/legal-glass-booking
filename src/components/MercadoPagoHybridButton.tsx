import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Shield, Lock, AlertCircle, CheckCircle, Globe, Code } from 'lucide-react';

interface HybridButtonProps {
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

const MercadoPagoHybridButton: React.FC<HybridButtonProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Detectar si estamos en desarrollo o producción
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const isNetlifyDeploy = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.com');

  const handleHybridCheckout = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando Checkout Híbrido...');
      console.log('🌍 Entorno:', isProduction ? 'Producción' : 'Desarrollo');
      console.log('📋 Datos del pago:', paymentData);

      if (isNetlifyDeploy) {
        // Usar Netlify Function en producción
        await handleNetlifyCheckout();
      } else {
        // Mostrar opciones en desarrollo
        setShowOptions(true);
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Error en checkout híbrido:', error);
      setIsLoading(false);
      onError?.(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleNetlifyCheckout = async () => {
    try {
      console.log('📤 Usando Netlify Function...');
      
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
        throw new Error(`Error ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('✅ Preferencia creada:', result.preference_id);
      
      // Guardar datos y redirigir
      localStorage.setItem('pendingPayment', JSON.stringify({
        ...paymentData,
        preferenceId: result.preference_id,
        timestamp: Date.now(),
        method: 'mercadopago_netlify'
      }));
      
      window.location.href = result.init_point;
      
    } catch (error) {
      console.error('❌ Error en Netlify Function:', error);
      throw error;
    }
  };

  const handleManualRedirect = () => {
    console.log('🔗 Redirección manual a MercadoPago...');
    
    // Crear URL manual para testing
    const manualUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect` +
      `?title=${encodeURIComponent(paymentData.description)}` +
      `&unit_price=${paymentData.amount}` +
      `&quantity=1` +
      `&currency_id=CLP` +
      `&payer_name=${encodeURIComponent(paymentData.payer.name)}` +
      `&payer_email=${encodeURIComponent(paymentData.payer.email)}`;
    
    // Guardar datos del pago
    localStorage.setItem('pendingPayment', JSON.stringify({
      ...paymentData,
      timestamp: Date.now(),
      method: 'mercadopago_manual'
    }));
    
    // Abrir en nueva pestaña para testing
    window.open(manualUrl, '_blank');
  };

  const handleDirectMercadoPago = () => {
    console.log('🌐 Abriendo MercadoPago directamente...');
    
    // Ir directamente a MercadoPago para crear el pago manualmente
    const directUrl = `https://www.mercadopago.com.ar/`;
    
    // Guardar datos para referencia
    localStorage.setItem('pendingPayment', JSON.stringify({
      ...paymentData,
      timestamp: Date.now(),
      method: 'mercadopago_direct'
    }));
    
    window.open(directUrl, '_blank');
  };

  if (showOptions) {
    return (
      <div className="space-y-4">
        {/* Opciones de desarrollo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Code className="h-6 w-6 text-blue-600 mt-1" />
            <div className="text-blue-800">
              <h3 className="font-semibold mb-2">Modo Desarrollo - Opciones de Pago</h3>
              <p className="text-sm mb-4">
                En desarrollo local, elige cómo proceder con el pago:
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Detalles del Pago:</h4>
                <ul className="text-sm space-y-1">
                  <li><strong>Servicio:</strong> {paymentData.description}</li>
                  <li><strong>Monto:</strong> ${paymentData.amount.toLocaleString()} CLP</li>
                  <li><strong>Cliente:</strong> {paymentData.payer.name}</li>
                  <li><strong>Email:</strong> {paymentData.payer.email}</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleManualRedirect}
                  className="w-full bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Probar URL de MercadoPago</span>
                </button>
                
                <button
                  onClick={handleDirectMercadoPago}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>Ir a MercadoPago.com</span>
                </button>
                
                <button
                  onClick={() => setShowOptions(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Información sobre deploy */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-xs text-yellow-800">
              <p className="font-medium">Para Funcionamiento Completo</p>
              <p>Deploy en Netlify para usar la integración oficial con credenciales de producción.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botón principal */}
      <motion.button
        onClick={handleHybridCheckout}
        disabled={isLoading}
        className="w-full bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Preparando pago...</span>
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

      {/* Estado del entorno */}
      <div className={`${isProduction ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} border rounded-lg p-3`}>
        <div className="flex items-start space-x-2">
          {isProduction ? (
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
          ) : (
            <Code className="h-4 w-4 text-orange-600 mt-0.5" />
          )}
          <div className={`text-xs ${isProduction ? 'text-green-800' : 'text-orange-800'}`}>
            <p className="font-medium">
              {isProduction ? 'Modo Producción' : 'Modo Desarrollo'}
            </p>
            <p>
              {isProduction 
                ? 'Usando integración completa con Netlify Functions'
                : 'Opciones de testing disponibles para desarrollo local'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoHybridButton;
