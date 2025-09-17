import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Lightbulb, 
  FileText, 
  Target, 
  Scale, 
  GraduationCap,
  ChevronRight,
  Sparkles,
  Trophy,
  Star,
  Zap,
  Brain,
  Eye,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  BookmarkCheck,
  Flame,
  Shield,
  Gem,
  Link2,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/contexts/GamificationContext';
import { useNavigate } from 'react-router-dom';
import { parseObsidianContent } from '@/utils/obsidianParser';

interface ApuntesContentProps {
  content: string;
  noteId: string;
  category: string;
  onConceptClick?: (concept: string) => void;
}

interface ParsedSection {
  id: string;
  type: 'title' | 'header' | 'text' | 'list' | 'quote' | 'metadata' | 'jurisprudencia' | 'doctrina' | 'examples' | 'code' | 'concepts' | 'questions';
  level?: number;
  content: string;
  cleanContent?: string;
  items?: string[];
  icon?: string;
  emoji?: string;
  className?: string;
  points?: number;
  isCompleted?: boolean;
  importance?: 'low' | 'medium' | 'high' | 'critical';
}

const ApuntesContent: React.FC<ApuntesContentProps> = ({ 
  content, 
  noteId, 
  category, 
  onConceptClick 
}) => {
  const [parsedContent, setParsedContent] = useState<any>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const { readNote, progress } = useGamification();
  const navigate = useNavigate();

  useEffect(() => {
    if (content) {
      const parsed = parseObsidianContent(content);
      setParsedContent(parsed);
    }
  }, [content]);

  useEffect(() => {
    // Marcar nota como leída cuando se alcance cierto progreso
    if (readingProgress >= 75 && !completedSections.has(noteId)) {
      readNote(noteId, category);
      setCompletedSections(prev => new Set([...prev, noteId]));
      
      // Calcular puntos dinámicamente basado en el contenido
      const basePoints = Math.min(parsedContent?.sections?.length * 5 || 20, 100);
      setEarnedPoints(prev => prev + basePoints);
      triggerPointsAnimation(basePoints);
    }
  }, [readingProgress, noteId, category, readNote, completedSections, parsedContent]);

  const handleSectionView = (sectionId: string, points: number = 3) => {
    if (!viewedSections.has(sectionId)) {
      setViewedSections(prev => new Set([...prev, sectionId]));
      updateProgress();
      
      // Solo dar puntos por secciones importantes
      if (points >= 10) {
        setEarnedPoints(prev => prev + points);
        triggerPointsAnimation(points);
      }
    }
  };

  const triggerPointsAnimation = (points: number) => {
    setShowPointsAnimation(true);
    setTimeout(() => setShowPointsAnimation(false), 2000);
  };

  const updateProgress = () => {
    if (!parsedContent) return;
    const totalSections = parsedContent.sections?.length || 1;
    const progress = (viewedSections.size / totalSections) * 100;
    setReadingProgress(Math.min(progress, 100));
  };

  const handleConceptClick = (concept: string) => {
    if (onConceptClick) {
      onConceptClick(concept);
    } else {
      // Navegar a la nota del concepto
      const slug = concept.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/^-+|-+$/g, '');
      navigate(`/apuntes/${slug}`);
    }
  };

  if (!parsedContent) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Barra de progreso minimalista y elegante */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 p-4 mb-6 rounded-b-2xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                Progreso de Lectura
              </span>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {Math.round(readingProgress)}% completado
              </div>
            </div>
          </div>
          
          {/* Contador de puntos con diseño premium */}
          <div className="relative flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full border border-amber-200 dark:border-amber-800">
              <Gem className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                {earnedPoints}
              </span>
            </div>
            
            {/* Animación de puntos ganados */}
            <AnimatePresence>
              {showPointsAnimation && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: -30, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.6 }}
                  className="absolute -top-10 right-0 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                >
                  +{earnedPoints}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Barra de progreso elegante */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Conceptos interconectados - Diseño mejorado */}
      {parsedContent.concepts && parsedContent.concepts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-5">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-md">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Red de Conceptos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {parsedContent.concepts.length} conceptos interconectados
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {parsedContent.concepts.slice(0, 9).map((concept: string, index: number) => (
              <motion.button
                key={concept}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleConceptClick(concept)}
                className="group relative overflow-hidden px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {concept}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 flex-shrink-0" />
                </div>
                
                {/* Efecto de hover sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            ))}
          </div>
          
          {parsedContent.concepts.length > 9 && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                +{parsedContent.concepts.length - 9} conceptos más
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Contenido principal con renderizado mejorado */}
      <div className="space-y-6">
        {parsedContent.sections && parsedContent.sections.map((section: any, index: number) => (
          <motion.div
            key={section.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onViewportEnter={() => handleSectionView(section.id, section.points)}
            className="group"
          >
            {renderEnhancedSection(section, handleConceptClick, viewedSections.has(section.id))}
          </motion.div>
        ))}
      </div>

      {/* Mensaje de completitud con diseño premium */}
      {readingProgress >= 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/50 dark:via-green-950/50 dark:to-teal-950/50 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm shadow-xl"
        >
          <div className="text-center">
            <motion.div 
              className="flex justify-center mb-6"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              ¡Nota Completada!
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Has ganado <span className="font-bold text-emerald-600 dark:text-emerald-400">{earnedPoints} puntos</span> por dominar este concepto
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => navigate('/apuntes')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Progreso General
              </Button>
              
              <Button
                onClick={() => {
                  // Buscar una nota relacionada
                  if (parsedContent.concepts.length > 0) {
                    handleConceptClick(parsedContent.concepts[0]);
                  }
                }}
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Siguiente Concepto
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Renderiza una sección mejorada sin tickets verdes excesivos
 */
function renderEnhancedSection(
  section: any, 
  onConceptClick: (concept: string) => void,
  isViewed: boolean
): JSX.Element {
  // Solo mostrar indicador de "visto" en secciones muy importantes
  const showViewedIndicator = isViewed && (section.points || 0) >= 20;

  switch (section.type) {
    case 'title':
      return (
        <div className="relative text-center py-12 mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            {section.emoji && (
              <div className="text-6xl mb-6 animate-float">{section.emoji}</div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              {section.content}
            </h1>
            
            {/* Efecto decorativo */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl blur-2xl -z-10" />
          </motion.div>
        </div>
      );

    case 'header':
      return (
        <div className={`relative group ${section.className || 'text-xl font-bold text-gray-800 dark:text-gray-200 border-l-4 border-blue-500 pl-4 py-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-r-lg mb-4'}`}>
          {showViewedIndicator && (
            <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full shadow-md">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {section.emoji && (
                <span className="text-xl flex-shrink-0" role="img">
                  {section.emoji}
                </span>
              )}
              <h2 className="flex-1">{section.content}</h2>
            </div>
            
            {/* Solo mostrar puntos para secciones importantes */}
            {section.points && section.points >= 15 && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Star className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  +{section.points}
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case 'list':
      return (
        <div className="space-y-3">
          <ul className="space-y-3">
            {section.items?.map((item: string, index: number) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mt-0.5 shadow-sm">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                  {renderTextWithConcepts(item, onConceptClick)}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      );

    case 'jurisprudencia':
    case 'doctrina':
    case 'examples':
    case 'questions':
      const sectionConfig = {
        jurisprudencia: {
          emoji: '⚖️',
          bgClass: 'from-amber-50/70 via-yellow-50/70 to-orange-50/70 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30',
          borderClass: 'border-amber-500',
          title: 'Jurisprudencia'
        },
        doctrina: {
          emoji: '📚',
          bgClass: 'from-emerald-50/70 via-green-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-teal-950/30',
          borderClass: 'border-emerald-500',
          title: 'Doctrina'
        },
        examples: {
          emoji: '📝',
          bgClass: 'from-violet-50/70 via-purple-50/70 to-fuchsia-50/70 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30',
          borderClass: 'border-violet-500',
          title: 'Ejemplo Práctico'
        },
        questions: {
          emoji: '🔍',
          bgClass: 'from-rose-50/70 via-pink-50/70 to-red-50/70 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-red-950/30',
          borderClass: 'border-rose-500',
          title: 'Pregunta de Análisis'
        }
      };

      const config = sectionConfig[section.type as keyof typeof sectionConfig];

      return (
        <div className={`relative p-6 bg-gradient-to-r ${config.bgClass} border-l-4 ${config.borderClass} rounded-r-xl backdrop-blur-sm mb-6 shadow-lg`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-2xl mt-1">
              {config.emoji}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                {config.title}
              </div>
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {renderTextWithConcepts(section.content, onConceptClick)}
              </div>
              
              {/* Solo mostrar valor de puntos para secciones muy importantes */}
              {section.points && section.points >= 20 && (
                <div className="mt-4 flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Contenido de alto valor (+{section.points} pts)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'code':
      return (
        <motion.div 
          className="relative group mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header con información y gamificación */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  📋 Esquema de Memoria
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <span>Estructura visual optimizada para memorización</span>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">Aprendizaje acelerado</span>
                  </div>
                </p>
              </div>
            </div>
            
            {/* Indicadores de valor y progreso */}
            <div className="flex items-center space-x-3">
              {section.points && section.points >= 10 && (
                <motion.div 
                  className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full border border-emerald-200 dark:border-emerald-800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    +{section.points} pts
                  </span>
                </motion.div>
              )}
              
              {isViewed && (
                <motion.div 
                  className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">Dominado</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Contenedor principal del esquema */}
          <div className="schema-container schema-premium-effect group-hover:schema-completed">
            {/* Barra superior estilo terminal */}
            <div className="schema-header">
              <div className="schema-dots">
                <div className="schema-dot schema-dot-red"></div>
                <div className="schema-dot schema-dot-yellow"></div>
                <div className="schema-dot schema-dot-green"></div>
              </div>
              <span className="schema-title">Esquema Legal Interactivo</span>
              <div className="ml-auto flex items-center space-x-2 text-white/80 text-xs">
                <Brain className="w-4 h-4" />
                <span>Memorización Visual</span>
              </div>
            </div>

            {/* Contenido del esquema */}
            <div className="schema-content">
              <div className="relative">
                {/* Fondo decorativo sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-teal-50/30 dark:from-emerald-950/20 dark:via-transparent dark:to-teal-950/20 rounded-lg"></div>
                
                {/* Texto del esquema con formato mejorado */}
                <pre className="relative whitespace-pre-wrap overflow-auto text-sm leading-7 font-mono">
                  <code className="text-gray-800 dark:text-gray-200 schema-interactive">
                    {section.content}
                  </code>
                </pre>
              </div>
            </div>

            {/* Barra inferior con estadísticas */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50/50 via-white/50 to-gray-50/50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Estructura jerárquica</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Retención mejorada</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Revisión rápida</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded-md transition-colors text-blue-700 dark:text-blue-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSectionView(section.id, section.points)}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Marcar como estudiado</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Efectos decorativos */}
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            initial={false}
            animate={isViewed ? { opacity: 0.3 } : { opacity: 0 }}
          />
        </motion.div>
      );

    default:
      return (
        <div className="relative p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="leading-relaxed text-gray-700 dark:text-gray-300">
            {renderTextWithConcepts(section.content, onConceptClick)}
          </div>
        </div>
      );
  }
}

/**
 * Renderiza texto convirtiendo conceptos en enlaces interactivos mejorados
 */
function renderTextWithConcepts(
  text: string, 
  onConceptClick: (concept: string) => void
): React.ReactNode {
  if (!text) return null;

  // Términos legales comunes para detectar conceptos
  const legalTerms = [
    'Dominio', 'Posesión', 'Capacidad', 'Nulidad', 'Contrato', 'Obligación',
    'Acto Jurídico', 'Derecho Civil', 'Derecho Penal', 'Derecho Procesal',
    'Reivindicatoria', 'Hipoteca', 'Prenda', 'Usufructo', 'Servidumbre',
    'Prescripción', 'Tradición', 'Registro Conservatorio', 'Tribunal',
    'Sentencia', 'Recurso', 'Casación', 'Apelación'
  ];

  // Dividir el texto en palabras y procesar
  const words = text.split(/(\s+)/);
  const elements: React.ReactNode[] = [];
  
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[.,;:!?()]/g, '');
    
    // Verificar si es un concepto legal conocido
    const isLegalConcept = legalTerms.some(term => 
      term.toLowerCase() === cleanWord.toLowerCase()
    );
    
    if (isLegalConcept) {
      elements.push(
        <button
          key={index}
          onClick={() => onConceptClick(cleanWord)}
          className="inline-flex items-center px-2 py-0.5 mx-0.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline decoration-dotted underline-offset-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all duration-200 font-medium"
        >
          {word}
        </button>
      );
    } else {
      elements.push(
        <span key={index}>{word}</span>
      );
    }
  });

  return <>{elements}</>;
}

export default ApuntesContent; 