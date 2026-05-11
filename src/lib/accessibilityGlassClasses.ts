/**
 * Superficies alineadas al toggle de tema del landing (`LaboralThemeToggle`).
 */

export const A11Y_FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

/** Botón flotante / control circular (misma escala que variante landing del tema). */
export function accessibilityControlChrome(isDark: boolean): string {
  return isDark
    ? 'border border-white/[0.12] bg-[hsla(218,42%,12%,0.72)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl backdrop-saturate-150 hover:bg-[hsla(218,40%,14%,0.82)]'
    : 'border border-slate-200/90 bg-white/[0.88] text-slate-800 shadow-[0_8px_22px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-slate-900/[0.06] backdrop-blur-2xl backdrop-saturate-150 hover:bg-white/[0.96]'
}

/** Tarjeta / panel (menos contraste que el botón, más lectura). */
export function accessibilityPanelSurface(isDark: boolean): string {
  return isDark
    ? 'border border-white/[0.1] bg-[hsla(218,42%,11%,0.92)] text-slate-100 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150'
    : 'border border-slate-200/90 bg-white/[0.94] text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.05] backdrop-blur-2xl backdrop-saturate-150'
}

export function accessibilityPanelRow(isDark: boolean): string {
  return isDark
    ? 'rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4'
    : 'rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4'
}
