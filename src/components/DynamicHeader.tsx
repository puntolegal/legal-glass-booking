import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderService from './HeaderService';
import { serviceThemes } from '../config/serviceThemes';

interface DynamicHeaderProps {
  onAgendarClick?: () => void;
  serviceName?: string;
}

const DynamicHeader: React.FC<DynamicHeaderProps> = ({ onAgendarClick, serviceName }) => {
  const location = useLocation();
  
  // Determinar qué tema usar basado en la ruta actual
  const getThemeForPath = (pathname: string) => {
    // Servicios específicos
    if (pathname.includes('/servicios/corporativo')) return serviceThemes.corporativo;
    if (pathname.includes('/servicios/laboral')) return serviceThemes.laboral;
    if (pathname.includes('/servicios/familia')) return serviceThemes.familia;
    if (pathname.includes('/servicios/inmobiliario')) return serviceThemes.inmobiliario;
    if (pathname.includes('/urgencia')) return serviceThemes.penal;
    
    // Páginas principales
    if (pathname === '/' || pathname === '/servicios') return serviceThemes.general;
    if (pathname.includes('/blog')) return serviceThemes.general;
    if (pathname.includes('/apuntes')) return serviceThemes.general;
    if (pathname.includes('/agendamiento')) return serviceThemes.general;
    
    // Por defecto
    return serviceThemes.general;
  };
  
  const theme = getThemeForPath(location.pathname);
  
  // En algunas páginas queremos el header transparente en la parte superior
  const transparentPages = ['/', '/servicios'];
  const isTransparentOnTop = transparentPages.includes(location.pathname);
  
  return (
    <HeaderService 
      theme={theme} 
      transparentOnTop={isTransparentOnTop}
    />
  );
};

export default DynamicHeader;
