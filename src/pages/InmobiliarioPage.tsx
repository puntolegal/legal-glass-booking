import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, FileText, Key, Shield, Scale, Building } from "lucide-react";
import ReservationForm from "@/components/ReservationForm";

const InmobiliarioPage = () => {
  const [showReservationForm, setShowReservationForm] = useState(false);

  const services = [
    {
      icon: Home,
      title: "Venta y Compra de Inmuebles",
      description: "Asesoría integral en compraventa de propiedades, revisión de contratos y trámites.",
      price: "250.000",
      features: ["Revisión de contratos", "Due diligence inmobiliario", "Trámites notariales", "Gestión de hipotecas"]
    },
    {
      icon: FileText,
      title: "Estudio de Títulos",
      description: "Análisis exhaustivo de títulos de dominio, gravámenes y situación legal del inmueble.",
      price: "180.000",
      features: ["Análisis de títulos", "Certificados registrales", "Revisión de gravámenes", "Informe legal completo"]
    },
    {
      icon: Key,
      title: "Contratos de Arriendo",
      description: "Elaboración y revisión de contratos de arrendamiento para propiedades residenciales y comerciales.",
      price: "100.000",
      features: ["Contratos personalizados", "Cláusulas de protección", "Garantías", "Renovaciones automáticas"]
    },
    {
      icon: Shield,
      title: "Regularización de Propiedad",
      description: "Regularización de títulos, subdivisiones y trámites de posesión efectiva.",
      price: "200.000",
      features: ["Saneamiento de títulos", "Subdivisiones", "Reunificaciones", "Trámites municipales"]
    }
  ];

  const blogPosts = [
    {
      title: "Guía Completa para Comprar tu Primera Casa",
      excerpt: "Todo lo que necesitas saber sobre el proceso de compra de vivienda en Chile.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop",
      date: "30 Nov 2024"
    },
    {
      title: "Contratos de Arriendo: Derechos y Obligaciones",
      excerpt: "Análisis detallado de la nueva ley de arriendo y sus implicancias.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=200&fit=crop",
      date: "27 Nov 2024"
    },
    {
      title: "Regularización de Propiedades: Proceso Paso a Paso",
      excerpt: "Cómo regularizar títulos de dominio y solucionar problemas legales.",
      image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=200&fit=crop",
      date: "24 Nov 2024"
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
              <span className="text-xl font-bold text-foreground">Punto Legal Inmobiliario</span>
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
              Asesoría Legal Especializada en Derecho Inmobiliario
            </h1>
            <p className="text-l-custom text-muted-foreground mb-8 max-w-3xl mx-auto">
              Selecciona tu servicio, paga tu sesión y recibe atención especializada por Google Meet. 
              Más de 350 operaciones inmobiliarias exitosas con nuestra asesoría.
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
              Servicios Inmobiliarios Especializados
            </h2>
            <p className="text-m-custom text-muted-foreground max-w-3xl mx-auto">
              Asesoría integral en todas las etapas de operaciones inmobiliarias
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

      {/* Success Story Section */}
      <section className="section-padding bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-intense p-12 rounded-3xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-l-custom font-bold text-foreground mb-4">Operaciones Inmobiliarias Exitosas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-xl text-center hover-lift">
                  <div className="text-primary font-bold text-2xl mb-2">350+</div>
                  <div className="text-muted-foreground text-sm">Operaciones completadas</div>
                </div>
                <div className="glass p-6 rounded-xl text-center hover-lift">
                  <div className="text-primary font-bold text-2xl mb-2">$15B</div>
                  <div className="text-muted-foreground text-sm">Valor total transado</div>
                </div>
                <div className="glass p-6 rounded-xl text-center hover-lift">
                  <div className="text-primary font-bold text-2xl mb-2">99%</div>
                  <div className="text-muted-foreground text-sm">Operaciones sin problemas legales</div>
                </div>
              </div>

              <p className="text-m-custom text-muted-foreground mb-8">
                Desde departamentos hasta grandes proyectos comerciales, nuestro equipo especializado 
                garantiza operaciones seguras y sin complicaciones legales.
              </p>

              <Button 
                onClick={() => setShowReservationForm(true)}
                className="btn-glow px-8 py-3"
                size="lg"
              >
                Consulta Inmobiliaria - Desde $100.000
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-l-custom font-bold mb-6 text-foreground">
              Últimas Noticias Inmobiliarias
            </h2>
            <p className="text-m-custom text-muted-foreground">
              Mantente informado sobre el mercado inmobiliario y regulaciones
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
      <section id="contacto" className="section-padding bg-secondary/20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto glass-intense p-12 rounded-3xl">
            <h2 className="text-l-custom font-bold mb-6 text-foreground">
              ¿Planeas comprar, vender o arrendar una propiedad?
            </h2>
            <p className="text-m-custom text-muted-foreground mb-8">
              Más de 350 operaciones inmobiliarias exitosas con nuestra asesoría legal especializada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowReservationForm(true)}
                className="btn-glow px-8 py-3"
                size="lg"
              >
                Agendar Consulta - Desde $100.000
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
                Asesoría inmobiliaria especializada en Chile
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Compraventa</li>
                <li>Estudio de Títulos</li>
                <li>Contratos de Arriendo</li>
                <li>Regularizaciones</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+56 9 1234 5678</li>
                <li>inmobiliario@puntolegal.cl</li>
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

export default InmobiliarioPage;