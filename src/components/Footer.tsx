// RUTA: src/components/Footer.tsx

import React from 'react';
import ApuntesFooter from './layout/footers/ApuntesFooter';
import MainFooter from './layout/footers/MainFooter';

interface FooterProps {
  variant?: 'default' | 'apuntes' | 'none';
}

const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  if (variant === 'none') return null;
  if (variant === 'apuntes') return <ApuntesFooter />;
  return <MainFooter />;
};

export default Footer;
