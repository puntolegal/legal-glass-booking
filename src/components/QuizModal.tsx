import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
  const [currentStep, setCurrentStep] = useState(-1); // Empezamos en -1 para el "Paso Cero"
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
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

  const handleAnswer = (value: string) => {
    const stepKey = currentStep.toString();
    const newAnswers = { ...answers, [stepKey]: value };
    delete newAnswers.calculatorIncome;
    delete newAnswers.calculatorChildren;
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 200);
    } else {
      // Última pregunta respondida
      setTimeout(() => {
        const shouldCalculate = shouldShowCalculator(newAnswers);
        setMonthlyIncome(null);
        setSelectedIncomeLabel(null);
        setNumberOfChildren(null);
        setSelectedChildrenLabel(null);
        setCalculatedRange(null);

        const result = getRecommendation(newAnswers);
        setRecommendation(result);

        if (shouldCalculate) {
          setCurrentStep(3); // Paso de ingresos
        } else {
          setCurrentStep(5); // Ir directo al email
        }
      }, 200);
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
    
    setTimeout(() => {
      setCurrentStep(5);
    }, 150);
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
        income_range: selectedIncomeLabel,
        income_value: monthlyIncome,
        children_count: numberOfChildren,
        children_label: selectedChildrenLabel,
        calculated_min: calculatedRange?.min ?? null,
        calculated_max: calculatedRange?.max ?? null,
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
      let pendingLeads: any[] = [];
      try {
        pendingLeads = pendingLeadsRaw ? JSON.parse(pendingLeadsRaw) : [];
        if (!Array.isArray(pendingLeads)) pendingLeads = [];
      } catch {
        pendingLeads = [];
      }
      pendingLeads.push({
        email,
        answers,
        plan: recommendation?.plan || 'Integral',
        incomeRange: selectedIncomeLabel,
        incomeValue: monthlyIncome,
        childrenCount: numberOfChildren,
        childrenLabel: selectedChildrenLabel,
        calculatedRange,
        timestamp: Date.now()
      });
      localStorage.setItem('pendingQuizLeads', JSON.stringify(pendingLeads));
      toast.error('Guardamos tu resultado, pero no pudimos enviar el email. Te contactaremos pronto.');
    } finally {
      setIsLoading(false);
    }
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

  // Bloquear scroll del body cuando el modal está abierto y llevar al usuario al inicio de la pantalla
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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999]" 
          style={{ 
            position: 'fixed !important' as any, 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 9999
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal - Centrado perfecto web y móvil */}
          <div 
            className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto"
          >
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
            <div className="p-6 overflow-y-auto flex-1">
              <AnimatePresence mode="wait">
                {/* PASO CERO - Conexión Emocional */}
                {!showResult && currentStep === -1 && (
                  <motion.div
                    key="step-zero"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center text-center py-8"
                  >
                    {/* Ícono grande con animación de latido */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full 
                               flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20"
                    >
                      <Heart className="w-12 h-12 text-pink-400" />
                    </motion.div>

                    {/* Mensaje de empatía */}
                    <h3 className="text-3xl font-bold text-white mb-4 max-w-lg">
                      Sabemos que este es un momento difícil
                    </h3>
                    <p className="text-xl text-slate-300 mb-8 max-w-md leading-relaxed">
                      Estamos aquí para darte <span className="text-pink-400 font-semibold">claridad</span> y 
                      <span className="text-pink-400 font-semibold"> tranquilidad</span>.
                    </p>

                    {/* Beneficios rápidos */}
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
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                          </div>
                          <span className="text-slate-300">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Grande */}
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

                    <p className="text-xs text-slate-500 mt-4">
                      100% confidencial • Sin compromiso • Respuesta inmediata
                    </p>
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
                              // Micro-feedback con borde iluminado
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
                            {/* Efecto de brillo al seleccionar */}
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

                {/* Paso de email (Paso 5) */}
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
                        {calculatedRange ? (
                          <DollarSign className="w-8 h-8 text-white" />
                        ) : (
                          <Sparkles className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        ¡Último paso! ¿A qué correo enviamos tu estrategia?
                      </h3>
                      <p className="text-slate-300 text-sm">
                        En menos de 60 segundos recibirás tu rango estimado y el plan legal priorizado por nuestro equipo.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-6">
                      <p className="text-white text-center font-semibold mb-4">
                        Obtendrás al instante:
                      </p>
                      <ul className="space-y-3 text-left">
                        <li className="flex items-center gap-3 text-sm text-white">
                          <CheckCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                          <span>El rango estimado de pensión calculado para tu caso</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-white">
                          <Gift className="w-5 h-5 text-amber-400 flex-shrink-0" />
                          <span>La recomendación de plan con un beneficio preferente</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-white">
                          <Shield className="w-5 h-5 text-rose-300 flex-shrink-0" />
                          <span>Acceso inmediato a nuestra garantía de satisfacción total</span>
                        </li>
                      </ul>
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

                    <p className="text-[11px] text-center text-slate-500">
                      Tu información es confidencial y está protegida al 100%.
                    </p>
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
                      <div className="inline-block bg-gradient-to-r from-amber-500/20 to-orange-500/20 
                                    border border-amber-500/30 rounded-full px-4 py-1 mb-4">
                        <span className="text-amber-400 font-semibold">
                          {recommendation.discount} de descuento aplicado
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 
                                  rounded-2xl p-6 mb-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {recommendation.title}
                      </h4>
                      <p className="text-slate-300 mb-6">
                        {recommendation.reason}
                      </p>

                      {/* Testimonio específico del plan - PRUEBA SOCIAL */}
                      {testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan] && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mt-4"
                        >
                          {/* Estrellas */}
                          <div className="flex gap-1 mb-2">
                            {[...Array(testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan].rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          {/* Cita */}
                          <p className="text-sm text-slate-300 italic mb-2">
                            "{testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan].quote}"
                          </p>
                          {/* Autor */}
                          <div className="text-xs">
                            <span className="text-white font-semibold">
                              {testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan].author}
                            </span>
                            <span className="text-slate-500"> • </span>
                            <span className="text-slate-400">
                              {testimonialsByPlan[recommendation.plan as keyof typeof testimonialsByPlan].role}
                            </span>
                          </div>
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
                    
                    <div className="bg-white/5 rounded-2xl p-6 mb-6">
                      <h4 className="font-semibold text-white mb-3">Tu plan incluye:</h4>
                      <ul className="space-y-3">
                        {recommendation.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-pink-400" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                        
                        {/* GARANTÍA - Elemento destacado al final */}
                        <motion.li 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mt-4"
                        >
                          <Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-green-400 font-bold text-sm mb-1">Garantía Total</p>
                            <p className="text-slate-300 text-sm">
                              Si no quedas conforme, te devolvemos el 100% sin preguntas.
                            </p>
                          </div>
                        </motion.li>
                      </ul>
                    </div>
                    
                    {/* CTAs */}
                    <div className="space-y-3">
                      <div>
                      <a
                        href={`/agendamiento?plan=familia-${recommendation.plan.toLowerCase()}&discount=${recommendation.discount}`}
                        className="block w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r 
                                   from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 
                                   transition-all duration-200 text-center shadow-lg shadow-pink-500/30"
                      >
                        Agendar Mi Consulta con Descuento
                      </a>
                        {/* Mensaje de urgencia y escasez */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-center text-xs text-amber-400 mt-2 flex items-center justify-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          Cupos limitados esta semana. Asegura tu lugar ahora.
                        </motion.p>
                      </div>
                      
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

  // Renderizar en un portal para evitar problemas de z-index
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default React.memo(QuizModal);
