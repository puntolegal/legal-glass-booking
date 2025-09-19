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
      primary: 'from-orange-500 to-amber-600',
      secondary: 'from-orange-50 to-amber-50',
      accent: '#ff6b35',
      bg: 'orange-50',
      text: 'orange-700',
      gradient: 'from-orange-500 to-amber-600',
      shadow: '0 20px 40px rgba(255, 107, 53, 0.25)'
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
      primary: 'from-pink-500 to-rose-600',
      secondary: 'from-pink-50 to-rose-50',
      accent: '#ec4899',
      bg: 'pink-50',
      text: 'pink-700',
      gradient: 'from-pink-500 to-rose-600',
      shadow: '0 20px 40px rgba(236, 72, 153, 0.25)'
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
      primary: 'from-blue-600 to-indigo-600',
      secondary: 'from-blue-50 to-indigo-50',
      accent: '#3b82f6',
      bg: 'blue-50',
      text: 'blue-700',
      gradient: 'from-blue-600 to-indigo-600',
      shadow: '0 20px 40px rgba(59, 130, 246, 0.25)'
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
      primary: 'from-emerald-600 to-green-600',
      secondary: 'from-emerald-50 to-green-50',
      accent: '#10b981',
      bg: 'emerald-50',
      text: 'emerald-700',
      gradient: 'from-emerald-600 to-green-600',
      shadow: '0 20px 40px rgba(16, 185, 129, 0.25)'
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

  const handleServiceClick = () => {
    if (selectedService.id === 'familia') {
      navigate('/servicios/familia');
    } else if (selectedService.id === 'empresarial') {
      navigate('/servicios/corporativo');
    } else if (selectedService.id === 'inmobiliaria') {
      navigate('/servicios/inmobiliario');
    }
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

          {/* Progress Indicators - Service Color Theme */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {services.map((service, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className="relative"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    index === selectedIndex 
                      ? 'w-10' 
                      : 'w-2.5'
                  }`}
                  style={{
                    background: index === selectedIndex 
                      ? `linear-gradient(90deg, ${service.color.accent}, ${service.color.accent}dd)`
                      : service.color.accent + '30'
                  }}
                />
                {index === selectedIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      background: service.color.accent,
                      filter: 'blur(4px)'
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
              {/* Service Icon - iOS Premium Glass */}
              <motion.div className="relative mx-auto w-fit mb-6">
                {/* Main icon container */}
                <motion.button
                  className="relative w-28 h-28 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleServiceClick}
                  disabled={selectedService.id === 'general'}
                >
                  {/* Glass background layers */}
                  <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl" />
                  
                  {/* Premium gradient border */}
                  <div className="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-br from-white/60 via-white/30 to-white/60 dark:from-gray-700/60 dark:via-gray-600/30 dark:to-gray-700/60">
                    <div className="h-full w-full bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 rounded-[2rem]" />
                  </div>
                  
                  {/* Inner icon container with service color */}
                  <div className={`absolute inset-2 rounded-[1.5rem] bg-gradient-to-br ${selectedService.color.gradient} shadow-inner overflow-hidden`}>
                    {/* Glass shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-white/10 to-transparent" />
                    
                    {/* Icon */}
                    <div className="relative h-full w-full flex items-center justify-center">
                      <selectedService.icon className="w-14 h-14 text-white drop-shadow-lg" strokeWidth={1.5} />
                    </div>
                    
                    {/* Subtle shimmer effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          repeatDelay: 4,
                          ease: "easeInOut"
                        }}
                        style={{
                          transform: 'skewX(-15deg)'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Subtle outer glow */}
                  <div
                    className="absolute -inset-1 rounded-[2rem] opacity-20"
                    style={{ boxShadow: selectedService.color.shadow }}
                  />
                </motion.button>

                {/* Popularity indicator - Premium Glass */}
                {selectedService.popularity && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="absolute -bottom-3 -right-3"
                  >
                    <div className="relative">
                      {/* Glass background */}
                      <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-lg" />
                      
                      {/* Content */}
                      <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-2 border border-green-200/50 dark:border-green-700/50">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-bold text-green-700 dark:text-green-300">
                            {selectedService.popularity}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Service Badge */}
                {selectedService.badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full px-3 py-1 shadow-sm">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {selectedService.badge}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Click indicator for services */}
                {selectedService.id !== 'general' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
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

              {/* Highlights - iOS Premium Glass Cards */}
              <div className="space-y-2.5 pt-2">
                {selectedService.highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ x: 4 }}
                    className="relative group"
                  >
                    {/* Glass background */}
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl" />
                    
                    {/* Premium border */}
                    <div className="absolute inset-0 rounded-xl p-[0.5px] bg-gradient-to-r from-gray-200/30 to-gray-300/30 dark:from-gray-700/30 dark:to-gray-600/30">
                      <div className="h-full w-full bg-white/80 dark:bg-gray-900/80 rounded-xl" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative flex items-center gap-3 p-3.5 rounded-xl">
                      {/* Icon container with service color */}
                      <div className="relative">
                        <div 
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                          style={{ 
                            background: `linear-gradient(135deg, ${selectedService.color.accent}15, ${selectedService.color.accent}25)`,
                          }}
                        >
                          <Star 
                            className="w-4.5 h-4.5" 
                            style={{ color: selectedService.color.accent }}
                            strokeWidth={2} 
                          />
                        </div>
                        {/* Subtle static glow on hover only */}
                        <div
                          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            boxShadow: `0 0 0 2px ${selectedService.color.accent}20`
                          }}
                        />
                      </div>
                      
                      {/* Text */}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                        {highlight}
                      </span>
                      
                      {/* Arrow on hover */}
                      <ChevronRight className="w-4 h-4 text-primary/40 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Price Section - Luxury Glass Design */}
              <motion.div 
                className="relative mt-6"
                whileHover={{ scale: 1.01 }}
              >
                {/* Multi-layer glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl blur-2xl" />
                
                {/* Main glass container */}
                <div className="relative">
                  {/* Background glass */}
                  <div className="absolute inset-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-2xl rounded-2xl" />
                  
                  {/* Premium border gradient */}
                  <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-primary/20 via-transparent to-accent/20">
                    <div className="h-full w-full bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 rounded-2xl" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative p-5 rounded-2xl">
                    {/* Price header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span 
                            className="text-4xl font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: `linear-gradient(135deg, ${selectedService.color.accent}, ${selectedService.color.accent}dd)` }}
                          >
                            ${selectedService.price}
                          </span>
                          <span className="text-lg text-gray-400 line-through decoration-2">
                            ${selectedService.originalPrice}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Precio especial por tiempo limitado
                        </p>
                      </div>
                      
                      {/* Discount badge - Elegant Legal Style */}
                      <div className="relative">
                        {/* Subtle glow effect */}
                        <div 
                          className="absolute inset-0 rounded-lg blur-md opacity-20"
                          style={{ background: selectedService.color.accent }}
                        />
                        
                        {/* Main badge */}
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-3 py-1.5 shadow-sm">
                          <div className="flex items-center gap-2">
                            {/* Accent dot */}
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: selectedService.color.accent }}
                            />
                            
                            {/* Discount text */}
                            <span 
                              className="text-xs font-semibold"
                              style={{ color: selectedService.color.accent }}
                            >
                              {selectedService.discount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Premium divider */}
                    <div className="relative h-[1px] mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />
                    </div>

                    {/* Trust indicators - Glass pills */}
                    <div className="flex items-center justify-center gap-2">
                      {[
                        { icon: Shield, text: 'Pago seguro', color: 'from-blue-500/10 to-cyan-500/10' },
                        { icon: Clock, text: '24 horas', color: 'from-orange-500/10 to-amber-500/10' },
                        { icon: Users, text: '+500', color: 'from-purple-500/10 to-pink-500/10' }
                      ].map((item, index) => (
                        <motion.div
                          key={item.text}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="relative group"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity`} />
                          <div className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/30 dark:border-gray-700/30">
                            <div className="flex items-center gap-1.5">
                              <item.icon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.text}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button - Service Color Theme */}
              <motion.button
                onClick={handleAgendarClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full mt-4"
              >
                {/* Dynamic background with service color */}
                <div className={`absolute inset-0 bg-gradient-to-r ${selectedService.color.gradient} opacity-95 rounded-2xl`} />
                
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />
                
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ boxShadow: selectedService.color.shadow }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Premium border */}
                <div className="absolute inset-0 rounded-2xl p-[0.5px] bg-gradient-to-r from-white/20 via-white/10 to-white/20">
                  <div className="h-full w-full bg-black/5 rounded-2xl" />
                </div>
                
                {/* Button content */}
                <div className="relative py-4 px-6 rounded-2xl">
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-all duration-700 rounded-2xl" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    
                    <span className="text-lg font-bold text-white">
                      Agendar Consulta
                    </span>
                    
                    <motion.div
                      className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Subtitle */}
                  <p className="text-xs text-white/80 text-center mt-1">
                    Respuesta garantizada en 24 horas
                  </p>
                </div>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls - iOS Premium Glass */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3 right-3 flex justify-between pointer-events-none">
          <motion.button
            onClick={() => handleServiceChange('prev')}
            disabled={isAnimating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 pointer-events-auto group"
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-lg" />
            
            {/* Premium border */}
            <div className="absolute inset-0 rounded-2xl p-[0.5px] bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50">
              <div className="h-full w-full bg-white/90 dark:bg-gray-900/90 rounded-2xl" />
            </div>
            
            {/* Icon container */}
            <div className="relative h-full w-full flex items-center justify-center rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors relative z-10" />
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => handleServiceChange('next')}
            disabled={isAnimating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 pointer-events-auto group"
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-lg" />
            
            {/* Premium border */}
            <div className="absolute inset-0 rounded-2xl p-[0.5px] bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50">
              <div className="h-full w-full bg-white/90 dark:bg-gray-900/90 rounded-2xl" />
            </div>
            
            {/* Icon container */}
            <div className="relative h-full w-full flex items-center justify-center rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors relative z-10" />
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom hint - Luxury Glass Pill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="mt-6 flex justify-center"
      >
        <div className="relative">
          {/* Glass background */}
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-full" />
          
          {/* Premium border */}
          <div className="absolute inset-0 rounded-full p-[0.5px] bg-gradient-to-r from-gray-200/30 via-gray-300/30 to-gray-200/30 dark:from-gray-700/30 dark:via-gray-600/30 dark:to-gray-700/30">
            <div className="h-full w-full bg-white/80 dark:bg-gray-900/80 rounded-full" />
          </div>
          
          {/* Content */}
          <div className="relative flex items-center gap-2 px-4 py-2 rounded-full">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3 h-3 text-primary/60" />
            </motion.div>
            
            <span className="text-xs font-medium text-muted-foreground">
              Desliza para ver más servicios
            </span>
            
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center"
            >
              <ChevronRight className="w-3 h-3 text-primary/60" />
              <ChevronRight className="w-3 h-3 text-primary/40 -ml-1.5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumServiceSelector;
