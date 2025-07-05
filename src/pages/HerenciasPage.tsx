import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const HerenciasPage = () => {
  const herenciasData = {
    heroTitle: "Asesoría en Herencias Online",
    heroSubtitle: "Especialistas en Derecho Sucesorio",
    services: [
      {
        title: "Sucesión Intestada",
        description: "Tramitación de herencias sin testamento, determinando herederos legales y distribución de bienes.",
        icon: "scroll"
      },
      {
        title: "Testamentos",
        description: "Redacción y validación de testamentos para asegurar el cumplimiento de tu voluntad.",
        icon: "file-text"
      },
      {
        title: "Aceptación y Repudio",
        description: "Asesoría para aceptar o repudiar herencias, evaluando beneficios y obligaciones.",
        icon: "check-circle"
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection 
        title={herenciasData.heroTitle}
        subtitle={herenciasData.heroSubtitle}
      />
      <ServicesSection 
        title="Servicios de Herencias"
        services={herenciasData.services}
      />
      <TestimonialsSection />
      <BlogSection 
        title="Blog de Herencias"
        posts={herenciasData.blogPosts}
      />
    </div>
  );
};

export default HerenciasPage;