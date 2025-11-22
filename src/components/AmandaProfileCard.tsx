// RUTA: src/components/AmandaProfileCard.tsx
// 🍎 Perfil de Amanda - Estilo iOS/iPad Premium

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  ChevronRight,
  Building2,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuditManager } from '@/hooks/useAuditManager';

export const AmandaProfileCard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { progress } = useGamification();
  const { getAuditCount } = useAuditManager();
  
  const auditCount = getAuditCount();
  
  // Obtener iniciales del usuario
  const getInitials = () => {
    if (!user) return 'AG';
    if (user.name === 'Amanda G.') return 'AG';
    if (user.name === 'Benjamin') return 'BS';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
    >
      {/* Tarjeta estilo iOS Widget Premium */}
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/50 dark:border-white/15 shadow-2xl shadow-black/20">
        
        {/* Header compacto estilo iOS */}
        <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-white/30 dark:border-white/10">
          <div className="flex items-center gap-3">
            {/* Avatar pequeño estilo iOS */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-lg ring-2 ring-white/60 dark:ring-white/20">
                {getInitials()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-400 border-2 border-white dark:border-[#1c1c1e] flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5 text-white" strokeWidth={3} fill="currentColor" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-sm sm:text-base font-bold text-[#1d1d1f] dark:text-white font-serif truncate">
                  {user.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={2} />
                <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
                  Auditora Legal
                </p>
              </div>
              {/* ID Badge compacto */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                <Building2 className="w-3 h-3 text-slate-500 dark:text-slate-400 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-600 dark:text-slate-400">{user.badgeId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas - Grid compacto estilo iOS */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 grid grid-cols-3 gap-2 sm:gap-3 border-b border-white/30 dark:border-white/10">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tabular-nums leading-none">
              {auditCount}
            </p>
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Auditorías
            </p>
          </div>
          <div className="text-center border-l border-white/30 dark:border-white/10">
            <p className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tabular-nums leading-none">
              {progress?.readNotes?.size || 0}
            </p>
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Lecturas
            </p>
          </div>
          <div className="text-center border-l border-white/30 dark:border-white/10">
            <p className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tabular-nums leading-none">
              {user.stats.accuracyRate}%
            </p>
            <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Precisión
            </p>
          </div>
        </div>

        {/* Acciones - Estilo iOS Premium */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 space-y-2">
          <button 
            onClick={() => {
              navigate('/apuntes/auditoria');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-emerald-500 dark:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.97] shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
          >
            <FileText className="w-4 h-4" strokeWidth={2} />
            <span>Mesa de Auditores</span>
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-xs sm:text-sm font-semibold transition-all active:scale-[0.97] shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
