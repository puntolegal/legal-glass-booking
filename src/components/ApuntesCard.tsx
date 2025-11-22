import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Tag, 
  Link, 
  BookOpen, 
  TrendingUp, 
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Calendar,
  User,
  CheckCircle,
  Eye,
  Sparkles,
  Zap,
  Target,
  Award,
  Trophy
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useGamification } from '@/contexts/GamificationContext';

interface Apunte {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  related: string[];
  date: string;
  excerpt: string;
  category: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  estimatedTime: string;
  filePath: string;
  content?: string;
  links?: string[];
  author?: string;
  lastModified?: string;
}

interface ApuntesCardProps {
  apunte: Apunte;
  onNoteClick?: (apunte: Apunte) => void;
  onConceptClick?: (concept: string) => void;
  showContent?: boolean;
}

const ApuntesCard: React.FC<ApuntesCardProps> = ({ 
  apunte, 
  onNoteClick,
  onConceptClick,
  showContent = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(showContent);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { hasReadNote } = useGamification();

  const isRead = hasReadNote(apunte.id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'básico':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      case 'avanzado':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'derecho-civil':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';
      case 'derecho-procesal':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700';
      case 'derecho-penal':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      case 'derecho-constitucional':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      case 'derecho-laboral':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700';
      case 'derecho-comercial':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const extractContentPreview = (content: string) => {
    if (!content) return '';
    
    // Remover frontmatter si existe
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Extraer primer párrafo después de los headers
    const lines = contentWithoutFrontmatter.split('\n');
    const firstParagraph = lines.find(line => 
      line.trim() && 
      !line.startsWith('#') && 
      !line.startsWith('##') && 
      !line.startsWith('###') &&
      !line.startsWith('**') &&
      !line.startsWith('-')
    );
    
    return firstParagraph ? firstParagraph.trim() : '';
  };

  const extractKeyConcepts = (content: string) => {
    if (!content) return [];
    
    const concepts: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.includes('## 💡 Conceptos Clave') || line.includes('**Claves:**')) {
        // Buscar conceptos en las siguientes líneas
        const nextLines = lines.slice(lines.indexOf(line) + 1);
        for (const nextLine of nextLines) {
          if (nextLine.startsWith('##') || nextLine.trim() === '') break;
          const matches = nextLine.match(/\[\[([^\]]+)\]\]/g);
          if (matches) {
            concepts.push(...matches.map(match => match.replace(/\[\[|\]\]/g, '')));
          }
        }
        break;
      }
    }
    
    return concepts.slice(0, 8); // Máximo 8 conceptos
  };


  const handleCardClick = () => {
    if (onNoteClick) {
      onNoteClick(apunte);
    }
  };

  const handleConceptClick = (concept: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onConceptClick) {
      onConceptClick(concept);
    }
  };

  const renderInlineSegments = (text: string, keyPrefix: string) => {
    return text
      .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
      .filter(Boolean)
      .map((segment, idx) => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return (
            <strong key={`${keyPrefix}-bold-${idx}`} className="font-semibold">
              {segment.slice(2, -2)}
            </strong>
          );
        }
        if (segment.startsWith('*') && segment.endsWith('*')) {
          return (
            <em key={`${keyPrefix}-italic-${idx}`} className="italic">
              {segment.slice(1, -1)}
            </em>
          );
        }
        return <span key={`${keyPrefix}-text-${idx}`}>{segment}</span>;
      });
  };

  const renderLineWithConcepts = (line: string, keyPrefix: string) => {
    const parts = line.split(/(\[\[[^\]]+\]\])/g).filter(Boolean);
    const nodes: React.ReactNode[] = [];

    parts.forEach((part, idx) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const concept = part.slice(2, -2);
        nodes.push(
          <button
            key={`${keyPrefix}-concept-${idx}`}
            onClick={(event) => handleConceptClick(concept, event)}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            {concept}
          </button>
        );
      } else {
        nodes.push(...renderInlineSegments(part, `${keyPrefix}-inline-${idx}`));
      }
    });

    return nodes;
  };

  const renderStructuredLine = (line: string, index: number) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={`spacer-${index}`} className="h-2" />;
    }

    const cleanText = trimmed.replace(/^[-*]\s+/, '');
    const content = renderLineWithConcepts(cleanText, `line-${index}`);

    if (trimmed.startsWith('###')) {
      return (
        <h4 key={`heading-3-${index}`} className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
          {renderLineWithConcepts(trimmed.replace(/^#+\s*/, ''), `heading-3-${index}`)}
        </h4>
      );
    }

    if (trimmed.startsWith('##')) {
      return (
        <h3 key={`heading-2-${index}`} className="text-base font-semibold text-gray-900 dark:text-white mt-3">
          {renderLineWithConcepts(trimmed.replace(/^#+\s*/, ''), `heading-2-${index}`)}
        </h3>
      );
    }

    if (trimmed.startsWith('#')) {
      return (
        <h2 key={`heading-1-${index}`} className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
          {renderLineWithConcepts(trimmed.replace(/^#+\s*/, ''), `heading-1-${index}`)}
        </h2>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <p
          key={`list-${index}`}
          className="text-sm text-gray-600 dark:text-gray-300 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500"
        >
          {content}
        </p>
      );
    }

    return (
      <p key={`paragraph-${index}`} className="text-sm text-gray-600 dark:text-gray-300">
        {content}
      </p>
    );
  };

  const contentPreview = extractContentPreview(apunte.content || '');
  const keyConcepts = extractKeyConcepts(apunte.content || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Indicador de lectura */}
      {isRead && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="bg-green-500 text-white rounded-full p-1 shadow-lg">
            <CheckCircle className="w-4 h-4" />
          </div>
        </motion.div>
      )}

      {/* Efectos de partículas gamificadas */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-4 right-4">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-4">
            <Zap className="w-3 h-3 text-blue-400 animate-bounce" />
          </div>
        </motion.div>
      )}

      <div className={`
        bg-white dark:bg-gray-800 rounded-xl border transition-all duration-300 overflow-hidden
        ${isRead 
          ? 'border-green-300 dark:border-green-600 shadow-lg' 
          : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
        }
        ${isHovered ? 'transform scale-[1.02]' : ''}
      `}>
        {/* Header con gradiente */}
        <div className="relative p-6 border-b border-gray-100 dark:border-gray-700">
          {/* Fondo con gradiente sutil */}
          <div className="absolute inset-0 bg-indigo-50/30 dark:bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                  {apunte.title}
                  {isRead && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-500"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.div>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{apunte.lastModified || apunte.date}</span>
                  {apunte.author && (
                    <>
                      <span>•</span>
                      <User className="w-4 h-4" />
                      <span>{apunte.author}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(apunte.difficulty)}`}>
                  {apunte.difficulty}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(apunte.category)}`}>
                  {apunte.category.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {contentPreview || apunte.excerpt}
            </p>

            {/* Key Concepts - Ahora clickeables */}
            {keyConcepts.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conceptos Clave</span>
                  <span className="text-xs text-gray-500">(click para navegar)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {keyConcepts.map((concept, index) => (
                    <motion.button
                      key={index}
                      onClick={(e) => handleConceptClick(concept, e)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      {concept}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats mejorados */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{apunte.estimatedTime}</span>
                </div>
                {apunte.links && apunte.links.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Link className="w-4 h-4" />
                    <span>{apunte.links.length} conexiones</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{isRead ? 'Leída' : 'No leída'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs">{apunte.filePath}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        {isExpanded && apunte.content && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {showFullContent ? (
                  <div className="space-y-2">
                    {apunte.content.split('\n').map((line, index) => renderStructuredLine(line, index))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {apunte.content.split('\n').slice(0, 10).map((line, index) => renderStructuredLine(line, index))}
                    {apunte.content.split('\n').length > 10 && (
                      <button
                        onClick={() => setShowFullContent(true)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2"
                      >
                        Ver contenido completo...
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer mejorado */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Ocultar contenido
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Ver contenido
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <RouterLink
                to={`/apuntes/${apunte.slug}`}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Ver completo
              </RouterLink>
              <motion.button
                onClick={handleCardClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors
                  ${isRead 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {isRead ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Releer
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Leer
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApuntesCard; 
