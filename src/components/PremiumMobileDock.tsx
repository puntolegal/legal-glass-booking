import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Scale, 
  Phone, 
  Menu,
  X,
  ArrowLeft,
  Search,
  User,
  Accessibility,
  ArrowUp
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

interface PremiumMobileDockProps {
  className?: string;
}

export const PremiumMobileDock: React.FC<PremiumMobileDockProps> = ({ className = "" }) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si se puede navegar hacia atrás
  useEffect(() => {
    const hasHistory = window.history.length > 1;
    setCanGoBack(hasHistory && location.pathname !== '/');
  }, [location.pathname]);

  // Auto-hide on scroll (estilo iOS mejorado)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (currentScrollY + windowHeight) / documentHeight;
      
      // Mostrar dock al llegar al final de la página
      if (scrollPercentage >= 0.95) {
        setIsVisible(true);
      } else if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccessibilityClick = () => {
    // Simular click en el botón de accesibilidad
    const accessibilityButton = document.querySelector('[aria-label="Abrir panel de accesibilidad"]') as HTMLButtonElement;
    if (accessibilityButton) {
      accessibilityButton.click();
    }
  };

  const dockItems = [
    {
      icon: Home,
      label: 'Inicio',
      action: handleHomeClick,
      isActive: location.pathname === '/'
    },
    {
      icon: Calendar,
      label: 'Agendar',
      action: () => navigate('/agendamiento?plan=general'),
      isActive: location.pathname.includes('/agendamiento')
    },
    {
      icon: Scale,
      label: 'Servicios',
      action: () => navigate('/servicios'),
      isActive: location.pathname.includes('/servicios')
    },
    {
      icon: Phone,
      label: 'Contacto',
      action: () => {
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/#contacto');
        }
      },
      isActive: false
    }
  ];

  return (
    <>
      {/* Dock Principal - Estilo iOS Premium Optimizado */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              opacity: { duration: 0.3 }
            }}
            className={`lg:hidden fixed bottom-4 left-4 right-4 z-50 ${className}`}
          >
            {/* Dock Container - Glassmorphism Premium */}
            <div className="relative">
              {/* Glow Effect - Más sutil */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-500/15 to-orange-500/10 rounded-3xl blur-2xl" />
              
              {/* Main Dock - Reorganizado horizontalmente */}
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl border border-white/30 dark:border-gray-700/40 rounded-3xl px-3 py-2 shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between gap-2">
                  {/* Dock principal - 4 botones */}
                  <div className="flex items-center gap-0.5">
                    {dockItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={item.action}
                        className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                          item.isActive
                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mb-0.5" />
                        <span className="text-[10px] font-medium leading-none">{item.label}</span>
                        
                        {/* Active Indicator - Más elegante */}
                        {item.isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full shadow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Botones adicionales - Accesibilidad y Subir */}
                  <div className="flex items-center gap-2">
                    {/* Botón de Accesibilidad */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAccessibilityClick}
                      className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/10 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 flex items-center justify-center"
                      aria-label="Accesibilidad"
                    >
                      <Accessibility className="w-4 h-4" />
                    </motion.button>

                    {/* Botón de Subir */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleScrollToTop}
                      className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/10 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 flex items-center justify-center"
                      aria-label="Subir arriba"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de Menú Lateral - Esquina Superior Izquierda */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="lg:hidden fixed top-4 left-4 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className={`w-11 h-11 rounded-2xl backdrop-blur-2xl border shadow-xl transition-all duration-300 ${
            isOpen
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500/40 shadow-orange-500/30'
              : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 border-white/30 dark:border-gray-700/40 shadow-black/20 hover:bg-orange-50/60 hover:border-orange-200/40'
          }`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
              >
                <X className="w-4 h-4 mx-auto" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
              >
                <Menu className="w-4 h-4 mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Botón de Retroceder - Esquina Superior Derecha */}
      <AnimatePresence>
        {canGoBack && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="lg:hidden fixed top-4 right-4 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40 shadow-xl shadow-black/20 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
            >
              <ArrowLeft className="w-4 h-4 mx-auto" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de Búsqueda - Flotante cuando sea necesario */}
      {location.pathname.includes('/apuntes') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="lg:hidden fixed top-4 right-20 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40 shadow-xl shadow-black/20 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
          >
            <Search className="w-4 h-4 mx-auto" />
          </motion.button>
        </motion.div>
      )}

      {/* Usuario/Login - Solo en páginas corporativas */}
      {location.pathname.includes('/corporativo') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="lg:hidden fixed top-20 right-4 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40 shadow-xl shadow-black/20 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
          >
            <User className="w-4 h-4 mx-auto" />
          </motion.button>
        </motion.div>
      )}
    </>
  );
};

export default PremiumMobileDock;
