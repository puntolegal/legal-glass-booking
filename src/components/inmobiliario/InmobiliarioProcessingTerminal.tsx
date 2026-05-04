import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const MESSAGES = [
  'Revisando la referencia de su propiedad en el sector…',
  'Comparando valores de mercado en Las Condes, Vitacura, Lo Barnechea y La Reina…',
  'Incorporando antecedentes registrales orientativos…',
  'Evaluando un rango de precio defendible frente al mercado…',
  'Revisando checklist legal preventivo (dominio y cargas)…',
  'Afinando la proyección orientativa para la firma en notaría…',
] as const

type InmobiliarioProcessingTerminalProps = {
  /** `light`: sobre ventana cristalina (banca privada). */
  variant?: 'light' | 'dark'
  /** Intervalo entre mensajes (ms). */
  messageIntervalMs?: number
  /** Frecuencia de actualización del contador UF (ms). */
  ufTickMs?: number
}

/**
 * Ilusión de trabajo antes del éxito. Textos en español formal (Chile), sin jerga anglosajona.
 */
export function InmobiliarioProcessingTerminal({
  variant = 'dark',
  messageIntervalMs = 1250,
  ufTickMs = 155,
}: InmobiliarioProcessingTerminalProps) {
  const light = variant === 'light'
  const [msgIndex, setMsgIndex] = useState(0)
  const [ufDisplay, setUfDisplay] = useState(9_850)

  useEffect(() => {
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, messageIntervalMs)
    return () => window.clearInterval(id)
  }, [messageIntervalMs])

  useEffect(() => {
    const id = window.setInterval(() => {
      setUfDisplay((n) => {
        const bump = Math.floor(95 + Math.random() * 420)
        const next = n + bump
        return next > 24_800 ? 9_200 + Math.floor(Math.random() * 2200) : next
      })
    }, ufTickMs)
    return () => window.clearInterval(id)
  }, [ufTickMs])

  return (
    <div className="flex flex-col items-center px-2 py-4 text-center">
      <div className="relative mb-10 flex h-40 w-40 items-center justify-center">
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full border',
            light ? 'border-emerald-500/25' : 'border-emerald-400/20',
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className={cn('absolute inset-4 rounded-full border', light ? 'border-slate-200/90' : 'border-white/10')}
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className={cn(
            'absolute inset-8 rounded-full border',
            light ? 'border-emerald-400/35' : 'border-sky-400/18',
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
        />
        <div
          className="absolute inset-0 rounded-full opacity-35"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(5,150,105,0.12) 70deg, transparent 130deg, rgba(16,185,129,0.08) 210deg, transparent 300deg)',
          }}
        />
        <motion.div
          className={cn(
            'absolute h-[48%] w-[1.5px] origin-bottom rounded-full bg-gradient-to-t from-transparent',
            light
              ? 'via-emerald-600/40 to-emerald-800/50'
              : 'via-emerald-400/55 to-emerald-100/80',
          )}
          style={{ bottom: '50%', left: 'calc(50% - 0.75px)' }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
        />
        <div
          className={cn(
            'relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border backdrop-blur-md',
            light
              ? 'border-emerald-200/80 bg-white/90 shadow-sm'
              : 'border-white/10 bg-black/35',
          )}
        >
          <span
            className={cn(
              'text-[11px] font-semibold tracking-[0.2em]',
              light ? 'text-emerald-800' : 'text-emerald-200/90',
            )}
          >
            UF
          </span>
        </div>
      </div>

      <div className="min-h-[3.25rem] max-w-md px-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'text-[13px] font-medium leading-relaxed sm:text-sm',
              light ? 'text-slate-800' : 'text-slate-200',
            )}
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div
        className={cn(
          'mt-8 rounded-2xl border px-6 py-4 backdrop-blur-sm',
          light ? 'border-slate-200/70 bg-white/90 shadow-sm' : 'border-white/10 bg-black/25',
        )}
      >
        <p
          className={cn(
            'font-mono text-3xl font-semibold tabular-nums tracking-tight sm:text-[2.1rem]',
            light ? 'text-emerald-900' : 'text-emerald-50',
          )}
        >
          {ufDisplay.toLocaleString('es-CL')}
          <span
            className={cn('ml-2 text-lg font-medium sm:text-xl', light ? 'text-slate-600' : 'text-slate-500')}
          >
            UF
          </span>
        </p>
        <p
          className={cn(
            'mt-2 text-[10px] font-medium uppercase tracking-[0.18em]',
            light ? 'text-slate-600' : 'text-slate-500',
          )}
        >
          Proyección orientativa · no vinculante
        </p>
      </div>
    </div>
  )
}
