import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { trackMetaPageView } from '@/lib/metaPixel';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isFirstRoute = useRef(true);

  // Meta Pixel PageView en cambios de ruta (SPA). El primer load lo envía index.html.
  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    trackMetaPageView();
  }, [location.pathname]);

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
    <button
      onClick={handleClick}
      className="hidden lg:flex fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1d1d1f]/80 dark:bg-stone-700/80 backdrop-blur-2xl border border-white/20 dark:border-white/5 text-white shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 pl-anim-fade-in hover:scale-105 active:scale-95"
      title="Volver al inicio"
    >
      <ChevronUp className="w-5 h-5 mx-auto" strokeWidth={1.5} />
    </button>
  );
};

export default ScrollToTop; 