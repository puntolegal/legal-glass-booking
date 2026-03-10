// RUTA: src/pages/CalculadoraPensionPage.tsx
// Squeeze Page de alta conversión para Meta Ads - Calculadora de Pensión de Alimentos

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, DollarSign, Users, Baby, CheckCircle, Sparkles, ArrowRight, Mail, Shield, ShieldCheck, Scale, Zap, Landmark, AlertTriangle, Star, User, Phone, Lock, Plane, Gavel } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [whatsappValid, setWhatsappValid] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<number | null>(null);
  const [selectedChildren, setSelectedChildren] = useState<number | null>(null);
  const [currentPension, setCurrentPension] = useState<string>(''); // Monto actual que recibe
  const [hidesIncome, setHidesIncome] = useState<boolean | null>(null); // Si sospecha que ocultan ingresos
  const [hasDebt, setHasDebt] = useState<boolean | null>(null); // Si existe deuda acumulada
  const [monthsOwed, setMonthsOwed] = useState<number | null>(null); // Meses de deuda
  const [isRevealed, setIsRevealed] = useState(false); // Estado de revelación de resultados
  const [calculatedRange, setCalculatedRange] = useState<{ 
    min: string; 
    max: string; 
    isEdgeCase: boolean; 
    pisoLegalValue: string 
  } | null>(null);

  // Función para navegar directamente al agendamiento con datos en localStorage
  const handleDirectPayment = () => {
    // Guardar datos en localStorage para el flujo de pago
    const paymentData = {
      plan: 'consulta-estrategica-familia',
      name,
      email,
      whatsapp,
      price: 35000,
      service: 'Asesoría y Gestión de Cobro Inmediato'
    };
    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    navigate('/pago');
  };

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

  // Validación de WhatsApp (formato +569)
  useEffect(() => {
    const whatsappRegex = /^\+569\d{8}$/;
    const isValid = whatsappRegex.test(whatsapp.replace(/\s/g, ''));
    setWhatsappValid(isValid);
  }, [whatsapp]);

  // Guardado silencioso de datos completos (Ninja Lead) - Mejorado con retry
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailValid(isValid);
    
    // Solo guardar si tenemos email válido, nombre y whatsapp válido
    if (isValid && name.trim() && whatsappValid && !emailSaved) {
      const timeoutId = setTimeout(async () => {
        try {
          const quizData = {
            email: email,
            name: name.trim(),
            quiz_answers: {
              source: 'calculadora_pension',
              nombre: name.trim(),
              whatsapp: whatsapp.replace(/\s/g, ''),
              email: email
            },
            plan_recommended: null,
            status: 'calculadora_iniciada'
          };
          
          const { data, error } = await supabase
            .from('leads_quiz')
            .insert([quizData])
            .select();
          
          if (!error) {
            setEmailSaved(true);
            console.log('✅ Lead guardado silenciosamente:', { email, name, whatsapp }, data);
            
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
            console.error('❌ Error guardando lead en Supabase:', { error, email, name, whatsapp });
            
            // Retry una vez después de 2 segundos
            setTimeout(async () => {
              const { data: retryData, error: retryError } = await supabase
                .from('leads_quiz')
                .insert([quizData])
                .select();
              
              if (!retryError) {
                setEmailSaved(true);
                console.log('✅ Lead guardado en retry:', retryData);
              }
            }, 2000);
          }
        } catch (error) {
          console.error('❌ Excepción al guardar lead:', error);
          
          // Guardar en localStorage como fallback
          try {
            const pendingLeads = JSON.parse(localStorage.getItem('pendingCalculadoraLeads') || '[]');
            pendingLeads.push({ 
              email, 
              name: name.trim(), 
              whatsapp: whatsapp.replace(/\s/g, ''),
              timestamp: Date.now(), 
              quizData: { source: 'calculadora_pension' } 
            });
            localStorage.setItem('pendingCalculadoraLeads', JSON.stringify(pendingLeads));
            console.log('💾 Lead guardado en localStorage como fallback:', { email, name, whatsapp });
          } catch (e) {
            console.error('❌ Error guardando en localStorage:', e);
          }
        }
      }, 1000); // Debounce de 1 segundo
      
      return () => clearTimeout(timeoutId);
    }
  }, [email, name, whatsapp, whatsappValid, emailSaved]);

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

  // Calcular rango cuando se seleccionan los valores base y se responde si hay deuda
  useEffect(() => {
    const isBaseReady = selectedIncome !== null && selectedChildren !== null && currentPension !== '' && hidesIncome !== null;
    const isDebtReady = hasDebt === false || (hasDebt === true && monthsOwed !== null && monthsOwed > 0);
    const isReadyToCalculate = isBaseReady && isDebtReady;
    
    if (isReadyToCalculate) {
      const range = calculatePensionRange(selectedIncome, selectedChildren);
      if (range) {
        setCalculatedRange(range);
      }
    } else {
      setCalculatedRange(null);
    }
  }, [selectedIncome, selectedChildren, currentPension, hidesIncome, hasDebt, monthsOwed]);

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
          const quizAnswers = { 
            source: 'calculadora_pension',
            nombre: name.trim(),
            whatsapp: whatsapp.replace(/\s/g, ''),
            email: email,
            ingreso_demandado: selectedIncome,
            cantidad_hijos: selectedChildren,
            anomalia_legal: calculatedRange.isEdgeCase,
            pension_actual: currentPension,
            oculta_ingresos: hidesIncome,
            tiene_deuda: hasDebt,
            meses_deuda: monthsOwed
          };
          
          const { data, error, status } = await supabase
            .from('leads_quiz')
            .update({
              quiz_answers: quizAnswers as any, // Type assertion para JSONB
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
  }, [calculatedRange, email, emailValid, emailSaved, selectedIncome, selectedChildren, currentPension, hidesIncome, hasDebt, monthsOwed, name, whatsapp]);

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
          {/* Hero/Título - SEO y Lenguaje Humano */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 mb-6 border border-white/10 shadow-lg">
              <Scale className="w-4 h-4 text-pink-400" />
              <span className="text-xs md:text-sm font-semibold text-slate-200">Plataforma Legal Especializada 2026</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Cálculo y Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Pensión de Alimentos</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
              Descubre al instante cuánto te corresponde por ley. Calcula tu deuda impaga y activa la retención de fondos y medidas de apremio sin lidiar con la burocracia.
            </p>
          </motion.div>

          {/* Formulario - 4 Pasos en la misma pantalla */}
          <div className="max-w-2xl mx-auto space-y-5 md:space-y-6">
            {/* Paso 1: Datos de Contacto - iOS Glassmorphism */}
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
                <h2 className="text-xl font-semibold text-white/95">Tus datos de contacto</h2>
              </div>
              
              <div className="space-y-4">
                {/* Nombre */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className={`w-5 h-5 transition-colors ${name.trim() ? 'text-pink-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all text-base"
                    autoComplete="name"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className={`w-5 h-5 transition-colors ${emailValid ? 'text-pink-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      setEmailValid(emailRegex.test(e.target.value));
                    }}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all text-base"
                    autoComplete="email"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>

                {/* WhatsApp */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Phone className={`w-5 h-5 transition-colors ${whatsappValid ? 'text-pink-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="tel"
                    name="tel"
                    id="tel"
                    value={whatsapp}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^\d+]/g, '');
                      if (val.startsWith('569')) val = '+' + val;
                      if (val.startsWith('9') && val.length === 9) val = '+56' + val;
                      if (!val.startsWith('+569') && val.length >= 8) val = '+569' + val.slice(-8);
                      setWhatsapp(val);
                    }}
                    placeholder="+56912345678"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all text-base"
                    autoComplete="tel"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Paso 2: Rango de Ingresos - iOS Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all ${
                !(emailValid && name.trim() && whatsappValid) ? 'opacity-40' : ''
              }`}
              style={{
                background: (emailValid && name.trim() && whatsappValid)
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
                  <span className={`text-lg font-semibold transition-colors ${(emailValid && name.trim() && whatsappValid) ? 'text-white/90' : 'text-slate-500'}`}>2</span>
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
                      whileHover={(emailValid && name.trim() && whatsappValid) ? { y: -2 } : {}}
                      whileTap={(emailValid && name.trim() && whatsappValid) ? { y: 0 } : {}}
                      className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                        isSelected
                          ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      } ${!emailValid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        boxShadow: isSelected 
                          ? '0 4px 16px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div className={`p-2.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-pink-500/20'
                          : 'bg-white/5'
                      }`}>
                        <Icon className={`w-5 h-5 transition-colors ${isSelected ? 'text-pink-400' : 'text-slate-400'}`} />
                      </div>
                      <span className={`font-medium flex-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </span>
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
                !(emailValid && name.trim() && whatsappValid) ? 'opacity-40' : ''
              }`}
              style={{
                background: (emailValid && name.trim() && whatsappValid)
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
                      whileHover={(emailValid && name.trim() && whatsappValid) ? { y: -2 } : {}}
                      whileTap={(emailValid && name.trim() && whatsappValid) ? { y: 0 } : {}}
                      className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-3 ${
                        isSelected
                          ? 'border-sky-500/50 bg-sky-500/10 shadow-lg shadow-sky-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      } ${!emailValid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        boxShadow: isSelected 
                          ? '0 4px 16px rgba(14, 165, 233, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div className={`p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-sky-500/20'
                          : 'bg-white/5'
                      }`}>
                        <Icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                      </div>
                      <span className={`font-medium text-sm transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Paso 4: Monto Actual - iOS Glassmorphism */}
            {selectedIncome !== null && selectedChildren !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all ${
                  !(emailValid && name.trim() && whatsappValid) ? 'opacity-40' : ''
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
                    <span className={`text-lg font-semibold transition-colors ${emailValid ? 'text-white/90' : 'text-slate-500'}`}>4</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white/95">¿Cuánto recibes actualmente de pensión?</h2>
                </div>
                
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <DollarSign className={`w-5 h-5 transition-colors ${currentPension ? 'text-pink-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={currentPension}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value === '') {
                        setCurrentPension('');
                      } else {
                        const formatted = new Intl.NumberFormat('es-CL', {
                          style: 'currency',
                          currency: 'CLP',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(parseInt(value));
                        setCurrentPension(formatted);
                      }
                    }}
                    placeholder="$0"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all text-base"
                    disabled={!(emailValid && name.trim() && whatsappValid)}
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Si recibes $0, escribe 0. Este dato es confidencial.
                </p>
              </motion.div>
            )}

            {/* Paso 5: Micro-compromiso/Agitación - iOS Glassmorphism */}
            {selectedIncome !== null && selectedChildren !== null && currentPension !== '' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                    <span className="text-lg font-semibold text-white/90">5</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white/95">¿Sospechas que el demandado oculta sus ingresos reales, trabaja en negro o se atrasa en los pagos?</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setHidesIncome(true)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${
                      hidesIncome === true
                        ? 'border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hidesIncome === true 
                        ? '0 4px 16px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <AlertTriangle className={`w-5 h-5 transition-colors ${hidesIncome === true ? 'text-rose-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hidesIncome === true ? 'text-white' : 'text-slate-300'}`}>
                      Sí, lo sospecho
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setHidesIncome(false)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${
                      hidesIncome === false
                        ? 'border-sky-500/50 bg-sky-500/10 shadow-lg shadow-sky-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hidesIncome === false 
                        ? '0 4px 16px rgba(14, 165, 233, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <ShieldCheck className={`w-5 h-5 transition-colors ${hidesIncome === false ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hidesIncome === false ? 'text-white' : 'text-slate-300'}`}>
                      No
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Paso 6: Deuda Acumulada - iOS Glassmorphism */}
            {selectedIncome !== null && selectedChildren !== null && currentPension !== '' && hidesIncome !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                    <span className="text-lg font-semibold text-white/90">6</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white/95">¿Existe deuda acumulada o atrasos en los pagos?</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <motion.button
                    onClick={() => setHasDebt(true)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${
                      hasDebt === true
                        ? 'border-rose-500/50 bg-rose-500/10 shadow-lg shadow-rose-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hasDebt === true 
                        ? '0 4px 16px rgba(244, 63, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <AlertTriangle className={`w-5 h-5 transition-colors ${hasDebt === true ? 'text-rose-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hasDebt === true ? 'text-white' : 'text-slate-300'}`}>
                      Sí, me debe meses
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setHasDebt(false);
                      setMonthsOwed(null);
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${
                      hasDebt === false
                        ? 'border-sky-500/50 bg-sky-500/10 shadow-lg shadow-sky-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hasDebt === false 
                        ? '0 4px 16px rgba(14, 165, 233, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <ShieldCheck className={`w-5 h-5 transition-colors ${hasDebt === false ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hasDebt === false ? 'text-white' : 'text-slate-300'}`}>
                      No, está al día pero quiero demandar/aumentar
                    </span>
                  </motion.button>
                </div>

                {/* Input condicional para meses de deuda */}
                {hasDebt === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <label className="block text-sm text-slate-300 mb-2">Aprox, ¿cuántos meses?</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={monthsOwed || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || null;
                        if (value === null || (value >= 1 && value <= 120)) {
                          setMonthsOwed(value);
                        }
                      }}
                      placeholder="Ej: 6"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all text-base"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Botón de Revelación - Solo se muestra cuando está listo para calcular pero no revelado */}
            {(() => {
              const isReadyToCalculate = 
                selectedIncome !== null && 
                selectedChildren !== null && 
                currentPension !== '' && 
                hidesIncome !== null && 
                hasDebt !== null && 
                (hasDebt === false || (hasDebt === true && monthsOwed !== null && monthsOwed > 0));
              
              return calculatedRange && !isRevealed && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="pt-4 pb-8"
                >
                  <button
                    onClick={() => {
                      setIsRevealed(true);
                      setTimeout(() => {
                        const target = document.getElementById('resultado-pension');
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                    className="w-full bg-slate-100 hover:bg-white text-slate-900 font-extrabold text-lg py-5 px-6 rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <Lock className="w-6 h-6" />
                    GENERAR DIAGNÓSTICO LEGAL
                  </button>
                </motion.div>
              );
            })()}

            {/* Dashboard Legal Consolidado - iOS Glassmorphism Puro con Colores Atractivos */}
            {calculatedRange && isRevealed && (
              <motion.div
                id="resultado-pension"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] mt-8 overflow-hidden relative"
              >
                {/* Efecto de luz de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Cabecera */}
                <div className="text-center mb-8 pb-6 border-b border-white/5 relative z-10">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Tu Diagnóstico Legal 2026
                  </p>
                  <h3 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-2">
                    <AnimatedCounter value={calculatedRange.max} />
                  </h3>
                  <p className="text-slate-400 text-sm">Lo que la ley chilena indica que deberías recibir al mes.</p>
                </div>

                {/* Grid de Matemática del Dolor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
                  {currentPension && (() => {
                    const currentPensionNum = parseInt(currentPension.replace(/\D/g, '')) || 0;
                    const maxPensionNum = parseInt(calculatedRange.max.replace(/\D/g, '')) || 0;
                    const monthlyLoss = Math.max(0, maxPensionNum - currentPensionNum);
                    const formattedLoss = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(monthlyLoss);
                    
                    return monthlyLoss > 0 ? (
                      <div className="bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 rounded-2xl p-5">
                        <p className="text-slate-300 text-sm mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-400" /> Dinero mensual que pierdes:</p>
                        <p className="text-2xl font-bold text-white mb-1">{formattedLoss}</p>
                        <p className="text-slate-500 text-[11px]">Diferencia con lo que deberías recibir hoy.</p>
                      </div>
                    ) : null;
                  })()}
                  {hasDebt && monthsOwed && monthsOwed > 0 && (() => {
                    // LA DEUDA REAL: Pensión fijada actualmente * meses de atraso
                    const currentPensionNum = parseInt(currentPension.replace(/\D/g, '')) || 0;
                    const totalDebt = currentPensionNum * monthsOwed;
                    
                    // Si la pensión actual es 0 (no tiene regulada pero dice que le deben), usamos el mínimo legal como base de cálculo estimado.
                    const minPensionNum = parseInt(calculatedRange.min.replace(/\D/g, '')) || 0;
                    const finalDebt = totalDebt > 0 ? totalDebt : (minPensionNum * monthsOwed);
                    const formattedTotalDebt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(finalDebt);
                    
                    return (
                      <div className="bg-gradient-to-br from-blue-600/15 to-transparent border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                        <p className="text-blue-200 text-sm font-semibold mb-1">Deuda histórica acumulada:</p>
                        <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                          <AnimatedCounter value={formattedTotalDebt} delay={0.3} />
                        </p>
                        <p className="text-blue-300/60 text-[11px]">Cálculo estimado en base a {monthsOwed} meses de atraso.</p>
                      </div>
                    );
                  })()}
                  
                  {/* Frase de Impacto - Advertencia Letal */}
                  <div className="mt-4 mb-2 text-center col-span-full">
                    <p className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-4 py-2 rounded-full backdrop-blur-md">
                      ⚠️ <strong className="text-blue-200">Importante:</strong> La ley no es retroactiva. El dinero que no cobras hoy, se pierde para siempre.
                    </p>
                  </div>
                </div>

                {/* Dashboard de Pago - Estilo Checkout Premium */}
                <div className="mt-10 relative z-10">
                  <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 md:p-10 shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
                    
                    {hasDebt && monthsOwed && monthsOwed > 0 ? (() => {
                      const currentPensionNum = parseInt(currentPension.replace(/\D/g, '')) || 0;
                      const minPensionNum = parseInt(calculatedRange.min.replace(/\D/g, '')) || 0;
                      const totalDebt = currentPensionNum > 0 ? (currentPensionNum * monthsOwed) : (minPensionNum * monthsOwed);
                      const formattedTotalDebt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(totalDebt);
                      
                      return (
                        <div className="mb-8">
                          <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {name ? `${name.split(' ')[0]}, r` : 'R'}ecupera tus <span className="text-pink-400">{formattedTotalDebt}</span> hoy.
                          </h4>
                          <p className="text-slate-400 text-base max-w-lg mx-auto">
                            No esperes meses en el sistema público. Delega el cobro en nuestro estudio y activamos <strong className="text-slate-200">arresto, arraigo nacional y retención de fondos</strong> en menos de 24 horas.
                          </p>
                        </div>
                      );
                    })() : (
                      <div className="mb-8">
                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">
                          {name ? `${name.split(' ')[0]}, a` : 'A'}segura tu futuro y el de tus hijos.
                        </h4>
                        <p className="text-slate-400 text-base max-w-lg mx-auto">
                          Da inicio a tu demanda de pensión. Trazamos tu estrategia y redactamos la solicitud directo para el tribunal con montos de la nueva ley.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-col items-center bg-slate-900/50 rounded-3xl p-6 border border-slate-800/50 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-sm text-slate-500 line-through font-medium">$70.000</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 bg-pink-400/10 px-2 py-1 rounded-full border border-pink-400/20">
                          Cupo Cyber Activado
                        </span>
                      </div>
                      <div className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        $35.000
                      </div>
                      <motion.button
                        onClick={handleDirectPayment}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 text-white font-extrabold text-lg py-4 rounded-xl shadow-[0_15px_40px_rgba(226,29,72,0.4)] flex justify-center items-center gap-2 transition-all"
                      >
                        {hasDebt && monthsOwed > 0 ? "INICIAR COBRO AHORA" : "INICIAR DEMANDA AHORA"}
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                      
                      <div className="flex items-center justify-center gap-4 mt-5 text-xs text-slate-500 font-medium uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Pago Seguro</span>
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Prioridad Inmediata</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonios iOS Premium */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 relative z-10">
                  {[
                    { n: "María José H.", l: "Las Condes", t: "Logré cobrar los $8.000.000 que me debían hace años. Fueron implacables con las cuentas del banco." },
                    { n: "Daniela T.", l: "La Florida", t: "Demandé y en semanas ordenaron la retención. Excelente gestión para no pelear con la página del gobierno." }
                  ].map((test, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{test.n}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{test.l}</p>
                        </div>
                        <div className="flex gap-0.5 text-amber-400">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">"{test.t}"</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Secundario - Enlace de texto */}
            {calculatedRange && isRevealed && (
              <div className="text-center mt-6">
                <a href="https://wa.me/56962321883?text=Hola,%20tengo%20dudas%20sobre%20mi%20c%C3%A1lculo%20de%20pensi%C3%B3n/deuda%20en%20Punto%20Legal." target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4 decoration-slate-700 hover:decoration-slate-400">
                  Tengo dudas sobre mi caso particular. Contactar por WhatsApp.
                </a>
              </div>
            )}

            {/* Tarjeta de Urgencia - Registro de Deudores (Solo si no hay resultado calculado) */}
            {!calculatedRange && (
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
            )}
          </div>
        </main>

        {/* Botón Flotante de Contacto WhatsApp */}
        <a
          href="https://wa.me/56962321883?text=Hola,%20necesito%20ayuda%20urgente%20con%20mi%20caso%20de%20familia."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3"
        >
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 px-4 py-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold shadow-2xl flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Habla con un Asesor Legal
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.5)] flex items-center justify-center transition-transform group-hover:scale-110 border border-emerald-300/50">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
        </a>
      </div>
    </>
  );
};

export default CalculadoraPensionPage;
