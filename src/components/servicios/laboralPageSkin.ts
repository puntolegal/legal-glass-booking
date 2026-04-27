/**
 * Clases duales para /servicios/laboral (superficie clara vs oscura).
 * Mantiene tokens de `useServicioTheme()` para acentos y CTAs.
 */
export function getLaboralPageSkin(isDark: boolean) {
  const d = isDark
  return {
    glassPanel: d ? 'glass-ios-panel-dark' : 'glass-ios-panel-light',
    glassCard: d ? 'glass-ios-card-dark' : 'glass-ios-card-light',
    borderSection: d ? 'border-slate-800/80' : 'border-slate-200/90',

    textTitle: d ? 'text-white' : 'text-slate-900',
    textBody: d ? 'text-slate-400' : 'text-slate-600',
    textStrong: d ? 'text-slate-200' : 'text-slate-800',
    textList: d ? 'text-slate-300' : 'text-slate-700',

    heroBadgeIcon: d ? 'text-teal-300' : 'text-teal-600',
    heroBadgeText: d ? 'text-slate-200' : 'text-slate-600',
    heroBadgeAccent: d ? 'text-teal-200' : 'text-teal-700',
    heroLead: d ? 'text-teal-200/95' : 'text-teal-800',

    heroBlobTR: d ? 'bg-teal-600/5' : 'bg-teal-400/12',
    heroBlobBL: d ? 'bg-sky-600/4' : 'bg-sky-400/10',
    heroLine: d
      ? 'from-transparent via-teal-400/25 to-transparent'
      : 'from-transparent via-teal-300/35 to-transparent',

    trustOuter: d
      ? 'border-white/10 bg-white/[0.05] shadow-md shadow-black/25 backdrop-blur-md'
      : 'border-slate-200/90 bg-white/55 shadow-sm shadow-slate-900/[0.03] backdrop-blur-md',
    trustIconBox: d ? 'bg-teal-600/10 border border-teal-500/22' : 'bg-teal-50 border border-teal-100',
    trustIcon: d ? 'text-teal-300' : 'text-teal-700',
    trustLabel: d ? 'text-slate-200' : 'text-slate-700',

    viasPrimaryBg: d
      ? 'bg-teal-600/[0.06] hover:bg-teal-600/10 border-0'
      : 'bg-teal-50/90 border border-teal-200/80 hover:bg-teal-50',
    viasSecondary: d
      ? 'border-white/10 bg-white/[0.03] hover:border-teal-500/30 hover:bg-white/[0.06]'
      : 'border-slate-200/90 bg-white/70 hover:border-teal-300/80 hover:bg-white/95 hover:shadow-sm',
    viasCardTitle: d ? 'text-white' : 'text-slate-900',
    viasCardMuted: d ? 'text-slate-400' : 'text-slate-600',

    procesoCard: d
      ? 'rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left'
      : 'rounded-2xl border border-slate-200/90 bg-white/65 p-4 text-left shadow-sm shadow-slate-900/[0.02]',
    procesoPaso: d ? 'text-teal-400/85' : 'text-teal-700',
    procesoTitle: d ? 'text-white' : 'text-slate-900',
    procesoBody: d ? 'text-slate-400' : 'text-slate-600',

    pasosKicker: d ? 'text-teal-300/90' : 'text-teal-700',

    karinIconBox: d ? 'border-teal-500/22 bg-teal-600/10' : 'border-teal-200/90 bg-teal-50/90',
    karinIcon: d ? 'text-teal-300' : 'text-teal-700',
    karinBlob: d ? 'bg-teal-600/6' : 'bg-teal-400/14',

    blogLink: d
      ? 'border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]'
      : 'border-slate-200/90 bg-white/75 text-slate-800 shadow-sm hover:bg-white hover:border-slate-300/90',

    pkgPricePaid: d ? 'text-white' : 'text-slate-900',
    pkgFreeGradient: d
      ? 'from-teal-300 to-cyan-200'
      : 'from-teal-600 to-cyan-600',
    pkgFeatures: d ? 'text-slate-300' : 'text-slate-700',

    ctaBlobTR: d ? 'bg-teal-600/6' : 'bg-teal-400/12',
    ctaBlobBL: d ? 'bg-sky-600/5' : 'bg-sky-400/10',

    mobileDock: d
      ? 'border-t border-white/10 bg-slate-950/85 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/70 shadow-[0_-12px_40px_rgba(0,0,0,0.4)]'
      : 'border-t border-slate-200/95 bg-white/90 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/80 shadow-[0_-8px_32px_rgba(15,23,42,0.08)]',

    primaryCtaShadow: d ? 'shadow-black/35' : 'shadow-md shadow-teal-900/10',
  } as const
}
