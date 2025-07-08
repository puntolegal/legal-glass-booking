import { Button } from "@/components/ui/button";
import { Menu, X, Home, Briefcase, FileText, Phone, Mail, MessageCircle, Shield, Scale, Zap, Building, Lock, Gavel, Heart, ScrollText, ShoppingCart, Crown, FileCheck, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import DarkModeToggle from "./DarkModeToggle";
import { MobileFloatingNav } from "./MobileFloatingNav";

interface MobileLayoutProps {
  onAgendarClick?: () => void;
  children: React.ReactNode;
}

const navigationItems = [
  { title: "Inicio", href: "/", icon: Home },
  { title: "Blog", href: "#blog", icon: FileText },
  { title: "Contacto", href: "#contacto", icon: Phone },
];

const premiumServices = [
  { title: "Legal Health Check Corporativo", href: "/servicios/legal-health-check", icon: Shield, price: "$1.200.000" },
  { title: "Escudo Legal Mensual", href: "/servicios/escudo-legal", icon: Shield, price: "$800.000/mes" },
  { title: "M&A Express", href: "/servicios/ma-express", icon: Building, price: "$2.500.000" },
  { title: "Compliance & Protección Datos", href: "/servicios/compliance", icon: Lock, price: "$1.500.000" },
  { title: "Defensa Fiscalizaciones & DT", href: "/servicios/fiscalizaciones", icon: Gavel, price: "$900.000" },
];

const specializedServices = [
  { title: "Derecho Laboral", href: "/laboral", icon: Briefcase, price: "$35.000" },
  { title: "Derecho Familia", href: "/familia", icon: Heart, price: "$25.000" },
  { title: "Herencias & Sucesiones", href: "/herencias", icon: ScrollText, price: "$30.000" },
  { title: "Protección de Datos", href: "/proteccion-datos", icon: Lock, price: "$35.000" },
  { title: "E-Commerce", href: "/ecommerce-compliance", icon: ShoppingCart, price: "$40.000" },
];

const expressServices = [
  { title: "Contratos Express", href: "/contratos-express", icon: FileCheck, price: "$20.000" },
  { title: "Sociedades Express", href: "/sociedades-express", icon: Building, price: "$30.000" },
  { title: "Marcas & Patentes", href: "/marcas-patentes", icon: Crown, price: "$40.000" },
  { title: "Reclamos SERNAC", href: "/reclamos-sernac", icon: Gavel, price: "$18.000" },
];

const contactItems = [
  {
    title: "Llamar",
    href: "tel:+56962321883",
    icon: Phone,
    text: "+569 6232 1883"
  },
  {
    title: "Email",
    href: "mailto:puntolegalelgolf@gmail.com",
    icon: Mail,
    text: "Enviar correo"
  },
  {
    title: "WhatsApp",
    href: "https://wa.me/56962321883",
    icon: MessageCircle,
    text: "Chat directo"
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61575610732702",
    icon: "📘",
    text: "Síguenos"
  },
];

export const MobileLayout = ({ onAgendarClick, children }: MobileLayoutProps) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen || showContactPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, showContactPanel]);

  // Detectar si se puede navegar hacia atrás
  useEffect(() => {
    const hasHistory = window.history.length > 1;
    setCanGoBack(hasHistory && location.pathname !== '/');
  }, [location.pathname]);

  // Scroll automático al top cuando cambia la ruta (específico para móvil)
  useEffect(() => {
    // Asegurar scroll al top en móvil
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Delay adicional para asegurar carga correcta en móvil
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#contacto') {
      e.preventDefault();
      toggleSidebar();
      setShowContactPanel(true);
      return;
    }
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    toggleSidebar();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const ServiceSection = ({ title, services, icon: Icon, className = "" }: any) => (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-lg bg-primary/20 flex items-center justify-center">
          <Icon className="h-3 w-3 text-primary" />
        </div>
        <h3 className="text-primary font-semibold text-sm">{title}</h3>
      </div>
      <div className="space-y-1">
        {services.map((service: any) => (
          <a
            key={service.title}
            href={service.href}
            onClick={(e) => handleLinkClick(e, service.href)}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors"
          >
            <span className="text-sm font-medium truncate flex-1">{service.title}</span>
            {service.price && (
              <span className="text-xs text-primary font-semibold ml-2">{service.price}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Mobile Header Optimizado para modo oscuro */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo mejorado */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 border border-primary/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <span className="text-base font-bold text-foreground">Punto Legal</span>
              <div className="text-xs text-muted-foreground">Servicios Jurídicos</div>
            </div>
          </div>

          {/* Right Controls mejorados */}
          <div className="flex items-center space-x-2">
            {/* Botón de menú lateral */}
            <motion.button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Menu className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors duration-300" />
              </motion.div>
            </motion.button>
            
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Navegación Flotante Global - Solo botón de retroceso */}
      <MobileFloatingNav />

      {/* Overlay mejorado */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => toggleSidebar()}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 relative z-0">
        {children}
      </div>
    </div>
  );
};