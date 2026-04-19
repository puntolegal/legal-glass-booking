import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, ArrowRight, Home, CreditCard, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import BrandMark from '@/components/BrandMark';
import { sendRealBookingEmails, type BookingEmailData, type EmailResult } from '@/services/realEmailService';
import { findReservaByCriteria, updatePaymentStatus, type Reserva } from '../services/supabaseBooking';
import { supabase } from '@/integrations/supabase/client';
import type { PendingPaymentData } from '@/types/payments';
import { ensurePriceFormatted, parsePendingPaymentData } from '@/utils/paymentData';
import { getMercadoPagoPaymentInfo } from '@/services/mercadopagoPaymentInfo';
import { trackMetaEvent } from '@/services/metaConversionsService';

interface PaymentSuccessState {
  reservation: Reserva | null;
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
  source?: string;
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
            id: parsedStoredData.reservaId || parsedStoredData.reservationId || 'pending',
            nombre: parsedStoredData.nombre || 'Cliente',
            email: parsedStoredData.email || '',
            telefono: parsedStoredData.telefono || '',
            servicio: parsedStoredData.service || 'Consulta Legal',
            precio: parsedStoredData.price?.toString() || '0',
            fecha: parsedStoredData.fecha || parsedStoredData.date || new Date().toISOString().split('T')[0],
            hora: parsedStoredData.hora || parsedStoredData.time || 'Por agendar',
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
            reservation: null,
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
            priceFormatted: formattedAmount,
            source: parsedStoredData.source
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

      // 4. Enviar emails SOLO si el pago es aprobado Y no se han enviado ya (evitar duplicados con webhook)
      let emailResult: EmailResult | null = null;

      if (isApproved && !reserva.email_enviado) {
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

          // Track Purchase event via Meta CAPI
          trackMetaEvent({
            event_name: 'Purchase',
            user_data: { em: reserva.email, ph: reserva.telefono, fn: reserva.nombre },
            custom_data: {
              content_name: reserva.servicio,
              value: Number(String(reserva.precio).replace(/[^0-9]/g, '')) || 0,
              currency: 'CLP',
            },
          });
          await supabase
            .from('reservas')
            .update({ email_enviado: true } as any)
            .eq('id', reserva.id);
        } else {
          console.error('❌ Error enviando emails:', emailResult.error);
        }
        
        setProcessingStatus('¡Pago confirmado y emails enviados!');
      } else if (isApproved && reserva.email_enviado) {
        console.log('📧 Emails ya enviados previamente (webhook), no se duplican');
        setProcessingStatus('¡Pago confirmado!');
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
  const clientName = paymentData?.reservation?.nombre || paymentData?.cliente?.nombre || 'Cliente';
  const clientEmail = paymentData?.reservation?.email || paymentData?.cliente?.email || 'No especificado';
  const clientPhone = paymentData?.reservation?.telefono || paymentData?.cliente?.telefono || 'No especificado';
  const serviceName = paymentData?.reservation?.servicio || paymentData?.servicio?.tipo || 'Consulta Legal';
  const serviceDate = paymentData?.reservation?.fecha
    ? new Date(paymentData.reservation.fecha).toLocaleDateString('es-CL')
    : paymentData?.fecha
    ? new Date(paymentData.fecha).toLocaleDateString('es-CL')
    : 'No especificada';
  const serviceTime = `${paymentData?.reservation?.hora || paymentData?.hora || '10:00'} hrs`;
  const totalFormatted = paymentData?.priceFormatted ? `$${paymentData.priceFormatted}` : 'Confirmado';
  const agendarUrl = `/agendamiento?postpago=1&email=${encodeURIComponent(clientEmail)}&nombre=${encodeURIComponent(clientName)}&telefono=${encodeURIComponent(clientPhone)}&servicio=${encodeURIComponent(serviceName)}`;
  const whatsappPostPago = `https://wa.me/56962321883?text=${encodeURIComponent(`Hola, acabo de pagar mi consulta (${serviceName}). Necesito agendar mi sesión. Soy ${clientName}.`)}`;

  // Vista específica para Express QR (post-pago)
  if (paymentData?.source === 'express_qr') {
    const whatsappExpress = `https://wa.me/56962321883?text=${encodeURIComponent(`Hola, acabo de pagar mi consulta Express ($25.000) desde el código QR. Necesito agendar mi sesión online. Soy ${clientName}.`)}`;
    return (
      <>
        <SEO title="Pago Confirmado - Consulta Express | Punto Legal" description="Tu consulta online está confirmada. Te contactaremos por WhatsApp para coordinar." />
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans antialiased">
          <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 py-4 px-4">
            <div className="max-w-lg mx-auto flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Punto Legal</span>
            </div>
          </header>
          <main className="max-w-lg mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto border-2 border-emerald-500/40">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">PAGO CONFIRMADO</h1>
              <p className="text-slate-600">Tu consulta Express de $25.000 está confirmada.</p>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 text-left space-y-4">
                <p className="text-slate-900 font-bold">Próximo paso:</p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Un abogado te contactará por WhatsApp en menos de 2 horas para coordinar tu sesión online por videollamada.
                </p>
              </div>
              <a
                href={whatsappExpress}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                CONFIRMAR POR WHATSAPP
              </a>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  // Vista específica para urgencia penal (post-pago)
  if (paymentData?.source === 'urgencia') {
    const whatsappUrgencia = `https://wa.me/56962321883?text=${encodeURIComponent('Hola, acabo de activar la defensa de urgencia. Necesito hablar con el director.')}`;
    return (
      <>
        <SEO title="Pago Confirmado - Urgencia Penal | Punto Legal" description="El equipo legal ha sido activado. Un abogado se dirige a la unidad." />
        <div className="min-h-screen bg-black text-white font-sans antialiased">
          <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
            <div className="max-w-lg mx-auto px-4 py-4 flex justify-center">
              <BrandMark size="sm" />
            </div>
          </header>
          <main className="max-w-lg mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">PAGO CONFIRMADO</h1>
              <p className="text-slate-400">El equipo legal ha sido activado.</p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left space-y-4">
                <p className="text-white font-medium">Instrucción:</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Indique al funcionario policial que su defensa está a cargo de <strong className="text-white">Punto Legal</strong>. Un abogado se dirige a la unidad ahora mismo.
                </p>
              </div>
              <a
                href={whatsappUrgencia}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                HABLAR CON DIRECTOR
              </a>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-500/30 border-t-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {isProcessing ? 'Procesando pago...' : 'Cargando confirmación...'}
          </h2>
          {processingStatus && (
            <p className="text-sm text-slate-400 mb-4">{processingStatus}</p>
          )}
          <div className="rounded-2xl p-5 bg-white/[0.04] border border-white/[0.08]">
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Verificando datos de MercadoPago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Guardando reserva en la base de datos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <BrandMark size="sm" />
            <div className="flex items-center gap-2 text-xs text-emerald-300/90">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              Pago confirmado
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Header de éxito */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{headerTitle}</h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">{headerDescription}</p>
          </motion.div>

          {/* Resumen de la consulta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-6 md:p-8 mb-6 backdrop-blur-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              Resumen de tu consulta
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <User className="w-5 h-5 text-emerald-400" />
                    </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Cliente</p>
                    <p className="font-semibold text-white">
                      {paymentData?.reservation?.nombre || paymentData?.cliente?.nombre || 'Cliente'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                    <p className="font-semibold text-white">
                      {paymentData?.reservation?.email || paymentData?.cliente?.email || 'No especificado'}
                      </p>
                    </div>
                  </div>
                  
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Teléfono</p>
                    <p className="font-semibold text-white">
                      {paymentData?.reservation?.telefono || paymentData?.cliente?.telefono || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Fecha</p>
                    <p className="font-semibold text-white">
                      {paymentData?.reservation?.fecha ? new Date(paymentData.reservation.fecha).toLocaleDateString('es-CL') : 
                       paymentData?.fecha ? new Date(paymentData.fecha).toLocaleDateString('es-CL') : 'A coordinar'}
                      </p>
                    </div>
                  </div>
                  
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Hora</p>
                    <p className="font-semibold text-white">
                      {paymentData?.reservation?.hora || paymentData?.hora || 'A coordinar'}
                      </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Servicio</p>
                    <p className="font-semibold text-white">
                      {paymentData?.reservation?.servicio || paymentData?.servicio?.tipo || 'Consulta Legal'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/[0.06] pt-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Total pagado</span>
                <span className="text-2xl font-bold text-emerald-400">
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
            className="rounded-2xl p-6 mb-6 bg-white/[0.03] border border-white/[0.06]"
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Estado de confirmación
            </h3>
                <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">Reserva guardada en la base de datos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">Pago confirmado vía MercadoPago</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">Emails de confirmación enviados</span>
              </div>
              {paymentData?.reservation && (
                <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-[11px] text-slate-500">
                    <strong className="text-slate-400">ID de Reserva:</strong> {paymentData.reservation.id}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    <strong className="text-slate-400">Estado:</strong> {paymentData.reservation.estado}
                  </p>
                  {trackingCode && (
                    <p className="text-[11px] text-slate-500">
                      <strong className="text-slate-400">Código de Seguimiento:</strong> {trackingCode}
                    </p>
                  )}
                  {googleMeetLink && (
                    <p className="text-[11px] text-slate-500">
                      <strong className="text-slate-400">Link de Google Meet:</strong>
                      <a
                        href={googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:text-cyan-200 underline ml-1"
                      >
                        Unirse
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
              className="rounded-2xl p-6 mb-6 bg-white/[0.03] border border-white/[0.06]"
            >
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Información del pago
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-[11px]">
                <div>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">ID de Pago:</strong> {String(paymentData.mercadopagoData.payment_id || 'N/A')}
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Estado:</strong> {String(readablePaymentStatus || 'N/A')}
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Método:</strong> {String(paymentData.mercadopagoData.payment_type || 'MercadoPago')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Referencia:</strong> {String(paymentData.mercadopagoData.external_reference || 'N/A')}
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Procesado:</strong> {new Date().toLocaleString('es-CL')}
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
              className="rounded-2xl p-6 mb-6 bg-emerald-500/[0.08] border border-emerald-500/20"
            >
              <h3 className="text-sm font-bold text-emerald-300 mb-3">
                Confirmación por email
              </h3>
              <p className="text-slate-300 mb-4 text-sm">
                Hemos enviado un email de confirmación a tu dirección de correo con todos los detalles de tu consulta.
              </p>
              <div className="text-xs text-slate-400 space-y-2">
                <p>• Revisa tu bandeja de entrada y carpeta de spam</p>
                <p>• Un abogado te contactará por WhatsApp en menos de 2 horas</p>
                <p>• Si no recibes el email en 10 minutos, contáctanos</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-6 mb-6 bg-amber-500/[0.08] border border-amber-500/20"
            >
              <h3 className="text-sm font-bold text-amber-300 mb-3">
                Confirmación pendiente
              </h3>
              <p className="text-slate-300 mb-4 text-sm">
                Tu pago se encuentra en estado <strong className="text-amber-300">{String(readablePaymentStatus)}</strong>. Apenas Mercado Pago lo confirme te enviaremos un correo con todos los detalles.
              </p>
              <div className="text-xs text-slate-400 space-y-2">
                <p>• Puedes cerrar esta ventana con tranquilidad, guardaremos tu reserva automáticamente.</p>
                <p>• Ante cualquier duda escríbenos a <a href="mailto:puntolegalelgolf@gmail.com" className="text-cyan-300 hover:text-cyan-200 underline">puntolegalelgolf@gmail.com</a> o WhatsApp <a href="tel:+56962321883" className="text-cyan-300 hover:text-cyan-200 underline">+569 6232 1883</a>.</p>
              </div>
            </motion.div>
          )}

          {/* Próximos pasos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-6 mb-6 bg-white/[0.03] border border-white/[0.06]"
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Próximos pasos
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-400">1</span>
                </div>
                <p className="text-slate-300 text-sm">Recibirás un email de confirmación con los detalles</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-400">2</span>
                </div>
                <p className="text-slate-300 text-sm">Un abogado te contactará por WhatsApp en menos de 2 horas</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-400">3</span>
                </div>
                <p className="text-slate-300 text-sm">Coordinarás fecha y hora de tu sesión de 45 min</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Principal: Agendar sesión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-3xl p-6 mb-6 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
            }}
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 text-center">
              Siguiente paso
            </p>
            <p className="text-white font-semibold text-center mb-4">
              Elige fecha y hora para tu sesión de 45 min
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={agendarUrl}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
                style={{ boxShadow: '0 4px 20px rgba(79,70,229,0.4)' }}
              >
                <Calendar className="w-5 h-5" />
                Agendar mi sesión
              </Link>
              <a
                href={whatsappPostPago}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                Hablar por WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Botones secundarios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white font-medium py-3 px-6 rounded-xl border border-white/[0.08] transition-all"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
            <Link
              to="/servicios"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white font-medium py-3 px-6 rounded-xl border border-white/[0.08] transition-all"
            >
              Ver más servicios
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* WhatsApp flotante */}
      <a
        href={whatsappPostPago}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 group"
      >
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 px-3 py-2 rounded-2xl text-white text-xs font-bold shadow-2xl flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <span className="relative flex h-2 w-2 flex-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Hablar ahora
        </div>
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.5)] flex items-center justify-center transition-transform hover:scale-110 border border-emerald-300/50 group">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
      </a>
    </>
  );
} 
