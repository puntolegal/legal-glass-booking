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
  User
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

  // Auto-hide on scroll (estilo iOS)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
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
      {/* Dock Principal - Estilo iOS Premium */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className={`lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
          >
            {/* Dock Container - Glassmorphism Premium */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl" />
              
              {/* Main Dock */}
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 rounded-2xl px-4 py-3 shadow-2xl shadow-black/10">
                <div className="flex items-center gap-1">
                  {dockItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={item.action}
                      className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                        item.isActive
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">{item.label}</span>
                      
                      {/* Active Indicator */}
                      {item.isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de Menú Lateral - Esquina Superior Izquierda */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:hidden fixed top-4 left-4 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className={`w-12 h-12 rounded-2xl backdrop-blur-xl border shadow-lg transition-all duration-200 ${
            isOpen
              ? 'bg-red-500 text-white border-red-500/30 shadow-red-500/20'
              : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/30 shadow-black/10'
          }`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-5 h-5 mx-auto" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="w-5 h-5 mx-auto" />
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
            className="lg:hidden fixed top-4 right-4 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/10 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
            >
              <ArrowLeft className="w-5 h-5 mx-auto" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de Búsqueda - Flotante cuando sea necesario */}
      {location.pathname.includes('/apuntes') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:hidden fixed top-4 right-20 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/10 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
          >
            <Search className="w-5 h-5 mx-auto" />
          </motion.button>
        </motion.div>
      )}

      {/* Usuario/Login - Solo en páginas corporativas */}
      {location.pathname.includes('/corporativo') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:hidden fixed top-20 right-4 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/10 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
          >
            <User className="w-5 h-5 mx-auto" />
          </motion.button>
        </motion.div>
      )}
    </>
  );
};

export default PremiumMobileDock;
