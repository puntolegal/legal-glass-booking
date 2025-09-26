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
      
      // Verificar que las credenciales de MercadoPago estén configuradas usando configuración centralizada
      const { MERCADOPAGO_CONFIG } = await import('@/config/mercadopago');
      const accessToken = MERCADOPAGO_CONFIG.accessToken;
      const publicKey = MERCADOPAGO_CONFIG.publicKey;
      
      console.log('🔍 DEBUG MercadoPago Backend Check:', {
        accessToken: accessToken ? 'Configurado' : 'No configurado',
        publicKey: publicKey ? 'Configurado' : 'No configurado',
        isProduction: import.meta.env.PROD || window.location.hostname === 'puntolegal.online'
      });
      
      if (!accessToken || !publicKey) {
        setBackendStatus('unavailable');
        console.log('⚠️ Credenciales de MercadoPago no configuradas');
        return;
      }
      
      // En producción, verificar que la función de Supabase esté disponible
      const isProduction = import.meta.env.PROD || window.location.hostname === 'puntolegal.online';
      
      if (isProduction) {
        // Verificar conectividad con función de Supabase
        const { SUPABASE_CREDENTIALS } = await import('@/config/supabaseConfig');
        try {
          const response = await fetch(`${SUPABASE_CREDENTIALS.URL}/functions/v1/create-mercadopago-preference`, {
            method: 'OPTIONS',
            headers: {
              'Authorization': `Bearer ${SUPABASE_CREDENTIALS.PUBLISHABLE_KEY}`
            }
          });
          
          if (response.ok) {
            setBackendStatus('available');
            console.log('✅ Función de Supabase disponible para MercadoPago');
          } else {
            setBackendStatus('unavailable');
            console.log('⚠️ Función de Supabase no disponible:', response.status);
          }
        } catch (error) {
          setBackendStatus('unavailable');
          console.log('⚠️ Error verificando función de Supabase:', error.message);
        }
      } else {
        // En desarrollo, verificar conectividad con Supabase
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase
          .from('reservas')
          .select('id')
          .limit(1);
        
        if (error) {
          setBackendStatus('unavailable');
          console.log('⚠️ Error conectando con Supabase:', error.message);
        } else {
          setBackendStatus('available');
          console.log('✅ Backend Supabase disponible para MercadoPago');
        }
      }
    } catch (error) {
      setBackendStatus('unavailable');
      console.log('⚠️ Error verificando backend:', error.message);
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
        nombre: paymentData.payer.name || 'Cliente',
        rut: getMetadataString('client_rut', 'No especificado'),
        email: paymentData.payer.email || 'cliente@ejemplo.com',
        telefono: paymentData.payer.phone || 'No especificado',
        fecha: getMetadataString('appointment_date', new Date().toISOString().split('T')[0]),
        hora: getMetadataString('appointment_time', '10:00'),
        servicio: getMetadataString('service_name', 'Consulta General'),
        precio: paymentData.amount.toString(),
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
        date: getMetadataString('appointment_date', new Date().toISOString().split('T')[0])!, // For compatibility
        time: getMetadataString('appointment_time', '10:00')!, // For compatibility
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
      console.log('🔍 paymentDataForStorage:', paymentDataForStorage);
      console.log('🔍 localStorage paymentData:', localStorage.getItem('paymentData'));

      // Usar la función de Supabase directamente
      const { createCheckoutPreference } = await import('@/services/mercadopagoBackend');
      
      // Debug: Verificar URLs de retorno
      console.log('🔍 INICIO DEBUG - Verificando entorno:');
      console.log('window.location.origin:', window.location.origin);
      console.log('window.location.href:', window.location.href);
      console.log('NODE_ENV:', import.meta.env.MODE);
      
      const baseUrl = window.location.origin;
      
      // Usar URLs absolutas válidas para MercadoPago
      const backUrls = {
        success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
        failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
        pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
      };
      
      console.log('back_urls configuradas:', backUrls);

      const preferenceData = {
        items: [{
          title: `${paymentData.description} - Punto Legal`,
          quantity: 1,
          unit_price: paymentData.amount,
          currency_id: 'CLP'
        }],
        payer: {
          name: paymentData.payer.name,
          email: paymentData.payer.email,
          phone: {
            number: paymentData.payer.phone || ''
          }
        },
        back_urls: backUrls,
        auto_return: 'approved' as const,
        external_reference: reservation.id,
        notification_url: `https://www.puntolegal.online/api/mercadopago/webhook`,
        metadata: {
          reservation_id: reservation.id,
          service_name: getMetadataString('service_name', paymentData.description),
          appointment_date: getMetadataString('appointment_date', new Date().toISOString().split('T')[0]),
          appointment_time: getMetadataString('appointment_time', '10:00'),
          meeting_type: getMetadataString('meeting_type', 'online')
        }
      };
      
      console.log('🚀 Llamando a createCheckoutPreference con:', preferenceData);
      console.log('🔍 back_urls en preferenceData:', preferenceData.back_urls);
      
      const result = await createCheckoutPreference(preferenceData);
      console.log('✅ Preferencia oficial creada:', result.preference_id);
      console.log('🔍 Resultado completo en MercadoPagoOfficialButton:', JSON.stringify(result, null, 2));
      console.log('🔗 Init Point recibido:', result.init_point);
      console.log('🔗 Sandbox Init Point recibido:', result.sandbox_init_point);
      console.log('🔍 Status recibido:', result.status);
      console.log('🔍 Live Mode recibido:', result.live_mode);
      
      // Verificar que los campos necesarios estén presentes
      if (!result.preference_id) {
        console.error('❌ ERROR: result.preference_id no está presente en MercadoPagoOfficialButton');
        throw new Error('ID de preferencia no recibido');
      }
      
      if (!result.init_point) {
        console.error('❌ ERROR: result.init_point no está presente en MercadoPagoOfficialButton');
        throw new Error('Init Point no recibido');
      }
      
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
      console.log('🔗 URL de redirección:', result.init_point);
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
