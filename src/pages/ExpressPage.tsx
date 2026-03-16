// RUTA: src/pages/ExpressPage.tsx
// Landing QR Calle - Tráfico 100% móvil, GovTech/Banking style
// Flujo: Sticky Banner → Validación → Materia → Contacto → Checkout → Pago

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Home,
  Users,
  Briefcase,
  CreditCard,
  Building2,
  Lock,
  MessageCircle,
  Scale,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { trackMetaEvent } from '@/services/metaConversionsService';

type Materia = 'hogar' | 'familia' | 'trabajador' | 'deudas' | 'pyme' | 'penal' | null;

const MATERIAS = [
  { id: 'hogar' as const, label: 'Hogar (Arriendos y Propiedades)', icon: Home },
  { id: 'familia' as const, label: 'Familia (Pensión y Divorcio)', icon: Users },
  { id: 'trabajador' as const, label: 'Trabajador (Despidos y Sueldos)', icon: Briefcase },
  { id: 'deudas' as const, label: 'Deudas (Dicom y Embargos)', icon: CreditCard },
  { id: 'pyme' as const, label: 'Pyme (Constitución y Contratos)', icon: Building2 },
  { id: 'penal' as const, label: 'Derecho Penal', icon: Scale },
];

const PRECIO_EXPRESS = 25000;
const PRECIO_ORIGINAL = 75000;
const COUNTDOWN_MINUTES = 10;

// Formateo WhatsApp chileno editable y tolerante a correcciones
const formatWhatsapp = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  let normalized = digits;
  if (normalized.startsWith('56')) {
    normalized = normalized.slice(2);
  }
  if (normalized.startsWith('9')) {
    normalized = normalized.slice(1);
  }

  const number = normalized.slice(0, 8);
  const firstBlock = number.slice(0, 4);
  const secondBlock = number.slice(4, 8);

  let formatted = '+56 9';
  if (firstBlock) formatted += ` ${firstBlock}`;
  if (secondBlock) formatted += ` ${secondBlock}`;

  return formatted;
};

const getWhatsappDigits = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('569')) return digits.slice(3, 11);
  if (digits.startsWith('56')) return digits.slice(2, 10);
  if (digits.startsWith('9')) return digits.slice(1, 9);
  return digits.slice(0, 8);
};

const isValidWhatsapp = (value: string): boolean => getWhatsappDigits(value).length === 8;

export default function ExpressPage() {
  const navigate = useNavigate();
  const paso2Ref = useRef<HTMLDivElement>(null);
  const [materia, setMateria] = useState<Materia>(null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('+56 9 ');
  const [countdown, setCountdown] = useState(COUNTDOWN_MINUTES * 60); // segundos
  const [leadSaved, setLeadSaved] = useState(false);

  // Countdown del banner
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const countdownStr = `${Math.floor(countdown / 60)
    .toString()
    .padStart(2, '0')}:${(countdown % 60).toString().padStart(2, '0')}`;

  // Supabase Ninja: guardar lead al tener WhatsApp válido (debounce)
  const saveLead = useCallback(async () => {
    if (!isValidWhatsapp(whatsapp) || leadSaved) return;
    const phoneDigits = getWhatsappDigits(whatsapp);
    const phone = `569${phoneDigits}`;
    const emailPlaceholder = `express-${phone}@puntolegal.online`;
    try {
      const quizAnswers: Json = {
        source: 'QR_CALLE_CENTRO',
        nombre: nombre.trim(),
        whatsapp: whatsapp.replace(/\s/g, ''),
        materia,
        precio: PRECIO_EXPRESS,
        precio_original: PRECIO_ORIGINAL,
      };
      const { error: insertErr } = await supabase.from('leads_quiz').insert([
        {
          email: emailPlaceholder,
          name: nombre.trim() || 'Express QR',
          status: 'express_iniciado',
          quiz_answers: quizAnswers,
        },
      ]);
      if (!insertErr) {
        setLeadSaved(true);
        trackMetaEvent({
          event_name: 'Lead',
          user_data: { ph: phone },
          custom_data: {
            content_name: 'Express QR Calle - Lead',
            content_category: 'Express',
            value: PRECIO_EXPRESS,
            currency: 'CLP',
          },
        });
        console.log('✅ Lead Express guardado (ninja)');
      }
    } catch (e) {
      console.warn('Lead save:', e);
    }
  }, [whatsapp, nombre, materia, leadSaved]);

  useEffect(() => {
    if (!isValidWhatsapp(whatsapp)) return;
    const t = setTimeout(saveLead, 1500);
    return () => clearTimeout(t);
  }, [whatsapp, saveLead]);

  const handleMateriaClick = (m: Materia) => {
    setMateria(m);
    setTimeout(() => paso2Ref.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handlePayment = async () => {
    if (!nombre.trim() || !isValidWhatsapp(whatsapp)) return;
    const phone = whatsapp.replace(/\D/g, '');
    const emailPlaceholder = `express-${phone}@puntolegal.online`;
    const quizPayload = {
      source: 'QR_CALLE_CENTRO',
      nombre: nombre.trim(),
      whatsapp: whatsapp.replace(/\s/g, ''),
      materia,
      precio: PRECIO_EXPRESS,
      precio_original: PRECIO_ORIGINAL,
    };
    const { data: updated } = await supabase
      .from('leads_quiz')
      .update({ status: 'checkout_iniciado', quiz_answers: quizPayload })
      .eq('email', emailPlaceholder)
      .select('id');
    if (!updated?.length) {
      await supabase.from('leads_quiz').insert([
        { email: emailPlaceholder, name: nombre.trim() || 'Express QR', status: 'checkout_iniciado', quiz_answers: quizPayload },
      ]);
    }
    trackMetaEvent({
      event_name: 'InitiateCheckout',
      user_data: { ph: whatsapp.replace(/\D/g, '') },
      custom_data: {
        content_name: 'Consulta Legal Express (Presencial QR)',
        value: PRECIO_EXPRESS,
        currency: 'CLP',
      },
    });
    const externalRef = `EXPRESS-${phone}-${Date.now()}`;
    const paymentData = {
      id: externalRef,
      reservaId: externalRef,
      external_reference: externalRef,
      nombre: nombre.trim(),
      email: `express-${phone}@puntolegal.online`,
      telefono: whatsapp.replace(/\s/g, ''),
      service: 'Consulta Legal Express (Presencial QR)',
      category: 'Express',
      price: PRECIO_EXPRESS,
      priceFormatted: new Intl.NumberFormat('es-CL').format(PRECIO_EXPRESS),
      originalPrice: PRECIO_ORIGINAL,
      fecha: new Date().toISOString().split('T')[0],
      hora: 'A coordinar',
      date: new Date().toISOString().split('T')[0],
      time: 'A coordinar',
      tipo_reunion: 'presencial',
      timestamp: Date.now(),
      matter: materia,
      source: 'express_qr',
    };
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    navigate('/pago');
  };

  const canPay = nombre.trim().length >= 2 && isValidWhatsapp(whatsapp);

  return (
    <>
      <SEO
        title="Consulta Legal $25.000 - Punto Legal | Centro"
        description="Consulta presencial validada. Cupo limitado. Resuelve tu problema legal hoy."
      />

      <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans antialiased pb-safe">
        {/* 1. Sticky Urgency Banner */}
        <div className="sticky top-0 z-50 bg-red-600 text-white py-2.5 px-4 text-center text-sm font-bold shadow-md">
          🔴 [URGENTE] Cupo 03/50 asignado. Expira en: {countdownStr}
        </div>

        <main className="max-w-lg mx-auto px-4 py-6">
          {/* 2. Header / Validación */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Ticket Presencial Validado
            </h1>
            <p className="text-slate-600 text-sm flex items-center justify-center gap-2 flex-wrap">
              <span className="line-through text-slate-400">Consulta Especialista: $75.000</span>
              <span className="font-bold text-slate-900">$25.000</span>
            </p>
          </motion.div>

          {/* 3. Paso 1: Selección de Materia */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-lg font-black text-slate-900 mb-4">
              1. ¿Qué necesitas resolver hoy?
            </h2>
            <div className="space-y-3">
              {MATERIAS.map((m) => (
                <motion.button
                  key={m.id}
                  type="button"
                  onClick={() => handleMateriaClick(m.id)}
                  className={`w-full min-h-[68px] flex items-center gap-4 px-5 rounded-xl border-2 font-bold text-left transition-all ${
                    materia === m.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-900 border-slate-300 hover:border-slate-400'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <m.icon className="w-8 h-8 flex-shrink-0" />
                  <span>{m.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 4. Paso 2: Datos de Contacto (visible tras elegir materia) */}
          <AnimatePresence>
            {materia && (
              <motion.div
                ref={paso2Ref}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-10"
              >
                <h2 className="text-lg font-black text-slate-900 mb-4">
                  2. ¿A qué número te llama el abogado?
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Tu nombre real"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full h-[60px] px-4 text-lg font-medium border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                    className="w-full h-[60px] px-4 text-lg font-medium border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. Paso 3: Checkout */}
          <AnimatePresence>
            {materia && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-black text-slate-900">3. Confirmar y pagar</h2>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={!canPay}
                  className={`w-full py-5 text-lg font-black text-white rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all ${
                    canPay
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-6 h-6" />
                  💳 PAGAR $25.000 Y AGENDAR AHORA
                </button>

                <div className="flex flex-col items-center gap-2 pt-2">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Pago Seguro MercadoPago</span>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center max-w-xs">
                    Garantía 100%: Si no hay solución legal, se devuelve el dinero.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
