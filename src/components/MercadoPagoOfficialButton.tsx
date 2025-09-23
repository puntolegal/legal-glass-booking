import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, Shield, Lock, CheckCircle, Server, AlertTriangle } from 'lucide-react';
import { createReservation } from '../services/reservationService';
import type { PendingPaymentData } from '@/types/payments';

interface PaymentData {
  amount: number;
  description: string;
  payer: {
    name: string;
    email: string;
    phone?: string;
  };
  metadata?: Record<string, unknown>;
}

interface MercadoPagoOfficialButtonProps {
  paymentData: PaymentData;
  onSuccess?: (payment: Record<string, unknown>) => void;
  onError?: (error: string) => void;
}

const MercadoPagoOfficialButton: React.FC<MercadoPagoOfficialButtonProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const metadata = (paymentData.metadata ?? {}) as Record<string, unknown>;

  const getMetadataString = (key: string, fallback?: string) => {
    const value = metadata[key];
    return typeof value === 'string' ? value : fallback;
  };

  const getMetadataBoolean = (key: string, fallback = false) => {
    const value = metadata[key];
    return typeof value === 'boolean' ? value : fallback;
  };

  const getMetadataNumber = (key: string): number | null => {
    const value = metadata[key];
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const numeric = Number(value.replace(/[^0-9]/g, ''));
      return Number.isNaN(numeric) ? null : numeric;
    }
    return null;
  };

  // Verificar estado del backend al montar el componente
  React.useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      setBackendStatus('checking');
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Agregar timeout
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackendStatus('available');
        console.log('✅ Backend MercadoPago disponible:', data);
      } else {
        setBackendStatus('unavailable');
        console.log('⚠️ Backend respondió con error:', response.status);
      }
    } catch (error) {
      setBackendStatus('unavailable');
      console.log('⚠️ Backend MercadoPago no disponible:', error.message);
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

      // Crear reserva en la base de datos primero
      console.log('💾 Creando reserva en la base de datos...');
      const reservationData = {
        cliente_nombre: paymentData.payer.name || 'Cliente',
        cliente_rut: getMetadataString('client_rut', 'No especificado'),
        cliente_email: paymentData.payer.email || 'cliente@ejemplo.com',
        cliente_telefono: paymentData.payer.phone || 'No especificado',
        fecha: getMetadataString('appointment_date', new Date().toISOString().split('T')[0]),
        hora: getMetadataString('appointment_time', '10:00'),
        descripcion: `Consulta ${paymentData.description} - Pago pendiente`,
        servicio_tipo: getMetadataString('service_name', 'Consulta General'),
        servicio_precio: paymentData.amount.toString(),
        servicio_categoria: getMetadataString('service_category', 'General'),
        tipo_reunion: getMetadataString('meeting_type', 'online'),
        estado: 'pendiente' as const
      };

      const reservation = await createReservation(reservationData);
      console.log('✅ Reserva creada:', reservation.id);

      // Persistir identificadores clave para recuperar la reserva al volver de Mercado Pago
      localStorage.setItem('currentReservationId', reservation.id);
      localStorage.setItem('currentExternalReference', reservation.id);

      // Guardar datos en localStorage para PaymentSuccessPage
      const paymentDataForStorage: PendingPaymentData = {
        id: reservation.id,
        reservationId: reservation.id,
        external_reference: reservation.id,
        nombre: paymentData.payer.name || 'Cliente',
        email: paymentData.payer.email || 'cliente@ejemplo.com',
        telefono: paymentData.payer.phone || 'No especificado',
        service: getMetadataString('service_name', paymentData.description) || paymentData.description || 'Consulta General',
        category: getMetadataString('service_category', 'General') || 'General',
        description: paymentData.description,
        price: paymentData.amount,
        priceFormatted: new Intl.NumberFormat('es-CL').format(paymentData.amount),
        originalPrice: getMetadataNumber('precio_original'),
        fecha: getMetadataString('appointment_date', new Date().toISOString().split('T')[0])!,
        hora: getMetadataString('appointment_time', '10:00')!,
        tipo_reunion: getMetadataString('meeting_type', 'online') || 'online',
        codigoConvenio: getMetadataString('codigo_convenio') || null,
        descuentoConvenio: getMetadataBoolean('descuento_convenio'),
        porcentajeDescuento: getMetadataString('porcentaje_descuento') || null,
        method: 'mercadopago_official',
        preferenceId: null,
        timestamp: Date.now()
      };

      localStorage.setItem('paymentData', JSON.stringify(paymentDataForStorage));
      console.log('💾 Datos guardados en localStorage para PaymentSuccessPage');

      // Llamar al backend oficial con el ID de la reserva
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
            date: getMetadataString('appointment_date', new Date().toISOString().split('T')[0]),
            time: getMetadataString('appointment_time', '10:00'),
            description: paymentData.description,
            external_reference: reservation.id // Usar el ID de la reserva como external_reference
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
      
      const storedPaymentData: PendingPaymentData = {
        ...paymentDataForStorage,
        preferenceId: result.preference_id ?? null
      };
      localStorage.setItem('paymentData', JSON.stringify(storedPaymentData));

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
      {/* Estado del backend */}
      {backendStatus !== 'available' && (
        <div className={`border rounded-lg p-3 ${
          backendStatus === 'unavailable'
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
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
            
            <button
              onClick={checkBackendStatus}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Reintentar
            </button>
          </div>
          
          {backendStatus === 'unavailable' && (
            <div className="mt-2 text-xs text-red-700">
              <p>Para usar la integración oficial:</p>
              <code className="bg-red-100 px-2 py-1 rounded">cd server && npm install && npm start</code>
              <p className="mt-1">O haz clic en "Reintentar" si ya está ejecutándose.</p>
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

    </div>
  );
};

export default MercadoPagoOfficialButton;
