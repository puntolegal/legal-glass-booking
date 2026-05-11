import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

type ThemeToggleVariant = 'laboral' | 'landing' | 'inline' | 'urgencia'

/**
 * Control de tema global (clase `dark` en `html`).
 * - laboral: esquina superior derecha + safe-area (página sin header).
 * - landing: en móvil esquina superior derecha (safe-area); en desktop inferior derecha.
 * - inline: dentro de header/toolbar (sin posición fixed).
 * - urgencia: mismo vidrio que `.urgencia-header-glass` (barra /urgencia).
 */
export function LaboralThemeToggle({
  mode,
  onToggle,
  variant = 'laboral',
}: {
  mode: 'light' | 'dark'
  onToggle: () => void
  variant?: ThemeToggleVariant
}) {
  const isDark = mode === 'dark'
  const isLanding = variant === 'landing'
  const isInline = variant === 'inline'
  const isUrgencia = variant === 'urgencia'

  const positionClasses = isInline || isUrgencia
    ? 'relative shrink-0'
    : isLanding
      ? // Móvil: arriba del todo (safe-area); desktop: esquina inferior derecha.
        'max-lg:top-[max(0.65rem,env(safe-area-inset-top,0px))] max-lg:bottom-auto max-lg:right-[max(0.75rem,env(safe-area-inset-right,0px))] lg:bottom-8 lg:right-10'
      : 'fixed top-[max(0.65rem,env(safe-area-inset-top))] bottom-auto right-[max(0.65rem,env(safe-area-inset-right))] md:top-5 md:right-6'

  const sizeClasses = isLanding || isInline || isUrgencia
    ? 'h-10 w-10 md:h-10 md:w-10'
    : 'h-12 w-12 md:h-11 md:w-11'

  const zClasses = isInline || isUrgencia ? 'z-auto' : isLanding ? 'z-[160]' : 'z-[80]'

  const iconSize = isLanding || isInline || isUrgencia ? 'h-[18px] w-[18px]' : 'h-5 w-5'

  const surfaceClasses = isUrgencia
    ? 'urgencia-header-theme-toggle border-0 text-slate-800 shadow-none ring-0 dark:text-white'
    : isDark
      ? 'border border-white/[0.12] bg-[hsla(218,42%,12%,0.72)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl backdrop-saturate-150 hover:bg-[hsla(218,40%,14%,0.82)]'
      : 'border border-slate-200/90 bg-white/[0.88] text-slate-800 shadow-[0_8px_22px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-slate-900/[0.06] backdrop-blur-2xl backdrop-saturate-150 hover:bg-white/[0.96]'

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={`${isInline || isUrgencia ? '' : 'fixed'} ${zClasses} flex ${sizeClasses} items-center justify-center rounded-2xl transition-all touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-transparent ${positionClasses} ${surfaceClasses}`}
      whileTap={{ scale: 0.94 }}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <Sun className={iconSize} strokeWidth={2} aria-hidden />
      ) : (
        <Moon className={iconSize} strokeWidth={2} aria-hidden />
      )}
    </motion.button>
  )
}
