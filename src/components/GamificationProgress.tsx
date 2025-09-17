import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Award, 
  Zap,
  BookOpen,
  Calendar,
  Flame,
  Crown,
  Gem,
  Medal,
  Sparkles,
  CheckCircle,
  Eye,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useGamification } from '@/contexts/GamificationContext';
import { Progress } from '@/components/ui/progress';

// Importar medallas disponibles desde el contexto
const AVAILABLE_MEDALS = [
  {
    id: 'first-note',
    name: 'Primer Paso',
    description: 'Leíste tu primera nota',
    icon: '📚',
    color: 'bronze',
    category: 'general'
  },
  {
    id: 'three-notes',
    name: 'Estudiante Dedicado',
    description: 'Leíste 3 notas únicas',
    icon: '🥉',
    color: 'bronze',
    category: 'general'
  },
  {
    id: 'five-notes',
    name: 'Aprendiz Avanzado',
    description: 'Leíste 5 notas únicas',
    icon: '🥈',
    color: 'silver',
    category: 'general'
  },
  {
    id: 'ten-notes',
    name: 'Estudiante Experto',
    description: 'Leíste 10 notas únicas',
    icon: '🥇',
    color: 'gold',
    category: 'general'
  },
  {
    id: 'fifteen-notes',
    name: 'Maestro del Conocimiento',
    description: 'Leíste 15 notas únicas',
    icon: '👑',
    color: 'platinum',
    category: 'general'
  },
  {
    id: 'twenty-notes',
    name: 'Sabio Legal',
    description: 'Leíste 20 notas únicas',
    icon: '💎',
    color: 'diamond',
    category: 'general'
  },
  {
    id: 'civil-expert',
    name: 'Experto en Derecho Civil',
    description: 'Completaste 5 notas únicas de Derecho Civil',
    icon: '⚖️',
    color: 'blue',
    category: 'derecho-civil'
  },
  {
    id: 'procesal-expert',
    name: 'Experto en Derecho Procesal',
    description: 'Completaste 5 notas únicas de Derecho Procesal',
    icon: '🏛️',
    color: 'purple',
    category: 'derecho-procesal'
  },
  {
    id: 'streak-3',
    name: 'Consistente',
    description: '3 días consecutivos leyendo',
    icon: '🔥',
    color: 'orange',
    category: 'streak'
  },
  {
    id: 'streak-7',
    name: 'Dedicado',
    description: '7 días consecutivos leyendo',
    icon: '🔥🔥',
    color: 'red',
    category: 'streak'
  },
  {
    id: 'streak-14',
    name: 'Comprometido',
    description: '14 días consecutivos leyendo',
    icon: '🔥🔥🔥',
    color: 'purple',
    category: 'streak'
  },
  {
    id: 'speed-reader',
    name: 'Lector Veloz',
    description: 'Leíste 3 notas únicas en un día',
    icon: '⚡',
    color: 'yellow',
    category: 'speed'
  },
  {
    id: 'explorer',
    name: 'Explorador',
    description: 'Leíste notas de 3 categorías diferentes',
    icon: '🗺️',
    color: 'green',
    category: 'exploration'
  }
];

const GamificationProgress: React.FC = () => {
  const { progress, getProgressPercentage, getNextMilestone, getMedals, resetProgress } = useGamification();
  const [showMedals, setShowMedals] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const progressPercentage = getProgressPercentage();
  const nextMilestone = getNextMilestone();
  const medals = getMedals();

  const getMedalIcon = (medalId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'first-note': <BookOpen className="w-6 h-6" />,
      'three-notes': <Medal className="w-6 h-6" />,
      'five-notes': <Award className="w-6 h-6" />,
      'ten-notes': <Trophy className="w-6 h-6" />,
      'fifteen-notes': <Crown className="w-6 h-6" />,
      'twenty-notes': <Gem className="w-6 h-6" />,
      'civil-expert': <Star className="w-6 h-6" />,
      'procesal-expert': <Target className="w-6 h-6" />,
      'streak-3': <Flame className="w-6 h-6" />,
      'streak-7': <Flame className="w-6 h-6" />,
      'streak-14': <Flame className="w-6 h-6" />,
      'speed-reader': <Zap className="w-6 h-6" />,
      'explorer': <Target className="w-6 h-6" />
    };
    return iconMap[medalId] || <Medal className="w-6 h-6" />;
  };

  const getMedalColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'bronze': 'text-amber-600',
      'silver': 'text-gray-400',
      'gold': 'text-yellow-500',
      'platinum': 'text-blue-400',
      'diamond': 'text-purple-500',
      'blue': 'text-blue-500',
      'purple': 'text-purple-500',
      'orange': 'text-orange-500',
      'red': 'text-red-500',
      'yellow': 'text-yellow-500',
      'green': 'text-green-500'
    };
    return colorMap[color] || 'text-gray-500';
  };

  const getLevel = () => {
    const points = progress.totalPoints;
    if (points < 100) return { level: 1, name: 'Novato', color: 'text-gray-500' };
    if (points < 300) return { level: 2, name: 'Aprendiz', color: 'text-green-500' };
    if (points < 600) return { level: 3, name: 'Estudiante', color: 'text-blue-500' };
    if (points < 1000) return { level: 4, name: 'Experto', color: 'text-purple-500' };
    if (points < 1500) return { level: 5, name: 'Maestro', color: 'text-yellow-500' };
    return { level: 6, name: 'Sabio', color: 'text-red-500' };
  };

  const level = getLevel();

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
      {/* Header con nivel */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Trophy className="w-6 h-6 text-amber-500" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </motion.div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Progreso de Estudio</h3>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${level.color}`}>Nivel {level.level}</div>
          <div className={`text-xs ${level.color}`}>{level.name}</div>
        </div>
      </div>

      {/* Estadísticas principales con animaciones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
            <CheckCircle className="w-5 h-5" />
            {progress.notesRead}
          </div>
          <div className="text-xs text-gray-600">Notas Leídas</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
            <Trophy className="w-5 h-5" />
            {progress.totalPoints}
          </div>
          <div className="text-xs text-gray-600">Puntos</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5" />
            {progress.currentStreak}
          </div>
          <div className="text-xs text-gray-600">Días Seguidos</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
            <Award className="w-5 h-5" />
            {medals.length}
          </div>
          <div className="text-xs text-gray-600">Medallas</div>
        </motion.div>
      </div>

      {/* Barra de progreso animada */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso hacia {nextMilestone.milestone} notas</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="relative">
          <Progress value={progressPercentage} className="h-3" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
            style={{ width: `${progressPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <Target className="w-3 h-3" />
          {nextMilestone.remaining} notas restantes para el próximo milestone
        </div>
      </div>

      {/* Streak más largo */}
      {progress.longestStreak > 0 && (
        <motion.div 
          className="flex items-center gap-2 text-sm text-gray-600 mb-4 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Racha más larga: <strong>{progress.longestStreak} días</strong></span>
        </motion.div>
      )}

      {/* Estadísticas detalladas */}
      <div className="mb-4">
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors w-full"
        >
          {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <BarChart3 className="w-4 h-4" />
          Estadísticas detalladas
        </button>
        
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2 text-xs text-gray-600"
            >
              <div className="flex justify-between">
                <span>Promedio por día:</span>
                <span>{progress.notesRead > 0 ? (progress.notesRead / Math.max(1, progress.currentStreak)).toFixed(1) : '0'} notas</span>
              </div>
              <div className="flex justify-between">
                <span>Eficiencia:</span>
                <span>{progress.notesRead > 0 ? Math.round((progress.notesRead / (progress.notesRead + 5)) * 100) : 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>Última lectura:</span>
                <span>{progress.lastReadDate ? new Date(progress.lastReadDate).toLocaleDateString() : 'Nunca'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sección de medallas */}
      <div className="mb-4">
        <button
          onClick={() => setShowMedals(!showMedals)}
          className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors w-full"
        >
          {showMedals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <Award className="w-4 h-4" />
          {showMedals ? 'Ocultar' : 'Ver'} Medallas ({medals.length})
        </button>
      </div>

      <AnimatePresence>
        {showMedals && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-4"
          >
            <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Medallas Ganadas
            </h4>
            
            {medals.length === 0 ? (
              <motion.div 
                className="text-center py-8 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Medal className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aún no has ganado medallas</p>
                <p className="text-xs">¡Lee más notas para desbloquearlas!</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {medals.map((medal, index) => (
                  <motion.div
                    key={medal.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-700 hover:shadow-md transition-shadow"
                  >
                    <div className={`${getMedalColor(medal.color)} bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm`}>
                      {getMedalIcon(medal.id)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{medal.name}</div>
                      <div className="text-xs text-gray-600">{medal.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Ganada el {new Date(medal.unlockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Medallas disponibles */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Medallas Disponibles</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {AVAILABLE_MEDALS.filter(medal => !medals.find(m => m.id === medal.id)).map((medal) => (
                  <motion.div
                    key={medal.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-60"
                    whileHover={{ opacity: 0.8 }}
                  >
                    <div className="text-gray-400 bg-white dark:bg-gray-700 p-1 rounded-full">
                      {getMedalIcon(medal.id)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-500 text-xs">{medal.name}</div>
                      <div className="text-xs text-gray-400">{medal.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consejos motivacionales */}
      <motion.div 
        className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-700">Consejo del día</span>
        </div>
        <p className="text-xs text-blue-600">
          {progress.notesRead < 3 
            ? "¡Empieza leyendo 3 notas únicas para ganar tu primera medalla!"
            : progress.notesRead < 10
            ? "¡Continúa así! Estás cerca de convertirte en un estudiante experto."
            : progress.notesRead < 20
            ? "¡Excelente trabajo! Eres un verdadero maestro del conocimiento legal."
            : "¡Increíble! Has alcanzado el nivel de sabio legal. ¡Sigue explorando!"
          }
        </p>
      </motion.div>

      {/* Botón de reset */}
      <motion.button
        onClick={resetProgress}
        className="mt-4 w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RefreshCw className="w-4 h-4" />
        Reiniciar Progreso
      </motion.button>
    </div>
  );
};

export default GamificationProgress; 