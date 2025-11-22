import React, { useState, useEffect } from 'react';
import MobileSidebar from './MobileSidebar';
import ApuntesHeader from './ApuntesHeader';
import { useSidebar } from '@/contexts/SidebarContext';

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
    <div className="lg:hidden min-h-screen relative bg-[#F5F7FA] dark:bg-[#0B1121] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 selection:text-slate-900 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-noise opacity-40 mix-blend-soft-light"
        aria-hidden="true"
      />
      <div className="relative z-10 min-h-screen">
        {showHeader && headerVariant === 'apuntes' && <ApuntesHeader />}

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

        <MobileSidebar open={isOpen} onClose={closeSidebar} />
      </div>
    </div>
  );
};
