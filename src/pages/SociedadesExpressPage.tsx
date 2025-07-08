import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const SociedadesExpressPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$30.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const sociedadesData = {
    heroTitle: "Sociedades Express",
    heroSubtitle: "Constitución en 24-72 horas",
    services: [
      {
        title: "Sociedad por Acciones (SpA)",
        description: "Constitución de SpA con flexibilidad total y responsabilidad limitada.",
        icon: "building",
        price: "$40.000",
        promoPrice: "$30.000"
      },
      {
        title: "Sociedad de Responsabilidad Limitada",
        description: "Constitución de SRL ideal para pequeñas y medianas empresas familiares.",
        icon: "users",
        price: "$35.000",
        promoPrice: "$25.000"
      },
      {
        title: "Empresa Individual (EIRL)",
        description: "Constitución de EIRL para emprendedores individuales con patrimonio separado.",
        icon: "user",
        price: "$25.000",
        promoPrice: "$18.000"
      }
    ],
    blogPosts: [
      {
        title: "¿Qué tipo de sociedad elegir?",
        excerpt: "Comparación entre SpA, SRL y EIRL para ayudarte a elegir la mejor opción.",
        image: "photo-1560472354-b33ff0c44a43"
      },
      {
        title: "Requisitos para constituir una SpA",
        excerpt: "Todo lo que necesitas saber para constituir una Sociedad por Acciones.",
        image: "photo-1589829545856-d10d557cf95f"
      },
      {
        title: "Ventajas de la responsabilidad limitada",
        excerpt: "Cómo proteger tu patrimonio personal con una sociedad de responsabilidad limitada.",
        image: "photo-1521791136064-7986c2920216"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Sociedades" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={sociedadesData.heroTitle}
          subtitle={sociedadesData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$30.000 CLP"}
          serviceName={selectedService?.title || "Constitución Express"}
        />
        <ServicesSection 
          title="Servicios de Sociedades"
          services={sociedadesData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog de Sociedades"
          posts={sociedadesData.blogPosts}
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
            title={sociedadesData.heroTitle}
            subtitle={sociedadesData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$30.000 CLP"}
            serviceName={selectedService?.title || "Constitución Express"}
          />
          <ServicesSection 
            title="Servicios de Sociedades"
            services={sociedadesData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog de Sociedades"
            posts={sociedadesData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default SociedadesExpressPage; 