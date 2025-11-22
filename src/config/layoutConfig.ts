// RUTA: src/config/layoutConfig.ts

/**
 * Configuración declarativa de layouts
 * Sistema de configuración sobre lógica condicional
 */

export type LayoutType = 'default' | 'apuntes' | 'focus';
export type HeaderVariant = 'default' | 'apuntes' | 'none';
export type FooterVariant = 'default' | 'apuntes' | 'none';

export interface LayoutConfig {
  type: LayoutType;
  showHeader: boolean;
  showFooter: boolean;
  headerVariant: HeaderVariant;
  footerVariant: FooterVariant;
  useMobileLayout: boolean;
  seoConfig?: {
    titleSuffix?: string;
    defaultDescription?: string;
  };
}

interface RouteLayoutRule {
  // Exacta o con prefijo
  path?: string;
  pathPrefix?: string;
  config: LayoutConfig;
}

/**
 * Array de configuración de layouts por ruta
 * Las reglas se evalúan en orden, la primera que coincida se aplica
 */
export const layoutConfigs: RouteLayoutRule[] = [
  // 1. Layout de foco - Agendamiento (máxima conversión)
  {
    pathPrefix: '/agendamiento',
    config: {
      type: 'focus',
      showHeader: false,
      showFooter: false,
      headerVariant: 'none',
      footerVariant: 'none',
      useMobileLayout: false,
      seoConfig: {
        titleSuffix: 'Agendamiento',
        defaultDescription: 'Agenda tu consulta legal con nuestros especialistas'
      }
    }
  },
  
  // 2. Layout de foco - MercadoPago
  {
    pathPrefix: '/mercadopago',
    config: {
      type: 'focus',
      showHeader: false,
      showFooter: false,
      headerVariant: 'none',
      footerVariant: 'none',
      useMobileLayout: false,
      seoConfig: {
        titleSuffix: 'Pago Seguro',
        defaultDescription: 'Completa tu pago de forma segura con MercadoPago'
      }
    }
  },
  
  // 3. Layout de foco - Páginas de pago
  {
    pathPrefix: '/pago',
    config: {
      type: 'focus',
      showHeader: false,
      showFooter: false,
      headerVariant: 'none',
      footerVariant: 'none',
      useMobileLayout: false,
    }
  },
  
  // 3b. Layout de foco - Auth (sin header ni footer)
  {
    path: '/auth',
    config: {
      type: 'focus',
      showHeader: false,
      showFooter: false,
      headerVariant: 'none',
      footerVariant: 'none',
      useMobileLayout: false,
      seoConfig: {
        titleSuffix: 'Acceso',
        defaultDescription: 'Inicia sesión o crea una cuenta en Punto Legal'
      }
    }
  },
  
  // 4. Layout Apuntes - Index (con footer)
  {
    path: '/apuntes',
    config: {
      type: 'apuntes',
      showHeader: false,
      showFooter: true,
      headerVariant: 'apuntes',
      footerVariant: 'apuntes',
      useMobileLayout: true,
      seoConfig: {
        titleSuffix: 'Apuntes de Derecho',
        defaultDescription: 'Plataforma de estudio gamificada para estudiantes de Derecho en Chile'
      }
    }
  },
  
  // 4b. Layout Apuntes - Detalle de nota (sin footer para no distraer)
  {
    pathPrefix: '/apuntes/',
    config: {
      type: 'apuntes',
      showHeader: false,
      showFooter: false,
      headerVariant: 'apuntes',
      footerVariant: 'none',
      useMobileLayout: true,
      seoConfig: {
        titleSuffix: 'Apuntes de Derecho',
        defaultDescription: 'Plataforma de estudio gamificada para estudiantes de Derecho en Chile'
      }
    }
  },
  
  // 5. ServicioFamiliaPage (sin footer, tiene el propio)
  {
    path: '/servicios/familia',
    config: {
      type: 'default',
      showHeader: true,
      showFooter: false,
      headerVariant: 'default',
      footerVariant: 'none',
      useMobileLayout: false,
      seoConfig: {
        titleSuffix: 'Servicios de Familia',
        defaultDescription: 'Protección legal para tu familia con abogados especialistas'
      }
    }
  },
  
  // 6. Default - Resto de páginas
  // Esta regla siempre coincide (no tiene path ni pathPrefix)
];

/**
 * Obtiene la configuración de layout para una ruta específica
 */
export const getLayoutForPath = (pathname: string): LayoutConfig => {
  // Buscar configuración específica
  for (const rule of layoutConfigs) {
    if (rule.path && pathname === rule.path) {
      return rule.config;
    }
    if (rule.pathPrefix && pathname.startsWith(rule.pathPrefix)) {
      return rule.config;
    }
  }
  
  // Configuración default
  return {
    type: 'default',
    showHeader: true,
    showFooter: true,
    headerVariant: 'default',
    footerVariant: 'default',
    useMobileLayout: false,
    seoConfig: {
      titleSuffix: 'Punto Legal',
      defaultDescription: 'Startup legal chilena que democratiza el acceso a la justicia con tecnología'
    }
  };
};







