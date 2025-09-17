import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import MobileMenu from './MobileMenu';
import { MobileFloatingNav } from './MobileFloatingNav';
import ApuntesHeader from './ApuntesHeader';

interface MobileLayoutProps {
  children: React.ReactNode;
  onAgendarClick?: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, onAgendarClick }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Detectar si estamos en la sección de Apuntes
  const isApuntesSection = location.pathname.startsWith('/apuntes');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Reset header visibility and scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsHeaderVisible(true);
    setLastScrollY(0);
  }, [location.pathname]);

  return (
    <div className="lg:hidden min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header - Condicional según la sección */}
      {isApuntesSection ? (
        // Header específico para Apuntes
        <ApuntesHeader />
      ) : (
        // Header normal para el resto del sitio
        <motion.div
          animate={{
            y: isHeaderVisible ? 0 : -100,
            opacity: isHeaderVisible ? 1 : 0
          }}
          transition={{
            duration: 0.3,
            type: "tween",
            ease: "easeInOut"
          }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <Header 
            onAgendarClick={onAgendarClick}
          />
        </motion.div>
      )}

      {/* Main content with dynamic padding */}
      <main 
        className={`transition-all duration-300 ${
          isHeaderVisible ? 'pt-16' : 'pt-0'
        }`}
        style={{ 
          minHeight: isHeaderVisible ? 'calc(100vh - 4rem)' : '100vh'
        }}
      >
        {children}
      </main>

      {/* Mobile Menu - Solo para sección principal */}
      {!isApuntesSection && (
        <MobileMenu 
          onAgendarClick={onAgendarClick}
        />
      )}

      {/* Floating Navigation - Solo para sección principal */}
      {!isApuntesSection && <MobileFloatingNav />}
    </div>
  );
};