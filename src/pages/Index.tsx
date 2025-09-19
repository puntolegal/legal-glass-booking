import Header from "@/components/Header";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { MobileLayout } from "@/components/MobileLayout";
import PremiumMobileHero from "@/components/PremiumMobileHero";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Index = () => {
  // Eliminar estados relacionados con modales ya que siempre redirigimos
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
    // Mapear servicios a planes específicos con nombres exactos
    const serviceMap: { [key: string]: string } = {
      'Punto Legal Laboral': 'laboral',
      'Punto Legal Familia': 'familia', 
      'Punto Legal Sucesorio': 'herencias',
      'Punto Legal Inmobiliario': 'inmobiliario',
      'Punto Legal Empresarial': 'empresarial',
      'Punto Legal Contratos': 'contratos-express',
      'Punto Legal Administración Pública': 'administracion-publica',
      'Punto Legal Tributario': 'tributario',
      'Punto Legal Compliance': 'compliance-riesgo',
      'Punto Legal Migratorio': 'migratorio',
      'Punto Legal Propiedad Intelectual': 'marcas-patentes',
      'Punto Legal Consumidor': 'reclamos-sernac',
      'Punto Legal Penal Económico': 'penal-economico',
      // Fallbacks para variaciones de nombres
      'Punto Legal Corporativo': 'premium',
      'Punto Legal Express': 'contratos-express',
      'Punto Legal Sociedades': 'sociedades-express',
      'Punto Legal Protección de Datos': 'proteccion-datos',
      'Punto Legal Digital': 'ecommerce'
    };
    const plan = serviceMap[service.title] || 'laboral'; // Cambio default a laboral
    window.location.href = `/agendamiento?plan=${plan}`;
  };

  const pageContent = (
    <>
      <HeroSection 
        showForm={false} 
        setShowForm={() => {}}
        servicePrice={null}
        serviceName={null}
      />
      <ServicesSection onAgendarClick={handleServiceSelect} />
      <TestimonialsSection />
      <BlogSection />
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
        <div className="hidden lg:block">
          <Header />
          {pageContent}
        </div>

        {/* Mobile Layout - Hero Premium Definitivo */}
        <div className="lg:hidden">
          <MobileLayout>
            <PremiumMobileHero />
          </MobileLayout>
        </div>

      </div>
    </>
  );
};

export default Index;
