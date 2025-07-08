import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, ChevronDown, ChevronRight, Building2, Home as HomeIcon, Briefcase, Heart, 
  FileText, Shield, Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const DropdownMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Servicios exactos del sidebar
  const servicios = [
    {
      id: 'corporate',
      label: 'Derecho Corporativo',
      icon: Building2,
      href: '/servicios/corporativo',
      badge: 'Popular'
    },
    {
      id: 'real-estate',
      label: 'Derecho Inmobiliario',
      icon: HomeIcon,
      href: '/servicios/inmobiliario'
    },
    {
      id: 'labor',
      label: 'Derecho Laboral',
      icon: Briefcase,
      href: '/servicios/laboral',
      badge: 'Urgente'
    },
    {
      id: 'family',
      label: 'Derecho de Familia',
      icon: Heart,
      href: '/servicios/familia'
    },
    {
      id: 'civil',
      label: 'Derecho Civil',
      icon: FileText,
      href: '/servicios/civil'
    },
    {
      id: 'criminal',
      label: 'Derecho Penal',
      icon: Shield,
      href: '/servicios/penal'
    },
    {
      id: 'digital',
      label: 'Derecho Digital',
      icon: Globe,
      href: '/servicios/digital',
      badge: 'Nuevo'
    }
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      tabIndex={0}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <motion.button
        className={`
          relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
          text-foreground/70 hover:text-foreground
          hover:bg-white/10
          border border-transparent hover:border-white/20
          backdrop-blur-sm group
        `}
        whileHover={{ 
          scale: 1.05, 
          y: -2,
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Efecto de hover dinámico - estilo sidebar */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
          layoutId="nav-hover-servicios"
        />
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Scale className="w-4 h-4 relative z-10 group-hover:text-primary transition-colors duration-300" />
        </motion.div>
        
        <span className="text-xs font-medium relative z-10 hidden sm:inline">Servicios</span>
        
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          <ChevronDown className="w-4 h-4 relative z-10 group-hover:text-primary transition-colors duration-300" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu con estilo del sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
            className="absolute top-full left-0 mt-2 w-80 bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Efectos de fondo animados - estilo sidebar */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-primary/15 rounded-full"
                  animate={{
                    x: [0, 40, 0],
                    y: [0, -40, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${30 + i * 25}%`,
                    top: `${50 + i * 15}%`,
                  }}
                />
              ))}
            </div>

            {/* Gradient overlay estilo sidebar */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10 pointer-events-none" />

            <div className="relative z-10 p-4">
              {/* Header del dropdown */}
              <div className="mb-4 pb-3 border-b border-white/10">
                <h3 className="text-foreground font-semibold text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  Servicios Legales
                </h3>
                <p className="text-xs text-foreground/60 mt-1">Soluciones jurídicas especializadas</p>
              </div>

              {/* Lista de servicios */}
              <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {servicios.map((servicio, index) => (
                  <motion.div
                    key={servicio.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Hover background effect - estilo sidebar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    
                    <Link
                      to={servicio.href}
                      onClick={() => setOpen(false)}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group hover:bg-white/10 hover:scale-[1.01] hover:shadow-lg hover:shadow-white/5"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <servicio.icon className="w-4 h-4 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                      </motion.div>
                      
                      <span className="font-medium text-sm text-foreground/80 group-hover:text-foreground flex-1 group-hover:translate-x-1 transition-all duration-300">
                        {servicio.label}
                      </span>
                      
                      {servicio.badge && (
                        <motion.span 
                          className={`
                            text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm
                            ${servicio.badge === 'Urgente'
                              ? 'bg-orange-500/20 text-orange-400 shadow-orange-500/20 animate-pulse'
                              : servicio.badge === 'Popular'
                              ? 'bg-slate-600/20 text-slate-300 shadow-slate-600/20'
                              : servicio.badge === 'Nuevo'
                              ? 'bg-zinc-500/20 text-zinc-400 shadow-zinc-500/20'
                              : 'bg-primary/20 text-primary shadow-primary/20'
                            }
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {servicio.badge}
                        </motion.span>
                      )}
                      
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ChevronRight className="w-4 h-4 text-primary/60" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer del dropdown */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <Link
                    to="/servicios"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
                  >
                    Ver todos los servicios
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Indicador de conexión estilo sidebar */}
            <motion.div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full opacity-60"
              animate={{
                width: [32, 40, 32],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu; 