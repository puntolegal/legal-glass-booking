// RUTA: src/App.tsx

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { ConceptNavigationProvider } from '@/contexts/ConceptNavigationContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/hooks/useTheme';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';

// Página eager: solo el 404 (liviano). La home va lazy porque su árbol
// usa framer-motion y mantenerla eager arrastraría ese chunk a todas las rutas.
import NotFound from '@/pages/NotFound';

// Páginas lazy: cada una genera su propio chunk y solo se descarga al navegar a la ruta
const Index = lazy(() => import('@/pages/Index'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const AgendamientoPage = lazy(() => import('@/pages/AgendamientoPage'));
const PremiumPaymentPage = lazy(() => import('@/pages/PremiumPaymentPage'));
const MercadoPagoPaymentPage = lazy(() => import('@/pages/MercadoPagoPaymentPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const PaymentFailurePage = lazy(() => import('@/pages/PaymentFailurePage'));
const PaymentPendingPage = lazy(() => import('@/pages/PaymentPendingPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const TestPage = lazy(() => import('@/pages/TestPage'));
const TestMetaPixel = lazy(() => import('@/pages/TestMetaPixel'));
const ApuntesHome = lazy(() => import('./pages/ApuntesHome'));
const AmandaLogin = lazy(() => import('@/pages/AmandaLogin'));
const ExpressPage = lazy(() => import('@/pages/ExpressPage'));
// Service Pages
const ServicioCorporativoPage = lazy(() => import('@/pages/ServicioCorporativoPage'));
const ServicioLaboralPage = lazy(() => import('@/pages/ServicioLaboralPage'));
const ServicioInmobiliarioPage = lazy(() => import('@/pages/ServicioInmobiliarioPage'));
const ServicioFamiliaPage = lazy(() => import('@/pages/ServicioFamiliaPage'));
const PagoDiagnosticoIA = lazy(() => import('@/pages/PagoDiagnosticoIA'));
const DiagnosticoIniciar = lazy(() => import('@/pages/DiagnosticoIniciar'));
const PortalReconstruccionPage = lazy(() => import('@/pages/PortalReconstruccionPage'));
const RugbyPage = lazy(() => import('@/pages/RugbyPage'));
const CalculadoraPensionPage = lazy(() => import('@/pages/CalculadoraPensionPage'));
const UrgenciaPage = lazy(() => import('@/pages/UrgenciaPage'));

// Blog Posts
const BlogPost1 = lazy(() => import('@/pages/BlogPost1'));
const BlogPost2 = lazy(() => import('@/pages/BlogPost2'));
const BlogPost3 = lazy(() => import('@/pages/BlogPost3'));
const BlogPost4 = lazy(() => import('@/pages/BlogPost4'));
const BlogPost5 = lazy(() => import('@/pages/BlogPost5'));
const BlogPost6 = lazy(() => import('@/pages/BlogPost6'));
const BlogPost7 = lazy(() => import('@/pages/BlogPost7'));
const BlogPost8 = lazy(() => import('@/pages/BlogPost8'));
const BlogPost9 = lazy(() => import('@/pages/BlogPost9'));
const BlogTributario1 = lazy(() => import('@/pages/BlogTributario1'));
const BlogTributario2 = lazy(() => import('@/pages/BlogTributario2'));
const BlogTributario3 = lazy(() => import('@/pages/BlogTributario3'));

// Apuntes
const ApuntesIndex = lazy(() => import('@/pages/apuntes/index'));
const ApunteDetail = lazy(() => import('@/pages/apuntes/ApunteDetail'));
const AuditoriaPage = lazy(() => import('@/pages/apuntes/AuditoriaPage'));

/**
 * Fallback mientras se descarga el chunk de la ruta. El spinner aparece con
 * ~300ms de retraso (pl-anim-fade-in + animationDelay): si el chunk ya está
 * en caché o prefetcheado, el usuario no ve ningún parpadeo.
 */
function RouteFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-label="Cargando página"
    >
      <div
        className="flex flex-col items-center gap-3 pl-anim-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-300" />
        <span className="text-xs font-medium tracking-wide text-slate-400 dark:text-slate-500">
          Cargando…
        </span>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AccessibilityProvider>
          <GamificationProvider>
            <ConceptNavigationProvider>
              <SidebarProvider>
                <ThemeProvider>
                <Router>
                  <ErrorBoundary>
                    <ScrollToTop />
                    <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      {/* Todas las rutas envueltas en MainLayout */}
                      <Route element={<MainLayout />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/centro" element={<ExpressPage />} />
                        <Route path="/express" element={<ExpressPage />} />
                        <Route
                          path="/inmobiliario"
                          element={<Navigate to="/servicios/inmobiliario" replace />}
                        />
                        <Route path="/servicios" element={<ServicesPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/agendamiento" element={<AgendamientoPage />} />
                        <Route path="/payment" element={<PremiumPaymentPage />} />
                        <Route path="/pago" element={<PremiumPaymentPage />} />
                        <Route path="/mercadopago" element={<MercadoPagoPaymentPage />} />
                        <Route path="/payment-success" element={<PaymentSuccessPage />} />
                        <Route path="/payment-failure" element={<PaymentFailurePage />} />
                        <Route path="/payment-pending" element={<PaymentPendingPage />} />
                        <Route path="/urgencia" element={<UrgenciaPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/amanda" element={<AmandaLogin />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/test" element={<TestPage />} />
                        <Route path="/test-meta-pixel" element={<TestMetaPixel />} />
                        
                        {/* Apuntes Routes */}
                        <Route path="/apuntes/home" element={<ApuntesHome />} />
                        <Route path="/apuntes/auditoria" element={<AuditoriaPage />} />
                        <Route path="/apuntes" element={<ApuntesIndex />} />
                        <Route path="/apuntes/:slug" element={<ApunteDetail />} />
                        
                        {/* Service Routes */}
                        <Route path="/servicios/corporativo" element={<ServicioCorporativoPage />} />
                        <Route path="/servicios/laboral" element={<ServicioLaboralPage />} />
                        <Route path="/servicios/inmobiliario" element={<ServicioInmobiliarioPage />} />
                        <Route path="/servicios/familia" element={<ServicioFamiliaPage />} />
                        <Route path="/servicios/familia/calculadora" element={<CalculadoraPensionPage />} />
                        <Route path="/servicios/digital" element={<Navigate to="/" replace />} />
                        <Route path="/servicios/civil" element={<Navigate to="/" replace />} />
                        <Route path="/servicios/tributario" element={<Navigate to="/" replace />} />
                        <Route path="/servicios/penal-economico" element={<Navigate to="/" replace />} />
                        <Route path="/servicios/penal" element={<Navigate to="/urgencia" replace />} />
                        
                        {/* Diagnóstico Routes */}
                        <Route path="/pago/diagnostico-ia" element={<PagoDiagnosticoIA />} />
                        <Route path="/diagnostico/iniciar" element={<DiagnosticoIniciar />} />
                        <Route path="/portal-reconstruccion" element={<PortalReconstruccionPage />} />
                        <Route path="/rugby" element={<RugbyPage />} />
                        
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
                    </Suspense>
                    <AccessibilityPanel />
                    <Toaster />
                  </ErrorBoundary>
                </Router>
                </ThemeProvider>
              </SidebarProvider>
            </ConceptNavigationProvider>
          </GamificationProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
