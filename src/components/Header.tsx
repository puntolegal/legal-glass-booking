import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";
import DarkModeToggle from "./DarkModeToggle";

const Header = ({ onAgendarClick }: { onAgendarClick?: () => void }) => {
  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">Punto Legal</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Inicio
              </a>
              <div className="relative group">
                <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Servicios
                </span>
                <div className="absolute top-full left-0 mt-2 glass-intense rounded-lg p-4 min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 animate-calendar-pop">
                  <a href="/laboral" className="block text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded hover:bg-primary/10">
                    Derecho Laboral
                  </a>
                  <a href="/familia" className="block text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded hover:bg-primary/10">
                    Derecho de Familia
                  </a>
                  <a href="/herencias" className="block text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded hover:bg-primary/10">
                    Herencias y Testamentos
                  </a>
                </div>
              </div>
              <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">
                Blog
              </a>
              <a href="#contacto" className="text-muted-foreground hover:text-primary transition-colors">
                Contacto
              </a>
              <Button 
                variant="primary" 
                size="sm"
                onClick={onAgendarClick}
                className="btn-glow"
              >
                Agendar Ahora
              </Button>
            </nav>

            <DarkModeToggle />
            <MobileMenu onAgendarClick={onAgendarClick} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;