import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Tipos para el sistema de gamificación
interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: number;
  category: string;
}

interface Progress {
  notesRead: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  categoriesCompleted: string[];
  medals: Medal[];
  readNotes: Set<string>; // Set de IDs de notas únicas leídas
  dailyNotesRead: { [date: string]: string[] }; // Notas leídas por día
}

interface GamificationContextType {
  progress: Progress;
  readNote: (noteId: string, category: string) => void;
  getMedals: () => Medal[];
  getProgressPercentage: () => number;
  getNextMilestone: () => { milestone: number; remaining: number };
  resetProgress: () => void;
  hasReadNote: (noteId: string) => boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Medallas disponibles
const AVAILABLE_MEDALS: Omit<Medal, 'unlockedAt'>[] = [
  {
    id: 'first-note',
    name: 'Primer Paso',
    description: 'Leíste tu primera nota',
    icon: '📚',
    color: 'bronze',
    category: 'general'
  },
  {
    id: 'three-notes',
    name: 'Estudiante Dedicado',
    description: 'Leíste 3 notas únicas',
    icon: '🥉',
    color: 'bronze',
    category: 'general'
  },
  {
    id: 'five-notes',
    name: 'Aprendiz Avanzado',
    description: 'Leíste 5 notas únicas',
    icon: '🥈',
    color: 'silver',
    category: 'general'
  },
  {
    id: 'ten-notes',
    name: 'Estudiante Experto',
    description: 'Leíste 10 notas únicas',
    icon: '🥇',
    color: 'gold',
    category: 'general'
  },
  {
    id: 'fifteen-notes',
    name: 'Maestro del Conocimiento',
    description: 'Leíste 15 notas únicas',
    icon: '👑',
    color: 'platinum',
    category: 'general'
  },
  {
    id: 'twenty-notes',
    name: 'Sabio Legal',
    description: 'Leíste 20 notas únicas',
    icon: '💎',
    color: 'diamond',
    category: 'general'
  },
  {
    id: 'civil-expert',
    name: 'Experto en Derecho Civil',
    description: 'Completaste 5 notas únicas de Derecho Civil',
    icon: '⚖️',
    color: 'blue',
    category: 'derecho-civil'
  },
  {
    id: 'procesal-expert',
    name: 'Experto en Derecho Procesal',
    description: 'Completaste 5 notas únicas de Derecho Procesal',
    icon: '🏛️',
    color: 'purple',
    category: 'derecho-procesal'
  },
  {
    id: 'streak-3',
    name: 'Consistente',
    description: '3 días consecutivos leyendo',
    icon: '🔥',
    color: 'orange',
    category: 'streak'
  },
  {
    id: 'streak-7',
    name: 'Dedicado',
    description: '7 días consecutivos leyendo',
    icon: '🔥🔥',
    color: 'red',
    category: 'streak'
  },
  {
    id: 'streak-14',
    name: 'Comprometido',
    description: '14 días consecutivos leyendo',
    icon: '🔥🔥🔥',
    color: 'purple',
    category: 'streak'
  },
  {
    id: 'speed-reader',
    name: 'Lector Veloz',
    description: 'Leíste 3 notas únicas en un día',
    icon: '⚡',
    color: 'yellow',
    category: 'speed'
  },
  {
    id: 'explorer',
    name: 'Explorador',
    description: 'Leíste notas de 3 categorías diferentes',
    icon: '🗺️',
    color: 'green',
    category: 'exploration'
  }
];

// Milestones para puntos (progresión más realista)
const MILESTONES = [50, 100, 200, 350, 500, 700, 1000, 1500, 2000, 3000];

const createEmptyProgress = (): Progress => ({
  notesRead: 0,
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: null,
  categoriesCompleted: [],
  medals: [],
  readNotes: new Set(),
  dailyNotesRead: {}
});

const hydrateProgress = (payload: any): Progress => ({
  notesRead: payload?.notesRead || 0,
  totalPoints: payload?.totalPoints || 0,
  currentStreak: payload?.currentStreak || 0,
  longestStreak: payload?.longestStreak || 0,
  lastReadDate: payload?.lastReadDate || null,
  categoriesCompleted: payload?.categoriesCompleted || [],
  medals: payload?.medals || [],
  readNotes: new Set(payload?.readNotes || []),
  dailyNotesRead: payload?.dailyNotesRead || {}
});

const loadProgress = (storageKey: string): Progress => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return hydrateProgress(parsed);
    }
  } catch (error) {
    console.warn('No se pudo cargar el progreso gamificado:', error);
  }
  return createEmptyProgress();
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `gamification-progress-${user.id}` : 'gamification-progress';
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window === 'undefined') {
      return createEmptyProgress();
    }
    return loadProgress(storageKey);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setProgress(loadProgress(storageKey));
  }, [storageKey]);

  // Guardar progreso en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const progressToSave = {
      ...progress,
      readNotes: Array.from(progress.readNotes)
    };
    localStorage.setItem(storageKey, JSON.stringify(progressToSave));
  }, [progress, storageKey]);

  // Verificar streak diario
  useEffect(() => {
    const checkDailyStreak = () => {
      const today = new Date().toDateString();
      if (progress.lastReadDate === today) {
        return; // Ya leyó hoy
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      if (progress.lastReadDate === yesterdayString) {
        // Continuar streak
        setProgress(prev => ({
          ...prev,
          currentStreak: prev.currentStreak + 1,
          longestStreak: Math.max(prev.currentStreak + 1, prev.longestStreak)
        }));
      } else if (progress.lastReadDate !== today) {
        // Romper streak
        setProgress(prev => ({
          ...prev,
          currentStreak: 0
        }));
      }
    };

    checkDailyStreak();
  }, [progress.lastReadDate]);

  // Función para leer una nota
  const readNote = (noteId: string, category: string) => {
    const today = new Date().toDateString();
    
    setProgress(prev => {
      // Verificar si ya leyó esta nota hoy
      const todayNotes = prev.dailyNotesRead[today] || [];
      if (todayNotes.includes(noteId)) {
        return prev; // Ya leyó esta nota hoy, no hacer nada
      }

      const newProgress = { ...prev };
      
      // Verificar si es una nota nueva (única)
      const isNewNote = !prev.readNotes.has(noteId);
      
      if (isNewNote) {
        // Incrementar notas únicas leídas
        newProgress.notesRead += 1;
        newProgress.readNotes.add(noteId);
        newProgress.totalPoints += 10; // Reducido de 25 a 10 puntos por nota única
      } else {
        // Nota ya leída antes, pero no hoy - puntos mínimos por relectura
        newProgress.totalPoints += 2; // Reducido de 5 a 2 puntos por relectura
      }

      // Actualizar fecha de última lectura y streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      if (prev.lastReadDate === yesterdayString) {
        // Continuar streak
        newProgress.currentStreak = prev.currentStreak + 1;
        newProgress.longestStreak = Math.max(prev.currentStreak + 1, prev.longestStreak);
      } else if (prev.lastReadDate !== today) {
        // Romper streak si no leyó ayer
        newProgress.currentStreak = 1;
        newProgress.longestStreak = Math.max(1, prev.longestStreak);
      }

      newProgress.lastReadDate = today;
      
      // Actualizar notas leídas hoy
      newProgress.dailyNotesRead = {
        ...prev.dailyNotesRead,
        [today]: [...todayNotes, noteId]
      };

      // Verificar medallas por cantidad de notas únicas (más conservador)
      const newMedals: Medal[] = [...prev.medals];
      
      // Medallas por cantidad total de notas únicas
      if (newProgress.notesRead === 1 && !prev.medals.find(m => m.id === 'first-note')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'first-note')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 20; // Reducido de 50 a 20 puntos bonus
      }
      
      if (newProgress.notesRead === 3 && !prev.medals.find(m => m.id === 'three-notes')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'three-notes')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 30; // Reducido de 100 a 30 puntos
      }
      
      if (newProgress.notesRead === 5 && !prev.medals.find(m => m.id === 'five-notes')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'five-notes')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 50; // Reducido de 150 a 50 puntos
      }
      
      if (newProgress.notesRead === 10 && !prev.medals.find(m => m.id === 'ten-notes')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'ten-notes')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 100; // Reducido de 300 a 100 puntos
      }
      
      if (newProgress.notesRead === 15 && !prev.medals.find(m => m.id === 'fifteen-notes')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'fifteen-notes')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 150; // Reducido de 500 a 150 puntos
      }
      
      if (newProgress.notesRead === 20 && !prev.medals.find(m => m.id === 'twenty-notes')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'twenty-notes')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 200; // Reducido de 1000 a 200 puntos
      }

      // Verificar medallas por categoría (contar notas únicas por categoría)
      const categoryNotes = Array.from(newProgress.readNotes).filter(id => {
        // Aquí necesitarías mapear el ID de la nota a su categoría
        // Por simplicidad, usamos la categoría actual
        return true; // Simplificado para demo
      }).length;

      if (category === 'derecho-civil' && categoryNotes >= 5 && !prev.medals.find(m => m.id === 'civil-expert')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'civil-expert')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 75; // Reducido de 200 a 75 puntos
      }
      
      if (category === 'derecho-procesal' && categoryNotes >= 5 && !prev.medals.find(m => m.id === 'procesal-expert')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'procesal-expert')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 75; // Reducido de 200 a 75 puntos
      }

      // Verificar medallas por streak (más difíciles de conseguir)
      if (newProgress.currentStreak === 3 && !prev.medals.find(m => m.id === 'streak-3')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'streak-3')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 50; // Reducido de 150 a 50 puntos
      }
      
      if (newProgress.currentStreak === 7 && !prev.medals.find(m => m.id === 'streak-7')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'streak-7')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 100; // Reducido de 300 a 100 puntos
      }
      
      if (newProgress.currentStreak === 14 && !prev.medals.find(m => m.id === 'streak-14')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'streak-14')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 200; // Reducido de 500 a 200 puntos
      }

      // Verificar medalla de lector veloz (3 notas únicas en un día)
      const todayUniqueNotes = new Set(newProgress.dailyNotesRead[today] || []);
      if (todayUniqueNotes.size >= 3 && !prev.medals.find(m => m.id === 'speed-reader')) {
        newMedals.push({
          ...AVAILABLE_MEDALS.find(m => m.id === 'speed-reader')!,
          unlockedAt: Date.now()
        });
        newProgress.totalPoints += 75; // Reducido de 200 a 75 puntos
      }

      newProgress.medals = newMedals;
      
      return newProgress;
    });
  };

  // Verificar si una nota ya fue leída
  const hasReadNote = (noteId: string) => {
    return progress.readNotes.has(noteId);
  };

  // Obtener medallas
  const getMedals = () => {
    return progress.medals;
  };

  // Obtener porcentaje de progreso (basado en puntos, no en notas)
  const getProgressPercentage = () => {
    const nextMilestone = MILESTONES.find(m => m > progress.totalPoints) || MILESTONES[MILESTONES.length - 1];
    const prevMilestone = MILESTONES[MILESTONES.findIndex(m => m > progress.totalPoints) - 1] || 0;
    const progressInLevel = progress.totalPoints - prevMilestone;
    const levelRange = nextMilestone - prevMilestone;
    return Math.min((progressInLevel / levelRange) * 100, 100);
  };

  // Obtener próximo milestone
  const getNextMilestone = () => {
    const nextMilestone = MILESTONES.find(m => m > progress.totalPoints) || MILESTONES[MILESTONES.length - 1];
    return {
      milestone: nextMilestone,
      remaining: nextMilestone - progress.totalPoints
    };
  };

  // Resetear progreso
  const resetProgress = () => {
    setProgress(createEmptyProgress());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <GamificationContext.Provider value={{
      progress,
      readNote,
      getMedals,
      getProgressPercentage,
      getNextMilestone,
      resetProgress,
      hasReadNote
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}; 
