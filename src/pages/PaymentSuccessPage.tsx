import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, ArrowRight, Home, CreditCard } from 'lucide-react';
import SEO from '../components/SEO';
import { sendRealBookingEmails, type BookingEmailData, type EmailResult } from '@/services/realEmailService';
import { findReservaByCriteria, updatePaymentStatus, type Reserva } from '../services/supabaseBooking';
import type { PendingPaymentData } from '@/types/payments';
import { ensurePriceFormatted, parsePendingPaymentData } from '@/utils/paymentData';

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
  const bag = result as Record<string, unknown>;
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
      setProcessingStatus('Procesando datos del pago...');

      const urlParams = new URLSearchParams(window.location.search);
      const mercadopagoData = {
        collection_id: urlParams.get('collection_id'),
        collection_status: urlParams.get('collection_status'),
        payment_id: urlParams.get('payment_id'),
        status: urlParams.get('status'),
        external_reference: urlParams.get('external_reference'),
        payment_type: urlParams.get('payment_type'),
        merchant_order_id: urlParams.get('merchant_order_id'),
        preference_id: urlParams.get('preference_id'),
        site_id: urlParams.get('site_id'),
        processing_mode: urlParams.get('processing_mode'),
        source: urlParams.get('source')
      };

      console.log('💳 Datos de MercadoPago:', mercadopagoData);
      console.log('🌐 URL completa:', window.location.href);

      const normalizedStatus = (mercadopagoData.status || mercadopagoData.collection_status || '').toLowerCase();
      const paymentIdFromUrl =
        mercadopagoData.payment_id ||
        mercadopagoData.collection_id ||
        mercadopagoData.merchant_order_id ||
        undefined;

      const storedData = localStorage.getItem('paymentData');
      const storedReservationId = localStorage.getItem('currentReservationId');
      const storedExternalReference = localStorage.getItem('currentExternalReference');

      let pendingPayment: PendingPaymentData | null = null;
      if (storedData) {
        try {
          pendingPayment = parsePendingPaymentData(storedData);
        } catch (parseError) {
          console.warn('⚠️ No se pudo parsear paymentData desde localStorage:', parseError);
        }
      }

      console.log('📋 Datos de pago almacenados:', pendingPayment);

      const candidateReservationIds = new Set<string>();
      [
        pendingPayment?.reservationId,
        pendingPayment?.id,
        storedReservationId,
        storedExternalReference,
        mercadopagoData.external_reference
      ]
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .forEach(value => candidateReservationIds.add(value));

      let reserva: Reserva | undefined;

      const fallbackEmail = pendingPayment?.email;

      for (const candidateId of candidateReservationIds) {
        setProcessingStatus(`Verificando reserva ${candidateId}...`);
        const result = await findReservaByCriteria({ reservationId: candidateId });
        if (result.success && result.reserva) {
          reserva = result.reserva;
          break;
        }
      }

      if (!reserva && mercadopagoData.external_reference) {
        setProcessingStatus('Buscando reserva por referencia externa...');
        const result = await findReservaByCriteria({ externalReference: mercadopagoData.external_reference });
        if (result.success && result.reserva) {
          reserva = result.reserva;
        }
      }

      if (!reserva && paymentIdFromUrl) {
        setProcessingStatus('Buscando reserva por ID de pago...');
        const result = await findReservaByCriteria({ pagoId: paymentIdFromUrl });
        if (result.success && result.reserva) {
          reserva = result.reserva;
        }
      }

      if (!reserva && fallbackEmail) {
        setProcessingStatus('Buscando reserva por email...');
        const result = await findReservaByCriteria({ email: fallbackEmail });
        if (result.success && result.reserva) {
          reserva = result.reserva;
        }
      }

      if (!reserva) {
        throw new Error('No se encontró la reserva asociada al pago. Contacta a soporte con el comprobante.');
      }

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

      const paymentAmount =
        parseAmount(pendingPayment?.price) ??
        parseAmount(pendingPayment?.priceFormatted) ??
        parseAmount(reserva.servicio_precio) ??
        (typeof reserva.pago_monto === 'number' ? reserva.pago_monto : undefined);

      const currencyFormatter = new Intl.NumberFormat('es-CL');
      const fallbackReservationAmount = parseAmount(reserva.servicio_precio);
      const formattedAmount = paymentAmount !== undefined
        ? currencyFormatter.format(paymentAmount)
        : pendingPayment
          ? ensurePriceFormatted(pendingPayment)
          : fallbackReservationAmount !== undefined
            ? currencyFormatter.format(fallbackReservationAmount)
            : '—';

      setProcessingStatus('Actualizando estado del pago en la base de datos...');

      const updateResult = await updatePaymentStatus(reserva.id, {
        estado: normalizedStatus || mercadopagoData.status || 'pending',
        id: paymentIdFromUrl || undefined,
        metodo: mercadopagoData.payment_type || reserva.pago_metodo || 'mercadopago',
        tipo: mercadopagoData.payment_type || undefined,
        monto: paymentAmount,
        externalReference: mercadopagoData.external_reference || reserva.id,
        preferenceId: mercadopagoData.preference_id || undefined
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'No se pudo actualizar el estado del pago.');
      }

      const updatedReservation = updateResult.reserva ?? reserva;
      const isApproved = normalizedStatus === 'approved';

      let emailResult: EmailResult | null = null;

      if (isApproved) {
        if (updateResult.emailSent) {
          console.log('✅ Email de confirmación enviado desde flujo principal');
          emailResult = {
            success: true,
            message: 'Confirmación enviada en flujo principal'
          };
        } else {
          setProcessingStatus('Pago aprobado, enviando emails de respaldo...');
          const emailData: BookingEmailData = {
            id: updatedReservation.id,
            cliente_nombre: updatedReservation.cliente_nombre,
            cliente_email: updatedReservation.cliente_email,
            cliente_telefono: updatedReservation.cliente_telefono,
            servicio_tipo: updatedReservation.servicio_tipo || pendingPayment?.service || 'Consulta General',
            servicio_precio:
              typeof updatedReservation.servicio_precio === 'string'
                ? updatedReservation.servicio_precio
                : paymentAmount?.toString() || '35000',
            fecha: updatedReservation.fecha,
            hora: updatedReservation.hora,
            tipo_reunion: updatedReservation.tipo_reunion || pendingPayment?.tipo_reunion,
            descripcion: updatedReservation.descripcion || undefined,
            pago_metodo: 'MercadoPago',
            pago_estado: 'aprobado',
            created_at: updatedReservation.created_at || new Date().toISOString()
          };

          console.log('📧 Enviando emails de respaldo via Resend:', emailData);
          emailResult = await sendRealBookingEmails(emailData);
        }
        setProcessingStatus('¡Pago aprobado y reserva confirmada!');
      } else {
        setProcessingStatus('Pago registrado, pendiente de confirmación final por Mercado Pago.');
      }

      setPaymentData({
        reservation: updatedReservation,
        mercadopagoData: {
          ...mercadopagoData,
          status: normalizedStatus || mercadopagoData.status,
          payment_id: paymentIdFromUrl || mercadopagoData.payment_id,
          collection_status: mercadopagoData.collection_status || normalizedStatus
        },
        emailResult,
        cliente: {
          nombre: pendingPayment?.nombre || updatedReservation.cliente_nombre || 'Cliente',
          email: pendingPayment?.email || updatedReservation.cliente_email || 'No especificado',
          telefono: pendingPayment?.telefono || updatedReservation.cliente_telefono || 'No especificado'
        },
        servicio: {
          tipo: pendingPayment?.service || updatedReservation.servicio_tipo || 'Consulta General',
          precio:
            paymentAmount ??
            pendingPayment?.price ??
            updatedReservation.servicio_precio ??
            '35000',
          categoria: pendingPayment?.category || updatedReservation.servicio_categoria || 'General'
        },
        fecha: pendingPayment?.fecha || updatedReservation.fecha,
        hora: pendingPayment?.hora || updatedReservation.hora,
        tipo_reunion: pendingPayment?.tipo_reunion || updatedReservation.tipo_reunion,
        price:
          paymentAmount ??
          pendingPayment?.price ??
          updatedReservation.servicio_precio,
        priceFormatted: formattedAmount
      });

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
  const readablePaymentStatus = statusDictionary[visiblePaymentStatus?.toLowerCase?.() ?? ''] || visiblePaymentStatus;

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
                      {paymentData?.reservation?.cliente_nombre || paymentData?.cliente?.nombre || 'Cliente'}
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
                      {paymentData?.reservation?.cliente_email || paymentData?.cliente?.email || 'No especificado'}
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
                      {paymentData?.reservation?.cliente_telefono || paymentData?.cliente?.telefono || 'No especificado'}
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
                      {paymentData?.reservation?.servicio_tipo || paymentData?.servicio?.tipo || 'Consulta Legal'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total pagado</span>
                <span className="text-2xl font-bold text-green-600">
                  ${paymentData?.priceFormatted ?? 'Confirmado'}
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
                    <strong>ID de Pago:</strong> {paymentData.mercadopagoData.payment_id || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Estado:</strong> {readablePaymentStatus || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Método:</strong> {paymentData.mercadopagoData.payment_type || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Referencia:</strong> {paymentData.mercadopagoData.external_reference || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <strong>Orden:</strong> {paymentData.mercadopagoData.merchant_order_id || 'N/A'}
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
                Tu pago se encuentra en estado <strong>{readablePaymentStatus}</strong>. Apenas Mercado Pago lo confirme te enviaremos un correo con todos los detalles.
              </p>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>• Puedes cerrar esta ventana con tranquilidad, guardaremos tu reserva automáticamente.</p>
                <p>• Si el pago cambia a aprobado recibirás un email de confirmación y WhatsApp de respaldo.</p>
                <p>• Ante cualquier duda escríbenos a <a href="mailto:contacto@puntolegal.online" className="underline">contacto@puntolegal.online</a>.</p>
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
