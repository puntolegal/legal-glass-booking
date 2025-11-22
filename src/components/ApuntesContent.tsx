import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Link2,
  ArrowRight,
  CheckCircle,
  Star,
  Flame,
  Zap,
  BookOpen,
  FileText,
  HelpCircle,
  Sparkles,
  Stamp,
  LayoutGrid,
  Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditManager } from '@/hooks/useAuditManager';
import { parseObsidianContent, type ParsedContent, type ParsedSection } from '@/utils/obsidianParser';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

interface ApuntesContentProps {
  content: string;
  noteId: string;
  category: string;
  onConceptClick?: (concept: string) => void;
}

// 🍎 iPadOS Design System - Materiales Premium
const GLASS_PANEL = "bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-xl shadow-black/5";
const GLASS_BUBBLE = "bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-xl border border-white/30 dark:border-white/5";
const ACTIVE_BUBBLE = "bg-white/70 dark:bg-[#3a3a3c]/70 border-indigo-500/30 shadow-lg shadow-indigo-500/10";

const ApuntesContent: React.FC<ApuntesContentProps> = ({
  content,
  noteId,
  category,
  onConceptClick
}) => {
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null);
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const [readingProgress, setReadingProgress] = useState(0);
  const [hasRegisteredRead, setHasRegisteredRead] = useState(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsDelta, setPointsDelta] = useState(0);
  const [isStamping, setIsStamping] = useState(false);
  const navigate = useNavigate();
  const { readNote, hasReadNote, progress } = useGamification();
  const { isCurator } = useAuth();
  const { isAudited, toggleAudit } = useAuditManager();

  const isRead = useMemo(() => (hasReadNote ? hasReadNote(noteId) : false), [hasReadNote, noteId]);
  const totalPoints = progress?.totalPoints || 0;
  const currentStreak = progress?.currentStreak || 0;
  const noteIsAudited = isAudited(noteId);
  const earnedPoints = useMemo(() => {
    if (!parsedContent?.sections) return 0;
    return parsedContent.sections.reduce((acc, s) => acc + (s.points || 3), 0);
  }, [parsedContent]);

  useEffect(() => {
    if (!content) return;
    const parsed = parseObsidianContent(content);
    setParsedContent(parsed);
    setViewedSections(new Set());
    setReadingProgress(isRead ? 100 : 0);
    setHasRegisteredRead(isRead);
  }, [content, isRead]);

  useEffect(() => {
    if (!parsedContent || !isRead) return;
    const preViewed = new Set(parsedContent.sections?.map(section => section.id));
    setViewedSections(preViewed);
    setReadingProgress(100);
    setHasRegisteredRead(true);
  }, [isRead, parsedContent]);

  useEffect(() => {
    if (!parsedContent || hasRegisteredRead || isRead) return;
    if (readingProgress >= 75) {
      readNote(noteId, category);
      setHasRegisteredRead(true);
      triggerPointsAnimation(12);
    }
  }, [readingProgress, parsedContent, hasRegisteredRead, isRead, noteId, category, readNote]);

  const handleSectionView = (sectionId: string, points: number = 4) => {
    setViewedSections(prev => {
      if (prev.has(sectionId)) return prev;
      const next = new Set(prev);
      next.add(sectionId);
      updateProgress(next);
      triggerPointsAnimation(points);
      return next;
    });
  };

  const updateProgress = (sectionsSet?: Set<string>) => {
    if (!parsedContent || !parsedContent.sections?.length) return;
    const total = parsedContent.sections.length;
    const viewed = sectionsSet ? sectionsSet.size : viewedSections.size;
    const progressValue = Math.min((viewed / total) * 100, 100);
    setReadingProgress(progressValue);
  };

  const triggerPointsAnimation = (points: number) => {
    if (points <= 0) return;
    setPointsDelta(points);
    setShowPointsAnimation(true);
    
    if (readingProgress >= 75 && !hasRegisteredRead) {
      window.dispatchEvent(new CustomEvent('note-completed', { detail: { noteId, points } }));
    }
    
    setTimeout(() => setShowPointsAnimation(false), 1500);
  };

  const handleAudit = async () => {
    const wasAudited = noteIsAudited;
    await toggleAudit(noteId);
    
    if (!wasAudited) {
      setIsStamping(true);
      setTimeout(() => {
        setIsStamping(false);
        // Emitir evento para actualizar página de auditoría
        window.dispatchEvent(new CustomEvent('apuntes-audit-changed'));
      }, 2500);
      } else {
      // También emitir si se des-audita
      window.dispatchEvent(new CustomEvent('apuntes-audit-changed'));
    }
  };

  const handleConcept = (concept: string) => {
    if (onConceptClick) {
      onConceptClick(concept);
      return;
    }
    const slug = concept
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/^-+|-+$/g, '');
    navigate(`/apuntes/${slug}`);
  };

  if (!parsedContent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 px-4 md:px-8 relative font-sans text-slate-800 dark:text-slate-200 selection:bg-indigo-500/20">
      {/* Fondo Vivo */}
      <AmbientBackground />

      {/* Dynamic Island Header (Píldora Flotante) */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-6 z-40 mx-auto max-w-4xl mb-8"
      >
        <div className={`mx-4 ${GLASS_PANEL} rounded-full px-4 py-3 flex items-center justify-between shadow-2xl shadow-black/10`}>
          
          <div className="flex items-center gap-4 pl-2">
            {/* Circular Progress */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path 
                  className="text-white/20 dark:text-white/10" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor"
                    strokeWidth="3"
                />
                <path 
                  className="text-indigo-500 dark:text-indigo-400 drop-shadow-[0_0_4px_rgba(99,102,241,0.5)] transition-all duration-500" 
                  strokeDasharray={`${readingProgress}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              <span className="absolute text-[10px] font-bold text-[#1d1d1f] dark:text-white">{Math.round(readingProgress)}%</span>
          </div>

            <div className="hidden sm:block">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Puntos</div>
              <div className="text-sm font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" strokeWidth={2} />
                {totalPoints}
            </div>
            </div>
          </div>

          {/* Action Island */}
          <div className="flex items-center gap-2 pr-2">
            {isCurator && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAudit}
                className={`h-9 px-4 rounded-full flex items-center gap-2 transition-all ${
                  noteIsAudited 
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                    : 'bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Stamp className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-xs font-semibold uppercase tracking-wide">{noteIsAudited ? 'Validado' : 'Auditar'}</span>
              </motion.button>
            )}
            
            <button 
              onClick={() => navigate('/apuntes')} 
              className="w-9 h-9 rounded-full bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <LayoutGrid className="w-4 h-4 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hoja Flotante (Contenido Principal) */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${GLASS_PANEL} rounded-[32px] p-8 md:p-12 mb-8`}
        >
          {/* Título Hero */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1d1d1f] dark:text-white mb-6">
              {parsedContent.title}
            </h1>
            {parsedContent.concepts && parsedContent.concepts.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {parsedContent.concepts.slice(0, 5).map(c => (
                  <button
                    key={c} 
                    onClick={() => handleConcept(c)} 
                    className="px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 border border-white/30 dark:border-white/5 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:scale-105 transition-transform"
                  >
                    #{c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Secciones como Burbujas */}
          <div className="space-y-6">
            {parsedContent.sections?.map((section, index) => (
              <motion.div
                key={section.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                onViewportEnter={() => handleSectionView(section.id, section.points || 3)}
              >
                {renderIOSBubble(section, handleConcept, viewedSections.has(section.id))}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer de Completitud */}
        {readingProgress >= 100 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className={`${GLASS_PANEL} rounded-[32px] p-8 md:p-12 bg-[#1d1d1f] dark:bg-stone-800 text-white text-center shadow-2xl shadow-black/20 overflow-hidden relative`}
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/30">
                <Trophy className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold mb-2">¡Excelente Trabajo!</h2>
              <p className="text-white/80 mb-8">Has dominado este tema y sumado +{earnedPoints} puntos a tu perfil.</p>
              <button 
                onClick={() => navigate('/apuntes')} 
                className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Continuar Estudiando
              </button>
            </div>
            <div className="absolute top-[-50%] left-[-20%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px]" />
        </motion.div>
      )}

        {/* Timbre Legal - Estilo Profesional */}
        {isCurator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <motion.button
              onClick={handleAudit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`relative w-full max-w-md rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 px-8 py-6 ${
                noteIsAudited 
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-900/20 shadow-lg shadow-emerald-500/10' 
                  : 'border-stone-300 dark:border-stone-600 bg-stone-50/40 dark:bg-stone-800/20 hover:border-stone-400 dark:hover:border-stone-500'
              }`}
            >
              {noteIsAudited ? (
                <div className="text-center space-y-2">
                  {/* Línea superior decorativa */}
                  <div className="w-24 h-0.5 bg-emerald-600 dark:bg-emerald-500 mx-auto mb-3" />
                  
                  {/* Texto principal */}
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em]">
                    Auditado por
                  </p>
                  <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 font-serif">
                    Amanda G.
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium uppercase tracking-wider">
                    Habilitada en Derecho
                  </p>
                  
                  {/* Separador */}
                  <div className="w-16 h-0.5 bg-emerald-600 dark:bg-emerald-500 mx-auto my-2" />
                  
                  {/* Entidad */}
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Punto Legal
                  </p>
                  
                  {/* Fecha */}
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
                    {new Date().toLocaleDateString('es-CL', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                  
                  {/* Línea inferior decorativa */}
                  <div className="w-24 h-0.5 bg-emerald-600 dark:bg-emerald-500 mx-auto mt-3" />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                    Validar Contenido
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                    Haz clic para auditar esta nota
                  </p>
                </div>
              )}
              
              {isStamping && (
                <>
                  <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute inset-0 rounded-2xl border-4 border-emerald-500 dark:border-emerald-400"
                  />
                  <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="absolute inset-0 rounded-2xl bg-emerald-500 dark:bg-emerald-400"
                  />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
      
      {/* Stamp Overlay (Animación de Auditoría) */}
      <AnimatePresence>
        {isStamping && (
          <motion.div 
            initial={{ scale: 2, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-80 max-w-[90vw] rounded-2xl border-4 border-emerald-600 flex flex-col items-center justify-center text-emerald-700 bg-white/95 shadow-2xl backdrop-blur-sm px-8 py-6 rotate-[-2deg]">
              <div className="w-24 h-0.5 bg-emerald-600 mb-3" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-1">Auditado por</span>
              <span className="text-3xl font-bold font-serif mb-1">Amanda G.</span>
              <span className="text-[10px] font-medium uppercase tracking-wider mb-2">Habilitada en Derecho</span>
              <div className="w-16 h-0.5 bg-emerald-600 my-2" />
              <span className="text-xs font-bold uppercase tracking-wider mb-3">Punto Legal</span>
              <span className="text-[10px] font-medium">{new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <div className="w-24 h-0.5 bg-emerald-600 mt-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Points Animation */}
      <AnimatePresence>
        {showPointsAnimation && (
          <motion.div
            key={pointsDelta}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -8 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="fixed top-24 right-8 z-50 px-4 py-2 rounded-full bg-indigo-500/90 backdrop-blur-md text-white text-sm font-bold shadow-lg"
          >
            +{pointsDelta} pts
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApuntesContent;

// --- RENDERIZADOR DE BURBUJAS iOS ---
function renderIOSBubble(section: ParsedSection, onConceptClick: (c: string) => void, isViewed: boolean) {
  const bubbleClass = isViewed ? ACTIVE_BUBBLE : GLASS_BUBBLE;
  
  // Títulos de Sección (Headers) - Flotan fuera de burbujas
  if (section.type === 'header') {
    return (
      <div className="mt-12 mb-6 px-2 flex items-baseline justify-between">
        <h2 className="text-2xl font-serif font-bold text-[#1d1d1f] dark:text-white tracking-tight flex items-center gap-3">
          {section.content}
        </h2>
        {isViewed && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
      </div>
    );
  }

  // Bloques Legales (Jurisprudencia, Doctrina, etc.) - Cards con Iconos Grandes
  if (['jurisprudencia', 'doctrina', 'quote'].includes(section.type)) {
    const accentColor = section.type === 'jurisprudencia' ? 'stone' : section.type === 'doctrina' ? 'indigo' : 'slate';
    const Icon = section.type === 'jurisprudencia' ? FileText : section.type === 'doctrina' ? BookOpen : FileText;

  return (
      <div className={`${GLASS_BUBBLE} rounded-2xl p-6 relative overflow-hidden`}>
        {/* Icono Grande de Fondo (Baja Opacidad) */}
        <div className={`absolute top-0 right-0 p-6 opacity-5 text-${accentColor}-500`}>
          <Icon className="w-32 h-32" strokeWidth={1} />
        </div>
        
        <div className="relative z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${accentColor}-50 dark:bg-${accentColor}-900/30 text-${accentColor}-700 dark:text-${accentColor}-300 text-[10px] font-bold uppercase tracking-wider mb-4`}>
            <Icon className="w-3 h-3" strokeWidth={2} />
            {section.type}
          </div>
          <p className="text-lg font-serif italic text-slate-700 dark:text-slate-200 leading-relaxed">
            "{renderRichText(section.content, onConceptClick)}"
          </p>
        </div>
      </div>
    );
  }

  // Definition - Burbuja especial con borde
  if (section.type === 'definition') {
    return (
      <div className={`${bubbleClass} rounded-2xl p-6 border-l-4 border-indigo-500`}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-4">
          <HelpCircle className="w-3 h-3" strokeWidth={2} />
          Definición
        </div>
        <p className="text-[16px] leading-7 text-slate-700 dark:text-slate-200">
          {renderRichText(section.content, onConceptClick)}
        </p>
      </div>
    );
  }

  // Listas y Texto Normal - Burbujas limpias
  return (
    <div className={`${bubbleClass} rounded-2xl p-6`}>
      {section.type === 'list' ? (
        <ul className="space-y-3">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-1.5 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                {i + 1}
          </div>
              <span className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
                {renderRichText(item, onConceptClick)}
              </span>
              </li>
            ))}
          </ul>
      ) : (
        <p className="text-[16px] leading-7 text-slate-700 dark:text-slate-200">
          {renderRichText(section.content, onConceptClick)}
        </p>
      )}
    </div>
  );
}

// Helper para renderizar texto con conceptos clickeables
function renderRichText(text: string, onConceptClick: (c: string) => void): React.ReactNode {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[[') && part.endsWith(']]')) {
          const concept = part.slice(2, -2);
          return (
            <button
              key={i}
              onClick={() => onConceptClick(concept)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {concept}
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
