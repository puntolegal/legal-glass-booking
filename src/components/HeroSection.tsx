import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Shield, Users } from "lucide-react";
import ReservationForm from "./ReservationForm";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
  servicePrice?: string;
  serviceName?: string;
}

const HeroSection = ({ title, subtitle, showForm, setShowForm, servicePrice = "$35.000 CLP", serviceName = "Consulta Legal" }: HeroSectionProps) => {
  const [internalShowForm, internalSetShowForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isControlled = typeof showForm === 'boolean' && typeof setShowForm === 'function';
  const actualShowForm = isControlled ? showForm : internalShowForm;
  const actualSetShowForm = isControlled ? setShowForm : internalSetShowForm;

  const defaultTitle = "Asesoría Legal Especializada";
  const defaultSubtitle = "en Derecho Laboral";

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center pt-16 lg:pt-16 px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        {/* Layout de dos columnas en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Columna izquierda - Imagen optimizada para móvil */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
              {/* Imagen principal con efectos adaptativos */}
              <motion.div 
                className="relative transform transition-all duration-700 ease-out"
                whileHover={!isMobile ? { scale: 1.05 } : {}}
              >
                <img 
                  src="/no_bg_image.png" 
                  alt="Asesoría Legal Especializada" 
                  className={`w-full object-contain drop-shadow-2xl ${
                    isMobile 
                      ? 'max-w-xs h-auto' 
                      : 'max-w-md lg:max-w-lg h-auto animate-float-premium'
                  }`}
                  loading="eager"
                />
                
                {/* Efectos de brillo adaptativos */}
                {!isMobile && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-br from-white/30 via-primary/20 to-transparent rounded-full blur-xl opacity-40 animate-shimmer-premium"></div>
                  </>
                )}
              </motion.div>
              
              {/* Orbes flotantes decorativos - solo desktop */}
              {!isMobile && (
                <>
                  <motion.div 
                    className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full blur-sm opacity-70"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-full blur-md opacity-50"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                </>
              )}
            </motion.div>
          </div>

          {/* Columna derecha - Contenido optimizado para móvil */}
          <motion.div 
            className="order-1 lg:order-2 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Hero Title optimizado para móvil */}
            <div className="mb-6 lg:mb-8">
              <motion.h1 
                className={`font-bold mb-4 lg:mb-6 leading-tight tracking-tight ${
                  isMobile 
                    ? 'text-2xl sm:text-3xl' 
                    : 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent block">
                  {title || defaultTitle}
                </span>
                <span className={`text-foreground font-medium block mt-2 ${
                  isMobile 
                    ? 'text-xl sm:text-2xl' 
                    : 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl'
                }`}>
                  {subtitle || defaultSubtitle}
                </span>
              </motion.h1>
              
              {/* Badge premium optimizado para móvil */}
              <motion.div 
                className="flex justify-center lg:justify-start mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className={`backdrop-blur-sm px-4 py-2 rounded-full font-medium shadow-sm border flex items-center gap-2 ${
                  isMobile 
                    ? 'bg-background/80 border-border text-foreground text-sm' 
                    : 'bg-white/80 border-gray-100 text-primary text-sm'
                }`}>
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M12 8v4l3 3" strokeWidth="2" />
                  </svg>
                  +10 años de experiencia
                </span>
              </motion.div>
            </div>
            
            {/* Subtitle with Pricing optimizado */}
            <motion.div 
              className="mb-6 lg:mb-8 space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className={`text-secondary-foreground leading-relaxed ${
                isMobile ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
              }`}>
                Agenda y paga tu sesión de{" "}
                <span className={`text-primary font-bold px-3 py-1 rounded-lg bg-primary/10 inline-block ${
                  isMobile ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                }`}>
                  {servicePrice}
                </span>
              </p>
              <p className={`text-muted-foreground ${
                isMobile ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
              }`}>
                Recibe asesoría legal profesional por Google Meet
              </p>
            </motion.div>
            
            {/* CTA Buttons optimizados para móvil */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center mb-8 lg:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Botón principal optimizado */}
              <motion.button 
                onClick={() => {
                  // Redirigir a asesoría laboral por $35.000
                  window.location.href = '/agendamiento?plan=laboral';
                }}
                className={`group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl shadow-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-auto ${
                  isMobile 
                    ? 'px-6 py-3 text-base' 
                    : 'px-8 py-4 text-lg hover:scale-[1.02] hover:shadow-md hover:shadow-primary/10'
                }`}
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5 mr-2 inline group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                Agendar Ahora
                {!isMobile && (
                  <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
                    <span className="block w-1/3 h-full bg-white/20 blur-lg animate-shimmer-premium opacity-50"></span>
                  </span>
                )}
              </motion.button>
              
              <Button 
                variant="outline"
                className={`w-full sm:w-auto rounded-2xl font-medium transition-all duration-200 group ${
                  isMobile 
                    ? 'px-4 py-3 text-sm bg-background/50 backdrop-blur-sm border-border text-foreground hover:text-primary hover:bg-background/80 hover:border-primary/20' 
                    : 'px-6 py-4 text-base bg-white/50 backdrop-blur-sm border-gray-200 text-foreground hover:text-primary hover:bg-white/80 hover:border-primary/20'
                }`}
                onClick={() => {
                  const element = document.getElementById('casos-exito');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-105 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver Casos de Éxito
              </Button>
            </motion.div>

            {/* Features Grid optimizado para móvil oscuro */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
            >
              {[
                { icon: "clock", title: "Consulta en 24h", desc: "Agenda tu sesión y recibe atención inmediata", color: "slate" },
                { icon: "shield", title: "100% Seguro", desc: "Pago protegido y confidencialidad garantizada", color: "zinc" },
                { icon: "users", title: "Expertos", desc: "Abogados especializados en derecho laboral", color: "stone" }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 1.0 + index * 0.3,
                    ease: [0.16, 1, 0.3, 1] // Curva de animación lujosa
                  }}
                  whileHover={!isMobile ? { 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.8, ease: "easeOut" }
                  } : {}}
                >
                  {/* Card optimizada para móvil oscuro con efectos lujosos */}
                  <motion.div 
                    className={`relative rounded-2xl p-6 text-center border overflow-hidden ${
                      isMobile 
                        ? 'bg-muted/20 backdrop-blur-xl border-border/50' 
                        : 'bg-gradient-to-br from-white/40 via-white/20 to-white/10 backdrop-blur-md border-white/20'
                    }`}
                    animate={isMobile ? {
                      boxShadow: [
                        "0 4px 20px rgba(0, 0, 0, 0.1)",
                        "0 8px 40px rgba(0, 0, 0, 0.15)",
                        "0 4px 20px rgba(0, 0, 0, 0.1)"
                      ],
                      y: [0, -3, 0],
                      rotateX: [0, 2, 0],
                      rotateY: [0, 1, 0]
                    } : {}}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.8
                    }}
                    whileHover={isMobile ? {
                      backgroundColor: "rgba(var(--muted), 0.4)",
                      scale: 1.03,
                      y: -5,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                    } : {}}
                  >
                    
                    {/* Efectos visuales adaptativos */}
                    {!isMobile && (
                      <>
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      </>
                    )}
                    
                    {/* Efectos de brillo para móvil */}
                    {isMobile && (
                      <>
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-40"
                          animate={{
                            x: ["-100%", "100%"],
                            opacity: [0, 0.6, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 2
                          }}
                        />
                        <motion.div 
                          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                          animate={{
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 1.5
                          }}
                        />
                      </>
                    )}
                    
                    {/* Contenido */}
                    <div className="relative z-10">
                      <motion.div 
                        className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                          feature.color === 'slate' ? 'bg-slate-500/20 shadow-slate-500/20' :
                          feature.color === 'zinc' ? 'bg-zinc-500/20 shadow-zinc-500/20' :
                          'bg-stone-500/20 shadow-stone-500/20'
                        }`}
                        animate={isMobile ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                          boxShadow: [
                            "0 4px 15px rgba(0, 0, 0, 0.1)",
                            "0 8px 30px rgba(0, 0, 0, 0.2)",
                            "0 4px 15px rgba(0, 0, 0, 0.1)"
                          ]
                        } : {}}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 1.2
                        }}
                        whileHover={!isMobile ? { scale: 1.1 } : {}}
                      >
                        {feature.icon === 'clock' && (
                          <Clock className={`w-7 h-7 drop-shadow-sm ${
                            feature.color === 'slate' ? 'text-slate-400' :
                            feature.color === 'zinc' ? 'text-zinc-400' :
                            'text-stone-400'
                          }`} />
                        )}
                        {feature.icon === 'shield' && (
                          <Shield className={`w-7 h-7 drop-shadow-sm ${
                            feature.color === 'slate' ? 'text-slate-400' :
                            feature.color === 'zinc' ? 'text-zinc-400' :
                            'text-stone-400'
                          }`} />
                        )}
                        {feature.icon === 'users' && (
                          <Users className={`w-7 h-7 drop-shadow-sm ${
                            feature.color === 'slate' ? 'text-slate-400' :
                            feature.color === 'zinc' ? 'text-zinc-400' :
                            'text-stone-400'
                          }`} />
                        )}
                      </motion.div>
                      <motion.h3 
                        className={`font-medium mb-2 drop-shadow-sm ${
                          isMobile ? 'text-sm text-foreground' : 'text-sm text-foreground'
                        }`}
                        animate={isMobile ? {
                          opacity: [0.8, 1, 0.8],
                          y: [0, -1, 0]
                        } : {}}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 1.5
                        }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p 
                        className={`text-muted-foreground ${
                          isMobile ? 'text-xs' : 'text-xs'
                        }`}
                        animate={isMobile ? {
                          opacity: [0.7, 1, 0.7],
                          y: [0, -0.5, 0]
                        } : {}}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 1.8
                        }}
                      >
                        {feature.desc}
                      </motion.p>
                    </div>
                    
                    {/* Borde brillante inferior - solo desktop */}
                    {!isMobile && (
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                    )}
                  </motion.div>
                  
                  {/* Sombra de cristal - solo desktop */}
                  {!isMobile && (
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-primary/5 blur-xl transform translate-y-2 group-hover:translate-y-3 transition-transform duration-500"></div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;