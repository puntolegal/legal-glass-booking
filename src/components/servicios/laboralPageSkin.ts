/**
 * Tokens visuales /servicios/laboral — glass iOS (blur + saturate + borde fantasma + trazo interno),
 * alineado al spec de `.glass-ios-panel-*` / `.glass-ios-card-*` en `src/index.css`.
 */
export function getLaboralPageSkin(isDark: boolean) {
  const d = isDark

  const frostLightPanel =
    'border border-white/80 bg-white/[0.78] backdrop-blur-[28px] backdrop-saturate-150 shadow-[0_16px_44px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.92)]'
  const frostDarkPanel =
    'border border-white/[0.10] bg-[hsla(218,40%,16%,0.52)] backdrop-blur-[32px] backdrop-saturate-150 shadow-[0_24px_52px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.12)]'

  const frostLightCard =
    'border border-slate-200/80 bg-white/[0.68] backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_30px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.82)]'
  const frostDarkCard =
    'border border-white/[0.09] bg-[hsla(218,45%,13%,0.5)] backdrop-blur-[24px] backdrop-saturate-150 shadow-[0_14px_36px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.1)]'

  const heroPillLight =
    'border border-white/75 bg-white/[0.62] backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_28px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.88)]'
  const heroPillDark =
    'border border-white/[0.1] bg-white/[0.07] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.1)]'

  const hoverLift =
    'transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]'

  return {
    glassPanel: d
      ? `rounded-[2rem] transition-shadow duration-300 ${frostDarkPanel}`
      : `rounded-[2rem] transition-shadow duration-300 ${frostLightPanel}`,
    glassCard: d
      ? `rounded-[1.25rem] transition-shadow duration-300 ${frostDarkCard}`
      : `rounded-[1.25rem] transition-shadow duration-300 ${frostLightCard}`,
    heroPill: d ? heroPillDark : heroPillLight,
    borderSection: d ? 'border-white/[0.06]' : 'border-slate-200/45',

    textTitle: d ? 'text-slate-50' : 'text-slate-900',
    textBody: d ? 'text-slate-300' : 'text-slate-600',
    textStrong: d ? 'text-slate-100' : 'text-slate-800',
    textList: d ? 'text-slate-200' : 'text-slate-700',
    textCaption: d ? 'text-slate-500' : 'text-slate-500',
    pkgSubline: d ? 'text-slate-500' : 'text-slate-500',
    caseMeta: d ? 'text-slate-500' : 'text-slate-500',

    headlineAccent: d ? 'text-slate-400' : 'text-slate-600',
    sectionKicker: d ? 'text-slate-500' : 'text-slate-500',
    serviceIcon: d ? 'text-slate-500' : 'text-slate-500',
    caseAmount: d ? 'text-slate-400' : 'text-slate-600',

    heroBadgeIcon: d ? 'text-slate-500' : 'text-slate-500',
    heroBadgeText: d ? 'text-slate-400' : 'text-slate-600',
    heroBadgeAccent: d ? 'text-slate-300' : 'text-slate-700',
    heroLead: d ? 'text-slate-400' : 'text-slate-600',

    heroBlobTR: d ? 'bg-slate-500/[0.06]' : 'bg-teal-400/[0.08]',
    heroBlobBL: d ? 'bg-slate-700/[0.05]' : 'bg-sky-300/[0.1]',
    heroLine: d
      ? 'from-transparent via-white/[0.09] to-transparent'
      : 'from-transparent via-slate-300/40 to-transparent',

    trustOuter: `${d ? frostDarkCard : frostLightCard} rounded-2xl ${hoverLift} ${
      d ? 'hover:shadow-[0_18px_40px_rgba(0,0,0,0.38)]' : 'hover:shadow-[0_14px_36px_rgba(15,23,42,0.09)]'
    }`,
    trustIconBox: d
      ? 'border border-white/[0.08] bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
      : 'border border-slate-200/80 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]',
    trustIcon: d ? 'text-slate-400' : 'text-slate-500',
    trustLabel: d ? 'text-slate-300' : 'text-slate-700',

    /** El enlace ya incluye `rounded-2xl` en el JSX */
    viasPrimaryBg: d
      ? `${frostDarkCard} ${hoverLift} hover:bg-[hsla(218,45%,15%,0.56)]`
      : `${frostLightCard} ${hoverLift} hover:bg-white/[0.82]`,
    viasSecondary: d
      ? `border border-white/[0.08] bg-white/[0.025] backdrop-blur-[28px] backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${hoverLift} hover:bg-white/[0.055] hover:border-white/[0.11]`
      : `border border-slate-200/70 bg-white/[0.52] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${hoverLift} hover:bg-white/[0.72] hover:border-slate-200/90`,
    viasCardTitle: d ? 'text-slate-50' : 'text-slate-900',
    viasCardMuted: d ? 'text-slate-500' : 'text-slate-600',

    procesoCard: `${d ? `rounded-[1.25rem] ${frostDarkCard}` : `rounded-[1.25rem] ${frostLightCard}`} p-4 text-left`,
    procesoPaso: d ? 'text-slate-500' : 'text-slate-500',
    procesoTitle: d ? 'text-slate-50' : 'text-slate-900',
    procesoBody: d ? 'text-slate-400' : 'text-slate-600',

    pasosKicker: d ? 'text-slate-500' : 'text-slate-500',

    karinIconBox: d
      ? 'border border-white/[0.1] bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
      : 'border border-slate-200/85 bg-white/[0.85] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]',
    karinIcon: d ? 'text-slate-400' : 'text-slate-500',
    karinBlob: d ? 'bg-teal-500/[0.07]' : 'bg-teal-400/[0.1]',

    pkgPricePaid: d ? 'text-slate-50' : 'text-slate-900',
    pkgFreeGradient: d
      ? 'from-slate-200 to-slate-100'
      : 'from-slate-700 to-slate-600',
    pkgFeatures: d ? 'text-slate-300' : 'text-slate-700',

    ctaBlobTR: d ? 'bg-teal-500/[0.06]' : 'bg-teal-300/[0.12]',
    ctaBlobBL: d ? 'bg-slate-800/[0.05]' : 'bg-slate-200/25',

    mobileDock: d
      ? 'border-t border-white/[0.08] bg-slate-950/78 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-slate-950/65 shadow-[0_-16px_48px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.06)]'
      : 'border-t border-white/70 bg-white/72 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/62 shadow-[0_-12px_40px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.92)]',

    prioridadBadge:
      'rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm border border-transparent',

    faqAccent: d ? 'text-slate-500' : 'text-slate-500',

    pkgPopularBadge: d
      ? 'rounded-full border border-white/[0.1] bg-white/[0.1] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
      : 'rounded-full border border-slate-200/90 bg-slate-800 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm',

    primaryCtaShadow: '',
  } as const
}
