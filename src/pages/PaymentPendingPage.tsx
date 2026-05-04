import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Home, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';
import BrandWordmark from '@/components/BrandWordmark';
import { useTheme } from '@/hooks/useTheme';
import { LaboralThemeToggle } from '@/components/servicios/LaboralThemeToggle';

export default function PaymentPendingPage() {
  const { theme, toggleTheme } = useTheme();
  const shellGlass = theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark';
  const cardGlass = theme === 'light' ? 'glass-ios-card-light' : 'glass-ios-card-dark';

  return (
    <>
      <SEO
        title="Pago pendiente — Punto Legal"
        description="Tu pago está siendo verificado. Te notificaremos por mail cuando esté confirmado."
      />

      <div className="landing-canvas relative min-h-screen pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/72 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-slate-950/60">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <BrandWordmark size="sm" orientation="inline" />
            <div className="flex items-center gap-2 sm:gap-3">
              <LaboralThemeToggle mode={theme} onToggle={toggleTheme} variant="inline" />
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-amber-800 dark:text-amber-300/90 sm:text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                Verificando pago
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <div
              className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-amber-400/40 dark:border-amber-400/30"
              style={{
                background:
                  'linear-gradient(135deg, rgba(251,191,36,0.22), rgba(251,191,36,0.09))',
                boxShadow:
                  '0 18px 36px -10px rgba(251,191,36,0.32), inset 0 1.5px 0 rgba(255,255,255,0.35)',
              }}
            >
              <Clock className="w-10 h-10 text-amber-700 dark:text-amber-300" strokeWidth={1.8} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tu pago está en verificación
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              MercadoPago está confirmando tu pago con el banco. Apenas se
              acredite, te enviamos el correo con el{' '}
              <strong className="text-slate-900 dark:text-white">link de Google Meet</strong>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`${shellGlass} p-6 md:p-8 mb-6 shadow-xl`}
          >
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-5 uppercase tracking-[0.18em]">
              Próximos pasos
            </h2>
            <ol className="space-y-4 text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-300">
              {[
                'El banco verifica tu pago (1 a 5 minutos en tarjetas).',
                'Recibirás un correo de confirmación con el link de Google Meet.',
                'Tu consulta queda agendada y aparece en tu calendario.',
              ].map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="font-display font-bold text-amber-700 dark:text-amber-300 w-6 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`${shellGlass} p-6 md:p-8 mb-6 shadow-lg`}
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-[0.18em]">
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
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${cardGlass}`}
                >
                  <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

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

          <p className="mt-10 text-center text-[11.5px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
            Pago seguro vía MercadoPago · Recibirás confirmación por mail
          </p>
        </div>
      </div>
    </>
  );
}
