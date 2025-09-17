import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Tag, 
  Calendar, 
  Clock, 
  Star,
  TrendingUp,
  Network,
  FileText,
  Link,
  Folder,
  ExternalLink,
  BookOpen,
  Trophy,
  Award,
  Target,
  Sparkles,
  Zap,
  CheckCircle,
  Eye,
  Filter as FilterIcon,
  X,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Map,
  Navigation,
  ArrowRight,
  ArrowLeft,
  Home,
  Layers,
  Hash,
  Users,
  Bookmark,
  Heart,
  Brain,
  Settings
} from 'lucide-react';
import { useConceptNavigation } from '@/contexts/ConceptNavigationContext';
import { useGamification } from '@/contexts/GamificationContext';
import GamificationProgress from '@/components/GamificationProgress';

interface ApuntesSidebarProps {
  // Filtros
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  
  // Vista
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Datos
  allCategories: string[];
  apuntes: any[];
  
  // Funciones
  clearFilters: () => void;
  getReadCount: () => number;
  getUnreadCount: () => number;
}

const ApuntesSidebar: React.FC<ApuntesSidebarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode,
  allCategories,
  apuntes,
  clearFilters,
  getReadCount,
  getUnreadCount
}) => {
  const [showFilters, setShowFilters] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showStats, setShowStats] = useState(false);
  
  const { navigationHistory, breadcrumb, goBack, goToStep, clearHistory } = useConceptNavigation();
  const { progress } = useGamification();

  return (
    <div className="w-80 h-screen fixed left-0 top-0 z-40 backdrop-blur-2xl bg-gradient-to-b from-white/20 via-white/10 to-white/5 dark:from-slate-900/20 dark:via-slate-900/10 dark:to-slate-900/5 border-r border-white/20 dark:border-white/10 overflow-hidden">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-4 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-xl" />
      </div>

      <div className="relative h-full flex flex-col p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Header con logo */}
        <div className="mb-8">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Apuntes</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sistema Zettelkasten</p>
            </div>
          </motion.div>
        </div>

        {/* Navegación por conceptos */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-500" />
                Navegación
              </h3>
              <button
                onClick={() => setShowNavigation(!showNavigation)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {showNavigation ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <AnimatePresence>
              {showNavigation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {/* Breadcrumb */}
                  {breadcrumb.length > 0 && (
                    <div className="p-3 bg-white/10 dark:bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-1 mb-2 text-xs text-gray-600 dark:text-gray-400">
                        <Map className="w-3 h-3" />
                        Ruta actual
                      </div>
                      <div className="flex flex-wrap items-center gap-1 text-xs">
                        {breadcrumb.slice(-4).map((concept, index, arr) => (
                          <React.Fragment key={concept}>
                            <button
                              onClick={() => goToStep(breadcrumb.indexOf(concept))}
                              className={`px-2 py-1 rounded-md transition-colors ${
                                index === arr.length - 1
                                  ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/10'
                              }`}
                            >
                              {concept.length > 12 ? concept.substring(0, 12) + '...' : concept}
                            </button>
                            {index < arr.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Controles de navegación */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goBack}
                      disabled={navigationHistory.length <= 1}
                      className="flex items-center gap-1 px-3 py-2 text-xs bg-white/10 dark:bg-white/5 rounded-lg border border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Atrás
                    </button>
                    
                    <button
                      onClick={clearHistory}
                      className="flex items-center gap-1 px-3 py-2 text-xs bg-white/10 dark:bg-white/5 rounded-lg border border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
                    >
                      <Home className="w-3 h-3" />
                      Inicio
                    </button>
                  </div>

                  {/* Historial reciente */}
                  {navigationHistory.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Recientes
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {navigationHistory.slice(-5).reverse().map((step, index) => (
                          <button
                            key={`${step.concept}-${step.timestamp}`}
                            onClick={() => goToStep(navigationHistory.length - 1 - index)}
                            className="w-full text-left p-2 text-xs bg-white/5 dark:bg-white/5 rounded-md hover:bg-white/10 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 border border-white/5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{step.title}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(step.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            {step.source && (
                              <div className="text-xs text-gray-500 mt-1">
                                desde: {step.source}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Panel de gamificación compacto */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GamificationProgress />
        </motion.div>

        {/* Filtros mejorados */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FilterIcon className="w-4 h-4 text-purple-500" />
                Filtros
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                {showFilters ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {/* Búsqueda */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar conceptos, títulos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtros expandibles */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Categorías */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <Folder className="w-3 h-3" />
                      Categoría
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300/50 text-gray-900 dark:text-white text-sm transition-all duration-300"
                    >
                      <option value="">Todas las categorías</option>
                      {allCategories.map(category => (
                        <option key={category} value={category} className="bg-white dark:bg-gray-800">
                          {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dificultad */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      Dificultad
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300/50 text-gray-900 dark:text-white text-sm transition-all duration-300"
                    >
                      <option value="" className="bg-white dark:bg-gray-800">Todas las dificultades</option>
                      <option value="básico" className="bg-white dark:bg-gray-800">🟢 Básico</option>
                      <option value="intermedio" className="bg-white dark:bg-gray-800">🟡 Intermedio</option>
                      <option value="avanzado" className="bg-white dark:bg-gray-800">🔴 Avanzado</option>
                    </select>
                  </div>

                  {/* Estado de lectura */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Estado
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300/50 text-gray-900 dark:text-white text-sm transition-all duration-300"
                    >
                      <option value="" className="bg-white dark:bg-gray-800">Todos</option>
                      <option value="read" className="bg-white dark:bg-gray-800">✅ Leídas ({getReadCount()})</option>
                      <option value="unread" className="bg-white dark:bg-gray-800">📖 Pendientes ({getUnreadCount()})</option>
                    </select>
                  </div>

                  {/* Botón limpiar filtros */}
                  {(selectedCategory || selectedDifficulty || selectedStatus) && (
                    <motion.button
                      onClick={clearFilters}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 text-sm text-gray-600 dark:text-gray-400 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Limpiar filtros
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Vista */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-lg">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Vista
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white/10 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/10 border border-white/10'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-white/10 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/10 border border-white/10'
                }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
            </div>
          </div>
        </motion.div>

        {/* Estadísticas avanzadas */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                Estadísticas
              </h3>
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                {showStats ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  <FileText className="w-4 h-4" />
                  {apuntes.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
              </div>
              
              <div className="p-3 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  {getReadCount()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Leídas</div>
              </div>
              
              <div className="p-3 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-purple-600 dark:text-purple-400">
                  <Link className="w-4 h-4" />
                  {apuntes.reduce((acc, ap) => acc + (ap.links?.length || 0), 0)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Enlaces</div>
              </div>
              
              <div className="p-3 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-amber-600 dark:text-amber-400">
                  <Folder className="w-4 h-4" />
                  {allCategories.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Categorías</div>
              </div>
            </div>

            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 border-t border-white/10"
                >
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between items-center py-1">
                      <span>Progreso total:</span>
                      <span className="font-medium">{Math.round((getReadCount() / apuntes.length) * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Puntos ganados:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{progress.totalPoints}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Racha actual:</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">{progress.currentStreak} días</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Medallas:</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{progress.medals.length}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer con efectos */}
        <motion.div 
          className="mt-auto pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-white/20 dark:border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sistema de Estudio Legal
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Mejora tu aprendizaje con navegación inteligente y gamificación
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApuntesSidebar; 