import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowRight, ChevronLeft, Target, Users, Clock, DollarSign, Sparkles, Gift, Heart, Shield, Star, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Testimonios específicos por plan
const testimonialsByPlan = {
  Integral: {
    quote: "Logramos un divorcio de mutuo acuerdo sin complicaciones. Su enfoque humano hizo la diferencia en un momento difícil.",
    author: "Carlos Mendoza",
    role: "Padre Divorciado",
    rating: 5
  },
  Premium: {
    quote: "Me ayudaron a obtener la pensión de alimentos que mi hijo necesitaba. El proceso fue rápido y siempre me mantuvieron informada.",
    author: "María José Herrera",
    role: "Madre de Familia",
    rating: 5
  },
  Elite: {
    quote: "Obtuve la custodia de mi nieta gracias a su excelente trabajo. Son especialistas reales en derecho de familia.",
    author: "Patricia Silva",
    role: "Abuela Cuidadora",
    rating: 5
  }
};

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const questions = [
    {
      id: 0,
      question: '¿Cuál es tu situación actual?',
      options: [
        { value: 'mutual', label: 'Necesitamos llegar a un acuerdo mutuo', icon: Users },
        { value: 'conflict', label: 'Hay desacuerdo en temas importantes', icon: Target },
        { value: 'complex', label: 'Mi caso tiene elementos internacionales o empresas', icon: DollarSign },
      ]
    },
    {
      id: 1,
      question: '¿Qué aspecto te preocupa más?',
      options: [
        { value: 'time', label: 'Resolver esto lo más rápido posible', icon: Clock },
        { value: 'protection', label: 'Proteger mis derechos y patrimonio', icon: Target },
        { value: 'children', label: 'El bienestar de los hijos', icon: Users },
      ]
    },
    {
      id: 2,
      question: '¿Cuál es tu presupuesto aproximado?',
      options: [
        { value: 'budget', label: 'Busco la opción más económica efectiva', icon: DollarSign },
        { value: 'value', label: 'Prefiero invertir en un servicio completo', icon: Sparkles },
        { value: 'premium', label: 'Necesito el mejor servicio sin importar el costo', icon: Gift },
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAnswer = (value: string) => {
    const stepKey = currentStep.toString();
    const newAnswers = { ...answers, [stepKey]: value };
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 200);
    } else {
      setTimeout(() => {
        const result = getRecommendation(newAnswers);
        setRecommendation(result);
        setCurrentStep(5);
      }, 200);
    }
  };

  const getRecommendation = (answersMap: Record<string, string> = answers) => {
    const situation = answersMap['0'];
    const concern = answersMap['1'];
    const budget = answersMap['2'];

    if (situation === 'complex' || budget === 'premium') {
      return {
        plan: 'Elite',
        title: 'Plan Blindaje Familiar Elite',
        reason: 'Tu situación requiere atención especializada y recursos premium para proteger tus intereses de manera integral.',
        discount: '15%',
        features: [
          'Abogado senior dedicado 24/7',
          'Manejo de casos internacionales',
          'Protección patrimonial completa',
          'Resolución en tiempo récord'
        ]
      };
    } else if (situation === 'conflict' || concern === 'protection') {
      return {
        plan: 'Premium',
        title: 'Plan Defensa Familiar Premium',
        reason: 'Necesitas un equipo legal robusto que defienda tus derechos con firmeza y experiencia.',
        discount: '10%',
        features: [
          'Equipo legal completo',
          'Audiencias ilimitadas',
          'Protección VIF incluida',
          'Apoyo psicológico extendido'
        ]
      };
    } else {
      return {
        plan: 'Integral',
        title: 'Plan Protección Familiar Integral',
        reason: 'Tu caso puede resolverse eficientemente con nuestro servicio integral, ahorrando tiempo y dinero.',
        discount: '5%',
        features: [
          'Proceso de común acuerdo',
          'Mediación profesional',
          'Resolución en 15-30 días',
          'Upgrade gratis si cambia la situación'
        ]
      };
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    const showRecommendationInstantly = () => {
      setShowResult(true);
      setCurrentStep(6);
    };

    const persistLead = async () => {
      const quizData = {
        name: 'Quiz Inline Lead',
        email: email,
        quiz_answers: JSON.stringify(answers),
        plan_recommended: recommendation?.plan || 'Integral',
        status: 'nuevo'
      };

      const { error } = await supabase
        .from('leads_quiz')
        .insert([quizData]);

      if (error) throw error;
    };

    showRecommendationInstantly();
    setIsLoading(true);

    try {
      await persistLead();
      toast.success('Te enviamos el plan recomendado a tu email.');
    } catch (error) {
      console.error('Error guardando lead:', error);
      const pendingLeadsRaw = localStorage.getItem('pendingQuizLeads');
      const pendingLeads = pendingLeadsRaw ? JSON.parse(pendingLeadsRaw) : [];
      pendingLeads.push({
        email,
        answers,
        recommendation,
        timestamp: Date.now()
      });
      localStorage.setItem('pendingQuizLeads', JSON.stringify(pendingLeads));
      toast.error('Guardamos tu resultado, pero no pudimos enviar el email. Te contactaremos pronto.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(-1);
    setAnswers({});
    setEmail('');
    setShowResult(false);
    setRecommendation(null);
    setIsLoading(false);
    setClickedButton(null);
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-2xl min-h-[600px] sm:min-h-[500px] max-h-[90vh] my-auto
                         bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 
                         shadow-2xl shadow-black/50
                         flex flex-col overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-slate-700/50 flex-shrink-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 
                           transition-colors duration-200 z-10 border border-slate-700/50"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5 text-slate-300" />
                </button>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="pr-8"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    ¿Qué nivel de protección legal necesitas realmente?
                  </h2>
                  <p className="text-slate-400">
                    Descúbrelo en 60 segundos con nuestro diagnóstico inteligente
                  </p>
                </motion.div>
              </div>

              {/* Progress bar */}
              {!showResult && currentStep >= 0 && currentStep < questions.length && (
                <div className="h-1 bg-slate-800 flex-shrink-0">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  {/* PASO CERO - Intro */}
                  {!showResult && currentStep === -1 && (
                    <motion.div
                      key="step-zero"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center text-center py-8"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full 
                                 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20"
                      >
                        <Heart className="w-12 h-12 text-pink-400" />
                      </motion.div>

                      <h3 className="text-3xl font-bold text-white mb-4 max-w-lg">
                        Sabemos que este es un momento difícil
                      </h3>
                      <p className="text-xl text-slate-300 mb-8 max-w-md leading-relaxed">
                        Estamos aquí para darte <span className="text-pink-400 font-semibold">claridad</span> y 
                        <span className="text-pink-400 font-semibold"> tranquilidad</span>.
                      </p>

                      <div className="grid gap-3 mb-8 text-left max-w-md">
                        {[
                          "60 segundos para saber qué camino tomar",
                          "Recomendación personalizada sin compromiso",
                          "Descuento exclusivo aplicado automáticamente"
                        ].map((benefit, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-slate-300">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.button
                        onClick={() => setCurrentStep(0)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full max-w-md py-5 px-8 rounded-xl font-bold text-lg text-white 
                                 bg-gradient-to-r from-pink-500 to-rose-600 
                                 hover:from-pink-600 hover:to-rose-700 
                                 shadow-2xl shadow-pink-500/40 transition-all duration-200
                                 flex items-center justify-center gap-3"
                      >
                        Comenzar mi diagnóstico
                        <ArrowRight className="w-6 h-6" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Preguntas */}
                  {!showResult && currentStep >= 0 && currentStep < questions.length && (
                    <motion.div
                      key={`question-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-6">
                        {questions[currentStep].question}
                      </h3>
                      
                      <div className="grid gap-3">
                        {questions[currentStep].options.map((option, index) => {
                          const Icon = option.icon;
                          return (
                            <motion.button
                              key={option.value}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => {
                                setClickedButton(option.value);
                                setTimeout(() => {
                                  handleAnswer(option.value);
                                  setClickedButton(null);
                                }, 200);
                              }}
                              whileHover={{ scale: 1.02, x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-4 rounded-2xl bg-slate-800/50 border transition-all duration-200 
                                       text-left flex items-center gap-4 group relative overflow-hidden
                                       ${clickedButton === option.value 
                                         ? 'border-pink-500 shadow-lg shadow-pink-500/30' 
                                         : 'border-slate-700/50 hover:bg-slate-700/50 hover:border-pink-500/30'
                                       }`}
                            >
                              {clickedButton === option.value && (
                                <motion.div
                                  initial={{ x: '-100%' }}
                                  animate={{ x: '200%' }}
                                  transition={{ duration: 0.5 }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
                                />
                              )}
                              
                              <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 
                                            group-hover:from-pink-500/30 group-hover:to-rose-500/30 transition-colors relative">
                                <Icon className="w-6 h-6 text-pink-400" />
                              </div>
                              <span className="text-white font-medium relative">{option.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                      
                      {currentStep > 0 && (
                        <button
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="mt-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Volver
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Paso de email */}
                  {!showResult && currentStep === 5 && (
                    <motion.div
                      key="email-step"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          ¡Último paso! ¿A qué correo enviamos tu estrategia?
                        </h3>
                      </div>

                      <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className="relative">
                          <div className="w-full p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3 transition-all focus-within:border-pink-500 focus-within:bg-slate-700/60">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="flex-1 bg-transparent text-white placeholder-white/40 text-lg focus:outline-none"
                              placeholder="Escribe tu correo aquí"
                              required
                            />
                            <motion.button
                              type="submit"
                              whileHover={!isLoading ? { scale: 1.05 } : {}}
                              whileTap={!isLoading ? { scale: 0.96 } : {}}
                              disabled={isLoading}
                              className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/30"
                            >
                              {isLoading ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                              ) : (
                                <ArrowRight className="w-5 h-5 text-white" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Resultado */}
                  {showResult && recommendation && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full 
                                      flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30">
                          <Gift className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Tu Plan Recomendado
                        </h3>
                      </div>
                      
                      <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 
                                    rounded-2xl p-6 mb-6">
                        <h4 className="text-xl font-bold text-white mb-2">
                          {recommendation.title}
                        </h4>
                        <p className="text-slate-300 mb-6">
                          {recommendation.reason}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            const planSlug = `familia-${recommendation.plan.toLowerCase()}`;
                            navigate(`/agendamiento?plan=${planSlug}`);
                          }}
                          className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r 
                                   from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 
                                   transition-all duration-200 text-center shadow-lg shadow-pink-500/30"
                        >
                          Agendar Mi Consulta con Descuento
                        </button>
                        
                        <button
                          onClick={resetQuiz}
                          className="w-full py-3 px-6 rounded-xl font-medium text-white/70 hover:text-white 
                                   transition-colors"
                        >
                          Hacer el Quiz Nuevamente
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default React.memo(QuizModal);
