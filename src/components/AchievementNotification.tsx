import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Crown, Flame, Target, CheckCircle } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  points: number;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievement, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Esperar a que termine la animación
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.3 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 25
            }
          }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            scale: 0.3,
            transition: { duration: 0.3 }
          }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className={`relative overflow-hidden bg-gradient-to-r ${achievement.color} rounded-2xl shadow-2xl border border-white/20 p-6`}>
            {/* Efectos de fondo */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            
            {/* Contenido */}
            <div className="relative">
              <div className="flex items-start space-x-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 0.9, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="flex-shrink-0 p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                >
                  {achievement.icon}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.h3 
                    className="text-lg font-bold text-white mb-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    ¡Logro Desbloqueado!
                  </motion.h3>
                  <motion.p 
                    className="text-white/90 font-medium mb-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {achievement.title}
                  </motion.p>
                  <motion.p 
                    className="text-white/80 text-sm mb-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {achievement.description}
                  </motion.p>
                  <motion.div 
                    className="flex items-center space-x-1 text-yellow-200"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">+{achievement.points} puntos</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Botón de cerrar */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Barra de progreso de tiempo */}
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Función helper para crear logros
export const createAchievement = (type: string, data: any): Achievement | null => {
  switch (type) {
    case 'first_note':
      return {
        id: 'first_note',
        title: 'Primer Paso',
        description: 'Has leído tu primera nota legal',
        icon: <CheckCircle className="w-6 h-6 text-white" />,
        color: 'from-green-500 to-emerald-600',
        points: 25
      };
    
    case 'streak_3':
      return {
        id: 'streak_3',
        title: 'En Racha',
        description: '3 días consecutivos estudiando',
        icon: <Flame className="w-6 h-6 text-white" />,
        color: 'from-orange-500 to-red-600',
        points: 50
      };
    
    case 'level_up':
      return {
        id: 'level_up',
        title: `Nivel ${data.level}`,
        description: `Has alcanzado el nivel ${data.level}`,
        icon: <Crown className="w-6 h-6 text-white" />,
        color: 'from-yellow-500 to-amber-600',
        points: data.level * 100
      };
    
    case 'quiz_perfect':
      return {
        id: 'quiz_perfect',
        title: 'Quiz Perfecto',
        description: 'Respondiste todas las preguntas correctamente',
        icon: <Trophy className="w-6 h-6 text-white" />,
        color: 'from-purple-500 to-indigo-600',
        points: 75
      };
    
    case 'daily_goal':
      return {
        id: 'daily_goal',
        title: 'Meta Diaria',
        description: 'Completaste tu meta diaria de estudio',
        icon: <Target className="w-6 h-6 text-white" />,
        color: 'from-blue-500 to-cyan-600',
        points: 30
      };
    
    default:
      return null;
  }
};

export default AchievementNotification; 