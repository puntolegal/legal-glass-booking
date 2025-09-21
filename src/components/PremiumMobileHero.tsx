import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Shield, Zap, Star, ArrowDown, CheckCircle } from 'lucide-react';
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

        {/* Trust Indicators - Luxury Redesign */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-full max-w-md"
        >
          {/* Main Trust Card - Luxury Glass Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="relative group"
          >
            {/* Luxury Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main Glass Card */}
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10">
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full px-4 py-2 mb-4"
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    Garantías Premium
                  </span>
                </motion.div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Confianza Total
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tu tranquilidad es nuestra prioridad
                </p>
              </div>

              {/* Trust Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    icon: Shield, 
                    title: '100% Seguro', 
                    subtitle: 'Protegido',
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'
                  },
                  { 
                    icon: Zap, 
                    title: 'Respuesta 24h', 
                    subtitle: 'Garantizada',
                    color: 'from-orange-500 to-amber-500',
                    bgColor: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'
                  },
                  { 
                    icon: Star, 
                    title: '5.0 Rating', 
                    subtitle: 'Excelencia',
                    color: 'from-purple-500 to-pink-500',
                    bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20'
                  },
                  { 
                    icon: CheckCircle, 
                    title: 'Innovación', 
                    subtitle: 'Legal Chile',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative group/feature"
                  >
                    {/* Feature Card */}
                    <div className={`relative bg-gradient-to-br ${feature.bgColor} rounded-xl p-4 border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover/feature:shadow-xl transition-all duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Text */}
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {feature.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {feature.subtitle}
                        </p>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Accent */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 2.2 }}
                className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span>Certificación profesional</span>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </motion.div>
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