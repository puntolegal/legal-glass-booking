import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  ArrowRight,
  Home,
  CreditCard,
  MessageCircle,
  Download,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import SEO from '../components/SEO';
import { UrgenciaPenalFocusLayout } from '@/components/urgencia/UrgenciaPenalFocusLayout';
import { sendRealBookingEmails, type BookingEmailData, type EmailResult } from '@/services/realEmailService';
import { findReservaByCriteria, getReservaById, updatePaymentStatus, syncIntakeCitaFromReserva, type Reserva } from '../services/supabaseBooking';
import { supabase } from '@/integrations/supabase/client';
import { trackMetaEvent } from '@/services/metaConversionsService';
import { buildBookingIcs, downloadBookingIcsFile, hasConcreteBookingSlot } from '@/utils/bookingIcs';
import { useTheme } from '@/hooks/useTheme';
import { LaboralThemeToggle } from '@/components/servicios/LaboralThemeToggle';

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
  /** Texto listo para UI (número formateado o "Gratis") */
  priceFormatted: string;
  /** true si monto CLP es 0 o precio marcado como gratuito */
  isFreeConsult: boolean;
  source?: string;
  /** Correo ya enviado antes (p. ej. webhook); no hubo nuevo `emailResult` */
  emailPreviouslySent?: boolean;
  /** Webhook encoló Zapier; esperando Meet + clever-action */
  calendarEmailPending?: boolean;
}

/** Monto en pesos; 0 es válido (consulta gratuita). No usar `||` tras parsear. */
function parseClpAmount(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const t = value.trim().toLowerCase();
    if (t === 'gratis' || t === 'gratuito' || t === 'free') return 0;
    const digits = value.replace(/[^0-9]/g, '');
    if (!digits) return undefined;
    const parsed = parseInt(digits, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function resolvePriceForSuccess(
  precioRaw: unknown,
  storedPrice?: unknown,
): { amount: number; isFree: boolean; formatted: string } {
  const a = parseClpAmount(precioRaw);
  const b = parseClpAmount(storedPrice);
  const amount = a !== undefined ? a : b !== undefined ? b : 0;
  const isFree = amount === 0;
  const formatted = isFree
    ? 'Gratis'
    : new Intl.NumberFormat('es-CL').format(amount);
  return { amount, isFree, formatted };
}

/** Ya eligió fecha y hora en el agendamiento (no mostrar CTA de reagendar). */
function slotAlreadyScheduled(pd: PaymentSuccessState | null): boolean {
  if (!pd) return false;
  const fecha = pd.reservation?.fecha ?? pd.fecha;
  const hora = String(pd.reservation?.hora ?? pd.hora ?? '').trim();
  if (!fecha || !hora) return false;
  const h = hora.toLowerCase();
  if (h.includes('coordinar') || h.includes('agendar') || h === 'por agendar') return false;
  if (h.includes('urgencia')) return false;
  return true;
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const shellGlass = theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark';
  const cardGlass = theme === 'light' ? 'glass-ios-card-light' : 'glass-ios-card-dark';
  const iconTileClass =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white/80 text-emerald-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-md dark:border-white/[0.1] dark:bg-white/[0.07] dark:text-emerald-300';
  const stepBadgeClass =
    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white/85 text-[11px] font-bold tabular-nums text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-md dark:border-white/[0.12] dark:bg-white/[0.06] dark:text-slate-100';

  useEffect(() => {
    processPaymentSuccess();
  }, []);

  const processPaymentSuccess = async () => {
    try {
      setLoadError(null);
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
            created_at: new Date().toISOString(),
            external_reference: parsedStoredData.external_reference || external_reference || undefined,
            agendamiento_intake_id: parsedStoredData.agendamiento_intake_id || undefined,
          };

          const emailResult = await sendRealBookingEmails(emailData);
          console.log('📧 Resultado envío emails desde localStorage:', emailResult);

          const { amount: paymentAmount, isFree: isFreeLs, formatted: formattedAmount } =
            resolvePriceForSuccess(parsedStoredData.price);

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
            hora: parsedStoredData.hora || parsedStoredData.time || 'Por agendar',
            tipo_reunion: parsedStoredData.tipo_reunion,
            price: paymentAmount,
            priceFormatted: formattedAmount,
            isFreeConsult: isFreeLs,
            source: parsedStoredData.source
          });

          setIsProcessing(false);
          setIsLoading(false);
          return;
        }

        // Pago aprobado (p. ej. offline / prueba) con referencia pero sin fila en BD ni datos locales
        if (status.toLowerCase() === 'approved' && external_reference) {
          const nombre =
            (typeof parsedStoredData?.nombre === 'string' && parsedStoredData.nombre) ||
            urlParams.get('nombre') ||
            'Cliente';
          const email =
            (typeof parsedStoredData?.email === 'string' && parsedStoredData.email) ||
            urlParams.get('email') ||
            '';
          const telefono =
            (typeof parsedStoredData?.telefono === 'string' && parsedStoredData.telefono) ||
            urlParams.get('telefono') ||
            '';
          const servicioNombre =
            (typeof parsedStoredData?.service === 'string' && parsedStoredData.service) ||
            urlParams.get('servicio') ||
            'Consulta Legal';
          const categoria =
            (typeof parsedStoredData?.category === 'string' && parsedStoredData.category) || 'General';
          const { amount: paymentAmount, isFree: isFreeSynth, formatted: formattedSynth } =
            resolvePriceForSuccess(parsedStoredData?.price);

          console.warn('⚠️ Éxito mínimo: no hay reserva en BD ni paymentData en localStorage');

          setPaymentData({
            reservation: null,
            mercadopagoData: {
              payment_id,
              status: 'approved',
              external_reference,
              collection_status: status,
            },
            emailResult: null,
            cliente: { nombre, email, telefono },
            servicio: {
              tipo: servicioNombre,
              precio: paymentAmount,
              categoria,
            },
            fecha: new Date().toISOString().split('T')[0],
            hora: 'Por agendar',
            tipo_reunion: 'online',
            price: paymentAmount,
            priceFormatted: formattedSynth,
            isFreeConsult: isFreeSynth,
            source: typeof parsedStoredData?.source === 'string' ? parsedStoredData.source : undefined,
          });
          setIsProcessing(false);
          setIsLoading(false);
          return;
        }

        throw new Error('No se encontró la reserva. Por favor contacta a soporte.');
      }

      const reserva = result.reserva;
      console.log('✅ Reserva encontrada:', reserva.id);

      await syncIntakeCitaFromReserva(reserva.id);

      const priceResolved = resolvePriceForSuccess(reserva.precio, parsedStoredData?.price);

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

      // 4. Enviar emails SOLO si el pago es aprobado Y no se han enviado ya (evitar duplicados con webhook / Zapier)
      let emailResult: EmailResult | null = null;
      const emailPreviouslySent = Boolean(isApproved && reserva.email_enviado);
      const calendarQueuePending =
        isApproved &&
        reserva.confirmation_email_status === 'pending_calendar' &&
        !reserva.email_enviado;

      if (isApproved && !reserva.email_enviado && !calendarQueuePending) {
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
          created_at: reserva.created_at || new Date().toISOString(),
          external_reference: reserva.external_reference ?? external_reference ?? undefined,
          agendamiento_intake_id: reserva.agendamiento_intake_id ?? undefined,
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
              value: priceResolved.amount,
              currency: 'CLP',
            },
          });
          await supabase
            .from('reservas')
            .update({ email_enviado: true, email_enviado_at: new Date().toISOString() } as any)
            .eq('id', reserva.id);
        } else {
          console.error('❌ Error enviando emails:', emailResult.error);
        }
        
        setProcessingStatus('¡Pago confirmado y emails enviados!');
      } else if (isApproved && calendarQueuePending) {
        console.log('📅 Cola Zapier activa: no enviamos correo desde el cliente');
        setProcessingStatus('Preparando tu videollamada y el correo de confirmación…');
        emailResult = null;
      } else if (isApproved && reserva.email_enviado) {
        console.log('📧 Emails ya enviados previamente (webhook), no se duplican');
        setProcessingStatus('¡Pago confirmado!');
      } else {
        setProcessingStatus('Pago registrado');
      }

      const storedSource =
        typeof parsedStoredData?.source === 'string' ? parsedStoredData.source : undefined;

      // 5–6. Precio para UI (0 = consulta gratuita; no usar `|| 35000` tras parsear)
      setPaymentData({
        reservation: reserva,
        mercadopagoData: {
          payment_id,
          status: normalizedStatus,
          external_reference,
          collection_status: status
        },
        emailResult,
        emailPreviouslySent,
        calendarEmailPending: calendarQueuePending,
        cliente: {
          nombre: reserva.nombre,
          email: reserva.email,
          telefono: reserva.telefono
        },
        servicio: {
          tipo: reserva.servicio,
          precio: priceResolved.amount,
          categoria: 'General'
        },
        fecha: reserva.fecha,
        hora: reserva.hora,
        tipo_reunion: reserva.tipo_reunion,
        price: priceResolved.amount,
        priceFormatted: priceResolved.formatted,
        isFreeConsult: priceResolved.isFree,
        source: storedSource
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
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      setProcessingStatus(`Error: ${msg}`);
      setLoadError(msg);
      setPaymentData(null);
    } finally {
      console.log('🏁 Finalizando processPaymentSuccess');
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  /** Reconsultar reserva mientras Zapier + clever-action completan el correo con Meet. */
  useEffect(() => {
    const rid = paymentData?.reservation?.id;
    const pending = paymentData?.calendarEmailPending;
    if (!rid || !pending) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 36;

    const tick = async () => {
      if (cancelled) return;
      attempts += 1;
      const r = await getReservaById(rid);
      if (cancelled || !r.success || !r.reserva) return;

      const nr = r.reserva;
      if (nr.email_enviado) {
        setPaymentData((prev) => {
          if (!prev?.reservation || prev.reservation.id !== rid) return prev;
          return {
            ...prev,
            reservation: { ...prev.reservation, ...nr },
            calendarEmailPending: false,
            emailPreviouslySent: true,
          };
        });
        return;
      }
      if (nr.confirmation_email_status === 'failed') {
        setPaymentData((prev) => {
          if (!prev?.reservation || prev.reservation.id !== rid) return prev;
          return {
            ...prev,
            reservation: { ...prev.reservation, ...nr },
            calendarEmailPending: false,
          };
        });
        return;
      }
      if (nr.google_meet_link) {
        setPaymentData((prev) => {
          if (!prev?.reservation || prev.reservation.id !== rid) return prev;
          return {
            ...prev,
            reservation: { ...prev.reservation, ...nr },
          };
        });
      }
      if (attempts >= maxAttempts) {
        setPaymentData((prev) => {
          if (!prev?.calendarEmailPending || prev.reservation?.id !== rid) return prev;
          return { ...prev, calendarEmailPending: false };
        });
      }
    };

    const id = setInterval(() => {
      void tick();
    }, 2500);
    void tick();
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [paymentData?.calendarEmailPending, paymentData?.reservation?.id]);

  const trackingCode = extractStringFromEmailResult(paymentData?.emailResult ?? null, ['trackingCode', 'tracking_code']);
  const googleMeetLink =
    extractStringFromEmailResult(paymentData?.emailResult ?? null, ['googleMeetLink', 'google_meet_link']) ||
    (typeof paymentData?.reservation?.google_meet_link === 'string'
      ? paymentData.reservation.google_meet_link
      : undefined);

  const isPaymentApproved = paymentData?.mercadopagoData?.status === 'approved';
  const isFreeConsult =
    Boolean(paymentData) &&
    Boolean(paymentData!.isFreeConsult || resolvePriceForSuccess(paymentData!.price).isFree);
  const scheduledSlot = slotAlreadyScheduled(paymentData);

  const headerTitle = isPaymentApproved
    ? isFreeConsult
      ? '¡Consulta confirmada!'
      : '¡Pago confirmado!'
    : 'Pago registrado';
  const headerDescription = isPaymentApproved
    ? isFreeConsult
      ? 'Confirmamos tu consulta gratuita. Más abajo tienes el resumen y los siguientes pasos.'
      : 'Confirmamos tu pago y la consulta. Más abajo tienes el resumen y los siguientes pasos.'
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
    : 'A coordinar';
  const rawHora = String(paymentData?.reservation?.hora || paymentData?.hora || 'A coordinar');
  const serviceTime = /agendar|coordinar/i.test(rawHora) ? rawHora : `${rawHora} hrs`;
  const agendarUrl = `/agendamiento?postpago=1&email=${encodeURIComponent(clientEmail)}&nombre=${encodeURIComponent(clientName)}&telefono=${encodeURIComponent(clientPhone)}&servicio=${encodeURIComponent(serviceName)}`;
  const waTextPostPago = isFreeConsult
    ? `Hola, acabo de confirmar mi consulta gratuita (${serviceName}). Quiero dejar coordinada mi sesión. Soy ${clientName}.`
    : `Hola, acabo de pagar mi consulta (${serviceName}). Necesito coordinar o tengo una duda. Soy ${clientName}.`;
  const whatsappPostPago = `https://wa.me/56962321883?text=${encodeURIComponent(waTextPostPago)}`;

  const emailConfirmationStatus = (() => {
    const er = paymentData?.emailResult;
    if (!isPaymentApproved) {
      return {
        Icon: Clock,
        iconClass: 'text-amber-400',
        text: 'El correo con los detalles se enviará cuando el pago quede acreditado.',
        detail: undefined as string | undefined,
      };
    }
    if (paymentData?.calendarEmailPending) {
      return {
        Icon: Clock,
        iconClass: 'text-emerald-500 dark:text-emerald-400',
        text: 'Estamos generando el enlace de videollamada y enviando tu correo de confirmación.',
        detail: 'Suele tardar menos de un minuto. También revisa tu bandeja de entrada.',
      };
    }
    if (
      paymentData?.reservation?.confirmation_email_status === 'failed' &&
      !paymentData?.emailPreviouslySent &&
      !er?.success
    ) {
      return {
        Icon: XCircle,
        iconClass: 'text-rose-400',
        text: 'No pudimos completar el envío automático con videollamada.',
        detail: 'Si no recibes el correo en unos minutos, escríbenos por WhatsApp.',
      };
    }
    if (er?.success) {
      return {
        Icon: CheckCircle,
        iconClass: 'text-emerald-400',
        text: 'Correo de confirmación enviado (revisa spam y promociones).',
        detail: undefined as string | undefined,
      };
    }
    if (paymentData?.emailPreviouslySent) {
      return {
        Icon: CheckCircle,
        iconClass: 'text-emerald-400',
        text: 'El correo de confirmación ya fue enviado antes de abrir esta página.',
        detail: undefined as string | undefined,
      };
    }
    if (er && !er.success) {
      return {
        Icon: XCircle,
        iconClass: 'text-rose-400',
        text: 'No pudimos completar el envío automático del correo.',
        detail: er.error || er.message,
      };
    }
    return {
      Icon: AlertCircle,
      iconClass: 'text-amber-400',
      text: 'Envío de correo no verificado desde esta pantalla.',
      detail: undefined as string | undefined,
    };
  })();
  const { Icon: EmailStatusIcon, iconClass: emailStatusIconClass, text: emailStatusText, detail: emailStatusDetail } =
    emailConfirmationStatus;

  const hasDbReservation = Boolean(paymentData?.reservation?.id);
  const emailSentConfirmed =
    Boolean(paymentData?.emailResult?.success) || Boolean(paymentData?.emailPreviouslySent);
  const calendarQueueActive = Boolean(paymentData?.calendarEmailPending);
  /** Recuadro ámbar: no repetir “Próximos pasos” con el mismo mensaje */
  const hideNextStepsPanel =
    isPaymentApproved && !emailSentConfirmed && !calendarQueueActive;

  const dbOrPaymentStatusLine = (() => {
    if (hasDbReservation) return 'Reserva guardada en la base de datos';
    if (!isPaymentApproved) return 'Estamos registrando tu solicitud';
    if (isFreeConsult) return 'Consulta gratuita confirmada en esta sesión';
    return 'Pago acreditado según Mercado Pago';
  })();

  const seoTitle =
    isPaymentApproved && isFreeConsult
      ? 'Consulta confirmada | Punto Legal'
      : isPaymentApproved
        ? 'Pago exitoso — consulta confirmada | Punto Legal'
        : 'Pago registrado | Punto Legal';
  const seoDescription =
    isPaymentApproved && isFreeConsult
      ? 'Tu consulta legal gratuita quedó confirmada. Revisa tu correo o coordina por WhatsApp.'
      : isPaymentApproved
        ? 'Tu pago fue procesado y tu consulta quedó confirmada. Próximos pasos por correo y WhatsApp.'
        : 'Registramos tu pago y lo estamos verificando. Te avisaremos por correo cuando se acredite.';

  const handleDownloadCalendarIcs = () => {
    if (!paymentData) return;
    const fecha = paymentData.reservation?.fecha ?? paymentData.fecha;
    const hora = paymentData.reservation?.hora ?? paymentData.hora;
    if (!hasConcreteBookingSlot(fecha, hora)) return;
    const svc = paymentData.reservation?.servicio || paymentData.servicio?.tipo || 'Consulta Legal';
    const meet =
      (typeof paymentData.reservation?.google_meet_link === 'string' &&
        paymentData.reservation.google_meet_link.trim()) ||
      undefined;
    const ics = buildBookingIcs({
      title: `Consulta — ${svc} · Punto Legal`,
      description: 'Punto Legal Chile — consulta online (enlace Meet por correo).',
      fechaYmd: String(fecha).trim(),
      horaHm: String(hora).trim(),
      durationMinutes: 45,
      ...(meet ? { meetUrl: meet } : {}),
    });
    downloadBookingIcsFile('cita-punto-legal.ics', ics);
  };

  if (isLoading) {
    return (
      <div className="landing-canvas relative min-h-screen flex items-center justify-center px-4">
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(5,150,105,0.08),transparent_60%)] dark:hidden"
          aria-hidden
        />
        <div className="text-center max-w-md mx-auto relative z-10 w-full">
          <div className={`${shellGlass} p-8 shadow-xl`}>
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200/90 border-t-emerald-600 mx-auto mb-4 dark:border-emerald-500/25 dark:border-t-emerald-300" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {isProcessing ? 'Procesando pago...' : 'Cargando confirmación...'}
            </h2>
            {processingStatus && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{processingStatus}</p>
            )}
            <div className={`${cardGlass} rounded-2xl p-5 text-left`}>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Comprobando estado del pago y la reserva</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Sincronizando con la base de datos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Preparando confirmación por correo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <>
        <SEO
          title="No pudimos mostrar tu confirmación | Punto Legal"
          description="Hubo un problema al cargar los datos de tu pago o reserva. Vuelve a intentar o contacta a soporte."
        />
        <div className="landing-canvas relative min-h-screen flex items-center justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
          <div className="max-w-md w-full relative z-10">
            <div className={`${shellGlass} p-8 text-center shadow-xl`}>
            <AlertCircle className="w-12 h-12 text-amber-500 dark:text-amber-400 mx-auto mb-4" aria-hidden />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No pudimos cargar tu confirmación</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {loadError ||
                'Faltan datos de la reserva o el enlace expiró. Si ya pagaste, conserva tu comprobante y escríbenos por WhatsApp.'}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/agendamiento"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold px-4 shadow-lg"
              >
                Ir a agendamiento
              </Link>
              <Link
                to="/"
                className={`inline-flex min-h-[48px] items-center justify-center rounded-xl font-medium px-4 border border-slate-200/90 text-slate-800 hover:bg-slate-50 dark:border-white/[0.12] dark:text-slate-200 dark:hover:bg-white/[0.06]`}
              >
                Volver al inicio
              </Link>
              <a
                href="https://wa.me/56962321883?text=%23Ayuda%20Pago%20Success"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-4"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp soporte
              </a>
            </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
    const whatsappUrgencia = `https://wa.me/56962321883?text=${encodeURIComponent('Hola, acabo de completar el pago de urgencia penal. Necesito coordinar el siguiente paso con el equipo.')}`;
    return (
      <>
        <SEO
          title="Pago confirmado — Urgencia penal | Punto Legal"
          description="Pago recibido. El equipo te contactará para coordinar la actuación según tu caso y la disponibilidad."
        />
        <UrgenciaPenalFocusLayout headerLinkTo="/" headerAriaLabel="Punto Legal Chile — volver al inicio">
          <main className="relative z-10 max-w-lg mx-auto px-4 sm:px-5 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/95">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-pulse" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Pago recibido
              </div>

              <div className="mx-auto flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-[1.35rem] border border-rose-500/30 bg-gradient-to-br from-rose-500/25 to-transparent shadow-[0_24px_48px_-20px_rgba(190,18,60,0.45)] backdrop-blur-xl">
                <CheckCircle className="w-11 h-11 text-rose-100" strokeWidth={1.75} />
              </div>

              <div className="space-y-2 px-1">
                <h1 className="font-display text-[1.65rem] sm:text-[1.85rem] font-bold tracking-[-0.03em] text-white leading-tight">
                  Todo listo por tu lado
                </h1>
                <p className="text-slate-400 text-[0.9375rem] leading-relaxed max-w-md mx-auto">
                  Recibimos tu pago. El equipo priorizará tu contacto para coordinar la actuación según los antecedentes que
                  dejaste.
                </p>
              </div>

              <div className="glass-ios-panel-dark p-6 sm:p-7 text-left space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Próximo paso</p>
                <p className="text-slate-200 text-[0.9375rem] leading-relaxed">
                  Indica al funcionario policial que tu defensa está a cargo de{' '}
                  <strong className="text-white font-semibold">Punto Legal</strong>. Coordinaremos contigo por WhatsApp la
                  actuación concreta (presencial u otra modalidad) según disponibilidad y lo que permita el procedimiento.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={whatsappUrgencia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="urgencia-wa-cta"
                >
                  <MessageCircle className="w-5 h-5 shrink-0 opacity-95" />
                  Hablar con el equipo por WhatsApp
                </a>
                <Link to="/urgencia" className="urgencia-ghost-link">
                  Volver a urgencia penal
                </Link>
              </div>
            </motion.div>
          </main>
        </UrgenciaPenalFocusLayout>
      </>
    );
  }

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} />

      <div className="landing-canvas relative min-h-screen pb-[max(6rem,env(safe-area-inset-bottom,0px))]">
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_85%_55%_at_90%_0%,rgba(15,23,42,0.06),transparent_58%),radial-gradient(ellipse_70%_50%_at_10%_100%,rgba(5,150,105,0.07),transparent_55%)] dark:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 hidden dark:block bg-[radial-gradient(ellipse_at_top_right,rgba(5,150,105,0.09),transparent_58%),radial-gradient(ellipse_at_bottom_left,rgba(148,163,184,0.08),transparent_58%)]"
          aria-hidden
        />

        <header
          className="sticky top-0 z-40 border-b border-slate-200/75 bg-white/72 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.08] dark:bg-slate-950/65"
          style={{ paddingTop: 'max(0.875rem, env(safe-area-inset-top, 0px))' }}
        >
          <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="agendamiento-wordmark inline-flex min-h-[44px] items-center -mx-1 px-1 py-1 rounded-lg hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04] transition-colors"
              aria-label="Punto Legal Chile — volver al inicio"
            >
              <span className="agendamiento-wordmark__name">Punto Legal</span>
              <span className="agendamiento-wordmark__country">Chile</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <LaboralThemeToggle mode={theme} onToggle={toggleTheme} variant="inline" />
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0 bg-emerald-500"
                  aria-hidden
                />
                <span className="whitespace-nowrap">
                  {isPaymentApproved && isFreeConsult
                    ? 'Consulta gratuita'
                    : isPaymentApproved
                      ? 'Pago confirmado'
                      : 'En verificación'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-5 pb-10 md:pt-8 md:pb-14">
          {/* Header de éxito */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-200/90 bg-emerald-50/80 shadow-[0_14px_32px_rgba(5,150,105,0.14),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md dark:border-emerald-500/35 dark:bg-emerald-500/10 dark:shadow-[0_14px_32px_rgba(5,150,105,0.12)]">
              <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-300" strokeWidth={2} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              {headerTitle}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {headerDescription}
            </p>
          </motion.div>

          {/* Resumen de la consulta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${shellGlass} p-6 md:p-8 mb-6 shadow-xl`}
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Resumen de tu consulta
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconTileClass}>
                    <User className="h-5 w-5" />
                    </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">Cliente</p>
                    <p className="font-semibold text-slate-900 dark:text-white break-words">
                      {paymentData?.reservation?.nombre || paymentData?.cliente?.nombre || 'Cliente'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconTileClass}>
                    <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">Email</p>
                    <p className="font-semibold text-slate-900 dark:text-white break-all sm:break-words">
                      {paymentData?.reservation?.email || paymentData?.cliente?.email || 'No especificado'}
                      </p>
                    </div>
                  </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconTileClass}>
                    <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">Teléfono</p>
                    <p className="font-semibold text-slate-900 dark:text-white break-words">
                      {paymentData?.reservation?.telefono || paymentData?.cliente?.telefono || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconTileClass}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">Fecha</p>
                    <p className="font-semibold text-slate-900 dark:text-white break-words">{serviceDate}</p>
                    </div>
                  </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconTileClass}>
                    <Clock className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">Hora</p>
                    <p className="font-semibold text-slate-900 dark:text-white break-words">{serviceTime}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className={iconTileClass}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">Servicio</p>
                    <p className="font-semibold text-slate-900 dark:text-white break-words">
                      {paymentData?.reservation?.servicio || paymentData?.servicio?.tipo || 'Consulta Legal'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/80 dark:border-white/[0.08] pt-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {isFreeConsult ? 'Precio de la consulta' : 'Total pagado'}
                </span>
                <span className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {isFreeConsult
                    ? 'Gratis'
                    : `${paymentData?.priceFormatted ?? ''} CLP`.trim()}
                </span>
              </div>
            </div>

            {scheduledSlot && isPaymentApproved && (
              <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleDownloadCalendarIcs}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors border-slate-200/90 bg-white/80 text-slate-900 backdrop-blur-md hover:bg-white dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/[0.1]"
                >
                  <Download className="w-4 h-4" />
                  Descargar .ics (añadir al calendario)
                </button>
                <p className="text-xs text-slate-600 dark:text-slate-500 max-w-md leading-relaxed">
                  Abre el archivo en iPhone, Google Calendar o Outlook para guardar automáticamente la misma fecha y hora que figura arriba (referencia hora Chile).
                </p>
              </div>
            )}
          </motion.div>

          {/* Estado del procesamiento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${shellGlass} p-6 mb-6 shadow-lg`}
          >
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4">
              Estado de confirmación
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">{dbOrPaymentStatusLine}</span>
              </div>
              <div className="flex items-start gap-2">
                <EmailStatusIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${emailStatusIconClass}`} aria-hidden />
                <span className="text-slate-700 dark:text-slate-300 text-left">
                  {emailStatusText}
                  {emailStatusDetail ? (
                    <span className="block text-xs text-slate-600 dark:text-slate-500 mt-1 break-words">{emailStatusDetail}</span>
                  ) : null}
                </span>
              </div>
              {paymentData?.reservation && (
                <div className={`mt-4 p-3 rounded-xl ${cardGlass}`}>
                  <p className="text-[11px] text-slate-600 dark:text-slate-500">
                    <strong className="text-slate-800 dark:text-slate-400">ID de Reserva:</strong> {paymentData.reservation.id}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-500">
                    <strong className="text-slate-800 dark:text-slate-400">Estado:</strong> {paymentData.reservation.estado}
                  </p>
                  {trackingCode && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-500">
                      <strong className="text-slate-800 dark:text-slate-400">Código de Seguimiento:</strong> {trackingCode}
                    </p>
                  )}
                  {googleMeetLink && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-2">
                      <strong className="text-slate-800 dark:text-slate-400 shrink-0">Link de Google Meet:</strong>
                      <a
                        href={googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200/90 bg-white/85 px-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-md transition-colors hover:bg-white dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-emerald-200 dark:hover:bg-white/[0.12]"
                      >
                        Unirse a la reunión
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Información del pago (omitir en consulta gratuita sin pasarela) */}
          {paymentData?.mercadopagoData && !isFreeConsult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${shellGlass} p-6 mb-6 shadow-lg`}
            >
              <h3 className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-3">
                Información del pago
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-[11px]">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-300">ID de Pago:</strong> {String(paymentData.mercadopagoData.payment_id || 'N/A')}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-300">Estado:</strong> {String(readablePaymentStatus || 'N/A')}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-300">Método:</strong> {String(paymentData.mercadopagoData.payment_type || 'MercadoPago')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-300">Referencia:</strong> {String(paymentData.mercadopagoData.external_reference || 'N/A')}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-300">Procesado:</strong> {new Date().toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Información importante — copy alineado al estado real del correo */}
          {isPaymentApproved && calendarQueueActive ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${shellGlass} p-6 mb-6 ring-1 ring-inset ring-emerald-500/15 dark:ring-emerald-400/15`}
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Correo en preparación</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Generando enlace de videollamada y enviando confirmación; suele tardar menos de un minuto.
              </p>
            </motion.div>
          ) : isPaymentApproved && emailSentConfirmed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${shellGlass} p-6 mb-6 ring-1 ring-inset ring-emerald-500/15 dark:ring-emerald-400/15`}
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Correo enviado</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Revisa tu bandeja y spam; allí están los detalles o el enlace de la sesión.
              </p>
            </motion.div>
          ) : isPaymentApproved ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${shellGlass} p-6 mb-6 ring-1 ring-inset ring-amber-500/20 dark:ring-amber-400/15`}
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Correo o WhatsApp</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                No pudimos confirmar el envío automático desde aquí. Tus datos están en el resumen: si no llega el
                correo, escríbenos por WhatsApp (botón verde abajo).
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${shellGlass} p-6 mb-6 ring-1 ring-inset ring-amber-500/20 dark:ring-amber-400/15`}
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Confirmación pendiente</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Estado en Mercado Pago:{' '}
                <strong className="text-slate-800 dark:text-slate-200">{String(readablePaymentStatus)}</strong>. Cuando
                se acredite, enviaremos el correo con los detalles.
              </p>
            </motion.div>
          )}

          {!hideNextStepsPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`${shellGlass} p-6 mb-6 shadow-lg`}
          >
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4">
              Próximos pasos
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={stepBadgeClass}>1</div>
                <p className="text-slate-700 dark:text-slate-300 text-sm pt-0.5 leading-relaxed">
                  {emailSentConfirmed
                    ? 'Revisa el correo de confirmación (incluido spam).'
                    : calendarQueueActive
                      ? 'Espera el correo con el enlace de videollamada; llega en breve.'
                      : isPaymentApproved
                        ? 'Cuando Mercado Pago acredite, recibirás el correo con los detalles.'
                        : 'Te avisaremos por correo cuando el pago quede acreditado.'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={stepBadgeClass}>2</div>
                <p className="text-slate-700 dark:text-slate-300 text-sm pt-0.5 leading-relaxed">
                  Coordinación por WhatsApp con el equipo, en horas hábiles.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={stepBadgeClass}>3</div>
                <p className="text-slate-700 dark:text-slate-300 text-sm pt-0.5 leading-relaxed">
                  {scheduledSlot
                    ? 'Sesión de 45 min por Google Meet en la fecha y hora del resumen.'
                    : 'Agenda tu sesión de 45 min por Meet cuando quieras, desde el botón de abajo.'}
                </p>
              </div>
            </div>
          </motion.div>
          )}

          {/* CTA Principal: Agendar sesión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${shellGlass} p-6 mb-6 shadow-xl overflow-hidden`}
          >
            <p className="text-[10px] text-slate-600 dark:text-slate-500 uppercase tracking-widest font-bold mb-3 text-center">
              Siguiente paso
            </p>
            {!scheduledSlot ? (
              <>
                <p className="text-slate-900 dark:text-white font-semibold text-center mb-4">
                  Elige fecha y hora para tu sesión de 45 min
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to={agendarUrl}
                    style={
                      theme === 'light'
                        ? ({ ['--agenda-card-accent']: '51 65 85' } as React.CSSProperties)
                        : undefined
                    }
                    className={`inline-flex min-h-[48px] items-center justify-center gap-2 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg ${
                      theme === 'light'
                        ? 'agendamiento-primary-cta cta-shimmer'
                        : 'bg-gradient-to-br from-slate-600 to-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.35)] hover:from-slate-500 hover:to-slate-800'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    Agendar mi sesión
                  </Link>
                  <a
                    href={whatsappPostPago}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Hablar por WhatsApp
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-900 dark:text-white font-semibold text-center mb-4">
                  ¿Necesitas cambiar la hora o tienes dudas? Escríbenos por WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={whatsappPostPago}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Hablar por WhatsApp
                  </a>
                </div>
              </>
            )}
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
              className={`inline-flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-xl border transition-all ${cardGlass} text-slate-800 hover:opacity-95 dark:text-slate-100`}
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
            <Link
              to="/servicios"
              className={`inline-flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-xl border transition-all ${cardGlass} text-slate-800 hover:opacity-95 dark:text-slate-100`}
            >
              Ver más servicios
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* WhatsApp flotante (safe-area en notch / home indicator) */}
      <a
        href={whatsappPostPago}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-[100] flex items-center gap-3 group bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))]"
      >
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-600/60 px-3 py-2 rounded-2xl text-slate-900 dark:text-white text-xs font-bold shadow-2xl flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
