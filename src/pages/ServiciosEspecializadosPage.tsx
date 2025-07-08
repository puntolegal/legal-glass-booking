          rating: 5
        }
      ],
      blogPosts: [
        {
          title: "Despido injustificado: qué hacer paso a paso",
          excerpt: "Guía práctica para enfrentar un despido injustificado...",
          href: "/blog/despido-injustificado"
        },
        {
          title: "Cálculo de indemnización laboral",
          excerpt: "Aprende a calcular correctamente tu indemnización...",
          href: "/blog/calculo-indemnizacion"
        }
      ]
    },
    {
      title: "Derecho Sucesorio",
      description: "Procesos sucesorios completos con planificación patrimonial estratégica.",
      price: "$30.000",
      features: [
        "Procesos sucesorios",
        "Testamentos y herencias",
        "Planificación patrimonial",
        "División de bienes",
        "Asesoría fiscal"
      ],
      icon: <ScrollText className="w-6 h-6 text-primary" />,
      badge: "ESPECIALIZADO",
      href: "/herencias",
      testimonials: [
        {
          name: "Patricia López",
          text: "Proceso sucesorio muy bien manejado. Transparente y eficiente.",
          rating: 5
        },
        {
          name: "Fernando Torres",
          text: "Excelente asesoría en planificación patrimonial para mi familia.",
          rating: 5
        }
      ],
      blogPosts: [
        {
          title: "Testamentos: tipos y consideraciones legales",
          excerpt: "Todo sobre testamentos en Chile y cómo proteger tu patrimonio...",
          href: "/blog/testamentos-chile"
        },
        {
          title: "Proceso sucesorio: guía completa",
          excerpt: "Pasos detallados para un proceso sucesorio exitoso...",
          href: "/blog/proceso-sucesorio"
        }
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Servicios Especializados - Punto Legal"
        description="Servicios especializados en derecho de familia, laboral y sucesorio. Asesoría legal experta con más de 10 años de experiencia."
        keywords="derecho familia, derecho laboral, derecho sucesorio, abogado especializado, asesoría legal"
        type="website"
      />
      
      <div className="min-h-screen bg-background">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <Header />
          <div className="pt-20">
            <div className="container mx-auto px-4 py-16">
              {/* Header de la página */}
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-400/20 via-cyan-500/15 to-blue-600/10 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Scale className="w-8 h-8 text-blue-500" />
                  </div>
                  <h1 className="text-5xl font-bold">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                      Servicios Especializados
                    </span>
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Áreas de práctica especializadas con enfoque en resultados y satisfacción del cliente. 
                  Más de 10 años de experiencia en derecho de familia, laboral y sucesorio.
                </p>
              </div>

              {/* Grid de servicios */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {specializedServices.map((service, index) => (
                  <div 
                    key={index} 
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <ServiceCard {...service} onAgendarClick={handleAgendarClick} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MobileLayout>
            <div className="container mx-auto px-4 py-8">
              {/* Header de la página */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400/20 via-cyan-500/15 to-blue-600/10 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Scale className="w-6 h-6 text-blue-500" />
                  </div>
                  <h1 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                      Servicios Especializados
                    </span>
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Áreas de práctica especializadas con enfoque en resultados y satisfacción del cliente.
                </p>
              </div>

              {/* Grid de servicios */}
              <div className="space-y-6">
                {specializedServices.map((service, index) => (
                  <div 
                    key={index} 
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <ServiceCard {...service} onAgendarClick={handleAgendarClick} />
                  </div>
                ))}
              </div>
            </div>
          </MobileLayout>
        </div>

        {/* Formulario de Agendamiento */}
        {showForm && selectedService && (
          <ReservationForm 
            serviceName={selectedService.title}
            servicePrice={selectedService.price}
            onClose={handleCloseForm}
            isModal={true}
          />
        )}
      </div>
    </>
  );
};

export default ServiciosEspecializadosPage; 