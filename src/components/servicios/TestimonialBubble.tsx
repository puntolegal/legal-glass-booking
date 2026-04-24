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
}: TestimonialBubbleProps) {
  const starString = '⭐️'.repeat(stars)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="glass-ios-card-dark p-6 h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700">
            <span className="text-xs" aria-hidden="true">
              {starString}
            </span>
            <span className="text-[11px] font-medium text-slate-200">{verifiedLabel}</span>
          </div>
          <span className="text-[11px] text-slate-500">{testimonial.role}</span>
        </div>
        <p className="text-sm md:text-base text-slate-300 mb-4 italic leading-relaxed">
          “{testimonial.content}”
        </p>
        <p className="text-sm font-semibold text-slate-100">{testimonial.name}</p>
      </div>
    </motion.div>
  )
}
