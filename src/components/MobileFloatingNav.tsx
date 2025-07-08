import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

interface MobileFloatingNavProps {
  className?: string;
}

export const MobileFloatingNav = ({ className = "" }: MobileFloatingNavProps) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [canGoBack, setCanGoBack] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si se puede navegar hacia atrás
  useEffect(() => {
    const hasHistory = window.history.length > 1;
    setCanGoBack(hasHistory && location.pathname !== '/');
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`lg:hidden fixed bottom-6 left-4 z-40 ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Botón de Retroceder */}
        <AnimatePresence>
          {canGoBack && (
            <motion.button
              initial={{ opacity: 0, scale: 0, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: -20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="w-10 h-10 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-lg shadow-black/10 flex items-center justify-center group transition-all duration-300 hover:bg-primary/10 hover:border-primary/30"
              title="Volver a la página anterior"
            >
              <ArrowLeft className="w-4 h-4 text-foreground group-hover:text-primary transition-colors duration-300" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Botón de Menú Lateral - Solo visible cuando el sidebar está cerrado */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: -20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-xl border border-primary/30 shadow-lg shadow-primary/20 flex items-center justify-center group transition-all duration-300 hover:bg-primary/30 hover:border-primary/40"
              title="Abrir menú lateral"
            >
              <Menu className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors duration-300" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Indicador de Estado de Conexión */}
      <motion.div
        className="absolute -right-6 bottom-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/30 animate-pulse" />
      </motion.div>
    </div>
  );
}; 