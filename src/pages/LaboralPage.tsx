import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const LaboralPage = () => {
  const laboralData = {
    heroTitle: "Asesoría Laboral Online",
    heroSubtitle: "Especialistas en Derecho Laboral",
    services: [
      {
        title: "Despido Injustificado",
        description: "Te ayudamos a recuperar las indemnizaciones que te corresponden por despido sin causa justificada.",
        icon: "briefcase"
      },
      {
        title: "Tutela de Derechos Fundamentales",
        description: "Protegemos tus derechos fundamentales en el ámbito laboral ante vulneraciones del empleador.",
        icon: "shield"
      },
      {
        title: "Reclamaciones Laborales",
        description: "Asesoría integral para reclamaciones de sueldos, horas extras y beneficios laborales.",
        icon: "scale"
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection 
        title={laboralData.heroTitle}
        subtitle={laboralData.heroSubtitle}
      />
      <ServicesSection 
        title="Servicios Laborales"
        services={laboralData.services}
      />
      <TestimonialsSection />
      <BlogSection 
        title="Blog Laboral"
        posts={laboralData.blogPosts}
      />
      <Footer />
    </div>
  );
};

export default LaboralPage;