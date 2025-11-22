import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, ArrowRight, Home, CreditCard } from 'lucide-react';
import SEO from '../components/SEO';
import { sendRealBookingEmails, type BookingEmailData, type EmailResult } from '@/services/realEmailService';
import { findReservaByCriteria, updatePaymentStatus, type Reserva } from '../services/supabaseBooking';
import { supabase } from '@/integrations/supabase/client';
import type { PendingPaymentData } from '@/types/payments';
import { ensurePriceFormatted, parsePendingPaymentData } from '@/utils/paymentData';
import { getMercadoPagoPaymentInfo } from '@/services/mercadopagoPaymentInfo';

interface PaymentSuccessState {
  reservation: Reserva;
  mercadopagoData: Record<string, unknown>;
  emailResult: EmailResult | null;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
  };
  servicio: {
    tipo: string;
    precio: number | string | null;
    categoria: string | null;
  };
  fecha: string;
  hora: string;
  tipo_reunion?: string | null;
  price: number | string | null | undefined;
  priceFormatted: string;
}

const extractStringFromEmailResult = (result: EmailResult | null, keys: string[]): string | undefined => {
  if (!result) {
    return undefined;
  }
  const bag = result as unknown as Record<string, unknown>;
  for (const key of keys) {
    const value = bag[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

export default function PaymentSuccessPage() {
  const [paymentData, setPaymentData] = useState<PaymentSuccessState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  useEffect(() => {
    processPaymentSuccess();
  }, []);

  const processPaymentSuccess = async () => {
    try {
      console.log('🚀 INICIANDO PaymentSuccessPage - processPaymentSuccess');
      setIsProcessing(true);
      setProcessingStatus('Procesando pago...');

      // 1. Obtener datos de la URL y localStorage (fuentes múltiples con prioridad)
      const urlParams = new URLSearchParams(window.location.search);
      const external_reference = urlParams.get('external_reference');
      const preference_id = urlParams.get('preference_id');
      const payment_id = urlParams.get('payment_id') || urlParams.get('collection_id');
      const status = urlParams.get('status') || urlParams.get('collection_status') || 'pending';

      console.log('💳 Datos de MercadoPago desde URL:');
      console.log('   external_reference:', external_reference);
      console.log('   preference_id:', preference_id);
      console.log('   payment_id:', payment_id);
      console.log('   status:', status);

      // Obtener datos de localStorage como fallback
      const storedPaymentData = localStorage.getItem('paymentData');
      const parsedStoredData = storedPaymentData ? JSON.parse(storedPaymentData) : null;
      console.log('💾 Datos en localStorage:', parsedStoredData);

      // 2. Determinar la estrategia de búsqueda (priorizar external_reference)
      let searchCriteria = null;
      
      if (external_reference) {
        searchCriteria = { external_reference };
        console.log('🔍 Estrategia: Buscar por external_reference');
      } else if (preference_id) {
        searchCriteria = { preference_id };
        console.log('🔍 Estrategia: Buscar por preference_id (fallback)');
      } else if (payment_id) {
        console.log('🔍 Estrategia: Buscar por payment_id (último recurso)');
        searchCriteria = { payment_id };
      } else if (parsedStoredData?.external_reference || parsedStoredData?.reservaId || parsedStoredData?.reservationId) {
        const localRef = parsedStoredData.external_reference || parsedStoredData.reservaId || parsedStoredData.reservationId;
        searchCriteria = { external_reference: localRef };
        console.log('🔍 Estrategia: Usar external_reference/reservaId de localStorage');
      } else {
        throw new Error('No se encontraron parámetros para buscar la reserva');
      }

      // 3. Buscar la reserva con los criterios determinados
      setProcessingStatus('Buscando reserva...');
      console.log('🔍 Buscando reserva con criterios:', searchCriteria);
      
      const result = await findReservaByCriteria(searchCriteria);
      
      if (!result.success || !result.reserva) {
        console.warn('⚠️ No se encontró reserva en BD, usando datos de localStorage');
        
        // Si no hay reserva en BD pero hay datos en localStorage y el pago fue aprobado
        if (parsedStoredData && status.toLowerCase() === 'approved') {
          console.log('💾 Usando datos de localStorage para mostrar y enviar emails');
          
          // Enviar emails con los datos disponibles
          const emailData: BookingEmailData = {
            id: parsedStoredData.reservationId || 'pending',
            nombre: parsedStoredData.nombre || 'Cliente',
            email: parsedStoredData.email || '',
            telefono: parsedStoredData.telefono || '',
            servicio: parsedStoredData.service || 'Consulta Legal',
            precio: parsedStoredData.price?.toString() || '0',
            fecha: parsedStoredData.fecha || parsedStoredData.date || new Date().toISOString().split('T')[0],
            hora: parsedStoredData.hora || parsedStoredData.time || '10:00',
            tipo_reunion: parsedStoredData.tipo_reunion || 'online',
            descripcion: parsedStoredData.description,
            created_at: new Date().toISOString()
          };

          const emailResult = await sendRealBookingEmails(emailData);
          console.log('📧 Resultado envío emails desde localStorage:', emailResult);

          // Mostrar datos desde localStorage
          const parseAmount = (value: unknown): number | undefined => {
            if (value === null || value === undefined) return undefined;
            if (typeof value === 'number' && !Number.isNaN(value)) return value;
            if (typeof value === 'string') {
              const cleaned = value.replace(/[^0-9]/g, '');
              if (!cleaned) return undefined;
              const parsed = Number(cleaned);
              return Number.isNaN(parsed) ? undefined : parsed;
            }
            return undefined;
          };

          const paymentAmount = parseAmount(parsedStoredData.price) || 35000;
          const currencyFormatter = new Intl.NumberFormat('es-CL');
          const formattedAmount = currencyFormatter.format(paymentAmount);

          setPaymentData({
            reservation: null as any,
            mercadopagoData: {
              payment_id,
              status: status.toLowerCase(),
              external_reference: external_reference || parsedStoredData.reservationId,
              collection_status: status
            },
            emailResult,
            cliente: {
              nombre: parsedStoredData.nombre || 'Cliente',
              email: parsedStoredData.email || '',
              telefono: parsedStoredData.telefono || ''
            },
            servicio: {
              tipo: parsedStoredData.service || 'Consulta Legal',
              precio: paymentAmount,
              categoria: parsedStoredData.category || 'General'
            },
            fecha: parsedStoredData.fecha || parsedStoredData.date || new Date().toISOString().split('T')[0],
            hora: parsedStoredData.hora || parsedStoredData.time || '10:00',
            tipo_reunion: parsedStoredData.tipo_reunion,
            price: paymentAmount,
            priceFormatted: formattedAmount
          });

          setIsProcessing(false);
          setIsLoading(false);
          return;
        }
        
        throw new Error('No se encontró la reserva. Por favor contacta a soporte.');
      }

      const reserva = result.reserva;
      console.log('✅ Reserva encontrada:', reserva.id);

      // 3. Actualizar estado del pago
      setProcessingStatus('Actualizando estado del pago...');
      const normalizedStatus = status.toLowerCase();
      const isApproved = normalizedStatus === 'approved';

      const updateResult = await updatePaymentStatus(reserva.id, {
        estado: isApproved ? 'approved' : status,
        id: payment_id || undefined,
        externalReference: external_reference,
        preferenceId: reserva.preference_id || undefined
      });

      if (!updateResult.success) {
        console.error('❌ Error actualizando estado:', updateResult.error);
      }

      // 4. Enviar emails SIEMPRE si el pago es aprobado
      let emailResult: EmailResult | null = null;

      if (isApproved) {
        console.log('📧 Pago aprobado - enviando emails de confirmación...');
        setProcessingStatus('Enviando emails de confirmación...');
        
        const emailData: BookingEmailData = {
          id: reserva.id,
          nombre: reserva.nombre,
          email: reserva.email,
          telefono: reserva.telefono,
          servicio: reserva.servicio,
          precio: reserva.precio,
          fecha: reserva.fecha,
          hora: reserva.hora,
          tipo_reunion: reserva.tipo_reunion || 'online',
          descripcion: reserva.descripcion,
          created_at: reserva.created_at || new Date().toISOString()
        };

        emailResult = await sendRealBookingEmails(emailData);
        
        if (emailResult.success) {
          console.log('✅ Emails enviados exitosamente');
          await supabase
            .from('reservas')
            .update({ email_enviado: true } as any)
            .eq('id', reserva.id);
        } else {
          console.error('❌ Error enviando emails:', emailResult.error);
        }
        
        setProcessingStatus('¡Pago confirmado y emails enviados!');
      } else {
        setProcessingStatus('Pago registrado');
      }

      // 5. Formatear precio para mostrar
      const parseAmount = (value: unknown): number | undefined => {
        if (value === null || value === undefined) return undefined;
        if (typeof value === 'number' && !Number.isNaN(value)) return value;
        if (typeof value === 'string') {
          const cleaned = value.replace(/[^0-9]/g, '');
          if (!cleaned) return undefined;
          const parsed = Number(cleaned);
          return Number.isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
      };

      const paymentAmount = parseAmount(reserva.precio) || 35000;
      const currencyFormatter = new Intl.NumberFormat('es-CL');
      const formattedAmount = currencyFormatter.format(paymentAmount);

      // 6. Preparar datos para mostrar en la UI
      setPaymentData({
        reservation: reserva,
        mercadopagoData: {
          payment_id,
          status: normalizedStatus,
          external_reference,
          collection_status: status
        },
        emailResult,
        cliente: {
          nombre: reserva.nombre,
          email: reserva.email,
          telefono: reserva.telefono
        },
        servicio: {
          tipo: reserva.servicio,
          precio: paymentAmount,
          categoria: 'General'
        },
        fecha: reserva.fecha,
        hora: reserva.hora,
        tipo_reunion: reserva.tipo_reunion,
        price: paymentAmount,
        priceFormatted: formattedAmount
      });

      // 7. Limpiar localStorage
      localStorage.removeItem('paymentData');
      localStorage.removeItem('pendingPayment');
      localStorage.removeItem('currentReservationId');
      localStorage.removeItem('currentExternalReference');

    } catch (error) {
      console.error('❌ ERROR CRÍTICO en PaymentSuccessPage:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('❌ Tipo de error:', typeof error);
      console.error('❌ Mensaje:', error instanceof Error ? error.message : String(error));
      setProcessingStatus(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      console.log('🏁 Finalizando processPaymentSuccess');
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const trackingCode = extractStringFromEmailResult(paymentData?.emailResult ?? null, ['trackingCode', 'tracking_code']);
  const googleMeetLink = extractStringFromEmailResult(paymentData?.emailResult ?? null, ['googleMeetLink', 'google_meet_link']);

  const isPaymentApproved = paymentData?.mercadopagoData?.status === 'approved';
  const headerTitle = isPaymentApproved ? '¡Pago confirmado!' : 'Pago registrado';
  const headerDescription = isPaymentApproved
    ? 'Tu consulta legal ha sido confirmada y el pago procesado correctamente.'
    : 'Hemos registrado tu pago y lo estamos verificando con Mercado Pago. Te avisaremos por email en cuanto se acredite.';
  const visiblePaymentStatus = paymentData?.mercadopagoData?.status || paymentData?.mercadopagoData?.collection_status || 'pendiente';
  const statusDictionary: Record<string, string> = {
    approved: 'aprobado',
    pending: 'pendiente',
    in_process: 'en proceso',
    in_mediation: 'en mediación',
    authorized: 'autorizado',
    rejected: 'rechazado',
    cancelled: 'cancelado'
  };
  const readablePaymentStatus = statusDictionary[String(visiblePaymentStatus).toLowerCase() ?? ''] || visiblePaymentStatus;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {isProcessing ? 'Procesando pago...' : 'Cargando confirmación...'}
          </h2>
          {processingStatus && (
            <p className="text-sm text-gray-600 mb-4">{processingStatus}</p>
          )}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-200/50">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Verificando datos de MercadoPago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Guardando reserva en la base de datos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Enviando emails de confirmación</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Pago Exitoso - Punto Legal"
        description="Tu pago ha sido procesado exitosamente. Tu consulta legal está confirmada."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header de éxito */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{headerTitle}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{headerDescription}</p>
          </motion.div>

          {/* Resumen de la consulta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-green-600" />
              Resumen de tu consulta
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                    </div>
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.reservation?.nombre || paymentData?.cliente?.nombre || 'Cliente'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.reservation?.email || paymentData?.cliente?.email || 'No especificado'}
                      </p>
                    </div>
                  </div>
                  
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.reservation?.telefono || paymentData?.cliente?.telefono || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.reservation?.fecha ? new Date(paymentData.reservation.fecha).toLocaleDateString('es-CL') : 
                       paymentData?.fecha ? new Date(paymentData.fecha).toLocaleDateString('es-CL') : 'No especificada'}
                      </p>
                    </div>
                  </div>
                  
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.reservation?.hora || paymentData?.hora || '10:00'} hrs
                      </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Servicio</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.reservation?.servicio || paymentData?.servicio?.tipo || 'Consulta Legal'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total pagado</span>
                <span className="text-2xl font-bold text-green-600">
                  ${paymentData?.priceFormatted ? paymentData.priceFormatted.replace('$', '') : 'Confirmado'} CLP
                </span>
              </div>
            </div>
          </motion.div>

          {/* Estado del procesamiento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              📧 Estado de confirmación
            </h3>
                <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-blue-800">Reserva guardada en la base de datos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-blue-800">Pago confirmado via MercadoPago</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-blue-800">Emails de confirmación enviados</span>
              </div>
              {paymentData?.reservation && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>ID de Reserva:</strong> {paymentData.reservation.id}
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>Estado:</strong> {paymentData.reservation.estado}
                  </p>
                  {trackingCode && (
                    <p className="text-sm text-blue-700">
                      <strong>Código de Seguimiento:</strong> {trackingCode}
                    </p>
                  )}
                  {googleMeetLink && (
                    <p className="text-sm text-blue-700">
                      <strong>Link de Google Meet:</strong> 
                      <a 
                        href={googleMeetLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline ml-1"
                      >
                        {googleMeetLink}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Información del pago */}
          {paymentData?.mercadopagoData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💳 Información del pago
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <strong>ID de Pago:</strong> {String(paymentData.mercadopagoData.payment_id || 'N/A')}
                  </p>
                  <p className="text-gray-600">
                    <strong>Estado:</strong> {String(readablePaymentStatus || 'N/A')}
                  </p>
                  <p className="text-gray-600">
                    <strong>Método:</strong> {String(paymentData.mercadopagoData.payment_type || 'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Referencia:</strong> {String(paymentData.mercadopagoData.external_reference || 'N/A')}
                  </p>
                  <p className="text-gray-600">
                    <strong>Orden:</strong> {String(paymentData.mercadopagoData.merchant_order_id || 'N/A')}
                  </p>
                  <p className="text-gray-600">
                    <strong>Procesado:</strong> {new Date().toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Información importante */}
          {isPaymentApproved ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                📧 Confirmación por email
              </h3>
              <p className="text-green-800 mb-4">
                Hemos enviado un email de confirmación a tu dirección de correo con todos los detalles de tu consulta.
              </p>
              <div className="text-sm text-green-700 space-y-2">
                <p>• Revisa tu bandeja de entrada y carpeta de spam</p>
                <p>• Guarda este email como comprobante</p>
                <p>• Si no recibes el email en 10 minutos, contáctanos</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                📬 Confirmación pendiente
              </h3>
              <p className="text-yellow-800 mb-4">
                Tu pago se encuentra en estado <strong>{String(readablePaymentStatus)}</strong>. Apenas Mercado Pago lo confirme te enviaremos un correo con todos los detalles.
              </p>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>• Puedes cerrar esta ventana con tranquilidad, guardaremos tu reserva automáticamente.</p>
                <p>• Si el pago cambia a aprobado recibirás un email de confirmación y WhatsApp de respaldo.</p>
                <p>• Ante cualquier duda escríbenos a <a href="mailto:puntolegalelgolf@gmail.com" className="text-blue-600 hover:text-blue-700 underline">puntolegalelgolf@gmail.com</a> o llámanos al <a href="tel:+56962321883" className="text-blue-600 hover:text-blue-700 underline">+569 6232 1883</a>.</p>
              </div>
            </motion.div>
          )}

          {/* Próximos pasos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Próximos pasos
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">1</span>
                </div>
                <p className="text-gray-700">Recibirás un email de confirmación con los detalles de tu consulta</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <p className="text-gray-700">Te contactaremos 24 horas antes de tu consulta para confirmar</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <p className="text-gray-700">Te enviaremos el link de la videollamada o la dirección de la oficina</p>
              </div>
            </div>
          </motion.div>

          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-gray-700 mb-4">
              Si tienes alguna duda o necesitas modificar tu reserva, no dudes en contactarnos.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">📧 Email:</span>
                <a 
                  href="mailto:puntolegalelgolf@gmail.com"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  puntolegalelgolf@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">📱 WhatsApp:</span>
                <a 
                  href="tel:+56962321883"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  +569 6232 1883
                </a>
              </div>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </Link>
            
            {paymentData?.reservation?.id && (
              <Link
                to={`/agendamiento?reserva=${paymentData.reservation.id}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Ver mi agendamiento
              </Link>
            )}
            
            <Link
              to="/servicios"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-300 transition-all duration-200 hover:scale-105"
            >
              Ver más servicios
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
} 
