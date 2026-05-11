import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getServiceTheme } from '@/config/serviceThemes';

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
 * Canvas glass iOS + auroras tema penal, forzando modo oscuro local (clase `dark`)
 * para coherencia con tokens `--la-*` y paneles glass del sistema de marca.
 */
export function UrgenciaPenalFocusLayout({
  children,
  headerLinkTo = '/',
  headerAriaLabel = 'Punto Legal Chile — inicio',
  headerSubtitle,
}: UrgenciaPenalFocusLayoutProps) {
  const serviceTheme = useMemo(() => getServiceTheme('penal', null), []);

  return (
    <div className="dark">
      <div className="landing-canvas urgencia-focus relative min-h-screen pb-[max(6rem,env(safe-area-inset-bottom,0px))] text-slate-100 antialiased selection:bg-rose-500/35 selection:text-white">
        {/* Capas ambientales (profundidad + tinte penal suave) */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 90% 60% at 100% -5%, ${hexToRgba(serviceTheme.primary, 0.14)}, transparent 55%),
                radial-gradient(ellipse 75% 55% at 0% 100%, ${hexToRgba(serviceTheme.accent, 0.1)}, transparent 58%),
                radial-gradient(ellipse 55% 45% at 50% 100%, rgba(15, 23, 42, 0.5), transparent 65%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${hexToRgba(serviceTheme.primary, 0.06)} 0%, transparent 42%)`,
            }}
          />
        </div>

        <header
          className="sticky top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-2"
        >
          <div className="urgencia-header-glass max-w-lg mx-auto">
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-2.5">
              <Link
                to={headerLinkTo}
                className="agendamiento-wordmark inline-flex min-h-[44px] items-center -mx-1 px-2 py-1.5 rounded-xl hover:bg-white/[0.05] active:scale-[0.98] transition-all duration-200"
                aria-label={headerAriaLabel}
              >
                <span className="agendamiento-wordmark__name">Punto Legal</span>
                <span className="agendamiento-wordmark__country">Chile</span>
              </Link>
              {headerSubtitle ? (
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {headerSubtitle}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
