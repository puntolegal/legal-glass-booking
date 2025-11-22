// RUTA: src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { ConceptNavigationProvider } from '@/contexts/ConceptNavigationContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Index from '@/pages/Index';
import ServicesPage from '@/pages/ServicesPage';
import BlogPage from '@/pages/BlogPage';
import AgendamientoPage from '@/pages/AgendamientoPage';
import PremiumPaymentPage from '@/pages/PremiumPaymentPage';
import MercadoPagoPaymentPage from '@/pages/MercadoPagoPaymentPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentFailurePage from '@/pages/PaymentFailurePage';
import PaymentPendingPage from '@/pages/PaymentPendingPage';
import AdminPage from '@/pages/AdminPage';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import TestPage from '@/pages/TestPage';
import ApuntesHome from './pages/ApuntesHome';
import AmandaLogin from '@/pages/AmandaLogin';

// Service Pages
import ServicioCorporativoPage from '@/pages/ServicioCorporativoPage';
import ServicioLaboralPage from '@/pages/ServicioLaboralPage';
import ServicioDigitalPage from '@/pages/ServicioDigitalPage';
import ServicioInmobiliarioPage from '@/pages/ServicioInmobiliarioPage';
import ServicioCivilPage from '@/pages/ServicioCivilPage';
import ServicioFamiliaPage from '@/pages/ServicioFamiliaPage';
import ServicioPenalPage from '@/pages/ServicioPenalPage';
import ServicioTributarioPage from '@/pages/ServicioTributarioPage';
import ServicioPenalEconomicoPage from '@/pages/ServicioPenalEconomicoPage';
import PagoDiagnosticoIA from '@/pages/PagoDiagnosticoIA';
import DiagnosticoIniciar from '@/pages/DiagnosticoIniciar';

// Blog Posts
import BlogPost1 from '@/pages/BlogPost1';
import BlogPost2 from '@/pages/BlogPost2';
import BlogPost3 from '@/pages/BlogPost3';
import BlogPost4 from '@/pages/BlogPost4';
import BlogPost5 from '@/pages/BlogPost5';
import BlogPost6 from '@/pages/BlogPost6';
import BlogPost7 from '@/pages/BlogPost7';
import BlogPost8 from '@/pages/BlogPost8';
import BlogPost9 from '@/pages/BlogPost9';
import BlogTributario1 from '@/pages/BlogTributario1';
import BlogTributario2 from '@/pages/BlogTributario2';
import BlogTributario3 from '@/pages/BlogTributario3';

// Apuntes
import ApuntesIndex from '@/pages/apuntes/index';
import ApunteDetail from '@/pages/apuntes/ApunteDetail';
import AuditoriaPage from '@/pages/apuntes/AuditoriaPage';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AccessibilityProvider>
            <GamificationProvider>
              <ConceptNavigationProvider>
                <SidebarProvider>
                  <Router>
      <ScrollToTop />
      
    <Routes>
                    {/* Todas las rutas envueltas en MainLayout */}
                    <Route element={<MainLayout />}>
      <Route path="/" element={<Index />} />
      <Route path="/servicios" element={<ServicesPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/agendamiento" element={<AgendamientoPage />} />
      <Route path="/payment" element={<PremiumPaymentPage />} />
      <Route path="/pago" element={<PremiumPaymentPage />} />
      <Route path="/mercadopago" element={<MercadoPagoPaymentPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/payment-failure" element={<PaymentFailurePage />} />
      <Route path="/payment-pending" element={<PaymentPendingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/amanda" element={<AmandaLogin />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/test" element={<TestPage />} />
      
      {/* Apuntes Routes */}
      <Route path="/apuntes/home" element={<ApuntesHome />} />
      <Route path="/apuntes/auditoria" element={<AuditoriaPage />} />
      <Route path="/apuntes" element={<ApuntesIndex />} />
      <Route path="/apuntes/:slug" element={<ApunteDetail />} />
      
      {/* Service Routes */}
      <Route path="/servicios/corporativo" element={<ServicioCorporativoPage />} />
      <Route path="/servicios/laboral" element={<ServicioLaboralPage />} />
      <Route path="/servicios/digital" element={<ServicioDigitalPage />} />
      <Route path="/servicios/inmobiliario" element={<ServicioInmobiliarioPage />} />
      <Route path="/servicios/civil" element={<ServicioCivilPage />} />
      <Route path="/servicios/familia" element={<ServicioFamiliaPage />} />
      <Route path="/servicios/penal" element={<ServicioPenalPage />} />
                      
                      {/* Diagnóstico Routes */}
                      <Route path="/pago/diagnostico-ia" element={<PagoDiagnosticoIA />} />
                      <Route path="/diagnostico/iniciar" element={<DiagnosticoIniciar />} />
      <Route path="/servicios/tributario" element={<ServicioTributarioPage />} />
      <Route path="/servicios/penal-economico" element={<ServicioPenalEconomicoPage />} />
      
      {/* Blog Routes */}
      <Route path="/blog/post-1" element={<BlogPost1 />} />
      <Route path="/blog/post-2" element={<BlogPost2 />} />
      <Route path="/blog/post-3" element={<BlogPost3 />} />
      <Route path="/blog/post-4" element={<BlogPost4 />} />
      <Route path="/blog/post-5" element={<BlogPost5 />} />
      <Route path="/blog/post-6" element={<BlogPost6 />} />
      <Route path="/blog/post-7" element={<BlogPost7 />} />
      <Route path="/blog/post-8" element={<BlogPost8 />} />
      <Route path="/blog/post-9" element={<BlogPost9 />} />
      <Route path="/blog/tributario-1" element={<BlogTributario1 />} />
      <Route path="/blog/tributario-2" element={<BlogTributario2 />} />
      <Route path="/blog/tributario-3" element={<BlogTributario3 />} />
      
      <Route path="*" element={<NotFound />} />
                    </Route>
    </Routes>
                  
                  <AccessibilityPanel />
                  <Toaster />
                </Router>
              </SidebarProvider>
            </ConceptNavigationProvider>
          </GamificationProvider>
        </AccessibilityProvider>
      </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
