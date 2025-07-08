import React from 'react';
import { useSidebar } from '@/contexts/SidebarContext';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div 
      className={`flex-1 transition-all duration-300 ease-in-out ${
        isOpen ? 'lg:ml-80' : 'lg:ml-0'
      }`}
    >
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default MainContent; 