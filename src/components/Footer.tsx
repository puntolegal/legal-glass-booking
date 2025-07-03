const Footer = () => {
  return (
    <footer id="contacto" className="py-16 px-6 border-t border-white/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <a href="https://www.facebook.com/puntolegalchile" target="_blank" rel="noopener noreferrer" className="ml-2">
                <span className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                  </svg>
                </span>
              </a>
              <span className="text-xl font-bold text-foreground text-justify">Punto Legal</span>
            </div>
            <p className="text-muted-foreground mt-2 text-justify">
              Especialistas en derecho laboral con más de 10 años de experiencia defendiendo los derechos de los trabajadores en Chile.
            </p>
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
              <li className="flex items-center text-muted-foreground">
                <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                puntolegalelgolf@gmail.com
              </li>
              <li className="flex items-center text-muted-foreground">
                <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +569 6232 1883
              </li>
              <li className="flex items-start text-muted-foreground">
                <svg className="w-4 h-4 mr-3 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Metro el Golf,
                <br />
                Santiago, Chile
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
    </footer>
  );
};

export default Footer;