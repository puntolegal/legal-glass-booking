import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Search, 
  Filter,
  BookOpen,
  Flame, 
  Trophy, 
  Target, 
  Sparkles,
  ArrowUpRight,
  Clock,
  Library
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditManager } from '@/hooks/useAuditManager';
import EnhancedApuntesCard from '@/components/EnhancedApuntesCard';
import ApuntesHeader from '@/components/ApuntesHeader';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import apuntesDataFile from './data/apuntes.json';

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

// 🍎 iPadOS Widget Component
const BentoStat = ({ icon: Icon, label, value, sublabel, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[32px] p-6 hover:bg-white/70 dark:hover:bg-[#2c2c2e]/70 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 group"
  >
    <div className="absolute top-4 right-4 p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 opacity-60 group-hover:opacity-100 transition-opacity">
      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-[#1d1d1f] dark:text-white tabular-nums tracking-tight">
        {value}
      </h3>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">
        {label}
      </p>
      {sublabel && (
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 font-medium flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} /> {sublabel}
        </p>
      )}
    </div>
  </motion.div>
);

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
      active 
        ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] shadow-lg' 
        : 'bg-white/60 dark:bg-[#2c2c2e]/60 backdrop-blur-md border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-[#3a3a3c]/80'
    }`}
  >
    {label}
  </button>
);

// --- PÁGINA PRINCIPAL ---

const ApuntesIndex: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [auditFilter, setAuditFilter] = useState<'Todas' | 'Pendientes' | 'Auditadas'>('Todas');
  const navigate = useNavigate();
  const { progress } = useGamification();
  const { isCurator } = useAuth();
  const { isAudited, getAuditCount } = useAuditManager();

  // Validación de seguridad para el progreso
  const safeProgress = progress || {
    notesRead: 0,
    readNotes: new Set<string>(),
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    dailyNotesRead: {}
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
      excerpt: apunte.excerpt || apunte.content?.substring(0, 150) || 'Sin contenido',
      category: apunte.category || 'general',
      difficulty: (apunte.difficulty || 'básico') as 'básico' | 'intermedio' | 'avanzado',
      estimatedTime: apunte.estimatedTime || `${apunte.readTime || 5} min`,
      slug: apunte.slug || apunte.id,
      date: apunte.lastModified || apunte.date || new Date().toISOString(),
      author: apunte.author || 'Punto Legal',
      tags: apunte.tags || apunte.concepts || [],
      related: apunte.related || [],
      links: apunte.links || []
    }));
    return processed;
  }, []);

  // Filtrado
  const filteredApuntes = useMemo(() => {
    return processedApuntes.filter((note: any) => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (note.excerpt && note.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todos' || note.category === selectedCategory;
      
      // Filtro de auditoría (solo para curators)
      let matchesAudit = true;
      if (isCurator && auditFilter !== 'Todas') {
        const noteIsAudited = isAudited(note.id);
        matchesAudit = auditFilter === 'Auditadas' ? noteIsAudited : !noteIsAudited;
      }
      
      return matchesSearch && matchesCategory && matchesAudit;
    });
  }, [searchQuery, selectedCategory, processedApuntes, isCurator, auditFilter, isAudited]);
  
  // Contadores para Amanda
  const auditStats = useMemo(() => {
    if (!isCurator) return { total: 0, audited: 0, pending: 0 };
    const total = processedApuntes.length;
    const audited = processedApuntes.filter((n: any) => isAudited(n.id)).length;
    const pending = total - audited;
    return { total, audited, pending };
  }, [processedApuntes, isCurator, isAudited]);

  // Categorías únicas
  const categories = ['Todos', ...new Set(processedApuntes.map((n: any) => n.category).filter(Boolean))];

  // Calcular precisión de quiz (simulado por ahora)
  const quizAccuracy = useMemo(() => {
    const totalQuizzes = safeProgress.readNotes?.size || 0;
    if (totalQuizzes === 0) return '92%';
    return '92%';
  }, [safeProgress]);

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Fondo Vivo */}
      <AmbientBackground />
      
      {/* Header Sticky */}
      <ApuntesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode="grid"
      />

      {/* Contenido Principal con Márgenes Amplios */}
      <div className="pt-16 sm:pt-20 md:pt-22 pb-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <div className="text-7xl md:text-8xl">🎓</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs uppercase tracking-[0.5em] text-slate-500 dark:text-slate-400 font-semibold">Punto Legal · Colección Magistral</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1d1d1f] dark:text-white mb-4 tracking-tight">
                Sistema de Apuntes
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {isCurator 
                  ? `Panel de Auditoría. ${auditStats.pending} notas pendientes de revisión.`
                  : `Gestiona tu conocimiento legal. ${safeProgress.totalPoints > 0 ? 'Tu progreso es excelente.' : 'Comienza tu sesión de estudio hoy.'}`
                }
              </p>
            </div>
            </div>
          </div>
          
        {/* Bento Grid de Estadísticas (4 Widgets Cuadrados) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <BentoStat 
            icon={Flame} 
            label="Racha Actual" 
            value={`${safeProgress.currentStreak || 0} días`} 
            delay={0.1}
          />
          <BentoStat 
            icon={Trophy} 
            label="Puntos Totales" 
            value={safeProgress.totalPoints || 0} 
            sublabel="Nivel Asociado Jr."
            delay={0.2}
          />
          <BentoStat 
            icon={BookOpen} 
            label={isCurator ? "Notas Auditadas" : "Notas Leídas"} 
            value={isCurator ? auditStats.audited : (safeProgress.readNotes?.size || 0)} 
            delay={0.3}
          />
          {isCurator ? (
            <BentoStat 
              icon={Target} 
              label="Pendientes" 
              value={auditStats.pending} 
              sublabel={`de ${auditStats.total} total`}
              delay={0.4}
            />
          ) : (
            <BentoStat 
              icon={Target} 
              label="Precisión Quiz" 
              value={quizAccuracy} 
              sublabel="+4% vs semana pasada"
              delay={0.4}
            />
          )}
        </div>

        {/* Barra de Búsqueda Flotante (Rounded-Full) */}
        <div className="sticky top-24 z-30 mb-10">
          <div className="bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-full px-6 py-4 shadow-xl shadow-black/10 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Buscador */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" strokeWidth={1.5} />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-[#1c1c1e]/50 border-none rounded-full text-sm text-[#1d1d1f] dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 transition-all backdrop-blur-sm"
                placeholder="Buscar por concepto, ley o materia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

            {/* Filtros */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar px-2">
              <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" strokeWidth={1.5} />
              
              {/* Filtro de Auditoría (solo para curators) */}
              {isCurator && (
                <>
                  {(['Todas', 'Pendientes', 'Auditadas'] as const).map((filter) => (
                    <FilterChip 
                      key={filter} 
                      label={filter} 
                      active={auditFilter === filter} 
                      onClick={() => setAuditFilter(filter)} 
                    />
                  ))}
                  <div className="w-px h-6 bg-white/20 dark:bg-white/5 mx-1" />
                </>
              )}
              
              {/* Filtros de Categoría */}
              {categories.map((cat: any) => (
                <FilterChip 
                  key={cat} 
                  label={cat} 
                  active={selectedCategory === cat} 
                  onClick={() => setSelectedCategory(cat)} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Contenido */}
        {filteredApuntes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApuntes.map((apunte: any) => (
              <EnhancedApuntesCard
                key={apunte.id}
                apunte={apunte}
                viewMode="grid"
                isAudited={isAudited(apunte.id)}
                showAuditStatus={isCurator}
              />
            ))}
          </div>
        ) : (
          /* Estado Vacío Elegante */
          <div className="text-center py-32 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[32px] shadow-xl">
            <div className="inline-flex items-center justify-center p-4 bg-white/60 dark:bg-[#1c1c1e]/60 rounded-full mb-4 backdrop-blur-sm">
              <Library className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">
              No se encontraron resultados
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Intenta ajustar tu búsqueda o los filtros.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('Todos'); setAuditFilter('Todas')}}
              className="mt-6 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApuntesIndex; 
