interface Service {
  title: string;
  description: string;
  icon: string;
  regularPrice?: string;
  promoPrice?: string;
  price?: string;
}

interface ServicesSectionProps {
  title?: string;
  services?: Service[];
  onAgendarClick?: (service: { title: string; promoPrice?: string; price?: string }) => void;
}

const ServicesSection = ({ title = "Elige el servicio legal que necesitas", services, onAgendarClick }: ServicesSectionProps) => {
  const defaultServices = [
    // Derecho Laboral
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Punto Legal Laboral",
      description: "Protección ante vulneraciones de derechos fundamentales, despidos y asesoría Ley Karin.",
      features: ["Tutela de derechos", "Nulidad del despido", "Ley Karin"],
      regularPrice: "$60.000",
      promoPrice: "$30.000"
    },
    // Derecho de Familia
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Punto Legal Familia",
      description: "Asesoría integral en divorcios, pensiones alimenticias y temas familiares.",
      features: ["Divorcios", "Pensiones alimenticias", "Mediación familiar"],
      regularPrice: "$60.000",
      promoPrice: "$30.000"
    },
    // Herencias y Sucesiones
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Punto Legal Sucesorio",
      description: "Gestión completa de herencias, testamentos y trámites sucesorios.",
      features: ["Testamentos", "Posesión efectiva", "Particiones"],
      regularPrice: "$60.000",
      promoPrice: "$30.000"
    },
    // Inmobiliario
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0zm8 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-4 4h4" />
        </svg>
      ),
      title: "Punto Legal Inmobiliario",
      description: "Contratos de compraventa, arrendamientos, desalojos y litigios inmobiliarios.",
      features: ["Compraventas", "Arrendamientos", "Desalojos"],
      regularPrice: "$55.000",
      promoPrice: "$27.500"
    },
    // Empresarial
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Punto Legal Empresarial",
      description: "Constitución de sociedades, modificaciones estatutarias y compliance corporativo.",
      features: ["Constitución de sociedades", "Modificaciones", "Compliance"],
      regularPrice: "$90.000",
      promoPrice: "$45.000"
    },
    // Contratos
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Punto Legal Contratos",
      description: "Redacción express de contratos de servicios, NDA, licencias y franquicias.",
      features: ["Contratos de servicios", "NDA", "Licencias"],
      regularPrice: "$30.000",
      promoPrice: "$15.000"
    },
    // Administración Pública
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      title: "Punto Legal Administración Pública",
      description: "Impugnación de multas, recursos y defensa en fiscalizaciones administrativas.",
      features: ["Impugnación multas", "Recursos", "Fiscalizaciones"],
      regularPrice: "$50.000",
      promoPrice: "$25.000"
    },
    // Tributario
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Punto Legal Tributario",
      description: "Asesoría fiscal, planificación tributaria y recursos contra liquidaciones del SII.",
      features: ["Planificación fiscal", "Recursos SII", "Optimización"],
      regularPrice: "$60.000",
      promoPrice: "$30.000"
    },
    // Compliance & Riesgo
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Punto Legal Compliance",
      description: "Programas de cumplimiento, políticas internas y gestión de riesgos corporativos.",
      features: ["Programas compliance", "Auditorías", "Políticas internas"],
      regularPrice: "$80.000",
      promoPrice: "$40.000"
    },
    // Migratorio
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5a2 2 0 002 2h1a2 2 0 012 2 2 2 0 002 2v1.995M15 8.5V11M12 8V12M16 12h3M8 12L5 9l3-3" />
        </svg>
      ),
      title: "Punto Legal Migratorio",
      description: "Visas de trabajo y residencia, reagrupación familiar y recursos migratorios.",
      features: ["Visas de trabajo", "Residencia", "Reagrupación familiar"],
      regularPrice: "$55.000",
      promoPrice: "$27.500"
    },
    // Propiedad Intelectual
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Punto Legal Propiedad Intelectual",
      description: "Registro de marcas y patentes, derechos de autor y defensa contra infracciones.",
      features: ["Registro marcas", "Patentes", "Derechos de autor"],
      regularPrice: "$65.000",
      promoPrice: "$32.500"
    },
    // Protección del Consumidor
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "Punto Legal Consumidor",
      description: "Reclamos ante SERNAC, defensa en juicios y asesoría en cláusulas abusivas.",
      features: ["Reclamos SERNAC", "Garantías", "Cláusulas abusivas"],
      regularPrice: "$45.000",
      promoPrice: "$22.500"
    },
    // Penal Económico
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: "Punto Legal Penal Económico",
      description: "Defensa en delitos económicos, societarios y acuerdos de colaboración.",
      features: ["Delitos económicos", "Defensa penal", "Colaboración eficaz"],
      regularPrice: "$90.000",
      promoPrice: "$45.000"
    }
  ];

  // Función para renderizar el icono basado en string
  const renderIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      briefcase: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8" />
        </svg>
      ),
      shield: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      scale: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      "heart-crack": (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      users: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      baby: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0v16l9-9V4" />
        </svg>
      ),
      scroll: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      "file-text": (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      "check-circle": (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return iconMap[iconName] || iconMap.briefcase;
  };

  // Si services viene con iconos string, los convertimos
  const servicesList = services ? services.map(service => ({
    ...service,
    icon: renderIcon(service.icon),
    features: ["Asesoría especializada", "Seguimiento del caso", "Defensa legal completa"],
    price: service.price
  })) : defaultServices;

  return (
    <section id="servicios" className="py-8 lg:py-16 px-4 relative overflow-hidden">
      {/* 3D Copper Ball Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src="/lovable-uploads/208a984c-a991-439e-9065-377f14a69080.png" 
          alt="3D Copper Ball" 
          className="absolute bottom-10 right-10 w-60 h-60 lg:w-80 lg:h-80 opacity-15 animate-float"
          style={{ animationDelay: '0.5s' }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Sesiones de 45 minutos con abogados especializados. Oferta de lanzamiento: 50% de descuento.
            <span className="block text-xs sm:text-sm mt-2 text-primary">Pago seguro y reunión inmediata por Google Meet</span>
          </p>
        </div>

        {/* Mobile-first horizontal scroll-snap cards - Optimizado */}
        <div className="block md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {servicesList.map((service, index) => (
              <div key={index} className="flex-none w-72 snap-start">
                <div className="glass rounded-2xl p-4 h-full border border-primary/10 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]">
                  
                {/* Header with icon and title Mobile - Optimizado */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                    <div className="text-white scale-75">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-tight">
                    {service.title}
                  </h3>
                </div>

                {/* Price and CTA Mobile - Optimizado */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    {service.regularPrice && service.promoPrice ? (
                      <>
                        <div className="text-xs text-muted-foreground line-through opacity-60">
                          {service.regularPrice}
                        </div>
                        <div className="text-primary font-bold text-base">
                          {service.promoPrice}
                        </div>
                      </>
                    ) : service.price && (
                      <div className="text-primary font-bold text-sm">
                        {service.price}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Oferta por tiempo limitado
                    </div>
                  </div>
                  <button 
                    onClick={() => onAgendarClick?.(service)}
                    className="glass bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80 text-white px-3 py-2 rounded-lg text-xs font-medium hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/20"
                  >
                    Agendar
                  </button>
                </div>
                  
                  {/* Description - Optimizado */}
                  <p className="text-secondary-foreground mb-3 text-xs leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features list - Optimizado */}
                  <div className="space-y-1">
                    {service.features.slice(0, 3).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-secondary-foreground text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid layout - Optimizado */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {servicesList.map((service, index) => (
            <div key={index} className="group">
              <div className="glass rounded-2xl lg:rounded-3xl p-4 lg:p-6 h-full border border-primary/10 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5">
                
                {/* Header with icon - Optimizado */}
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                    <div className="text-white scale-90 lg:scale-100">
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Price display - Optimizado */}
                  <div className="text-right">
                    {service.regularPrice && service.promoPrice ? (
                      <div className="flex flex-col items-end">
                        <div className="text-xs text-muted-foreground line-through opacity-60">
                          {service.regularPrice}
                        </div>
                        <div className="text-primary font-bold text-base lg:text-lg">
                          {service.promoPrice}
                        </div>
                      </div>
                    ) : service.price && (
                      <div className="px-2 py-1 lg:px-3 lg:py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-primary font-bold text-xs lg:text-sm">{service.price}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Title - Optimizado */}
                <h3 className="text-lg lg:text-xl font-bold text-foreground mb-3 leading-tight">
                  {service.title}
                </h3>
                
                {/* Description - Optimizado */}
                <p className="text-secondary-foreground mb-3 lg:mb-4 text-xs lg:text-sm leading-relaxed">
                  {service.description}
                </p>
                
                {/* Features - Optimizado */}
                <div className="space-y-1 lg:space-y-2 mb-4 lg:mb-6">
                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 p-1 lg:p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-secondary-foreground text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button - Optimizado */}
                <div className="mt-auto">
                  <button 
                    onClick={() => onAgendarClick?.(service)}
                    className="glass bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80 text-white w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/20"
                  >
                    Agendar {service.title.replace('Punto Legal ', '')}
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
  );
};

export default ServicesSection;