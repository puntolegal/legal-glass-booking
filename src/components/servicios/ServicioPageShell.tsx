import { useEffect, type ReactNode } from 'react';
import Header from '@/components/Header';
import { trackMetaEvent } from '@/services/metaConversionsService';
import { SERVICIO_THEMES, type ServicioThemeId } from './servicioThemes';
import { ServicioThemeProvider } from './servicioThemeContext';

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
      <div className="min-h-screen bg-slate-900 text-slate-300 antialiased relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div
            className={`absolute top-[-20rem] left-[-20rem] w-[50rem] h-[50rem] bg-gradient-radial ${tokens.radialTL} via-slate-900/0 to-transparent blur-3xl`}
          />
          <div
            className={`absolute bottom-[-20rem] right-[-20rem] w-[50rem] h-[50rem] bg-gradient-radial ${tokens.radialBR} via-slate-900/0 to-transparent blur-3xl`}
          />
        </div>

        <Header />
        <div className="h-20" />

        <div className="relative z-10">{children}</div>
      </div>
    </ServicioThemeProvider>
  );
}
