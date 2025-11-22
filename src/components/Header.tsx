import React from 'react';
import { useLocation } from 'react-router-dom';
import DynamicHeader from './DynamicHeader';

const Header = ({ onAgendarClick, serviceName }: { onAgendarClick?: () => void; serviceName?: string }) => {
  const location = useLocation();

  if (location.pathname.startsWith('/apuntes')) {
    return null;
  }

  return <DynamicHeader onAgendarClick={onAgendarClick} serviceName={serviceName} />;
};

export default Header;
