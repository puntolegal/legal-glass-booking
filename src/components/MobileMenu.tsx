import { useState } from "react";
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

  const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Laboral", href: "/laboral" },
    { name: "Familia", href: "/familia" },
    { name: "Herencias", href: "/herencias" },
    { name: "Blog", href: "#blog" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="md:hidden z-50 relative glass border-0"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 glass-intense z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 pt-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">Punto Legal</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-lg text-muted-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/10"
                onClick={toggleMenu}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="mt-8">
            <Button
              variant="primary"
              className="w-full btn-glow"
              onClick={() => {
                onAgendarClick?.();
                toggleMenu();
              }}
            >
              Agendar Ahora
            </Button>
          </div>

          {/* Contact Links */}
          <div className="mt-8 space-y-3">
            <a
              href="tel:+56912345678"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              📞 +56 9 1234 5678
            </a>
            <a
              href="mailto:contacto@puntolegal.cl"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ✉️ contacto@puntolegal.cl
            </a>
            <a
              href="https://wa.me/56912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;