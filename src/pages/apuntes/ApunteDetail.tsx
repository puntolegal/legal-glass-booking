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
import { AmbientBackground } from '@/components/ui/AmbientBackground';
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
      case 'básico': return 'from-slate-400 to-slate-500';
      case 'intermedio': return 'from-slate-500 to-slate-600';
      case 'avanzado': return 'from-slate-600 to-slate-700';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'básico': return 'bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/40 text-stone-700 dark:text-stone-300 rounded-full';
      case 'intermedio': return 'bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-sm border border-indigo-200/30 dark:border-indigo-800/20 text-indigo-700 dark:text-indigo-300 rounded-full';
      case 'avanzado': return 'bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-sm border border-stone-300/50 dark:border-stone-600/40 text-stone-800 dark:text-stone-200 rounded-full';
      default: return 'bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/40 text-stone-700 dark:text-stone-300 rounded-full';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#000000]">
        <AmbientBackground />
        <ApuntesHeader searchQuery="" onSearchChange={() => {}} />
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-slate-600 dark:text-slate-400">Cargando nota...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!apunte) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#000000]">
        <AmbientBackground />
        <ApuntesHeader searchQuery="" onSearchChange={() => {}} />
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-4">
              Nota no encontrada
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
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
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#000000] relative overflow-hidden">
      <AmbientBackground />
      <ApuntesHeader 
        searchQuery={searchParams.get('search') || ''} 
        onSearchChange={() => {}}
        breadcrumbs={[
          { label: 'Apuntes', href: '/apuntes' },
          { label: apunte.title }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Header de la nota - Glassmorphism Premium */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[32px] border border-white/20 dark:border-white/5 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl shadow-xl shadow-black/5 p-6 sm:p-8 mb-8"
            >
              {/* Efecto de brillo interno sutil */}
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_30%_20%,rgba(100,116,139,0.03),transparent_70%)] pointer-events-none" />
              
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1 min-w-0">
                    {/* Badges mejorados */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`${getDifficultyBg(apunte.difficulty)} px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm`}>
                      {apunte.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-br from-slate-100/80 to-slate-50/80 dark:from-slate-800/60 dark:to-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                      {apunte.category}
                      </span>
                    {hasReadNote(apunte.id) && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/60 text-slate-700/90 dark:bg-slate-700/50 dark:text-slate-300/90 border border-slate-300/40 dark:border-slate-600/40 backdrop-blur-sm flex items-center gap-1.5">
                          <Eye className="w-3 h-3" />
                        Leído
                        </span>
                    )}
                  </div>
                  
                    {/* Título */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                    {apunte.title}
                  </h1>
                  
                    {/* Metadatos elegantes */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-slate-800/50 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="font-medium">{apunte.readTime} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-slate-800/50 flex items-center justify-center">
                          <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="font-medium">{apunte.points} puntos</span>
                    </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-slate-800/50 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                        <span className="font-medium">{apunte.author}</span>
                    </div>
                  </div>
                </div>
                
                  {/* Acciones */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                      variant="ghost"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`h-10 w-10 rounded-xl border transition-all ${
                        isBookmarked 
                          ? 'bg-slate-200/60 dark:bg-slate-700/50 border-slate-300/50 dark:border-slate-600/40 text-slate-700/90 dark:text-slate-300/90' 
                          : 'border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                      }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-10 w-10 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-all"
                    >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
                {/* Estadísticas Premium */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/30 dark:border-white/10">
                  <div className="text-center p-3 rounded-2xl bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-md border border-white/30 dark:border-white/5 hover:scale-105 transition-transform cursor-default group">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 tabular-nums mb-1 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                    {progress.totalPoints}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600/70 dark:text-slate-400/70">Puntos totales</div>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-md border border-white/30 dark:border-white/5 hover:scale-105 transition-transform cursor-default group">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 tabular-nums mb-1 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                      {progress.notesRead}
                </div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600/70 dark:text-slate-400/70">Notas leídas</div>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-md border border-white/30 dark:border-white/5 hover:scale-105 transition-transform cursor-default group">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 tabular-nums mb-1 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                      {progress.currentStreak}
                </div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600/70 dark:text-slate-400/70">Racha actual</div>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-md border border-white/30 dark:border-white/5 hover:scale-105 transition-transform cursor-default group">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 tabular-nums mb-1 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                      {progress.medals.length}
                </div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600/70 dark:text-slate-400/70">Medallas</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contenido de la nota */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-[32px] border border-white/20 dark:border-white/5 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl shadow-xl shadow-black/5 p-6 sm:p-8"
            >
              {/* Efecto de brillo interno sutil */}
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_30%_20%,rgba(100,116,139,0.03),transparent_70%)] pointer-events-none" />
              
              <div className="relative">
              <ApuntesContent 
                content={apunte.content}
                noteId={apunte.id}
                category={apunte.category}
                onConceptClick={handleConceptClick}
              />
              </div>
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
              className="bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[32px] p-8 shadow-xl shadow-black/5 relative overflow-hidden"
            >
              {/* Línea superior elegante */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-300/20 to-transparent" />
              
              <div className="relative text-center space-y-6">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-[#1d1d1f] dark:bg-stone-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Continuar Estudio Legal
                  </h3>
                  
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
                    Avanza en tu formación jurídica con el siguiente concepto. Cada nota te acerca más al dominio del derecho.
                  </p>
                </div>

                {/* Progreso académico */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/30 dark:border-slate-700/30">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      {Math.max(0, 174 - (progress?.readNotes?.size || 0))}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      conceptos restantes
                    </div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/30 dark:border-slate-700/30">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      +{calculatePoints(apunte.content, apunte.difficulty)}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      pts adquiridos
                    </div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/30 dark:border-slate-700/30">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      {Math.round(((progress?.readNotes?.size || 0) / 174) * 100)}%
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
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
                    className="group w-full max-w-md mx-auto bg-[#1d1d1f] hover:bg-[#2c2c2e] dark:bg-stone-700 dark:hover:bg-stone-600 text-white font-semibold py-4 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
                      className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-300"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Biblioteca de Conceptos
                    </Button>
                    
                    <Button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      variant="ghost"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Repasar Concepto
                    </Button>
                  </div>
                </div>

                {/* Mensaje académico motivacional */}
                <div className="text-sm text-slate-500 dark:text-slate-400 italic font-medium max-w-lg mx-auto">
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
                <div className="relative overflow-hidden rounded-[32px] border border-white/20 dark:border-white/5 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl shadow-xl shadow-black/5 p-6 mb-6">
          {/* Efecto de brillo interno sutil */}
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_30%_20%,rgba(100,116,139,0.03),transparent_70%)] pointer-events-none" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-slate-800/50 flex items-center justify-center">
                      <Network className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Conceptos Relacionados
                    </h3>
                  </div>
                  
                    <div className="space-y-2">
                    {relatedNotes.slice(0, 4).map((note) => (
                      <motion.button
                        key={note.id}
                        onClick={() => handleRelatedNoteClick(note)}
                          className="w-full text-left p-3 rounded-2xl bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-md border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-[#3a3a3c]/60 transition-all duration-200 group"
                          whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors mb-1">
                              {note.title}
                            </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                              {note.category} • {note.readTime} min
                            </div>
                              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getDifficultyBg(note.difficulty)}`}>
                              {note.difficulty}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors flex-shrink-0 ml-2 mt-1" />
                        </div>
                      </motion.button>
                    ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Progreso global */}
              <div className="relative overflow-hidden rounded-[32px] border border-white/20 dark:border-white/5 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl shadow-xl shadow-black/5 p-6">
          {/* Efecto de brillo interno sutil */}
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_30%_20%,rgba(100,116,139,0.03),transparent_70%)] pointer-events-none" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-slate-800/50 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Tu Progreso
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Dominio General</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{Math.round((progress.notesRead / 174) * 100)}%</span>
                    </div>
                      <div className="w-full h-2.5 bg-slate-200/60 dark:bg-slate-800/60 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((progress.notesRead / 174) * 100, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-stone-500 dark:bg-stone-600 rounded-full shadow-[0_0_8px_rgba(100,116,139,0.15)]"
                      />
                    </div>
                  </div>
                  
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-2xl bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-md border border-white/30 dark:border-white/5 text-center">
                        <div className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">{progress.totalPoints}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600/70 dark:text-slate-400/70">Puntos</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-md border border-white/30 dark:border-white/5 text-center">
                        <div className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">{progress.medals.length}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600/70 dark:text-slate-400/70">Medallas</div>
                    </div>
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