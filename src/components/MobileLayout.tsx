import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTheme } from '@/hooks/useTheme';

// Lazy: ambos usan framer-motion; cargarlos estáticos arrastraría ese chunk
// al bundle de entrada de todas las rutas.
const MobileSidebar = lazy(() => import('./MobileSidebar'));
const ApuntesHeader = lazy(() => import('./ApuntesHeader'));

interface MobileLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  headerVariant?: 'default' | 'apuntes';
  onAgendarClick?: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  showHeader = false,
  headerVariant = 'apuntes',
  onAgendarClick 
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isOpen, closeSidebar } = useSidebar();
  // El sidebar se monta recién en la primera apertura (evita descargar su
  // chunk si el usuario nunca lo abre); luego queda montado para animar cierre.
  const [sidebarMounted, setSidebarMounted] = useState(false);
  useEffect(() => {
    if (isOpen) setSidebarMounted(true);
  }, [isOpen]);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isGlassCanvasRoute = isLanding || location.pathname === '/servicios/inmobiliario';
  const { theme } = useTheme();
  const landingLight = isLanding && theme === 'light';

  useEffect(() => {
    if (!showHeader) return;
    
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
  }, [lastScrollY, showHeader]);

  return (
    <div
      className={`lg:hidden min-h-screen relative ${
        isGlassCanvasRoute
          ? landingLight
            ? 'bg-transparent text-slate-900 selection:bg-teal-500/20 selection:text-slate-900'
            : 'bg-transparent text-slate-100 selection:bg-sky-500/30 selection:text-white'
          : 'bg-slate-50 dark:bg-[#05060a] text-slate-900 dark:text-slate-100 selection:bg-teal-500/15 dark:selection:bg-sky-500/20 selection:text-slate-900 dark:selection:text-white'
      } overflow-hidden`}
    >
      {!isGlassCanvasRoute && (
        <div
          className="pointer-events-none absolute inset-0 bg-noise opacity-40 mix-blend-soft-light"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 min-h-screen">
        {showHeader && headerVariant === 'apuntes' && (
          <Suspense fallback={null}>
            <ApuntesHeader />
          </Suspense>
        )}

        <main
          className={`transition-all duration-300 ${
            showHeader && isHeaderVisible ? 'pt-16' : 'pt-0'
          }`}
          style={{
            minHeight: showHeader && isHeaderVisible ? 'calc(100vh - 4rem)' : '100vh'
          }}
        >
          {children}
        </main>

        {sidebarMounted && (
          <Suspense fallback={null}>
            <MobileSidebar open={isOpen} onClose={closeSidebar} />
          </Suspense>
        )}
      </div>
    </div>
  );
};
