import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-orange-600 hover:to-red-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
      size="icon"
      title="Volver al inicio"
    >
      <ChevronUp className="w-5 h-5" />
    </Button>
  );
};

export default ScrollToTop; 