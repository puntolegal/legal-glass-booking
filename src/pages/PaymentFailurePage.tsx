import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Compass, CreditCard, Home, RefreshCw, XCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/useTheme';
import { LaboralThemeToggle } from '@/components/servicios/LaboralThemeToggle';

const stepBadgeClass =
  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200/95 bg-white text-[11px] font-bold tabular-nums text-slate-800 shadow-sm shadow-slate-900/[0.04] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.95)] dark:border-white/[0.12] dark:bg-white/[0.05] dark:text-slate-100';

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme === 'dark';
  const shellGlass = theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark';
  const cardGlass = theme === 'light' ? 'glass-ios-card-light' : 'glass-ios-card-dark';

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const externalRef = searchParams.get('external_reference');
        const status = searchParams.get('status');

        if (status === 'approved' && externalRef) {
          window.location.href = `/payment-success?external_reference=${externalRef}`;
          return;
        }

        if (externalRef) {
          const { data: reserva } = await supabase
            .from('reservas')
            .select('estado, pago_estado')
            .eq('external_reference', externalRef)
            .maybeSingle();

          if (
            reserva &&
            (reserva.estado === 'confirmada' ||
              reserva.pago_estado === 'approved')
          ) {
            window.location.href = `/payment-success?external_reference=${externalRef}`;
            return;
          }
        }
      } catch (error) {
        console.error('Error verificando estado:', error);
      } finally {
        setChecking(false);
      }
    };

    void checkPaymentStatus();
  }, [searchParams]);

  if (checking) {
    return (
      <div className="landing-canvas relative min-h-screen flex items-center justify-center px-4">
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(5,150,105,0.06),transparent_60%)] dark:hidden"
          aria-hidden
        />
        <div className={`${shellGlass} px-10 py-8 text-center shadow-xl relative z-10`}>
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200/90 border-t-slate-600 mx-auto mb-4 dark:border-white/10 dark:border-t-slate-300" />
          <p className="text-slate-700 dark:text-slate-300 text-sm">Verificando estado del pago…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Error en el pago — Punto Legal"
        description="Hubo un problema procesando tu pago. No te preocupes, no se cobró nada. Intenta nuevamente o escríbenos."
      />

      <div className="landing-canvas relative min-h-screen pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_85%_55%_at_90%_0%,rgba(15,23,42,0.06),transparent_58%),radial-gradient(ellipse_70%_50%_at_10%_100%,rgba(5,150,105,0.06),transparent_55%)] dark:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 hidden dark:block bg-[radial-gradient(ellipse_at_top_right,rgba(5,150,105,0.07),transparent_58%),radial-gradient(ellipse_at_bottom_left,rgba(148,163,184,0.07),transparent_58%)]"
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
                <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-rose-500/90" aria-hidden />
                <span className="whitespace-nowrap">Pago no procesado</span>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-5 pb-10 md:pt-8 md:pb-14">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-200/80 bg-rose-50/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-rose-500/30 dark:bg-rose-500/10">
              <XCircle className="h-10 w-10 text-rose-600 dark:text-rose-300" strokeWidth={1.8} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              No pudimos procesar tu pago
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              Tranquilo: <strong className="text-slate-900 dark:text-white">no se cobró nada</strong>. Puedes
              reintentar en segundos o escribirnos y lo vemos contigo.
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 mx-auto max-w-3xl text-center"
          >
            <h2
              className={`font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <span className={isDark ? 'text-white' : 'text-slate-950'}>Tu abogado especialista,</span>{' '}
              <span
                className={
                  isDark
                    ? 'text-slate-300'
                    : 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 bg-clip-text text-transparent'
                }
              >
                online y en minutos.
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed px-1">
              45 minutos por Google Meet con un experto en tu caso. Diagnóstico, estrategia y un{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>plan de acción claro</strong>.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Link to="/#servicios" className="cta-hero cta-hero--primary !py-2.5 !px-4 text-sm">
                <Calendar className="h-4 w-4" aria-hidden />
                <span>Ver consultas y agendar</span>
              </Link>
              <Link to="/#como-funciona" className="cta-hero cta-hero--ghost !py-2.5 !px-4 text-sm">
                <Compass className="h-4 w-4" aria-hidden />
                <span>Cómo funciona</span>
              </Link>
            </div>
            <div className="institutional-stat-row mt-8 grid min-w-0 grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4 text-left">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="institutional-stat institutional-stat--hero min-w-0 h-full"
              >
                <span className="institutional-stat__value">Abogados</span>
                <span className="institutional-stat__label">De Chile</span>
                <span className="institutional-stat__note">Titulados y colegiados</span>
              </motion.div>
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="institutional-stat institutional-stat--hero min-w-0 h-full"
              >
                <span className="institutional-stat__value">Ética</span>
                <span className="institutional-stat__label">Profesional</span>
                <span className="institutional-stat__note">Código del Colegio de Abogados</span>
              </motion.div>
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="institutional-stat institutional-stat--hero min-w-0 h-full"
              >
                <span className="institutional-stat__value">Secreto</span>
                <span className="institutional-stat__label">Profesional</span>
                <span className="institutional-stat__note">Confidencialidad garantizada</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`${shellGlass} p-6 md:p-8 mb-6 shadow-xl`}
          >
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ¿Qué pudo haber pasado?
            </h2>
            <ul className="space-y-2.5 text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-300">
              {[
                'Datos de la tarjeta incorrectos o expirada.',
                'Fondos insuficientes en la cuenta.',
                'Problema temporal con el banco emisor.',
                'Conexión interrumpida durante la transacción.',
                'Tarjeta bloqueada o restringida para compras online.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0 dark:bg-slate-500"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={`${cardGlass} p-6 md:p-8 mb-6 border border-slate-200/80 shadow-lg dark:border-white/[0.08]`}
          >
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4">
              Cómo seguir
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={stepBadgeClass}>1</div>
                <p className="text-slate-700 dark:text-slate-300 text-sm pt-0.5 leading-relaxed">
                  Verifica los datos de tu tarjeta y reintenta el pago.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={stepBadgeClass}>2</div>
                <p className="text-slate-700 dark:text-slate-300 text-sm pt-0.5 leading-relaxed">
                  Prueba con otra tarjeta o billetera digital aceptada por Mercado Pago.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className={stepBadgeClass}>3</div>
                <p className="text-slate-700 dark:text-slate-300 text-sm pt-0.5 leading-relaxed">
                  Si el problema persiste, escríbenos por WhatsApp y coordinamos otro medio de pago.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button type="button" onClick={() => window.history.back()} className="cta-hero cta-hero--primary">
              <RefreshCw className="h-5 w-5" aria-hidden />
              <span>Reintentar el pago</span>
            </button>
            <Link to="/" className="cta-hero cta-hero--ghost">
              <Home className="h-5 w-5" aria-hidden />
              <span>Volver al inicio</span>
            </Link>
            <Link to="/agendamiento" className="cta-hero cta-hero--ghost" aria-label="Volver al agendamiento">
              <ArrowLeft className="h-5 w-5" aria-hidden />
              <span>Volver al agendamiento</span>
            </Link>
          </motion.div>

          <p className="mt-10 text-center text-[11.5px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
            Pago seguro vía Mercado Pago · Sin cargos ocultos
          </p>
        </div>
      </div>
    </>
  );
}
