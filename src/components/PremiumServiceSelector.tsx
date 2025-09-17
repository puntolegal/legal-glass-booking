import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Heart, 
  Building2, 
  Home, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  color: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
  };
  icon: React.ComponentType<any>;
  plan: string;
}

const services: Service[] = [
  {
    id: 'general',
    name: 'Consulta General',
    description: 'Asesoría jurídica integral para cualquier tema legal',
    price: '$35.000',
    originalPrice: '$70.000',
    discount: '50% OFF',
    color: {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'from-blue-100 to-blue-200',
      accent: 'blue-500',
      bg: 'blue-50',
      text: 'blue-700'
    },
    icon: Scale,
    plan: 'general'
  },
  {
    id: 'familia',
    name: 'Consulta Familia',
    description: 'Especialistas en derecho familiar, divorcios y pensiones',
    price: '$35.000',
    originalPrice: '$70.000',
    discount: '50% OFF',
    color: {
      primary: 'from-rose-500 to-pink-600',
      secondary: 'from-rose-100 to-pink-200',
      accent: 'rose-500',
      bg: 'rose-50',
      text: 'rose-700'
    },
    icon: Heart,
    plan: 'familia'
  },
  {
    id: 'empresarial',
    name: 'Consulta Empresarial',
    description: 'Derecho corporativo, contratos y constitución de empresas',
    price: '$35.000',
    originalPrice: '$70.000',
    discount: '50% OFF',
    color: {
      primary: 'from-purple-500 to-purple-600',
      secondary: 'from-purple-100 to-purple-200',
      accent: 'purple-500',
      bg: 'purple-50',
      text: 'purple-700'
    },
    icon: Building2,
    plan: 'corporativo'
  },
  {
    id: 'inmobiliaria',
    name: 'Consulta Inmobiliaria',
    description: 'Compraventa, arriendos y gestión de propiedades',
    price: '$27.500',
    originalPrice: '$55.000',
    discount: '50% OFF',
    color: {
      primary: 'from-emerald-500 to-green-600',
      secondary: 'from-emerald-100 to-green-200',
      accent: 'emerald-500',
      bg: 'emerald-50',
      text: 'emerald-700'
    },
    icon: Home,
    plan: 'inmobiliario'
  }
];

export const PremiumServiceSelector: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedService = services[selectedIndex];

  const handleServiceChange = (direction: 'prev' | 'next') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (direction === 'next') {
      setSelectedIndex((prev) => (prev + 1) % services.length);
    } else {
      setSelectedIndex((prev) => (prev - 1 + services.length) % services.length);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleAgendarClick = () => {
    navigate(`/agendamiento?plan=${selectedService.plan}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${selectedService.color.primary} rounded-3xl blur-3xl opacity-20 scale-105`} />
      
      {/* Main Container */}
      <motion.div
        ref={containerRef}
        className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 overflow-hidden"
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header con indicadores */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            {services.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex 
                    ? `w-8 bg-gradient-to-r ${selectedService.color.primary}` 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
                layoutId={index === selectedIndex ? 'activeIndicator' : undefined}
              />
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {selectedIndex + 1} de {services.length} servicios
            </p>
          </div>
        </div>

        {/* Service Content */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
              className="text-center"
            >
              {/* Service Icon */}
              <motion.div
                className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${selectedService.color.primary} flex items-center justify-center shadow-xl`}
                style={{ boxShadow: `0 20px 40px ${selectedService.color.accent}30` }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <selectedService.icon className="w-10 h-10 text-white" />
              </motion.div>

              {/* Service Name */}
              <h2 className={`text-2xl font-bold mb-3 text-${selectedService.color.text} dark:text-white`}>
                {selectedService.name}
              </h2>

              {/* Service Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm">
                {selectedService.description}
              </p>

              {/* Price Section */}
              <div className={`bg-gradient-to-r ${selectedService.color.secondary} dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl p-5 mb-6 border border-${selectedService.color.accent}/20`}>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className={`text-3xl font-bold text-${selectedService.color.accent} dark:text-white`}>
                    {selectedService.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {selectedService.originalPrice}
                  </span>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <span className={`bg-gradient-to-r ${selectedService.color.primary} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                    {selectedService.discount}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Oferta limitada
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={handleAgendarClick}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r ${selectedService.color.primary} text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300`}
                style={{ boxShadow: `0 10px 30px ${selectedService.color.accent}40` }}
              >
                <Calendar className="w-5 h-5" />
                Agendar Ahora
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none">
          <motion.button
            onClick={() => handleServiceChange('prev')}
            disabled={isAnimating}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full shadow-lg border border-white/30 dark:border-gray-700/30 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={() => handleServiceChange('next')}
            disabled={isAnimating}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full shadow-lg border border-white/30 dark:border-gray-700/30 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all pointer-events-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Swipe Gesture Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"
          >
            <span>Desliza</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Service Quick Info */}
      <motion.div
        layout
        className="mt-4 text-center"
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Toca las flechas o desliza para ver más servicios
        </p>
      </motion.div>
    </div>
  );
};

export default PremiumServiceSelector;
