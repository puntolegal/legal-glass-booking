import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Home,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import SEO from '../components/SEO';
import BrandWordmark from '@/components/BrandWordmark';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Auto-redirect si el pago realmente fue aprobado.
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

    checkPaymentStatus();
  }, [searchParams]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-rose-500/30 border-t-rose-400 mx-auto mb-4" />
          <p className="text-slate-300 text-sm">Verificando estado del pago…</p>
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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {/* Header consistente con el resto de la app */}
        <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <BrandWordmark size="sm" orientation="inline" />
            <div className="flex items-center gap-2 text-xs text-rose-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Pago no procesado
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
          {/* Header de error */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <div
              className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-rose-500/30"
              style={{
                background:
                  'linear-gradient(135deg, rgba(244,63,94,0.22), rgba(244,63,94,0.10))',
                boxShadow:
                  '0 18px 36px -10px rgba(244,63,94,0.45), inset 0 1.5px 0 rgba(255,255,255,0.18)',
              }}
            >
              <XCircle className="w-10 h-10 text-rose-300" strokeWidth={1.8} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              No pudimos procesar tu pago
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
              Tranquilo: <strong className="text-white">no se cobró nada</strong>. Puedes
              reintentar en segundos o escribirnos y resolvemos contigo.
            </p>
          </motion.div>

          {/* ¿Qué pasó? */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-6 md:p-8 mb-6 backdrop-blur-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow:
                '0 24px 48px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <h2 className="text-lg md:text-xl font-bold text-white mb-5 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-rose-300" />
              ¿Qué pudo haber pasado?
            </h2>
            <ul className="space-y-2.5 text-[14.5px] leading-relaxed text-slate-300">
              {[
                'Datos de la tarjeta incorrectos o expirada.',
                'Fondos insuficientes en la cuenta.',
                'Problema temporal con el banco emisor.',
                'Conexión interrumpida durante la transacción.',
                'Tarjeta bloqueada o restringida para compras online.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-rose-400 flex-shrink-0"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Soluciones */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-6 md:p-8 mb-6 backdrop-blur-xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(34,211,238,0.06), rgba(59,130,246,0.04))',
              border: '1px solid rgba(34,211,238,0.18)',
              boxShadow:
                '0 18px 40px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <h3 className="text-base font-semibold text-white mb-4 uppercase tracking-[0.18em]">
              Cómo seguir
            </h3>
            <ol className="space-y-3 text-[14.5px] leading-relaxed text-slate-300">
              <li className="flex gap-3">
                <span className="font-display font-bold text-cyan-300 w-6 flex-shrink-0">
                  1.
                </span>
                <span>Verifica los datos de tu tarjeta y reintenta el pago.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-display font-bold text-cyan-300 w-6 flex-shrink-0">
                  2.
                </span>
                <span>Prueba con otra tarjeta o billetera digital aceptada por MercadoPago.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-display font-bold text-cyan-300 w-6 flex-shrink-0">
                  3.
                </span>
                <span>Si el problema persiste, escríbenos por WhatsApp y te coordinamos otro medio de pago.</span>
              </li>
            </ol>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              type="button"
              onClick={() => window.history.back()}
              className="cta-hero cta-hero--primary"
            >
              <RefreshCw className="h-5 w-5" aria-hidden />
              <span>Reintentar el pago</span>
            </button>
            <Link to="/" className="cta-hero cta-hero--ghost">
              <Home className="h-5 w-5" aria-hidden />
              <span>Volver al inicio</span>
            </Link>
            <Link
              to="/agendamiento"
              className="cta-hero cta-hero--ghost"
              aria-label="Volver al agendamiento"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
              <span>Volver al agendamiento</span>
            </Link>
          </motion.div>

          {/* Microcopy footer */}
          <p className="mt-10 text-center text-[11.5px] uppercase tracking-[0.2em] text-slate-500">
            Pago seguro vía MercadoPago · Sin cargos ocultos
          </p>
        </div>
      </div>
    </>
  );
}
