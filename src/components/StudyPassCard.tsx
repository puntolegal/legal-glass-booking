import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Trophy, Flame, Target, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';

export const StudyPassCard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { progress } = useGamification();

  if (!isAuthenticated || !user) return null;

  const today = new Date().toDateString();
  const todaysReads = progress?.dailyNotesRead?.[today]?.length || 0;
  const dailyGoal = 3;
  const goalProgress = Math.min((todaysReads / dailyGoal) * 100, 100);
  const currentLevel = Math.max(1, Math.floor((progress?.totalPoints || 0) / 100) + 1);
  const nextLevelPoints = currentLevel * 100;
  const levelProgress = ((progress?.totalPoints || 0) % 100) / 100;

  // Determinar medalla activa
  const activeMedal = progress?.medals?.[progress.medals.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Tarjeta holográfica con efecto de brillo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-indigo-50/80 to-cyan-50/70 dark:from-[#0B1121]/90 dark:via-indigo-950/80 dark:to-cyan-950/70 backdrop-blur-2xl border-2 border-white/50 dark:border-white/20 shadow-[0_35px_85px_-45px_rgba(15,23,42,0.75),inset_0_1px_0_0_rgba(255,255,255,0.4)] dark:shadow-[0_45px_95px_-50px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.1)]">
        {/* Efectos de brillo animados */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-cyan-400/10 to-emerald-400/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.2),transparent_70%)] pointer-events-none animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <div className="relative p-6 space-y-6">
          {/* Header con nombre y nivel */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-indigo-600 dark:text-indigo-300 font-semibold">
                Study Pass
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {user.name}
              </h3>
            </div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_8px_32px_-8px_rgba(99,102,241,0.5)]">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{currentLevel}</span>
              </div>
            </div>
          </div>

          {/* Medalla activa */}
          {activeMedal && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/50 dark:border-amber-800/50">
              <div className="text-2xl">{activeMedal.icon}</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                  Medalla activa
                </p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {activeMedal.name}
                </p>
              </div>
            </div>
          )}

          {/* Progreso del nivel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Nivel {currentLevel}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {progress?.totalPoints || 0} / {nextLevelPoints} pts
              </span>
            </div>
            <div className="relative h-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              />
            </div>
          </div>

          {/* Meta diaria */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400 font-medium">Meta diaria</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {todaysReads} / {dailyGoal}
              </span>
            </div>
            <div className="relative h-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              />
            </div>
            {goalProgress >= 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                ¡Meta diaria completada!
              </motion.div>
            )}
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/20 dark:border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {progress?.medals?.length || 0}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Medallas
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {progress?.currentStreak || 0}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Racha
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {progress?.readNotes?.size || 0}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Notas
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

