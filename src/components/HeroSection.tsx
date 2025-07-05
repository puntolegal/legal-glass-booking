import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReservationForm from "./ReservationForm";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
  servicePrice?: string;
  serviceName?: string;
}

const HeroSection = ({ title, subtitle, showForm, setShowForm, servicePrice = "$15.000 CLP", serviceName = "Consulta Legal" }: HeroSectionProps) => {
  const [internalShowForm, internalSetShowForm] = useState(false);
  const isControlled = typeof showForm === 'boolean' && typeof setShowForm === 'function';
  const actualShowForm = isControlled ? showForm : internalShowForm;
  const actualSetShowForm = isControlled ? setShowForm : internalSetShowForm;

  const defaultTitle = "Asesoría Legal Especializada";
  const defaultSubtitle = "en Derecho Laboral";

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-0 lg:pt-16 px-4 relative overflow-hidden">
      {/* Premium 3D Legal Elements - Hero Background */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Legal Briefcase - Top Left */}
        <img 
          src="/lovable-uploads/a0deea96-9ac7-49af-a07f-def89ae8abaa.png" 
          alt="Legal Briefcase 3D" 
          className="absolute top-8 sm:top-12 lg:top-16 left-4 sm:left-8 lg:left-16 w-24 sm:w-32 lg:w-48 xl:w-64 h-auto opacity-90 animate-float filter drop-shadow-2xl"
          style={{ 
            filter: 'drop-shadow(0 10px 30px rgba(255, 102, 0, 0.3))',
            zIndex: 15
          }}
        />
        
        {/* Legal Analytics Chart - Top Right */}
        <img 
          src="/lovable-uploads/7898c61a-9e73-4112-97ad-5e1b16d84421.png" 
          alt="Legal Analytics Chart" 
          className="absolute top-8 sm:top-12 lg:top-16 right-4 sm:right-8 lg:right-16 w-20 sm:w-28 lg:w-40 xl:w-52 h-auto opacity-85 animate-float filter drop-shadow-2xl"
          style={{ 
            animationDelay: '1s',
            filter: 'drop-shadow(0 8px 25px rgba(255, 102, 0, 0.25))',
            zIndex: 15
          }}
        />

        {/* Legal Tools - Bottom Center */}
        <img 
          src="/lovable-uploads/6e9bafb3-95e6-41ba-93e5-bf79b1a2064d.png" 
          alt="Legal Tools 3D" 
          className="absolute bottom-4 sm:bottom-8 lg:bottom-16 left-1/2 transform -translate-x-1/2 w-32 sm:w-44 lg:w-60 xl:w-80 h-auto opacity-80 animate-float filter drop-shadow-2xl"
          style={{ 
            animationDelay: '2s',
            filter: 'drop-shadow(0 12px 35px rgba(255, 102, 0, 0.4))',
            zIndex: 10
          }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Title - Dark Tech Typography */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 lg:mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                {title || defaultTitle}
              </span>
              <br />
              <span className="text-foreground font-medium text-2xl sm:text-3xl md:text-5xl lg:text-6xl">{subtitle || defaultSubtitle}</span>
            </h1>
          </div>
          
          {/* Subtitle with Pricing */}
          <p className="text-base sm:text-lg md:text-xl text-secondary-foreground mb-8 lg:mb-10 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
            Agenda y paga tu sesión de{" "}
            <span className="text-primary font-bold text-lg sm:text-xl md:text-2xl px-2 py-1 rounded-lg bg-primary/10 block sm:inline mt-2 sm:mt-0">
              {servicePrice}
            </span>
            <br className="hidden sm:block" />
            <span className="block sm:inline mt-2 sm:mt-0">Recibe asesoría legal profesional por Google Meet</span>
          </p>
          
          {/* CTA Buttons - Responsive sizing */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-12 lg:mb-16 px-4 sm:px-0">
            <Button 
              onClick={() => actualSetShowForm(true)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02] border border-primary/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agendar Ahora
            </Button>
            
            <Button 
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 glass border-border/50 text-secondary-foreground hover:text-primary hover:bg-primary/5 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
              onClick={() => {
                const element = document.getElementById('casos-exito');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver Casos de Éxito
            </Button>
          </div>

          {/* Features Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 px-4 sm:px-0">
            <div className="glass rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">Consulta en 24h</h3>
              <p className="text-secondary-foreground text-sm">Agenda tu sesión y recibe atención inmediata</p>
            </div>

            <div className="glass rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">100% Seguro</h3>
              <p className="text-secondary-foreground text-sm">Pago protegido y confidencialidad garantizada</p>
            </div>

            <div className="glass rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">Expertos</h3>
              <p className="text-secondary-foreground text-sm">Abogados especializados en derecho laboral</p>
            </div>
          </div>
        </div>
      </div>

      {actualShowForm && <ReservationForm onClose={() => actualSetShowForm(false)} servicePrice={servicePrice} serviceName={serviceName} />}
    </section>
  );
};

export default HeroSection;