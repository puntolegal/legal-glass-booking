const Footer = () => {
  return (
    <footer id="contacto" className="py-16 px-6">
      {/* Modern Footer with enhanced glass effect */}
      <div className="glass-intense backdrop-blur-xl bg-gradient-to-br from-background/95 to-background/85 rounded-3xl shadow-2xl border border-primary/20 p-8 md:p-16 mx-auto max-w-7xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo y descripción */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-2xl font-bold text-foreground">Punto Legal</span>
              </div>
              <p className="text-muted-foreground mb-6 text-justify">
                Especialistas en derecho laboral con más de 10 años de experiencia defendiendo los derechos de los trabajadores en Chile.
              </p>
              
              {/* Redes sociales con estilo consistente */}
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/puntolegalchile" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                  </svg>
                </a>
                
                <a 
                  href="mailto:puntolegalelgolf@gmail.com"
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v.273L12 8.364l6.545-4.27v-.273h3.819c.904 0 1.636.732 1.636 1.636z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://wa.me/56962321883"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Servicios */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Servicios</h3>
              <ul className="space-y-3">
                <li><a href="/laboral" className="text-muted-foreground hover:text-primary transition-colors">Derecho Laboral</a></li>
                <li><a href="/familia" className="text-muted-foreground hover:text-primary transition-colors">Derecho de Familia</a></li>
                <li><a href="/herencias" className="text-muted-foreground hover:text-primary transition-colors">Herencias y Testamentos</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a 
                    href="mailto:puntolegalelgolf@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    puntolegalelgolf@gmail.com
                  </a>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a 
                    href="tel:+56962321883"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +569 6232 1883
                  </a>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-3 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-muted-foreground">
                    Metro el Golf,<br />Santiago, Chile
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Línea divisoria y copyright */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                © 2024 Punto Legal. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Términos de Servicio
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Aviso Legal
                </a>
                <a 
                  href="/admin" 
                  className="text-muted-foreground hover:text-primary transition-colors opacity-30 hover:opacity-100"
                  title="Panel de Administración"
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced navigation bar with consistent styling */}
      <div className="glass-intense backdrop-blur-xl bg-gradient-to-r from-background/90 to-background/95 rounded-3xl shadow-2xl border border-primary/20 p-8 md:p-12 mx-auto max-w-4xl my-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Punto Legal</span>
          </div>
          {/* Menú navegación */}
          <nav className="flex flex-wrap gap-4 items-center justify-center">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</a>
            <a href="/laboral" className="text-muted-foreground hover:text-primary transition-colors">Laboral</a>
            <a href="/familia" className="text-muted-foreground hover:text-primary transition-colors">Familia</a>
            <a href="/herencias" className="text-muted-foreground hover:text-primary transition-colors">Herencias</a>
            <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a>
            <a href="#contacto" className="text-muted-foreground hover:text-primary transition-colors">Contacto</a>
            <a href="#" className="text-primary font-semibold hover:underline">Agendar Ahora</a>
          </nav>
          {/* Contactos */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="tel:+56912345678" className="flex items-center hover:text-primary transition-colors">📞 +56 9 1234 5678</a>
            <a href="mailto:contacto@puntolegal.cl" className="flex items-center hover:text-primary transition-colors">✉️ contacto@puntolegal.cl</a>
            <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary transition-colors">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;