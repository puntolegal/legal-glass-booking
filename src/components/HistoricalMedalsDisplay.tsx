import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Sparkles, 
  Lock,
  Info,
  Calendar,
  Quote,
  User,
  X,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HISTORICAL_LAW_MEDALS, Medal, getMedalById } from '@/config/medals';
import { useGamification } from '@/contexts/GamificationContext';

interface HistoricalMedalsDisplayProps {
  showAll?: boolean;
  maxDisplay?: number;
  className?: string;
}

const HistoricalMedalsDisplay: React.FC<HistoricalMedalsDisplayProps> = ({
  showAll = false,
  maxDisplay = 6,
  className = ''
}) => {
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const { progress } = useGamification();

  const unlockedMedalIds = progress.medals.map(medal => medal.id);
  
  // Filtrar medallas según el filtro seleccionado
  const filteredMedals = HISTORICAL_LAW_MEDALS.filter(medal => {
    if (filter === 'unlocked') return unlockedMedalIds.includes(medal.id);
    if (filter === 'locked') return !unlockedMedalIds.includes(medal.id);
    return true;
  });

  const displayMedals = showAll ? filteredMedals : filteredMedals.slice(0, maxDisplay);

  const getRarityColor = (rarity: Medal['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBg = (rarity: Medal['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50 dark:bg-gray-900/20';
      case 'rare': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getRarityText = (rarity: Medal['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-700 dark:text-gray-300';
      case 'rare': return 'text-blue-700 dark:text-blue-300';
      case 'epic': return 'text-purple-700 dark:text-purple-300';
      case 'legendary': return 'text-yellow-700 dark:text-yellow-300';
      default: return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Medallas Históricas
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'unlocked' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unlocked')}
          >
            Obtenidas ({unlockedMedalIds.length})
          </Button>
          <Button
            variant={filter === 'locked' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('locked')}
          >
            Bloqueadas
          </Button>
        </div>
      </div>

      {/* Grid de medallas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <AnimatePresence mode="popLayout">
          {displayMedals.map((medal, index) => {
            const isUnlocked = unlockedMedalIds.includes(medal.id);
            
            return (
              <motion.div
                key={medal.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative cursor-pointer group ${getRarityBg(medal.rarity)} rounded-xl p-4 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300`}
                onClick={() => setSelectedMedal(medal)}
              >
                {/* Indicador de rareza */}
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-r ${getRarityColor(medal.rarity)}`} />
                
                {/* Icono de la medalla */}
                <div className="text-center mb-3">
                  <div className={`text-4xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {medal.icon}
                  </div>
                  {!isUnlocked && (
                    <Lock className="w-4 h-4 text-gray-400 mx-auto" />
                  )}
                </div>

                {/* Información básica */}
                <div className="text-center">
                  <h3 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {medal.name}
                  </h3>
                  <p className={`text-xs mb-2 ${isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                    {medal.description}
                  </p>
                  
                  {/* Badge de rareza */}
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getRarityBg(medal.rarity)} ${getRarityText(medal.rarity)} border-0`}
                  >
                    {medal.rarity}
                  </Badge>
                </div>

                {/* Efecto de brillo para medallas desbloqueadas */}
                {isUnlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      boxShadow: [
                        '0 0 0 rgba(250, 204, 21, 0)',
                        '0 0 20px rgba(250, 204, 21, 0.3)',
                        '0 0 0 rgba(250, 204, 21, 0)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Indicador de información */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Info className="w-3 h-3 text-gray-400" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal de detalles de medalla */}
      <AnimatePresence>
        {selectedMedal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMedal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-6xl">{selectedMedal.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedMedal.name}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className={`mt-1 ${getRarityBg(selectedMedal.rarity)} ${getRarityText(selectedMedal.rarity)} border-0`}
                    >
                      {selectedMedal.rarity}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMedal(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedMedal.description}
                </p>
              </div>

              {/* Requisitos */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Requisito
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedMedal.requirement.description}
                </p>
              </div>

              {/* Contexto histórico */}
              {selectedMedal.historicalContext && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Contexto Histórico
                  </h4>
                  
                  {selectedMedal.historicalContext.person && (
                    <div className="mb-3">
                      <div className="font-medium text-blue-800 dark:text-blue-200">
                        {selectedMedal.historicalContext.person}
                      </div>
                      {selectedMedal.historicalContext.period && (
                        <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {selectedMedal.historicalContext.period}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedMedal.historicalContext.achievement && (
                    <div className="mb-3">
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Logro:</strong> {selectedMedal.historicalContext.achievement}
                      </div>
                    </div>
                  )}
                  
                  {selectedMedal.historicalContext.quote && (
                    <div className="border-l-4 border-blue-300 dark:border-blue-700 pl-3">
                      <Quote className="w-4 h-4 text-blue-500 mb-1" />
                      <blockquote className="text-sm italic text-blue-600 dark:text-blue-400">
                        "{selectedMedal.historicalContext.quote}"
                      </blockquote>
                    </div>
                  )}
                </div>
              )}

              {/* Recompensa */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">
                      Recompensa
                    </span>
                  </div>
                  <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                    +{selectedMedal.points_reward} puntos
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div className="mt-6 text-center">
                {unlockedMedalIds.includes(selectedMedal.id) ? (
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">¡Medalla Obtenida!</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-gray-500">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Medalla Bloqueada</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoricalMedalsDisplay; 