import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  Search, 
  X,
  BookOpen,
  Zap,
  Award,
  TrendingUp,
  Sparkles,
  Target,
  Trophy,
  Users,
  Clock,
  Flame,
  Crown,
  Star,
  Timer,
  Bell,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ApuntesHeader from '@/components/ApuntesHeader';
import EnhancedApuntesCard from '@/components/EnhancedApuntesCard';
import { useGamification } from '@/contexts/GamificationContext';
import apuntesDataFile from './data/apuntes.json';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const apuntesData = apuntesDataFile.apuntes || [];

interface ApunteData {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  readTime: number;
  lastModified: string;
  slug: string;
  author: string;
  concepts: string[];
  points: number;
  excerpt?: string;
  tags?: string[];
  related?: string[];
  estimatedTime?: string;
  filePath?: string;
  links?: string[];
  date?: string;
}

// Simular actividad de otros usuarios
interface UserActivity {
  id: string;
  username: string;
  action: string;
  noteTitle: string;
  timestamp: number;
  points: number;
}

const SAMPLE_ACTIVITIES: UserActivity[] = [
  { id: '1', username: 'María R.', action: 'completó', noteTitle: 'Contratos de Trabajo', timestamp: Date.now() - 120000, points: 15 },
  { id: '2', username: 'Carlos M.', action: 'dominó', noteTitle: 'Acción Reivindicatoria', timestamp: Date.now() - 240000, points: 25 },
  { id: '3', username: 'Ana L.', action: 'leyó', noteTitle: 'Fianza Civil', timestamp: Date.now() - 360000, points: 10 },
  { id: '4', username: 'Pedro S.', action: 'quiz perfecto', noteTitle: 'Sociedades Comerciales', timestamp: Date.now() - 480000, points: 50 },
];

const ApuntesIndex: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'difficulty' | 'readTime' | 'alphabetical'>('recent');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [trendingNotes, setTrendingNotes] = useState<ApunteData[]>([]);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [dailyGoal, setDailyGoal] = useState({ current: 0, target: 3 });
  
  const { progress } = useGamification();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Validación de seguridad para el progreso
  const safeProgress = progress || {
    readNotes: new Set(),
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0
  };

  // Actualizar URL cuando cambia la búsqueda
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    setSearchParams(params);
  }, [searchQuery, setSearchParams]);

  // Procesar los datos de apuntes para adaptarlos al componente
  const processedApuntes = useMemo(() => {
    const processed = apuntesData.map((apunte: any) => ({
      id: apunte.id,
      title: apunte.title?.replace(/\[\[|\]\]/g, '') || 'Sin título',
      content: apunte.excerpt || apunte.content || 'Sin contenido',
      category: apunte.category || 'general',
      difficulty: apunte.difficulty || 'básico',
      readTime: apunte.estimatedTime ? parseInt(apunte.estimatedTime) || 5 : 5,
      lastModified: apunte.lastModified || apunte.date || new Date().toISOString(),
      slug: apunte.slug || apunte.id,
      author: apunte.author || 'Punto Legal',
      concepts: apunte.tags || [],
      points: 10
    }));
    return processed;
  }, []);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = [...new Set(processedApuntes.map(apunte => apunte.category))];
    return cats.sort();
  }, [processedApuntes]);

  // Filtrar y ordenar apuntes
  const filteredAndSortedApuntes = useMemo(() => {
    let filtered = processedApuntes.filter(apunte => {
      const matchesSearch = apunte.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           apunte.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (apunte.concepts || []).some(concept => 
                             concept.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      
      const matchesCategory = selectedCategory === 'all' || apunte.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || apunte.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'difficulty':
          const difficultyOrder = { 'básico': 1, 'intermedio': 2, 'avanzado': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'readTime':
          return a.readTime - b.readTime;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [processedApuntes, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Simular datos en tiempo real
  useEffect(() => {
    const updateRealTimeData = () => {
      setOnlineUsers(Math.floor(Math.random() * 50) + 180); // 180-230 usuarios
      
      // Agregar nueva actividad cada 30 segundos
      const newActivity = {
        ...SAMPLE_ACTIVITIES[Math.floor(Math.random() * SAMPLE_ACTIVITIES.length)],
        id: Date.now().toString(),
        timestamp: Date.now(),
        username: ['Ana', 'Carlos', 'María', 'Pedro', 'José', 'Laura'][Math.floor(Math.random() * 6)] + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '.'
      };
      
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      
      // Actualizar notas trending (filtrar por tipo correcto)
      const trendingData = apuntesData.filter((note: any) => 
        note.difficulty && ['básico', 'intermedio', 'avanzado'].includes(note.difficulty)
      ).map((note: any) => ({
        ...note,
        readTime: note.readTime || 5,
        concepts: note.concepts || [],
        points: note.points || 10,
        content: note.content || note.excerpt || ''
      })).sort(() => 0.5 - Math.random()).slice(0, 6);
      setTrendingNotes(trendingData);
      
      // Simular progreso de meta diaria
      setDailyGoal(prev => ({
        ...prev,
        current: Math.min(prev.current + (Math.random() > 0.7 ? 1 : 0), prev.target)
      }));
    };

    // Inicializar datos
    updateRealTimeData();
    setRecentActivities(SAMPLE_ACTIVITIES);
    
    const interval = setInterval(updateRealTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Configuración para el scroll suave al top cuando se monté el componente
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Manejar clic en concepto
  const handleConceptClick = (concept: string) => {
    setSearchQuery(concept);
    setShowFilters(false);
  };

  // Manejar cambio de búsqueda desde el header
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Exponer función globalmente para los enlaces en ObsidianParser
  useEffect(() => {
    (window as any).handleConceptClick = handleConceptClick;
    return () => {
      delete (window as any).handleConceptClick;
    };
  }, []);

  const handleNoteClick = (note: any) => {
    const noteSlug = note.slug || note.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    navigate(`/apuntes/${noteSlug}`);
  };

  const getNetworkStats = () => {
    const totalNotes = apuntesData.length;
    const categoriesSet = new Set(apuntesData.map((note: any) => note.category).filter(Boolean));
    const conceptsSet = new Set();
    
    apuntesData.forEach((note: any) => {
      (note.related || []).forEach((concept: string) => conceptsSet.add(concept));
      (note.links || []).forEach((concept: string) => conceptsSet.add(concept));
    });
    
    return {
      totalNotes,
      categories: categoriesSet.size,
      interconnectedConcepts: conceptsSet.size,
      networkDensity: Math.round((conceptsSet.size / totalNotes) * 100)
    };
  };

  const networkStats = getNetworkStats();

  const getTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'ahora';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  // Breadcrumbs dinámicos
  const breadcrumbs = [
    { label: 'Apuntes', href: '/apuntes' },
    ...(selectedCategory !== 'all' ? [{ label: selectedCategory }] : []),
    ...(searchQuery ? [{ label: `"${searchQuery}"` }] : [])
  ];

  // Forzar vista grid en mobile
  useEffect(() => {
    if (isMobile && viewMode === 'list') {
      setViewMode('grid');
    }
  }, [isMobile, viewMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header específico para Apuntes */}
      <ApuntesHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFilters={showFilters}
        onFiltersToggle={() => setShowFilters(!showFilters)}
        breadcrumbs={breadcrumbs}
      />

      {/* Contenido principal */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          
          {/* Hero Section con estadísticas mejoradas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Título y descripción con fondo mejorado */}
            <div className="text-center mb-8 relative">
              {/* Fondo sutil para mejorar legibilidad */}
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-3xl mx-auto max-w-4xl"></div>
              
              <div className="relative py-8 px-6">
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Tu Biblioteca de Conocimiento Legal
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-lg font-medium text-gray-700 dark:text-gray-200 max-w-2xl mx-auto drop-shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {processedApuntes.length} apuntes organizados para acelerar tu aprendizaje en Derecho
                </motion.p>
              </div>
            </div>

            {/* Estadísticas de progreso optimizadas para mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Notas Leídas */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
                <div className="relative flex items-center space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {safeProgress.readNotes.size}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Notas Leídas
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Días Seguidos */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-600/5 group-hover:from-yellow-500/10 group-hover:to-amber-600/10 transition-all duration-300" />
                <div className="relative flex items-center space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {safeProgress.currentStreak}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Días Seguidos
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Puntos Totales */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 group-hover:from-purple-500/10 group-hover:to-purple-600/10 transition-all duration-300" />
                <div className="relative flex items-center space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {safeProgress.totalPoints}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Puntos Totales
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Nivel Actual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 group-hover:from-green-500/10 group-hover:to-emerald-600/10 transition-all duration-300" />
                <div className="relative flex items-center space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(safeProgress.totalPoints / 100) + 1}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Nivel Actual
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Barra de progreso global */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Progreso de Estudio
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {((safeProgress.readNotes.size / processedApuntes.length) * 100).toFixed(1)}% completado
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((safeProgress.readNotes.size / processedApuntes.length) * 100, 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((safeProgress.readNotes.size / processedApuntes.length) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  {safeProgress.readNotes.size > 0 && (
                    <Sparkles className="w-3 h-3 text-white animate-pulse" />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Panel de filtros mejorado para mobile */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Filtro de categorías */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoría
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="all">Todas las categorías</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro de dificultad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dificultad
                      </label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="all">Todas las dificultades</option>
                        <option value="básico">🌱 Básico</option>
                        <option value="intermedio">⚡ Intermedio</option>
                        <option value="avanzado">🔥 Avanzado</option>
                      </select>
                    </div>

                    {/* Ordenación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ordenar por
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="recent">Más recientes</option>
                        <option value="difficulty">Dificultad</option>
                        <option value="readTime">Tiempo de lectura</option>
                        <option value="alphabetical">Alfabético</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador de resultados mejorado */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredAndSortedApuntes.length}
                </span> de <span className="font-semibold">{processedApuntes.length}</span> apuntes
                {searchQuery && (
                  <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">
                    para "{searchQuery}"
                  </span>
                )}
              </div>
              
              {/* Filtros activos */}
              <div className="flex items-center space-x-2 flex-wrap">
                {selectedCategory !== 'all' && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setSelectedCategory('all')}
                  >
                    {selectedCategory} ×
                  </Badge>
                )}
                {selectedDifficulty !== 'all' && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setSelectedDifficulty('all')}
                  >
                    {selectedDifficulty} ×
                  </Badge>
                )}
                {searchQuery && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setSearchQuery('')}
                  >
                    "{searchQuery}" ×
                  </Badge>
                )}
              </div>
            </div>

            {/* Limpiar filtros */}
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSearchQuery('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Grid/Lista de apuntes */}
          {filteredAndSortedApuntes.length > 0 ? (
            <motion.div
              layout
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                  : 'space-y-4'
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedApuntes.map((apunte, index) => (
                  <EnhancedApuntesCard
                    key={apunte.id}
                    apunte={{
                      id: apunte.id,
                      title: apunte.title,
                      excerpt: apunte.content,
                      category: apunte.category,
                      difficulty: apunte.difficulty as 'básico' | 'intermedio' | 'avanzado',
                      estimatedTime: apunte.readTime + ' min',
                      slug: apunte.slug,
                      date: apunte.lastModified,
                      author: apunte.author,
                      tags: apunte.concepts || [],
                      related: [],
                      links: apunte.concepts || []
                    }}
                    viewMode={isMobile ? 'grid' : viewMode}
                    onConceptClick={handleConceptClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Estado vacío mejorado */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Search className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  No se encontraron apuntes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Intenta ajustar tus filtros o términos de búsqueda para encontrar el contenido que necesitas
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Limpiar filtros
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Panel de actividad en tiempo real y FOMO */}
      <motion.div 
        className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Actividad en tiempo real */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Actividad en Vivo</h3>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {onlineUsers} estudiando ahora
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowActivityFeed(!showActivityFeed)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3 max-h-40 overflow-y-auto">
            <AnimatePresence>
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {activity.username[0]}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.username}</span> {activity.action} 
                        <span className="font-medium"> "{activity.noteTitle}"</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(activity.timestamp)} • +{activity.points} pts
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-green-600 dark:text-green-400 font-medium text-sm"
                  >
                    +{activity.points}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Meta diaria y trending */}
        <div className="space-y-6">
          {/* Meta diaria */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meta Diaria</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {dailyGoal.current}/{dailyGoal.target}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">notas por estudiar hoy</p>
              <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((dailyGoal.current / dailyGoal.target) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              {dailyGoal.current === dailyGoal.target && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 text-green-600 dark:text-green-400 font-medium text-sm"
                >
                  🎉 ¡Meta cumplida! +50 pts bonus
                </motion.div>
              )}
            </div>
          </div>

          {/* Notas trending */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
            <div className="flex items-center space-x-2 mb-4">
              <Flame className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Ahora</h3>
            </div>
            <div className="space-y-2">
              {trendingNotes.slice(0, 3).map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all"
                  onClick={() => handleConceptClick(note.title)}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {note.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 20) + 5} estudiantes leyendo
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notificaciones flotantes de logros */}
      <AnimatePresence>
        {safeProgress.readNotes.size > 0 && safeProgress.readNotes.size % 5 === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">¡{safeProgress.readNotes.size} notas completadas!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApuntesIndex; 