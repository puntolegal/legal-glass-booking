import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const ContratosExpressPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$15.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const contratosData = {
    heroTitle: "Contratos Express",
    heroSubtitle: "Entrega en 12-48 horas",
    services: [
      {
        title: "Contrato de Trabajo",
        description: "Contratos laborales adaptados a la legislación chilena con todas las cláusulas necesarias.",
        icon: "briefcase",
        price: "$20.000",
        promoPrice: "$15.000"
      },
      {
        title: "Contrato de Arriendo",
        description: "Contratos de arrendamiento seguros para propietarios e inquilinos.",
        icon: "home",
        price: "$18.000",
        promoPrice: "$12.000"
      },
      {
        title: "Contrato de Servicios",
        description: "Contratos profesionales para prestación de servicios independientes.",
        icon: "handshake",
        price: "$25.000",
        promoPrice: "$18.000"
      }
    ],
    blogPosts: [
      {
        title: "Cláusulas esenciales en contratos",
        excerpt: "Las cláusulas que no pueden faltar en ningún contrato para proteger tus intereses.",
        image: "photo-1589829545856-d10d557cf95f"
      },
      {
        title: "Contratos de trabajo: errores comunes",
        excerpt: "Evita los errores más frecuentes al redactar contratos laborales en Chile.",
        image: "photo-1507003211169-0a1dd7228f2d"
      },
      {
        title: "Modificación de contratos existentes",
        excerpt: "Cómo modificar contratos vigentes de manera legal y efectiva.",
        image: "photo-1521791136064-7986c2920216"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Express" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={contratosData.heroTitle}
          subtitle={contratosData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$15.000 CLP"}
          serviceName={selectedService?.title || "Contrato Express"}
        />
        <ServicesSection 
          title="Contratos Express"
          services={contratosData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog de Contratos"
          posts={contratosData.blogPosts}
        />
        <Footer />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {content}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout onAgendarClick={() => setShowForm(true)}>
          <HeroSection 
            title={contratosData.heroTitle}
            subtitle={contratosData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$15.000 CLP"}
            serviceName={selectedService?.title || "Contrato Express"}
          />
          <ServicesSection 
            title="Contratos Express"
            services={contratosData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog de Contratos"
            posts={contratosData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default ContratosExpressPage; 