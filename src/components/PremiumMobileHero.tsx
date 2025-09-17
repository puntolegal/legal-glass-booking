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
        
        {/* Animated Gradient Orbs - Orange theme */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
          />
          
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              rotate: [180, 0, 180],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"
          />
        </motion.div>

        {/* Premium Glass Overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        {/* Floating Glass Elements */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 bg-white/5 dark:bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${0.5 + Math.random() * 0.5})`
            }}
          />
        ))}
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
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-[1.75rem] flex items-center justify-center shadow-2xl shadow-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20" />
              <span className="text-white font-bold text-3xl relative z-10">P</span>
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

        {/* Trust Indicators - Premium Glass Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="grid grid-cols-3 gap-3 w-full max-w-sm"
        >
          {[
            { 
              icon: Shield, 
              text: '100% Seguro', 
              subtext: 'Protegido',
              gradient: 'from-blue-500 to-cyan-600' 
            },
            { 
              icon: Zap, 
              text: 'Respuesta 24h', 
              subtext: 'Garantizada',
              gradient: 'from-primary to-accent' 
            },
            { 
              icon: Star, 
              text: '5.0 Rating', 
              subtext: 'Excelencia',
              gradient: 'from-purple-500 to-pink-600' 
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-700/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-3 border border-white/50 dark:border-gray-700/50 shadow-lg">
                <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-foreground">
                  {feature.text}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {feature.subtext}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs font-medium">Explora más</span>
            <ArrowDown className="w-4 h-4" />
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