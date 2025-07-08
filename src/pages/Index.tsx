import Header from "@/components/Header";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$35.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const handleAgendarClick = () => {
    if (isMobile) {
      // En móvil, redirigir a AgendamientoPage para mejor UX
      window.location.href = '/agendamiento?plan=premium';
    } else {
      // En desktop, mantener modal
      setShowForm(true);
    }
  };

  const pageContent = (
    <>
      <HeroSection 
        showForm={showForm} 
        setShowForm={setShowForm}
        servicePrice={selectedService?.price}
        serviceName={selectedService?.title}
      />
      <ServicesSection onAgendarClick={handleServiceSelect} />
      <TestimonialsSection />
      <BlogSection />
      <Footer />
    </>
  );

  return (
    <>
      <SEO 
        title="Inicio"
        description="Punto Legal - Especialistas en derecho laboral, familia, herencias y soluciones legales express en Chile. Más de 10 años defendiendo los derechos de los trabajadores."
        keywords="derecho laboral chile, abogado laboral, despido injustificado, indemnización, derecho familia, herencias, contratos express"
        type="website"
      />
      <div className="relative min-h-screen bg-background overflow-x-hidden">
        {/* Efectos de fondo optimizados para móvil oscuro */}
        {isMobile ? (
          // Móvil: Fondo más sólido y sutil
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-muted/5 via-background to-muted/5 pointer-events-none z-0" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-full blur-3xl opacity-30 pointer-events-none z-0" />
          </>
        ) : (
          // Desktop: Efectos más elaborados
          <>
            <div className="absolute inset-0 pointer-events-none z-0" style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.08) 100%)",
              mixBlendMode: "overlay",
              opacity: 0.7
            }} />
            <div className="absolute left-1/4 top-0 w-1/2 h-32 bg-gradient-to-r from-white/30 to-transparent rounded-full blur-2xl opacity-60 animate-shimmer-premium pointer-events-none z-0" />
          </>
        )}

        {/* Desktop Layout */}
        <div className="hidden lg:block relative z-10">
          <Header onAgendarClick={handleAgendarClick} />
          <div className="pt-20">
            {pageContent}
          </div>
        </div>

        {/* Mobile Layout Optimizado */}
        <div className="lg:hidden relative z-10">
          <MobileLayout onAgendarClick={handleAgendarClick}>
            {pageContent}
          </MobileLayout>
        </div>

        {/* CTA Sticky Móvil Optimizado - Reposicionado */}
        <motion.div 
          className="fixed bottom-4 right-4 z-50 lg:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <motion.button 
            onClick={handleAgendarClick}
            className="w-14 h-14 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 border border-primary/30 backdrop-blur-sm transition-all duration-300 group relative overflow-hidden flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Agendar consulta"
          >
            {/* Efecto de brillo sutil */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />
            
            {/* Icono del botón */}
            <div className="relative flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </motion.button>
        </motion.div>

        {/* Indicador de scroll en móvil */}
        {isMobile && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-1 h-12 bg-primary/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-full"
              style={{
                height: "30%",
                transformOrigin: "bottom"
              }}
              animate={{
                height: ["30%", "70%", "30%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Index;
