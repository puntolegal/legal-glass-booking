// RUTA: src/pages/UrgenciaPage.tsx
// Máquina de conversión penal — 3 pasos, canvas glass iOS (tema penal)
// Arquitectura: Captura → Cualificación → Terminal (simulación orientativa) + Checkout

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Loader2,
  MapPin,
  AlertTriangle,
  MessageCircle,
  Mail,
  Phone,
  Check,
  Wine,
  ShieldAlert,
  Flame,
  Gavel,
  Clock,
  ArrowLeft,
  Megaphone,
  HeartCrack,
  ShoppingBag,
  Siren,
  Pill,
  Car,
  Shield,
  Scale,
  Lock,
  Activity,
  Hammer,
  Package,
  Crosshair,
  type LucideIcon,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { UrgenciaPenalFocusLayout } from '@/components/urgencia/UrgenciaPenalFocusLayout';
import {
  URGENCIA_CANONICAL_URL,
  URGENCIA_SEO_DESCRIPTION,
  URGENCIA_SEO_KEYWORDS,
  URGENCIA_SEO_TITLE,
  URGENCIA_FAQ_ITEMS,
  buildUrgenciaFaqJsonLd,
} from '@/lib/urgenciaPenalSeo';
import { getNearestComisariaOriente } from '@/lib/urgenciaOrienteComisarias';
import { createCheckoutPreference } from '@/services/mercadopagoBackend';
import { mergeUrgenciaPenalRow, type UrgenciaPenalMergeRow } from '@/services/urgenciaPenalRecordService';
import { supabase } from '@/integrations/supabase/client';
import { trackMetaEvent } from '@/services/metaConversionsService';

type Situacion =
  | 'desordenes'
  | 'ley_alcohol'
  | 'maltrato'
  | 'barricadas'
  | 'vif'
  | 'hurto'
  | 'amenazas'
  | 'microtrafico'
  | 'conduccion_ebriedad'
  | 'lesiones'
  | 'danos'
  | 'receptacion'
  | 'porte_arma'
  | 'grave'
  | null;
type Step = 'captura' | 'cualificacion' | 'terminal';

const SITUACIONES: { id: Exclude<Situacion, null>; label: string; Icon: LucideIcon }[] = [
  { id: 'desordenes', label: 'Desórdenes públicos', Icon: Megaphone },
  { id: 'ley_alcohol', label: 'Ley de alcoholes', Icon: Wine },
  { id: 'maltrato', label: 'Maltrato a Carabineros', Icon: ShieldAlert },
  { id: 'barricadas', label: 'Barricadas / seguridad del Estado', Icon: Flame },
  { id: 'vif', label: 'Violencia intrafamiliar', Icon: HeartCrack },
  { id: 'hurto', label: 'Hurto / robo simple', Icon: ShoppingBag },
  { id: 'amenazas', label: 'Amenazas', Icon: Siren },
  { id: 'microtrafico', label: 'Tenencia / microtráfico', Icon: Pill },
  { id: 'lesiones', label: 'Lesiones (riña / agresión)', Icon: Activity },
  { id: 'danos', label: 'Daños / vandalismo', Icon: Hammer },
  { id: 'receptacion', label: 'Receptación', Icon: Package },
  { id: 'porte_arma', label: 'Porte arma / munición', Icon: Crosshair },
  { id: 'conduccion_ebriedad', label: 'Conducción bajo efectos', Icon: Car },
  { id: 'grave', label: 'Otro delito grave', Icon: Gavel },
];

const SITUACION_TERMINAL_LABEL: Record<Exclude<Situacion, null>, string> = {
  desordenes: 'DESÓRDENES PÚBLICOS',
  ley_alcohol: 'LEY DE ALCOHOLES',
  maltrato: 'MALTRATO A CARABINEROS',
  barricadas: 'LEY SEGURIDAD DEL ESTADO',
  vif: 'VIOLENCIA INTRAFAMILIAR',
  hurto: 'HURTO / ROBO SIMPLE',
  amenazas: 'AMENAZAS',
  microtrafico: 'TENENCIA / MICROTRÁFICO',
  lesiones: 'LESIONES / RIÑA',
  danos: 'DAÑOS / VANDALISMO',
  receptacion: 'RECEPTACIÓN',
  porte_arma: 'PORTE ARMA / MUNICIÓN',
  conduccion_ebriedad: 'CONDUCCIÓN BAJO EFECTOS',
  grave: 'OTRO DELITO GRAVE',
};

/** Situaciones que por defecto encajan en tarifa “compleja” salvo que solo apliquen agravantes menores */
const SITUACION_BASE_COMPLEJA: ReadonlySet<Exclude<Situacion, null>> = new Set([
  'grave',
  'barricadas',
  'maltrato',
  'microtrafico',
  'vif',
  'lesiones',
  'receptacion',
  'porte_arma',
]);

const PRECIO_SIMPLE = 300000;
const PRECIO_COMPLEJO = 600000;
const WHATSAPP_NUMBER = '56962321883';
/** Si el callback del teletipo fallara, forzar fin de “razonamiento” para no bloquear el pago */
const TERMINAL_COMPLETE_FALLBACK_MS = 120_000;

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

// Mensajes orientativos por tipo (sin prometer resultado judicial)
const PAIN_MESSAGES: Record<Exclude<Situacion, null>, string> = {
  desordenes:
    'En desórdenes públicos suele ser clave ordenar el relato, revisar el parte y preparar la defensa técnica para el control de detención.',
  ley_alcohol:
    'En infracciones a la ley de alcoholes conviene revisar el procedimiento de fiscalización y el control de detención con estándar técnico.',
  maltrato:
    'En maltrato a funcionarios el relato policial pesa; conviene contradicción técnica y estrategia temprana con abogado.',
  barricadas:
    'En figuras de seguridad del Estado la complejidad procesal es alta; la defensa debe alinearse rápido con los antecedentes del expediente.',
  vif:
    'En violencia intrafamiliar las medidas y la valoración de los hechos dependen del tribunal y la Fiscalía; la defensa debe prepararse con el expediente completo.',
  hurto:
    'En hurto o robo simple la calificación y las eventuales medidas cautelares las define el tribunal según los antecedentes.',
  amenazas:
    'En amenazas la gravedad y el contexto fáctico marcan el curso del proceso; conviene asesoría temprana para el control de detención o audiencias.',
  microtrafico:
    'En tenencia o microtráfico la estrategia defensiva depende del relato fiscal, pericias y circunstancias del caso.',
  lesiones:
    'En lesiones o riñas la valoración médico-legal y el contexto fáctico marcan el curso; conviene asesoría temprana para el control de detención o formalización.',
  danos:
    'En daños o vandalismo la calificación y las eventuales medidas dependen del tribunal y la Fiscalía según los antecedentes.',
  receptacion:
    'En receptación la cadena de custodia y el conocimiento del origen de la cosa suelen ser centrales; la defensa debe alinearse rápido con el expediente.',
  porte_arma:
    'En porte de arma o munición la gravedad aparente y las medidas suelen ser sensibles; conviene coordinación profesional desde el primer contacto.',
  conduccion_ebriedad:
    'En conducción bajo efectos o estado de ebriedad pueden concurrir infracciones penales y administrativas; conviene revisar el procedimiento y el control.',
  grave:
    'En delitos graves las medidas cautelares dependen del juez y la Fiscalía; cuanto antes exista asesoría, mejor se puede preparar la actuación.',
};

function terminalLineClass(line: string): string {
  const t = line.trim();
  if (!t) return 'urgencia-mono-dim';
  if (t.includes('Indicador resumido')) return 'urgencia-mono-warn font-medium';
  if (t.includes('Complejidad aparente')) return 'urgencia-mono-accent font-medium';
  if (t.includes('RECOMENDACIÓN')) return 'text-rose-700 dark:text-rose-200/95 font-medium';
  if (t.includes('MODO SIMULACIÓN')) return 'text-slate-600 dark:text-slate-300';
  return 'urgencia-mono-dim';
}

const TerminalLines: React.FC<{
  sessionKey: number;
  nombre: string;
  situacion: Situacion;
  antecedentes: boolean;
  horasDetenido: number;
  gravedadLesiones: number;
  riesgoPorcentaje: number;
  isComplejo: boolean;
  onTypingComplete: () => void;
}> = ({
  sessionKey,
  nombre,
  situacion,
  antecedentes,
  horasDetenido,
  gravedadLesiones,
  riesgoPorcentaje,
  isComplejo,
  onTypingComplete,
}) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const typingDoneRef = useRef(false);
  const onCompleteRef = useRef(onTypingComplete);
  onCompleteRef.current = onTypingComplete;

  const situacionLabel = situacion ? SITUACION_TERMINAL_LABEL[situacion] : 'NO ESPECIFICADO';

  useEffect(() => {
    typingDoneRef.current = false;
    setVisibleLines([]);
    setCurrentText('');
    setLineIndex(0);
    setCharIndex(0);
  }, [sessionKey]);

  const lines = useMemo(
    () => [
      `> MODO SIMULACIÓN ORIENTATIVA (no vinculante ni predicción judicial)`,
      `> Procesando datos del formulario...`,
      `> Antecedentes declarados: ${antecedentes ? 'SÍ (según formulario)' : 'NO (según formulario)'}`,
      `> TITULAR / CONTACTO: ${(nombre || 'N/A').toUpperCase()}`,
      `> SITUACIÓN: ${situacionLabel}`,
      `> TIEMPO EN RETÉN (declarado): ${horasDetenido} HORAS`,
      `> Lesiones o daños (escala declarada): ${gravedadLesiones}/5${gravedadLesiones >= 3 ? ' — conviene revisarlo con defensa' : ''}`,
      ``,
      `> Complejidad aparente según formulario: ${isComplejo ? 'ALTA' : 'MEDIA'}`,
      ``,
      `> Indicador resumido (solo orientación): ${riesgoPorcentaje}%`,
      `> Recuerde: medidas cautelares y formalización las define el tribunal/Fiscalía.`,
      ``,
      `> RECOMENDACIÓN: ACTIVAR CONTACTO CON DEFENSA`,
    ],
    [nombre, situacionLabel, antecedentes, horasDetenido, gravedadLesiones, riesgoPorcentaje, isComplejo]
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
    }
    const t = setTimeout(() => {
      setVisibleLines((prev) => [...prev, line]);
      setCurrentText('');
      setCharIndex(0);
      setLineIndex((prev) => prev + 1);
    }, 150);
    return () => clearTimeout(t);
  }, [charIndex, lineIndex, lines]);

  useEffect(() => {
    if (lines.length === 0) return;
    if (lineIndex === lines.length && !typingDoneRef.current) {
      typingDoneRef.current = true;
      onCompleteRef.current();
    }
  }, [lineIndex, lines.length]);

  return (
    <div className="space-y-1.5 min-h-[140px]">
      {visibleLines.map((line, i) => (
        <p key={`${sessionKey}-${i}`} className={`text-[11px] leading-relaxed font-mono tracking-tight ${terminalLineClass(line)}`}>
          {line}
        </p>
      ))}
      {lineIndex < lines.length && (
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-mono tracking-tight">
          {currentText}
          <motion.span
            className="inline-block w-[2px] h-3.5 rounded-[1px] bg-rose-400 ml-1 align-middle"
            animate={{ opacity: [1, 0.35] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
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
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [terminalSessionId, setTerminalSessionId] = useState(0);
  const nombreInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTerminalTypingComplete = useCallback(() => {
    setIsTerminalComplete(true);
  }, []);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const whatsappValid = useMemo(() => {
    const cleaned = whatsapp.replace(/\D/g, '');
    return (cleaned.length === 11 && cleaned.startsWith('569')) || (cleaned.length === 9 && cleaned.startsWith('9'));
  }, [whatsapp]);

  // Geoloc: solo ayuda a sugerir comisaría; sin métricas simuladas
  const isComplejo = useMemo(() => {
    if (!situacion) return false;
    const baseCompleja = SITUACION_BASE_COMPLEJA.has(situacion);
    const agravante = tieneAntecedentes === true || gravedadLesiones >= 4;
    return baseCompleja || agravante;
  }, [situacion, tieneAntecedentes, gravedadLesiones]);

  const precio = isComplejo ? PRECIO_COMPLEJO : PRECIO_SIMPLE;
  const precioFmt = useMemo(() => new Intl.NumberFormat('es-CL').format(precio), [precio]);
  const servicioNombre = isComplejo ? 'Defensa penal prioritaria (caso complejo)' : 'Intervención de urgencia penal';
  const servicioDesc = isComplejo
    ? 'Incluye coordinación prioritaria, abogado especialista y seguimiento según el encargo acordado.'
    : 'Incluye orientación en detención y representación en control de detención según el encargo acordado.';

  // Riesgo dinámico (orientación; no predicción judicial)
  const riesgoPorcentaje = useMemo(() => {
    let base = 22;
    if (tieneAntecedentes) base += 34;
    if (situacion) {
      if (['grave', 'barricadas', 'maltrato', 'microtrafico', 'porte_arma', 'lesiones'].includes(situacion)) base += 26;
      else if (situacion === 'vif') base += 22;
      else if (['amenazas', 'hurto', 'receptacion', 'danos'].includes(situacion)) base += 14;
      else if (situacion === 'conduccion_ebriedad' || situacion === 'ley_alcohol') base += 10;
      else if (situacion === 'desordenes') base += 6;
    }
    if (gravedadLesiones >= 4) base += 20;
    if (horasDetenido >= 6) base += 10;
    return Math.min(95, base);
  }, [tieneAntecedentes, situacion, gravedadLesiones, horasDetenido]);

  const painMessage = useMemo(() => {
    const base = situacion ? PAIN_MESSAGES[situacion] : PAIN_MESSAGES.grave;
    if (horasDetenido >= 18) {
      return `Llevas ${horasDetenido} horas en retén (según lo indicado). En tiempos prolongados suele ser más urgente contar con asesoría. ${base}`;
    }
    if (horasDetenido >= 12) {
      return `Con ${horasDetenido} horas detenido (según lo indicado), conviene avanzar sin demora. ${base}`;
    }
    return base;
  }, [situacion, horasDetenido]);

  const pushUrgenciaPenal = useCallback(
    async (overrides: Partial<UrgenciaPenalMergeRow> = {}) => {
      if (!emailValid || !email.trim()) return;
      await mergeUrgenciaPenalRow({
        email: email.trim(),
        nombre: nombre.trim() || null,
        telefono: whatsapp.replace(/\D/g, '') || null,
        rut_detenido: rutDetenido.trim() || null,
        situacion,
        unidad_policial: unidadPolicial.trim() || null,
        geoloc_status: geolocStatus,
        tiene_antecedentes: tieneAntecedentes,
        gravedad_lesiones: gravedadLesiones,
        horas_detenido: horasDetenido,
        is_complejo: isComplejo,
        precio_clp: precio,
        lead_score: isComplejo ? 'HOT_URGENCIA_COMPLEJA' : 'WARM_URGENCIA_SIMPLE',
        paso: step,
        riesgo_porcentaje: riesgoPorcentaje,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        mercado_pago_iniciado: false,
        ...overrides,
      });
    },
    [
      email,
      emailValid,
      nombre,
      whatsapp,
      rutDetenido,
      situacion,
      unidadPolicial,
      geolocStatus,
      tieneAntecedentes,
      gravedadLesiones,
      horasDetenido,
      isComplejo,
      precio,
      step,
      riesgoPorcentaje,
    ]
  );

  // Geolocalización: sugerir comisaría Carabineros del sector oriente más cercana (Haversine)
  useEffect(() => {
    const t = setTimeout(() => {
      if (!navigator.geolocation) {
        setGeolocStatus('manual');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const near = getNearestComisariaOriente(latitude, longitude);
          if (near) {
            setGeolocStatus('detected');
            setUnidadPolicial((prev) => (prev.trim() ? prev : near.label));
          } else {
            setGeolocStatus('manual');
          }
        },
        () => {
          setGeolocStatus('manual');
        },
        { timeout: 10000, maximumAge: 120000, enableHighAccuracy: true }
      );
    }, 600);
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
        void pushUrgenciaPenal();
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
          void pushUrgenciaPenal();
        } else {
          console.warn('❌ Error guardando lead urgencia:', insertErr);
        }
      }
    } catch (e) {
      console.warn('Lead save:', e);
    }
  }, [
    email,
    emailValid,
    nombre,
    whatsapp,
    situacion,
    tieneAntecedentes,
    gravedadLesiones,
    horasDetenido,
    unidadPolicial,
    rutDetenido,
    isComplejo,
    leadSaved,
    pushUrgenciaPenal,
  ]);

  useEffect(() => {
    if (step === 'captura' || !emailValid || !email.trim()) return;
    const t = window.setTimeout(() => {
      void pushUrgenciaPenal();
    }, 1400);
    return () => clearTimeout(t);
  }, [
    step,
    emailValid,
    email,
    nombre,
    whatsapp,
    rutDetenido,
    situacion,
    unidadPolicial,
    geolocStatus,
    tieneAntecedentes,
    gravedadLesiones,
    horasDetenido,
    isComplejo,
    precio,
    riesgoPorcentaje,
    pushUrgenciaPenal,
  ]);

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
      await pushUrgenciaPenal({ paso: 'terminal', mercado_pago_iniciado: true });

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

      const mp = result as {
        init_point?: string;
        sandbox_init_point?: string;
      };
      const checkoutUrl =
        mp.init_point || (import.meta.env.DEV ? mp.sandbox_init_point : undefined);
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
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
    pushUrgenciaPenal,
  ]);

  useEffect(() => {
    setIsTerminalComplete(false);
  }, [step, terminalSessionId]);

  useEffect(() => {
    if (step !== 'terminal') return;
    const t = window.setTimeout(() => {
      setIsTerminalComplete(true);
    }, TERMINAL_COMPLETE_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [step, terminalSessionId]);

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
      setTerminalSessionId((k) => k + 1);
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
    return 'Hablar con el equipo';
  }, [step]);

  return (
    <>
      <SEO
        title={URGENCIA_SEO_TITLE}
        description={URGENCIA_SEO_DESCRIPTION}
        keywords={URGENCIA_SEO_KEYWORDS}
        url={URGENCIA_CANONICAL_URL}
        additionalJsonLd={[buildUrgenciaFaqJsonLd()]}
      />
      <UrgenciaPenalFocusLayout
        headerAriaLabel="Punto Legal Chile — Urgencia penal"
        headerSubtitle="Urgencia penal"
      >
        <style>{`
          input, select, textarea { font-size: 16px !important; }
          @supports (padding: max(0px)) {
            .pb-safe-bottom { padding-bottom: max(1.5rem, env(safe-area-inset-bottom)); }
            .bottom-safe { bottom: max(1.5rem, env(safe-area-inset-bottom)); }
          }
        `}</style>

        <main className="relative z-10 max-w-lg mx-auto px-4 sm:px-5 py-6 pb-28 pb-safe-bottom">
          <AnimatePresence mode="wait">
            {/* ══ PANTALLA 1: CAPTURA EMOCIONAL ══ */}
            {step === 'captura' && (
              <motion.div
                key="captura"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-7"
              >
                <form
                  autoComplete="on"
                  lang="es-CL"
                  className="space-y-7"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (canAdvanceCaptura) handleCapturaNext();
                  }}
                >
                <div className="space-y-2">
                  <p className="urgencia-kicker-pill">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--la-accent-from))] opacity-40" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--la-accent-to))] ring-1 ring-slate-900/12 dark:ring-white/15" />
                    </span>
                    Punto Legal Chile · Urgencia penal
                  </p>
                  <h1 className="font-display text-[1.65rem] sm:text-[1.85rem] font-bold tracking-[-0.03em] text-slate-900 dark:text-white leading-[1.15]">
                    ¿Tu familiar está detenido?
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-[0.9375rem] leading-relaxed">
                    Coordinación prioritaria con abogado penal para{' '}
                    <strong className="text-slate-800 dark:text-slate-200 font-medium">detención y control de detención</strong> en la Región
                    Metropolitana, con foco en el <strong className="text-slate-800 dark:text-slate-200 font-medium">sector oriente</strong> (Las
                    Condes, Providencia, Ñuñoa, Vitacura, Lo Barnechea, La Florida y comunas cercanas). En pocos pasos dejas tus
                    datos y la unidad; la presencia en comisaría o el formato de atención dependen del caso y de la disponibilidad
                    del equipo.
                  </p>
                </div>

                <div className="glass-ios-panel-dark p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100/90 border border-slate-200/90 dark:bg-white/[0.06] dark:border-white/[0.08]">
                      <MapPin className="w-4 h-4 text-rose-600/90 dark:text-rose-300/90" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {geolocStatus === 'detecting' ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-24 h-3 bg-slate-200/80 dark:bg-white/10 rounded animate-pulse" />
                        </span>
                      ) : geolocStatus === 'detected' ? (
                        'Ubicación aproximada'
                      ) : (
                        'Unidad policial o comisaría'
                      )}
                    </span>
                  </div>
                  {geolocStatus !== 'detecting' && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed"
                    >
                      {geolocStatus === 'detected'
                        ? 'Según tu ubicación aproximada, sugerimos la comisaría de Carabineros del sector oriente más cercana. Comprueba que sea la unidad donde podría estar la persona; si no, corrígelo.'
                        : 'Indica la unidad correcta (ej. 17.ª Las Condes, 19.ª Providencia, 16.ª Ñuñoa). Atendemos urgencias en el oriente y en toda la RM; el encargo se ajusta a tus antecedentes.'}
                    </motion.p>
                  )}
                  <label htmlFor="urgencia-unidad" className="sr-only">
                    Comisaría o unidad policial
                  </label>
                  <input
                    id="urgencia-unidad"
                    name="address-line1"
                    type="text"
                    placeholder="Ej: 17.ª Comisaría Las Condes, 19.ª Providencia"
                    value={unidadPolicial}
                    onChange={(e) => setUnidadPolicial(e.target.value)}
                    className="urgencia-input"
                    autoComplete="address-line1"
                    enterKeyHint="next"
                  />
                </div>

                {/* Nombre */}
                <div className="glass-ios-panel-dark p-4 sm:p-5 space-y-3">
                  <label
                    htmlFor="urgencia-nombre-contacto"
                    className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                  >
                    Nombre del detenido o quien activa
                  </label>
                  <input
                    ref={nombreInputRef}
                    id="urgencia-nombre-contacto"
                    name="name"
                    type="text"
                    placeholder="Solo nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="urgencia-input"
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="done"
                  />
                </div>

                {/* Motivo - Selector visual */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Motivo de detención
                  </label>
                  <div className="urgencia-situacion-grid" role="group" aria-label="Motivos de detención">
                    {SITUACIONES.map((s) => (
                      <motion.button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('medium');
                          setSituacion(s.id);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`urgencia-chip urgencia-chip--watch ${situacion === s.id ? 'urgencia-chip--active' : ''}`}
                      >
                        <span className="urgencia-chip__icon">
                          <s.Icon className="w-[1.1rem] h-[1.1rem] sm:w-[1.15rem] sm:h-[1.15rem]" strokeWidth={2} />
                        </span>
                        <span className="urgencia-chip-watch-label">{s.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {!canAdvanceCaptura && (
                    <p
                      className="text-center text-[11px] font-medium leading-snug text-slate-600 dark:text-slate-400 px-1"
                      role="status"
                    >
                      {!nombre.trim()
                        ? 'Falta el nombre de quien activa o del detenido.'
                        : !situacion
                          ? 'Elige el motivo de la detención.'
                          : 'Indica la comisaría o unidad policial.'}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!canAdvanceCaptura}
                    className="urgencia-primary-cta flex items-center justify-center gap-2.5"
                  >
                    <span className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
                      <span className="urgencia-primary-cta__label font-bold leading-tight">
                        <span className="sm:hidden">Continuar</span>
                        <span className="hidden sm:inline">Continuar — Coordinar defensa</span>
                      </span>
                      <span className="urgencia-primary-cta__sub sm:hidden">Coordinar defensa</span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                  </button>
                </div>

                <section className="urgencia-faq pt-2 space-y-3" aria-labelledby="urgencia-faq-heading">
                  <h2 id="urgencia-faq-heading" className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 px-1">
                    Preguntas frecuentes
                  </h2>
                  <div className="space-y-2">
                    {URGENCIA_FAQ_ITEMS.map((item, idx) => (
                      <details key={`urgencia-faq-${idx}`} className="group">
                        <summary className="cursor-pointer text-slate-800 dark:text-slate-100 pr-10 relative">
                          {item.question}
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-transform duration-200 group-open:rotate-90" />
                        </summary>
                        <p>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
                </form>
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
                className="space-y-7"
              >
                <button
                  type="button"
                  onClick={() => setStep('captura')}
                  className="urgencia-glass-back"
                >
                  <ArrowLeft className="w-4 h-4 opacity-80" />
                  Volver
                </button>
                <div className="space-y-2">
                  <h1 className="font-display text-xl sm:text-[1.35rem] font-bold tracking-[-0.03em] text-slate-900 dark:text-white leading-tight">
                    Necesitamos 3 datos más
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-[0.9375rem] leading-relaxed">
                    Para orientar la asignación y mostrarte un indicador resumido (simulación, no predicción judicial).
                  </p>
                </div>

                <form
                  autoComplete="on"
                  lang="es-CL"
                  className="space-y-7"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (canAdvanceCualificacion) handleCualificacionNext();
                  }}
                >
                {/* Antecedentes */}
                <div className="glass-ios-panel-dark p-4 sm:p-5 space-y-3">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    ¿Antecedentes previos?
                  </label>
                  <div className="flex gap-2.5">
                    <motion.button
                      type="button"
                      onClick={() => { triggerHaptic('light'); setTieneAntecedentes(false); }}
                      whileTap={{ scale: 0.98 }}
                      className={`urgencia-seg-btn flex-1 min-h-[3.25rem] ${
                        tieneAntecedentes === false ? 'urgencia-seg-btn--on' : 'urgencia-seg-btn--idle'
                      }`}
                    >
                      <span className="urgencia-seg-lead mr-1.5 inline">✓</span> No
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => { triggerHaptic('light'); setTieneAntecedentes(true); }}
                      whileTap={{ scale: 0.98 }}
                      className={`urgencia-seg-btn flex-1 min-h-[3.25rem] ${
                        tieneAntecedentes === true ? 'urgencia-seg-btn--on-warn' : 'urgencia-seg-btn--idle'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 inline mr-1.5 align-text-bottom opacity-90" /> Sí
                    </motion.button>
                  </div>
                </div>

                {/* Lesiones / Daños */}
                <div className="glass-ios-panel-dark p-4 sm:p-5 space-y-3">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Lesiones o daños reportados (1–5)
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <motion.button
                        key={n}
                        type="button"
                        onClick={() => { triggerHaptic('light'); setGravedadLesiones(n); }}
                        whileTap={{ scale: 0.96 }}
                        className={`urgencia-seg-btn flex-1 min-h-[2.75rem] text-sm font-semibold ${
                          gravedadLesiones >= n ? 'urgencia-seg-btn--on' : 'urgencia-seg-btn--idle'
                        }`}
                      >
                        {n}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">1 = ninguno · 5 = graves</p>
                </div>

                {/* Horas detenido - selector de botones */}
                <div className="glass-ios-panel-dark p-4 sm:p-5 space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <Clock className="w-3.5 h-3.5 urgencia-input-icon" strokeWidth={2} />
                    Tiempo en retén
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: 'Menos de 6h', value: 3, warn: false },
                      { label: '6–12 h', value: 9, warn: false },
                      { label: '12–18 h', value: 15, warn: true },
                      { label: '18–24 h', value: 21, warn: true },
                      { label: 'Más de 24 h', value: 30, warn: true },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          triggerHaptic(option.warn ? 'medium' : 'light');
                          setHorasDetenido(option.value);
                        }}
                        whileTap={{ scale: 0.985 }}
                        className={`urgencia-seg-btn min-h-[4.25rem] flex flex-col items-center justify-center gap-1.5 px-2 text-center ${
                          horasDetenido === option.value
                            ? option.warn
                              ? 'urgencia-seg-btn--on-warn'
                              : 'urgencia-seg-btn--on'
                            : 'urgencia-seg-btn--idle'
                        } ${option.value === 30 ? 'col-span-2 max-w-[14rem] mx-auto w-full' : ''}`}
                      >
                        <Clock className="w-4 h-4 shrink-0" strokeWidth={2} />
                        <span className="text-[11px] font-semibold leading-tight">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  {horasDetenido >= 15 && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-amber-800/95 dark:text-amber-200/90 mt-3 font-medium leading-relaxed"
                    >
                      En detenciones prolongadas suele ser más urgente contar con asesoría temprana; el curso del proceso lo
                      define el tribunal y la Fiscalía.
                    </motion.p>
                  )}
                </div>

                {/* RUT detenido - opcional con formateo automático */}
                <div className="glass-ios-panel-dark p-4 sm:p-5 space-y-3">
                  <label
                    htmlFor="urgencia-rut-detenido"
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                  >
                    RUT del detenido <span className="font-normal normal-case tracking-normal text-slate-600 dark:text-slate-400">(opcional)</span>
                  </label>
                  <input
                    id="urgencia-rut-detenido"
                    name="urgencia-rut-detenido"
                    type="text"
                    inputMode="numeric"
                    placeholder="12.345.678-9"
                    value={rutDetenido}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const cleaned = raw.replace(/[^0-9kK]/g, '');
                      if (cleaned.length <= 9) {
                        setRutDetenido(cleaned.length >= 2 ? formatRut(cleaned) : cleaned);
                      }
                    }}
                    maxLength={12}
                    className="urgencia-input"
                    autoComplete="off"
                    enterKeyHint="next"
                  />
                </div>

                <div className="urgencia-secreto-profesional" role="note">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/50 dark:border-white/[0.12] dark:bg-white/[0.06]">
                      <Lock className="h-4 w-4 text-slate-700 dark:text-slate-200" strokeWidth={2} aria-hidden />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
                        Secreto profesional
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Los datos que entregues quedan protegidos por el deber de confidencialidad del abogado frente a terceros,
                        conforme a la ley y al reglamento del ejercicio profesional. Solo se usan para coordinar esta urgencia y
                        la defensa técnica.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-ios-panel-dark p-4 sm:p-5 space-y-4">
                  <div className="relative">
                    <label
                      htmlFor="urgencia-email"
                      className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                    >
                      Email
                    </label>
                    <div className="relative w-full">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 urgencia-input-icon" />
                      <input
                        ref={emailInputRef}
                        id="urgencia-email"
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.cl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`urgencia-input pl-11 pr-11 ${email && emailValid ? 'urgencia-input--valid' : ''}`}
                        autoComplete="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        inputMode="email"
                        enterKeyHint="next"
                      />
                      {email && emailValid && (
                        <div className="urgencia-input-check absolute right-3.5 top-1/2 -translate-y-1/2">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="urgencia-telefono-movil"
                      className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                    >
                      WhatsApp
                    </label>
                    <div className="relative w-full">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 urgencia-input-icon" />
                      <input
                        id="urgencia-telefono-movil"
                        name="tel"
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
                        className={`urgencia-input pl-11 pr-11 ${whatsapp && whatsappValid ? 'urgencia-input--valid' : ''}`}
                        autoComplete="tel"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="done"
                      />
                      {whatsapp && whatsappValid && (
                        <div className="urgencia-input-check absolute right-3.5 top-1/2 -translate-y-1/2">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canAdvanceCualificacion}
                  className="urgencia-primary-cta flex items-center justify-center gap-2.5"
                >
                  <span className="urgencia-primary-cta__label min-w-0 flex-1 leading-snug">
                    Ver análisis y opción de pago
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                </button>
                </form>
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
                className={`space-y-6 ${isTerminalComplete ? 'pb-[max(11rem,calc(7rem+env(safe-area-inset-bottom)))]' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setStep('cualificacion');
                  }}
                  className="urgencia-glass-back"
                >
                  <ArrowLeft className="w-4 h-4 opacity-80" />
                  Volver
                </button>

                <div className="space-y-1.5">
                  <h1 className="font-display text-xl sm:text-[1.4rem] font-bold tracking-[-0.03em] text-slate-900 dark:text-white leading-tight">
                    Resumen y pago
                  </h1>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Simulación orientativa · no vinculante
                  </p>
                </div>

                <div className="urgencia-terminal-chrome">
                  <div className="urgencia-terminal-body">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200/80 dark:border-white/[0.07]">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/75 ring-1 ring-black/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/75 ring-1 ring-black/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500/80 ring-1 ring-black/20" />
                      </div>
                      <span className="text-slate-500 text-[9px] ml-1 uppercase tracking-[0.2em] font-medium">
                        punto-legal · simulación
                      </span>
                    </div>
                    <TerminalLines
                      sessionKey={terminalSessionId}
                      nombre={nombre.trim().split(' ')[0] || 'N/A'}
                      situacion={situacion}
                      antecedentes={tieneAntecedentes ?? false}
                      horasDetenido={horasDetenido}
                      gravedadLesiones={gravedadLesiones}
                      riesgoPorcentaje={riesgoPorcentaje}
                      isComplejo={isComplejo}
                      onTypingComplete={handleTerminalTypingComplete}
                    />
                  </div>
                </div>

                <p className="urgencia-disclaimer-card text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Lo anterior es una <strong className="text-slate-800 dark:text-slate-300 font-medium">simulación orientativa</strong> con los
                  datos que ingresaste. No reemplaza la valoración de un abogado ni anticipa lo que resolverá el tribunal.
                </p>

                <div className="glass-ios-panel-dark relative overflow-hidden rounded-[1.35rem] border border-slate-200/90 dark:border-white/[0.09] p-4 sm:p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_60px_-36px_rgba(0,0,0,0.65)]">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-100"
                    aria-hidden
                    style={{
                      background:
                        'radial-gradient(ellipse 120% 80% at 0% 0%, hsla(199 70% 52% / 0.07), transparent 52%), radial-gradient(ellipse 90% 70% at 100% 100%, hsla(217 45% 48% / 0.06), transparent 55%)',
                    }}
                  />
                  <div className="relative space-y-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Por qué coordinar abogado ahora
                    </p>
                    <p className="text-sm text-slate-800 dark:text-slate-100/95 leading-relaxed font-medium">
                      La defensa técnica te permite <strong className="text-slate-900 dark:text-white font-semibold">contrastar</strong> el relato
                      policial y fiscal con rigor procesal y estándar constitucional. La diferencia suele ser esta:{' '}
                      <strong className="text-slate-900 dark:text-white font-semibold">quien no contrata abogado queda a la suerte</strong>, sin orden
                      ni contradicción técnica frente a lo que ocurra en la unidad; en cambio,{' '}
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        al pagar y activar el servicio puedes comenzar tu defensa ya en comisaría
                      </strong>, con coordinación profesional hacia el control de detención.
                    </p>
                  </div>
                </div>

                <div className="glass-ios-panel-dark relative overflow-hidden rounded-[1.35rem] border border-slate-200/90 dark:border-white/[0.08] p-5 sm:p-6 ring-1 ring-slate-900/[0.04] dark:ring-white/[0.05]">
                  <div
                    className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full opacity-[0.14] blur-3xl bg-rose-500"
                    aria-hidden
                  />
                  <p className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-2">
                    Indicador orientativo
                  </p>
                  <p className="relative font-display text-4xl sm:text-[2.75rem] font-bold tracking-tighter text-slate-900 dark:text-white tabular-nums">
                    {riesgoPorcentaje}
                    <span className="text-2xl text-slate-500 dark:text-slate-400 font-semibold ml-0.5">%</span>
                  </p>
                  <p className="relative text-[0.8125rem] text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">{painMessage}</p>
                </div>

                {!isTerminalComplete && (
                  <div className="glass-ios-panel-dark rounded-[1.25rem] border border-dashed border-slate-300/90 dark:border-white/[0.12] p-6 sm:p-7">
                    <p className="text-center text-[0.8125rem] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Estamos cerrando el resumen en pantalla. Al terminar la animación verás el{' '}
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">monto</strong> y el acceso a{' '}
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">Mercado Pago</strong> fijo abajo.
                    </p>
                    <div className="mt-5 space-y-2.5" aria-hidden>
                      <div className="h-3 rounded-lg bg-slate-200/80 dark:bg-white/[0.07] animate-pulse" />
                      <div className="mx-auto h-3 w-[88%] rounded-lg bg-slate-200/60 dark:bg-white/[0.05] animate-pulse" />
                      <div className="mx-auto h-10 max-w-[12rem] rounded-xl bg-slate-200/70 dark:bg-white/[0.06] animate-pulse mt-4" />
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {isTerminalComplete && (
                    <motion.div
                      key="urgencia-checkout"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
                      className="glass-ios-panel-dark rounded-[1.35rem] border border-slate-200/90 dark:border-white/[0.09] overflow-hidden shadow-[0_24px_80px_-44px_rgba(15,23,42,0.1)] dark:shadow-[0_24px_80px_-44px_rgba(0,0,0,0.7)]"
                    >
                      <div className="px-4 py-3.5 sm:px-5 border-b border-slate-200/80 dark:border-white/[0.07] bg-slate-50/80 dark:bg-white/[0.025] backdrop-blur-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Listo para activar
                        </p>
                        <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 leading-snug">
                          Un pago seguro con <strong className="text-slate-900 dark:text-white font-semibold">Mercado Pago</strong> prioriza tu
                          alerta al equipo. Revisa estos puntos; el botón de pago queda fijo abajo.
                        </p>
                      </div>

                      <div className="divide-y divide-slate-200/70 dark:divide-white/[0.06]">
                        <div className="px-4 py-4 sm:px-5 flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100/90 border border-slate-200/90 dark:bg-white/[0.06] dark:border-white/[0.1] backdrop-blur-md">
                            <Shield className="h-5 w-5 text-rose-600/90 dark:text-rose-200/95" strokeWidth={2} aria-hidden />
                          </div>
                          <div className="min-w-0 space-y-1.5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              Derecho al silencio
                            </p>
                            <p className="text-[0.8125rem] sm:text-sm text-slate-800 dark:text-slate-200/95 leading-relaxed">
                              Tienes <strong className="text-slate-900 dark:text-white font-semibold">derecho a guardar silencio</strong> y no estás
                              obligado a declarar contra ti mismo. Evita hablar de los hechos sin asesoría:{' '}
                              <strong className="text-slate-900 dark:text-white font-semibold">cualquier dicho puede ser usado en tu contra</strong>.
                              Lo prudente es esperar defensa antes de rendir versión.
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-4 sm:px-5 flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#009EE3]/12 border border-[#009EE3]/28 backdrop-blur-md">
                            <Lock className="h-5 w-5 text-sky-700 dark:text-sky-200" strokeWidth={2} aria-hidden />
                          </div>
                          <div className="min-w-0 space-y-1.5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              Checkout oficial
                            </p>
                            <p className="text-[0.8125rem] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              El botón fijo abre el <strong className="text-slate-900 dark:text-slate-100 font-semibold">Checkout Pro</strong> de
                              Mercado Pago (mercadopago.cl). Verás el mismo total que aquí, medios habilitados y comprobante.
                              Punto Legal no guarda datos de tarjeta.
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-4 sm:px-5 flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100/90 border border-slate-200/90 dark:bg-white/[0.06] dark:border-white/[0.1] backdrop-blur-md">
                            <Scale className="h-5 w-5 text-slate-700 dark:text-slate-200" strokeWidth={2} aria-hidden />
                          </div>
                          <div className="min-w-0 space-y-1.5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              Tras confirmar el pago
                            </p>
                            <p className="text-[0.8125rem] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              El equipo recibe la <strong className="text-slate-900 dark:text-slate-100 font-semibold">alerta de urgencia</strong> con
                              tus datos y la unidad indicada. Un abogado se coordinará contigo para{' '}
                              <strong className="text-slate-900 dark:text-slate-100 font-semibold">comisaría o unidad</strong> y la{' '}
                              <strong className="text-slate-900 dark:text-slate-100 font-semibold">audiencia de control de detención</strong>, según
                              disponibilidad y el encargo contratado.
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-4 sm:px-5 flex gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-500/12 border border-rose-400/22 backdrop-blur-md">
                            <AlertTriangle className="h-5 w-5 text-rose-600/90 dark:text-rose-200/90" strokeWidth={2} aria-hidden />
                          </div>
                          <div className="min-w-0 space-y-1.5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              Sin patrocinio, más exposición
                            </p>
                            <p className="text-[0.8125rem] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              Actuar solo en detención suele implicar{' '}
                              <strong className="text-slate-900 dark:text-slate-100 font-semibold">más riesgo de declarar sin contradicción técnica</strong>{' '}
                              y de no revisar a tiempo el procedimiento. Contratar defensa{' '}
                              <strong className="text-slate-900 dark:text-slate-100 font-semibold">no garantiza</strong> resultado judicial, pero
                              acerca la actuación a estándar constitucional y procesal — y te deja enfocado en garantías, no en
                              improvisar bajo presión.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-4 sm:px-5 border-t border-slate-200/80 dark:border-white/[0.07] bg-slate-50/40 dark:bg-white/[0.02]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-1">
                              Servicio · CLP
                            </p>
                            <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-snug">{servicioNombre}</p>
                            <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed max-w-md">{servicioDesc}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Total</p>
                            <p className="font-display text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">${precioFmt}</p>
                            <span className="inline-flex mt-1 text-[9px] font-bold uppercase tracking-wider text-rose-800/95 dark:text-rose-200/95 bg-rose-100/90 dark:bg-rose-500/18 px-2 py-0.5 rounded-md border border-rose-300/50 dark:border-rose-500/25">
                              Urgencia
                            </span>
                          </div>
                        </div>

                        {error && (
                          <div className="mt-4 urgencia-alert-soft urgencia-alert-soft--rose">
                            <div className="flex gap-3">
                              <AlertTriangle className="w-5 h-5 text-rose-300 shrink-0" />
                              <div className="min-w-0 flex-1 space-y-2">
                                <p className="text-sm font-semibold text-rose-900 dark:text-rose-100 leading-snug">{error}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  En local hace falta backend o función Supabase; en producción el enlace es el checkout oficial.
                                </p>
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300/90 bg-slate-100/90 px-3.5 py-2.5 text-xs font-semibold text-slate-900 hover:bg-slate-200/80 dark:border-white/15 dark:bg-white/[0.07] dark:text-white dark:hover:bg-white/[0.11] transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  WhatsApp al equipo
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isTerminalComplete && (
                    <motion.div
                      key="urgencia-checkout-dock"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 80, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 38, delay: 0.05 }}
                      className="urgencia-checkout-dock fixed inset-x-0 bottom-0 z-[46] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none"
                    >
                      <div className="pointer-events-auto max-w-lg mx-auto rounded-[1.25rem] border border-slate-200/90 bg-white/92 dark:border-white/[0.12] dark:bg-slate-950/72 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-12px_48px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_-12px_48px_-12px_rgba(0,0,0,0.55)] ring-1 ring-slate-900/[0.05] dark:ring-white/[0.06] px-3.5 py-3 sm:px-4 sm:py-3.5">
                        {error ? (
                          <p className="text-[11px] text-rose-800 dark:text-rose-200/95 text-center mb-2 font-medium leading-snug">{error}</p>
                        ) : null}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                          <div className="flex sm:flex-col sm:items-start sm:justify-center gap-2 sm:gap-0 sm:min-w-[7rem] items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:hidden">
                              Total a pagar
                            </span>
                            <div>
                              <p className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-0.5">
                                Total
                              </p>
                              <p className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums leading-none">
                                ${precioFmt}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              triggerHaptic('heavy');
                              handleActivar();
                            }}
                            disabled={isPaying}
                            className={`urgencia-mp-cta flex-1 min-h-[52px] flex items-center justify-center gap-2 ${
                              isPaying ? 'urgencia-mp-cta--pending' : ''
                            }`}
                          >
                            {isPaying ? (
                              <>
                                <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
                                <span className="urgencia-primary-cta__label">Abriendo Mercado Pago…</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                                <span className="urgencia-primary-cta__label min-w-0 leading-snug">
                                  Pagar ${precioFmt} · Mercado Pago
                                </span>
                                <ChevronRight className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-center text-[9px] text-slate-500 leading-relaxed mt-2 px-1">
                          Checkout Pro en mercadopago.cl · confirma monto y medio antes de pagar
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* WhatsApp flotante - badge en terminal, animación */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed right-4 bottom-safe z-50 flex min-h-[52px] items-center gap-2.5 rounded-2xl border border-white/20 bg-[#25D366]/92 px-5 py-3 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150 font-semibold text-[0.9375rem] ring-1 ring-inset ring-white/15 transition-all duration-300 hover:bg-[#22c55e]/95 active:scale-[0.97] ${
            step === 'terminal' && isTerminalComplete
              ? 'bottom-[max(9.5rem,calc(8.5rem+env(safe-area-inset-bottom)))]'
              : 'bottom-6'
          }`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          whileTap={{ scale: 0.96 }}
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
              className="fixed inset-0 z-[60] flex items-center justify-center urgencia-overlay-scrim px-6"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="urgencia-overlay-check"
              >
                <Check className="w-9 h-9 text-white drop-shadow-sm" strokeWidth={2.5} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </UrgenciaPenalFocusLayout>
    </>
  );
}
