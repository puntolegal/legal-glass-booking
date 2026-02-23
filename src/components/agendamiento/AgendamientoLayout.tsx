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
        <div className="relative px-4 pb-12 pt-6 md:pt-8">
          <div className="max-w-5xl mx-auto">
            {isMobile ? (
              // Versión móvil - stack vertical mejorado
              <div className="space-y-4 relative z-10">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/70 rounded-2xl p-3 shadow-2xl">
                  <ProgressBar currentStep={step} totalSteps={3} />
                </div>
              <div className="relative z-10 min-h-[60vh]">
                  {children}
                </div>
                {/* Sidebar solo visible en paso 3 en mobile */}
                {step === 3 && <ConversionSidebar />}

                {/* FAB WhatsApp - solo steps 1 y 2 en mobile */}
                {step < 3 && (
                  <a
                    href="https://wa.me/56962321883?text=Hola%2C%20quisiera%20agendar%20en%20Punto%20Legal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-opacity hover:opacity-100"
                    style={{ backgroundColor: '#25D366', opacity: 0.85 }}
                    aria-label="Contactar por WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                )}
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
