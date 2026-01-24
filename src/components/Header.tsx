import React from 'react';
import { useLocation } from 'react-router-dom';
import DynamicHeader from './DynamicHeader';

interface HeaderProps {
  variant?: 'default' | 'apuntes' | 'service' | 'none';
  onAgendarClick?: () => void;
  serviceName?: string;
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
  const location = useLocation();

  if (location.pathname.startsWith('/apuntes')) {
    return null;
  }

  if (variant === 'none') {
    return null;
  }

  return <DynamicHeader />;
};

export default Header;
