import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, ChevronLeft, Target, Users, Clock, DollarSign, Sparkles, Gift, Heart, Shield, Star, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Componente de contador animado
const AnimatedCounter: React.FC<{ value: string; delay?: number }> = ({ value, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState('$0');
  
  useEffect(() => {
    const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
    let start = 0;
    const duration = 800;
    const steps = 30;
    let interval: ReturnType<typeof setInterval> | null = null;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        start += numericValue / steps;
        if (start >= numericValue) {
          setDisplayValue(value);
          if (interval) {
            clearInterval(interval);
          }
        } else {
          const formatted = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(Math.round(start));
          setDisplayValue(formatted);
        }
      }, duration / steps);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [value, delay]);

  return <span>{displayValue}</span>;
};

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
  const [currentStep, setCurrentStep] = useState(-1); // Empezamos en -1 para el "Paso Cero"
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  
  // Estados para el calculador
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
  const [selectedIncomeLabel, setSelectedIncomeLabel] = useState<string | null>(null);
  const [numberOfChildren, setNumberOfChildren] = useState<number | null>(null);
  const [selectedChildrenLabel, setSelectedChildrenLabel] = useState<string | null>(null);
  const [calculatedRange, setCalculatedRange] = useState<{ min: string; max: string } | null>(null);
  
  // Debounce para guardar email inmediatamente
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailValid(isValid);
    
    if (isValid && !emailSaved) {
      const timeoutId = setTimeout(async () => {
        try {
          const quizData = {
            name: 'Quiz Inline Lead',
            email: email,
            quiz_answers: JSON.stringify({}),
            plan_recommended: null,
            status: 'iniciado'
          };
          
          const { error } = await supabase
            .from('leads_quiz')
            .insert([quizData]);
          
          if (!error) {
            setEmailSaved(true);
            console.log('✅ Email guardado inmediatamente:', email);
          }
        } catch (error) {
          console.error('Error guardando email:', error);
        }
      }, 1000); // Debounce de 1 segundo
      
      return () => clearTimeout(timeoutId);
    }
  }, [email, emailSaved]);

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

  const incomeOptions = [
    { label: 'Menos de $800.000', value: 600000 },
    { label: '$800.000 - $1.5M', value: 1150000 },
    { label: '$1.5M - $3M', value: 2250000 },
    { label: 'Más de $3M', value: 4000000 }
  ];

  const childrenOptions = [
    { label: '1 hijo', value: 1 },
    { label: '2 hijos', value: 2 },
    { label: '3 o más hijos', value: 3 }
  ];

  // Función para formatear moneda chilena
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Función para calcular rango de pensión
  const calculatePensionRange = (income: number | null, children: number | null) => {
    if (income === null || children === null) {
      return { min: '$0', max: '$0' };
    }
    const basePercentage = children === 1 ? 0.3 : 0.4;
    const min = Math.round(income * (basePercentage - 0.1));
    const max = Math.round(Math.min(income * 0.5, income * (basePercentage + 0.1)));
    return { min: formatCurrency(min), max: formatCurrency(max) };
  };

  // Determinar si mostrar el calculador
  const shouldShowCalculator = (answersMap: Record<string, string> = answers) => {
    return answersMap['0'] === 'conflict' || answersMap['1'] === 'protection' || answersMap['1'] === 'children';
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
          'Abogado dedicado 24/7',
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

  const handleAnswer = (questionId: number, value: string) => {
    const stepKey = questionId.toString();
    const newAnswers = { ...answers, [stepKey]: value };
    delete newAnswers.calculatorIncome;
    delete newAnswers.calculatorChildren;
    setAnswers(newAnswers);
    
    // Scroll suave a la siguiente pregunta si no es la última.
    // En desktop el scroll real ocurre en [data-quiz-content] (overflow-y-auto)
    // En móvil ocurre en [data-quiz-modal] (overflow-y-auto del fixed inset-0)
    if (questionId < questions.length - 1) {
      setTimeout(() => {
        const nextQuestionElement = document.getElementById(`question-${questionId + 1}`);
        if (!nextQuestionElement) return;

        const contentScroller = document.querySelector('[data-quiz-content]') as HTMLElement | null;
        const modalScroller = document.querySelector('[data-quiz-modal]') as HTMLElement | null;
        const scrollContainer =
          contentScroller && contentScroller.scrollHeight > contentScroller.clientHeight
            ? contentScroller
            : modalScroller;

        if (scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const elementRect = nextQuestionElement.getBoundingClientRect();
          const offset = 80;
          const targetScroll = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - offset;
          scrollContainer.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
        } else {
          nextQuestionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 350);
    }
  };
  
  // Verificar si todas las preguntas están respondidas
  const allQuestionsAnswered = useMemo(() => {
    return questions.every(q => answers[q.id.toString()] !== undefined);
  }, [answers]);
  
  // Función para mostrar recomendación
  const handleShowRecommendation = async () => {
    if (!emailValid || !allQuestionsAnswered) return;
    
    const shouldCalculate = shouldShowCalculator(answers);
    
    if (shouldCalculate) {
      setMonthlyIncome(null);
      setSelectedIncomeLabel(null);
      setNumberOfChildren(null);
      setSelectedChildrenLabel(null);
      setCalculatedRange(null);
      setCurrentStep(3); // Paso de ingresos
    } else {
      // Calcular recomendación primero
      const result = getRecommendation(answers);
      setRecommendation(result);
      // Luego guardar y mostrar resultado
      await handleFinalSubmit(result);
    }
  };
  
  const handleFinalSubmit = async (recommendationData: any = null) => {
    setIsLoading(true);
    try {
      const finalRecommendation = recommendationData ?? recommendation;
      
      // Actualizar el lead existente o crear uno nuevo
      const quizData = {
        name: 'Quiz Inline Lead',
        email: email,
        quiz_answers: JSON.stringify(answers),
        plan_recommended: finalRecommendation?.plan || 'Integral',
        income_range: selectedIncomeLabel,
        income_value: monthlyIncome,
        children_count: numberOfChildren,
        children_label: selectedChildrenLabel,
        calculated_min: calculatedRange?.min ?? null,
        calculated_max: calculatedRange?.max ?? null,
        status: 'completo'
      };
      
      // Intentar actualizar primero (si existe)
      const { data: existing } = await supabase
        .from('leads_quiz')
        .select('id')
        .eq('email', email)
        .eq('status', 'iniciado')
        .limit(1)
        .single();
      
      if (existing) {
        await supabase
          .from('leads_quiz')
          .update(quizData)
          .eq('id', existing.id);
      } else {
        await supabase
          .from('leads_quiz')
          .insert([quizData]);
      }
      
      setShowResult(true);
      // Scroll al inicio cuando se muestra el resultado (sirve para ambos contenedores)
      setTimeout(() => {
        const contentScroller = document.querySelector('[data-quiz-content]') as HTMLElement | null;
        const modalScroller = document.querySelector('[data-quiz-modal]') as HTMLElement | null;
        contentScroller?.scrollTo({ top: 0, behavior: 'smooth' });
        modalScroller?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
      setCurrentStep(6);
      toast.success('Te enviamos el plan recomendado a tu email.');
    } catch (error) {
      console.error('Error guardando lead completo:', error);
      toast.error('Guardamos tu resultado, pero no pudimos enviar el email. Te contactaremos pronto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncomeSelect = (value: number, label: string) => {
    setMonthlyIncome(value);
    setSelectedIncomeLabel(label);
    setNumberOfChildren(null);
    setSelectedChildrenLabel(null);
    setCalculatedRange(null);
    setClickedButton(`income-${value}`);

    setTimeout(() => {
      setClickedButton(null);
      setCurrentStep(4);
    }, 200);
  };

  const handleChildrenSelect = (value: number, label: string) => {
    const normalizedValue = value >= 3 ? 3 : value;
    setNumberOfChildren(normalizedValue);
    setSelectedChildrenLabel(label);
    setClickedButton(`children-${value}`);

    setTimeout(() => {
      setClickedButton(null);
      handleCalculate(monthlyIncome, normalizedValue);
    }, 200);
  };

  const handleCalculate = (
    incomeValue: number | null = monthlyIncome,
    childrenValue: number | null = numberOfChildren
  ) => {
    if (incomeValue === null || childrenValue === null) {
      toast.error('Selecciona un rango de ingreso y cuántos hijos están involucrados');
      return;
    }

    const range = calculatePensionRange(incomeValue, childrenValue);
    setCalculatedRange(range);
    
    const updatedAnswers = {
      ...answers,
      calculatorIncome: selectedIncomeLabel ?? formatCurrency(incomeValue),
      calculatorChildren: selectedChildrenLabel ?? childrenValue.toString()
    };
    setAnswers(updatedAnswers);
    
    const result = getRecommendation(updatedAnswers);
    setRecommendation(result);
    
    // Guardar lead completo y mostrar resultado
    setTimeout(async () => {
      await handleFinalSubmit(result);
    }, 150);
  };

  const resetQuiz = () => {
    setCurrentStep(-1); // Volver al paso cero
    setAnswers({});
    setEmail('');
    setShowResult(false);
    setRecommendation(null);
    setIsLoading(false);
    setMonthlyIncome(null);
    setSelectedIncomeLabel(null);
    setNumberOfChildren(null);
    setCalculatedRange(null);
    setClickedButton(null);
  };

  // Obtener mensaje personalizado según la situación del usuario
  const getPersonalizedMessage = () => {
    const situation = answers['0'];
    if (situation === 'mutual') {
      return {
        title: "¡Excelente! Un acuerdo mutuo es el camino más rápido.",
        subtitle: "Tu estrategia personalizada está casi lista. Solo necesitamos tu información para enviártela."
      };
    } else if (situation === 'conflict') {
      return {
        title: "Entendido. Proteger tus derechos es la prioridad.",
        subtitle: "Hemos preparado una estrategia legal robusta para tu situación. Déjanos enviártela."
      };
    } else if (situation === 'complex') {
      return {
        title: "Tu caso requiere expertise especializado.",
        subtitle: "Tenemos la experiencia internacional y empresarial que necesitas. Te mostramos cómo."
      };
    }
    return {
      title: "¡Análisis Completado!",
      subtitle: "Tu estrategia legal personalizada está lista."
    };
  };

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Solo bloquear el scroll del body, pero permitir scroll dentro del modal
      document.body.style.overflow = 'hidden';
      // Scroll al inicio cuando se abre el modal
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const resendPendingLeads = async () => {
      const pendingRaw = localStorage.getItem('pendingQuizLeads');
      if (!pendingRaw) return;
      let pending: any[] = [];
      try {
        const parsed = JSON.parse(pendingRaw);
        if (Array.isArray(parsed)) {
          pending = parsed;
        } else {
          localStorage.removeItem('pendingQuizLeads');
          return;
        }
      } catch {
        localStorage.removeItem('pendingQuizLeads');
        return;
      }

      if (!pending.length) {
        localStorage.removeItem('pendingQuizLeads');
        return;
      }

      const remaining: any[] = [];
      for (const lead of pending) {
        try {
          const payload = {
            name: 'Quiz Inline Lead',
            email: lead.email,
            quiz_answers: JSON.stringify(lead.answers ?? {}),
            plan_recommended: lead.plan ?? lead.recommendation?.plan ?? 'Integral',
            income_range: lead.incomeRange ?? null,
            income_value: lead.incomeValue ?? null,
            children_count: lead.childrenCount ?? null,
            children_label: lead.childrenLabel ?? null,
            calculated_min: lead.calculatedRange?.min ?? null,
            calculated_max: lead.calculatedRange?.max ?? null,
            status: 'pendiente'
          };

          const { error } = await supabase.from('leads_quiz').insert([payload]);
          if (error) throw error;
        } catch (err) {
          console.warn('No se pudo reenviar lead pendiente', err);
          remaining.push(lead);
        }
      }

      if (remaining.length) {
        localStorage.setItem('pendingQuizLeads', JSON.stringify(remaining));
      } else {
        localStorage.removeItem('pendingQuizLeads');
      }
    };

    resendPendingLeads();
  }, []);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          key="quiz-modal"
          data-quiz-modal
          className="fixed inset-0 z-[9999] overflow-y-auto" 
          style={{ 
            position: 'fixed !important' as any, 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 9999,
            WebkitOverflowScrolling: 'touch' as any,
            overflowY: 'auto',
            touchAction: 'pan-y'
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            style={{ position: 'fixed' }}
          />
          
          {/* Modal - Desde arriba en móvil, centrado en desktop */}
          <div 
            className="min-h-full flex items-start justify-center p-0 sm:p-2 md:p-4 py-0"
          >
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
              className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl rounded-none sm:rounded-2xl md:rounded-3xl border-0 sm:border border-slate-800
                         shadow-2xl shadow-black/50 flex flex-col relative overflow-hidden
                         min-h-screen sm:min-h-[500px] md:min-h-0 md:max-h-[90vh] md:my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header iOS sobrio */}
            <div className="relative p-5 sm:p-6 border-b border-slate-800 flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute right-3 top-3 sm:right-4 sm:top-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80
                         transition-colors duration-200 z-10 border border-slate-700/60"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="pr-10"
              >
                <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 mb-3 bg-pink-500/10 border border-pink-500/30">
                  <span aria-hidden="true">✨</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-200">
                    Diagnóstico gratis · 60 segundos
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 leading-tight">
                  ¿Qué nivel de protección legal necesitas?
                </h2>
                <p className="text-slate-400 text-sm">
                  Responde 3 preguntas y recibe tu plan recomendado al instante.
                </p>
              </motion.div>
            </div>

            {/* Barra de progreso - Solo visible después del paso cero */}
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

            {/* Contenido - Scrollable */}
            <div
              className="p-4 sm:p-6 pb-8 sm:pb-6 flex-1 min-h-0 overflow-y-auto overscroll-contain"
              data-quiz-content
              style={{ WebkitOverflowScrolling: 'touch' as any }}
            >
              <AnimatePresence mode="wait">
                {/* PASO CERO - Mensaje de Bienvenida + Captura de Email */}
                {!showResult && currentStep === -1 && (
                  <motion.div
                    key="step-zero"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4 md:space-y-6"
                  >
                    {/* Encabezado Permanente - Mensaje de Bienvenida */}
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full 
                                 flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-pink-500/20"
                      >
                        <Heart className="w-8 h-8 md:w-10 md:h-10 text-pink-400" />
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        Sabemos que este es un momento difícil
                      </h3>
                      <p className="text-slate-300 text-xs md:text-sm">
                        Estamos aquí para darte <span className="text-pink-400 font-semibold">claridad</span> y 
                        <span className="text-pink-400 font-semibold"> tranquilidad</span>.
                      </p>
                    </div>

                    {/* Campo de Email - Captura Inmediata */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-white">
                        Para comenzar, ¿cuál es tu correo electrónico?
                      </label>
                      <div className="relative">
                        <div className={`w-full p-4 rounded-2xl bg-slate-800/60 border flex items-center gap-3 transition-all ${
                          emailValid 
                            ? 'border-green-500/50 bg-slate-700/60' 
                            : 'border-slate-700/50 focus-within:border-pink-500 focus-within:bg-slate-700/60'
                        }`}>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => {
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              setEmailValid(emailRegex.test(e.target.value));
                            }}
                            className="flex-1 bg-transparent text-white placeholder-white/40 text-base focus:outline-none"
                            placeholder="tu@email.com"
                            autoComplete="email"
                          />
                          {emailValid && (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          )}
                        </div>
                        {emailSaved && (
                          <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Email guardado
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botón para continuar */}
                    <motion.button
                      onClick={() => {
                        if (emailValid) {
                          setCurrentStep(0);
                        } else {
                          toast.error('Por favor ingresa un email válido');
                        }
                      }}
                      disabled={!emailValid}
                      whileHover={emailValid ? { scale: 1.02 } : {}}
                      whileTap={emailValid ? { scale: 0.98 } : {}}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                        emailValid
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-xl shadow-pink-500/40'
                          : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Continuar al cuestionario
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* TODAS LAS PREGUNTAS SIMULTÁNEAMENTE - Paso 0 */}
                {!showResult && currentStep === 0 && (
                  <motion.div
                    key="all-questions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 md:space-y-8"
                  >
                    {/* Encabezado */}
                    <div className="text-center">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
                        Responde estas 3 preguntas
                      </h3>
                      <p className="text-slate-400 text-xs md:text-sm">
                        Puedes responder en cualquier orden
                      </p>
                    </div>

                    {/* Todas las preguntas renderizadas */}
                    {questions.map((question, qIndex) => {
                      const questionId = question.id;
                      const isAnswered = answers[questionId.toString()] !== undefined;
                      const isBlocked = !emailValid;
                      
                      return (
                        <div
                          key={questionId}
                          id={`question-${questionId}`}
                          className={`space-y-3 md:space-y-4 transition-all scroll-mt-24 ${isBlocked ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0 ${
                              isAnswered 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                                : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                            }`}>
                              {isAnswered ? <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> : questionId + 1}
                            </div>
                            <h4 className="text-base md:text-lg font-semibold text-white flex-1">
                              {question.question}
                            </h4>
                          </div>
                          
                          <div className="grid gap-2 md:gap-3 ml-9 md:ml-11">
                            {question.options.map((option, index) => {
                              const Icon = option.icon;
                              const isSelected = answers[questionId.toString()] === option.value;
                              const optionKey = `${questionId}-${option.value}`;
                              
                              return (
                                <motion.button
                                  key={option.value}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => {
                                    setClickedButton(optionKey);
                                    setTimeout(() => {
                                      handleAnswer(questionId, option.value);
                                      setClickedButton(null);
                                    }, 150);
                                  }}
                                  whileHover={!isBlocked ? { scale: 1.02, x: 3 } : {}}
                                  whileTap={!isBlocked ? { scale: 0.98 } : {}}
                                  className={`w-full p-4 rounded-2xl border transition-all duration-200 
                                           text-left flex items-center gap-4 group relative overflow-hidden
                                           ${isSelected
                                             ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/30'
                                             : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-pink-500/30'
                                           }`}
                                >
                                  {clickedButton === optionKey && (
                                    <motion.div
                                      initial={{ x: '-100%' }}
                                      animate={{ x: '200%' }}
                                      transition={{ duration: 0.5 }}
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
                                    />
                                  )}
                                  
                                  <div className={`p-3 rounded-full transition-colors relative ${
                                    isSelected
                                      ? 'bg-gradient-to-br from-pink-500/30 to-rose-500/30'
                                      : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 group-hover:from-pink-500/30 group-hover:to-rose-500/30'
                                  }`}>
                                    <Icon className="w-5 h-5 text-pink-400" />
                                  </div>
                                  <span className="text-white font-medium relative flex-1">{option.label}</span>
                                  {isSelected && (
                                    <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0" />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Botón Final - Solo visible cuando todo está completo */}
                    {emailValid && allQuestionsAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="pt-6 border-t border-slate-700/50 sticky bottom-0 bg-slate-900/95 backdrop-blur-xl pb-4 z-10"
                      >
                        <motion.button
                          onClick={handleShowRecommendation}
                          disabled={isLoading}
                          whileHover={!isLoading ? { scale: 1.02 } : {}}
                          whileTap={!isLoading ? { scale: 0.98 } : {}}
                          className="w-full py-4 md:py-5 px-6 rounded-xl font-bold text-base md:text-lg text-white 
                                   bg-gradient-to-r from-pink-500 to-rose-600 
                                   hover:from-pink-600 hover:to-rose-700 
                                   shadow-2xl shadow-pink-500/40 transition-all duration-200
                                   flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              Ver mi Recomendación
                              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* PASO DE INGRESOS (Paso 3) */}
                {!showResult && currentStep === 3 && (
                  <motion.div
                    key="income-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-6">
                      ¿Cuál es el rango de ingreso mensual?
                      </h3>

                    <div className="grid gap-3">
                      {incomeOptions.map((option, index) => {
                        const optionKey = `income-${option.value}`;
                        const isSelected = monthlyIncome === option.value;
                        return (
                          <motion.button
                            key={optionKey}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ scale: 1.02, x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleIncomeSelect(option.value, option.label)}
                            className={`w-full p-4 rounded-2xl border transition-all duration-200 text-left flex items-center gap-4 group relative overflow-hidden
                                     ${isSelected
                                       ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/30'
                                       : 'bg-slate-800/50 border-slate-700/50 hover:border-pink-500/40 hover:bg-slate-700/50'
                                     }`}
                          >
                            {clickedButton === optionKey && (
                              <motion.div
                                initial={{ x: '-120%' }}
                                animate={{ x: '120%' }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/15 to-transparent"
                              />
                            )}

                            <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 
                                          group-hover:from-pink-500/30 group-hover:to-rose-500/30 transition-colors relative">
                              <DollarSign className="w-6 h-6 text-pink-400" />
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

                {/* PASO DE HIJOS (Paso 4) */}
                {!showResult && currentStep === 4 && (
                  <motion.div
                    key="children-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-6">
                      ¿Cuántos hijos están involucrados?
                    </h3>

                    <div className="grid gap-3">
                      {childrenOptions.map((option, index) => {
                        const optionKey = `children-${option.value}`;
                        const isSelected = option.value === 3
                          ? (numberOfChildren ?? 0) >= 3
                          : numberOfChildren === option.value;

                        return (
                          <motion.button
                            key={optionKey}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ scale: 1.02, x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleChildrenSelect(option.value, option.label)}
                            className={`w-full p-4 rounded-2xl border transition-all duration-200 text-left flex items-center gap-4 group relative overflow-hidden
                                     ${isSelected
                                       ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/30'
                                       : 'bg-slate-800/50 border-slate-700/50 hover:border-pink-500/40 hover:bg-slate-700/50'
                                     }`}
                          >
                            {clickedButton === optionKey && (
                              <motion.div
                                initial={{ x: '-120%' }}
                                animate={{ x: '120%' }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/15 to-transparent"
                              />
                            )}

                            <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 
                                          group-hover:from-pink-500/30 group-hover:to-rose-500/30 transition-colors relative">
                              <Users className="w-6 h-6 text-pink-400" />
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

                {/* Resultado */}
                {showResult && recommendation && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full space-y-6"
                  >
                    <div className="text-center space-y-3 md:space-y-4 mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 border border-white/20 rounded-3xl 
                                    flex items-center justify-center mx-auto backdrop-blur-xl">
                        <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-white/90" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-1">
                          Plan Recomendado
                        </h3>
                        <p className="text-xs md:text-sm text-white/50">
                          Basado en tus respuestas
                        </p>
                      </div>
                    </div>
                    
                    {/* CTA Principal - Arriba para mejor acceso */}
                    <div className="space-y-3 mb-6">
                      <motion.button
                        onClick={() => {
                          onClose();
                          navigate(
                            `/agendamiento?plan=consulta-estrategica-familia&email=${encodeURIComponent(email)}`
                          );
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all shadow-xl shadow-pink-500/40 text-base md:text-lg"
                      >
                        Agendar Consulta · $35.000
                      </motion.button>
                    </div>
                    
                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 backdrop-blur-xl">
                      <div className="space-y-3 md:space-y-4">
                        <div>
                          <h4 className="text-lg md:text-xl font-semibold text-white mb-2">
                            {recommendation.title}
                          </h4>
                          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                            {recommendation.reason}
                          </p>
                        </div>
                        
                        {/* Precio destacado */}
                        <div className="pt-3 md:pt-4 border-t border-white/10">
                          <div className="flex items-baseline gap-2 md:gap-3">
                            <span className="text-2xl md:text-3xl font-bold text-white">$35.000</span>
                            <span className="text-xs md:text-sm text-white/40 line-through">$70.000</span>
                          </div>
                          <p className="text-xs text-white/50 mt-1">Consulta Estratégica con Abogado</p>
                        </div>
                      </div>

                      {/* Testimonio específico — burbuja iOS estilo Familia */}
                      {testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan] && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl mt-5 shadow-md shadow-slate-950/40"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700">
                              <span className="text-xs" aria-hidden="true">⭐️⭐️⭐️⭐️⭐️</span>
                              <span className="text-[11px] font-medium text-slate-200">Experiencia verificada</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan].role}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-3 italic leading-relaxed">
                            “{testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan].quote}”
                          </p>
                          <p className="text-sm font-semibold text-slate-100">
                            {testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan].author}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* COMPONENTE DE RANGO ESTIMADO - Solo si se calculó */}
                    {calculatedRange && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-2 border-pink-500/30 
                                 rounded-2xl p-6 mb-6 relative overflow-hidden"
                      >
                        {/* Efecto de brillo */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl" />
                        
                        <div className="relative">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl 
                                          flex items-center justify-center shadow-lg">
                              <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-white">
                              Rango de Pensión Estimado
                            </h4>
                          </div>

                          {/* Visualización del rango con animación */}
                          <div className="bg-slate-800/50 rounded-xl p-5 mb-4">
                            <div className="text-center">
                              <p className="text-sm text-slate-400 mb-2">Estimación mensual</p>
                              <div className="flex items-center justify-center gap-3">
                                <motion.span 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.2, type: 'spring' }}
                                  className="text-3xl font-bold text-pink-400"
                                >
                                  <AnimatedCounter value={calculatedRange.min} />
                                </motion.span>
                                <motion.span 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                  className="text-2xl text-slate-500"
                                >
                                  —
                                </motion.span>
                                <motion.span 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.6, type: 'spring' }}
                                  className="text-3xl font-bold text-rose-400"
                                >
                                  <AnimatedCounter value={calculatedRange.max} delay={0.3} />
                                </motion.span>
                              </div>
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-xs text-slate-500 mt-2"
                              >
                                CLP mensuales
                              </motion.p>
                            </div>
                          </div>

                          {/* Disclaimer */}
                          <div className="flex items-start gap-2 text-xs text-slate-400">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              <span className="text-slate-300 font-medium">Importante:</span> Este es un rango estimado 
                              para fines informativos. Tu informe completo detallará los cálculos exactos según la ley 
                              chilena y las particularidades de tu caso.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="bg-white/5 rounded-2xl p-4 md:p-6 mb-6">
                      <h4 className="font-semibold text-white mb-3 text-sm md:text-base">Tu plan incluye:</h4>
                      <ul className="space-y-2 md:space-y-3">
                        {recommendation.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300 text-xs md:text-sm">
                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-pink-400" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Botón secundario */}
                    <div className="pb-6">
                      <button
                        onClick={resetQuiz}
                        className="w-full py-3 px-6 rounded-2xl font-medium text-white/50 hover:text-white/70 transition-colors text-sm md:text-base"
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
    </AnimatePresence>,
    document.body
  );
};

export default React.memo(QuizModal);
