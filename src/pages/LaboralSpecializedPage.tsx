import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield, FileText, Users, Gavel, Clock } from "lucide-react";
import ReservationForm from "@/components/ReservationForm";

const LaboralSpecializedPage = () => {
  const [showReservationForm, setShowReservationForm] = useState(false);

  const services = [
    {
      icon: Shield,
      title: "Tutela de Derechos Fundamentales",
      description: "Protección de derechos constitucionales en el ámbito laboral y discriminación.",
      price: "110.000",
      features: ["Despidos discriminatorios", "Acoso laboral", "Vulneración de derechos", "Proceso especial"]
    },
    {
      icon: Gavel,
      title: "Nulidad del Despido",
      description: "Impugnación de despidos por falta de cotizaciones previsionales al día.",
      price: "110.000",
      features: ["Ley Bustos", "Cotizaciones impagas", "Remuneraciones devengadas", "Sanción al empleador"]
    },
    {
      icon: FileText,
      title: "Asesoría Ley Karin",
      description: "Consultoría especializada en acoso laboral, sexual y violencia en el trabajo.",
      price: "45.000",
      features: ["Prevención de acoso", "Protocolos internos", "Investigaciones", "Capacitación empresarial"]
    },
    {
      icon: Users,
      title: "Mediación Laboral",
      description: "Resolución alternativa de conflictos laborales mediante mediación.",
      price: "100.000",
      features: ["Conflictos individuales", "Negociación asistida", "Acuerdos extrajudiciales", "Menor costo"]
    }
  ];

  const blogPosts = [
    {
      title: "Cálculo de Indemnizaciones: Guía Completa 2024",
      excerpt: "Todo lo que necesitas saber sobre indemnizaciones por despido en Chile.",
      image: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=400&h=200&fit=crop",
      date: "20 Nov 2024"
    },
    {
      title: "Ley Karin: Implementación y Compliance",
      excerpt: "Cómo implementar correctamente los protocolos contra el acoso laboral.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      date: "18 Nov 2024"
    },
    {
      title: "Tutela de Derechos: Casos Exitosos",
      excerpt: "Análisis de casos ganados en tutela de derechos fundamentales.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=200&fit=crop",
      date: "15 Nov 2024"
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
              <span className="text-xl font-bold text-foreground">Punto Legal Laboral</span>
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
              Asesoría Legal Especializada en Derecho Laboral
            </h1>
            <p className="text-l-custom text-muted-foreground mb-8 max-w-3xl mx-auto">
              Selecciona tu servicio, paga tu sesión y recibe atención especializada por Google Meet. 
              Defendemos tus derechos laborales con más de 500 casos exitosos.
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
              Servicios Laborales Especializados
            </h2>
            <p className="text-m-custom text-muted-foreground max-w-3xl mx-auto">
              Protección integral de derechos laborales con enfoque en casos complejos
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
                <Scale className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-l-custom font-bold text-foreground mb-4">Caso de Éxito Destacado</h3>
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-400/30 mb-6">
                <span className="text-green-400 font-bold text-2xl">$15.400.000 CLP</span>
              </div>
              <p className="text-m-custom text-muted-foreground mb-6">
                <span className="text-primary font-semibold">Joaquín Martinez</span> obtuvo una indemnización récord 
                por tutela de derechos fundamentales tras despido discriminatorio.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-primary font-bold text-lg">Salario Base</div>
                  <div className="text-muted-foreground">$1.400.000</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-primary font-bold text-lg">Tipo de Caso</div>
                  <div className="text-muted-foreground">Tutela de Derechos</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-primary font-bold text-lg">Resultado</div>
                  <div className="text-green-400 font-semibold">11x Sueldo Base</div>
                </div>
              </div>
              <Button 
                onClick={() => setShowReservationForm(true)}
                className="btn-glow px-8 py-3"
                size="lg"
              >
                Consulta tu Caso - Desde $45.000
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
              Últimas Noticias Laborales
            </h2>
            <p className="text-m-custom text-muted-foreground">
              Mantente informado sobre derechos laborales y nuevas regulaciones
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
              ¿Vulneraron tus derechos laborales?
            </h2>
            <p className="text-m-custom text-muted-foreground mb-8">
              Más de 500 trabajadores han recuperado sus derechos con nuestra asesoría especializada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowReservationForm(true)}
                className="btn-glow px-8 py-3"
                size="lg"
              >
                Agendar Consulta - Desde $45.000
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
                Defendemos tus derechos laborales en Chile
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tutela de Derechos</li>
                <li>Nulidad del Despido</li>
                <li>Ley Karin</li>
                <li>Mediación Laboral</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+56 9 1234 5678</li>
                <li>laboral@puntolegal.cl</li>
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

export default LaboralSpecializedPage;