import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PremiumMobileHeader from './PremiumMobileHeader';
import PremiumMobileDock from './PremiumMobileDock';
import MobileSidebar from './MobileSidebar';
import MobileFooter from './MobileFooter';
import ApuntesHeader from './ApuntesHeader';
import { useSidebar } from '@/contexts/SidebarContext';

interface MobileLayoutProps {
  children: React.ReactNode;
  onAgendarClick?: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, onAgendarClick }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isOpen, closeSidebar } = useSidebar();
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
      {/* Header - Solo para Apuntes */}
      {isApuntesSection && <ApuntesHeader />}

      {/* Main content with dynamic padding */}
      <main 
        className={`transition-all duration-300 ${
          isApuntesSection && isHeaderVisible ? 'pt-16' : 'pt-0'
        }`}
        style={{ 
          minHeight: isApuntesSection && isHeaderVisible ? 'calc(100vh - 4rem)' : '100vh'
        }}
      >
        {children}
      </main>

      {/* Mobile Footer - Elegante y profesional */}
      <MobileFooter />

      {/* Premium Mobile Dock - Unificado y optimizado */}
      <PremiumMobileDock />

      {/* Mobile Sidebar - Barra lateral deslizable */}
      <MobileSidebar 
        open={isOpen} 
        onClose={closeSidebar} 
      />
    </div>
  );
};