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
      
      // 🔧 OPTIMIZACIÓN: Verificación rápida y simple
      console.log('🔍 Verificando backend MercadoPago...');
      
      // Verificar que las credenciales estén configuradas (verificación rápida)
      const { MERCADOPAGO_CONFIG } = await import('@/config/mercadopago');
      const publicKey = MERCADOPAGO_CONFIG.publicKey;
      
      if (!publicKey) {
        setBackendStatus('unavailable');
        console.log('⚠️ Public Key de MercadoPago no configurada');
        return;
      }
      
      // 🔧 OPTIMIZACIÓN: Verificación simplificada del backend
      const isProduction = import.meta.env.PROD || window.location.hostname === 'puntolegal.online';
      
      if (isProduction) {
        // En producción, verificar backend directamente con timeout corto
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
          
          const response = await fetch('https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/create-mercadopago-preference', {
            method: 'OPTIONS',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            setBackendStatus('available');
            console.log('✅ Backend disponible para MercadoPago');
          } else {
            setBackendStatus('unavailable');
            console.log('⚠️ Backend no disponible:', response.status);
          }
        } catch (error) {
          setBackendStatus('unavailable');
          console.log('⚠️ Error verificando backend:', error.message);
        }
      } else {
        // En desarrollo, verificación rápida de Supabase
        const { supabase } = await import('@/integrations/supabase/client');
        
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
          
          const { error } = await supabase
            .from('reservas')
            .select('id')
            .limit(1)
            .abortSignal(controller.signal);
          
          clearTimeout(timeoutId);
          
          if (error) {
            setBackendStatus('unavailable');
            console.log('⚠️ Error conectando con Supabase:', error.message);
          } else {
            setBackendStatus('available');
            console.log('✅ Backend Supabase disponible para MercadoPago');
          }
        } catch (error) {
          setBackendStatus('unavailable');
          console.log('⚠️ Error verificando Supabase:', error.message);
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

      // Usar backend para crear preferencia (patrón correcto según brief)
      console.log('🚀 Creando preferencia via backend...');
      
      // Usar backend según entorno (desarrollo vs producción)
      const backendUrl = import.meta.env.MODE === 'development' 
        ? 'http://localhost:3001' 
        : 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1'; // Supabase Edge Functions
      
      const response = await fetch(`${backendUrl}/create-mercadopago-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentData: {
            service: getMetadataString('service_name', paymentData.description),
            description: paymentData.description,
            price: paymentData.amount,
            name: paymentData.payer.name,
            email: paymentData.payer.email,
            phone: paymentData.payer.phone || '',
            date: getMetadataString('appointment_date', new Date().toISOString().split('T')[0]),
            time: getMetadataString('appointment_time', '10:00'),
            external_reference: reservation.id
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error backend:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        console.error('❌ Error en respuesta backend:', result.error);
        throw new Error(`Error creando preferencia: ${result.error}`);
      }
      
      console.log('✅ Preferencia creada exitosamente:', result.preference_id);
      console.log('✅ Preferencia oficial creada:', result.preference_id);
      console.log('🔍 Resultado completo en MercadoPagoOfficialButton:', JSON.stringify(result, null, 2));
      console.log('🔗 Init Point recibido:', result.init_point);
      console.log('🔗 Sandbox Init Point recibido:', result.sandbox_init_point);
        console.log('✅ Preferencia creada - Success:', result.success);
        console.log('✅ Preferencia creada - Preference ID:', result.preference_id);
      
      // Verificar que los campos necesarios estén presentes
      if (!result.preference_id) {
        console.error('❌ ERROR: result.preference_id no está presente en MercadoPagoOfficialButton');
        throw new Error('ID de preferencia no recibido');
      }
      
      if (!result.init_point) {
        console.error('❌ ERROR: result.init_point no está presente en MercadoPagoOfficialButton');
        throw new Error('Init Point no recibido');
      }
      
      // Actualizar la reserva con el preference_id para poder encontrarla después
      try {
        const { updateReservation } = await import('@/services/supabaseBooking');
        await updateReservation(reservation.id, {
          preference_id: result.preference_id,
          external_reference: reservation.id // Usar el ID de la reserva como external_reference consistente
        });
        console.log('✅ Reserva actualizada con preference_id:', result.preference_id);
        console.log('✅ External reference configurado como:', reservation.id);
      } catch (updateError) {
        console.warn('⚠️ No se pudo actualizar la reserva con preference_id:', updateError);
      }

      // Guardar datos del pago en UNA SOLA clave para evitar conflictos
      const storedPaymentData: PendingPaymentData = {
        ...paymentDataForStorage,
        preferenceId: result.preference_id ?? null,
        externalReference: reservation.id // Agregar external_reference para consistencia
      };
      localStorage.setItem('paymentData', JSON.stringify(storedPaymentData));
      console.log('✅ Datos guardados en localStorage con external_reference:', reservation.id);
      
      // 🔧 CORRECCIÓN PXI03: Detectar ambiente según el token usado (no según URL)
      // El token determina si es sandbox o producción, no la URL
      const isSandboxToken = result.live_mode === false; // Si live_mode es false = sandbox
      
      console.log('🔍 Token ambiente detectado:', isSandboxToken ? 'SANDBOX' : 'PRODUCCIÓN');
      console.log('🔍 live_mode:', result.live_mode);
      console.log('🔍 init_point disponible:', !!result.init_point);
      console.log('🔍 sandbox_init_point disponible:', !!result.sandbox_init_point);
      
      // Usar el init_point correcto según el token (no según la URL)
      const redirectUrl = isSandboxToken ? result.sandbox_init_point : result.init_point;
      
      if (redirectUrl) {
        console.log('🚀 Redirigiendo a Checkout Pro...');
        console.log(`📱 Ambiente: ${isSandboxToken ? 'SANDBOX' : 'PRODUCCIÓN'}`);
        console.log('📱 URL de redirección:', redirectUrl);
        
        // Usar window.location.assign para evitar bloqueos en móvil
        window.location.assign(redirectUrl);
      } else {
        console.error('❌ No se recibió URL de redirección para el ambiente actual');
        console.error('❌ Ambiente:', isSandboxToken ? 'SANDBOX' : 'PRODUCCIÓN');
        console.error('❌ init_point:', result.init_point);
        console.error('❌ sandbox_init_point:', result.sandbox_init_point);
        throw new Error(`No se recibió URL de redirección para ambiente ${isSandboxToken ? 'sandbox' : 'producción'}`);
      }
      
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
                Sistema de Pago: {
                  backendStatus === 'unavailable'
                    ? 'No disponible'
                    : 'Inicializando...'
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
            <span>Pagar</span>
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </motion.button>

    </div>
  );
};

export default MercadoPagoOfficialButton;
