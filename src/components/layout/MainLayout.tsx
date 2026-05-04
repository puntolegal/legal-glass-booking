// RUTA: src/components/layout/MainLayout.tsx

import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import PageTransition from '../PageTransition';
import { MobileLayout } from '../MobileLayout';
import { getLayoutForPath } from '@/config/layoutConfig';
import { useTheme } from '@/hooks/useTheme';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const config = getLayoutForPath(location.pathname);

  // Marca la ruta actual en <body> para que index.css pueda atenuar
  // los orbes naranja en el landing oscuro.
  useEffect(() => {
    document.body.setAttribute('data-route', location.pathname);
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, [location.pathname]);

  // Verificación explícita para rutas de agendamiento
  const isAgendamientoRoute = location.pathname.startsWith('/agendamiento') || 
                               location.pathname.startsWith('/mercadopago') ||
                               location.pathname.startsWith('/pago') ||
                               location.pathname.startsWith('/payment');

  // En el landing (`/`) delegamos el fondo al canvas slate de Index;
  // el resto de rutas conserva el fondo crema/oscuro tradicional.
  const isLanding = location.pathname === '/'
  const isChromelessGlass =
    isLanding ||
    location.pathname === '/servicios/inmobiliario' ||
    location.pathname === '/inmobiliario'
  const landingLight = isLanding && theme === 'light'
  const baseBackgroundClass = isChromelessGlass
    ? `relative min-h-screen bg-transparent overflow-hidden ${
        landingLight
          ? 'text-slate-900 selection:bg-teal-500/20 selection:text-slate-900'
          : 'text-slate-100 selection:bg-sky-500/30 selection:text-white'
      }`
    : 'relative min-h-screen bg-slate-50 dark:bg-[#05060a] text-slate-800 dark:text-slate-100 selection:bg-teal-500/15 selection:text-slate-900 dark:selection:bg-sky-500/25 dark:selection:text-white overflow-hidden'
  const NoiseOverlay = () =>
    isChromelessGlass ? null : (
      <div
        className="paper-noise"
        aria-hidden="true"
      />
    );
  
  // SEO base
  const seoTitle = config.seoConfig?.titleSuffix 
    ? `${config.seoConfig.titleSuffix} | Punto Legal`
    : 'Punto Legal - Asesoría Legal Moderna';
  
  const seoDescription = config.seoConfig?.defaultDescription 
    || 'Startup legal chilena que democratiza el acceso a la justicia con tecnología';
  
  // Para layouts de foco (agendamiento), no usar estructura de header/footer
  // Verificación doble: por config y por ruta explícita
  if (config.type === 'focus' || isAgendamientoRoute) {
    return (
      <>
        <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
        </Helmet>
        {/* Layout de foco: sin header ni footer globales, sin wrappers */}
        <Outlet />
      </>
    );
  }
  
  // Para layouts con MobileLayout (Apuntes)
  if (config.useMobileLayout) {
    return (
      <>
        <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
        </Helmet>
        <div className={baseBackgroundClass}>
          <NoiseOverlay />
          <div className="relative z-10 min-h-screen">
            <div className="hidden lg:flex lg:flex-col lg:min-h-screen">
              {config.showHeader && <Header variant={config.headerVariant} />}
              <main className="flex-grow">
                <AnimatePresence mode="wait">
                  <PageTransition key={location.pathname}>
                    <Outlet />
                  </PageTransition>
                </AnimatePresence>
              </main>
              {config.showFooter && <Footer variant={config.footerVariant} />}
            </div>

            <MobileLayout
              showHeader={config.showHeader}
              headerVariant={config.headerVariant === 'apuntes' ? 'apuntes' : 'default'}
            >
              <AnimatePresence mode="wait">
                <PageTransition key={location.pathname}>
                  <Outlet />
                </PageTransition>
              </AnimatePresence>
              {config.showFooter && <Footer variant={config.footerVariant} />}
            </MobileLayout>
          </div>
        </div>
      </>
    );
  }
  
  // Layout default estándar
  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>
      
      <div className={baseBackgroundClass}>
        <NoiseOverlay />
        <div className="relative z-10 flex flex-col min-h-screen">
          {config.showHeader && <Header variant={config.headerVariant} />}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </main>
          {config.showFooter && <Footer variant={config.footerVariant} />}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
