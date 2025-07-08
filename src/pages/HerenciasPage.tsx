import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const HerenciasPage = () => {
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

  const herenciasData = {
    heroTitle: "Asesoría Legal Especializada",
    heroSubtitle: "en Herencias y Testamentos",
    services: [
      {
        title: "Sucesión Intestada",
        description: "Tramitación de herencias sin testamento, determinando herederos legales y distribución de bienes.",
        icon: "scroll",
        price: "$40.000",
        promoPrice: "$30.000"
      },
      {
        title: "Testamentos",
        description: "Redacción y validación de testamentos para asegurar el cumplimiento de tu voluntad.",
        icon: "file-text",
        price: "$35.000",
        promoPrice: "$25.000"
      },
      {
        title: "Aceptación y Repudio",
        description: "Asesoría para aceptar o repudiar herencias, evaluando beneficios y obligaciones.",
        icon: "check-circle",
        price: "$30.000",
        promoPrice: "$22.000"
      }
    ],
    blogPosts: [
      {
        title: "¿Cómo hacer un testamento válido?",
        excerpt: "Requisitos legales y pasos para redactar un testamento que cumpla con la ley chilena.",
        image: "photo-1589829545856-d10d557cf95f"
      },
      {
        title: "Herencia legítima y libre disposición",
        excerpt: "Conoce las limitaciones legales para disponer de tus bienes y los derechos de los herederos.",
        image: "photo-1560472354-b33ff0c44a43"
      },
      {
        title: "Trámites para heredar una propiedad",
        excerpt: "Procedimiento completo para transferir la propiedad de bienes raíces por herencia.",
        image: "photo-1564013799919-ab600027ffc6"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Sucesorio" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={herenciasData.heroTitle}
          subtitle={herenciasData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$30.000 CLP"}
          serviceName={selectedService?.title || "Consulta Sucesoria"}
        />
        <ServicesSection 
          title="Servicios de Herencias"
          services={herenciasData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog de Herencias"
          posts={herenciasData.blogPosts}
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
            title={herenciasData.heroTitle}
            subtitle={herenciasData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$30.000 CLP"}
            serviceName={selectedService?.title || "Consulta Sucesoria"}
          />
          <ServicesSection 
            title="Servicios de Herencias"
            services={herenciasData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog de Herencias"
            posts={herenciasData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default HerenciasPage;