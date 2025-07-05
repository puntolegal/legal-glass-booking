import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MobileMenu from "./MobileMenu";
import DarkModeToggle from "./DarkModeToggle";

const Header = ({ onAgendarClick }: { onAgendarClick?: () => void }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
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
              {user ? (
                <>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={onAgendarClick}
                    className="btn-glow"
                  >
                    Agendar Ahora
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/admin")}
                    className="glass border border-white/20 hover:bg-white/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Panel
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={signOut}
                    className="glass border border-white/20 hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="glass border border-white/20 hover:bg-white/10"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="btn-glow"
                  >
                    Registrarse
                  </Button>
                </>
              )}
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