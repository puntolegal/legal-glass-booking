// RUTA: src/components/layout/MainLayout.tsx

import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import PageTransition from '../PageTransition';
import { MobileLayout } from '../MobileLayout';
import { getLayoutForPath } from '@/config/layoutConfig';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const config = getLayoutForPath(location.pathname);
  const baseBackgroundClass =
    'relative min-h-screen bg-[#FAFAF9] dark:bg-[#0B1121] text-stone-800 dark:text-stone-100 selection:bg-stone-200 selection:text-stone-900 overflow-hidden';
  const NoiseOverlay = () => (
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
  if (config.type === 'focus') {
    return (
      <>
        <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
        </Helmet>
        <div className={baseBackgroundClass}>
          <NoiseOverlay />
          <div className="relative z-10 flex flex-col min-h-screen">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </div>
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
