import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  onAgendarClick?: () => void;
}

const MobileMenu = ({ onAgendarClick }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { name: "Inicio", href: "/", bullet: "●" },
    { name: "Servicios", href: "#servicios", bullet: "●" },
    { name: "Blog", href: "#blog", bullet: "●" },
    { name: "Contacto", href: "#contacto", bullet: "●" },
  ];

  return (
    <>
      {/* Hamburger Button - Dark Tech Style */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className={`lg:hidden z-50 relative w-10 h-10 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-200 ${
          isOpen 
            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
            : 'bg-background/20 text-foreground hover:bg-primary/10 hover:border-primary/30'
        }`}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="h-5 w-5 transition-transform duration-200" />
        ) : (
          <Menu className="h-5 w-5 transition-transform duration-200" />
        )}
      </Button>

      {/* Overlay with dark tech blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-40 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Sidebar - Dark Tech 80% width */}
      <div
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-[280px] z-50 transform transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] lg:hidden ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="h-full glass-intense backdrop-blur-xl bg-gradient-to-b from-background/90 to-background/95 border-r border-border/20 rounded-r-3xl shadow-2xl overflow-hidden">
          
          {/* Header with close button */}
          <div className="p-6 border-b border-border/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-lg font-medium text-foreground">Punto Legal</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"
                aria-label="Cerrar menú"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Items - Dark Tech Style */}
          <nav className="p-6 flex-1">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center space-x-4 px-4 py-3 rounded-xl text-secondary-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 relative"
                  onClick={toggleMenu}
                >
                  <div className="w-2 h-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
                  <span className="font-medium">{item.name}</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-primary/5 to-transparent" />
                </a>
              ))}
            </div>

            {/* CTA Button - Neón Orange */}
            <div className="mt-8">
              <Button
                onClick={() => {
                  onAgendarClick?.();
                  toggleMenu();
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02]"
              >
                Agendar Ahora - $15.000
              </Button>
            </div>
          </nav>

          {/* Contact Links - Bottom section */}
          <div className="p-6 border-t border-border/10 bg-background/30">
            <div className="space-y-3">
              <a
                href="tel:+56962321883"
                className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-xs">📞</span>
                </div>
                <span>+569 6232 1883</span>
              </a>
              <a
                href="mailto:puntolegalelgolf@gmail.com"
                className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-xs">✉️</span>
                </div>
                <span>Email</span>
              </a>
              <a
                href="https://wa.me/56962321883"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-xs">💬</span>
                </div>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;