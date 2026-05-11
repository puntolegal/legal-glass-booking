import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const MESSAGES = [
  'Calculando el valor comercial en Chile…',
  'Estimando las características declaradas de su propiedad…',
  'Contrastando referencias del mercado en Las Condes, Vitacura, Lo Barnechea y La Reina…',
  'Ordenando antecedentes orientativos para su perfil de reunión…',
  'Preparando su caso para el equipo legal y comercial…',
] as const

const DONE_LABELS = [
  'Rango de mercado (orientativo)',
  'Características del activo',
  'Contexto comunal',
  'Checklist legal preliminar',
] as const

type InmobiliarioProcessingTerminalProps = {
  /** `light`: sobre ventana cristalina (banca privada). */
  variant?: 'light' | 'dark'
  /** Intervalo entre mensajes (ms). */
  messageIntervalMs?: number
  /** Duración estimada del bloque (barra determinística). */
  durationMs?: number
}

/**
 * Ilusión de trabajo antes del éxito: texto de esfuerzo + checklist (sin radar ni cifras inventadas).
 */
export function InmobiliarioProcessingTerminal({
  variant = 'dark',
  messageIntervalMs = 720,
  durationMs = 3500,
}: InmobiliarioProcessingTerminalProps) {
  const light = variant === 'light'
  const reduce = useReducedMotion()
  const [msgIndex, setMsgIndex] = useState(0)
  const [barPct, setBarPct] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, messageIntervalMs)
    return () => window.clearInterval(id)
  }, [messageIntervalMs])

  useEffect(() => {
    if (reduce) {
      setBarPct(100)
      return
    }
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / durationMs)
      setBarPct(Math.round(t * 100))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs, reduce])

  const visibleChecks = reduce ? DONE_LABELS.length : Math.min(DONE_LABELS.length, Math.ceil((barPct / 100) * DONE_LABELS.length))

  return (
    <div className="flex flex-col items-center px-2 py-4 text-center">
      <div className="mb-6 w-full max-w-md">
        <div
          className={cn(
            'h-1.5 w-full overflow-hidden rounded-full',
            light ? 'bg-slate-200/90' : 'bg-white/10',
          )}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={barPct}
        >
          <motion.div
            className={cn('h-full rounded-full', light ? 'bg-emerald-600' : 'bg-emerald-400')}
            initial={false}
            animate={{ width: `${barPct}%` }}
            transition={{ duration: reduce ? 0 : 0.12, ease: 'linear' }}
          />
        </div>
        <p
          className={cn(
            'mt-2 text-[10px] font-medium uppercase tracking-[0.16em]',
            light ? 'text-slate-500' : 'text-slate-500',
          )}
        >
          Análisis orientativo en curso
        </p>
      </div>

      <div className="min-h-[3.5rem] max-w-md px-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={reduce ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -5 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'text-[13px] font-medium leading-relaxed sm:text-sm',
              light ? 'text-slate-800' : 'text-slate-200',
            )}
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <ul className="mt-8 w-full max-w-sm space-y-2.5 text-left">
        {DONE_LABELS.map((label, i) => {
          const done = i < visibleChecks
          return (
            <li
              key={label}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[12px] font-medium transition-colors',
                light
                  ? done
                    ? 'border-emerald-200/90 bg-emerald-50/80 text-emerald-950'
                    : 'border-slate-200/70 bg-white/70 text-slate-500'
                  : done
                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-50'
                    : 'border-white/10 bg-black/20 text-slate-500',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border',
                  done
                    ? light
                      ? 'border-emerald-600/40 bg-emerald-600 text-white'
                      : 'border-emerald-400/40 bg-emerald-500/90 text-white'
                    : light
                      ? 'border-slate-200 bg-white'
                      : 'border-white/10 bg-white/5',
                )}
                aria-hidden
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
              </span>
              {label}
            </li>
          )
        })}
      </ul>

      <p
        className={cn(
          'mt-8 max-w-md text-[10px] font-medium leading-relaxed',
          light ? 'text-slate-600' : 'text-slate-500',
        )}
      >
        Resultado no vinculante: la reunión permite afinar precio, cargas y estrategia con su equipo.
      </p>
    </div>
  )
}
