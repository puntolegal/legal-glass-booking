import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">Punto Legal</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-muted-foreground hover:text-primary transition-colors">
              Inicio
            </a>
            <a href="#servicios" className="text-muted-foreground hover:text-primary transition-colors">
              Servicios
            </a>
            <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">
              Blog
            </a>
            <a href="#contacto" className="text-muted-foreground hover:text-primary transition-colors">
              Contacto
            </a>
            <Button variant="primary" size="sm">
              Consulta Ahora
            </Button>
          </nav>

          <Button variant="ghost" className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;