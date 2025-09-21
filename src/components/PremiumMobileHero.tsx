import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Shield, Clock, Award, Scale, CheckCircle, Building2, Users, Gavel, Crown } from 'lucide-react';
import PremiumServiceSelector from './PremiumServiceSelector';

export const PremiumMobileHero: React.FC = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Premium Background - Consistent with web style */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-background to-amber-50/30 dark:from-orange-950/10 dark:via-background dark:to-amber-950/10" />
        
        {/* Static Gradient Orbs - Professional look */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />
        </div>

        {/* Premium Glass Overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        {/* Subtle Background Pattern - Professional */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12"
      >
        {/* Header Section - Premium Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-6"
        >
          {/* Logo - Orange gradient consistent with brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.1 
            }}
            className="relative mx-auto mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[1.75rem] flex items-center justify-center shadow-2xl shadow-orange-500/30 relative overflow-hidden mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-3xl">P</span>
              </div>
            </div>
          </motion.div>

          {/* Title with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-bold mb-3"
          >
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Punto Legal
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-muted-foreground mb-4 text-lg"
          >
            Tu socio legal de confianza
          </motion.p>

          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-xl border border-primary/20 rounded-full px-5 py-2.5 shadow-lg"
          >
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold text-sm">
              Más de 10 años de experiencia
            </span>
            <span>🇨🇱</span>
          </motion.div>
        </motion.div>

        {/* Service Selector - Main Focus */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="w-full mb-8"
        >
          <PremiumServiceSelector />
        </motion.div>

        {/* Trust Indicators - Manhattan Legal Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="w-full max-w-sm"
        >
          {/* Header elegante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-center mb-6"
          >
            <h3 className="text-lg font-bold text-foreground mb-2">
              Estudio Jurídico de Excelencia
            </h3>
            <p className="text-muted-foreground text-sm">
              Estándares internacionales • Manhattan Style
            </p>
          </motion.div>

          {/* Grid de indicadores profesionales */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                icon: Shield, 
                text: 'Confidencialidad', 
                subtext: '100% Protegido',
                gradient: 'from-slate-600 to-slate-700',
                accent: 'from-blue-500 to-blue-600'
              },
              { 
                icon: Clock, 
                text: 'Respuesta Inmediata', 
                subtext: '24/7 Disponible',
                gradient: 'from-slate-600 to-slate-700',
                accent: 'from-orange-500 to-amber-600'
              },
              { 
                icon: Award, 
                text: 'Excelencia Legal', 
                subtext: '10+ Años Experiencia',
                gradient: 'from-slate-600 to-slate-700',
                accent: 'from-amber-500 to-yellow-600'
              },
              { 
                icon: Scale, 
                text: 'Ética Profesional', 
                subtext: 'Certificado',
                gradient: 'from-slate-600 to-slate-700',
                accent: 'from-emerald-500 to-green-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 dark:from-slate-700/80 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50 dark:border-slate-600/50 shadow-xl hover:shadow-2xl hover:shadow-slate-900/50 dark:hover:shadow-slate-800/50 transition-all duration-300"
              >
                {/* Efecto de brillo sutil */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icono con gradiente elegante */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-3 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Texto principal */}
                <p className="text-foreground text-sm font-semibold text-center mb-1 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300">
                  {feature.text}
                </p>
                
                {/* Subtexto */}
                <p className="text-muted-foreground text-xs text-center group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.subtext}
                </p>

                {/* Línea de acento sutil */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r ${feature.accent} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            ))}
          </div>

          {/* Badge de certificación profesional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800/60 to-slate-900/60 dark:from-slate-700/60 dark:to-slate-800/60 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-700/50 dark:border-slate-600/50 shadow-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-foreground text-xs font-medium">
                Estudio Jurídico Certificado
              </span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </motion.div>
        </motion.div>


        {/* Bottom Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 dark:border-gray-700/30">
            <Sparkles className="w-3 h-3" />
            <span>Innovación legal chilena</span>
            <span>•</span>
            <span>Hecho con ❤️ en 🇨🇱</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PremiumMobileHero;