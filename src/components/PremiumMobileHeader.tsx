import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';

interface PremiumMobileHeaderProps {
  className?: string;
}

export const PremiumMobileHeader: React.FC<PremiumMobileHeaderProps> = ({ className = "" }) => {
  const { title, subtitle } = usePageTitle();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-hide header on scroll (estilo iOS)
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

  // Reset visibility on route change
  useEffect(() => {
    setIsVisible(true);
    setLastScrollY(0);
  }, [location.pathname]);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      className={`lg:hidden fixed top-0 left-0 right-0 z-30 ${className}`}
    >
      {/* Header Container - Glassmorphism Premium */}
      <div className="relative">
        {/* Background Blur */}
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl" />
        
        {/* Border Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent" />
        
        {/* Content */}
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-center">
            {/* Logo Centrado - Estilo iOS */}
            <motion.button
              onClick={handleLogoClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              {/* Logo Icon */}
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl blur-md opacity-30 -z-10" />
              </div>
              
              {/* Title */}
              <div className="text-center">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Punto Legal
                </h1>
                {subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default PremiumMobileHeader;
