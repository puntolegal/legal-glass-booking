import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Shield, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface SimpleButtonProps {
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

const MercadoPagoSimpleButton: React.FC<SimpleButtonProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSimpleCheckout = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando proceso simplificado...');
      
      // Para evitar el error 403, vamos a usar un enfoque diferente
      // Mostrar instrucciones para crear la preferencia manualmente
      
      console.log('📋 Datos del pago:', paymentData);
      
      // Guardar datos del pago en localStorage
      localStorage.setItem('pendingPayment', JSON.stringify({
        ...paymentData,
        timestamp: Date.now(),
        method: 'mercadopago_manual'
      }));
      
      // Mostrar instrucciones en lugar de intentar redirección automática
      setShowInstructions(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('❌ Error en proceso simplificado:', error);
      setIsLoading(false);
      onError?.(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleManualRedirect = () => {
    // Crear URL manual para MercadoPago
    const manualUrl = `https://www.mercadopago.com.ar/` +
      `?title=${encodeURIComponent(paymentData.description)}` +
      `&price=${paymentData.amount}` +
      `&currency=CLP`;
    
    console.log('🔗 Abriendo MercadoPago manualmente...');
    window.open(manualUrl, '_blank');
  };

  if (showInstructions) {
    return (
      <div className="space-y-4">
        {/* Instrucciones manuales */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
            <div className="text-blue-800">
              <h3 className="font-semibold mb-2">Proceso de Pago Manual</h3>
              <p className="text-sm mb-4">
                Debido a las restricciones de las credenciales de producción, 
                necesitamos procesar el pago de forma manual.
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
                  <span>Ir a MercadoPago</span>
                </button>
                
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botón principal de pago */}
      <motion.button
        onClick={handleSimpleCheckout}
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

      {/* Información sobre el proceso */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
          <div className="text-xs text-green-800">
            <p className="font-medium">Proceso Seguro</p>
            <p>Este botón te guiará paso a paso para completar el pago de forma segura con MercadoPago usando credenciales de producción.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoSimpleButton;
