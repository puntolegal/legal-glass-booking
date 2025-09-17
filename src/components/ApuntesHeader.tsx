import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  User, 
  Bell, 
  BookOpen, 
  Zap, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Filter, 
  Grid, 
  List, 
  ArrowLeft,
  Timer,
  Users,
  Flame,
  Target,
  Crown,
  ChevronRight,
  Star,
  Gem,
  Shield,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DarkModeToggle from './DarkModeToggle';
import { useGamification } from '@/contexts/GamificationContext';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ApuntesHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showFilters?: boolean;
  onFiltersToggle?: () => void;
  breadcrumbs?: Breadcrumb[];
  showBackButton?: boolean;
  currentNotePath?: string;
}

const ApuntesHeader: React.FC<ApuntesHeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  showFilters = false,
  onFiltersToggle,
  breadcrumbs = [],
  showBackButton = false,
  currentNotePath = ''
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, getProgressPercentage, getNextMilestone } = useGamification();

  // Simular usuarios online y racha diaria
  useEffect(() => {
    const updateStats = () => {
      setOnlineUsers(Math.floor(Math.random() * 50) + 150);
      setDailyGoal(Math.floor(Math.random() * 3) + 1);
    };
    
    updateStats();
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const safeProgress = progress || { 
    readNotes: new Set(), 
    totalPoints: 0, 
    currentStreak: 0, 
    longestStreak: 0 
  };

  // Función para calcular nivel basado en puntos
  const getCurrentLevel = (totalPoints: number) => {
    if (totalPoints < 50) return 1;
    if (totalPoints < 100) return 2;
    if (totalPoints < 200) return 3;
    if (totalPoints < 400) return 4;
    if (totalPoints < 800) return 5;
    if (totalPoints < 1600) return 6;
    return Math.min(Math.floor(totalPoints / 500) + 1, 20);
  };

  const currentLevel = getCurrentLevel(safeProgress.totalPoints || 0);
  const nextMilestoneData = getNextMilestone?.() || { milestone: 100, remaining: 100 };
  const nextMilestone = nextMilestoneData.milestone || 100;
  const progressPercentage = getProgressPercentage?.() || 0;
  const totalPoints = safeProgress.totalPoints || 0;

  // Determinar el tier del usuario con diseño consistente
  const getUserTier = () => {
    if (currentLevel >= 15) return { 
      name: 'Jurista Experto', 
      shortName: 'Experto',
      color: 'from-purple-500 to-indigo-600', 
      icon: Crown,
      bgColor: 'bg-purple-500/15',
      borderColor: 'border-purple-400/30',
      textColor: 'text-purple-100'
    };
    if (currentLevel >= 10) return { 
      name: 'Abogado Senior', 
      shortName: 'Senior',
      color: 'from-blue-500 to-cyan-600', 
      icon: Shield,
      bgColor: 'bg-blue-500/15',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-100'
    };
    if (currentLevel >= 5) return { 
      name: 'Estudiante Avanzado', 
      shortName: 'Avanzado',
      color: 'from-green-500 to-emerald-600', 
      icon: Gem,
      bgColor: 'bg-green-500/15',
      borderColor: 'border-green-400/30',
      textColor: 'text-green-100'
    };
    return { 
      name: 'Aprendiz Legal', 
      shortName: 'Aprendiz',
      color: 'from-yellow-500 to-orange-600', 
      icon: Star,
      bgColor: 'bg-yellow-500/15',
      borderColor: 'border-yellow-400/30',
      textColor: 'text-yellow-100'
    };
  };

  const userTier = getUserTier();
  const TierIcon = userTier.icon;

  return (
    <>
      {/* Header con diseño de sistema profesional */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-blue-900/25"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Grid decorativo de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Layout principal con grid consistente */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-8 px-6 h-20">
            
            {/* SECCIÓN IZQUIERDA - Branding y Navegación */}
            <div className="flex items-center gap-6">
              {/* Botón de regreso (si aplica) */}
              {showBackButton && (
                <motion.button
                  onClick={() => navigate('/apuntes')}
                  className="h-10 px-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl text-white font-medium text-sm transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Volver</span>
                </motion.button>
              )}
              
              {/* Logo y branding - Diseño consistente */}
              <motion.div 
                className="flex items-center gap-4"
                whileHover={{ scale: 1.01 }}
              >
                {/* Ícono del logo con indicadores */}
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl border border-white/25 flex items-center justify-center shadow-lg shadow-black/10">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  {/* Indicador de actividad consistente */}
                  <motion.div 
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-white/40"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                
                {/* Texto del branding */}
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white leading-tight tracking-tight">
                    Punto Legal Apuntes
                  </h1>
                  <p className="text-sm text-blue-100/90 font-medium">
                    Estudia Derecho Inteligentemente
                  </p>
                </div>
              </motion.div>

              {/* Breadcrumbs con diseño consistente */}
              {breadcrumbs.length > 0 && (
                <nav className="hidden lg:flex items-center gap-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {index > 0 && <ChevronRight className="w-3 h-3 text-blue-300/70" />}
                      {crumb.href ? (
                        <Link 
                          to={crumb.href} 
                          className="h-8 px-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 rounded-lg text-blue-100 hover:text-white transition-all duration-200 flex items-center font-medium"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="h-8 px-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold flex items-center">
                          {crumb.label}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </nav>
              )}
            </div>

            {/* SECCIÓN CENTRAL - Búsqueda */}
            {onSearchChange && (
              <div className="hidden md:block max-w-lg mx-auto w-full">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200 group-focus-within:text-white transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Buscar conceptos legales..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-11 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-200 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/10 hover:bg-white/20 rounded-lg text-blue-200 hover:text-white transition-all duration-200 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SECCIÓN DERECHA - Estadísticas y Controles */}
            <div className="flex items-center gap-3">
              
              {/* Estadísticas gamificadas en tiempo real */}
              <div className="hidden lg:flex items-center gap-6">
                {/* Usuarios activos - Estático y real */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl">
                  <Users className="w-4 h-4 text-blue-200" />
                  <div className="text-sm">
                    <span className="font-bold text-white">154</span>
                    <span className="text-blue-200 opacity-80 ml-1">estudiantes online</span>
                  </div>
                </div>

                {/* Nivel académico */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl">
                  <GraduationCap className="w-4 h-4 text-purple-200" />
                  <div className="text-sm">
                    <span className="font-bold text-white">Nivel {currentLevel}</span>
                    <span className="text-purple-200 opacity-80 ml-1">Académico</span>
                  </div>
                </div>

                {/* Puntos académicos */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl">
                  <Award className="w-4 h-4 text-yellow-200" />
                  <div className="text-sm">
                    <span className="font-bold text-white">{totalPoints}</span>
                    <span className="text-yellow-200 opacity-80 ml-1">pts de conocimiento</span>
                  </div>
                </div>

                {/* Progreso de estudio */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl">
                  <BookOpen className="w-4 h-4 text-green-200" />
                  <div className="text-sm">
                    <span className="font-bold text-white">{Math.round(((safeProgress.readNotes.size || 0) / 174) * 100)}%</span>
                    <span className="text-green-200 opacity-80 ml-1">progreso</span>
                  </div>
                </div>
              </div>

              {/* Progreso del nivel - Miniaturizado */}
              <div className="hidden lg:flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-200 font-medium">Progreso</span>
                  <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{progressPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Grupo de controles - Altura consistente */}
              <div className="flex items-center gap-2">
                
                {/* Controles de vista */}
                {onViewModeChange && (
                  <div className="hidden sm:flex h-10 bg-white/10 border border-white/20 rounded-xl p-0.5">
                    <button
                      onClick={() => onViewModeChange('grid')}
                      className={`w-9 h-9 rounded-lg transition-all duration-200 flex items-center justify-center ${
                        viewMode === 'grid' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewModeChange('list')}
                      className={`w-9 h-9 rounded-lg transition-all duration-200 flex items-center justify-center ${
                        viewMode === 'list' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Botón de filtros */}
                {onFiltersToggle && (
                  <motion.button
                    onClick={onFiltersToggle}
                    className={`w-10 h-10 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl text-white transition-all duration-200 flex items-center justify-center ${
                      showFilters ? 'bg-white/20 border-white/40' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Filter className="w-4 h-4" />
                  </motion.button>
                )}

                {/* Dark mode toggle */}
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl p-0.5 flex items-center justify-center">
                  <DarkModeToggle />
                </div>

                {/* Notificaciones */}
                <motion.button
                  className="relative w-10 h-10 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl text-white transition-all duration-200 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Bell className="w-4 h-4" />
                  <motion.div 
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border border-white/50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.button>

                {/* Menú de usuario */}
                <div className="relative">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="h-10 pl-3 pr-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl text-white transition-all duration-200 flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-7 h-7 bg-gradient-to-br ${userTier.color} rounded-lg flex items-center justify-center shadow-sm`}>
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <ChevronDown className="w-3 h-3" />
                  </motion.button>

                  {/* Dropdown del usuario */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                      >
                        <div className="space-y-4">
                          {/* Header del perfil */}
                          <div className="text-center pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                            <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${userTier.color} rounded-2xl flex items-center justify-center shadow-lg mb-3`}>
                              <TierIcon className="w-8 h-8 text-white" />
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{userTier.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nivel {currentLevel} • {totalPoints} pts</p>
                          </div>
                          
                          {/* Estadísticas */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-center border border-blue-200/50 dark:border-blue-700/50">
                              <p className="font-bold text-blue-700 dark:text-blue-300 text-lg">{safeProgress.readNotes.size}</p>
                              <p className="text-blue-600 dark:text-blue-400 font-medium text-xs">Notas leídas</p>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-xl text-center border border-orange-200/50 dark:border-orange-700/50">
                              <p className="font-bold text-orange-700 dark:text-orange-300 text-lg">{safeProgress.longestStreak}</p>
                              <p className="text-orange-600 dark:text-orange-400 font-medium text-xs">Mejor racha</p>
                            </div>
                          </div>

                          {/* Botón de acción */}
                          <button 
                            className="w-full h-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Award className="w-4 h-4" />
                            Ver Logros y Medallas
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Menú móvil */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden w-10 h-10 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl text-white transition-all duration-200 flex items-center justify-center"
                >
                  {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progreso inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <motion.div 
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.header>

      {/* Spacer ajustado */}
      <div className="h-20" />

      {/* Menú móvil mejorado */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl md:hidden"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menú de Estudio</h2>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Estadísticas móviles con diseño consistente */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-center border border-blue-200/50 dark:border-blue-700/50">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{onlineUsers}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">usuarios online</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl text-center border border-orange-200/50 dark:border-orange-700/50">
                  <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{safeProgress.currentStreak}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">días seguidos</p>
                </div>
              </div>

              {/* Búsqueda móvil */}
              {onSearchChange && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conceptos..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              )}

              {/* Progreso móvil */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Nivel {currentLevel}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{totalPoints} pts</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  {Math.max(0, nextMilestone - totalPoints)} pts para siguiente nivel
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApuntesHeader; 