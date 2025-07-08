import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const ECommerceCompliancePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$45.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const ecommerceData = {
    heroTitle: "E-Commerce & Fintech",
    heroSubtitle: "Compliance Digital en 1 semana",
    services: [
      {
        title: "Compliance E-Commerce",
        description: "Cumplimiento normativo completo para tiendas online y marketplaces digitales.",
        icon: "shopping-cart",
        price: "$60.000",
        promoPrice: "$45.000"
      },
      {
        title: "Términos y Condiciones",
        description: "Redacción de términos de uso y políticas de venta adaptadas al comercio electrónico.",
        icon: "file-text",
        price: "$35.000",
        promoPrice: "$25.000"
      },
      {
        title: "Compliance Fintech",
        description: "Asesoría especializada en regulación financiera y medios de pago digitales.",
        icon: "credit-card",
        price: "$80.000",
        promoPrice: "$60.000"
      }
    ],
    blogPosts: [
      {
        title: "Regulación del comercio electrónico",
        excerpt: "Marco legal para el comercio electrónico en Chile y obligaciones de los comerciantes.",
        image: "photo-1563013544-824ae1b704d3"
      },
      {
        title: "Protección al consumidor online",
        excerpt: "Derechos del consumidor en compras online y obligaciones de las tiendas digitales.",
        image: "photo-1556742049-0cfed4f6a45d"
      },
      {
        title: "Fintech y regulación bancaria",
        excerpt: "Normativas que deben cumplir las empresas fintech y de medios de pago.",
        image: "photo-1551288049-bebda4e38f71"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Digital" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={ecommerceData.heroTitle}
          subtitle={ecommerceData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$45.000 CLP"}
          serviceName={selectedService?.title || "Consulta Digital"}
        />
        <ServicesSection 
          title="Servicios Digitales"
          services={ecommerceData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog Digital"
          posts={ecommerceData.blogPosts}
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
            title={ecommerceData.heroTitle}
            subtitle={ecommerceData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$45.000 CLP"}
            serviceName={selectedService?.title || "Consulta Digital"}
          />
          <ServicesSection 
            title="Servicios Digitales"
            services={ecommerceData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog Digital"
            posts={ecommerceData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default ECommerceCompliancePage; 