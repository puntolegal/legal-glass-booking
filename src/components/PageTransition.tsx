import React from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Transición de entrada de página con CSS puro (`.pl-page-enter`).
 * El `key` por pathname fuerza el remount y con ello reinicia la animación.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="min-h-screen pl-page-enter">
      {children}
    </div>
  );
};

export default PageTransition;
