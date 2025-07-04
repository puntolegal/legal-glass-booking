import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Briefcase, Users, Shield, Scale } from "lucide-react";
import ReservationForm from "@/components/ReservationForm";

const CorporativoPage = () => {
  const [showReservationForm, setShowReservationForm] = useState(false);

  const services = [
    {
      icon: Building2,
      title: "Constitución de Sociedades",
      description: "Asesoría completa para la creación de empresas, SPA, LTDA y sociedades anónimas.",
      price: "200.000",
      features: ["Redacción de estatutos", "Trámites notariales", "Inscripción en registro"]
    },
    {
      icon: Users,
      title: "Fusiones y Adquisiciones",
      description: "Procesos de M&A, due diligence y reestructuraciones corporativas.",
      price: "350.000",
      features: ["Due diligence legal", "Negociación de términos", "Documentación legal"]
    },
    {
      icon: FileText,
      title: "Contratos Mercantiles",
      description: "Elaboración y revisión de contratos comerciales y acuerdos empresariales.",
      price: "120.000",
      features: ["Contratos de compraventa", "Acuerdos comerciales", "Términos y condiciones"]
    },
    {
      icon: Shield,
      title: "Compliance Corporativo",
      description: "Implementación de programas de cumplimiento y gobierno corporativo.",
      price: "200.000",
      features: ["Políticas internas", "Códigos de ética", "Auditorías legales"]
    }
  ];

  const blogPosts = [
    {
      title: "Guía Completa para Constituir una SPA en Chile",
      excerpt: "Todo lo que necesitas saber sobre la constitución de sociedades por acciones.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      date: "15 Nov 2024"
    },
    {
      title: "Compliance Corporativo: Nuevas Regulaciones 2024",
      excerpt: "Análisis de las últimas normativas en gobierno corporativo y cumplimiento.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop",
      date: "10 Nov 2024"
    },
    {
      title: "Fusiones y Adquisiciones: Tendencias del Mercado",
      excerpt: "Perspectivas y oportunidades en el mercado de M&A chileno.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      date: "5 Nov 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="logo-circle">
                <span>P</span>
              </div>
              <span className="text-xl font-bold text-foreground">Punto Legal Corporativo</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#inicio" className="text-muted-foreground hover:text-primary transition-colors">Inicio</a>
                <a href="#servicios" className="text-muted-foreground hover:text-primary transition-colors">Servicios</a>
                <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a>
                <a href="#contacto" className="text-muted-foreground hover:text-primary transition-colors">Contacto</a>
              </nav>
              <Button 
                onClick={() => setShowReservationForm(true)}
                className="btn-glow"
              >
                Agendar Ahora
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="section-padding pt-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto fade-in-up">
            <h1 className="text-xl-custom font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Asesoría Legal Especializada en Derecho Corporativo
            </h1>
            <p className="text-l-custom text-muted-foreground mb-8 max-w-3xl mx-auto">
              Selecciona tu servicio, paga tu sesión y recibe atención especializada por Google Meet. 
              Más de 200 empresas confían en nuestra experiencia.
            </p>
            <Button 
              onClick={() => setShowReservationForm(true)}
              className="btn-glow text-m-custom px-8 py-4"
              size="lg"
            >
              Reservar Consulta Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-l-custom font-bold mb-6 text-foreground">
              Servicios Corporativos Especializados
            </h2>
            <p className="text-m-custom text-muted-foreground max-w-3xl mx-auto">
              Asesoría legal integral para empresas, desde constitución hasta compliance corporativo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="service-card hover-lift group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="price-badge">
                      ${service.price} CLP
                    </div>
                  </div>
                  <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => setShowReservationForm(true)}
                    className="w-full btn-secondary"
                  >
                    Agendar Servicio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="section-padding bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-l-custom font-bold mb-6 text-foreground">
              Últimas Noticias Corporativas
            </h2>
            <p className="text-m-custom text-muted-foreground">
              Mantente informado sobre las últimas tendencias en derecho corporativo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <Card key={index} className="glass hover-lift overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {post.date}
                  </Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    Leer más →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="section-padding">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto glass-intense p-12 rounded-3xl">
            <h2 className="text-l-custom font-bold mb-6 text-foreground">
              ¿Listo para impulsar tu empresa?
            </h2>
            <p className="text-m-custom text-muted-foreground mb-8">
              Únete a las más de 200 empresas que han crecido con nuestra asesoría legal especializada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowReservationForm(true)}
                className="btn-glow px-8 py-3"
                size="lg"
              >
                Agendar Consulta - Desde $120.000
              </Button>
              <Button 
                variant="outline" 
                className="btn-secondary px-8 py-3"
                size="lg"
              >
                Contactar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="logo-circle w-8 h-8">
                  <span className="text-sm">P</span>
                </div>
                <span className="font-bold text-foreground">Punto Legal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Asesoría legal especializada para empresas en Chile
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Constitución de Sociedades</li>
                <li>Fusiones y Adquisiciones</li>
                <li>Contratos Mercantiles</li>
                <li>Compliance Corporativo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+56 9 1234 5678</li>
                <li>contacto@puntolegal.cl</li>
                <li>Las Condes, Santiago</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Términos y Condiciones</li>
                <li>Política de Privacidad</li>
                <li>Aviso Legal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Punto Legal. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm onClose={() => setShowReservationForm(false)} />
      )}
    </div>
  );
};

export default CorporativoPage;