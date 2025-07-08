import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const MarcasPatentesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$40.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const marcasData = {
    heroTitle: "Marcas & Patentes",
    heroSubtitle: "Protege tu Propiedad Intelectual",
    services: [
      {
        title: "Registro de Marcas",
        description: "Protege tu marca comercial con registro oficial en INAPI, proceso completo en 1-2 semanas.",
        icon: "trademark",
        price: "$60.000",
        promoPrice: "$40.000"
      },
      {
        title: "Búsqueda de Anterioridades",
        description: "Verificamos que tu marca esté disponible antes del registro para evitar conflictos.",
        icon: "search",
        price: "$25.000",
        promoPrice: "$18.000"
      },
      {
        title: "Defensa de Marcas",
        description: "Protegemos tu marca contra infracciones y usos no autorizados por terceros.",
        icon: "shield",
        price: "$80.000",
        promoPrice: "$60.000"
      }
    ],
    blogPosts: [
      {
        title: "¿Cómo registrar una marca en Chile?",
        excerpt: "Guía paso a paso para el registro de marcas comerciales en INAPI.",
        image: "photo-1560472354-b33ff0c44a43"
      },
      {
        title: "Diferencias entre marca y patente",
        excerpt: "Conoce las diferencias fundamentales entre estos dos tipos de protección intelectual.",
        image: "photo-1589829545856-d10d557cf95f"
      },
      {
        title: "Renovación de marcas registradas",
        excerpt: "Todo lo que necesitas saber sobre la renovación de tu marca cada 10 años.",
        image: "photo-1521791136064-7986c2920216"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Propiedad Intelectual" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={marcasData.heroTitle}
          subtitle={marcasData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$40.000 CLP"}
          serviceName={selectedService?.title || "Consulta de Marcas"}
        />
        <ServicesSection 
          title="Servicios de Propiedad Intelectual"
          services={marcasData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog de Marcas"
          posts={marcasData.blogPosts}
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
            title={marcasData.heroTitle}
            subtitle={marcasData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$40.000 CLP"}
            serviceName={selectedService?.title || "Consulta de Marcas"}
          />
          <ServicesSection 
            title="Servicios de Propiedad Intelectual"
            services={marcasData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog de Marcas"
            posts={marcasData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default MarcasPatentesPage; 