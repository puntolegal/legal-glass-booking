// RUTA: src/hooks/useMobile.ts

import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el dispositivo es móvil
 */
export const useMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);
  
  return isMobile;
};

