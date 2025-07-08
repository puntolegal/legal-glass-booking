import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const ProteccionDatosPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$35.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const proteccionData = {
    heroTitle: "Protección de Datos",
    heroSubtitle: "Compliance LOPD en 3-5 días",
    services: [
      {
        title: "Auditoría de Compliance",
        description: "Evaluación completa del cumplimiento de la Ley de Protección de Datos Personales.",
        icon: "shield-check",
        price: "$50.000",
        promoPrice: "$35.000"
      },
      {
        title: "Política de Privacidad",
        description: "Redacción de políticas de privacidad adaptadas a tu negocio y la normativa chilena.",
        icon: "file-text",
        price: "$30.000",
        promoPrice: "$22.000"
      },
      {
        title: "Registro de Tratamiento",
        description: "Implementación del registro de actividades de tratamiento de datos personales.",
        icon: "database",
        price: "$40.000",
        promoPrice: "$30.000"
      }
    ],
    blogPosts: [
      {
        title: "Ley de Protección de Datos en Chile",
        excerpt: "Todo lo que necesitas saber sobre la Ley N°19.628 y sus obligaciones.",
        image: "photo-1563986768609-322da13575f3"
      },
      {
        title: "Derechos de los titulares de datos",
        excerpt: "Conoce los derechos ARCO y cómo implementarlos en tu organización.",
        image: "photo-1550751827-4bd374c3f58b"
      },
      {
        title: "Sanciones por incumplimiento",
        excerpt: "Las multas y sanciones por no cumplir con la protección de datos personales.",
        image: "photo-1589829545856-d10d557cf95f"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Protección de Datos" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={proteccionData.heroTitle}
          subtitle={proteccionData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$35.000 CLP"}
          serviceName={selectedService?.title || "Consulta de Datos"}
        />
        <ServicesSection 
          title="Servicios de Protección de Datos"
          services={proteccionData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog de Protección de Datos"
          posts={proteccionData.blogPosts}
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
            title={proteccionData.heroTitle}
            subtitle={proteccionData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$35.000 CLP"}
            serviceName={selectedService?.title || "Consulta de Datos"}
          />
          <ServicesSection 
            title="Servicios de Protección de Datos"
            services={proteccionData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog de Protección de Datos"
            posts={proteccionData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default ProteccionDatosPage; 