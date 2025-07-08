import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTitle = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return {
          title: 'Punto Legal',
          subtitle: 'Tu Socio Legal Estratégico'
        };
      case '/servicios':
        return {
          title: 'Punto Legal Servicios',
          subtitle: 'Nuestras Soluciones Legales'
        };
      case '/corporativo':
        return {
          title: 'Punto Legal Corporativo',
          subtitle: 'Soluciones Premium para Empresas'
        };
      case '/laboral':
        return {
          title: 'Punto Legal Laboral',
          subtitle: 'Defensa Integral de Trabajadores'
        };
      case '/familia':
        return {
          title: 'Punto Legal Familia',
          subtitle: 'Asesoría Especializada en Derecho Familiar'
        };
      case '/herencias':
        return {
          title: 'Punto Legal Sucesorio',
          subtitle: 'Gestión Completa de Herencias y Testamentos'
        };
      case '/contratos-express':
        return {
          title: 'Punto Legal Contratos',
          subtitle: 'Contratos Express en 24 Horas'
        };
      case '/sociedades-express':
        return {
          title: 'Punto Legal Sociedades',
          subtitle: 'Constitución de Sociedades en 48h'
        };
      case '/marcas-patentes':
        return {
          title: 'Punto Legal Propiedad Intelectual',
          subtitle: 'Registro de Marcas y Patentes'
        };
      case '/reclamos-sernac':
        return {
          title: 'Punto Legal Consumidor',
          subtitle: 'Defensa de Consumidores y Reclamos SERNAC'
        };
      case '/proteccion-datos':
        return {
          title: 'Punto Legal Protección de Datos',
          subtitle: 'Cumplimiento LGPD y Privacidad Digital'
        };
      case '/ecommerce-compliance':
        return {
          title: 'Punto Legal E-Commerce',
          subtitle: 'Compliance Digital y Comercio Electrónico'
        };
      case '/blog':
        return {
          title: 'Punto Legal Blog',
          subtitle: 'Artículos Especializados en Derecho'
        };
      case '/contacto':
        return {
          title: 'Punto Legal Contacto',
          subtitle: 'Contáctanos para Asesoría Legal'
        };
      default:
        return {
          title: 'Punto Legal',
          subtitle: 'Tu Socio Legal Estratégico'
        };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return { title, subtitle };
}; 