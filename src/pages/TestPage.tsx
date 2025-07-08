import React from 'react';
import Header from "@/components/Header";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  const pageContent = (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div 
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-primary/20"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Settings className="w-10 h-10 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Página de Prueba
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Si puedes ver esto, la aplicación está funcionando correctamente.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group"
          >
            <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Ir a Inicio
          </Button>
          
          <Button
            onClick={() => navigate("/servicios")}
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Ver Servicios
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver Atrás
          </Button>
        </div>
        
        <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            ✅ Sistema operativo: {navigator.userAgent.includes('Mobile') ? 'Móvil' : 'Escritorio'}
          </p>
          <p className="text-sm text-muted-foreground">
            ✅ React: Funcionando
          </p>
          <p className="text-sm text-muted-foreground">
            ✅ Tailwind CSS: Activo
          </p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <Header />
        <div className="pt-20">
          {pageContent}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout>
          {pageContent}
        </MobileLayout>
      </div>
    </>
  );
};

export default TestPage; 