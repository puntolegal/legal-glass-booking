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
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-float">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title || defaultTitle}
              </span>
              <br />
              <span className="text-foreground">{subtitle || defaultSubtitle}</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Agenda y paga tu sesión de <span className="text-primary font-semibold">$15.000 CLP</span>
            <br />
            Recibe asesoría legal profesional por Google Meet
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="primary" 
              size="lg" 
              className="text-lg px-8 py-6 animate-glow"
              onClick={() => actualSetShowForm(true)}
            >
              Agendar Ahora
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Button>
            
            <Button 
              variant="glass" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => {
                const element = document.getElementById('casos-exito');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Ver Casos de Éxito
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Consulta en 24h</h3>
              <p className="text-muted-foreground">Agenda tu sesión y recibe atención inmediata</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">100% Seguro</h3>
              <p className="text-muted-foreground">Pago protegido y confidencialidad garantizada</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Expertos</h3>
              <p className="text-muted-foreground">Abogados especializados en derecho laboral</p>
            </div>
          </div>
        </div>
      </div>

      {actualShowForm && <ReservationForm onClose={() => actualSetShowForm(false)} />}
    </section>
  );
};

export default HeroSection;