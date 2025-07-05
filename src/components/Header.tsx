import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";

const Header = ({ onAgendarClick }: { onAgendarClick?: () => void }) => {
  return (
    <header className="hidden lg:block fixed top-0 w-full z-50 glass backdrop-blur-xl bg-background/90">
      <div className="px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Dark Tech Style */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-lg md:text-xl font-medium text-foreground">Punto Legal</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-6">
              <a href="/" className="text-secondary-foreground hover:text-primary transition-colors text-sm font-medium">
                Inicio
              </a>
              <div className="relative group">
                <span className="text-secondary-foreground hover:text-primary transition-colors cursor-pointer text-sm font-medium">
                  Servicios
                </span>
                <div className="absolute top-full left-0 mt-2 glass-intense rounded-xl p-3 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="/laboral" className="block text-secondary-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5 text-sm">
                    Derecho Laboral
                  </a>
                  <a href="/familia" className="block text-secondary-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5 text-sm">
                    Derecho de Familia
                  </a>
                  <a href="/herencias" className="block text-secondary-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5 text-sm">
                    Herencias y Testamentos
                  </a>
                </div>
              </div>
              <a href="#blog" className="text-secondary-foreground hover:text-primary transition-colors text-sm font-medium">
                Blog
              </a>
              <a href="#contacto" className="text-secondary-foreground hover:text-primary transition-colors text-sm font-medium">
                Contacto
              </a>
              <Button 
                onClick={onAgendarClick}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02]"
              >
                Agendar Ahora
              </Button>
            </nav>

            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;