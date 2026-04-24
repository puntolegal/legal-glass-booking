import { useEffect, type ReactNode } from 'react';
import Header from '@/components/Header';
import { trackMetaEvent } from '@/services/metaConversionsService';
import { SERVICIO_THEMES, type ServicioThemeId } from './servicioThemes';
import { ServicioThemeProvider } from './servicioThemeContext';

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
      'bg-gradient-to-b from-[#020617] via-[#04121c] to-[#020617]',
    columnGlow:
      'bg-gradient-to-b from-teal-400/[0.045] via-cyan-400/[0.02] to-sky-500/[0.055]',
    orbA: 'bg-teal-400/[0.06]',
    orbB: 'bg-cyan-300/[0.05]',
    orbC: 'bg-sky-400/[0.045]',
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
  /** Nombre legible para Meta (ViewContent) */
  contentName: string;
  /** Categoría granular por vertical, p. ej. "Servicios Legales — Derecho Civil" */
  contentCategory: string;
  children: ReactNode;
};

export default function ServicioPageShell({
  theme,
  contentName,
  contentCategory,
  children,
}: ServicioPageShellProps) {
  const tokens = SERVICIO_THEMES[theme];
  const ambient = AMBIENT_BY_THEME[theme];

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
      <div className="relative min-h-screen min-h-[100dvh] text-slate-300 antialiased">
        {/* Capas de fondo: ocupan todo el alto del documento (scroll largo) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 min-h-full overflow-hidden"
          aria-hidden
        >
          {/* Base más oscura que el slate-900 plano */}
          <div className={`absolute inset-0 ${ambient.baseGradient}`} />
          {/* Vigneta: bordes más profundos, centro ligeramente más legible para el contenido */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_85%_at_50%_45%,transparent_32%,rgba(0,0,0,0.42)_100%)]" />
          {/* Columna central: luz tenue difusa (blur) a lo largo de la página */}
          <div
            className={`absolute left-1/2 top-0 h-full w-[min(92vw,40rem)] -translate-x-1/2 blur-3xl ${ambient.columnGlow}`}
          />
          {/* Orbes grandes: anclados arriba / medio / abajo para ritmo visual al hacer scroll */}
          <div
            className={`absolute -left-8 top-[14%] h-[22rem] w-[22rem] rounded-full blur-[100px] ${ambient.orbA}`}
          />
          <div
            className={`absolute -right-12 top-[48%] h-[26rem] w-[26rem] -translate-y-1/2 rounded-full blur-[110px] ${ambient.orbB}`}
          />
          <div
            className={`absolute bottom-[8%] left-[18%] h-[20rem] w-[20rem] rounded-full blur-[95px] ${ambient.orbC}`}
          />
          {/* Esquinas: refuerzo del tema (tokens existentes) */}
          <div
            className={`absolute top-[-20rem] left-[-20rem] h-[50rem] w-[50rem] bg-gradient-radial ${tokens.radialTL} via-slate-950/0 to-transparent blur-3xl`}
          />
          <div
            className={`absolute bottom-[-20rem] right-[-20rem] h-[50rem] w-[50rem] bg-gradient-radial ${tokens.radialBR} via-slate-950/0 to-transparent blur-3xl`}
          />
        </div>

        <Header />
        <div className="h-20" />

        <div className="relative z-10">{children}</div>
      </div>
    </ServicioThemeProvider>
  );
}
