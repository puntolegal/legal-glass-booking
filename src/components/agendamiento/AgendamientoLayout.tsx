// RUTA: src/components/agendamiento/AgendamientoLayout.tsx

import React, { useMemo } from 'react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { useMobile } from '@/hooks/useMobile';
import ProgressBar from './ProgressBar';
import ConversionSidebar from './ConversionSidebar';
import SEO from '../SEO';
import { serviceThemes } from '@/config/serviceThemes';

interface AgendamientoLayoutProps {
  children: React.ReactNode;
}

const AgendamientoLayout: React.FC<AgendamientoLayoutProps> = ({ children }) => {
  const { step, service } = useAgendamiento();
  const isMobile = useMobile();
  
  // Obtener tema del servicio para colores dinámicos
  const serviceTheme = useMemo(() => {
    const category = service.category.toLowerCase();
    return serviceThemes[category as keyof typeof serviceThemes] || serviceThemes.general;
  }, [service.category]);
  
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
      
      {/* Layout de Foco Premium - Estilo iOS con colores dinámicos del servicio */}
      <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        {/* Gradientes dinámicos según el servicio - Estilo iOS tenue y sobrio */}
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
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${hexToRgba(serviceTheme.secondary, 0.025)}, transparent 70%)`,
          }}
        />

        {/* Main Content - Diseño de Dos Columnas Mejorado */}
        <div className="relative px-4 pb-12 pt-4 md:pt-8">
          <div className="max-w-5xl mx-auto">
            {isMobile ? (
              // Versión móvil - Formulario primero (order-1), Sidebar después (order-2)
              <div className="flex flex-col relative z-10">
                {/* Formulario - Aparece primero en móvil */}
                <div className="order-1 space-y-4">
                  <div id="agendamiento-form" className="bg-slate-900/80 backdrop-blur-md border border-slate-800/70 rounded-2xl p-3 shadow-2xl">
                    <ProgressBar currentStep={step} totalSteps={3} />
                  </div>
                  <div className="relative z-10">
                    {children}
                  </div>
                </div>
                
                {/* Sidebar de conversión - Aparece después en móvil */}
                <div className="order-2 mt-6">
                  <ConversionSidebar />
                </div>

              </div>
            ) : (
              // Versión desktop - dos columnas
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda - Acción */}
                <div className="space-y-6">
                  <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/70 rounded-2xl p-6 shadow-2xl">
                    <ProgressBar currentStep={step} totalSteps={3} />
                  </div>
                  {children}
                </div>

                {/* Columna Derecha - Confianza (Sticky) */}
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
