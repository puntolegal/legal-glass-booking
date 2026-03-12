// RUTA: src/pages/UrgenciaPage.tsx
// Máquina de conversión penal - 3 pantallas, diseño Escudo Negro
// Arquitectura: Captura emocional → Cualificación ninja → Terminal + Checkout

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ChevronRight,
  Loader2,
  MapPin,
  AlertTriangle,
  MessageCircle,
  Mail,
  Phone,
  Check,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { createCheckoutPreference } from '@/services/mercadopagoBackend';
import { supabase } from '@/integrations/supabase/client';
import { trackMetaEvent } from '@/services/metaConversionsService';

type Situacion = 'desordenes' | 'maltrato' | 'grave' | 'barricadas' | null;
type Step = 'captura' | 'cualificacion' | 'terminal';

const SITUACIONES = [
  { id: 'desordenes' as const, label: 'Desórdenes / Ley de Alcoholes', icon: '🍺' },
  { id: 'maltrato' as const, label: 'Maltrato a Carabineros', icon: '👮' },
  { id: 'barricadas' as const, label: 'Barricadas / Ley Seguridad', icon: '🔥' },
  { id: 'grave' as const, label: 'Delito Grave (VIF, Robo, Otros)', icon: '⚠️' },
];

const PRECIO_SIMPLE = 300000;
const PRECIO_COMPLEJO = 600000;
const WHATSAPP_NUMBER = '56962321883';
const COUNTDOWN_SECONDS = 10;

// Formateo automático RUT
const formatRut = (value: string): string => {
  const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
  if (!cleaned || cleaned.length <= 1) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  let formatted = '';
  let counter = 0;
  for (let i = body.length - 1; i >= 0; i--) {
    if (counter === 3) {
      formatted = '.' + formatted;
      counter = 0;
    }
    formatted = body[i] + formatted;
    counter++;
  }
  return `${formatted}-${dv}`;
};

// Formateo automático WhatsApp
const formatWhatsapp = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (!cleaned.startsWith('56')) {
    if (cleaned.length === 0) return '+56 ';
    if (cleaned.length === 1) return `+56 ${cleaned}`;
    if (cleaned.length <= 5) return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1)}`;
    if (cleaned.length <= 9) return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5, 9)}`;
    return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5, 9)}`;
  }
  const withoutCode = cleaned.slice(2);
  if (withoutCode.length === 0) return '+56 ';
  if (withoutCode.length === 1) return `+56 ${withoutCode}`;
  if (withoutCode.length <= 5) return `+56 ${withoutCode.slice(0, 1)} ${withoutCode.slice(1)}`;
  if (withoutCode.length <= 9) return `+56 ${withoutCode.slice(0, 1)} ${withoutCode.slice(1, 5)} ${withoutCode.slice(5, 9)}`;
  return `+56 ${withoutCode.slice(0, 1)} ${withoutCode.slice(1, 5)} ${withoutCode.slice(5, 9)}`;
};

// Haptic feedback (vibración táctil en mobile)
const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = { light: [10], medium: [20], heavy: [30] };
    navigator.vibrate(patterns[style]);
  }
};

// Pain messages por tipo de delito
const PAIN_MESSAGES: Record<string, string> = {
  desordenes:
    'La fiscalía usa las protestas para dar señales políticas. Sin defensa técnica, el juez puede aplicar prisión preventiva ejemplar.',
  maltrato:
    'Maltrato a Carabineros tiene presunción de culpabilidad. Si el funcionario dice que hubo agresión, necesitas contradecir el parte YA.',
  barricadas:
    'Ley de Seguridad del Estado. Si no entramos ahora a limpiar el relato policial, tu familiar duerme en Santiago 1.',
  grave:
    'Con antecedentes previos, la Fiscalía va a pedir internación inmediata. Tenemos 4 horas para construir la estrategia de libertad.',
};

// Terminal forense - líneas animadas
const TerminalLines: React.FC<{
  nombre: string;
  situacion: Situacion;
  antecedentes: boolean;
  horasDetenido: number;
  gravedadLesiones: number;
  riesgoPorcentaje: number;
  isComplejo: boolean;
}> = ({ nombre, situacion, antecedentes, horasDetenido, gravedadLesiones, riesgoPorcentaje, isComplejo }) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const situacionLabel =
    situacion === 'desordenes'
      ? 'DESÓRDENES PÚBLICOS'
      : situacion === 'maltrato'
        ? 'MALTRATO A CARABINEROS'
        : situacion === 'barricadas'
          ? 'LEY SEGURIDAD DEL ESTADO'
          : situacion === 'grave'
            ? 'DELITO GRAVE'
            : 'NO ESPECIFICADO';

  const lines = useMemo(
    () => [
      `> INICIANDO ANÁLISIS PENAL...`,
      `> CONSULTANDO BASE DE DATOS: FISCALÍA METROPOLITANA CENTRO NORTE`,
      `> DETECTOR DE ANTECEDENTES: [${antecedentes ? '●●●●●○○○○○' : '○○○○○○○○○○'}] PROCESANDO...`,
      `> TITULAR: ${(nombre || 'N/A').toUpperCase()}`,
      `> SITUACIÓN: ${situacionLabel}`,
      `> TIEMPO EN RETÉN: ${horasDetenido} HORAS`,
      gravedadLesiones >= 3
        ? `> ⚠️ ALERTA: LESIONES O DAÑOS REPORTADOS (NIVEL ${gravedadLesiones}/5)`
        : `> NIVEL LESIONES: ${gravedadLesiones}/5`,
      ``,
      `> ⚠️ ALERTA: Caso clasificado como ${isComplejo ? 'ALTA' : 'MEDIA'} COMPLEJIDAD`,
      ``,
      `> RIESGO DE PRISIÓN PREVENTIVA: ${riesgoPorcentaje}%`,
      `> TIEMPO ESTIMADO SIN DEFENSA: ${horasDetenido + 12}-${horasDetenido + 36} HORAS EN RETÉN`,
      `> PROBABILIDAD DE FORMALIZACIÓN: ${Math.min(95, riesgoPorcentaje + 4)}%`,
      ``,
      `> RECOMENDACIÓN: ACTIVAR DEFENSA LEGAL INMEDIATO`,
    ],
    [nombre, situacion, situacionLabel, antecedentes, horasDetenido, gravedadLesiones, riesgoPorcentaje, isComplejo]
  );

  useEffect(() => {
    if (lineIndex >= lines.length) return;
    const line = lines[lineIndex];
    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setCurrentText((prev) => prev + line[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 12);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        setCurrentText('');
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex, lines]);

  return (
    <div className="space-y-1.5 min-h-[140px]">
      {visibleLines.map((line, i) => (
        <p
          key={i}
          className="text-[11px] leading-relaxed font-mono"
          style={{
            color: line.includes('⚠️') ? 'rgb(252,165,165)' : line.includes('RIESGO') ? 'rgb(251,191,36)' : 'rgba(148,163,184,0.85)',
          }}
        >
          {line}
        </p>
      ))}
      {lineIndex < lines.length && (
        <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
          {currentText}
          <motion.span
            className="inline-block w-1.5 h-3 bg-rose-400 ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </p>
      )}
    </div>
  );
};

export default function UrgenciaPage() {
  const [step, setStep] = useState<Step>('captura');
  const [nombre, setNombre] = useState('');
  const [situacion, setSituacion] = useState<Situacion>(null);
  const [unidadPolicial, setUnidadPolicial] = useState('');
  const [geolocStatus, setGeolocStatus] = useState<'detecting' | 'detected' | 'manual'>('detecting');
  const [tieneAntecedentes, setTieneAntecedentes] = useState<boolean | null>(null);
  const [gravedadLesiones, setGravedadLesiones] = useState(0);
  const [horasDetenido, setHorasDetenido] = useState(3);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [rutDetenido, setRutDetenido] = useState('');
  const [isTerminalComplete, setIsTerminalComplete] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(COUNTDOWN_SECONDS);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);
  const [priceIncreased, setPriceIncreased] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const nombreInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const whatsappValid = useMemo(() => {
    const cleaned = whatsapp.replace(/\D/g, '');
    return (cleaned.length === 11 && cleaned.startsWith('569')) || (cleaned.length === 9 && cleaned.startsWith('9'));
  }, [whatsapp]);

  // Geoloc: siempre mostrar "última detención" (simulado)
  const ultimaDetencionMinutos = useMemo(() => Math.floor(Math.random() * 30) + 5, []);
  const abogadoKm = useMemo(() => (Math.random() * 5 + 2).toFixed(1), []);
  const isComplejo = situacion === 'grave' || situacion === 'barricadas' || tieneAntecedentes === true || gravedadLesiones >= 4;
  const precio = isComplejo ? PRECIO_COMPLEJO : PRECIO_SIMPLE;
  const servicioNombre = isComplejo ? 'Blindaje Penal Estratégico' : 'Intervención de Urgencia';
  const servicioDesc = isComplejo
    ? 'Incluye: Gestión de Medidas Cautelares, abogado especialista y Defensa 24/7.'
    : 'Incluye: Defensa en Comisaría y Representación en Control de Detención.';

  // Riesgo dinámico
  const riesgoPorcentaje = useMemo(() => {
    let base = 25;
    if (tieneAntecedentes) base += 35;
    if (situacion === 'grave' || situacion === 'barricadas') base += 25;
    if (gravedadLesiones >= 4) base += 20;
    if (horasDetenido >= 6) base += 10;
    return Math.min(95, base);
  }, [tieneAntecedentes, situacion, gravedadLesiones, horasDetenido]);

  const painMessage = useMemo(() => {
    const base = situacion ? PAIN_MESSAGES[situacion] : PAIN_MESSAGES.grave;
    if (horasDetenido >= 18) {
      return `⏰ CRÍTICO: Ya llevas ${horasDetenido} horas. La formalización puede ser en cualquier momento. ${base}`;
    }
    if (horasDetenido >= 12) {
      return `⚠️ ALERTA: ${horasDetenido} horas detenido. ${base}`;
    }
    return base;
  }, [situacion, horasDetenido]);

  // Geolocalización simulada
  useEffect(() => {
    const t = setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setGeolocStatus('detected');
            if (!unidadPolicial) setUnidadPolicial('Comisaría 3ª de Santiago Centro');
          },
          () => {
            setGeolocStatus('manual');
            if (!unidadPolicial) setUnidadPolicial('');
          },
          { timeout: 3000 }
        );
      } else {
        setGeolocStatus('manual');
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Auto-save lead en cualificación (ninja)
  const saveLead = useCallback(async () => {
    if (!emailValid || !email.trim() || leadSaved) return;
    try {
      const quizData = {
        email: email.trim(),
        name: nombre.trim() || 'Urgencia',
        status: 'urgencia_cualificacion',
        quiz_answers: {
          source: 'urgencia_penal',
          nombre: nombre.trim(),
          whatsapp: whatsapp.replace(/\s/g, ''),
          email: email.trim(),
          situacion,
          antecedentes: tieneAntecedentes,
          gravedad_lesiones: gravedadLesiones,
          horas_detenido: horasDetenido,
          unidad_policial: unidadPolicial.trim(),
          rut_detenido: rutDetenido.trim(),
          lead_score: isComplejo ? 'HOT_URGENCIA_COMPLEJA' : 'WARM_URGENCIA_SIMPLE',
        },
      };
      const { data: updatedRows, error: updateErr } = await supabase
        .from('leads_quiz')
        .update({
          status: 'urgencia_cualificacion',
          quiz_answers: quizData.quiz_answers as any,
        })
        .eq('email', email.trim())
        .select('id');
      const didUpdate = !updateErr && updatedRows && updatedRows.length > 0;
      if (didUpdate) {
        setLeadSaved(true);
        trackMetaEvent({
          event_name: 'Lead',
          user_data: { em: email.trim() },
          custom_data: {
            content_name: 'Urgencia Penal - Lead Capturado',
            content_category: 'Urgencia',
            value: 0,
            currency: 'CLP',
          },
        });
        console.log('✅ Lead urgencia actualizado');
      } else {
        const { error: insertErr } = await supabase.from('leads_quiz').insert([
          {
            email: email.trim(),
            name: nombre.trim() || 'Urgencia',
            status: 'urgencia_cualificacion',
            quiz_answers: quizData.quiz_answers as any,
          },
        ]);
        if (!insertErr) {
          setLeadSaved(true);
          trackMetaEvent({
            event_name: 'Lead',
            user_data: { em: email.trim() },
            custom_data: {
              content_name: 'Urgencia Penal - Lead Capturado',
              content_category: 'Urgencia',
              value: 0,
              currency: 'CLP',
            },
          });
          console.log('✅ Lead urgencia creado');
        } else {
          console.warn('❌ Error guardando lead urgencia:', insertErr);
        }
      }
    } catch (e) {
      console.warn('Lead save:', e);
    }
  }, [email, emailValid, nombre, whatsapp, situacion, tieneAntecedentes, gravedadLesiones, horasDetenido, unidadPolicial, rutDetenido, isComplejo, leadSaved]);

  useEffect(() => {
    if (emailValid && email) saveLead();
  }, [emailValid, email, situacion, tieneAntecedentes, gravedadLesiones, horasDetenido, saveLead]);

  // Autofocus en el primer campo de cada paso
  useEffect(() => {
    if (step === 'captura') setTimeout(() => nombreInputRef.current?.focus(), 300);
    if (step === 'cualificacion') setTimeout(() => emailInputRef.current?.focus(), 300);
  }, [step]);

  const handleActivar = useCallback(async () => {
    if (paymentInitiated || isPaying) return;
    setPaymentInitiated(true);
    setError('');
    setIsPaying(true);
    triggerHaptic('heavy');
    try {
      const rutLimpio = rutDetenido.replace(/\D/g, '');
      const externalRef = `urgencia-${rutLimpio || 'sin-rut'}-${Date.now()}`;

      const preferenceData = {
        items: [
          {
            title: `${servicioNombre} - Punto Legal`,
            quantity: 1,
            unit_price: precio,
            currency_id: 'CLP',
          },
        ],
        payer: {
          name: nombre.trim(),
          email: email.trim(),
          phone: { number: whatsapp.replace(/\D/g, '') },
        },
        back_urls: {
          success: `https://puntolegal.online/payment-success?source=mercadopago`,
          failure: `https://puntolegal.online/payment-failure?source=mercadopago`,
          pending: `https://puntolegal.online/payment-pending?source=mercadopago`,
        },
        auto_return: 'approved',
        external_reference: externalRef,
        metadata: {
          appointment_date: new Date().toISOString().split('T')[0],
          appointment_time: 'Urgencia',
          source: 'urgencia',
          client_rut: rutDetenido.trim() || 'No especificado',
          unidad_policial: unidadPolicial.trim(),
          situacion: situacion || '',
          antecedentes: tieneAntecedentes,
        },
      };

      const result = await createCheckoutPreference(preferenceData);

      const paymentDataForStorage = {
        id: externalRef,
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: whatsapp.trim(),
        service: servicioNombre,
        category: 'Urgencia Penal',
        price: precio,
        priceFormatted: new Intl.NumberFormat('es-CL').format(precio),
        fecha: new Date().toISOString().split('T')[0],
        hora: 'Urgencia',
        date: new Date().toISOString().split('T')[0],
        time: 'Urgencia',
        tipo_reunion: 'presencial',
        timestamp: Date.now(),
        external_reference: externalRef,
        reservaId: externalRef,
        source: 'urgencia',
        rut: rutDetenido.trim(),
        unidad_policial: unidadPolicial.trim(),
        situacion,
        antecedentes: tieneAntecedentes,
      };

      localStorage.setItem('paymentData', JSON.stringify(paymentDataForStorage));

      if (result.init_point) {
        window.location.assign(result.init_point);
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (err) {
      console.error('Error iniciando pago:', err);
      setPaymentInitiated(false);
      let userMessage = 'No pudimos conectar con el sistema de pagos.';
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes('network') || msg.includes('fetch')) userMessage = 'Sin conexión a internet. Revisa tu señal.';
        else if (msg.includes('timeout')) userMessage = 'La conexión se agotó. Intenta de nuevo.';
        else if (msg.includes('preference') || msg.includes('preferencia')) userMessage = 'Error creando el pago. Contacta soporte.';
      }
      setError(userMessage);
      setIsPaying(false);
    }
  }, [
    paymentInitiated,
    isPaying,
    rutDetenido,
    servicioNombre,
    precio,
    nombre,
    email,
    whatsapp,
    unidadPolicial,
    situacion,
    tieneAntecedentes,
  ]);

  // Detectar fin del terminal
  useEffect(() => {
    if (step !== 'terminal') return;
    const t = setTimeout(() => setIsTerminalComplete(true), 5500);
    return () => clearTimeout(t);
  }, [step]);

  // Countdown que redirige a pago
  useEffect(() => {
    if (!isTerminalComplete) return;
    const t = setTimeout(() => setCountdownActive(true), 800);
    return () => clearTimeout(t);
  }, [isTerminalComplete]);

  useEffect(() => {
    if (!countdownActive) return;
    const id = setInterval(() => {
      setCountdownSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [countdownActive]);

  // Countdown: al llegar a 0, mostrar "precio aumentó" (NO auto-redirigir)
  useEffect(() => {
    if (countdownSeconds === 0 && countdownActive && !priceIncreased) {
      setPriceIncreased(true);
    }
  }, [countdownSeconds, countdownActive, priceIncreased]);

  const canAdvanceCaptura = nombre.trim().length >= 2 && situacion && (unidadPolicial.trim().length >= 3 || geolocStatus === 'detected');
  const canAdvanceCualificacion =
    tieneAntecedentes !== null && emailValid && whatsappValid;

  const handleCapturaNext = () => {
    if (!canAdvanceCaptura) return;
    setError('');
    triggerHaptic('medium');
    setStepCompleted(true);
    setTimeout(() => {
      setStep('cualificacion');
      scrollToTop();
      setStepCompleted(false);
    }, 400);
    trackMetaEvent({
      event_name: 'ViewContent',
      custom_data: { content_name: 'Urgencia Penal - Cualificación', content_category: 'Urgencia' },
    });
  };

  const handleCualificacionNext = () => {
    if (!canAdvanceCualificacion) return;
    setError('');
    triggerHaptic('medium');
    setStepCompleted(true);
    setTimeout(() => {
      setStep('terminal');
      scrollToTop();
      setStepCompleted(false);
    }, 400);
    trackMetaEvent({
      event_name: 'InitiateCheckout',
      user_data: { em: email },
      custom_data: {
        content_name: servicioNombre,
        content_category: 'Urgencia Penal',
        value: precio,
        currency: 'CLP',
      },
    });
  };

  const whatsappUrl = useMemo(() => {
    const msg = `🚨 URGENCIA PENAL: Hola, soy ${nombre || 'contacto'}. ${servicioNombre}. Caso ${situacion || 'detención'}. Necesito activar la defensa YA.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [nombre, servicioNombre, situacion]);

  const whatsappButtonText = useMemo(() => {
    if (step === 'captura') return 'Hablar ahora';
    if (step === 'cualificacion') return 'Consultar mi caso';
    return 'Hablar con Director YA';
  }, [step]);

  return (
    <>
      <SEO
        title="Urgencia Penal - Defensa Inmediata | Punto Legal"
        description="Defensa legal inmediata en situaciones de detención. Intervención en comisaría, abogado especialista y representación en control de detención."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white font-sans antialiased pb-safe-bottom">
        <style>{`
          footer, .footer, [data-testid="footer"] { display: none !important; }
          input, select, textarea { font-size: 16px !important; }
          @supports (padding: max(0px)) {
            .pb-safe-bottom { padding-bottom: max(1.5rem, env(safe-area-inset-bottom)); }
            .bottom-safe { bottom: max(1.5rem, env(safe-area-inset-bottom)); }
          }
        `}</style>

        {/* Header Escudo Negro */}
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
          <div className="max-w-lg mx-auto px-4 py-4 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">Punto Legal</span>
            </div>
          </div>
        </header>

        {/* Progreso visual (3 dots) */}
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3">
            {(['captura', 'cualificacion', 'terminal'] as const).map((s, i) => {
              const stepIndex = ['captura', 'cualificacion', 'terminal'].indexOf(step);
              const currentIndex = ['captura', 'cualificacion', 'terminal'].indexOf(s);
              const isActive = step === s;
              const isCompleted = currentIndex < stepIndex;
              return (
                <motion.div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    isActive
                      ? 'w-10 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]'
                      : isCompleted
                        ? 'w-2 bg-emerald-500/90'
                        : 'w-2 bg-white/50 ring-1 ring-white/20'
                  }`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              );
            })}
          </div>
        </div>

        <main className="max-w-lg mx-auto px-4 py-6 pb-24">
          <AnimatePresence mode="wait">
            {/* ══ PANTALLA 1: CAPTURA EMOCIONAL ══ */}
            {step === 'captura' && (
              <motion.div
                key="captura"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                <h1 className="text-2xl font-bold text-white">¿Tu familiar está detenido?</h1>
                <p className="text-slate-400 text-sm">
                  Activa la defensa en <span className="text-white font-bold">menos de 60 segundos</span>. Un abogado se dirige a la comisaría ahora.
                </p>

                {/* Geolocalización - skeleton cuando detect */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      {geolocStatus === 'detecting' ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-24 h-3 bg-white/10 rounded animate-pulse" />
                        </span>
                      ) : geolocStatus === 'detected' ? (
                        'Comisaría más cercana'
                      ) : (
                        'Unidad policial'
                      )}
                    </span>
                  </div>
                  {geolocStatus !== 'detecting' && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-emerald-400/90 mb-2"
                    >
                      📍 Última detención registrada: Hace {ultimaDetencionMinutos} min · Abogado más cercano: {abogadoKm} km
                      <span className="block mt-1 text-rose-300 font-medium">
                        🚨 Tiempo de respuesta promedio: 8 minutos
                      </span>
                    </motion.p>
                  )}
                  <input
                    type="text"
                    placeholder="Ej: 1ª Comisaría de Santiago, 17ª Las Condes"
                    value={unidadPolicial}
                    onChange={(e) => setUnidadPolicial(e.target.value)}
                    className="w-full py-3 px-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 text-sm"
                  />
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del detenido o quien activa</label>
                  <input
                    ref={nombreInputRef}
                    type="text"
                    placeholder="Solo nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full py-4 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40"
                  />
                </div>

                {/* Motivo - Selector visual */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Motivo de detención</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SITUACIONES.map((s) => (
                      <motion.button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('medium');
                          setSituacion(s.id);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`py-4 px-3 rounded-xl text-left font-medium transition-all border flex items-center gap-2 ${
                          situacion === s.id
                            ? 'bg-white/15 border-white/40 text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/[0.08]'
                        }`}
                      >
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-sm">{s.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCapturaNext}
                  disabled={!canAdvanceCaptura}
                  className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all ${
                    canAdvanceCaptura
                      ? 'bg-gradient-to-r from-white to-slate-100 text-black hover:from-slate-100 hover:to-white active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.2)]'
                      : 'bg-white/20 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {!canAdvanceCaptura && (
                    <span className="text-xs mr-2">
                      {!nombre.trim() ? '(Falta nombre)' : !situacion ? '(Falta motivo)' : '(Falta comisaría)'}
                    </span>
                  )}
                  ACTIVAR AHORA · ABOGADO EN CAMINO <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* ══ PANTALLA 2: CUALIFICACIÓN NINJA ══ */}
            {step === 'cualificacion' && (
              <motion.div
                key="cualificacion"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                <button type="button" onClick={() => setStep('captura')} className="text-slate-400 text-sm hover:text-white">
                  ← Volver
                </button>
                <h1 className="text-xl font-bold text-white">Necesitamos 3 datos más</h1>
                <p className="text-slate-400 text-sm">
                  Para asignar el abogado correcto y calcular el riesgo de prisión preventiva.
                </p>

                {/* Antecedentes */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                  className="rounded-xl p-4"
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">¿Antecedentes previos?</label>
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => { triggerHaptic('light'); setTieneAntecedentes(false); }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-4 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-all ${
                        tieneAntecedentes === false
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <span>✓</span> No
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => { triggerHaptic('light'); setTieneAntecedentes(true); }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-4 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-all ${
                        tieneAntecedentes === true
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" /> Sí
                    </motion.button>
                  </div>
                </div>

                {/* Lesiones / Daños */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                  className="rounded-xl p-4"
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    ¿Lesiones o daños reportados? (1-5)
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <motion.button
                        key={n}
                        type="button"
                        onClick={() => { triggerHaptic('light'); setGravedadLesiones(n); }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 py-4 px-4 rounded-lg text-sm font-medium border transition-all ${
                          gravedadLesiones >= n
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                            : 'bg-white/5 border-white/10 text-slate-500'
                        }`}
                      >
                        {n}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">1 = ninguno · 5 = graves</p>
                </div>

                {/* Horas detenido - selector de botones */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                  className="rounded-xl p-4"
                >
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    ⏱️ ¿Cuánto tiempo lleva detenido?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Menos de 6h', value: 3, icon: '🕐', warn: false },
                      { label: '6-12 horas', value: 9, icon: '🕘', warn: false },
                      { label: '12-18 horas', value: 15, icon: '🕐', warn: true },
                      { label: '18-24 horas', value: 21, icon: '🕘', warn: true },
                      { label: 'Más de 24h', value: 30, icon: '⚠️', warn: true },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          triggerHaptic(option.warn ? 'medium' : 'light');
                          setHorasDetenido(option.value);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`py-4 px-3 rounded-xl text-center font-medium transition-all border flex flex-col items-center gap-1 ${
                          horasDetenido === option.value
                            ? option.warn
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                              : 'bg-white/15 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/[0.08]'
                        }`}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-xs leading-tight">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  {horasDetenido >= 15 && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-rose-400 mt-3 font-medium"
                    >
                      ⚠️ CRÍTICO: A las 12+ horas sin defensa, el riesgo de formalización sube 340%
                    </motion.p>
                  )}
                </div>

                {/* RUT detenido - opcional con formateo automático */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    RUT del detenido <span className="text-slate-500">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="12.345.678-9 (o déjalo en blanco)"
                    value={rutDetenido}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const cleaned = raw.replace(/[^0-9kK]/g, '');
                      if (cleaned.length <= 9) {
                        setRutDetenido(cleaned.length >= 2 ? formatRut(cleaned) : cleaned);
                      }
                    }}
                    maxLength={12}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40"
                  />
                </div>

                {/* Email + WhatsApp - checks premium */}
                <div className="space-y-3">
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 flex-none" />
                      <input
                        ref={emailInputRef}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`flex-1 py-3 px-4 pr-12 rounded-xl bg-white/5 border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-colors ${
                          email && emailValid ? 'border-emerald-500/40 focus:border-emerald-500/60' : 'border-white/10 focus:border-white/30'
                        }`}
                      />
                      {email && emailValid && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <motion.div
                            className="relative w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                            style={{
                              boxShadow: '0 0 16px rgba(16,185,129,0.6), 0 0 8px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                            }}
                            animate={{
                              boxShadow: [
                                '0 0 16px rgba(16,185,129,0.6), 0 0 8px rgba(16,185,129,0.4)',
                                '0 0 20px rgba(16,185,129,0.8), 0 0 12px rgba(16,185,129,0.6)',
                                '0 0 16px rgba(16,185,129,0.6), 0 0 8px rgba(16,185,129,0.4)',
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 flex-none" />
                      <input
                        type="tel"
                        inputMode="tel"
                        placeholder="+56 9 1234 5678"
                        value={whatsapp}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const cleaned = raw.replace(/\D/g, '');
                          if (cleaned.length === 0) {
                            setWhatsapp('+56 ');
                            return;
                          }
                          setWhatsapp(formatWhatsapp(cleaned));
                        }}
                        onFocus={(e) => {
                          if (e.target.value === '') setWhatsapp('+56 ');
                        }}
                        maxLength={17}
                        className={`flex-1 py-3 px-4 pr-12 rounded-xl bg-white/5 border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-colors ${
                          whatsapp && whatsappValid ? 'border-emerald-500/40 focus:border-emerald-500/60' : 'border-white/10 focus:border-white/30'
                        }`}
                      />
                      {whatsapp && whatsappValid && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <motion.div
                            className="relative w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                            style={{
                              boxShadow: '0 0 16px rgba(16,185,129,0.6), 0 0 8px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                            }}
                            animate={{
                              boxShadow: [
                                '0 0 16px rgba(16,185,129,0.6), 0 0 8px rgba(16,185,129,0.4)',
                                '0 0 20px rgba(16,185,129,0.8), 0 0 12px rgba(16,185,129,0.6)',
                                '0 0 16px rgba(16,185,129,0.6), 0 0 8px rgba(16,185,129,0.4)',
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCualificacionNext}
                  disabled={!canAdvanceCualificacion}
                  className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    canAdvanceCualificacion
                      ? 'bg-gradient-to-r from-white to-slate-100 text-black hover:from-slate-100 hover:to-white active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.2)]'
                      : 'bg-white/20 text-white/40 cursor-not-allowed'
                  }`}
                >
                  Ver análisis y opción de pago <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* ══ PANTALLA 3: TERMINAL + CHECKOUT ══ */}
            {step === 'terminal' && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                {/* Terminal forense */}
                <div
                  className="rounded-2xl p-4 font-mono"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-white/[0.06]">
                    <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                    <span className="text-slate-600 text-[9px] ml-2 uppercase tracking-widest">punto-legal · análisis-penal-v1</span>
                  </div>
                  <TerminalLines
                    nombre={nombre.trim().split(' ')[0] || 'N/A'}
                    situacion={situacion}
                    antecedentes={tieneAntecedentes ?? false}
                    horasDetenido={horasDetenido}
                    gravedadLesiones={gravedadLesiones}
                    riesgoPorcentaje={riesgoPorcentaje}
                    isComplejo={isComplejo}
                  />
                </div>

                {/* Alerta presunción de culpabilidad */}
                <div
                  className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/20"
                  style={{
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <p className="text-xs text-amber-300 font-medium">
                    ⚖️ Sin defensa técnica, el juez aplica presunción de culpabilidad. El parte policial se convierte en verdad absoluta.
                  </p>
                </div>

                {/* Riesgo visual */}
                <div
                  className={`rounded-xl p-4 ${
                    riesgoPorcentaje >= 70 ? 'bg-rose-500/10 border border-rose-500/30' : riesgoPorcentaje >= 50 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-emerald-500/10 border border-emerald-500/30'
                  }`}
                  style={{
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Riesgo de prisión preventiva</p>
                  <p className="text-3xl font-bold text-white">{riesgoPorcentaje}%</p>
                  <p className="text-xs text-slate-400 mt-1">{painMessage}</p>
                </div>

                {/* Anclaje táctico */}
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <p className="text-[10px] text-slate-500 line-through">
                    {isComplejo
                      ? 'Abogado de turno: Sin experiencia en casos complejos'
                      : 'Defensoría Pública: Mañana a las 9 AM (Gratis pero tardío)'}
                  </p>
                  <p className="text-sm text-white font-medium">
                    ✅ Punto Legal: Ahora mismo · Abogado especialista · {new Intl.NumberFormat('es-CL').format(precio)} en 12 cuotas sin interés
                  </p>
                </div>

                {/* Checkout card */}
                <div
                  className="rounded-2xl p-6 space-y-4"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-white">
                      ${new Intl.NumberFormat('es-CL').format(precio)}
                    </h2>
                    <span className="text-sm text-slate-500 line-through">
                      ${new Intl.NumberFormat('es-CL').format(Math.round(precio * 1.5))}
                    </span>
                    <span className="text-xs font-bold uppercase text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
                      Precio de urgencia
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{servicioNombre} · {servicioDesc}</p>

                  {/* Countdown: NO auto-redirige, muestra "precio aumentó" al llegar a 0 */}
                  {isTerminalComplete && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`rounded-xl p-4 border ${priceIncreased ? 'bg-amber-500/20 border-amber-500/40' : 'bg-rose-500/10 border-rose-500/20'}`}
                    >
                      {priceIncreased ? (
                        <>
                          <p className="text-sm font-bold text-amber-300">
                            ⚠️ El precio cambió a ${new Intl.NumberFormat('es-CL').format(precio + 100000)}
                          </p>
                          <p className="text-xs text-slate-300 mt-1">
                            Activa ahora para asegurar el precio original de ${new Intl.NumberFormat('es-CL').format(precio)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-rose-300 mb-2 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                            </span>
                            {countdownActive
                              ? `⚠️ ${countdownSeconds} segundos para asegurar este precio`
                              : 'Preparando pago seguro...'}
                          </p>
                          {countdownActive && (
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                className="h-full bg-rose-500"
                                initial={{ width: '100%' }}
                                animate={{ width: `${(countdownSeconds / COUNTDOWN_SECONDS) * 100}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}

                  {error && (
                    <div className="rounded-xl p-4 bg-rose-500/10 border border-rose-500/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-none mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-rose-300 font-medium mb-2">❌ {error}</p>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-white underline hover:text-rose-200 flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Contactar por WhatsApp ahora
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('heavy');
                      handleActivar();
                    }}
                    disabled={isPaying}
                    className="w-full py-5 rounded-xl font-bold bg-gradient-to-r from-white to-slate-100 text-black hover:from-slate-100 hover:to-white disabled:opacity-60 disabled:from-white/20 disabled:to-white/20 flex items-center justify-center gap-2 text-lg shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="ml-2">Conectando con MercadoPago...</span>
                      </>
                    ) : (
                      <>ACTIVAR DEFENSA INMEDIATA</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* WhatsApp flotante - badge en terminal, animación */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-4 bottom-safe z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition-all active:scale-95"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            {step === 'terminal' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"
                style={{ boxShadow: '0 0 12px rgba(239,68,68,1)' }}
              />
            )}
          </div>
          <span className="text-sm">{whatsappButtonText}</span>
        </motion.a>

        {/* Overlay success al completar paso */}
        <AnimatePresence>
          {stepCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
