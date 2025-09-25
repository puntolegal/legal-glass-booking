import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Award, 
  Star, 
  Share2, 
  Bookmark,
  Eye,
  Brain,
  Target,
  Trophy,
  Sparkles,
  ChevronRight,
  Home,
  ExternalLink,
  BarChart3,
  Network,
  Users,
  Timer,
  Flame,
  Crown,
  Rocket,
  ArrowUp,
  GraduationCap,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ApuntesHeader from '@/components/ApuntesHeader';
import ApuntesContent from '@/components/ApuntesContent';
import InteractiveQuiz from '@/components/InteractiveQuiz';
import { useGamification } from '@/contexts/GamificationContext';
import apuntesDataFile from './data/apuntes.json';

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
  related?: string[];
  tags?: string[];
}

const apuntesData = apuntesDataFile.apuntes || [];

const ApunteDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apunte, setApunte] = useState<ApunteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedNotes, setRelatedNotes] = useState<ApunteData[]>([]);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const { progress, readNote, hasReadNote } = useGamification();

  useEffect(() => {
    if (!slug) {
      navigate('/apuntes');
      return;
    }

    setLoading(true);
    
    // Buscar el apunte por slug, id o título
    const foundApunte = apuntesData.find((note: any) => {
      const noteSlug = note.slug || note.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return noteSlug === slug || 
             note.id === slug || 
             note.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === slug;
    });

    if (foundApunte) {
      // Determinar el contenido: priorizar excerpt, luego content, luego cargar desde archivo MD
      let processedContent = foundApunte.content || foundApunte.excerpt || '';
      
      // Si no hay contenido, intentar cargar desde archivo MD
      if (!processedContent && foundApunte.filePath) {
        processedContent = `# ${foundApunte.title}

## Contenido en Desarrollo

Esta nota está siendo desarrollada. El contenido completo estará disponible pronto.

### Información Disponible:
- **Categoría**: ${foundApunte.category || 'General'}
- **Dificultad**: ${foundApunte.difficulty || 'Básico'}
- **Tiempo estimado**: ${foundApunte.estimatedTime || '15 min'}

### Conceptos Relacionados:
${(foundApunte.related || []).map((concept: string) => `- [[${concept}]]`).join('\n')}

*Nota: El contenido detallado de esta sección se encuentra en desarrollo.*`;
      }
      
      const transformedApunte: ApunteData = {
        id: foundApunte.id || slug,
        title: cleanTitle(foundApunte.title),
        content: processedContent,
        category: foundApunte.category || 'general',
        difficulty: (foundApunte.difficulty as 'básico' | 'intermedio' | 'avanzado') || 'básico',
        readTime: calculateReadTime(processedContent),
        lastModified: foundApunte.lastModified || foundApunte.date || new Date().toISOString(),
        slug: foundApunte.slug || slug,
        author: foundApunte.author || 'Punto Legal',
        concepts: foundApunte.related || foundApunte.links || [],
        points: calculatePoints(processedContent, foundApunte.difficulty || 'básico'),
        excerpt: foundApunte.excerpt,
        related: foundApunte.related || [],
        tags: foundApunte.tags || []
      };
      
      setApunte(transformedApunte);
      
      // Buscar notas relacionadas inteligentemente
      findRelatedNotes(transformedApunte);
      
      // Actualizar historial de navegación
      updateNavigationHistory(slug);
      
    } else {
      console.warn(`Nota no encontrada para slug: ${slug}`);
      navigate('/apuntes');
    }
    
    setLoading(false);
  }, [slug, navigate]);

  const cleanTitle = (title: string): string => {
    return title
      .replace(/^\[\[/, '')
      .replace(/\]\]$/, '')
      .replace(/\*\*/g, '')
      .trim();
  };

  const calculateReadTime = (content: string): number => {
    const words = content.split(/\s+/).length;
    return Math.max(Math.ceil(words / 200), 1); // 200 palabras por minuto
  };

  const calculatePoints = (content: string, difficulty: string): number => {
    const basePoints = Math.min(content.length / 100, 50);
    const bonusPoints = content.includes('jurisprudencia') ? 20 : 0;
    return Math.round(basePoints + bonusPoints);
  };

  const findRelatedNotes = (currentNote: ApunteData) => {
    const related = apuntesData
      .filter((note: any) => {
        if (note.id === currentNote.id) return false;
        
        // Buscar por categoría similar
        if (note.category === currentNote.category) return true;
        
        // Buscar por conceptos relacionados
        const noteRelated = note.related || [];
        const hasCommonConcept = currentNote.concepts.some(concept => 
          noteRelated.includes(concept) || 
          note.title.toLowerCase().includes(concept.toLowerCase())
        );
        
        if (hasCommonConcept) return true;
        
        // Buscar por tags similares
        const noteTags = note.tags || [];
        const hasCommonTag = currentNote.tags?.some(tag => noteTags.includes(tag));
        
        return hasCommonTag;
      })
      .slice(0, 6)
      .map((note: any) => ({
        id: note.id,
        title: cleanTitle(note.title),
        content: note.content || note.excerpt || '',
        category: note.category,
        difficulty: (['básico', 'intermedio', 'avanzado'] as const).includes(note.difficulty) 
          ? note.difficulty as 'básico' | 'intermedio' | 'avanzado'
          : 'básico',
        readTime: calculateReadTime(note.content || note.excerpt || ''),
        lastModified: note.lastModified || note.date,
        slug: note.slug || note.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        author: note.author || 'Punto Legal',
        concepts: note.related || [],
        points: calculatePoints(note.content || note.excerpt || '', note.difficulty || 'básico'),
        excerpt: note.excerpt
      }));

    setRelatedNotes(related);
  };

  const updateNavigationHistory = (currentSlug: string) => {
    const history = JSON.parse(localStorage.getItem('apuntes-navigation-history') || '[]');
    const newHistory = [currentSlug, ...history.filter((s: string) => s !== currentSlug)].slice(0, 10);
    localStorage.setItem('apuntes-navigation-history', JSON.stringify(newHistory));
    setNavigationHistory(newHistory);
  };

  const handleConceptClick = (concept: string) => {
    const slug = concept.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/^-+|-+$/g, '');
    
    // Buscar si existe una nota con ese concepto
    const conceptNote = apuntesData.find((note: any) => {
      const noteSlug = note.slug || note.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const noteTitle = note.title.toLowerCase();
      return noteSlug === slug || 
             noteTitle.includes(concept.toLowerCase()) ||
             (note.related && note.related.some((r: string) => r.toLowerCase() === concept.toLowerCase()));
    });

    if (conceptNote) {
      const targetSlug = conceptNote.slug || conceptNote.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      navigate(`/apuntes/${targetSlug}`);
    } else {
      // Si no encuentra la nota exacta, buscar en la lista general
      navigate(`/apuntes?search=${encodeURIComponent(concept)}`);
    }
  };

  const handleRelatedNoteClick = (note: ApunteData) => {
    navigate(`/apuntes/${note.slug}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'básico': return 'from-green-500 to-emerald-500';
      case 'intermedio': return 'from-blue-500 to-indigo-500';
      case 'avanzado': return 'from-purple-500 to-violet-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'básico': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'intermedio': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'avanzado': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <ApuntesHeader searchQuery="" onSearchChange={() => {}} />
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando nota...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!apunte) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <ApuntesHeader searchQuery="" onSearchChange={() => {}} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nota no encontrada
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              La nota que buscas no existe o ha sido movida.
            </p>
            <Button onClick={() => navigate('/apuntes')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Apuntes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <ApuntesHeader 
        searchQuery={searchParams.get('search') || ''} 
        onSearchChange={() => {}}
        breadcrumbs={[
          { label: 'Apuntes', href: '/apuntes' },
          { label: apunte.title }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Header de la nota */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border border-white/20 dark:border-gray-700/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge className={`${getDifficultyBg(apunte.difficulty)} border-0`}>
                      {apunte.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                      {apunte.category}
                    </Badge>
                    {hasReadNote(apunte.id) && (
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-0">
                        <Eye className="w-3 h-3 mr-1" />
                        Leído
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {apunte.title}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{apunte.readTime} min de lectura</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{apunte.points} puntos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{apunte.author}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Progreso y estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {progress.totalPoints}
                  </div>
                  <div className="text-xs text-gray-500">Puntos totales</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {progress.notesRead}
                  </div>
                  <div className="text-xs text-gray-500">Notas leídas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {progress.currentStreak}
                  </div>
                  <div className="text-xs text-gray-500">Racha actual</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {progress.medals.length}
                  </div>
                  <div className="text-xs text-gray-500">Medallas</div>
                </div>
              </div>
            </motion.div>

            {/* Contenido de la nota */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
            >
              <ApuntesContent 
                content={apunte.content}
                noteId={apunte.id}
                category={apunte.category}
                onConceptClick={handleConceptClick}
              />
            </motion.div>

            {/* Quiz interactivo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <InteractiveQuiz 
                noteId={apunte.id}
                category={apunte.category}
                difficulty={apunte.difficulty}
                onComplete={(score, total, pointsEarned) => {
                  // Bonus por completar quiz
                  if (score === total) {
                    readNote(`quiz-perfect-${apunte.id}`, apunte.category);
                  }
                  console.log(`Quiz completado: ${score}/${total} - ${pointsEarned} puntos`);
                }}
              />
            </motion.div>

            {/* 📚 BOTÓN DE SIGUIENTE NOTA - PROFESIONAL Y ACADÉMICO */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-blue-200/30 dark:border-blue-700/30 relative overflow-hidden"
            >
              {/* Línea superior elegante */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />
              
              <div className="relative text-center space-y-6">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Continuar Estudio Legal
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto">
                    Avanza en tu formación jurídica con el siguiente concepto. Cada nota te acerca más al dominio del derecho.
                  </p>
                </div>

                {/* Progreso académico */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.max(0, 174 - (progress?.readNotes?.size || 0))}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      conceptos restantes
                    </div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      +{calculatePoints(apunte.content, apunte.difficulty)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      pts adquiridos
                    </div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(((progress?.readNotes?.size || 0) / 174) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      completado
                    </div>
                  </div>
                </div>

                {/* Botón de acción principal profesional */}
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      // Buscar siguiente nota en el mismo orden que aparecen
                      const currentIndex = apuntesData.findIndex(note => note.id === apunte.id);
                      const nextNote = apuntesData[currentIndex + 1] || apuntesData[0]; // Circular
                      navigate(`/apuntes/${nextNote.slug}`);
                    }}
                    className="group w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-4 px-8 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <GraduationCap className="w-5 h-5" />
                      <span>Siguiente Concepto Legal</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>

                  {/* Acciones secundarias */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button
                      onClick={() => navigate('/apuntes')}
                      variant="outline"
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-blue-200 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Biblioteca de Conceptos
                    </Button>
                    
                    <Button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      variant="ghost"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Repasar Concepto
                    </Button>
                  </div>
                </div>

                {/* Mensaje académico motivacional */}
                <div className="text-sm text-gray-500 dark:text-gray-400 italic font-medium max-w-lg mx-auto">
                  {[
                    "El conocimiento jurídico se construye paso a paso, concepto por concepto.",
                    "Cada principio dominado fortalece tu comprensión del ordenamiento legal.",
                    "La excelencia en derecho requiere estudio sistemático y perseverancia.",
                    "Tu dedicación al estudio del derecho te distinguirá como profesional.",
                    "El dominio de los fundamentos legales es la base del éxito profesional."
                  ][Math.floor(Math.random() * 5)]}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar con notas relacionadas */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 space-y-6"
            >
              {/* Notas relacionadas */}
              {relatedNotes.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <div className="flex items-center space-x-2 mb-4">
                    <Network className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Conceptos Relacionados
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {relatedNotes.slice(0, 4).map((note) => (
                      <motion.button
                        key={note.id}
                        onClick={() => handleRelatedNoteClick(note)}
                        className="w-full text-left p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-200 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {note.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {note.category} • {note.readTime} min
                            </div>
                            <div className={`inline-block px-2 py-0.5 rounded-full text-xs mt-2 ${getDifficultyBg(note.difficulty)}`}>
                              {note.difficulty}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Progreso global */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tu Progreso
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Dominio General</span>
                      <span className="font-medium">{Math.round((progress.notesRead / 174) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((progress.notesRead / 174) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-center text-xs">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <div className="font-bold text-blue-600 dark:text-blue-400">{progress.totalPoints}</div>
                      <div className="text-gray-600 dark:text-gray-400">Puntos</div>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <div className="font-bold text-green-600 dark:text-green-400">{progress.medals.length}</div>
                      <div className="text-gray-600 dark:text-gray-400">Medallas</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApunteDetail; 