import { useEffect, useMemo, type ReactNode } from 'react';
import Header from '@/components/Header';
import { trackMetaEvent } from '@/services/metaConversionsService';
import { getServiceTheme } from '@/config/serviceThemes';
import { SERVICIO_THEMES, type ServicioThemeId } from './servicioThemes';
import { ServicioThemeProvider } from './servicioThemeContext';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Fondo atmosférico por vertical: base más oscura + columna de luz difusa + orbes a lo largo del scroll. */
const AMBIENT_BY_THEME: Record<
  ServicioThemeId,
  {
    baseGradient: string
    columnGlow: string
    orbA: string
    orbB: string
    orbC: string
  }
> = {
  laboral: {
    baseGradient:
      'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
    columnGlow:
      'bg-gradient-to-b from-slate-500/[0.02] via-transparent to-slate-600/[0.015]',
    orbA: 'bg-slate-500/[0.025]',
    orbB: 'bg-slate-600/[0.02]',
    orbC: 'bg-slate-700/[0.022]',
  },
  laboralLight: {
    baseGradient:
      'bg-gradient-to-b from-slate-50 via-[#f3f6fa] to-slate-100',
    columnGlow:
      'bg-gradient-to-b from-teal-400/[0.05] via-transparent to-slate-300/[0.045]',
    orbA: 'bg-teal-400/[0.075]',
    orbB: 'bg-sky-300/[0.07]',
    orbC: 'bg-slate-200/[0.11]',
  },
  civil: {
    baseGradient:
      'bg-gradient-to-b from-[#020617] via-[#061016] to-[#020617]',
    columnGlow:
      'bg-gradient-to-b from-emerald-400/[0.04] via-sky-400/[0.018] to-cyan-500/[0.04]',
    orbA: 'bg-emerald-400/[0.055]',
    orbB: 'bg-sky-400/[0.045]',
    orbC: 'bg-cyan-400/[0.04]',
  },
  corporativo: {
    baseGradient:
      'bg-gradient-to-b from-[#020617] via-[#0a0618] to-[#020617]',
    columnGlow:
      'bg-gradient-to-b from-indigo-400/[0.05] via-violet-400/[0.02] to-slate-500/[0.045]',
    orbA: 'bg-indigo-400/[0.055]',
    orbB: 'bg-violet-400/[0.04]',
    orbC: 'bg-slate-400/[0.035]',
  },
}

type ServicioPageShellProps = {
  theme: ServicioThemeId;
  /** Si es false, no se renderiza el header global del sitio (solo contenido de la vertical). */
  showSiteHeader?: boolean;
  /** Nombre legible para Meta (ViewContent) */
  contentName: string;
  /** Categoría granular por vertical, p. ej. "Servicios Legales — Derecho Civil" */
  contentCategory: string;
  children: ReactNode;
};

export default function ServicioPageShell({
  theme,
  showSiteHeader = true,
  contentName,
  contentCategory,
  children,
}: ServicioPageShellProps) {
  const tokens = SERVICIO_THEMES[theme];
  const ambient = AMBIENT_BY_THEME[theme];
  const isLightSurface = theme === 'laboralLight'
  const laboralAgendaTint = useMemo(
    () => (theme === 'laboral' ? getServiceTheme('tutela-laboral', null) : null),
    [theme],
  )
  const laboralSoftAmbient = theme === 'laboral' || theme === 'laboralLight'
  const colBlur = laboralSoftAmbient ? 'blur-2xl' : 'blur-3xl'
  const orbBlur = laboralSoftAmbient ? 'blur-[72px]' : 'blur-[100px]'
  const orbBlurWide = laboralSoftAmbient ? 'blur-[76px]' : 'blur-[110px]'
  const orbBlurTight = laboralSoftAmbient ? 'blur-[68px]' : 'blur-[95px]'
  const radialBlur = laboralSoftAmbient ? 'blur-2xl' : 'blur-3xl'
  const radialOpacity = laboralSoftAmbient && !isLightSurface ? 'opacity-60' : isLightSurface ? 'opacity-90' : ''
  const radialOpacityBR =
    laboralSoftAmbient && !isLightSurface ? 'opacity-55' : isLightSurface ? 'opacity-85' : ''

  useEffect(() => {
    trackMetaEvent({
      event_name: 'ViewContent',
      custom_data: {
        content_name: contentName,
        content_category: contentCategory,
      },
    });
  }, [contentName, contentCategory]);

  return (
    <ServicioThemeProvider tokens={tokens}>
      <div
        className={`relative min-h-screen min-h-[100dvh] antialiased ${
          isLightSurface
            ? 'bg-slate-50 text-slate-900'
            : theme === 'laboral'
              ? 'text-slate-100'
              : 'text-slate-300'
        }`}
      >
        {/* Capas de fondo: ocupan todo el alto del documento (scroll largo) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 min-h-full overflow-hidden"
          aria-hidden
        >
          <div className={`absolute inset-0 ${ambient.baseGradient}`} />
          {theme === 'laboral' && laboralAgendaTint && (
            <>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at top right, ${hexToRgba(laboralAgendaTint.primary, 0.04)}, transparent 60%)`,
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at bottom left, ${hexToRgba(laboralAgendaTint.accent, 0.03)}, transparent 60%)`,
                }}
                aria-hidden
              />
            </>
          )}
          {!isLightSurface && (
            <div
              className={`absolute inset-0 bg-[radial-gradient(ellipse_95%_85%_at_50%_45%,transparent_32%,rgba(0,0,0,0.42)_100%)] ${
                theme === 'laboral' ? 'opacity-45' : ''
              }`}
            />
          )}
          {isLightSurface && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(255,255,255,0.55),transparent_55%)]" />
          )}
          <div
            className={`absolute left-1/2 top-0 h-full w-[min(92vw,40rem)] -translate-x-1/2 ${colBlur} ${ambient.columnGlow}`}
          />
          <div
            className={`absolute -left-8 top-[14%] h-[22rem] w-[22rem] rounded-full ${orbBlur} ${ambient.orbA}`}
          />
          <div
            className={`absolute -right-12 top-[48%] h-[26rem] w-[26rem] -translate-y-1/2 rounded-full ${orbBlurWide} ${ambient.orbB}`}
          />
          <div
            className={`absolute bottom-[8%] left-[18%] h-[20rem] w-[20rem] rounded-full ${orbBlurTight} ${ambient.orbC}`}
          />
          <div
            className={`absolute top-[-20rem] left-[-20rem] h-[50rem] w-[50rem] bg-gradient-radial ${tokens.radialTL} ${isLightSurface ? 'via-white/0' : 'via-slate-950/0'} to-transparent ${radialBlur} ${radialOpacity}`}
          />
          <div
            className={`absolute bottom-[-20rem] right-[-20rem] h-[50rem] w-[50rem] bg-gradient-radial ${tokens.radialBR} ${isLightSurface ? 'via-white/0' : 'via-slate-950/0'} to-transparent ${radialBlur} ${radialOpacityBR}`}
          />
        </div>

        {showSiteHeader && (
          <>
            <Header />
            <div className="h-20" />
          </>
        )}

        <div className="relative z-10">{children}</div>
      </div>
    </ServicioThemeProvider>
  );
}
