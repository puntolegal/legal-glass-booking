import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import SkipLinks from "@/components/SkipLinks";
import Index from "./pages/Index";
import LaboralPage from "./pages/LaboralPage";
import FamiliaPage from "./pages/FamiliaPage";
import HerenciasPage from "./pages/HerenciasPage";
import CorporativoPage from "./pages/CorporativoPage";
import ContratosExpressPage from "./pages/ContratosExpressPage";
import TributarioPage from "./pages/TributarioPage";
import BlogTributario1 from "./pages/BlogTributario1";
import BlogTributario2 from "./pages/BlogTributario2";
import BlogTributario3 from "./pages/BlogTributario3";
import MarcasPatentesPage from "./pages/MarcasPatentesPage";
import SociedadesExpressPage from "./pages/SociedadesExpressPage";
import ProteccionDatosPage from "./pages/ProteccionDatosPage";
import ECommerceCompliancePage from "./pages/ECommerceCompliancePage";
import ReclamosSernacPage from "./pages/ReclamosSernacPage";
import ServicesPage from "./pages/ServicesPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AdminPage from "./pages/AdminPage";
import BlogPost1 from "./pages/BlogPost1";
import BlogPost2 from "./pages/BlogPost2";
import BlogPost3 from "./pages/BlogPost3";
import BlogPost4 from "./pages/BlogPost4";
import BlogPost5 from "./pages/BlogPost5";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";
import AgendamientoPage from "./pages/AgendamientoPage";

// Nuevas páginas de servicios
import ServicioCorporativoPage from "./pages/ServicioCorporativoPage";
import ServicioDigitalPage from "./pages/ServicioDigitalPage";
import ServicioInmobiliarioPage from "./pages/ServicioInmobiliarioPage";
import ServicioCivilPage from "./pages/ServicioCivilPage";
import ServicioPenalPage from "./pages/ServicioPenalPage";
import ServicioTributarioPage from "./pages/ServicioTributarioPage";
import ServicioPenalEconomicoPage from "./pages/ServicioPenalEconomicoPage";

// Nuevas páginas de blog
import BlogPost6 from "./pages/BlogPost6";
import BlogPost7 from "./pages/BlogPost7";
import BlogPost8 from "./pages/BlogPost8";
import BlogPost9 from "./pages/BlogPost9";
import BlogPage from "./pages/BlogPage";

// Páginas legales
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <SidebarProvider>
            <AccessibilityProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
                  <SkipLinks />
                  <div className="min-h-screen bg-rock-wall bg-cover bg-center flex relative">
                    <Sidebar />
                    <MainContent>
                      <PageTransition>
        <Routes>
          <Route path="/" element={<Index />} />
                          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/laboral" element={<LaboralPage />} />
          <Route path="/familia" element={<FamiliaPage />} />
          <Route path="/herencias" element={<HerenciasPage />} />
          <Route path="/corporativo" element={<CorporativoPage />} />
          <Route path="/contratos-express" element={<ContratosExpressPage />} />
          <Route path="/marcas-patentes" element={<MarcasPatentesPage />} />
          <Route path="/sociedades-express" element={<SociedadesExpressPage />} />
          <Route path="/proteccion-datos" element={<ProteccionDatosPage />} />
          <Route path="/ecommerce-compliance" element={<ECommerceCompliancePage />} />
          <Route path="/reclamos-sernac" element={<ReclamosSernacPage />} />
          <Route path="/tributario" element={<TributarioPage />} />
          <Route path="/blog/reforma-tributaria-2024" element={<BlogTributario1 />} />
          <Route path="/blog/beneficios-pyme" element={<BlogTributario2 />} />
          <Route path="/blog/fiscalizacion-sii" element={<BlogTributario3 />} />
          
          {/* Nuevas rutas de servicios */}
          <Route path="/servicios/corporativo" element={<ServicioCorporativoPage />} />
          <Route path="/servicios/laboral" element={<LaboralPage />} />
          <Route path="/servicios/familia" element={<FamiliaPage />} />
          <Route path="/servicios/digital" element={<ServicioDigitalPage />} />
          <Route path="/servicios/inmobiliario" element={<ServicioInmobiliarioPage />} />
          <Route path="/servicios/civil" element={<ServicioCivilPage />} />
          <Route path="/servicios/penal" element={<ServicioPenalPage />} />
          <Route path="/servicios/tributario" element={<ServicioTributarioPage />} />
          <Route path="/servicios/penal-economico" element={<ServicioPenalEconomicoPage />} />
                          <Route path="/pago" element={<PaymentPage />} />
                          <Route path="/payment/:serviceId" element={<PaymentPage />} />
                          <Route path="/payment-success" element={<PaymentSuccessPage />} />
                          <Route path="/payment-success/:serviceId" element={<PaymentSuccessPage />} />
                          <Route 
                            path="/admin" 
                            element={
                              <ProtectedRoute requiredRole="admin">
                                <AdminPage />
                              </ProtectedRoute>
                            } 
                          />
                          <Route path="/blog/despido-injustificado" element={<BlogPost1 />} />
                          <Route path="/blog/calculo-indemnizacion" element={<BlogPost2 />} />
                          <Route path="/blog/derechos-fundamentales" element={<BlogPost3 />} />
                          <Route path="/blog/casos-exito" element={<BlogPost4 />} />
                          <Route path="/blog/sociedades-comerciales" element={<BlogPost5 />} />
                          
                          {/* Nuevas rutas de blog */}
                          <Route path="/blog" element={<BlogPage />} />
                          <Route path="/blog/constituir-empresa-chile-2025" element={<BlogPost6 />} />
                          <Route path="/blog/divorcio-chile-2025" element={<BlogPost7 />} />
                          <Route path="/blog/compraventa-propiedades-guia" element={<BlogPost8 />} />
                          <Route path="/blog/contratos-digitales-firma-electronica" element={<BlogPost9 />} />
                          <Route path="/blog/evasion-fiscal-chile" element={<BlogTributario2 />} />
                          <Route path="/blog/planificacion-tributaria-2024" element={<BlogTributario3 />} />
                          <Route path="/blog-post-1" element={<BlogPost1 />} />
                          <Route path="/blog-post-2" element={<BlogPost2 />} />
                          <Route path="/blog-post-3" element={<BlogPost3 />} />
                          <Route path="/blog-post-4" element={<BlogPost4 />} />
                          <Route path="/blog-post-5" element={<BlogPost5 />} />
                          <Route path="/test" element={<TestPage />} />
                          <Route path="/agendamiento" element={<AgendamientoPage />} />
                          
                          {/* Páginas legales */}
                          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
                      </PageTransition>
                    </MainContent>
                  </div>
                  <ScrollToTop />
                  <AccessibilityPanel />
      </BrowserRouter>
    </TooltipProvider>
            </AccessibilityProvider>
          </SidebarProvider>
        </AuthProvider>
      </HelmetProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
