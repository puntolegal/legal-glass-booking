const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "María González",
      role: "Ejecutiva de Ventas",
      testimonial: "Excelente servicio. Me ayudaron a recuperar mi indemnización completa tras un despido injustificado. El proceso fue claro y transparente desde el inicio.",
      rating: 5,
      case: "Despido Injustificado - Recuperó $2.8M CLP"
    },
    {
      name: "Carlos Rodríguez",
      role: "Ingeniero Industrial",
      testimonial: "Profesionales muy competentes. Resolvieron mi caso de discriminación laboral de manera eficiente. Recomiendo sus servicios al 100%.",
      rating: 5,
      case: "Tutela de Derechos - Caso resuelto favorablemente"
    },
    {
      name: "Ana Martínez",
      role: "Administradora",
      testimonial: "Excelente asesoría legal. Me ayudaron a resolver mi caso de despido indebido de manera profesional y eficiente. El seguimiento fue excelente.",
      rating: 5,
      case: "Despido Indebido - Caso resuelto favorablemente"
    }
  ];

  return (
    <section id="casos-exito" className="py-20 px-6 relative overflow-hidden">
      {/* 3D Statistics Chart Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src="/lovable-uploads/7be4428e-26bd-43cc-998f-d5627977fb84.png" 
          alt="Success Statistics 3D Chart" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 animate-float"
          style={{ animationDelay: '1s' }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Casos de Éxito
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Testimonios reales de clientes que obtuvieron resultados favorables 
            con nuestra asesoría legal especializada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
            >
              {/* Comillas decorativas */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                "{testimonial.testimonial}"
              </blockquote>

              <div className="border-t border-white/10 pt-4">
                <span className="text-sm font-semibold text-primary">
                  {testimonial.case}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              ¿Listo para defender tus derechos laborales?
            </h3>
            <p className="text-muted-foreground mb-6">
              Únete a los cientos de trabajadores que han recuperado sus derechos con nuestra ayuda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="glass-intense bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 border border-orange-400/20 backdrop-blur-xl shadow-lg hover:shadow-xl"
                  onClick={() => {
                    const element = document.getElementById('inicio');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Agendar ahora una reunión - $15.000
                </button>
                <button 
                  className="glass px-8 py-3 rounded-lg border border-primary/30 hover:bg-primary/10 transition-colors"
                  onClick={() => {
                    const element = document.getElementById('casos-exito');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Contactar por WhatsApp
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;