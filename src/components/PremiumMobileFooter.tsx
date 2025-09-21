/**
 * Footer móvil premium con acabados de lujo
 * Diseño glassmorphism y elementos de alta calidad
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  Star, 
  Award, 
  Lightbulb, 
  MapPin, 
  Phone, 
  Mail,
  ArrowUp,
  Heart,
  Sparkles
} from 'lucide-react';

const PremiumMobileFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trustIndicators = [
    {
      icon: <Shield className="w-5 h-5" />,
      text: "100% Seguro",
      description: "Protección total"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Respuesta 24h",
      description: "Atención inmediata"
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: "5.0 Rating",
      description: "Excelencia garantizada"
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "Garantizada",
      description: "Calidad premium"
    }
  ];

  return (
    <motion.footer 
      className="relative mt-20 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Efectos de fondo premium */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10" />
      
      {/* Efectos de luz */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 right-1/4 w-24 h-24 bg-amber-500/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        {/* Sección principal */}
        <div className="px-6 py-12">
          {/* Logo y descripción */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Punto Legal</h3>
                <p className="text-orange-400 text-sm font-medium">Innovación legal chilena</p>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
              Asesoría legal premium con tecnología de vanguardia. 
              Protegemos tus derechos con la máxima excelencia.
            </p>
          </motion.div>

          {/* Indicadores de confianza */}
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-orange-400">
                    {indicator.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{indicator.text}</p>
                    <p className="text-slate-400 text-xs">{indicator.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Información de contacto */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              Contacto
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-sm">+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="text-sm">puntolegalelgolf@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-sm">Santiago, Chile</span>
              </div>
            </div>
          </motion.div>

          {/* Botón de scroll to top */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </motion.button>
          </motion.div>

          {/* Footer bottom */}
          <motion.div 
            className="text-center border-t border-white/10 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300 text-sm">Hecho con calidad, producto chileno</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            
            <p className="text-slate-400 text-xs">
              © 2024 Punto Legal. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
              <span>Privacidad</span>
              <span>•</span>
              <span>Términos</span>
              <span>•</span>
              <span>Cookies</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default PremiumMobileFooter;
