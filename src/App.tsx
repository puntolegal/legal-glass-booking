import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LaboralPage from "./pages/LaboralPage";
import FamiliaPage from "./pages/FamiliaPage";
import HerenciasPage from "./pages/HerenciasPage";
import AdminPage from "./pages/AdminPage";
import BlogPost1 from "./pages/BlogPost1";
import BlogPost2 from "./pages/BlogPost2";
import BlogPost3 from "./pages/BlogPost3";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/laboral" element={<LaboralPage />} />
          <Route path="/familia" element={<FamiliaPage />} />
          <Route path="/herencias" element={<HerenciasPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/blog/calculo-indemnizacion" element={<BlogPost1 />} />
          <Route path="/blog/ley-karin" element={<BlogPost2 />} />
          <Route path="/blog/pensiones-alimentos" element={<BlogPost3 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
