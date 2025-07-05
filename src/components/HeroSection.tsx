import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReservationForm from "./ReservationForm";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
}

const HeroSection = ({ title, subtitle, showForm, setShowForm }: HeroSectionProps) => {
  const [internalShowForm, internalSetShowForm] = useState(false);
  const isControlled = typeof showForm === 'boolean' && typeof setShowForm === 'function';
  const actualShowForm = isControlled ? showForm : internalShowForm;
  const actualSetShowForm = isControlled ? setShowForm : internalSetShowForm;

  const defaultTitle = "Asesoría Legal Especializada";
  const defaultSubtitle = "en Derecho Laboral";

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-16 px-4 relative overflow-hidden">
      {/* Dark Tech Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src="/lovable-uploads/072374ab-546b-4f54-b7cd-16dee4333636.png" 
          alt="Legal 3D Elements" 
          className="absolute top-20 right-10 w-48 md:w-64 h-48 md:h-64 opacity-20 animate-float"
        />
        <img 
          src="/lovable-uploads/ed23eaf2-7b8d-429b-9ecf-6cb0e062a5b7.png" 
          alt="Briefcase 3D" 
          className="absolute bottom-20 left-10 w-32 md:w-48 h-32 md:h-48 opacity-15 animate-float" 
          style={{ animationDelay: '2s' }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Title - Dark Tech Typography */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                {title || defaultTitle}
              </span>
              <br />
              <span className="text-foreground font-medium">{subtitle || defaultSubtitle}</span>
            </h1>
          </div>
          
          {/* Subtitle with Pricing */}
          <p className="text-lg md:text-xl text-secondary-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Agenda y paga tu sesión de{" "}
            <span className="text-primary font-bold text-xl md:text-2xl px-2 py-1 rounded-lg bg-primary/10">
              $15.000 CLP
            </span>
            <br className="hidden md:block" />
            Recibe asesoría legal profesional por Google Meet
          </p>
          
          {/* CTA Buttons - Dark Tech Neón Style */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={() => actualSetShowForm(true)}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02] border border-primary/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agendar Ahora
            </Button>
            
            <Button 
              variant="outline"
              className="w-full sm:w-auto px-6 py-4 glass border-border/50 text-secondary-foreground hover:text-primary hover:bg-primary/5 rounded-xl font-medium transition-all duration-200"
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

          {/* Features Grid - Mobile First Dark Tech */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Consulta en 24h</h3>
              <p className="text-secondary-foreground text-sm">Agenda tu sesión y recibe atención inmediata</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">100% Seguro</h3>
              <p className="text-secondary-foreground text-sm">Pago protegido y confidencialidad garantizada</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Expertos</h3>
              <p className="text-secondary-foreground text-sm">Abogados especializados en derecho laboral</p>
            </div>
          </div>
        </div>
      </div>

      {actualShowForm && <ReservationForm onClose={() => actualSetShowForm(false)} />}
    </section>
  );
};

export default HeroSection;