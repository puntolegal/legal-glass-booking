import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Scale, TrendingUp, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TerminalNumberTicker } from '@/components/inmobiliario/TerminalNumberTicker'

const BARS = [
  { key: 'audit', label: 'Auditoría legal orientativa', pct: 100, delay: 0 },
  { key: 'price', label: 'Precio de mercado defendible', pct: 88, delay: 0.08 },
  { key: 'net', label: 'Utilidad neta proyectada', pct: 76, delay: 0.16 },
] as const

type InmobiliarioAiValueChartProps = {
  /** `civil`: mismo lenguaje visual que landing /inmobiliario (ServicioPageShell civil). */
  variant?: 'light' | 'civil'
}

/**
 * Bloque visual tipo “gráfico iOS glass”: enfatiza interpretación humana
 * sobre datos y analítica, sin prometer resultados judiciales ni de mercado.
 */
export function InmobiliarioAiValueChart({ variant = 'light' }: InmobiliarioAiValueChartProps) {
  const reduce = useReducedMotion()
  const civil = variant === 'civil'
  const wrapRef = useRef<HTMLDivElement>(null)
  const barsInView = useInView(wrapRef, { once: true, margin: '-40px' })

  return (
    <div
      ref={wrapRef}
      className={cn(
        'relative overflow-hidden rounded-[1.5rem] border p-5 sm:p-7 backdrop-blur-2xl ring-1',
        civil
          ? 'border-white/10 bg-slate-950/60 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-white/5'
          : 'border-slate-200/90 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-white/80',
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl',
          civil ? 'bg-emerald-500/10' : 'bg-slate-800/10',
        )}
        aria-hidden
      />
      <div
        className={cn(
          'pointer-events-none absolute -bottom-24 -left-12 h-40 w-40 rounded-full blur-3xl',
          civil ? 'bg-sky-500/10' : 'bg-amber-400/15',
        )}
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="max-w-xl">
          <div
            className={cn(
              'mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]',
              civil
                ? 'border-white/10 bg-white/5 text-slate-200'
                : 'border-slate-200/90 bg-slate-50/95 text-slate-800',
          )}
        >
            <Scale className={cn('h-3.5 w-3.5', civil ? 'text-emerald-400' : 'text-slate-700')} aria-hidden />
            Área Legal · Área Comercial
          </div>
          <h2
            className={cn(
              'text-xl font-semibold tracking-tight sm:text-2xl',
              civil ? 'text-slate-50' : 'text-slate-900',
            )}
          >
            Nuestro equipo comercial y legal orienta la salida de su propiedad con estudio de mercado riguroso,
            dominio y cargas, para sostener un precio defendible y un cierre ordenado.
          </h2>
          <p
            className={cn(
              'mt-2 text-sm font-medium leading-relaxed sm:text-[15px]',
              civil ? 'text-slate-200' : 'text-slate-800',
            )}
          >
            Los antecedentes se cruzan con criterio profesional; cada lectura es revisada por abogados y corredor.
          </p>
          <p
            className={cn(
              'mt-2 text-sm leading-relaxed sm:text-[15px]',
              civil ? 'text-slate-400' : 'text-slate-600',
            )}
          >
            Cruzamos señales del inmueble con el mercado y el checklist legal para fijar el precio, filtrar
            interesados y preparar el camino hacia una firma estable, con decisión humana en cada etapa.
          </p>
          <div className={cn('mt-4 flex flex-wrap items-center gap-4 text-xs', civil ? 'text-slate-500' : 'text-slate-500')}>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className={cn('h-3.5 w-3.5', civil ? 'text-emerald-400/90' : 'text-slate-700')} aria-hidden />
              Menos improvisación en el precio publicado
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className={cn('h-3.5 w-3.5', civil ? 'text-sky-400/85' : 'text-slate-600')} aria-hidden />
              Mayor claridad en costos y escenarios de cierre
            </span>
          </div>
        </div>

        <div className="w-full shrink-0 sm:max-w-[280px]">
          <p
            className={cn(
              'mb-3 text-center text-[10px] font-semibold uppercase tracking-wider',
              civil ? 'text-slate-500' : 'text-slate-500',
            )}
          >
            Lectura orientativa (ejemplo)
          </p>
          <div
            className={cn(
              'space-y-4 rounded-2xl border p-4 shadow-inner',
              civil ? 'border-white/10 bg-black/30' : 'border-slate-200/80 bg-white/80',
            )}
          >
            {BARS.map((b) => (
              <div key={b.key}>
                <div
                  className={cn(
                    'mb-1 flex justify-between text-[11px] font-medium',
                    civil ? 'text-slate-300' : 'text-slate-700',
                  )}
                >
                  <span>{b.label}</span>
                  <span className={cn('tabular-nums', civil ? 'text-slate-400' : 'text-slate-500')}>
                    {barsInView ? (
                      <TerminalNumberTicker
                        value={b.pct}
                        suffix="%"
                        duration={0.95 + b.delay}
                        className={civil ? 'text-emerald-100/95' : ''}
                      />
                    ) : (
                      `0%`
                    )}
                  </span>
                </div>
                <div
                  className={cn(
                    'h-2.5 overflow-hidden rounded-full',
                    civil ? 'bg-white/10' : 'bg-slate-200/90',
                  )}
                >
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      civil
                        ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-500'
                        : 'bg-gradient-to-r from-slate-700 via-slate-800 to-slate-600',
                    )}
                    initial={{ width: reduce ? `${b.pct}%` : 0 }}
                    animate={{ width: barsInView ? `${b.pct}%` : reduce ? `${b.pct}%` : 0 }}
                    transition={{
                      duration: reduce ? 0 : 1.1,
                      delay: reduce ? 0 : 0.35 + b.delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p
        className={cn(
          'relative mt-4 border-t pt-3 text-[10px] leading-relaxed',
          civil ? 'border-white/10 text-slate-500' : 'border-slate-200/80 text-slate-500',
        )}
      >
        Ilustración de concepto. La analítica y la IA apoyan el trabajo del equipo; no sustituyen tasación oficial ni
        estudio de títulos exhaustivo, y no constituyen garantía de precio de venta. Resultados dependen del mercado y
        del caso.
      </p>
    </div>
  )
}
