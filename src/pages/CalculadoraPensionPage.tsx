// RUTA: src/pages/CalculadoraPensionPage.tsx
// Squeeze Page de alta conversión para Meta Ads - Calculadora de Pensión de Alimentos

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, DollarSign, Users, Baby, CheckCircle, Sparkles, ArrowRight, Mail, Shield, ShieldCheck, Scale, Zap, Landmark, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { trackMetaEvent } from '@/services/metaConversionsService';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

// Componente de contador animado (reutilizado de QuizModal)
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

// Constantes Jurídicas 2026
const IMM_2026 = 539000;
const CANASTA_CRIANZA_2026 = 594883; // Costo promedio por hijo

const CalculadoraPensionPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<number | null>(null);
  const [selectedChildren, setSelectedChildren] = useState<number | null>(null);
  const [calculatedRange, setCalculatedRange] = useState<{ 
    min: string; 
    max: string; 
    isEdgeCase: boolean; 
    pisoLegalValue: string 
  } | null>(null);

  // Tracking Meta - ViewContent al cargar
  useEffect(() => {
    trackMetaEvent({
      event_name: 'ViewContent',
      custom_data: {
        content_name: 'Calculadora Pensión de Alimentos',
        content_category: 'Herramienta Legal',
        content_ids: ['calculadora-pension-2026']
      }
    });
  }, []);

  // Guardado silencioso de email (Ninja Lead) - Mejorado con retry y mejor manejo de errores
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailValid(isValid);
    
    if (isValid && !emailSaved) {
      const timeoutId = setTimeout(async () => {
        try {
          // Payload exacto que coincide con los nombres de las columnas
          const quizData = {
            email: email,
            name: 'Calculadora Pensión Lead', // Opcional ahora (columna nullable)
            quiz_answers: JSON.stringify({ source: 'calculadora_pension' }),
            plan_recommended: null,
            status: 'calculadora_iniciada'
          };
          
          const { data, error, status, statusText } = await supabase
            .from('leads_quiz')
            .insert([quizData])
            .select();
          
          if (!error) {
            setEmailSaved(true);
            console.log('✅ Email guardado silenciosamente:', email, data);
            
            // Tracking Meta - Lead event
            trackMetaEvent({
              event_name: 'Lead',
              user_data: {
                em: email
              },
              custom_data: {
                content_name: 'Calculadora Pensión de Alimentos',
                content_category: 'Lead Capture',
                value: 0,
                currency: 'CLP'
              }
            });
          } else {
            // Log detallado del error para debugging
            console.error('❌ Error guardando email en Supabase:', {
              error,
              status,
              statusText,
              code: error?.code,
              message: error?.message,
              details: error?.details,
              hint: error?.hint,
              email,
              quizData
            });
            
            // Retry una vez después de 2 segundos
            setTimeout(async () => {
              const { data: retryData, error: retryError, status: retryStatus } = await supabase
                .from('leads_quiz')
                .insert([quizData])
                .select();
              
              if (!retryError) {
                setEmailSaved(true);
                console.log('✅ Email guardado en retry:', email, retryData);
              } else {
                console.error('❌ Error en retry:', {
                  retryError,
                  retryStatus,
                  code: retryError?.code,
                  message: retryError?.message,
                  details: retryError?.details
                });
              }
            }, 2000);
          }
        } catch (error) {
          // Manejo de errores mejorado con detalles completos
          console.error('❌ Excepción al guardar email:', {
            error,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            email
          });
          
          // Guardar en localStorage como fallback
          try {
            const pendingLeads = JSON.parse(localStorage.getItem('pendingCalculadoraLeads') || '[]');
            pendingLeads.push({ email, timestamp: Date.now(), quizData: { source: 'calculadora_pension' } });
            localStorage.setItem('pendingCalculadoraLeads', JSON.stringify(pendingLeads));
            console.log('💾 Email guardado en localStorage como fallback:', email);
          } catch (e) {
            console.error('❌ Error guardando en localStorage:', e);
          }
        }
      }, 300); // Debounce de 300ms para captura rápida
      
      return () => clearTimeout(timeoutId);
    }
  }, [email, emailSaved]);

  // Opciones de ingresos
  const incomeOptions = [
    { label: 'Menos de $800.000', value: 600000, icon: DollarSign },
    { label: '$800.000 - $1.5M', value: 1150000, icon: DollarSign },
    { label: '$1.5M - $3M', value: 2250000, icon: DollarSign },
    { label: 'Más de $3M', value: 4000000, icon: DollarSign }
  ];

  // Opciones de hijos
  const childrenOptions = [
    { label: '1 hijo', value: 1, icon: Baby },
    { label: '2 hijos', value: 2, icon: Users },
    { label: '3 o más hijos', value: 3, icon: Users }
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

  // Función para calcular rango de pensión - Ley 14.908 y Canasta de Crianza 2026
  const calculatePensionRange = (incomeDemandado: number | null, children: number | null) => {
    if (incomeDemandado === null || children === null) return null;
    
    // Si selecciona "Menos de 800k", usamos el IMM por presunción legal si es muy bajo
    const I_demandado = Math.max(incomeDemandado, IMM_2026);
    
    // Asumimos ingresos del custodio similares al mínimo para el cálculo de prorrata (para no pedir más datos y mantener la conversión alta)
    const I_custodio = IMM_2026;
    
    // Gastos totales presuntos según Canasta del Estado
    const G_total = CANASTA_CRIANZA_2026 * children;
    
    // Hito 1: Piso Legal Irreductible
    const pisoLegal = children === 1
      ? 0.40 * IMM_2026
      : children * (0.30 * IMM_2026);
    
    // Hito 2: Techo de Endeudamiento (50% de ingresos)
    const techoLegal = 0.50 * I_demandado;
    
    // Hito 3: Ecuación de Equidad Proporcional
    const prorrata = G_total * (I_demandado / (I_demandado + I_custodio));
    
    // Árbol de decisión
    let outputMin = Math.min(Math.max(prorrata, pisoLegal), techoLegal);
    let outputMax = techoLegal;
    
    // Manejo del colapso insoluble (Piso > Techo)
    let isEdgeCase = false;
    if (pisoLegal > techoLegal) {
      outputMin = techoLegal;
      outputMax = techoLegal;
      isEdgeCase = true;
    }
    
    return {
      min: formatCurrency(outputMin),
      max: formatCurrency(outputMax),
      isEdgeCase,
      pisoLegalValue: formatCurrency(pisoLegal)
    };
  };

  // Calcular rango cuando se seleccionan ambos valores
  useEffect(() => {
    if (selectedIncome !== null && selectedChildren !== null) {
      const range = calculatePensionRange(selectedIncome, selectedChildren);
      if (range) {
        setCalculatedRange(range);
        
        // Auto-scroll inteligente al resultado después de 150ms
        setTimeout(() => {
          const resultElement = document.getElementById('resultado-pension');
          const whatsappButton = document.getElementById('whatsapp-cta');
          
          if (resultElement) {
            resultElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          } else if (whatsappButton) {
            whatsappButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }, 150);
      }
    } else {
      setCalculatedRange(null);
    }
  }, [selectedIncome, selectedChildren]);

  // URL de WhatsApp dinámica
  // TODO: Reemplazar 569XXXXXXXX con el número de WhatsApp real de Punto Legal
  const WHATSAPP_NUMBER = '56962321883'; // Cambiar este número según corresponda
  const whatsappUrl = useMemo(() => {
    if (!calculatedRange || selectedChildren === null) return '';
    const message = `Hola, acabo de usar la calculadora de Punto Legal. Para ${selectedChildren} hijo(s), el monto estimado por ley es entre ${calculatedRange.min} y ${calculatedRange.max}. Quiero saber cómo exigir esto.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [calculatedRange, selectedChildren]);

  // Actualización silenciosa del Lead con los datos del cálculo
  useEffect(() => {
    if (calculatedRange && emailValid && emailSaved) {
      const updateLeadData = async () => {
        try {
          const quizAnswers = JSON.stringify({ 
            source: 'calculadora_pension',
            ingreso_demandado: selectedIncome,
            cantidad_hijos: selectedChildren,
            anomalia_legal: calculatedRange.isEdgeCase
          });
          
          const { data, error, status } = await supabase
            .from('leads_quiz')
            .update({
              quiz_answers: quizAnswers,
              income_value: selectedIncome,
              children_count: selectedChildren,
              calculated_min: calculatedRange.min,
              calculated_max: calculatedRange.max,
              status: 'calculo_completado'
            })
            .eq('email', email)
            .in('status', ['calculadora_iniciada', 'calculo_completado']) // Permite sobreescribir si el usuario recalcula
            .select();
          
          if (!error) {
            console.log('✅ Lead actualizado con datos del cálculo:', data);
          } else {
            console.error('❌ Error actualizando los datos del lead:', {
              error,
              status,
              code: error?.code,
              message: error?.message,
              details: error?.details,
              hint: error?.hint,
              email,
              selectedIncome,
              selectedChildren
            });
          }
        } catch (error) {
          console.error('❌ Excepción al actualizar lead:', {
            error,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            email
          });
        }
      };
      
      updateLeadData();
    }
  }, [calculatedRange, email, emailValid, emailSaved, selectedIncome, selectedChildren]);

  return (
    <>
      <SEO 
        title="Calculadora de Pensión de Alimentos 2026 - Punto Legal"
        description="Descubre cuánto te corresponde por ley en 30 segundos. Calculadora gratuita de pensión de alimentos actualizada 2026."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header Simple - Solo Logo - iOS Style */}
        <header className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-2xl border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                <Shield className="w-5 h-5 text-white/90" />
              </div>
              <span className="text-xl font-semibold text-white/95 tracking-tight">Punto Legal</span>
            </Link>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* Hero/Título - iOS Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight leading-tight">
              Calculadora de Pensión de Alimentos 2026
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Descubre cuánto te corresponde por ley en 30 segundos
            </p>
            
            {/* Trust Badges - iOS Style */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-10 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-white/90">100% Confidencial</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-medium text-white/90">Ley 14.908</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-medium text-white/90">Cálculo Inmediato</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Formulario - 4 Pasos en la misma pantalla */}
          <div className="max-w-2xl mx-auto space-y-5 md:space-y-6">
            {/* Paso 1: Email First - iOS Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                  <span className="text-lg font-semibold text-white/90">1</span>
                </div>
                <h2 className="text-xl font-semibold text-white/95">Tu correo electrónico</h2>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className={`w-5 h-5 transition-colors ${emailValid ? 'text-blue-400' : 'text-slate-500'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    setEmailValid(emailRegex.test(e.target.value));
                  }}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-base"
                  autoComplete="email"
                  style={{
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
                {emailValid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </motion.div>
                )}
              </div>
              {emailSaved && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-500/20 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-xs text-blue-300 font-medium">Email guardado de forma segura</span>
                </motion.div>
              )}
              {email && !emailValid && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-slate-500 mt-2"
                >
                  Ingresa un email válido para continuar
                </motion.p>
              )}
            </motion.div>

            {/* Paso 2: Rango de Ingresos - iOS Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all ${
                !emailValid ? 'opacity-40' : ''
              }`}
              style={{
                background: emailValid 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 backdrop-blur-xl rounded-2xl flex items-center justify-center border transition-all ${
                  emailValid 
                    ? 'bg-white/10 border-white/10' 
                    : 'bg-white/5 border-white/5'
                }`}>
                  <span className={`text-lg font-semibold transition-colors ${emailValid ? 'text-white/90' : 'text-slate-500'}`}>2</span>
                </div>
                <h2 className="text-xl font-semibold text-white/95">Ingresos del demandado</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incomeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedIncome === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => {
                        if (!emailValid) {
                          toast.error('Por favor ingresa tu correo primero para habilitar estas opciones.');
                          return;
                        }
                        setSelectedIncome(option.value);
                      }}
                      whileHover={emailValid ? { scale: 1.01, y: -2 } : {}}
                      whileTap={emailValid ? { scale: 0.99 } : { scale: 0.97 }}
                      className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      } ${!emailValid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        boxShadow: isSelected 
                          ? '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div className={`p-2.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-blue-500/20'
                          : 'bg-white/5'
                      }`}>
                        <Icon className={`w-5 h-5 transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      </div>
                      <span className={`font-medium flex-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Paso 3: Cantidad de Hijos - iOS Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all ${
                !emailValid ? 'opacity-40' : ''
              }`}
              style={{
                background: emailValid 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 backdrop-blur-xl rounded-2xl flex items-center justify-center border transition-all ${
                  emailValid 
                    ? 'bg-white/10 border-white/10' 
                    : 'bg-white/5 border-white/5'
                }`}>
                  <span className={`text-lg font-semibold transition-colors ${emailValid ? 'text-white/90' : 'text-slate-500'}`}>3</span>
                </div>
                <h2 className="text-xl font-semibold text-white/95">Cantidad de hijos</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {childrenOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedChildren === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => {
                        if (!emailValid) {
                          toast.error('Por favor ingresa tu correo primero para habilitar estas opciones.');
                          return;
                        }
                        setSelectedChildren(option.value);
                      }}
                      whileHover={emailValid ? { scale: 1.02, y: -2 } : {}}
                      whileTap={emailValid ? { scale: 0.98 } : { scale: 0.97 }}
                      className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-3 ${
                        isSelected
                          ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      } ${!emailValid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        boxShadow: isSelected 
                          ? '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div className={`p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-blue-500/20'
                          : 'bg-white/5'
                      }`}>
                        <Icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      </div>
                      <span className={`font-medium text-sm transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Paso 4: Resultado con números GIGANTES - iOS Glassmorphism Premium */}
            {calculatedRange && (
              <motion.div
                id="resultado-pension"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }}
              >
                {/* Efecto de brillo sutil */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl" />
                
                <div className="relative text-center">
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                      <DollarSign className="w-7 h-7 text-white/90" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white/95 tracking-tight">
                      Tu Pensión Estimada
                    </h3>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 mb-6 border border-white/10"
                    style={{
                      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {calculatedRange.min === calculatedRange.max ? (
                      <>
                        <p className="text-sm text-slate-400 mb-6 font-medium">Estimación mensual</p>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="text-center"
                      >
                        <p className="text-xs text-rose-400 mb-3 uppercase tracking-wider font-bold flex items-center justify-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Tope Máximo por Ley (50%)
                        </p>
                        <p className="text-5xl md:text-6xl font-semibold text-white/95 tracking-tight">
                          <AnimatedCounter value={calculatedRange.max} />
                        </p>
                        <p className="text-xs text-slate-500 mt-6 font-medium">CLP mensuales</p>
                      </motion.div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-slate-400 mb-6 font-medium">Estimación mensual</p>
                        <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                          className="text-center"
                        >
                          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Mínimo</p>
                          <p className="text-5xl md:text-6xl font-semibold text-white/95 tracking-tight">
                            <AnimatedCounter value={calculatedRange.min} />
                          </p>
                        </motion.div>
                        
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-4xl text-slate-600"
                        >
                          —
                        </motion.span>
                        
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
                          className="text-center"
                        >
                          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Máximo</p>
                          <p className="text-5xl md:text-6xl font-semibold text-white/95 tracking-tight">
                            <AnimatedCounter value={calculatedRange.max} delay={0.3} />
                          </p>
                        </motion.div>
                        </div>
                        <p className="text-xs text-slate-500 mt-6 font-medium">CLP mensuales</p>
                      </>
                    )}
                  </div>

                  {/* Alerta de Anomalía Legal */}
                  {calculatedRange.isEdgeCase && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.4 }}
                      className="mt-4 bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-xl p-4 text-left flex items-start gap-3"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-amber-200 mb-1">Anomalía Legal Detectada</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          El mínimo exigido por ley ({calculatedRange.pisoLegalValue}) supera el 50% de los ingresos del demandado. Un juez limitará la pensión al monto mostrado, pero esto generará una deuda automática, activando retenciones de AFP y arraigo nacional.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Disclaimer - iOS Style */}
                  <div className="flex items-start gap-3 text-xs text-slate-400 mb-0 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/5">
                    <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400/60" />
                    <p className="leading-relaxed text-left">
                      <span className="text-slate-300 font-medium">Importante:</span> Este es un rango estimado 
                      para fines informativos. Tu caso real puede variar según factores específicos de la ley chilena.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA de WhatsApp - Estilo Notificación iOS Premium - Inmediatamente después del resultado */}
            {calculatedRange && (
              <motion.div
                id="whatsapp-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-4 px-6 py-4 rounded-2xl font-medium text-white transition-all overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, rgba(37, 211, 102, 0.15) 0%, rgba(37, 211, 102, 0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    boxShadow: '0 8px 32px rgba(37, 211, 102, 0.15)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-base font-semibold leading-none">Hablar con un Abogado</span>
                      <span className="text-xs text-[#25D366] font-medium mt-1">Línea directa WhatsApp</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 relative z-10 group-hover:text-white transition-colors group-hover:translate-x-1" />
                </motion.a>
              </motion.div>
            )}

            {/* Tarjeta de Respaldo Legal - Glassmorphism Sutil - Movida al final */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <Landmark className="w-5 h-5 text-slate-400 mb-3" />
              <p className="italic text-sm text-slate-400 leading-relaxed mb-3">
                La pensión de alimentos es un derecho irrenunciable. Por ley, el tribunal no podrá fijar un monto inferior al 40% del ingreso mínimo para un hijo, ni menor al 30% por cada uno si son dos o más.
              </p>
              <p className="text-xs font-medium text-slate-500 mt-2">
                - Art. 3, Ley 14.908 sobre Abandono de Familia.
              </p>
            </motion.div>

            {/* Tarjeta de Urgencia - Registro de Deudores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative bg-rose-500/[0.02] backdrop-blur-xl border border-rose-500/20 rounded-2xl p-6"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">¿Deuda acumulada?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Con la nueva ley, el <strong className="text-rose-300">Registro Nacional de Deudores</strong> permite retener devoluciones de impuestos, fondos bancarios y suspender licencias a quienes no paguen. No dejes pasar más tiempo.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CalculadoraPensionPage;
