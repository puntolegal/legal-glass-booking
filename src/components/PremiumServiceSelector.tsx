import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Heart, 
  Building2, 
  Home, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Shield,
  Star,
  Zap,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  discountPercentage: number;
  highlights: string[];
  color: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
    gradient: string;
    shadow: string;
  };
  icon: React.ComponentType<any>;
  plan: string;
  badge?: string;
  popularity?: number;
}

const services: Service[] = [
  {
    id: 'general',
    name: 'Consulta General',
    description: 'Asesoría jurídica integral en múltiples áreas del derecho',
    price: '35.000',
    originalPrice: '70.000',
    discount: '50% OFF',
    discountPercentage: 50,
    highlights: [
      'Primera consulta integral',
      'Análisis profesional',
      'Orientación legal completa'
    ],
    color: {
      primary: 'from-primary to-accent',
      secondary: 'from-orange-50 to-amber-50',
      accent: 'primary',
      bg: 'orange-50',
      text: 'orange-700',
      gradient: 'from-orange-500 to-amber-600',
      shadow: 'shadow-orange-500/20'
    },
    icon: Scale,
    plan: 'general',
    badge: 'Más Popular',
    popularity: 95
  },
  {
    id: 'familia',
    name: 'Consulta Familia',
    description: 'Expertos en divorcios, pensiones y asuntos familiares',
    price: '35.000',
    originalPrice: '70.000',
    discount: '50% OFF',
    discountPercentage: 50,
    highlights: [
      'Divorcios y separaciones',
      'Pensiones de alimentos',
      'Régimen de visitas'
    ],
    color: {
      primary: 'from-rose-500 to-pink-600',
      secondary: 'from-rose-50 to-pink-50',
      accent: 'rose-500',
      bg: 'rose-50',
      text: 'rose-700',
      gradient: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/20'
    },
    icon: Heart,
    plan: 'familia',
    popularity: 85
  },
  {
    id: 'empresarial',
    name: 'Consulta Empresarial',
    description: 'Constitución de empresas y asesoría corporativa',
    price: '35.000',
    originalPrice: '70.000',
    discount: '50% OFF',
    discountPercentage: 50,
    highlights: [
      'Constitución SpA/EIRL',
      'Contratos comerciales',
      'Asesoría tributaria'
    ],
    color: {
      primary: 'from-purple-500 to-indigo-600',
      secondary: 'from-purple-50 to-indigo-50',
      accent: 'purple-500',
      bg: 'purple-50',
      text: 'purple-700',
      gradient: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-500/20'
    },
    icon: Building2,
    plan: 'corporativo',
    badge: 'Startups',
    popularity: 90
  },
  {
    id: 'inmobiliaria',
    name: 'Consulta Inmobiliaria',
    description: 'Compraventa, arriendos y gestión de propiedades',
    price: '27.500',
    originalPrice: '55.000',
    discount: '50% OFF',
    discountPercentage: 50,
    highlights: [
      'Compraventa segura',
      'Contratos de arriendo',
      'Estudio de títulos'
    ],
    color: {
      primary: 'from-emerald-500 to-teal-600',
      secondary: 'from-emerald-50 to-teal-50',
      accent: 'emerald-500',
      bg: 'emerald-50',
      text: 'emerald-700',
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20'
    },
    icon: Home,
    plan: 'inmobiliario',
    popularity: 75
  }
];

export const PremiumServiceSelector: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, [-200, 200], [-15, 15]);
  const opacity = useTransform(dragX, [-200, 0, 200], [0.8, 1, 0.8]);

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

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;

    if (diff > 50) {
      handleServiceChange('next');
      setTouchStart(0);
    }

    if (diff < -50) {
      handleServiceChange('prev');
      setTouchStart(0);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-4">
      {/* Premium Background Gradient */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, ${selectedService.color.bg} 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${selectedService.color.bg} 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${selectedService.color.bg} 0%, transparent 50%)`
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Main Container - Premium Glass Design */}
      <motion.div
        ref={containerRef}
        className="relative bg-white/98 dark:bg-gray-900/98 backdrop-blur-2xl rounded-[2rem] border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden"
        layout
        style={{ 
          rotateY,
          opacity,
          boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.1) inset'
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.x > 100 || velocity.x > 200) {
            handleServiceChange('prev');
          } else if (offset.x < -100 || velocity.x < -200) {
            handleServiceChange('next');
          }
          dragX.set(0);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Premium Header */}
        <div className="relative p-6 pb-0">
          {/* Badge (if any) */}
          {selectedService.badge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-3 right-6 z-10"
            >
              <div className={`bg-gradient-to-r ${selectedService.color.gradient} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1`}>
                <Award className="w-3 h-3" />
                {selectedService.badge}
              </div>
            </motion.div>
          )}

          {/* Progress Indicators - Premium Style */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {services.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className="relative"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === selectedIndex 
                      ? 'w-8' 
                      : 'w-2'
                  }`}
                  style={{
                    background: index === selectedIndex 
                      ? `linear-gradient(90deg, ${selectedService.color.bg}, ${selectedService.color.accent})`
                      : 'rgba(156, 163, 175, 0.3)'
                  }}
                />
                {index === selectedIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{
                      background: `linear-gradient(90deg, ${selectedService.color.bg}, ${selectedService.color.accent})`
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Service Content - Enhanced */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              className="space-y-4"
            >
              {/* Service Icon - Premium Design */}
              <motion.div className="relative mx-auto w-fit">
                <motion.div
                  className={`w-24 h-24 rounded-[1.75rem] bg-gradient-to-br ${selectedService.color.gradient} flex items-center justify-center shadow-2xl relative overflow-hidden`}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                  <selectedService.icon className="w-12 h-12 text-white relative z-10" />
                  
                  {/* Floating particles */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/40 rounded-full"
                        animate={{
                          x: [0, Math.random() * 40 - 20],
                          y: [20, -20],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                        style={{
                          left: `${20 + i * 25}%`,
                          bottom: 0
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>

                {/* Popularity indicator */}
                {selectedService.popularity && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-xl p-1.5 shadow-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {selectedService.popularity}%
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Service Name & Description */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {selectedService.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {selectedService.description}
                </p>
              </div>

              {/* Highlights - Premium Cards */}
              <div className="space-y-2 pt-2">
                {selectedService.highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedService.color.secondary} flex items-center justify-center`}>
                      <Star className="w-4 h-4" style={{ color: selectedService.id === 'general' ? '#ff6b35' : selectedService.id === 'familia' ? '#f43f5e' : selectedService.id === 'empresarial' ? '#a855f7' : '#10b981' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {highlight}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Price Section - Premium Design */}
              <motion.div 
                className="relative mt-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          ${selectedService.price}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          ${selectedService.originalPrice}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Precio especial por tiempo limitado
                      </p>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className={`bg-gradient-to-r ${selectedService.color.gradient} text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg`}
                    >
                      {selectedService.discount}
                    </motion.div>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs">Pago seguro</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Respuesta 24h</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">+500 clientes</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button - Premium Style */}
              <motion.button
                onClick={handleAgendarClick}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${selectedService.color.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                
                <div className="relative bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl">
                  <Calendar className="w-5 h-5" />
                  <span>Agendar Consulta</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls - Premium Glass Style */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <motion.button
            onClick={() => handleServiceChange('prev')}
            disabled={isAnimating}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all pointer-events-auto group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </motion.button>
          
          <motion.button
            onClick={() => handleServiceChange('next')}
            disabled={isAnimating}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all pointer-events-auto group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom hint - Premium Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400"
      >
        <Zap className="w-3 h-3" />
        <span>Desliza o usa las flechas para explorar más opciones</span>
        <Zap className="w-3 h-3 scale-x-[-1]" />
      </motion.div>
    </div>
  );
};

export default PremiumServiceSelector;
