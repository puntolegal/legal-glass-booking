import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const FamiliaPage = () => {
  const familiaData = {
    heroTitle: "Asesoría en Derecho de Familia Online",
    heroSubtitle: "Especialistas en Derecho de Familia",
    services: [
      {
        title: "Divorcio Express",
        description: "Tramitación ágil y eficiente de divorcios de mutuo acuerdo y unilaterales.",
        icon: "heart-crack"
      },
      {
        title: "Cuidado Personal y Visitas",
        description: "Regulación del cuidado personal de menores y régimen de visitas entre padres.",
        icon: "users"
      },
      {
        title: "Pensión de Alimentos",
        description: "Demanda, modificación y cumplimiento de pensiones alimenticias para menores y cónyuge.",
        icon: "baby"
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection 
        title={familiaData.heroTitle}
        subtitle={familiaData.heroSubtitle}
      />
      <ServicesSection 
        title="Servicios de Familia"
        services={familiaData.services}
      />
      <TestimonialsSection />
      <BlogSection 
        title="Blog de Familia"
        posts={familiaData.blogPosts}
      />
    </div>
  );
};

export default FamiliaPage;