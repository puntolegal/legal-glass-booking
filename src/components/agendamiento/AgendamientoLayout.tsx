// RUTA: src/components/agendamiento/AgendamientoLayout.tsx

import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { useMobile } from '@/hooks/useMobile';
import { useTheme } from '@/hooks/useTheme';
import { LaboralThemeToggle } from '@/components/servicios/LaboralThemeToggle';
import ProgressBar from './ProgressBar';
import ConversionSidebar from './ConversionSidebar';
import SEO from '../SEO';
import { getServiceTheme } from '@/config/serviceThemes';
import { isLaborAgendamientoPlan } from '@/constants/laborAgendamientoPlans';

interface AgendamientoLayoutProps {
  children: React.ReactNode;
}

const AgendamientoLayout: React.FC<AgendamientoLayoutProps> = ({ children }) => {
  const { step, service } = useAgendamiento();
  const isMobile = useMobile();
  const { theme, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');

  // Tema dinámico — prioriza el slug del plan (cae-tesoreria, ley-karin…)
  // y degrada por categoría legacy (Familia, Laboral Empresarial…)
  const serviceTheme = useMemo(
    () => getServiceTheme(plan, service.category),
    [plan, service.category],
  );

  const laborAgenda = isLaborAgendamientoPlan(plan);
  const inmobiliarioEvalAgenda = plan === 'inmobiliario-eval';
  const wordmarkHref = laborAgenda
    ? '/servicios/laboral'
    : inmobiliarioEvalAgenda
      ? '/servicios/inmobiliario'
      : '/';
  const wordmarkAria = laborAgenda
    ? 'Punto Legal Chile — volver a servicio laboral'
    : inmobiliarioEvalAgenda
      ? 'Punto Legal Chile — volver a venta inmobiliaria Sector Oriente'
      : 'Punto Legal Chile — volver al inicio';

  const seoDescription = useMemo(() => {
    if (plan === 'inmobiliario-eval') {
      return 'Asesoría de cortesía: orientación jurídica y comercial previa para evaluación inmobiliaria en Sector Oriente (Las Condes, Vitacura, Lo Barnechea, La Reina). Sesión orientativa sin costo por Google Meet tras completar el formulario. Equipo alineado a transacciones patrimoniales complejas. Si contratas honorarios, el valor de esta consulta puede reconocerse según condiciones vigentes.';
    }
    const priceLine =
      service.price === '0'
        ? 'Sin costo de consulta cuando aplica al plan seleccionado.'
        : `Precio indicativo: $${service.price}.`;
    return `Agenda ${service.name} con abogados especialistas. ${priceLine} Respuesta ágil y condiciones según el servicio contratado.`;
  }, [plan, service.name, service.price]);
  
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleDevSkipToPayment = () => {
    if (!import.meta.env.DEV) return;

    const url = new URL(window.location.href);
    url.searchParams.set('debug', 'step2');
    window.location.href = url.toString();
  };
  
  return (
    <>
      <SEO 
        title={
          plan === 'inmobiliario-eval'
            ? 'Evaluación inmobiliaria Sector Oriente — orientación jurídica y comercial previa (Gratis) | Punto Legal'
            : `Agendar ${service.name} - Punto Legal`
        }
        description={seoDescription}
      />
      
      {/* Canvas = landing: claro (base blanca + auroras del plan) u oscuro navy */}
      <div className="landing-canvas relative min-h-screen">
        {/* Auroras del color del plan — muy suaves; encima del fondo del canvas */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden
        >
          <div
            className="absolute inset-0 dark:hidden"
            style={{
              background: `radial-gradient(ellipse 85% 55% at 100% 0%, ${hexToRgba(serviceTheme.primary, 0.14)}, transparent 58%),
                radial-gradient(ellipse 70% 50% at 0% 100%, ${hexToRgba(serviceTheme.accent, 0.1)}, transparent 55%)`,
            }}
          />
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background: `radial-gradient(ellipse at top right, ${hexToRgba(serviceTheme.primary, 0.07)}, transparent 60%),
                radial-gradient(ellipse at bottom left, ${hexToRgba(serviceTheme.accent, 0.05)}, transparent 60%)`,
            }}
          />
        </div>

        {/* Header sticky — wordmark "Punto Legal Chile" sobrio (sin tile P.) */}
        <header
          className="sticky top-0 z-40 border-b border-slate-200/75 bg-white/72 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.08] dark:bg-slate-950/65"
          style={{ paddingTop: 'max(0.875rem, env(safe-area-inset-top, 0px))' }}
        >
          <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
            <Link
              to={wordmarkHref}
              className="agendamiento-wordmark inline-flex min-h-[44px] items-center -mx-1 px-1 py-1 rounded-lg hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04] transition-colors"
              aria-label={wordmarkAria}
            >
              <span className="agendamiento-wordmark__name">Punto Legal</span>
              <span className="agendamiento-wordmark__country">Chile</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <LaboralThemeToggle mode={theme} onToggle={toggleTheme} variant="inline" />
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0"
                  style={{ background: serviceTheme.primary }}
                  aria-hidden
                />
                <span className="whitespace-nowrap">Paso {step} de 3</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div
          className="relative z-10 px-4 pt-5 md:pt-8"
          style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="max-w-5xl mx-auto">
            {isMobile ? (
              // ===== Versión móvil — flujo limpio sin info duplicada =====
              <div className="flex flex-col relative z-10 gap-4">
                {/* 1. Resumen compacto del servicio */}
                <div className="order-1">
                  <ConversionSidebar compact />
                </div>

                {/* 2. ProgressBar + Formulario */}
                <div className="order-2 space-y-4">
                  <div
                    id="agendamiento-form"
                    className={`rounded-[1.75rem] p-3 shadow-lg ${
                      theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark'
                    }`}
                  >
                    <ProgressBar currentStep={step} totalSteps={3} />
                  </div>
                  <div className="relative z-10">{children}</div>
                </div>

                {/* 3. Sólo testimonial — sin duplicar el resumen completo */}
                <div className="order-3 mt-2">
                  <ConversionSidebar />
                </div>
              </div>
            ) : (
              // Versión desktop — dos columnas
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div
                    className={`rounded-[1.75rem] p-6 shadow-lg ${
                      theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark'
                    }`}
                  >
                    <ProgressBar currentStep={step} totalSteps={3} />
                  </div>
                  {children}
                </div>
                <div className="hidden md:block">
                  <ConversionSidebar />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AgendamientoLayout;
