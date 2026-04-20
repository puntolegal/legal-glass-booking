import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Home, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';
import BrandWordmark from '@/components/BrandWordmark';

export default function PaymentPendingPage() {
  return (
    <>
      <SEO
        title="Pago pendiente — Punto Legal"
        description="Tu pago está siendo verificado. Te notificaremos por mail cuando esté confirmado."
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {/* Header consistente */}
        <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <BrandWordmark size="sm" orientation="inline" />
            <div className="flex items-center gap-2 text-xs text-amber-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Verificando pago
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
          {/* Header de pendiente */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <div
              className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-amber-400/30"
              style={{
                background:
                  'linear-gradient(135deg, rgba(251,191,36,0.20), rgba(251,191,36,0.08))',
                boxShadow:
                  '0 18px 36px -10px rgba(251,191,36,0.40), inset 0 1.5px 0 rgba(255,255,255,0.18)',
              }}
            >
              <Clock className="w-10 h-10 text-amber-300" strokeWidth={1.8} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Tu pago está en verificación
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
              MercadoPago está confirmando tu pago con el banco. Apenas se
              acredite, te enviamos el correo con el{' '}
              <strong className="text-white">link de Google Meet</strong>.
            </p>
          </motion.div>

          {/* Estado del pago */}
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
            <h2 className="text-base md:text-lg font-bold text-white mb-5 uppercase tracking-[0.18em]">
              Próximos pasos
            </h2>
            <ol className="space-y-4 text-[14.5px] leading-relaxed text-slate-300">
              {[
                'El banco verifica tu pago (1 a 5 minutos en tarjetas).',
                'Recibirás un correo de confirmación con el link de Google Meet.',
                'Tu consulta queda agendada y aparece en tu calendario.',
              ].map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="font-display font-bold text-amber-300 w-6 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Tiempos de procesamiento */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-6 md:p-8 mb-6 backdrop-blur-xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h3 className="text-base font-semibold text-white mb-4 uppercase tracking-[0.18em]">
              Tiempos típicos
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-[13.5px]">
              {[
                { label: 'Tarjetas de débito', value: '1 a 3 minutos' },
                { label: 'Tarjetas de crédito', value: '2 a 5 minutos' },
                { label: 'Transferencias', value: '5 a 15 minutos' },
                { label: 'Billeteras digitales', value: '1 a 2 minutos' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <span className="text-slate-400">{row.label}</span>
                  <span className="font-medium text-white">{row.value}</span>
                </div>
              ))}
            </div>
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
              onClick={() => window.location.reload()}
              className="cta-hero cta-hero--primary"
            >
              <RefreshCw className="h-5 w-5" aria-hidden />
              <span>Actualizar estado</span>
            </button>
            <Link to="/" className="cta-hero cta-hero--ghost">
              <Home className="h-5 w-5" aria-hidden />
              <span>Volver al inicio</span>
            </Link>
          </motion.div>

          <p className="mt-10 text-center text-[11.5px] uppercase tracking-[0.2em] text-slate-500">
            Pago seguro vía MercadoPago · Recibirás confirmación por mail
          </p>
        </div>
      </div>
    </>
  );
}
