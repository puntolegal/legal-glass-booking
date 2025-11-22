import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default PageTransition; 