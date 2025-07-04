import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, FileText, Scale, TrendingUp, Shield, Gavel } from "lucide-react";
import ReservationForm from "@/components/ReservationForm";

const TributarioPage = () => {
  const [showReservationForm, setShowReservationForm] = useState(false);

  const services = [
    {
      icon: TrendingUp,
      title: "Planificación Tributaria",
      description: "Estrategias legales para optimizar la carga tributaria de personas y empresas.",
      price: "150.000",
      features: ["Análisis de estructura tributaria", "Planificación legal", "Optimización fiscal", "Asesoría estratégica"]
    },
    {
      icon: Gavel,
      title: "Recursos ante SII",
      description: "Defensa en procedimientos administrativos y recursos ante el Servicio de Impuestos Internos.",
      price: "100.000",
      features: ["Recursos de reposición", "Recursos jerárquicos", "Defensa en fiscalizaciones", "Representación legal"]
    },
    {
      icon: Scale,
      title: "Litigios Tributarios",
      description: "Representación en Tribunales Tributarios y Aduaneros para casos complejos.",
      price: "180.000",
      features: ["Reclamos tributarios", "Defensa judicial", "Recursos de casación", "Estrategia procesal"]
    },
    {
      icon: Calculator,
      title: "Asesoría IVA e Impuestos",
      description: "Consultoría especializada en IVA, impuesto a la renta y otros tributos.",
      price: "120.000",
      features: ["Consultas IVA", "Impuesto a la renta", "Declaraciones juradas", "Cumplimiento tributario"]
    }
  ];

  const blogPosts = [
    {
      title: "Reforma Tributaria 2024: Principales Cambios",
      excerpt: "Análisis detallado de las modificaciones tributarias y su impacto en contribuyentes.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
      date: "25 Nov 2024"
    },
    {
      title: "Planificación Tributaria para Pymes",
      excerpt: "Estrategias legales para optimizar la carga tributaria de pequeñas y medianas empresas.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop",
      date: "22 Nov 2024"
    },
    {
      title: "Recursos ante el SII: Guía Práctica",
      excerpt: "Cómo defenderse eficazmente ante fiscalizaciones del Servicio de Impuestos Internos.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      date: "20 Nov 2024"
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
              <span className="text-xl font-bold text-foreground">Punto Legal Tributario</span>
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
              Asesoría Legal Especializada en Derecho Tributario
            </h1>
            <p className="text-l-custom text-muted-foreground mb-8 max-w-3xl mx-auto">
              Selecciona tu servicio, paga tu sesión y recibe atención especializada por Google Meet. 
              Más de 300 contribuyentes han optimizado su situación tributaria con nosotros.
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
              Servicios Tributarios Especializados
            </h2>
            <p className="text-m-custom text-muted-foreground max-w-3xl mx-auto">
              Asesoría integral en materia tributaria para personas y empresas
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

      {/* Tax Calculator Section */}
      <section className="section-padding bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-intense p-12 rounded-3xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Calculator className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-l-custom font-bold text-foreground mb-4">Optimización Tributaria Garantizada</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-xl text-center hover-lift">
                  <div className="text-primary font-bold text-2xl mb-2">25%</div>
                  <div className="text-muted-foreground text-sm">Promedio de ahorro tributario logrado</div>
                </div>
                <div className="glass p-6 rounded-xl text-center hover-lift">
                  <div className="text-primary font-bold text-2xl mb-2">300+</div>
                  <div className="text-muted-foreground text-sm">Contribuyentes asesorados</div>
                </div>
                <div className="glass p-6 rounded-xl text-center hover-lift">
                  <div className="text-primary font-bold text-2xl mb-2">98%</div>
                  <div className="text-muted-foreground text-sm">Tasa de éxito en recursos</div>
                </div>
              </div>

              <p className="text-m-custom text-muted-foreground mb-8">
                Nuestros especialistas en derecho tributario te ayudan a optimizar legalmente tu carga tributaria
                y defenderte ante el SII con estrategias probadas.
              </p>

              <Button 
                onClick={() => setShowReservationForm(true)}
                className="btn-glow px-8 py-3"
                size="lg"
              >
                Consulta Tributaria - Desde $100.000
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
              Últimas Noticias Tributarias
            </h2>
            <p className="text-m-custom text-muted-foreground">
              Mantente actualizado sobre cambios tributarios y estrategias fiscales
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
              ¿Problemas con el SII o alta carga tributaria?
            </h2>
            <p className="text-m-custom text-muted-foreground mb-8">
              Más de 300 contribuyentes han optimizado su situación tributaria con nuestra asesoría especializada
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
                Optimización tributaria legal en Chile
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Planificación Tributaria</li>
                <li>Recursos ante SII</li>
                <li>Litigios Tributarios</li>
                <li>Asesoría IVA</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+56 9 1234 5678</li>
                <li>tributario@puntolegal.cl</li>
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

export default TributarioPage;