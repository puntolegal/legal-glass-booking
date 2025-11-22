import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Scroll automático al cambiar de ruta
  useEffect(() => {
    // Scroll inmediato al top cuando cambia la ruta
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Sin animación para que sea instantáneo
    });
    
    // Pequeño delay adicional para asegurar que carga arriba
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // Se ejecuta cada vez que cambia la ruta

  // Control de visibilidad del botón
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="hidden lg:flex fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1d1d1f]/80 dark:bg-stone-700/80 backdrop-blur-2xl border border-white/20 dark:border-white/5 text-white shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
      title="Volver al inicio"
    >
      <ChevronUp className="w-5 h-5 mx-auto" strokeWidth={1.5} />
    </motion.button>
  );
};

export default ScrollToTop; 