import { motion } from 'framer-motion'

export interface TestimonialBubbleData {
  name: string
  role: string
  content: string
}

interface TestimonialBubbleProps {
  testimonial: TestimonialBubbleData
  index?: number
  /** Texto del badge superior (por defecto "Experiencia verificada"). */
  verifiedLabel?: string
  /** Cantidad de estrellas (1–5). Por defecto 5. */
  stars?: 1 | 2 | 3 | 4 | 5
  /** Superficie clara u oscura (glass y tipografía). */
  surface?: 'dark' | 'light'
}

/**
 * Burbuja de testimonio estilo iOS/Familia.
 * - Sin avatares circulares ni estrellas en línea separadas.
 * - Header con chip de "experiencia verificada" + rol a la derecha.
 * - Cita en italics, nombre destacado al pie.
 */
export default function TestimonialBubble({
  testimonial,
  index = 0,
  verifiedLabel = 'Experiencia verificada',
  stars = 5,
  surface = 'dark',
}: TestimonialBubbleProps) {
  const starString = '⭐️'.repeat(stars)
  const isLight = surface === 'light'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className={`p-6 h-full ${isLight ? 'glass-ios-card-light' : 'glass-ios-card-dark'}`}>
        <div className="flex items-center justify-between mb-3">
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${
              isLight
                ? 'bg-white/80 border-slate-200/90'
                : 'bg-slate-800/90 border border-slate-700'
            }`}
          >
            <span className="text-xs" aria-hidden="true">
              {starString}
            </span>
            <span
              className={`text-[11px] font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
            >
              {verifiedLabel}
            </span>
          </div>
          <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            {testimonial.role}
          </span>
        </div>
        <p
          className={`text-sm md:text-base mb-4 italic leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          “{testimonial.content}”
        </p>
        <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
          {testimonial.name}
        </p>
      </div>
    </motion.div>
  )
}
