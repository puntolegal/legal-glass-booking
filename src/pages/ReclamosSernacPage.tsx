import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const ReclamosSernacPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$18.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const reclamosData = {
    heroTitle: "Defensa del Consumidor",
    heroSubtitle: "Reclamos SERNAC en 1-3 días",
    services: [
      {
        title: "Reclamo Individual SERNAC",
        description: "Presentación de reclamos individuales ante SERNAC por productos o servicios defectuosos.",
        icon: "file-text",
        price: "$25.000",
        promoPrice: "$18.000"
      },
      {
        title: "Mediación Colectiva",
        description: "Participación en mediaciones colectivas para resolver conflictos masivos de consumo.",
        icon: "users",
        price: "$35.000",
        promoPrice: "$25.000"
      },
      {
        title: "Demanda por Daños",
        description: "Acciones judiciales para obtener indemnizaciones por daños causados por proveedores.",
        icon: "scale",
        price: "$40.000",
        promoPrice: "$30.000"
      }
    ],
    blogPosts: [
      {
        title: "¿Cuándo reclamar en SERNAC?",
        excerpt: "Situaciones en las que puedes presentar un reclamo ante el Servicio Nacional del Consumidor.",
        image: "photo-1589829545856-d10d557cf95f"
      },
      {
        title: "Proceso de mediación en SERNAC",
        excerpt: "Cómo funciona el proceso de mediación y qué esperar durante el procedimiento.",
        image: "photo-1521791136064-7986c2920216"
      },
      {
        title: "Derechos del consumidor en Chile",
        excerpt: "Conoce tus derechos como consumidor y cómo ejercerlos ante empresas y proveedores.",
        image: "photo-1507003211169-0a1dd7228f2d"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Consumidor" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={reclamosData.heroTitle}
          subtitle={reclamosData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$18.000 CLP"}
          serviceName={selectedService?.title || "Reclamo SERNAC"}
        />
        <ServicesSection 
          title="Servicios de Defensa del Consumidor"
          services={reclamosData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog del Consumidor"
          posts={reclamosData.blogPosts}
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
            title={reclamosData.heroTitle}
            subtitle={reclamosData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$18.000 CLP"}
            serviceName={selectedService?.title || "Reclamo SERNAC"}
          />
          <ServicesSection 
            title="Servicios de Defensa del Consumidor"
            services={reclamosData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog del Consumidor"
            posts={reclamosData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default ReclamosSernacPage; 