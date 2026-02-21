// RUTA: src/components/Footer.tsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import ApuntesFooter from './layout/footers/ApuntesFooter';
import MainFooter from './layout/footers/MainFooter';

interface FooterProps {
  variant?: 'default' | 'apuntes' | 'none';
}

const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  const location = useLocation();

  // No renderizar footer en página de inicio (landing)
  if (location.pathname === '/') {
    return null;
  }

  // No renderizar footer en rutas de foco (agendamiento, pago, etc.)
  if (location.pathname.startsWith('/agendamiento')) {
    return null;
  }

  if (location.pathname.startsWith('/mercadopago')) {
    return null;
  }

  if (location.pathname.startsWith('/pago') || location.pathname.startsWith('/payment')) {
    return null;
  }

  if (variant === 'none') return null;
  if (variant === 'apuntes') return <ApuntesFooter />;
  return <MainFooter />;
};

export default Footer;
