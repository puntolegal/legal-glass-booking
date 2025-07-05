interface Service {
  title: string;
  description: string;
  icon: string;
  price?: string;
}

interface ServicesSectionProps {
  title?: string;
  services?: Service[];
}

const ServicesSection = ({ title = "Nuestros Servicios", services }: ServicesSectionProps) => {
  const defaultServices = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Tutela de Derechos Fundamentales",
      description: "Protección ante vulneraciones de derechos fundamentales en el trabajo como discriminación, acoso laboral o mobbing.",
      features: ["Discriminación laboral", "Acoso en el trabajo", "Protección de derechos"],
      price: "$110.000"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Nulidad del Despido",
      description: "Asesoría especializada cuando el despido no siguió los procedimientos legales establecidos por el código laboral.",
      features: ["Procedimientos incorrectos", "Falta de notificación", "Defensa legal completa"],
      price: "$110.000"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Asesoría Ley Karin",
      description: "Asesoría especializada en casos de acoso laboral, sexual y violencia en el trabajo según la Ley Karin.",
      features: ["Acoso laboral", "Acoso sexual", "Violencia laboral"],
      price: "$45.000"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Derecho de Familia",
      description: "Asesoría integral en temas familiares, divorcios y pensiones alimenticias.",
      features: ["Divorcios", "Pensiones alimenticias", "Derecho familiar"],
      price: "Desde $150.000"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Herencias y Testamentos",
      description: "Gestión completa de procesos sucesorios, testamentos y particiones.",
      features: ["Testamentos ($1.200.000)", "Partición de herencia (2%)", "Procesos sucesorios"],
      price: "Variable"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Pensiones de Alimentos",
      description: "Tramitación y gestión de pensiones alimenticias para menores y cónyuges.",
      features: ["Demandas de alimentos", "Modificaciones", "Cumplimiento"],
      price: "$640.000"
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
    <section id="servicios" className="py-20 px-6 relative overflow-hidden">
      {/* 3D Copper Ball Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src="/lovable-uploads/208a984c-a991-439e-9065-377f14a69080.png" 
          alt="3D Copper Ball" 
          className="absolute bottom-10 right-10 w-80 h-80 opacity-15 animate-float"
          style={{ animationDelay: '0.5s' }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Especialistas en derecho laboral con amplia experiencia en casos de despido 
            y vulneración de derechos laborales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <div key={index} className="group relative">
              {/* iPhone Widget-style card with advanced glassmorphism */}
              <div className="relative group">
                <div className="glass-intense rounded-[28px] p-6 hover:scale-[1.02] transition-all duration-500 border border-orange-500/20 hover:border-orange-400/40 bg-gradient-to-br from-orange-500/5 via-card/40 to-orange-400/5 backdrop-blur-2xl shadow-2xl hover:shadow-orange-500/20 overflow-hidden">
                  
                  {/* Background gradient orb */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-full blur-xl opacity-60" />
                  
                  {/* Header with icon and price */}
                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <div className="text-white scale-110">
                        {service.icon}
                      </div>
                    </div>
                    {service.price && (
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 backdrop-blur-sm">
                        <span className="text-orange-400 font-bold text-sm">{service.price}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-3 leading-tight">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  
                  {/* Features with compact design */}
                  <div className="space-y-2">
                    {service.features.slice(0, 3).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-500/5 transition-colors">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                        </div>
                        <span className="text-muted-foreground text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Hover effects */}
                  <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 pointer-events-none" />
                  <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-inner shadow-orange-500/10 pointer-events-none" />
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