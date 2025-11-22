import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  ArrowRight, 
  Bookmark, 
  BookOpen,
  GraduationCap,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Interfaces
interface ApunteData {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  estimatedTime: string;
  slug: string;
  date: string;
  author: string;
  tags: string[];
  related: string[];
  links?: string[];
}

interface EnhancedApuntesCardProps {
  apunte: ApunteData;
  viewMode: 'grid' | 'list';
  onConceptClick?: (concept: string) => void;
  isAudited?: boolean;
  showAuditStatus?: boolean;
}

// 🍎 iPadOS Design System - Widget Style
const WIDGET_GLASS = "bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-xl shadow-black/5";

const EnhancedApuntesCard: React.FC<EnhancedApuntesCardProps> = ({ 
  apunte, 
  viewMode, 
  isAudited = false,
  showAuditStatus = false
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  if (!apunte) return null;

  // Configuración de dificultad con iconos Lucide
  const difficultyConfig = {
    básico: {
      icon: BookOpen,
      label: 'Fundamentos',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    intermedio: {
      icon: BookOpen,
      label: 'Doctrina', 
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    },
    avanzado: {
      icon: GraduationCap,
      label: 'Análisis', 
      color: 'text-stone-700 dark:text-stone-300',
      bg: 'bg-stone-500/10 dark:bg-stone-500/20',
    }
  };

  const config = difficultyConfig[apunte.difficulty] || difficultyConfig.básico;
  const IconComponent = config.icon;

  const handleCardClick = () => navigate(`/apuntes/${apunte.slug}`);

  return (
    <motion.div
      className={`group relative ${WIDGET_GLASS} rounded-[32px] transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1`}
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6 relative">
        {/* Badge de Auditoría (Elegante y Pequeño) */}
        {showAuditStatus && (
          <div className={`absolute top-6 right-6 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isAudited 
              ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30' 
              : 'bg-stone-300/60 dark:bg-stone-600/60 text-stone-500 dark:text-stone-400'
          }`}>
            <CheckCircle className="w-4 h-4" strokeWidth={2} />
        </div>
      )}
      
        {/* Header: Icono de Dificultad */}
        <div className="mb-5">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${config.bg} mb-4`}>
            <IconComponent className={`w-6 h-6 ${config.color}`} strokeWidth={1.5} />
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.color}`}>
            {config.label}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xl font-serif font-semibold text-[#1d1d1f] dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {apunte.title.replace(/\[\[|\]\]/g, '')}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {apunte.excerpt || "Contenido esencial para el estudio de esta materia jurídica..."}
          </p>
      </div>

        {/* Footer: Metadatos */}
        <div className="flex items-center justify-between pt-5 border-t border-white/20 dark:border-white/5">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              {apunte.estimatedTime || '5 min'}
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="capitalize">{apunte.category}</span>
          </div>
          
          <motion.div 
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            animate={{ x: isHovered ? 0 : -4, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            Leer <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedApuntesCard; 
