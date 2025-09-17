export interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  shadowColor: string;
  requirement: {
    type: 'points' | 'notes_read' | 'streak' | 'categories' | 'time_studied';
    value: number;
    description: string;
  };
  historicalContext: {
    person?: string;
    period?: string;
    achievement?: string;
    quote?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points_reward: number;
}

export const HISTORICAL_LAW_MEDALS: Medal[] = [
  // Medallas Básicas - Primeros Pasos
  {
    id: 'first-note',
    name: 'Andrés Bello',
    description: 'Tu primer paso en el estudio del derecho',
    icon: '📜',
    color: 'from-amber-400 to-amber-600',
    gradient: 'bg-gradient-to-br from-amber-400 to-amber-600',
    shadowColor: 'shadow-amber-500/40',
    requirement: {
      type: 'notes_read',
      value: 1,
      description: 'Lee tu primera nota'
    },
    historicalContext: {
      person: 'Andrés Bello',
      period: '1781-1865',
      achievement: 'Padre del Código Civil chileno',
      quote: 'La ley es la expresión de la voluntad soberana'
    },
    rarity: 'common',
    points_reward: 50
  },
  {
    id: 'persistent-student',
    name: 'José Victorino Lastarria',
    description: 'Constancia en el estudio',
    icon: '⚖️',
    color: 'from-blue-400 to-blue-600',
    gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
    shadowColor: 'shadow-blue-500/40',
    requirement: {
      type: 'streak',
      value: 7,
      description: 'Estudia 7 días consecutivos'
    },
    historicalContext: {
      person: 'José Victorino Lastarria',
      period: '1817-1888',
      achievement: 'Fundador de la educación jurídica moderna en Chile',
      quote: 'La educación es la base de toda reforma social'
    },
    rarity: 'common',
    points_reward: 100
  },

  // Medallas Intermedias - Progreso Sólido
  {
    id: 'civil-law-master',
    name: 'Diego Portales',
    description: 'Maestro del derecho civil',
    icon: '🏛️',
    color: 'from-purple-400 to-purple-600',
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
    shadowColor: 'shadow-purple-500/40',
    requirement: {
      type: 'categories',
      value: 3,
      description: 'Estudia 3 categorías diferentes'
    },
    historicalContext: {
      person: 'Diego Portales',
      period: '1793-1837',
      achievement: 'Organizador del Estado chileno y sus instituciones',
      quote: 'La Constitución debe conformarse al carácter, historia y circunstancias del país'
    },
    rarity: 'rare',
    points_reward: 200
  },
  {
    id: 'constitutional-scholar',
    name: 'Mariano Egaña',
    description: 'Estudioso de la Constitución',
    icon: '📋',
    color: 'from-green-400 to-green-600',
    gradient: 'bg-gradient-to-br from-green-400 to-green-600',
    shadowColor: 'shadow-green-500/40',
    requirement: {
      type: 'notes_read',
      value: 50,
      description: 'Lee 50 notas de estudio'
    },
    historicalContext: {
      person: 'Mariano Egaña',
      period: '1793-1846',
      achievement: 'Redactor de la Constitución de 1833',
      quote: 'Una buena Constitución vale más que el mejor de los gobiernos'
    },
    rarity: 'rare',
    points_reward: 300
  },

  // Medallas Avanzadas - Expertise
  {
    id: 'supreme-court-justice',
    name: 'Manuel Montt',
    description: 'Sabiduría jurídica excepcional',
    icon: '👨‍⚖️',
    color: 'from-red-400 to-red-600',
    gradient: 'bg-gradient-to-br from-red-400 to-red-600',
    shadowColor: 'shadow-red-500/40',
    requirement: {
      type: 'points',
      value: 1000,
      description: 'Alcanza 1000 puntos de estudio'
    },
    historicalContext: {
      person: 'Manuel Montt',
      period: '1809-1880',
      achievement: 'Presidente y gran reformador del sistema judicial',
      quote: 'La justicia es la primera virtud de las instituciones sociales'
    },
    rarity: 'epic',
    points_reward: 500
  },
  {
    id: 'legal-reformer',
    name: 'Valentín Letelier',
    description: 'Reformador del derecho',
    icon: '⚡',
    color: 'from-indigo-400 to-indigo-600',
    gradient: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    shadowColor: 'shadow-indigo-500/40',
    requirement: {
      type: 'time_studied',
      value: 3600, // 1 hora en segundos
      description: 'Estudia durante 1 hora total'
    },
    historicalContext: {
      person: 'Valentín Letelier',
      period: '1852-1919',
      achievement: 'Reformador de la educación jurídica y el derecho administrativo',
      quote: 'El derecho debe evolucionar con la sociedad'
    },
    rarity: 'epic',
    points_reward: 400
  },

  // Medallas Legendarias - Maestría Total
  {
    id: 'founding-father',
    name: 'Bernardo O\'Higgins',
    description: 'Padre fundador del derecho patrio',
    icon: '🏆',
    color: 'from-yellow-400 to-yellow-600',
    gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    shadowColor: 'shadow-yellow-500/40',
    requirement: {
      type: 'notes_read',
      value: 200,
      description: 'Lee 200 notas de estudio'
    },
    historicalContext: {
      person: 'Bernardo O\'Higgins',
      period: '1778-1842',
      achievement: 'Libertador y primer Director Supremo de Chile',
      quote: 'La gloria de mandar consiste únicamente en el bien que se hace a los pueblos'
    },
    rarity: 'legendary',
    points_reward: 1000
  },
  {
    id: 'supreme-magistrate',
    name: 'Alejandro Silva Bascuñán',
    description: 'Magistrado supremo del conocimiento jurídico',
    icon: '👑',
    color: 'from-pink-400 to-pink-600',
    gradient: 'bg-gradient-to-br from-pink-400 to-pink-600',
    shadowColor: 'shadow-pink-500/40',
    requirement: {
      type: 'points',
      value: 5000,
      description: 'Alcanza 5000 puntos de estudio'
    },
    historicalContext: {
      person: 'Alejandro Silva Bascuñán',
      period: '1923-2013',
      achievement: 'Constitucionalista y académico de renombre internacional',
      quote: 'El derecho constitucional es el arte de organizar la convivencia política'
    },
    rarity: 'legendary',
    points_reward: 2000
  },

  // Medallas Especiales - Logros Únicos
  {
    id: 'night-owl',
    name: 'Arturo Alessandri Palma',
    description: 'Estudioso nocturno',
    icon: '🦉',
    color: 'from-slate-400 to-slate-600',
    gradient: 'bg-gradient-to-br from-slate-400 to-slate-600',
    shadowColor: 'shadow-slate-500/40',
    requirement: {
      type: 'notes_read',
      value: 10,
      description: 'Lee 10 notas después de las 10 PM'
    },
    historicalContext: {
      person: 'Arturo Alessandri Palma',
      period: '1868-1950',
      achievement: 'El León de Tarapacá, reformador social y constitucional',
      quote: 'El trabajo es la fuente de toda riqueza y de toda cultura'
    },
    rarity: 'rare',
    points_reward: 250
  },
  {
    id: 'speed-reader',
    name: 'Eduardo Frei Montalva',
    description: 'Lector veloz',
    icon: '💨',
    color: 'from-cyan-400 to-cyan-600',
    gradient: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
    shadowColor: 'shadow-cyan-500/40',
    requirement: {
      type: 'notes_read',
      value: 5,
      description: 'Lee 5 notas en una sesión'
    },
    historicalContext: {
      person: 'Eduardo Frei Montalva',
      period: '1911-1982',
      achievement: 'Presidente y promotor de reformas legales progresistas',
      quote: 'La democracia es un sistema de vida fundado en el constante mejoramiento económico, social y cultural del pueblo'
    },
    rarity: 'rare',
    points_reward: 150
  }
];

export const getMedalByRarity = (rarity: Medal['rarity']) => {
  return HISTORICAL_LAW_MEDALS.filter(medal => medal.rarity === rarity);
};

export const getMedalById = (id: string) => {
  return HISTORICAL_LAW_MEDALS.find(medal => medal.id === id);
};

export const checkMedalRequirement = (medal: Medal, userStats: any): boolean => {
  switch (medal.requirement.type) {
    case 'points':
      return userStats.totalPoints >= medal.requirement.value;
    case 'notes_read':
      return userStats.notesRead >= medal.requirement.value;
    case 'streak':
      return userStats.currentStreak >= medal.requirement.value;
    case 'categories':
      return userStats.categoriesStudied >= medal.requirement.value;
    case 'time_studied':
      return userStats.timeStudied >= medal.requirement.value;
    default:
      return false;
  }
}; 