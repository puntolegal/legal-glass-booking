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

  // No renderizar header en rutas de foco (agendamiento, pago, etc.)
  if (location.pathname.startsWith('/apuntes')) {
    return null;
  }

  if (location.pathname.startsWith('/agendamiento')) {
    return null;
  }

  if (location.pathname.startsWith('/mercadopago')) {
    return null;
  }

  if (location.pathname.startsWith('/pago') || location.pathname.startsWith('/payment')) {
    return null;
  }

  if (variant === 'none') {
    return null;
  }

  return <DynamicHeader />;
};

export default Header;
