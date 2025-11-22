import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Star, 
  Trophy, 
  Timer, 
  Zap,
  Target,
  Award,
  Sparkles,
  Flame,
  Crown,
  Gem,
  Shield,
  Heart,
  TrendingUp,
  Users,
  BookOpen,
  Lightbulb,
  Rocket,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/contexts/GamificationContext';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  points: number;
  category: string;
  penalty: number; // Puntos que se restan por fallar
  timeLimit: number; // Tiempo límite en segundos
  hint?: string; // Pista opcional
}

interface InteractiveQuizProps {
  noteId: string;
  category: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  onComplete?: (score: number, totalQuestions: number, pointsEarned: number) => void;
}

// 🎯 BANCO EXPANDIDO DE PREGUNTAS POR CATEGORÍA Y DIFICULTAD
const QUIZ_QUESTIONS: { [key: string]: { [key: string]: QuizQuestion[] } } = {
  'derecho-civil': {
    'básico': [
      {
        id: 'dc-b-1',
        question: '¿Qué es un acto jurídico?',
        options: [
          'Una manifestación de voluntad destinada a crear, modificar o extinguir derechos',
          'Un documento firmado ante notario',
          'Una decisión judicial',
          'Un contrato de compraventa'
        ],
        correctAnswer: 0,
        explanation: 'El acto jurídico es una manifestación de voluntad consciente que busca producir efectos jurídicos: crear, modificar o extinguir derechos y obligaciones.',
        difficulty: 'básico',
        points: 15,
        penalty: 5,
        timeLimit: 30,
        category: 'derecho-civil',
        hint: 'Piensa en la definición fundamental del Código Civil'
      },
      {
        id: 'dc-b-2',
        question: '¿Cuáles son los elementos esenciales de todo contrato?',
        options: [
          'Precio y objeto',
          'Consentimiento, objeto y causa',
          'Solo el consentimiento',
          'Notarización y registro'
        ],
        correctAnswer: 1,
        explanation: 'Art. 1445 CC establece que para que una persona se obligue a otra es necesario: 1° Consentimiento de las partes, 2° Objeto lícito, 3° Causa lícita.',
        difficulty: 'básico',
        points: 15,
        penalty: 5,
        timeLimit: 30,
        category: 'derecho-civil'
      },
      {
        id: 'dc-b-3',
        question: '¿Qué es la capacidad jurídica?',
        options: [
          'La aptitud para ejercer derechos por sí mismo',
          'La aptitud para ser titular de derechos y obligaciones',
          'La capacidad de firmar contratos',
          'La mayoría de edad'
        ],
        correctAnswer: 1,
        explanation: 'La capacidad jurídica o de goce es la aptitud para ser titular de derechos y obligaciones. Se diferencia de la capacidad de ejercicio.',
        difficulty: 'básico',
        points: 12,
        penalty: 4,
        timeLimit: 25,
        category: 'derecho-civil'
      },
      {
        id: 'dc-b-4',
        question: '¿Qué vicio del consentimiento implica una falsa representación de la realidad?',
        options: [
          'La fuerza',
          'El dolo',
          'El error',
          'La lesión'
        ],
        correctAnswer: 2,
        explanation: 'El error es un vicio del consentimiento que consiste en una falsa representación de la realidad que induce a la persona a celebrar el acto.',
        difficulty: 'básico',
        points: 12,
        penalty: 4,
        timeLimit: 25,
        category: 'derecho-civil'
      },
      {
        id: 'dc-b-5',
        question: '¿A qué edad se adquiere la plena capacidad de ejercicio en Chile?',
        options: [
          'A los 16 años',
          'A los 21 años',
          'A los 18 años',
          'A los 25 años'
        ],
        correctAnswer: 2,
        explanation: 'En Chile, la mayoría de edad y por tanto la plena capacidad de ejercicio se adquiere a los 18 años cumplidos.',
        difficulty: 'básico',
        points: 10,
        penalty: 3,
        timeLimit: 20,
        category: 'derecho-civil'
      }
    ],
    'intermedio': [
      {
        id: 'dc-i-1',
        question: '¿Cuál es la principal diferencia entre nulidad absoluta y relativa?',
        options: [
          'La absoluta no se puede sanear, la relativa sí',
          'La absoluta protege el interés público, la relativa el particular',
          'La absoluta prescribe en 10 años, la relativa en 4',
          'Todas las anteriores son correctas'
        ],
        correctAnswer: 3,
        explanation: 'La nulidad absoluta protege el interés público, no se puede ratificar, prescribe en 10 años y puede alegarla cualquiera. La relativa protege intereses particulares, se puede sanear y prescribe en 4 años.',
        difficulty: 'intermedio',
        points: 25,
        penalty: 8,
        timeLimit: 45,
        category: 'derecho-civil'
      },
      {
        id: 'dc-i-2',
        question: '¿Qué diferencia hay entre condición suspensiva y resolutoria?',
        options: [
          'No hay diferencia sustancial',
          'La suspensiva posterga el nacimiento del derecho, la resolutoria lo extingue',
          'La suspensiva es para contratos, la resolutoria para testamentos',
          'La suspensiva es voluntaria, la resolutoria es legal'
        ],
        correctAnswer: 1,
        explanation: 'La condición suspensiva posterga el nacimiento del derecho hasta que se cumpla el hecho futuro e incierto. La resolutoria extingue el derecho una vez cumplida.',
        difficulty: 'intermedio',
        points: 25,
        penalty: 8,
        timeLimit: 40,
        category: 'derecho-civil',
        hint: 'Piensa en cuándo nace vs cuándo se extingue el derecho'
      },
      {
        id: 'dc-i-3',
        question: '¿Qué es la teoría de la imprevisión?',
        options: [
          'Una teoría sobre contratos imprevistos',
          'La posibilidad de modificar contratos por cambios extraordinarios',
          'Una forma de nulidad contractual',
          'Un tipo de responsabilidad civil'
        ],
        correctAnswer: 1,
        explanation: 'La teoría de la imprevisión permite revisar contratos cuando circunstancias extraordinarias e imprevisibles alteran gravemente el equilibrio contractual.',
        difficulty: 'intermedio',
        points: 20,
        penalty: 7,
        timeLimit: 35,
        category: 'derecho-civil'
      },
      {
        id: 'dc-i-4',
        question: '¿Qué es la subrogación real?',
        options: [
          'El reemplazo de una persona por otra',
          'El reemplazo de una cosa por otra en una relación jurídica',
          'Un tipo de novación',
          'Una forma de pago'
        ],
        correctAnswer: 1,
        explanation: 'La subrogación real es el reemplazo de una cosa por otra, manteniéndose la misma relación jurídica pero con objeto distinto.',
        difficulty: 'intermedio',
        points: 20,
        penalty: 7,
        timeLimit: 35,
        category: 'derecho-civil'
      }
    ],
    'avanzado': [
      {
        id: 'dc-a-1',
        question: '¿Cuáles son los presupuestos de la responsabilidad civil extracontractual?',
        options: [
          'Dolo, culpa y daño',
          'Acción u omisión, culpa o dolo, daño y relación causal',
          'Solo el daño y la culpa',
          'Acción, dolo y patrimonio'
        ],
        correctAnswer: 1,
        explanation: 'Los presupuestos son: 1) Acción u omisión voluntaria, 2) Culpa o dolo (factor de atribución), 3) Daño, 4) Relación de causalidad entre la acción y el daño.',
        difficulty: 'avanzado',
        points: 40,
        penalty: 15,
        timeLimit: 60,
        category: 'derecho-civil'
      },
      {
        id: 'dc-a-2',
        question: '¿Qué es la acción pauliana y cuáles son sus requisitos?',
        options: [
          'Una acción para cobrar deudas',
          'Acción revocatoria para impugnar actos del deudor en fraude de acreedores',
          'Una acción posesoria',
          'Una acción de nulidad'
        ],
        correctAnswer: 1,
        explanation: 'La acción pauliana o revocatoria permite a los acreedores impugnar actos realizados por el deudor en su perjuicio. Requiere: crédito anterior, acto perjudicial y mala fe.',
        difficulty: 'avanzado',
        points: 35,
        penalty: 12,
        timeLimit: 50,
        category: 'derecho-civil',
        hint: 'También se llama acción revocatoria'
      },
      {
        id: 'dc-a-3',
        question: '¿Cuál es la diferencia entre patrimonio y universalidad jurídica?',
        options: [
          'No hay diferencia',
          'El patrimonio incluye solo bienes, la universalidad incluye bienes y deudas',
          'El patrimonio es el conjunto de bienes, derechos y obligaciones, la universalidad es un concepto más amplio',
          'La universalidad es solo para personas jurídicas'
        ],
        correctAnswer: 2,
        explanation: 'El patrimonio es el conjunto de bienes, derechos y obligaciones de una persona. La universalidad jurídica es un concepto más amplio que incluye cualquier conjunto de elementos que forman una unidad.',
        difficulty: 'avanzado',
        points: 30,
        penalty: 10,
        timeLimit: 45,
        category: 'derecho-civil'
      }
    ]
  },
  'derecho-laboral': {
    'básico': [
      {
        id: 'dl-b-1',
        question: '¿Cuál es la jornada ordinaria máxima en Chile?',
        options: [
          '40 horas semanales',
          '45 horas semanales',
          '48 horas semanales',
          '50 horas semanales'
        ],
        correctAnswer: 1,
        explanation: 'El Código del Trabajo establece que la jornada ordinaria de trabajo no puede exceder de 45 horas semanales.',
        difficulty: 'básico',
        points: 12,
        penalty: 4,
        timeLimit: 25,
        category: 'derecho-laboral'
      },
      {
        id: 'dl-b-2',
        question: '¿Qué es el finiquito laboral?',
        options: [
          'El último sueldo del trabajador',
          'Documento que acredita el término de la relación laboral y las prestaciones pagadas',
          'Una multa por despido',
          'El contrato de trabajo'
        ],
        correctAnswer: 1,
        explanation: 'El finiquito es el documento que acredita el término de la relación laboral y el pago de todas las prestaciones que correspondían al trabajador.',
        difficulty: 'básico',
        points: 15,
        penalty: 5,
        timeLimit: 30,
        category: 'derecho-laboral'
      }
    ],
    'intermedio': [
      {
        id: 'dl-i-1',
        question: '¿Cuándo procede la indemnización por años de servicio?',
        options: [
          'Solo en despidos injustificados',
          'En todos los despidos del empleador, salvo causales específicas',
          'Solo si el trabajador lo solicita',
          'Nunca, es opcional del empleador'
        ],
        correctAnswer: 1,
        explanation: 'La indemnización por años de servicio procede en todos los despidos de iniciativa del empleador, excepto en despidos por causal justificada del trabajador.',
        difficulty: 'intermedio',
        points: 25,
        penalty: 8,
        timeLimit: 40,
        category: 'derecho-laboral'
      }
    ],
    'avanzado': [
      {
        id: 'dl-a-1',
        question: '¿Qué es la tutela de derechos fundamentales del trabajador?',
        options: [
          'Un procedimiento especial para proteger derechos constitucionales en el trabajo',
          'Una indemnización especial',
          'Un tipo de contrato',
          'Una multa laboral'
        ],
        correctAnswer: 0,
        explanation: 'La tutela laboral es un procedimiento especial que protege los derechos fundamentales del trabajador cuando son vulnerados por el empleador.',
        difficulty: 'avanzado',
        points: 40,
        penalty: 15,
        timeLimit: 60,
        category: 'derecho-laboral'
      }
    ]
  }
};

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ 
  noteId, 
  category, 
  difficulty,
  onComplete 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalPenalty, setTotalPenalty] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [perfectAnswers, setPerfectAnswers] = useState(0);
  const [speedBonus, setSpeedBonus] = useState(0);
  
  const { readNote } = useGamification();
  
  // 🎯 Seleccionar preguntas según categoría y dificultad (memoizado)
  const questions = useMemo(() => {
    const categoryQuestions = QUIZ_QUESTIONS[category] || QUIZ_QUESTIONS['derecho-civil'];
    const difficultyQuestions = categoryQuestions[difficulty] || categoryQuestions['básico'];
    
    // Mezclar preguntas y tomar entre 3-5 según dificultad (reducido para mejor UX)
    const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5);
    const questionCount = difficulty === 'básico' ? 3 : difficulty === 'intermedio' ? 4 : 5;
    return shuffled.slice(0, Math.min(questionCount, shuffled.length));
  }, [category, difficulty]);

  // Timer para cada pregunta
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0 && !showAnswer) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showAnswer) {
      // Se acabó el tiempo - solo marcar como tiempo agotado, NO avanzar automáticamente
      setShowAnswer(true);
      setSelectedAnswer(-1);
      setIsActive(false); // Pausar el timer
      const question = questions[currentQuestion];
      if (question) {
        setTotalPenalty(prev => prev + question.penalty);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, showAnswer, currentQuestion, questions]);

  const startQuiz = () => {
    setIsActive(true);
    setCurrentQuestion(0);
    setTimeLeft(questions[0]?.timeLimit || 30);
    setScore(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setIsComplete(false);
    setCorrectStreak(0);
    setTotalPoints(0);
    setTotalPenalty(0);
    setShowHint(false);
    setHintsUsed(0);
    setPerfectAnswers(0);
    setSpeedBonus(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return; // No permitir seleccionar si ya se mostró la respuesta
    
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    setIsActive(false); // IMPORTANTE: Pausar el timer cuando se responde
    
    const question = questions[currentQuestion];
    const isCorrect = answerIndex === question.correctAnswer;
    
    if (isCorrect) {
      let earnedPoints = question.points;
      
      // 🚀 BONIFICACIONES POR RENDIMIENTO
      const timeBonus = timeLeft > question.timeLimit * 0.8 ? 15 : 
                       timeLeft > question.timeLimit * 0.6 ? 10 : 
                       timeLeft > question.timeLimit * 0.4 ? 5 : 0;
      const hintBonus = showHint ? 0 : 5;
      const streakBonus = correctStreak >= 2 ? correctStreak * 3 : 0;
      
      earnedPoints += timeBonus + hintBonus + streakBonus;
      
      setScore(prev => prev + 1);
      setCorrectStreak(prev => prev + 1);
      setTotalPoints(prev => prev + earnedPoints);
      setSpeedBonus(prev => prev + timeBonus);
      
      if (timeLeft > question.timeLimit * 0.9 && !showHint) {
        setPerfectAnswers(prev => prev + 1);
      }
      
      // Registrar progreso en gamificación
      readNote(`quiz-${noteId}-${question.id}`, category);
    } else {
      // 💥 PENALIZACIONES POR ERROR
      setCorrectStreak(0);
      setTotalPenalty(prev => prev + question.penalty);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setShowHint(false);
      setTimeLeft(questions[nextQuestionIndex]?.timeLimit || 30);
      setIsActive(true); // Reactivar el timer para la siguiente pregunta
    } else {
      setIsComplete(true);
      setIsActive(false); // Pausar definitivamente el timer
      const finalScore = Math.max(0, totalPoints - totalPenalty);
      onComplete?.(score, questions.length, finalScore);
    }
  };

  const useHint = () => {
    if (!showHint && questions[currentQuestion]?.hint) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
  };

  // 🎨 Configuración visual por dificultad - Paleta iPadOS Legal
  const getDifficultyConfig = (diff: string) => {
    switch(diff) {
      case 'básico': 
        return { 
          color: 'bg-stone-600', 
          icon: Lightbulb, 
          emoji: '🌱',
          bg: 'bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl',
          border: 'border-white/20 dark:border-white/5'
        };
      case 'intermedio': 
        return { 
          color: 'bg-indigo-500', 
          icon: Zap, 
          emoji: '⚡',
          bg: 'bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl',
          border: 'border-white/20 dark:border-white/5'
        };
      case 'avanzado': 
        return { 
          color: 'bg-stone-700', 
          icon: Crown, 
          emoji: '👑',
          bg: 'bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl',
          border: 'border-white/20 dark:border-white/5'
        };
      default: 
        return { 
          color: 'bg-stone-600', 
          icon: BookOpen, 
          emoji: '📚',
          bg: 'bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl',
          border: 'border-white/20 dark:border-white/5'
        };
    }
  };

  const config = getDifficultyConfig(difficulty);
  const IconComponent = config.icon;

  const getStreakEmoji = (streak: number) => {
    if (streak >= 5) return '🔥🔥🔥';
    if (streak >= 3) return '🔥🔥';
    if (streak >= 2) return '🔥';
    return '🎯';
  };

  // 🚀 Pantalla inicial mejorada
  if (!isActive && !isComplete && currentQuestion === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${config.bg} rounded-[32px] p-8 border ${config.border} shadow-xl shadow-black/5`}
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`w-20 h-20 mx-auto ${config.color} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            <IconComponent className="w-10 h-10 text-white" strokeWidth={1.5} />
          </motion.div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl">{config.emoji}</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                ¡Quiz {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}!
              </h3>
            </div>
            <p className="text-xl font-bold text-slate-700 dark:text-slate-200">
              Demuestra tu dominio en {category.replace('-', ' ')}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {questions.length} preguntas • Sistema de puntos dinámico • Bonificaciones por velocidad
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/30">
              <Timer className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{questions[0]?.timeLimit || 30}s</p>
              <p className="text-sm text-slate-600/70 dark:text-slate-400/70">por pregunta</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/30">
              <Star className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Hasta {Math.max(...questions.map(q => q.points + 20))}pts</p>
              <p className="text-sm text-slate-600/70 dark:text-slate-400/70">por respuesta</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/30">
              <Rocket className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Bonus</p>
              <p className="text-sm text-slate-600/70 dark:text-slate-400/70">por velocidad</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/30">
              <XCircle className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">-{Math.max(...questions.map(q => q.penalty))}pts</p>
              <p className="text-sm text-slate-600/70 dark:text-slate-400/70">por error</p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={startQuiz}
              className={`w-full ${config.color} hover:opacity-90 text-white font-bold py-4 text-xl rounded-full transition-all duration-300 relative overflow-hidden shadow-lg`}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative flex items-center justify-center">
                <Zap className="w-6 h-6 mr-3" />
                ¡Comenzar Quiz {difficulty}!
                <Sparkles className="w-6 h-6 ml-3" />
              </div>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // 🏆 Pantalla de resultados mejorada
  if (isComplete) {
    const percentage = (score / questions.length) * 100;
    const finalScore = Math.max(0, totalPoints - totalPenalty);
    const isPerfect = score === questions.length;
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;
    
    let resultMessage = '';
    let resultIcon = null;
    let resultColor = '';
    
    if (isPerfect) {
      resultMessage = '¡PERFECTO! 🏆 ¡Eres un maestro del derecho!';
      resultIcon = <Crown className="w-12 h-12 text-slate-600 dark:text-slate-400" />;
      resultColor = 'from-slate-600 to-slate-700';
    } else if (isExcellent) {
      resultMessage = '¡EXCELENTE! 🔥 Dominas muy bien la materia';
      resultIcon = <Trophy className="w-12 h-12 text-slate-600 dark:text-slate-400" />;
      resultColor = 'from-slate-600 to-slate-700';
    } else if (isGood) {
      resultMessage = '¡BIEN HECHO! ⚡ Estás en buen camino';
      resultIcon = <Award className="w-12 h-12 text-slate-600 dark:text-slate-400" />;
      resultColor = 'from-slate-500 to-slate-600';
    } else {
      resultMessage = '¡SIGUE PRACTICANDO! 💪 Cada intento te hace mejor';
      resultIcon = <Target className="w-12 h-12 text-slate-600 dark:text-slate-400" />;
      resultColor = 'from-slate-500 to-slate-600';
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${config.bg} rounded-[32px] p-8 border ${config.border} shadow-xl shadow-black/5`}
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`w-24 h-24 mx-auto bg-gradient-to-r ${resultColor} rounded-3xl flex items-center justify-center shadow-2xl`}
          >
            {resultIcon}
          </motion.div>

          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {resultMessage}
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Respondiste {score} de {questions.length} preguntas correctamente
            </p>
          </div>

          {/* 📊 Estadísticas detalladas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 text-center backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/30">
              <p className="text-3xl font-black text-slate-700 dark:text-slate-300">{percentage.toFixed(0)}%</p>
              <p className="text-sm font-medium text-slate-600/70 dark:text-slate-400/70">Precisión</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 text-center backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/30">
              <p className="text-3xl font-black text-slate-700 dark:text-slate-300">+{finalScore}</p>
              <p className="text-sm font-medium text-slate-600/70 dark:text-slate-400/70">Puntos netos</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 text-center backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/30">
              <p className="text-3xl font-black text-slate-700 dark:text-slate-300">{correctStreak}</p>
              <p className="text-sm font-medium text-slate-600/70 dark:text-slate-400/70">Mejor racha</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 text-center backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/30">
              <p className="text-3xl font-black text-slate-700 dark:text-slate-300">{speedBonus}</p>
              <p className="text-sm font-medium text-slate-600/70 dark:text-slate-400/70">Bonus velocidad</p>
            </div>
          </div>

          {/* 🎖️ Logros especiales */}
          {(isPerfect || perfectAnswers > 0 || hintsUsed === 0) && (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">🏅 Logros Desbloqueados</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {isPerfect && (
                  <Badge className="bg-slate-700/90 dark:bg-slate-600/90 text-white px-4 py-2">
                    👑 Respuesta Perfecta
                  </Badge>
                )}
                {perfectAnswers > 0 && (
                  <Badge className="bg-slate-700/90 dark:bg-slate-600/90 text-white px-4 py-2">
                    ⚡ Velocista x{perfectAnswers}
                  </Badge>
                )}
                {hintsUsed === 0 && (
                  <Badge className="bg-slate-700/90 dark:bg-slate-600/90 text-white px-4 py-2">
                    🧠 Sin Ayuda
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1 py-3 text-lg font-bold"
            >
              🔄 Intentar de Nuevo
            </Button>
            <Button
              onClick={() => setIsComplete(false)}
              className={`flex-1 ${config.color} text-white py-3 text-lg font-bold rounded-full`}
            >
              🎯 Siguiente Quiz
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  if (!question) return null;
  
  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className={`bg-gradient-to-br ${config.bg} rounded-3xl p-8 border ${config.border} shadow-2xl`}
    >
      {/* 📊 Header con métricas avanzadas */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Badge className={`${config.color} text-white border-0 px-4 py-2 text-sm font-bold rounded-full`}>
            {config.emoji} {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {currentQuestion + 1} de {questions.length}
          </span>
          {correctStreak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 bg-[#1d1d1f] dark:bg-stone-700 text-white px-3 py-1 rounded-full shadow-lg"
            >
              <Flame className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm font-bold">
                {correctStreak} {getStreakEmoji(correctStreak)}
              </span>
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 💡 Botón de pista */}
          {question.hint && !showHint && !showAnswer && (
            <Button
              onClick={useHint}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Pista
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-slate-600 dark:text-slate-400' : timeLeft <= 20 ? 'text-slate-600 dark:text-slate-400' : 'text-slate-600 dark:text-slate-400'}`} />
            <span className={`font-black text-lg ${timeLeft <= 10 ? 'text-slate-700 dark:text-slate-300' : timeLeft <= 20 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-700 dark:text-slate-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* 📈 Barra de progreso avanzada */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <span>Progreso</span>
          <span>Puntos: +{totalPoints} / Penalizaciones: -{totalPenalty}</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${config.color} shadow-lg rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 💡 Pista (si está activada) */}
      {showHint && question.hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl"
        >
          <div className="flex items-start space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">💡 Pista:</p>
              <p className="text-yellow-700 dark:text-yellow-300">{question.hint}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ❓ Pregunta */}
      <div className="mb-8">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
          {question.question}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="font-bold">+{question.points} pts</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="font-bold">-{question.penalty} pts por error</span>
          </div>
        </div>
      </div>

      {/* 🎯 Opciones de respuesta */}
      <div className="space-y-4 mb-8">
        {question.options.map((option, index) => {
          let buttonClass = "w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ";
          
          if (!showAnswer) {
            buttonClass += selectedAnswer === index 
              ? `border-slate-500/60 bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 shadow-lg shadow-slate-500/10`
              : "border-slate-200/50 dark:border-slate-700/40 hover:border-slate-300/50 dark:hover:border-slate-600/40 bg-white/80 dark:bg-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-700/60 hover:shadow-lg";
          } else {
            if (index === question.correctAnswer) {
              buttonClass += "border-slate-500/60 bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 shadow-lg shadow-slate-500/10";
            } else if (selectedAnswer === index) {
              buttonClass += "border-slate-500/60 bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 shadow-lg shadow-slate-500/10";
            } else {
              buttonClass += "border-slate-200/50 dark:border-slate-700/40 bg-slate-50/60 dark:bg-slate-800/60 opacity-60";
            }
          }

          return (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showAnswer}
              className={buttonClass}
              whileHover={{ scale: showAnswer ? 1 : 1.02 }}
              whileTap={{ scale: showAnswer ? 1 : 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                    !showAnswer ? 'border-slate-300 dark:border-slate-600' :
                    index === question.correctAnswer ? 'border-slate-600 bg-slate-600 text-white' :
                    selectedAnswer === index ? 'border-slate-600 bg-slate-600 text-white' : 'border-slate-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium text-lg leading-relaxed">{option}</span>
                </div>
                {showAnswer && (
                  <div className="flex-shrink-0 ml-4">
                    {index === question.correctAnswer && (
                      <CheckCircle className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    )}
                    {selectedAnswer === index && index !== question.correctAnswer && (
                      <XCircle className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 📝 Explicación y siguiente */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`${config.bg} rounded-2xl p-6 border ${config.border}`}>
              <h4 className="font-black text-lg text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Explicación:
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{question.explanation}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {selectedAnswer === question.correctAnswer ? (
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <span className="font-black text-lg">¡CORRECTO!</span>
                      <p className="text-sm">
                        +{question.points} pts base + bonus por velocidad
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <XCircle className="w-6 h-6" />
                    <div>
                      <span className="font-black text-lg">
                        {selectedAnswer === -1 ? 'TIEMPO AGOTADO' : 'INCORRECTO'}
                      </span>
                      <p className="text-sm">-{question.penalty} pts de penalización</p>
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                onClick={nextQuestion}
                className={`${config.color} text-white font-bold px-8 py-3 text-lg rounded-full shadow-lg hover:opacity-90 transition-all duration-300`}
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Siguiente <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Finalizar <Trophy className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveQuiz; 