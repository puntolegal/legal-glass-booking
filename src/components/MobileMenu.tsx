import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MessageCircle } from "lucide-react";

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
    { name: "Blog", href: "#blog", bullet: "●" },
    { name: "Contacto", href: "#contacto", bullet: "●" },
  ];

  const expressServices = [
    { name: "🚀 Contratos Express", href: "/contratos-express" },
    { name: "🏢 Sociedades Express", href: "/sociedades-express" },
    { name: "® Marcas & Patentes", href: "/marcas-patentes" },
    { name: "🛡️ Reclamos SERNAC", href: "/reclamos-sernac" },
  ];

  const specializedServices = [
    { name: "⚖️ Derecho Laboral", href: "/servicios/laboral" },
    { name: "🏢 Derecho Corporativo", href: "/servicios/corporativo" },
    { name: "👨‍👩‍👧‍👦 Derecho Familia", href: "/servicios/familia" },
    { name: "📜 Herencias", href: "/herencias" },
    { name: "🏠 Derecho Inmobiliario", href: "/servicios/inmobiliario" },
    { name: "📄 Derecho Civil", href: "/servicios/civil" },
    { name: "🛡️ Derecho Penal", href: "/servicios/penal" },
    { name: "💰 Derecho Tributario", href: "/servicios/tributario" },
    { name: "⚠️ Derecho Penal Económico", href: "/servicios/penal-economico" },
    { name: "💻 Derecho Digital", href: "/servicios/digital" },
    { name: "🔒 Protección Datos", href: "/proteccion-datos" },
    { name: "🛒 E-Commerce", href: "/ecommerce-compliance" },
  ];

  return (
    <>
      {/* Hamburger Button - Dark Tech Style */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className={`lg:hidden z-50 relative w-10 h-10 rounded-xl border border-gray-200/50 backdrop-blur-sm transition-all duration-200 ${
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

      {/* Mobile Sidebar - Dark Tech responsive width */}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[320px] min-w-[280px] z-50 transform transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] lg:hidden ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="h-full glass-intense backdrop-blur-xl bg-gradient-to-b from-background/90 to-background/95 border-r border-gray-200/20 rounded-r-2xl shadow-2xl overflow-hidden flex flex-col">
          
          {/* Header with close button */}
          <div className="p-4 sm:p-6 border-b border-gray-200/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-sm sm:text-lg">P</span>
                </div>
                <span className="text-base sm:text-lg font-medium text-foreground">Punto Legal</span>
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
          <nav className="p-4 sm:p-6 flex-1 overflow-y-auto scrollbar-mobile">
            {/* Main Navigation */}
            <div className="space-y-1 sm:space-y-2 mb-6">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-secondary-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 relative text-sm sm:text-base"
                  onClick={toggleMenu}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-primary/5 to-transparent" />
                </a>
              ))}
            </div>

            {/* Express Services */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-wide mb-3 px-3">Servicios Express</h4>
              <div className="space-y-1">
                {expressServices.map((service) => (
                  <a
                    key={service.name}
                    href={service.href}
                    className="group flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 relative text-sm"
                    onClick={toggleMenu}
                  >
                    <div className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0" />
                    <span className="font-medium">{service.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Specialized Services */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-wide mb-3 px-3">Servicios Especializados</h4>
              <div className="space-y-1">
                {specializedServices.map((service) => (
                  <a
                    key={service.name}
                    href={service.href}
                    className="group flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 relative text-sm"
                    onClick={toggleMenu}
                  >
                    <div className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="font-medium">{service.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* CTA Button - Neón Orange */}
            <div className="mt-4 sm:mt-8">
              <Button
                onClick={() => {
                  onAgendarClick?.();
                  toggleMenu();
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base"
              >
                Agendar Ahora - $15.000
              </Button>
            </div>
          </nav>

          {/* Contact Links - Bottom section */}
          <div className="p-4 sm:p-6 border-t border-gray-200/10 bg-background/30 flex-shrink-0">
            <div className="space-y-2 sm:space-y-3">

              <a
                href="mailto:puntolegalelgolf@gmail.com"
                className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="truncate">Email</span>
              </a>
              <a
                href="https://wa.me/56962321883"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="truncate">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;