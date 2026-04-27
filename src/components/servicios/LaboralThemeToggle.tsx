import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

/**
 * Control de tema global (clase `dark` en `html`) para /servicios/laboral,
 * donde no hay header. Esquina superior derecha + safe-area: siempre a mano sin tapar el CTA móvil inferior.
 */
export function LaboralThemeToggle({
  mode,
  onToggle,
}: {
  mode: 'light' | 'dark'
  onToggle: () => void
}) {
  const isDark = mode === 'dark'

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={`fixed z-[35] flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-xl transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-transparent
        top-[max(0.65rem,env(safe-area-inset-top))]
        right-[max(0.65rem,env(safe-area-inset-right))]
        md:top-5 md:right-6
        ${
          isDark
            ? 'border-white/12 bg-slate-900/75 text-amber-200/95 hover:bg-slate-800/85'
            : 'border-slate-200/90 bg-white/85 text-slate-700 hover:bg-white shadow-slate-900/8'
        }`}
      whileTap={{ scale: 0.94 }}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun className="h-5 w-5" strokeWidth={2} aria-hidden /> : <Moon className="h-5 w-5" strokeWidth={2} aria-hidden />}
    </motion.button>
  )
}
