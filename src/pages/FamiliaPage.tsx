import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const FamiliaPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$25.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const familiaData = {
    heroTitle: "Asesoría Legal Especializada",
    heroSubtitle: "en Derecho de Familia",
    services: [
      {
        title: "Divorcio Express",
        description: "Tramitación ágil y eficiente de divorcios de mutuo acuerdo y unilaterales.",
        icon: "heart-crack",
        price: "$35.000",
        promoPrice: "$25.000"
      },
      {
        title: "Cuidado Personal y Visitas",
        description: "Regulación del cuidado personal de menores y régimen de visitas entre padres.",
        icon: "users",
        price: "$30.000",
        promoPrice: "$20.000"
      },
      {
        title: "Pensión de Alimentos",
        description: "Demanda, modificación y cumplimiento de pensiones alimenticias para menores y cónyuge.",
        icon: "baby",
        price: "$25.000",
        promoPrice: "$18.000"
      }
    ],
    blogPosts: [
      {
        title: "Divorcio de mutuo acuerdo: paso a paso",
        excerpt: "Guía completa para tramitar un divorcio consensual de manera rápida y económica.",
        image: "photo-1516321497487-e288fb19713f"
      },
      {
        title: "Cuidado compartido de los hijos",
        excerpt: "Todo lo que necesitas saber sobre el cuidado personal compartido y sus beneficios.",
        image: "photo-1511895426328-dc8714191300"
      },
      {
        title: "Cálculo de pensión alimenticia",
        excerpt: "Cómo se determina el monto de la pensión de alimentos según los ingresos del obligado.",
        image: "photo-1544027993-37dbfe43562a"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Familia" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={familiaData.heroTitle}
          subtitle={familiaData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$25.000 CLP"}
          serviceName={selectedService?.title || "Consulta Familiar"}
        />
        <ServicesSection 
          title="Servicios de Familia"
          services={familiaData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog de Familia"
          posts={familiaData.blogPosts}
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
            title={familiaData.heroTitle}
            subtitle={familiaData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$25.000 CLP"}
            serviceName={selectedService?.title || "Consulta Familiar"}
          />
          <ServicesSection 
            title="Servicios de Familia"
            services={familiaData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog de Familia"
            posts={familiaData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default FamiliaPage;