import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getServiceTheme } from '@/config/serviceThemes';
import { useTheme } from '@/hooks/useTheme';
import { LaboralThemeToggle } from '@/components/servicios/LaboralThemeToggle';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type UrgenciaPenalFocusLayoutProps = {
  children: React.ReactNode;
  /** Destino del wordmark (flujo penal vs post-pago al inicio). */
  headerLinkTo?: string;
  headerAriaLabel?: string;
  /** Línea secundaria bajo Punto Legal Chile (ej. flujo /urgencia). */
  headerSubtitle?: string;
};

/**
 * Canvas glass iOS + auroras tema penal. El claro/oscuro sigue el tema global
 * (`ThemeProvider` → clase `dark` en `html`), mismo control que el landing.
 */
export function UrgenciaPenalFocusLayout({
  children,
  headerLinkTo = '/',
  headerAriaLabel = 'Punto Legal Chile — inicio',
  headerSubtitle,
}: UrgenciaPenalFocusLayoutProps) {
  const serviceTheme = useMemo(() => getServiceTheme('penal', null), []);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const ambientBase = useMemo(
    () =>
      isDark
        ? `radial-gradient(ellipse 90% 60% at 100% -5%, ${hexToRgba(serviceTheme.primary, 0.14)}, transparent 55%),
                radial-gradient(ellipse 75% 55% at 0% 100%, ${hexToRgba(serviceTheme.accent, 0.1)}, transparent 58%),
                radial-gradient(ellipse 55% 45% at 50% 100%, rgba(15, 23, 42, 0.5), transparent 65%)`
        : `radial-gradient(ellipse 95% 58% at 100% -8%, ${hexToRgba(serviceTheme.primary, 0.09)}, transparent 56%),
                radial-gradient(ellipse 78% 52% at 0% 100%, ${hexToRgba(serviceTheme.accent, 0.06)}, transparent 58%),
                radial-gradient(ellipse 55% 42% at 50% 100%, rgba(148, 163, 184, 0.12), transparent 62%)`,
    [isDark, serviceTheme.accent, serviceTheme.primary]
  );

  const ambientSoft = useMemo(
    () =>
      isDark
        ? `radial-gradient(circle at 20% 30%, ${hexToRgba(serviceTheme.primary, 0.06)} 0%, transparent 42%)`
        : `radial-gradient(circle at 22% 28%, ${hexToRgba(serviceTheme.primary, 0.045)} 0%, transparent 44%)`,
    [isDark, serviceTheme.primary]
  );

  return (
    <div
      className={`landing-canvas urgencia-focus relative min-h-screen pb-[max(6rem,env(safe-area-inset-bottom,0px))] text-slate-900 dark:text-slate-100 antialiased selection:bg-rose-500/35 selection:text-slate-900 dark:selection:text-white`}
    >
      {/* Capas ambientales (profundidad + tinte penal suave) */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0" style={{ background: ambientBase }} />
        <div className="absolute inset-0 opacity-[0.35]" style={{ background: ambientSoft }} />
      </div>

      <header className="sticky top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-2">
        <div className="urgencia-header-glass max-w-lg mx-auto">
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-x-2 px-2.5 py-2.5 sm:px-3 sm:py-3">
            <span className="h-10 w-10 shrink-0" aria-hidden />
            <div className="flex min-w-0 flex-col items-center justify-center gap-1.5 text-center">
              <Link
                to={headerLinkTo}
                className="agendamiento-wordmark inline-flex min-h-[44px] max-w-full flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5 px-1.5 py-1 rounded-xl hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.05] active:scale-[0.98] transition-all duration-200"
                aria-label={headerAriaLabel}
              >
                <span className="agendamiento-wordmark__name leading-tight">Punto Legal</span>
                <span className="agendamiento-wordmark__country shrink-0">Chile</span>
              </Link>
              {headerSubtitle ? (
                <p className="w-full max-w-[16rem] border-t border-slate-200/70 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:border-white/[0.1] dark:text-slate-400">
                  {headerSubtitle}
                </p>
              ) : null}
            </div>
            <div className="flex justify-end">
              <LaboralThemeToggle variant="urgencia" mode={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
