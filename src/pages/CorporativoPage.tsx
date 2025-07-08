import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
import { useState } from "react";

const CorporativoPage = () => {
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

  const corporativoData = {
    heroTitle: "Asesoría Legal Especializada",
    heroSubtitle: "en Derecho Corporativo",
    services: [
      {
        title: "Constitución de Sociedades",
        description: "Constituimos tu empresa de forma rápida y segura con todos los trámites incluidos.",
        icon: "building",
        price: "$35.000",
        promoPrice: "$25.000"
      },
      {
        title: "Contratos Comerciales",
        description: "Redactamos contratos comerciales que protejan los intereses de tu empresa.",
        icon: "file-text",
        price: "$30.000",
        promoPrice: "$20.000"
      },
      {
        title: "Compliance Empresarial",
        description: "Aseguramos que tu empresa cumpla con todas las normativas vigentes.",
        icon: "shield-check",
        price: "$40.000",
        promoPrice: "$30.000"
      }
    ],
    blogPosts: [
      {
        title: "Cómo elegir el tipo de sociedad adecuado",
        excerpt: "Guía completa para decidir entre SPA, Limitada, S.A. y otros tipos societarios.",
        image: "photo-1560472354-b33ff0c44a43"
      },
      {
        title: "Contratos comerciales esenciales",
        excerpt: "Los contratos que toda empresa debe tener para proteger sus operaciones.",
        image: "photo-1589829545856-d10d557cf95f"
      },
      {
        title: "Compliance: evita sanciones",
        excerpt: "Cómo implementar un sistema de compliance efectivo en tu empresa.",
        image: "photo-1521791136064-7986c2920216"
      }
    ]
  };

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} serviceName="Punto Legal Corporativo" />
      <div className="hidden lg:block lg:pt-20">
        <HeroSection 
          title={corporativoData.heroTitle}
          subtitle={corporativoData.heroSubtitle}
          showForm={showForm} 
          setShowForm={setShowForm}
          servicePrice={selectedService?.price || "$25.000 CLP"}
          serviceName={selectedService?.title || "Consulta Corporativa"}
        />
        
        {/* Servicios Corporativos */}
        <section id="servicios" className="py-12 lg:py-20 px-4 lg:px-6 relative overflow-hidden">
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Servicios Corporativos
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Asesoría legal especializada para empresas. Sesiones de 45 minutos con expertos en derecho corporativo.
                <span className="block text-sm mt-2 text-primary">Oferta de lanzamiento: 50% de descuento</span>
              </p>
            </div>

            {/* Grid de servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {corporativoData.services.map((service, index) => (
                <div key={index} className="group">
                  <div className="glass rounded-3xl p-6 h-full border border-primary/10 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5">
                    
                    {/* Header con icono */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                        <div className="text-white">
                          {service.icon === "building" && (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                          {service.icon === "file-text" && (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                          {service.icon === "shield-check" && (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* Precio */}
                      <div className="text-right">
                        <div className="flex flex-col items-end">
                          <div className="text-xs text-muted-foreground line-through opacity-60">
                            {service.price}
                          </div>
                          <div className="text-primary font-bold text-lg">
                            {service.promoPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Título */}
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">
                      {service.title}
                    </h3>
                    
                    {/* Descripción */}
                    <p className="text-secondary-foreground mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Características */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-secondary-foreground text-xs">Asesoría especializada</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-secondary-foreground text-xs">Seguimiento del caso</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-secondary-foreground text-xs">Documentación completa</span>
                      </div>
                    </div>

                    {/* Botón CTA */}
                    <div className="mt-auto">
                      <button 
                        onClick={() => handleServiceSelect(service)}
                        className="glass bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80 text-white w-full px-4 py-3 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/20"
                      >
                        Agendar {service.title}
                      </button>
                      <div className="text-center text-xs text-muted-foreground mt-2">
                        Oferta válida por tiempo limitado
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialsSection />
        <BlogSection 
          title="Blog Corporativo"
          posts={corporativoData.blogPosts}
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
            title={corporativoData.heroTitle}
            subtitle={corporativoData.heroSubtitle}
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price || "$25.000 CLP"}
            serviceName={selectedService?.title || "Consulta Corporativa"}
          />
          
          {/* Versión móvil de servicios */}
          <section className="py-8 px-4 relative">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Servicios Corporativos
                </span>
              </h2>
            </div>
            
            <div className="space-y-4">
              {corporativoData.services.map((service, index) => (
                <div key={index} className="glass rounded-2xl p-4 border border-primary/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-foreground">{service.title}</h3>
                    <div className="text-primary font-bold">{service.promoPrice}</div>
                  </div>
                  <p className="text-sm text-secondary-foreground mb-3">{service.description}</p>
                  <button 
                    onClick={() => handleServiceSelect(service)}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Agendar
                  </button>
                </div>
              ))}
            </div>
          </section>

          <TestimonialsSection />
          <BlogSection 
            title="Blog Corporativo"
            posts={corporativoData.blogPosts}
          />
          <Footer />
        </MobileLayout>
      </div>
    </div>
  );
};

export default CorporativoPage; 