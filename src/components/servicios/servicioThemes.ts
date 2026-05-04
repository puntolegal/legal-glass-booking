export type ServicioThemeId = 'civil' | 'laboral' | 'laboralLight' | 'corporativo';

export interface ServicioThemeTokens {
  id: ServicioThemeId;
  /** Gradiente radial TL (`from-*` para combinar con `bg-gradient-radial …`) */
  radialTL: string;
  radialBR: string;
  chip: string;
  accent: string;
  accentStrong: string;
  accentBg: string;
  accentBgHover: string;
  accentBorder: string;
  accentBorderStrong: string;
  accentGlow: string;
  stat: string;
  dot: string;
  pillSuccess: string;
  pillSuccessText: string;
  cardPopularRing: string;
  link: string;
  linkHover: string;
  btnPrimary: string;
  btnPrimaryHover: string;
  btnOutline: string;
  btnOutlineHover: string;
  sectionWash: string;
  iconBox: string;
  progressBg: string;
  stripeCta: string;
  /** Acento secundario (tarjetas corporativas / highlights) */
  accentSecondary: string;
  accentSecondaryBg: string;
  accentSecondaryBorder: string;
  cardGlass: string;
  cardHover: string;
}

export const SERVICIO_THEMES: Record<ServicioThemeId, ServicioThemeTokens> = {
  civil: {
    id: 'civil',
    radialTL: 'from-emerald-500/8',
    radialBR: 'from-sky-500/6',
    chip: 'border border-emerald-400/25 bg-emerald-500/8 text-emerald-100',
    accent: 'text-emerald-400',
    accentStrong: 'text-emerald-300',
    accentBg: 'bg-emerald-500',
    accentBgHover: 'hover:bg-emerald-600',
    accentBorder: 'border-emerald-500/25',
    accentBorderStrong: 'border-emerald-400/45',
    accentGlow: 'from-emerald-500/15 to-sky-500/8',
    stat: 'text-emerald-400',
    dot: 'bg-emerald-400',
    pillSuccess: 'bg-emerald-500/10 border-emerald-500/30',
    pillSuccessText: 'text-emerald-300',
    cardPopularRing: 'border-2 border-emerald-400/45',
    link: 'text-emerald-400',
    linkHover: 'hover:text-emerald-300',
    btnPrimary:
      'bg-gradient-to-r from-emerald-500 to-sky-600 text-white shadow-lg shadow-emerald-900/40',
    btnPrimaryHover: 'hover:from-emerald-600 hover:to-sky-700',
    btnOutline: 'border border-white/15 bg-white/5 backdrop-blur-xl text-slate-200',
    btnOutlineHover: 'hover:bg-white/10',
    sectionWash: 'bg-slate-900/50 border-y border-slate-800/60',
    iconBox: 'bg-gradient-to-br from-emerald-500/25 to-sky-500/8',
    progressBg: 'bg-emerald-500/15',
    stripeCta: 'from-slate-900 via-slate-950 to-slate-900',
    accentSecondary: 'text-sky-400',
    accentSecondaryBg: 'bg-sky-500/10',
    accentSecondaryBorder: 'border-sky-500/30',
    cardGlass: 'bg-slate-900/60 backdrop-blur-xl border border-slate-800',
    cardHover: 'hover:border-emerald-400/30',
  },
  /** Laboral oscuro: CTA esmeralda aislado; resto slate / glass. */
  laboral: {
    id: 'laboral',
    radialTL: 'from-slate-700/5',
    radialBR: 'from-slate-800/4',
    chip: 'border border-white/[0.06] bg-white/[0.03] text-slate-200 backdrop-blur-xl',
    accent: 'text-slate-400',
    accentStrong: 'text-slate-300',
    accentBg: 'bg-emerald-500',
    accentBgHover: 'hover:bg-emerald-400',
    accentBorder: 'border-white/[0.06]',
    accentBorderStrong: 'border-white/[0.08]',
    accentGlow: 'from-slate-700/6 to-slate-900/5',
    stat: 'text-slate-400',
    dot: 'bg-slate-500',
    pillSuccess: 'border border-white/[0.06] bg-white/[0.03] text-slate-300 backdrop-blur-xl',
    pillSuccessText: 'text-slate-300',
    cardPopularRing: 'border-2 border-amber-400/25 shadow-sm shadow-black/10',
    link: 'text-slate-300',
    linkHover: 'hover:text-slate-100',
    btnPrimary:
      'border border-transparent bg-emerald-500 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]',
    btnPrimaryHover: 'hover:bg-emerald-400 hover:shadow-[0_6px_18px_0_rgba(16,185,129,0.32)]',
    btnOutline:
      'border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800',
    btnOutlineHover: 'hover:border-slate-600',
    sectionWash: 'border-y border-white/[0.06] bg-white/[0.02]',
    iconBox: 'border border-white/[0.06] bg-white/[0.04]',
    progressBg: 'bg-white/[0.06]',
    stripeCta: 'from-slate-950 via-slate-900 to-slate-950',
    accentSecondary: 'text-slate-500',
    accentSecondaryBg: 'bg-white/[0.03]',
    accentSecondaryBorder: 'border-white/[0.06]',
    cardGlass: 'border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl',
    cardHover: 'hover:border-white/[0.1] hover:bg-white/[0.04]',
  },
  /** Laboral claro: misma jerarquía — esmeralda solo en CTA principal. */
  laboralLight: {
    id: 'laboralLight',
    radialTL: 'from-slate-400/8',
    radialBR: 'from-slate-300/6',
    chip: 'border border-slate-200/90 bg-white/80 text-slate-800',
    accent: 'text-slate-600',
    accentStrong: 'text-slate-700',
    accentBg: 'bg-emerald-500',
    accentBgHover: 'hover:bg-emerald-400',
    accentBorder: 'border-slate-200/90',
    accentBorderStrong: 'border-slate-300/90',
    accentGlow: 'from-slate-300/10 to-slate-100/8',
    stat: 'text-slate-600',
    dot: 'bg-slate-400',
    pillSuccess: 'bg-slate-100 border border-slate-200/90',
    pillSuccessText: 'text-slate-800',
    cardPopularRing: 'border-2 border-amber-400/35 shadow-sm shadow-slate-900/6',
    link: 'text-slate-800',
    linkHover: 'hover:text-slate-950',
    btnPrimary:
      'border border-transparent bg-emerald-500 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]',
    btnPrimaryHover: 'hover:bg-emerald-400 hover:shadow-[0_6px_18px_0_rgba(16,185,129,0.28)]',
    btnOutline:
      'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100',
    btnOutlineHover: 'hover:border-slate-400',
    sectionWash: 'bg-slate-100/90 border-y border-slate-200/90',
    iconBox: 'border border-slate-200/90 bg-slate-50/90',
    progressBg: 'bg-slate-200/80',
    stripeCta: 'from-slate-50 via-white to-slate-50',
    accentSecondary: 'text-slate-600',
    accentSecondaryBg: 'bg-slate-100/90',
    accentSecondaryBorder: 'border-slate-200/90',
    cardGlass: 'bg-white/70 backdrop-blur-xl border border-white/40',
    cardHover: 'hover:border-slate-300/90',
  },
  corporativo: {
    id: 'corporativo',
    radialTL: 'from-indigo-500/8',
    radialBR: 'from-slate-500/6',
    chip: 'border border-indigo-400/30 bg-indigo-500/8 text-indigo-100',
    accent: 'text-indigo-400',
    accentStrong: 'text-indigo-300',
    accentBg: 'bg-indigo-600',
    accentBgHover: 'hover:bg-indigo-700',
    accentBorder: 'border-indigo-500/25',
    accentBorderStrong: 'border-indigo-400/45',
    accentGlow: 'from-indigo-500/15 to-slate-500/8',
    stat: 'text-indigo-400',
    dot: 'bg-indigo-400',
    pillSuccess: 'bg-emerald-500/10 border-emerald-500/30',
    pillSuccessText: 'text-emerald-300',
    cardPopularRing: 'border-2 border-indigo-400/45',
    link: 'text-indigo-400',
    linkHover: 'hover:text-indigo-300',
    btnPrimary:
      'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40',
    btnPrimaryHover: 'hover:from-indigo-500 hover:to-indigo-400',
    btnOutline: 'border border-white/15 bg-white/5 backdrop-blur-2xl text-slate-200',
    btnOutlineHover: 'hover:bg-white/10',
    sectionWash: 'bg-slate-900/50 border-y border-slate-800/60',
    iconBox: 'bg-gradient-to-br from-indigo-500/25 to-slate-500/8',
    progressBg: 'bg-indigo-500/15',
    stripeCta: 'from-slate-900 via-slate-950 to-slate-900',
    accentSecondary: 'text-slate-400',
    accentSecondaryBg: 'bg-slate-500/10',
    accentSecondaryBorder: 'border-slate-500/30',
    cardGlass: 'bg-slate-900/60 backdrop-blur-2xl border border-slate-800',
    cardHover: 'hover:border-indigo-400/28',
  },
};
