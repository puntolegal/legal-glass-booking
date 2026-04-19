// RUTA: src/components/agendamiento/AgendamientoLayout.tsx

import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { useMobile } from '@/hooks/useMobile';
import ProgressBar from './ProgressBar';
import ConversionSidebar from './ConversionSidebar';
import BrandMark from '@/components/BrandMark';
import SEO from '../SEO';
import { getServiceTheme } from '@/config/serviceThemes';

interface AgendamientoLayoutProps {
  children: React.ReactNode;
}

const AgendamientoLayout: React.FC<AgendamientoLayoutProps> = ({ children }) => {
  const { step, service } = useAgendamiento();
  const isMobile = useMobile();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');

  // Tema dinámico — prioriza el slug del plan (cae-tesoreria, ley-karin…)
  // y degrada por categoría legacy (Familia, Laboral Empresarial…)
  const serviceTheme = useMemo(
    () => getServiceTheme(plan, service.category),
    [plan, service.category],
  );
  
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
        title={`Agendar ${service.name} - Punto Legal`}
        description={`Agenda tu consulta estratégica de ${service.name} con nuestros expertos. Precio: $${service.price}. Garantía de satisfacción total y respuesta rápida.`}
      />
      
      {/* Layout de Foco Premium — dark navy + glassmorphism iOS, alineado con landing */}
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {/* Tints dinámicos del servicio — radial muy sutil (3-4%) que no compite */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top right, ${hexToRgba(serviceTheme.primary, 0.04)}, transparent 60%)`,
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at bottom left, ${hexToRgba(serviceTheme.accent, 0.03)}, transparent 60%)`,
          }}
        />

        {/* Header sticky con BrandMark + indicador de paso (consistente con landing) */}
        <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <BrandMark size="sm" showChip={false} />
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: serviceTheme.primary }}
                aria-hidden
              />
              Paso {step} de 3
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative px-4 pb-12 pt-5 md:pt-8">
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
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-3 shadow-2xl"
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
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">
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
