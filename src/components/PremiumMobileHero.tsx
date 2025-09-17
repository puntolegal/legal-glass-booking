import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap, Star } from 'lucide-react';
import PremiumServiceSelector from './PremiumServiceSelector';

export const PremiumMobileHero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-rose-400/20 to-orange-500/20 rounded-full blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.1 
            }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30"
          >
            <span className="text-white font-bold text-2xl">P</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Punto Legal
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-600 dark:text-gray-300 mb-2"
          >
            Tu socio legal estratégico
          </motion.p>

          {/* Badge Premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200/50 dark:border-orange-700/30 rounded-full px-4 py-2"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-orange-700 dark:text-orange-400 text-sm font-medium">
              Startup Legal Chilena
            </span>
            <span className="text-blue-500">🇨🇱</span>
          </motion.div>
        </motion.div>

        {/* Service Selector */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="w-full mb-8"
        >
          <PremiumServiceSelector />
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="grid grid-cols-3 gap-4 w-full max-w-sm"
        >
          {[
            { icon: Shield, text: 'Seguro', color: 'text-blue-500' },
            { icon: Zap, text: 'Rápido', color: 'text-orange-500' },
            { icon: Star, text: 'Premium', color: 'text-purple-500' }
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/30 dark:border-gray-700/30 flex items-center justify-center shadow-lg">
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            ✨ Democratizamos el acceso a la justicia con tecnología
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Hecho con</span>
            <span className="text-red-500">❤️</span>
            <span>en Chile</span>
            <span className="text-blue-500">🇨🇱</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumMobileHero;
