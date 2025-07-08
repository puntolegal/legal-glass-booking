import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const LaboralPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$20.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  const laboralData = {
    heroTitle: "Asesoría Legal Especializada",
    heroSubtitle: "en Derecho Laboral",
    services: [
      {
        title: "Despido Injustificado",
        description: "Te ayudamos a recuperar las indemnizaciones que te corresponden por despido sin causa justificada.",
        icon: "briefcase",
        price: "$25.000",
        promoPrice: "$20.000"
      },
      {
        title: "Tutela de Derechos Fundamentales",
        description: "Protegemos tus derechos fundamentales en el ámbito laboral ante vulneraciones del empleador.",
        icon: "shield",
        price: "$30.000",
        promoPrice: "$25.000"
      },
      {
        title: "Reclamaciones Laborales",
        description: "Asesoría integral para reclamaciones de sueldos, horas extras y beneficios laborales.",
        icon: "scale",
        price: "$20.000",
        promoPrice: "$15.000"
      }
    ],
    blogPosts: [
      {
        title: "¿Cuándo un despido es injustificado?",
        excerpt: "Conoce los criterios legales que determinan si tu despido fue procedente según la legislación laboral chilena.",
        image: "photo-1507003211169-0a1dd7228f2d"
      },
      {
        title: "Indemnizaciones por años de servicio",
        excerpt: "Cálculo detallado de las compensaciones que te corresponden según tu antigüedad en la empresa.",
        image: "photo-1554224155-6726b3ff858f"
      },
      {
        title: "Derechos del trabajador en Chile",
        excerpt: "Guía completa sobre tus derechos laborales y cómo hacerlos valer ante el empleador.",
        image: "photo-1521791136064-7986c2920216"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Laboral" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={laboralData.heroTitle}
          subtitle={laboralData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$20.000 CLP"}
          serviceName={selectedService?.title || "Consulta Laboral"}
        />
        <ServicesSection 
          title="Servicios Laborales"
          services={laboralData.services}
          onAgendarClick={handleServiceSelect} 
        />
        <TestimonialsSection />
        <BlogSection 
          title="Blog Laboral"
          posts={laboralData.blogPosts}
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
            title={laboralData.heroTitle}
            subtitle={laboralData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$20.000 CLP"}
            serviceName={selectedService?.title || "Consulta Laboral"}
          />
          <ServicesSection 
            title="Servicios Laborales"
            services={laboralData.services}
            onAgendarClick={handleServiceSelect} 
          />
          <TestimonialsSection />
          <BlogSection 
            title="Blog Laboral"
            posts={laboralData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default LaboralPage;