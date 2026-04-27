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
  /** Vertical laboral: teal/jade apagado (navy protagonista; sin emerald neón). */
  laboral: {
    id: 'laboral',
    radialTL: 'from-teal-600/6',
    radialBR: 'from-sky-600/5',
    chip: 'border border-teal-400/18 bg-teal-950/35 text-teal-100',
    accent: 'text-teal-300',
    accentStrong: 'text-teal-200',
    accentBg: 'bg-teal-600',
    accentBgHover: 'hover:bg-teal-700',
    accentBorder: 'border-teal-500/20',
    accentBorderStrong: 'border-teal-400/32',
    accentGlow: 'from-teal-600/10 to-sky-600/6',
    stat: 'text-teal-300',
    dot: 'bg-teal-400',
    pillSuccess: 'bg-teal-600/12 border-teal-500/22',
    pillSuccessText: 'text-teal-200',
    cardPopularRing: 'border-2 border-teal-400/32',
    link: 'text-teal-400',
    linkHover: 'hover:text-teal-300',
    btnPrimary:
      'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-black/35',
    btnPrimaryHover: 'hover:from-teal-500 hover:to-teal-600',
    btnOutline: 'border border-white/15 bg-white/5 backdrop-blur-xl text-slate-200',
    btnOutlineHover: 'hover:bg-white/10',
    sectionWash: 'bg-slate-900/50 border-y border-slate-800/60',
    iconBox: 'bg-gradient-to-br from-teal-600/18 to-sky-600/8',
    progressBg: 'bg-teal-600/12',
    stripeCta: 'from-slate-900 via-slate-950 to-slate-900',
    accentSecondary: 'text-sky-400',
    accentSecondaryBg: 'bg-sky-500/10',
    accentSecondaryBorder: 'border-sky-500/25',
    cardGlass: 'bg-slate-900/60 backdrop-blur-xl border border-slate-800',
    cardHover: 'hover:border-teal-400/22',
  },
  /** Laboral — superficie clara, glass iOS blanco/gris (menos fatiga visual). */
  laboralLight: {
    id: 'laboralLight',
    radialTL: 'from-teal-500/12',
    radialBR: 'from-sky-500/10',
    chip: 'border border-teal-200/80 bg-teal-50/90 text-teal-900',
    accent: 'text-teal-700',
    accentStrong: 'text-teal-800',
    accentBg: 'bg-teal-600',
    accentBgHover: 'hover:bg-teal-700',
    accentBorder: 'border-teal-300/60',
    accentBorderStrong: 'border-teal-500/45',
    accentGlow: 'from-teal-400/15 to-sky-400/10',
    stat: 'text-teal-700',
    dot: 'bg-teal-500',
    pillSuccess: 'bg-teal-100 border-teal-200/90',
    pillSuccessText: 'text-teal-900',
    cardPopularRing: 'border-2 border-teal-500/50 shadow-md shadow-teal-900/10',
    link: 'text-teal-700',
    linkHover: 'hover:text-teal-800',
    btnPrimary:
      'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-900/15',
    btnPrimaryHover: 'hover:from-teal-500 hover:to-teal-600',
    btnOutline:
      'border border-slate-300/90 bg-white/75 backdrop-blur-xl text-slate-800 shadow-sm shadow-slate-900/5',
    btnOutlineHover: 'hover:bg-white hover:border-slate-400/90',
    sectionWash: 'bg-slate-100/70 border-y border-slate-200/80',
    iconBox: 'bg-gradient-to-br from-teal-100/90 to-sky-100/80 border border-teal-200/40',
    progressBg: 'bg-teal-200/80',
    stripeCta: 'from-slate-100 via-white to-slate-100',
    accentSecondary: 'text-sky-700',
    accentSecondaryBg: 'bg-sky-100/80',
    accentSecondaryBorder: 'border-sky-200/90',
    cardGlass: 'bg-white/70 backdrop-blur-xl border border-slate-200/80',
    cardHover: 'hover:border-teal-300/70 hover:shadow-md hover:shadow-slate-900/5',
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
