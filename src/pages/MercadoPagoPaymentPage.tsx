import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Lock, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import MercadoPagoOfficialButton from '../components/MercadoPagoOfficialButton';
import MobileMercadoPagoButton from '../components/MobileMercadoPagoButton';
import type { PendingPaymentData } from '@/types/payments';
import { ensurePriceFormatted, parsePendingPaymentData } from '@/utils/paymentData';
import { supabase } from '@/integrations/supabase/client';

export default function MercadoPagoPaymentPage() {
  const [paymentData, setPaymentData] = useState<PendingPaymentData | null>(null);
  const [paymentError, setPaymentError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si estamos en móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const data = localStorage.getItem('paymentData') || localStorage.getItem('pendingPayment');
    if (data) {
      try {
        const parsedData = parsePendingPaymentData(data);
        setPaymentData(parsedData);

        if (parsedData?.email) {
          supabase
            .from('leads_quiz')
            .update({ status: 'en_pago' })
            .eq('email', parsedData.email)
            .eq('status', 'checkout_iniciado')
            .then(({ error }) => {
              if (!error) console.log('✅ Estado en_pago registrado');
            });
        }
      } catch (error) {
        console.error('Error parseando paymentData:', error);
        localStorage.removeItem('paymentData');
        window.location.href = '/agendamiento';
      }
    } else {
      window.location.href = '/agendamiento';
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePaymentSuccess = async (paymentResponse: Record<string, unknown>) => {
    try {
      const paymentInfo = {
        ...paymentData,
        paymentMethod: 'mercadopago',
        paymentId:
          typeof paymentResponse.id === 'string' || typeof paymentResponse.id === 'number'
            ? paymentResponse.id
            : undefined,
        paymentStatus: typeof paymentResponse.status === 'string' ? paymentResponse.status : undefined,
        transactionAmount:
          typeof paymentResponse.transaction_amount === 'number'
            ? paymentResponse.transaction_amount
            : undefined,
        paymentDate: new Date().toISOString()
      };
      localStorage.setItem('paymentSuccess', JSON.stringify(paymentInfo));

      if (paymentData?.email) {
        await supabase
          .from('leads_quiz')
          .update({
            status: 'pago_completado',
            quiz_answers: {
              pago_id:     paymentInfo.paymentId,
              pago_status: paymentInfo.paymentStatus,
              pago_monto:  paymentInfo.transactionAmount,
              pago_fecha:  paymentInfo.paymentDate,
              pago_metodo: 'mercadopago'
            } as any
          })
          .eq('email', paymentData.email)
          .then(({ error }) => {
            if (error) console.warn('⚠️ No se actualizó pago_completado:', error.message);
            else console.log('✅ Pago completado en Supabase');
          });
      }

      window.location.href = '/payment-success';
    } catch (error) {
      console.error('Error procesando pago exitoso:', error);
      setPaymentError('Error procesando el pago exitoso');
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Error en pago MercadoPago:', error);
    setPaymentError(error);
    setIsProcessing(false);
  };

  const isExpressFlow = paymentData?.source === 'express_qr' || paymentData?.category === 'Express';

  if (!paymentData) {
    const rawStored = typeof window !== 'undefined' ? (localStorage.getItem('paymentData') || localStorage.getItem('pendingPayment')) : null;
    const parsedStored = rawStored ? (() => { try { return JSON.parse(rawStored); } catch { return null; } })() : null;
    const loadingExpress = parsedStored?.source === 'express_qr' || parsedStored?.category === 'Express';
    return (
      <div className={`min-h-screen flex items-center justify-center ${loadingExpress ? 'bg-[#FAFAFA]' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${loadingExpress ? 'border-emerald-500' : 'border-pink-500'}`}></div>
          <h2 className={`text-xl font-semibold ${loadingExpress ? 'text-slate-900' : 'text-white'}`}>Cargando datos de pago...</h2>
          <Link to={loadingExpress ? '/centro' : '/agendamiento'} className={`mt-2 inline-block text-sm ${loadingExpress ? 'text-emerald-600 hover:underline' : 'text-pink-400 hover:underline'}`}>
            Volver
          </Link>
        </div>
      </div>
    );
  }

  const amountValue = Math.max(0, Math.round(paymentData.price));
  const customerName = paymentData.nombre;
  const customerEmail = paymentData.email;
  const customerPhone = paymentData.telefono;

  const expressTheme = {
    bg: 'bg-[#FAFAFA]',
    header: 'bg-white border-b-2 border-slate-200',
    headerText: 'text-slate-900',
    headerSub: 'text-slate-500',
    card: 'bg-white border-2 border-slate-200 shadow-sm',
    cardInner: 'bg-slate-50 border-2 border-slate-200',
    text: 'text-slate-900',
    textMuted: 'text-slate-600',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-500/20 border-emerald-500/40',
    badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700',
    stepBg: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600',
    link: 'text-slate-600 hover:text-slate-900',
  };

  const darkTheme = {
    bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
    header: 'bg-slate-950/70 backdrop-blur-xl border-b border-white/[0.06]',
    headerText: 'text-white/95',
    headerSub: 'text-slate-400',
    card: 'backdrop-blur-xl',
    cardInner: 'bg-white/[0.03] border border-white/[0.06]',
    text: 'text-white',
    textMuted: 'text-slate-400',
    accent: 'text-pink-400',
    accentBg: 'bg-pink-500/20 border-pink-500/30',
    badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    stepBg: 'bg-pink-500/15 border-pink-500/20 text-pink-400',
    link: 'text-slate-400 hover:text-white',
  };

  const t = isExpressFlow ? expressTheme : darkTheme;

  return (
    <>
      <SEO
        title={`Confirmar Consulta — ${paymentData.service} · Punto Legal`}
        description="Completa tu pago de forma segura y agenda tu consulta legal."
      />

      <div className={`min-h-screen ${t.bg}`}>

        <header className={`sticky top-0 z-50 ${t.header}`}>
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to={isExpressFlow ? '/centro' : '/'} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${isExpressFlow ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-white/10 border-white/10'}`}>
                <Lock className={`w-4 h-4 ${isExpressFlow ? 'text-emerald-600' : 'text-white/90'}`} />
              </div>
              <span className={`text-lg font-semibold tracking-tight ${t.headerText}`}>Punto Legal</span>
            </Link>
            <div className={`flex items-center gap-2 text-xs ${t.headerSub}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              Pago SSL Seguro
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`inline-flex items-center gap-2 ${t.badge} px-4 py-1.5 rounded-full mb-4`}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {isExpressFlow ? 'Ticket validado' : 'Diagnóstico completado'} · {paymentData.nombre?.split(' ')[0] || 'tu caso'}
              </span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${t.text}`}>
              {isExpressFlow ? 'Confirma y paga' : 'Activa tu caso legal'}
            </h1>
            <p className={`text-sm mt-2 ${t.textMuted}`}>
              {isExpressFlow ? 'Consulta online · Centro' : `Diagnóstico completado · ${paymentData.nombre?.split(' ')[0] || 'Usuario'}`}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div
                className={`rounded-3xl p-6 ${isExpressFlow ? 'bg-white border-2 border-slate-200 shadow-sm' : ''}`}
                style={!isExpressFlow ? {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
                } : undefined}
              >
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-5 ${t.textMuted}`}>
                  Tu consulta
                </h3>

                <div className="space-y-4">
                  <div className={`rounded-2xl p-4 ${t.cardInner}`}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Servicio</p>
                    <p className={`text-sm font-semibold leading-snug ${t.text}`}>
                      {paymentData.service}
                    </p>
                  </div>

                  <div className={`rounded-2xl p-4 ${t.cardInner}`}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Modalidad</p>
                    <p className={`text-sm font-semibold ${t.text}`}>{isExpressFlow ? 'Online · Videollamada' : 'Videollamada + WhatsApp'}</p>
                    <p className={`text-[11px] mt-0.5 ${t.textMuted}`}>
                      {isExpressFlow ? 'Te contactamos por WhatsApp para coordinar' : 'Coordinamos horario por WhatsApp tras el pago'}
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-4">
                    <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">
                      Tiempo de respuesta
                    </p>
                    <p className="text-sm font-bold text-emerald-600">Menos de 2 horas</p>
                    <p className="text-[11px] text-emerald-600/80 mt-0.5">
                      Un abogado te contactará directamente
                    </p>
                  </div>

                  <div className={`border-t pt-4 mt-2 ${isExpressFlow ? 'border-slate-200' : 'border-white/5'}`}>
                    {paymentData.originalPrice != null && paymentData.originalPrice > 0 && (
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${t.textMuted}`}>Precio normal</span>
                        <span className={`text-xs line-through ${t.textMuted}`}>
                          ${new Intl.NumberFormat('es-CL').format(paymentData.originalPrice)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${t.textMuted}`}>Total a pagar</span>
                      <span className={`text-2xl font-black ${t.accent}`}>
                        ${new Intl.NumberFormat('es-CL').format(amountValue)}
                      </span>
                    </div>
                    {paymentData.isVulnerable && (
                      <p className="text-[10px] text-rose-400 mt-1 text-right">
                        🛡️ Tarifa especial — acceso para casos VIF
                      </p>
                    )}
                    {paymentData.isVip && !paymentData.isVulnerable && (
                      <p className="text-[10px] text-purple-400 mt-1 text-right">
                        ⚡ Consulta de Alta Complejidad
                      </p>
                    )}
                  </div>
                </div>

                <div className={`mt-5 pt-4 border-t ${isExpressFlow ? 'border-slate-200' : 'border-white/5'}`}>
                  <p className={`text-[10px] leading-relaxed text-center ${t.textMuted}`}>
                    <strong className={t.text}>Garantía de Viabilidad:</strong>{' '}
                    Si tu caso no tiene solución legal viable, te devolvemos el 100%. Sin preguntas.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div
                className={`rounded-3xl overflow-hidden ${isExpressFlow ? 'bg-white border-2 border-slate-200 shadow-sm' : ''}`}
                style={!isExpressFlow ? {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)'
                } : undefined}
              >
                <div className={`h-[2px] ${
                  isExpressFlow ? 'bg-emerald-500' : paymentData.isVulnerable
                    ? 'bg-gradient-to-r from-transparent via-rose-400 to-transparent'
                    : paymentData.isVip
                    ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent'
                    : 'bg-gradient-to-r from-transparent via-pink-500 to-transparent'
                }`} />
                <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${t.text}`}>Confirmar y pagar</h3>
                  <p className={`text-sm ${t.textMuted}`}>
                    Pago procesado por MercadoPago · Hasta 12 cuotas
                  </p>
                </div>

                <div className={`rounded-2xl p-4 mb-6 ${t.cardInner}`}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">
                    Confirmando para
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500 flex-none" />
                      <span className={`text-sm font-medium ${t.text}`}>{customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500 flex-none" />
                      <span className={`text-sm ${t.textMuted}`}>{customerEmail}</span>
                    </div>
                    {customerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 flex-none" />
                        <span className={`text-sm ${t.textMuted}`}>{customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  {isMobile ? (
                    <MobileMercadoPagoButton
                      paymentData={{
                        amount: amountValue,
                        description: `${paymentData.service} - Punto Legal`,
                        payer: {
                          name: customerName,
                          email: customerEmail,
                          phone: customerPhone
                        },
                        metadata: {
                          reservation_id: paymentData.reservaId,
                          external_reference: paymentData.external_reference || paymentData.reservaId,
                          service_name: paymentData.service,
                          appointment_date: paymentData.fecha || paymentData.date,
                          appointment_time: paymentData.hora || paymentData.time,
                          client_name: customerName,
                          client_email: customerEmail,
                          client_phone: customerPhone,
                          codigo_convenio: paymentData.codigoConvenio || null,
                          descuento_convenio: paymentData.descuentoConvenio || false,
                          precio_original: paymentData.originalPrice || null,
                          porcentaje_descuento: paymentData.porcentajeDescuento || null
                        }
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  ) : (
                    <MercadoPagoOfficialButton
                      paymentData={{
                        amount: amountValue,
                        description: `${paymentData.service} - Punto Legal`,
                        payer: {
                          name: customerName,
                          email: customerEmail,
                          phone: customerPhone
                        },
                        metadata: {
                          reservation_id: paymentData.reservaId || paymentData.id,
                          external_reference: paymentData.external_reference || paymentData.reservaId,
                          service_name: paymentData.service,
                          service_category: paymentData.category,
                          appointment_date: paymentData.fecha || paymentData.date,
                          appointment_time: paymentData.hora || paymentData.time,
                          meeting_type: paymentData.tipo_reunion || 'online',
                          client_name: customerName,
                          client_email: customerEmail,
                          client_phone: customerPhone,
                          client_rut: (paymentData as any).rut || 'No especificado',
                          codigo_convenio: paymentData.codigoConvenio || null,
                          descuento_convenio: paymentData.descuentoConvenio || false,
                          precio_original: paymentData.originalPrice || null,
                          porcentaje_descuento: paymentData.porcentajeDescuento || null
                        }
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Lock, label: 'SSL 256-bit' },
                    { icon: ShieldCheck, label: '100% Seguro' },
                    { icon: CheckCircle, label: 'PCI DSS' }
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 ${isExpressFlow ? 'bg-slate-50 border-2 border-slate-200' : 'bg-white/[0.02] border border-white/[0.05]'}`}
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`mt-4 rounded-2xl p-5 ${isExpressFlow ? 'bg-white border-2 border-slate-200 shadow-sm' : 'bg-white/[0.03] border border-white/[0.06]'}`}
                style={!isExpressFlow ? { boxShadow: '0 2px 12px rgba(0,0,0,0.1)' } : undefined}
              >
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${t.textMuted}`}>
                  ¿Qué pasa después del pago?
                </p>
                <div className="space-y-3">
                  {[
                    { step: '1', text: 'Recibes confirmación por email en menos de 5 minutos' },
                    { step: '2', text: 'Un abogado especialista te escribe por WhatsApp en menos de 2 horas' },
                    { step: '3', text: isExpressFlow ? 'Coordinan tu sesión online por videollamada' : 'Coordinan fecha y hora de la sesión según tu disponibilidad' },
                    { step: '4', text: 'La sesión dura 45-60 minutos — saldrás con tu plan de acción completo' }
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-none mt-0.5 ${t.stepBg}`}>
                        {step}
                      </div>
                      <p className={`text-xs leading-relaxed ${t.textMuted}`}>{text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {paymentError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-2xl max-w-md w-full mx-4 ${isExpressFlow ? 'bg-rose-500/20 border-2 border-rose-500/40' : 'bg-rose-500/20 backdrop-blur-xl border border-rose-500/30'}`}
          >
            <AlertCircle className={`w-5 h-5 flex-none ${isExpressFlow ? 'text-rose-600' : 'text-rose-400'}`} />
            <div>
              <p className={`text-sm font-semibold ${isExpressFlow ? 'text-rose-900' : 'text-white'}`}>Error en el pago</p>
              <p className={`text-xs mt-0.5 ${isExpressFlow ? 'text-rose-700' : 'text-rose-300'}`}>{paymentError}</p>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
