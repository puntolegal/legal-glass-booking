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
      {/* Fondo premium con gradiente oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        {/* Header con ícono 3D centrado */}
        <div className="text-center mb-16">
          {/* Ícono 3D Premium */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="relative transform hover:scale-110 transition-all duration-700 ease-out">
                <img 
                  src="/lovable-uploads/0720b7af-ea4a-425a-ab11-f9d60e3d2bd1.png" 
                  alt="Casos de Éxito - Crecimiento" 
                  className="w-24 h-24 lg:w-32 lg:h-32 object-contain drop-shadow-2xl animate-float-premium"
                  loading="lazy"
                />
                
                {/* Efectos de brillo dorado */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-accent/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 animate-pulse"></div>
                
                {/* Reflejo metálico */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-br from-white/50 via-primary/40 to-transparent rounded-full blur-2xl opacity-60 animate-shimmer-premium"></div>
              </div>
              
              {/* Orbes flotantes decorativos */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full blur-sm opacity-80 animate-float-premium" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-br from-accent to-primary rounded-full blur-md opacity-60 animate-float-premium" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Casos de Éxito
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Testimonios reales de clientes que obtuvieron resultados favorables 
            con nuestra asesoría legal especializada
          </p>
        </div>

        {/* Grid de testimonios premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group glass rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 relative border border-white/10 hover:border-primary/30"
            >
              {/* Comillas decorativas premium */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              {/* Información del cliente */}
              <div className="mb-6">
                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>

              {/* Estrellas premium */}
              <div className="flex mb-6 gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24" style={{ transitionDelay: `${i * 50}ms` }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Testimonio */}
              <blockquote className="text-muted-foreground mb-6 italic leading-relaxed text-sm lg:text-base">
                "{testimonial.testimonial}"
              </blockquote>

              {/* Resultado del caso */}
              <div className="border-t border-primary/20 pt-4">
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {testimonial.case}
                </span>
              </div>

              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* CTA Final Premium */}
        <div className="text-center mt-16">
          <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-3xl mx-auto border border-primary/20 hover:border-primary/40 transition-all duration-500 group">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
              ¿Necesitas asesoría Legal?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Únete a los cientos de personas que han ganado con nuestra ayuda.
            </p>
            <div className="flex justify-center">
              <button 
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/60"
                onClick={() => {
                  // Redirigir a /agendamiento
                  window.location.href = '/agendamiento?plan=premium';
                  
                  // Scroll al top automático en móvil
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  }, 100);
                }}
              >
                <svg className="w-5 h-5 mr-2 inline group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agendar ahora una reunión - $35.000
                <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
                  <span className="block w-1/3 h-full bg-white/30 blur-lg animate-shimmer-premium"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;