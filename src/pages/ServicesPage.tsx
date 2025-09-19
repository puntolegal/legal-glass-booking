import React, { useState, useEffect } from 'react';
import { Shield, Scale, Zap, Building, Lock, Gavel, Briefcase, Heart, ScrollText, ShoppingCart, FileCheck, Crown, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DarkModeToggle from '@/components/DarkModeToggle';
import ReservationForm from '@/components/ReservationForm';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import { MobileLayout } from '@/components/MobileLayout';

interface ServiceCard {
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  features: string[];
  icon: React.ReactNode;
  badge?: string;
  href?: string;
}

const ServiceCard: React.FC<ServiceCard & { onAgendarClick: (service: ServiceCard) => void }> = ({ 
  title, 
  description, 
  price, 
  originalPrice, 
  features, 
  icon, 
  badge,
  onAgendarClick
}) => (
  <Card className="group relative overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] hover:shadow-[0_16px_64px_rgba(251,146,60,0.15)] dark:hover:shadow-[0_16px_64px_rgba(251,146,60,0.1)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover-bounce border-glow">
    {/* Efecto de luz de fondo */}
    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-orange-500/3 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <CardHeader className="pb-4 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 via-orange-500/15 to-red-500/10 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/30 transition-all duration-300">
          <div className="text-amber-500 group-hover:text-orange-500 transition-colors duration-300 hover-rotate">
            {icon}
          </div>
        </div>
        {badge && (
          <Badge variant="secondary" className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-400/30 backdrop-blur-sm">
            {badge}
          </Badge>
        )}
      </div>
      <CardTitle className="text-xl font-bold text-foreground mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">{title}</CardTitle>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
          )}
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{price}</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 group/feature">
            <CheckCircle className="w-4 h-4 text-amber-500 group-hover/feature:text-orange-500 transition-colors duration-300 flex-shrink-0" />
            <span className="text-sm text-muted-foreground group-hover/feature:text-foreground transition-colors duration-300">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button 
        className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-amber-500/30 hover:-translate-y-0.5 relative overflow-hidden"
        onClick={() => onAgendarClick({ title, description, price, originalPrice, features, icon, badge })}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <span className="relative z-10">Agendar Ahora</span>
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
      </Button>
    </CardContent>
  </Card>
);

const PremiumGrid: React.FC<{ onAgendarClick: (service: ServiceCard) => void }> = ({ onAgendarClick }) => {
  const premiumServices: ServiceCard[] = [
    {
      title: "Legal Health Check Corporativo",
      description: "Auditoría legal completa de tu empresa con diagnóstico detallado y plan de acción personalizado.",
      price: "$1.200.000",
      originalPrice: "$1.800.000",
      features: [
        "Auditoría legal completa",
        "Diagnóstico de riesgos",
        "Plan de acción personalizado",
        "Reporte ejecutivo detallado",
        "Sesión de presentación"
      ],
      icon: <Shield className="w-6 h-6 text-primary" />,
      badge: "Más Popular"
    },
    {
      title: "Escudo Legal Mensual",
      description: "Retainer legal premium con atención prioritaria y cobertura integral para tu empresa.",
      price: "$800.000/mes",
      features: [
        "Atención prioritaria 24/7",
        "Consultas ilimitadas",
        "Revisión de contratos",
        "Asesoría en tiempo real",
        "Cobertura integral"
      ],
      icon: <Shield className="w-6 h-6 text-primary" />,
      badge: "Recomendado"
    },
    {
      title: "M&A Express",
      description: "Due Diligence completo para fusiones y adquisiciones con análisis exhaustivo.",
      price: "$2.500.000",
      features: [
        "Due Diligence completo",
        "Análisis de riesgos",
        "Evaluación legal",
        "Reporte ejecutivo",
        "Asesoría en negociación"
      ],
      icon: <Building className="w-6 h-6 text-primary" />
    },
    {
      title: "Compliance & Protección Datos",
      description: "Cumplimiento normativo completo y protección de datos personales según LGPD.",
      price: "$1.500.000",
      features: [
        "Auditoría de compliance",
        "Implementación LGPD",
        "Políticas y procedimientos",
        "Capacitación del equipo",
        "Seguimiento continuo"
      ],
      icon: <Lock className="w-6 h-6 text-primary" />
    },
    {
      title: "Defensa Fiscalizaciones & DT",
      description: "Defensa especializada en fiscalizaciones de la Dirección del Trabajo.",
      price: "$900.000",
      features: [
        "Defensa en fiscalizaciones",
        "Auditoría preventiva",
        "Representación legal",
        "Negociación de multas",
        "Seguimiento del proceso"
      ],
      icon: <Gavel className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-orange-500/3 to-red-500/5" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3.5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-orange-500/15 to-red-500/10 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Soluciones Corporativas
              </span>
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Servicios de alto valor para empresas que buscan protección legal integral y asesoría estratégica.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumServices.map((service, index) => (
            <div 
              key={index} 
              className="animate-scale-in service-card-mobile"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <ServiceCard {...service} onAgendarClick={onAgendarClick} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SpecializedGrid: React.FC<{ onAgendarClick: (service: ServiceCard) => void }> = ({ onAgendarClick }) => {
  const specializedServices: ServiceCard[] = [
    {
      title: "Derecho Laboral",
      description: "Defensa especializada de los derechos de los trabajadores con máxima indemnización.",
      price: "$35.000",
      features: [
        "Evaluación del caso",
        "Cálculo de indemnización",
        "Representación legal",
        "Negociación con empleador",
        "Seguimiento completo"
      ],
      icon: <Briefcase className="w-6 h-6 text-primary" />
    },
    {
      title: "Derecho Familia",
      description: "Asesoría especializada en pensiones de alimentos, custodia y divorcios.",
      price: "$25.000",
      features: [
        "Evaluación del caso",
        "Cálculo de pensión",
        "Representación legal",
        "Mediación familiar",
        "Seguimiento judicial"
      ],
      icon: <Heart className="w-6 h-6 text-primary" />,
      href: "/familia"
    },
    {
      title: "Herencias & Sucesiones",
      description: "Procesos sucesorios completos con asesoría especializada en herencias.",
      price: "$30.000",
      features: [
        "Evaluación de la herencia",
        "Inventario de bienes",
        "Representación legal",
        "Tramitación judicial",
        "Distribución de bienes"
      ],
      icon: <ScrollText className="w-6 h-6 text-primary" />,
      href: "/herencias"
    },
    {
      title: "Protección de Datos",
      description: "Cumplimiento de la LGPD y protección de datos personales para empresas.",
      price: "$35.000",
      features: [
        "Auditoría de datos",
        "Políticas de privacidad",
        "Implementación LGPD",
        "Capacitación del equipo",
        "Seguimiento continuo"
      ],
      icon: <Lock className="w-6 h-6 text-primary" />,
      href: "/proteccion-datos"
    },
    {
      title: "E-Commerce",
      description: "Asesoría legal especializada para negocios digitales y comercio electrónico.",
      price: "$40.000",
      features: [
        "Términos y condiciones",
        "Políticas de privacidad",
        "Contratos de venta",
        "Cumplimiento normativo",
        "Protección de marca"
      ],
      icon: <ShoppingCart className="w-6 h-6 text-primary" />,
      href: "/ecommerce"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/3 via-orange-500/2 to-red-500/3" />
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-orange-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-orange-500/15 to-red-500/10 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Scale className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Soluciones Especializadas
              </span>
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Servicios especializados en áreas específicas del derecho con expertos dedicados.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specializedServices.map((service, index) => (
            <div 
              key={index} 
              className="animate-scale-in service-card-mobile"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <ServiceCard {...service} onAgendarClick={onAgendarClick} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExpressGrid: React.FC<{ onAgendarClick: (service: ServiceCard) => void }> = ({ onAgendarClick }) => {
  const expressServices: ServiceCard[] = [
    {
      title: "Contratos Express",
      description: "Contratos profesionales en 24 horas con garantía de calidad y cumplimiento legal.",
      price: "$20.000",
      features: [
        "Contrato en 24 horas",
        "Revisión legal completa",
        "Personalización total",
        "Garantía de calidad",
        "Soporte post-entrega"
      ],
      icon: <FileCheck className="w-6 h-6 text-primary" />,
      href: "/contratos-express"
    },
    {
      title: "Sociedades Express",
      description: "Constitución rápida de sociedades comerciales con todos los trámites incluidos.",
      price: "$30.000",
      features: [
        "Constitución en 48 horas",
        "Todos los trámites incluidos",
        "Asesoría completa",
        "Documentación lista",
        "Seguimiento post-constitución"
      ],
      icon: <Building className="w-6 h-6 text-primary" />,
      href: "/sociedades-express"
    },
    {
      title: "Marcas & Patentes",
      description: "Registro de marcas comerciales y patentes con protección legal integral.",
      price: "$40.000",
      features: [
        "Búsqueda de anterioridad",
        "Registro de marca",
        "Protección legal",
        "Seguimiento del proceso",
        "Renovación automática"
      ],
      icon: <Crown className="w-6 h-6 text-primary" />,
      href: "/marcas-patentes"
    },
    {
      title: "Reclamos SERNAC",
      description: "Defensa del consumidor y reclamos ante SERNAC con máxima efectividad.",
      price: "$18.000",
      features: [
        "Evaluación del reclamo",
        "Presentación ante SERNAC",
        "Representación legal",
        "Seguimiento del proceso",
        "Negociación de solución"
      ],
      icon: <Gavel className="w-6 h-6 text-primary" />,
      href: "/reclamos-sernac"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/3 via-orange-500/2 to-amber-400/3" />
      <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-red-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 via-orange-500/15 to-amber-400/10 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Zap className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Soluciones Express
              </span>
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Servicios rápidos y eficientes para necesidades legales urgentes con resultados garantizados.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expressServices.map((service, index) => (
            <div 
              key={index} 
              className="animate-scale-in service-card-mobile"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <ServiceCard {...service} onAgendarClick={onAgendarClick} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesPage: React.FC = () => {
  // Eliminar estados de modal ya que siempre redirigimos
  const handleAgendarClick = (service: ServiceCard) => {
    // Siempre redirigir a AgendamientoPage para experiencia unificada
    const serviceMap: { [key: string]: string } = {
      'Legal Health Check Corporativo': 'premium',
      'Escudo Legal Mensual': 'corporativo',
      'M&A Express': 'ma-express',
      'Compliance & Protección Datos': 'compliance',
      'Defensa Fiscalizaciones & DT': 'fiscalizacion',
      'Derecho Laboral': 'laboral',
      'Derecho Familia': 'familia',
      'Herencias & Sucesiones': 'herencias',
      'Protección de Datos': 'proteccion-datos',
      'E-Commerce': 'ecommerce',
      'Contratos Express': 'contratos-express',
      'Sociedades Express': 'sociedades-express',
      'Marcas & Patentes': 'marcas-patentes',
      'Reclamos SERNAC': 'reclamos-sernac'
    };
    const plan = serviceMap[service.title] || 'premium';
    window.location.href = `/agendamiento?plan=${plan}`;
  };

  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <SEO 
        title="Servicios Legales Premium"
        description="Servicios legales premium para empresas y particulares. Consultoría especializada, auditorías legales, compliance y asesoría estratégica."
        keywords="servicios legales, consultoría jurídica, auditoría legal, compliance, derecho corporativo"
        type="website"
      />
      
      <div className="min-h-screen bg-background">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <Header />
          <div className="pt-20">
            <PremiumGrid onAgendarClick={handleAgendarClick} />
            <SpecializedGrid onAgendarClick={handleAgendarClick} />
            <ExpressGrid onAgendarClick={handleAgendarClick} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MobileLayout>
            <PremiumGrid onAgendarClick={handleAgendarClick} />
            <SpecializedGrid onAgendarClick={handleAgendarClick} />
            <ExpressGrid onAgendarClick={handleAgendarClick} />
          </MobileLayout>
        </div>

        {/* Sistema unificado: Todo redirige a AgendamientoPage */}
      </div>
    </>
  );
};

export default ServicesPage; 