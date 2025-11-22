import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, Shield, CheckCircle, ArrowRight, 
  ChevronLeft, Award, Lock, DollarSign, Sparkles, User, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import MercadoPagoButton from '../components/MercadoPagoButton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// --- COMPONENTE: Header de Navegación ---
const PagoHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="absolute top-0 left-0 w-full p-4 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE: Testimonio Simple ---
const SimpleTestimonial = () => (
  <div className="rounded-[30px] border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 shadow-[0_25px_55px_rgba(15,23,42,0.6)] backdrop-blur-xl space-y-4">
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-semibold">
        CR
      </div>
      <div className="flex-1">
        <p className="text-base font-semibold text-white leading-tight">Camila R.</p>
        <p className="text-xs text-slate-300">Las Condes · madre de 2 hijos</p>
      </div>
      <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
        Caso real
      </div>
    </div>
    <p className="text-sm text-slate-200 leading-relaxed">
      “El PDF fue súper claro, me entregó rangos concretos y pasos inmediatos. Por fin pude tomar decisiones sin miedo.”
    </p>
    <div className="flex items-center justify-between text-sm text-pink-200/90" aria-hidden="true">
      <div className="inline-flex items-center gap-1 rounded-full border border-pink-400/40 bg-pink-500/10 px-3 py-1">
        <Star className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        5.0 / 5
      </div>
      <div className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-pink-500 shadow-md">
        ❤️
        <span>Gracias</span>
      </div>
    </div>
  </div>
);

// --- COMPONENTE NUEVO: Confianza Experta (autoridad + tono clínico) ---
const ExpertTrust = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 md:p-8 shadow-[0_35px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl"
  >
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex-1 space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 via-transparent to-transparent p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/40 border border-sky-400/40">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200">
                Certificación
              </div>
            </div>
            <div className="flex-1 min-w-[220px] space-y-1">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500">Dirección legal</p>
              <p className="text-xl font-semibold text-white leading-tight">Dra. María González</p>
              <p className="text-xs text-slate-400">Directora de Derecho de Familia · Punto Legal</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200 w-fit">
            +17 años en tribunales de familia
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed">
          Construimos este diagnóstico para que antes de contratar un abogado ya tengas un mapa claro de <span className="font-semibold text-white">rangos de pensión, riesgos y escenarios probables</span>. Con esa claridad eliges tu siguiente paso con calma y sin presiones.
        </p>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white/80">IA auditada por abogados expertos</span>
          <span>El modelo se recalibra mensualmente con criterios de jueces de familia en Chile para asegurar recomendaciones consistentes y actualizadas.</span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Rangos proyectados</p>
          <p className="text-3xl font-semibold text-white mt-2">{currencyFormatter.format(450000)}</p>
          <p className="text-xs text-slate-400 mt-1">Calculados con datos reales de casos recientes</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Checklist prioritario</p>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
            <li>• Documentos urgentes</li>
            <li>• Rutas procesales recomendadas</li>
            <li>• Próximos 3 pasos sugeridos</li>
          </ul>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- COMPONENTE NUEVO: Timeline "Qué Pasa Después" ---
const WhatHappensNext = () => {
  const steps = [
    { number: '1', title: 'Pago Seguro', description: 'Procesado por MercadoPago' },
    { number: '2', title: 'IA Genera PDF', description: 'En menos de 3 minutos' },
    { number: '3', title: 'Recibes en tu Email', description: 'Informe completo listo' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent shadow-[0_20px_55px_rgba(15,23,42,0.45)]"
    >
      <h3 className="text-lg font-bold text-white mb-4 text-center">¿Qué pasa después?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-center shadow-[0_12px_30px_rgba(15,23,42,0.35)]"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold flex items-center justify-center shadow-lg shadow-pink-500/30">
              {step.number}
            </div>
            <p className="text-sm font-semibold text-white">{step.title}</p>
            <p className="text-xs text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- COMPONENTE PRINCIPAL REFACTORIZADO ---
const PagoDiagnosticoIA = () => {
  const navigate = useNavigate();
  const formCardRef = useRef<HTMLDivElement>(null);
  
  // Estados del flujo conversacional
  const [currentStep, setCurrentStep] = useState(0); // 0: Ingreso, 1: Datos personales, 2: Pago
  const [monthlyIncome, setMonthlyIncome] = useState<number>(1000000);
  const [selectedIncomeRange, setSelectedIncomeRange] = useState<string>('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: ''
  });
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [incomeSelectionFeedback, setIncomeSelectionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (currentStep > 0 && formCardRef.current && typeof window !== 'undefined') {
      if (window.innerWidth < 1024) {
        const target = formCardRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(target, 0), behavior: 'smooth' });
      }
    }
  }, [currentStep]);

  // Validación simple del formulario
  const isFormValid = formData.nombre.length > 2 && formData.email.includes('@');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Función para guardar el lead antes del pago
  const handleSaveLeadAndContinue = async () => {
    if (!isFormValid) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsSavingLead(true);

    try {
      const leadData = {
        name: formData.nombre,
        email: formData.email,
        quiz_answers: { monthlyIncome, incomeRange: selectedIncomeRange },
        plan_recommended: 'Diagnóstico IA',
        status: 'lead_captured'
      };

      const { data, error } = await supabase
        .from('leads_quiz')
        .insert([leadData])
        .select()
        .single();

      if (error) throw error;

      setLeadSaved(true);
      setLeadId(data.id);
      
      toast.success('¡Perfecto! Ahora completa tu pago seguro');
      
      // Avanzar al paso de pago
      setTimeout(() => {
        setCurrentStep(2);
        setIsSavingLead(false);
      }, 500);

    } catch (error) {
      console.error('Error guardando lead:', error);
      toast.error('Hubo un error. Por favor intenta nuevamente.');
      setIsSavingLead(false);
    }
  };

  // --- LÓGICA DE PAGO ROBUSTECIDA CON TRY-CATCH ---
  const handlePaymentSuccess = async (preferenceId: string) => {
    if (isProcessing) return; // Evitar doble click
    setIsProcessing(true);
    
    try {
      // Guardar los datos del usuario en sessionStorage para el onboarding
      sessionStorage.setItem('diagnosticoUserData', JSON.stringify({
        nombre: formData.nombre,
        email: formData.email,
        preferenceId: preferenceId
      }));
      
      // Mostrar mensaje de éxito
      toast.success('¡Redirigiendo a MercadoPago...');
      
      // El componente MercadoPagoButton ya maneja la redirección
      // Aquí solo guardamos los datos para cuando regrese

    } catch (error) {
      console.error("Error al procesar post-pago:", error);
      toast.error('Hubo un error al guardar tu pago. Por favor, contáctanos.');
      setIsProcessing(false); // Permitir reintento
    }
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    toast.error(error || 'Hubo un error al procesar el pago. Por favor, intenta nuevamente.');
  };

  const renderActionButton = () => {
    if (currentStep === 0) {
      return (
        <motion.button
          key="action-step-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={selectedIncomeRange ? { scale: 1.02 } : {}}
          whileTap={selectedIncomeRange ? { scale: 0.98 } : {}}
          onClick={() => {
            setLeadSaved(false);
            setCurrentStep(1);
          }}
          disabled={!selectedIncomeRange}
          className={`w-full rounded-2xl border px-6 py-5 font-semibold text-lg tracking-wide transition-all flex items-center justify-center gap-3
                    ${selectedIncomeRange
                      ? 'border-transparent bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_25px_55px_rgba(15,23,42,0.65)] hover:-translate-y-0.5'
                      : 'border-white/10 bg-slate-900/60 text-slate-500 cursor-not-allowed shadow-[0_12px_30px_rgba(15,23,42,0.45)]'
                    }`}
        >
          Continuar
          {selectedIncomeRange && <ArrowRight className="w-5 h-5" />}
        </motion.button>
      );
    }

    if (currentStep === 1) {
      return (
        <motion.button
          key="action-step-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSaveLeadAndContinue}
          disabled={!isFormValid || isSavingLead}
          whileHover={isFormValid && !isSavingLead ? { scale: 1.02 } : {}}
          whileTap={isFormValid && !isSavingLead ? { scale: 0.98 } : {}}
          className={`w-full rounded-2xl border px-6 py-5 font-semibold text-lg tracking-wide transition-all flex items-center justify-center gap-3
                    ${!isFormValid || isSavingLead
                      ? 'border-white/10 bg-slate-900/60 text-slate-500 cursor-not-allowed shadow-[0_12px_30px_rgba(15,23,42,0.45)]'
                      : 'border-transparent bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_25px_55px_rgba(15,23,42,0.65)] hover:-translate-y-0.5'
                    }`}
        >
          {isSavingLead ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Guardando datos…
            </>
          ) : (
            <>
              Guardar y Continuar al Pago Seguro
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      );
    }

    if (currentStep === 2 && leadSaved) {
      return (
        <MercadoPagoButton
          amount={6990}
          description="Diagnóstico de Pensión IA"
          externalReference={`diagnostico-ia-${leadId || Date.now()}`}
          customer={{
            name: formData.nombre,
            email: formData.email,
            phone: ''
          }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        >
          <motion.button
            key="action-step-2"
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            disabled={isProcessing}
            whileHover={!isProcessing ? { scale: 1.02 } : {}}
            whileTap={!isProcessing ? { scale: 0.98 } : {}}
            className={`w-full rounded-2xl border px-6 py-5 font-semibold text-lg tracking-wide transition-all flex items-center justify-center gap-3
                      ${isProcessing
                        ? 'border-white/10 bg-slate-900/60 text-slate-500 cursor-not-allowed shadow-[0_12px_30px_rgba(15,23,42,0.45)]'
                        : 'border-transparent bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_30px_65px_rgba(15,23,42,0.7)] hover:-translate-y-0.5'
                      }`}
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                Procesando pago...
              </>
            ) : (
              <>
                <Lock className="w-6 h-6" />
                Pagar $6.990 y recibir mi informe
              </>
            )}
          </motion.button>
        </MercadoPagoButton>
      );
    }

    return null;
  };

  const incomeOptions = [
    { label: 'Menos de $800.000', value: 600000 },
    { label: '$800.000 - $1.5M', value: 1150000 },
    { label: '$1.5M - $3M', value: 2250000 },
    { label: 'Más de $3M', value: 4000000 }
  ];

  const mockupScenarios = useMemo(() => {
    const base = Math.round(monthlyIncome * 0.35);
    const extended = Math.round(monthlyIncome * 0.48);
    const ambitious = Math.round(monthlyIncome * 0.55);
    return {
      base,
      extended,
      ambitious
    };
  }, [monthlyIncome]);

  const stepContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.02 }
    }
  };

  const stepItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const benefits = [
    {
      icon: FileText,
      title: 'PDF Detallado con Cálculos',
      description: 'Informe completo con todos los cálculos según la ley chilena'
    },
    {
      icon: Clock,
      title: 'Recíbelo en Menos de 5 Minutos',
      description: 'Procesamiento automático inmediato después del pago'
    },
    {
      icon: Shield,
      title: '100% Confidencial y Seguro',
      description: 'Tus datos están protegidos con encriptación de grado bancario'
    }
  ];

  return (
    <>
      <SEO 
        title="Diagnóstico de Pensión IA - Pago Seguro | Punto Legal Chile"
        description="Obtén tu diagnóstico de pensión alimenticia automatizado por solo $6.990. Recibe un informe detallado en menos de 5 minutos."
      />
      
      <div className="min-h-screen bg-slate-900 text-slate-300 antialiased">
        {/* Gradientes de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20rem] left-[-20rem] w-[50rem] h-[50rem] bg-gradient-radial from-pink-500/10 via-slate-900/0 to-transparent blur-3xl"></div>
          <div className="absolute bottom-[-20rem] right-[-20rem] w-[50rem] h-[50rem] bg-gradient-radial from-rose-500/10 via-slate-900/0 to-transparent blur-3xl"></div>
        </div>

        {/* Header de navegación */}
        <PagoHeader />

        {/* Contenedor principal con padding-top para el header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          
          {/* Encabezado */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200">
              <Sparkles className="h-4 w-4 text-pink-300" />
              IA auditada por abogados
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tu Diagnóstico de Pensión Automatizado
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Obtén claridad inmediata sobre tu situación legal con nuestro sistema de IA especializado
            </p>
          </motion.div>

          {/* Grid de dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Columna izquierda: Beneficios y valor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6 md:p-8 shadow-[0_30px_70px_rgba(15,23,42,0.5)] backdrop-blur-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Lo que recibes al instante
              </h2>
                  <p className="text-sm text-slate-400 max-w-md">
                    Diseñado para darte claridad inmediata, con una experiencia guiada por especialistas de Derecho de Familia.
                  </p>
                </div>
              
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                      key={benefit.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/40 hover:bg-white/10 transition-all shadow-[0_12px_30px_rgba(15,23,42,0.45)]"
                  >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md shadow-pink-500/30">
                          <benefit.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-white text-sm leading-tight">{benefit.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>

                <ExpertTrust />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent shadow-[0_20px_55px_rgba(15,23,42,0.5)]"
                >
                  <h3 className="font-semibold text-white mb-4 text-center">
                      Un vistazo a tu informe personalizado
                  </h3>
                    <div className="bg-slate-950/60 rounded-xl p-5 border border-white/10">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
                        <FileText className="w-5 h-5 text-pink-400" />
                        <span className="text-sm font-semibold text-white">Diagnostico_Pension_IA.pdf</span>
                    </div>
                      <div className="grid gap-2 text-xs text-slate-300 font-mono">
                        <p>Escenario base: {formatCurrency(350000)}</p>
                        <p>Escenario extendido: {formatCurrency(480000)}</p>
                        <p>Estrategia sugerida: Mediación asistida</p>
                        <p>Checklist: documentos y pasos inmediatos</p>
                    </div>
                  </div>
                </motion.div>

                <WhatHappensNext />
                </div>
            </motion.div>

            {/* Columna derecha: Flujo conversacional (STICKY) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:sticky lg:top-24"
              ref={formCardRef}
            >
              <div className="relative overflow-hidden bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-rose-500/20 shadow-2xl shadow-pink-500/20 flex flex-col">
                {/* Mango decorativo estilo iOS */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-700 rounded-full" />

                {/* Resumen del producto */}
                <div className="px-8 pt-12 pb-8 text-center border-b border-slate-800/60">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Diagnóstico de Pensión IA
                  </h3>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-slate-500 line-through text-2xl">$13.990</span>
                    <span className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                      $6.990
                    </span>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/15 text-rose-200 text-sm font-medium border border-rose-500/30">
                    50% de descuento - Oferta limitada
                  </div>
                </div>

                {/* Flujo de pasos conversacional */}
                <div className="px-8 py-8 flex-1">
                  <div className="relative min-h-[360px]">
                    <AnimatePresence mode="wait">
                      {/* PASO 0: Selección de Rango de Ingresos */}
                    {currentStep === 0 && (
                      <motion.div
                        key="step-0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full 
                                        flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
                            <DollarSign className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="text-xl font-semibold text-white">
                            Personaliza tu diagnóstico
                          </h4>
                          <p className="text-sm text-slate-400">
                            Selecciona el rango de ingreso mensual de la persona que pagaría la pensión.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {incomeOptions.map((option, index) => {
                            const isSelected = selectedIncomeRange === option.label;
                            return (
                              <motion.button
                                key={option.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setMonthlyIncome(option.value);
                                  setSelectedIncomeRange(option.label);
                                  setIncomeSelectionFeedback(option.label);
                                  setTimeout(() => setIncomeSelectionFeedback(null), 200);
                                  setTimeout(() => {
                                    setLeadSaved(false);
                                    setCurrentStep(1);
                                  }, 220);
                                }}
                                className={`group flex items-center justify-between p-5 rounded-2xl border text-left transition-all relative overflow-hidden
                                         ${isSelected
                                           ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/30'
                                           : 'bg-slate-800/60 border-slate-700/60 hover:border-pink-500/40 hover:bg-slate-800'
                                         }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-rose-500/15 to-transparent"
                                  />
                                )}
                                <div className="relative flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-semibold shadow-md shadow-pink-500/30">
                                    {index + 1}
                                  </div>
                  <div>
                                    <p className="font-semibold text-white">{option.label}</p>
                                    <p className="text-xs text-slate-400">
                                      {isSelected ? 'Seleccionado' : 'Haz click para elegir'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 relative">
                                  <ArrowRight className={`w-5 h-5 transition-colors ${isSelected ? 'text-pink-300' : 'text-slate-500 group-hover:text-pink-400'}`} />
                                  <AnimatePresence mode="popLayout">
                                    {(incomeSelectionFeedback === option.label || isSelected) && (
                                      <motion.div
                                        key={`${option.label}-feedback`}
                                        initial={{ scale: 0.3, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.3, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-center"
                                      >
                                        <CheckCircle className="w-5 h-5 text-pink-300" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>

                        <p className="text-xs text-center text-slate-500">
                          Puedes ajustar este dato en cualquier momento.
                        </p>
                      </motion.div>
                    )}

                      {/* PASO 1: Captura de datos personales */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        layout
                        variants={stepContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                      >
                        <motion.div
                          className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 
                                      rounded-xl p-4 text-center shadow-inner shadow-pink-500/10"
                          variants={stepItemVariants}
                          layout
                        >
                          <CheckCircle className="w-8 h-8 text-pink-300 mx-auto mb-2" />
                          <p className="text-sm text-white">
                            ¡Perfecto! Ahora ingresa tus datos para generar tu diagnóstico 
                            basado en un ingreso de <span className="font-bold text-pink-300">{formatCurrency(monthlyIncome)}</span>.
                          </p>
                          {selectedIncomeRange && (
                            <p className="text-xs text-slate-300 mt-2">
                              Rango seleccionado: <span className="text-white font-medium">{selectedIncomeRange}</span>
                            </p>
                          )}
                        </motion.div>

                        <motion.div className="space-y-4" variants={stepItemVariants} layout>
                          <motion.div variants={stepItemVariants}>
                            <label htmlFor="nombre" className="block text-sm font-medium text-slate-300 mb-2">
                      Tu nombre completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                              disabled={isSavingLead}
                              autoFocus
                              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 
                                       text-white placeholder-slate-500 
                                       focus:outline-none focus:border-pink-500/50 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Juan Pérez"
                    />
                          </motion.div>
                  
                          <motion.div variants={stepItemVariants}>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Tu correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                              disabled={isSavingLead}
                              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 
                                       text-white placeholder-slate-500 
                                       focus:outline-none focus:border-pink-500/50 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="juan@ejemplo.com"
                    />
                          </motion.div>
                        </motion.div>

                        <motion.button
                          onClick={() => {
                            setLeadSaved(false);
                            setCurrentStep(0);
                          }}
                          className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors 
                                   flex items-center justify-center gap-1"
                          variants={stepItemVariants}
                    >
                          <ChevronLeft className="w-3 h-3" />
                          Cambiar rango de ingreso
                        </motion.button>
                      </motion.div>
                    )}

                      {/* PASO 2: Pago Simplificado */}
                    {currentStep === 2 && leadSaved && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Título enfocado */}
                        <div className="text-center mb-6">
                          <h4 className="text-2xl font-bold text-white mb-3">
                            Estás a un paso
                          </h4>
                          <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-5 shadow-inner shadow-pink-500/10">
                            <p className="text-sm text-slate-200">
                              <span className="text-white font-semibold">Hola {formData.nombre}</span>, tu informe personalizado está listo para generarse con un ingreso de:
                            </p>
                            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 mt-2">
                              {formatCurrency(monthlyIncome)}
                            </p>
                            <p className="text-xs text-slate-300 mt-3">
                              Lo enviaremos directamente a <span className="text-white font-medium">{formData.email}</span> en cuanto confirmes tu pago seguro.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                </div>

                {/* BOTÓN DE ACCIÓN UNIFICADO - Siempre en la misma posición */}
                <div className="px-8 pb-8 space-y-4">
                  {renderActionButton()}

                  {currentStep === 0 && (
                    <p className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                      <Sparkles className="h-3.5 w-3.5 text-pink-300" />
                      Este dato nos permite estimar de forma precisa tu rango de pensión.
                    </p>
                  )}

                  {currentStep === 1 && (
                    <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3 text-pink-300" />
                      Tus datos están protegidos con encriptación bancaria.
                    </p>
                  )}

                  {currentStep === 2 && leadSaved && (
                    <>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center text-xs text-rose-300 flex items-center justify-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        Cupos limitados esta semana. Asegura tu diagnóstico ahora.
                      </motion.p>
                      <button
                        onClick={() => {
                          setLeadSaved(false);
                          setCurrentStep(1);
                        }}
                        className="w-full text-center text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1"
                      >
                        <ChevronLeft className="w-3 h-3" />
                        Modificar mis datos
                      </button>
                    </>
                  )}
                </div>

                {/* Garantía & testimonio */}
                <div className="mt-8 px-6 pb-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 shadow-[0_22px_45px_rgba(15,23,42,0.55)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight">
                          Pago seguro con Mercado Pago
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Operamos sobre la pasarela oficial y cifrada de Mercado Pago para resguardar tus datos.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-1.5 text-[11px] text-slate-300">
                      <p>• Recibo emitido automáticamente a tu correo.</p>
                      <p>• 100% devolución si el informe no te entrega claridad útil.</p>
                      <p>• Soporte directo de puntolegal.online en menos de 2 horas hábiles.</p>
                    </div>
                  </div>
                  <SimpleTestimonial />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PagoDiagnosticoIA;
