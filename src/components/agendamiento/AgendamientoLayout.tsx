// RUTA: src/components/agendamiento/AgendamientoLayout.tsx

import React from 'react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { useMobile } from '@/hooks/useMobile';
import ProgressBar from './ProgressBar';
import ConversionSidebar from './ConversionSidebar';
import SEO from '../SEO';

interface AgendamientoLayoutProps {
  children: React.ReactNode;
}

const AgendamientoLayout: React.FC<AgendamientoLayoutProps> = ({ children }) => {
  const { step, service } = useAgendamiento();
  const isMobile = useMobile();

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
      
      {/* Layout de Foco Premium - Sin Header/Footer */}
      <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        {/* Gradientes sutiles de fondo */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Logo minimalista + herramientas de desarrollo */}
        <div className="relative pt-8 pb-6">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">PL</span>
                </div>
                <span className="text-lg font-bold text-white">Punto Legal</span>
              </div>
            </div>

            {import.meta.env.DEV && (
              <div className="absolute right-4 top-4">
                <button
                  type="button"
                  onClick={handleDevSkipToPayment}
                  className="text-[11px] md:text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/70 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition"
                >
                  Debug: saltar al pago
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Diseño de Dos Columnas */}
        <div className="relative px-4 pb-12">
          <div className="max-w-5xl mx-auto">
            {isMobile ? (
              // Versión móvil - stack vertical
              <div className="space-y-6">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-4">
                  <ProgressBar currentStep={step} totalSteps={3} />
                </div>
                {children}
                {/* Sidebar solo visible en paso 3 en mobile */}
                {step === 3 && <ConversionSidebar />}
              </div>
            ) : (
              // Versión desktop - dos columnas
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda - Acción */}
                <div className="space-y-6">
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
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
