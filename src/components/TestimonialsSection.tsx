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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.03] to-transparent"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
              Casos de Éxito
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Testimonios reales de clientes que obtuvieron resultados favorables con nuestra asesoría legal especializada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group glass-ios-card-dark relative p-7 lg:p-8 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-lg text-slate-100 group-hover:text-sky-300 transition-colors duration-300">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-slate-400">{testimonial.role}</p>
              </div>

              <div className="flex mb-6 gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-slate-300 mb-6 italic leading-relaxed text-sm lg:text-base">
                "{testimonial.testimonial}"
              </blockquote>

              <div className="border-t border-white/10 pt-4">
                <span className="text-sm font-semibold text-sky-300 bg-sky-500/10 border border-sky-400/20 px-3 py-1 rounded-full">
                  {testimonial.case}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="glass-ios-panel-dark p-8 lg:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-slate-100">
              ¿Necesitas asesoría legal?
            </h3>
            <p className="text-slate-300 mb-8 text-base lg:text-lg">
              Únete a las cientos de personas que han ganado con nuestra ayuda.
            </p>
            <div className="flex justify-center">
              <a
                href="#servicios"
                className="cta-primary px-8 py-4 text-base lg:text-lg"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("servicios");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agendar mi consulta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
