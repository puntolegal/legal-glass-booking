import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export interface TestimonialBubbleData {
  name: string
  role: string
  content: string
}

const AVATAR_BG = ['bg-emerald-600', 'bg-indigo-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600'] as const

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    const a = parts[0][0] ?? ''
    const b = parts[parts.length - 1][0] ?? ''
    return (a + b).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '—'
}

interface TestimonialBubbleProps {
  testimonial: TestimonialBubbleData
  index?: number
  /** Texto auxiliar junto al nombre (p. ej. “Experiencia verificada”). */
  verifiedLabel?: string
  /** Cantidad de estrellas (1–5). Por defecto 5. */
  stars?: 1 | 2 | 3 | 4 | 5
  /** Superficie clara u oscura (glass y tipografía). */
  surface?: 'dark' | 'light'
}

/**
 * Testimonio con estrellas tipo reseña, avatar por iniciales y cita legible.
 */
export default function TestimonialBubble({
  testimonial,
  index = 0,
  verifiedLabel = 'Experiencia verificada',
  stars = 5,
  surface = 'dark',
}: TestimonialBubbleProps) {
  const isLight = surface === 'light'
  const initials = initialsFromName(testimonial.name)
  const avatarBg = AVATAR_BG[index % AVATAR_BG.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className={`p-6 h-full ${isLight ? 'glass-ios-card-light' : 'glass-ios-card-dark'}`}>
        <div
          className="mb-3 flex gap-0.5"
          aria-label={`${stars} de 5 estrellas`}
        >
          {Array.from({ length: stars }, (_, i) => (
            <Star
              key={i}
              className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
              strokeWidth={1.2}
              aria-hidden
            />
          ))}
        </div>

        <p
          className={`text-sm md:text-base mb-5 italic leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          “{testimonial.content}”
        </p>

        <div className="flex items-center gap-3 border-t border-slate-200/60 pt-4 dark:border-white/10">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-inner ${avatarBg}`}
            aria-hidden
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {testimonial.name}
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{testimonial.role}</p>
            <p className={`mt-1 text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              {verifiedLabel}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
