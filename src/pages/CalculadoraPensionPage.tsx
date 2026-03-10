// RUTA: src/pages/CalculadoraPensionPage.tsx
// Squeeze Page de alta conversión para Meta Ads - Calculadora de Pensión de Alimentos

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, DollarSign, Users, Baby, Sparkles, Mail, Shield, ShieldCheck, Scale, Zap, Landmark, AlertTriangle, Star, User, Phone, Lock, Gavel, TrendingDown, CheckCircle, ArrowRight, Heart, PiggyBank, FileText } from 'lucide-react';
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

interface TerminalLinesProps {
  name: string;
  legalMatter: string | null;
  selectedIncome: number | null;
  selectedChildren: number | null;
  monthsOwed: number | null;
  isVipProfile: boolean;
}

const TerminalLines: React.FC<TerminalLinesProps> = ({
  name, legalMatter, selectedIncome, selectedChildren, monthsOwed, isVipProfile
}) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const incomeLabel = selectedIncome
    ? selectedIncome >= 4000000 ? 'MÁS DE $3.000.000'
      : selectedIncome >= 2250000 ? '$1.500.000 – $3.000.000'
      : selectedIncome >= 1150000 ? '$800.000 – $1.500.000'
      : 'MENOS DE $800.000'
    : 'NO ESPECIFICADO';

  const lines = React.useMemo(() => [
    `> INICIANDO ANÁLISIS CASO: ${name.toUpperCase()}`,
    `> MATERIA DETECTADA: ${
      legalMatter === 'alimentos' ? 'PENSIÓN DE ALIMENTOS'
      : legalMatter === 'divorcio' ? 'DIVORCIO Y PATRIMONIO'
      : legalMatter === 'tuicion' ? 'TUICIÓN Y CUIDADO'
      : 'AUMENTO DE PENSIÓN'
    }`,
    `> BASE ECONÓMICA DEMANDADO: ${incomeLabel}`,
    `> CONSULTANDO LEY 14.908 Y UTM MARZO 2026...`,
    `> APLICANDO CANASTA BÁSICA: ${selectedChildren} MENOR${(selectedChildren || 0) > 1 ? 'ES' : ''}`,
    monthsOwed && monthsOwed > 0
      ? `> ⚠️ DEUDA ACUMULADA DETECTADA: ${monthsOwed} MESES`
      : `> ESTADO DEUDA: SIN ATRASOS REGISTRADOS`,
    isVipProfile
      ? `> CASO DE ALTA COMPLEJIDAD — PRIORIDAD`
      : `> PERFIL VERIFICADO — ASIGNACIÓN DIRECTA`,
    `> CALCULANDO MONTO MÁXIMO EXIGIBLE...`
  ], [name, legalMatter, incomeLabel, selectedChildren, monthsOwed, isVipProfile]);

  useEffect(() => {
    if (lineIndex >= lines.length) return;
    if (charIndex < lines[lineIndex].length) {
      const t = setTimeout(() => {
        setCurrentText(prev => prev + lines[lineIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      }, 18);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, lines[lineIndex]]);
        setCurrentText('');
        setCharIndex(0);
        setLineIndex(prev => prev + 1);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex, lines]);

  return (
    <div className="space-y-1.5 min-h-[120px]">
      {visibleLines.map((line, i) => (
        <p key={i} className="text-[11px] leading-relaxed"
          style={{ color:
            line.includes('⚠️') ? 'rgb(252,165,165)'
            : line.includes('VIP') ? 'rgb(216,180,254)'
            : line.includes('CALCULANDO') ? 'rgb(134,239,172)'
            : 'rgba(148,163,184,0.7)'
          }}>
          {line}
        </p>
      ))}
      {lineIndex < lines.length && (
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {currentText}
          <motion.span
            className="inline-block w-1.5 h-3 bg-pink-400 ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </p>
      )}
    </div>
  );
};

const CalculadoraPensionPage: React.FC = () => {
  const navigate = useNavigate();
  const [legalMatter, setLegalMatter] = useState<'alimentos' | 'divorcio' | 'tuicion' | 'aumento' | null>(null);
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
  const [protectionType, setProtectionType] = useState<'vif' | 'economica' | 'none' | null>(null);
  const [hasComplexAssets, setComplexAssets] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false); // Estado de revelación de resultados
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("Iniciando conexión segura...");
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(15);
  const [calculatedRange, setCalculatedRange] = useState<{ 
    min: string; 
    max: string; 
    isEdgeCase: boolean; 
    pisoLegalValue: string 
  } | null>(null);

  // Progreso dinámico
  const calculateProgress = () => {
    let steps = 0;
    if (legalMatter !== null) steps += 1;
    if (name) steps += 1;
    if (emailValid) steps += 1;
    if (whatsappValid) steps += 1;
    if (selectedIncome !== null) steps += 1;
    if (selectedChildren !== null) steps += 1;
    if (currentPension !== '') steps += 1;
    if (hidesIncome !== null) steps += 1;
    if (hasDebt !== null) steps += 1;
    if (hasDebt === true && monthsOwed !== null) steps += 1;
    if (protectionType !== null) steps += 1;
    if (hasComplexAssets !== null) steps += 1;
    const totalSteps = hasDebt === true ? 12 : 11;
    const raw = Math.round((steps / totalSteps) * 100);
    return Math.max(12, raw);
  };

  // Urgencia Dinámica basada en el día de la semana
  const getUrgencyMessage = () => {
    const day = new Date().getDay();
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const currentDay = dayNames[day];
    
    if (day === 0 || day === 6) {
      return `Este ${currentDay} activamos tu caso antes del lunes.`;
    } else if (day === 5) {
      return `Este viernes cerramos tu expediente antes del fin de semana.`;
    } else {
      return `Este ${currentDay} activamos tu caso en menos de 24 horas.`;
    }
  };

  // Lógica de precios dinámicos — 3 niveles
  const isVulnerableProfile = (protectionType === 'vif' || protectionType === 'economica') && selectedIncome === 600000;
  const isVipProfile = selectedIncome === 4000000 || selectedIncome === 2250000 || hasComplexAssets === true;
  const consultPrice = isVulnerableProfile ? 15000 : isVipProfile ? 75000 : 35000;
  const consultOriginalPrice = isVulnerableProfile ? 35000 : isVipProfile ? 150000 : 70000;

  const handleDirectPayment = async () => {
    setCountdownActive(false);
    trackMetaEvent({
      event_name: 'InitiateCheckout',
      user_data: { em: email },
      custom_data: {
        content_name: isVulnerableProfile
          ? 'Consulta Protección VIF'
          : isVipProfile
          ? 'Consulta Alta Complejidad — Derecho de Familia'
          : `Diagnóstico Legal — ${legalMatter || 'Familia'}`,
        content_category: 'Servicios Legales',
        value: consultPrice,
        currency: 'CLP'
      }
    });

    const serviceNames: Record<string, string> = {
      alimentos: 'Estrategia de Cobro y Apremio — Pensión de Alimentos',
      divorcio:  'Estrategia de Divorcio y Protección Patrimonial',
      tuicion:   'Estrategia de Tuición y Régimen de Visitas',
      aumento:   'Demanda de Aumento de Pensión de Alimentos',
    };

    const paymentData = {
      plan:          'consulta-estrategica-familia',
      service:       isVulnerableProfile
        ? 'Consulta Urgente de Protección VIF — Tarifa Social'
        : isVipProfile
        ? 'Estudio Patrimonial — Consulta de Alta Complejidad'
        : serviceNames[legalMatter || 'alimentos'] || 'Consulta Estratégica de Familia',
      name,
      nombre:        name,
      email,
      whatsapp,
      telefono:      whatsapp,
      price:         consultPrice,
      originalPrice: consultOriginalPrice,
      matter:        legalMatter,
      isVip:         isVipProfile,
      isVulnerable:  isVulnerableProfile,
      protectionType,
      category:      'Derecho de Familia',
      fecha:         new Date().toLocaleDateString('es-CL'),
      hora:          'A coordinar con el equipo',
      reservaId:     `CALC-${Date.now()}`
    };

    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    localStorage.setItem('paymentData',    JSON.stringify(paymentData));

    supabase
      .from('leads_quiz')
      .update({
        status: 'checkout_iniciado',
        quiz_answers: {
          source:              'calculadora_pension',
          nombre:              name.trim(),
          whatsapp:            whatsapp.replace(/\s/g, ''),
          email,
          materia_legal:       legalMatter,
          ingreso_demandado:   selectedIncome,
          cantidad_hijos:      selectedChildren,
          pension_actual:      currentPension,
          oculta_ingresos:     hidesIncome,
          tiene_deuda:         hasDebt,
          meses_deuda:         monthsOwed,
          proteccion:          protectionType,
          patrimonio_complejo: hasComplexAssets,
          is_alta_complejidad: isVipProfile,
          is_vulnerable:       isVulnerableProfile,
          lead_score:          isVipProfile
            ? 'HOT_ALTA_COMPLEJIDAD'
            : (hasDebt && monthsOwed && monthsOwed > 3)
            ? 'WARM_DEBT'
            : 'STANDARD',
          consulta_precio:          consultPrice,
          consulta_precio_original: consultOriginalPrice,
          consulta_servicio:        paymentData.service,
          reserva_id:               paymentData.reservaId,
          checkout_timestamp:       new Date().toISOString()
        } as any
      })
      .eq('email', email)
      .then(({ error }) => {
        if (error) {
          console.warn('⚠️ Supabase checkout update:', error.message);
          supabase.from('leads_quiz').insert([{
            email,
            name: name.trim(),
            status: 'checkout_iniciado',
            quiz_answers: {
              source:    'calculadora_pension',
              nombre:    name.trim(),
              whatsapp:  whatsapp.replace(/\s/g, ''),
              email,
              materia_legal:    legalMatter,
              consulta_precio:  consultPrice,
              reserva_id:       paymentData.reservaId,
              checkout_timestamp: new Date().toISOString()
            } as any
          }]).then(({ error: insertErr }) => {
            if (insertErr) console.error('❌ Insert fallback:', insertErr.message);
            else console.log('✅ Lead creado en checkout (fallback)');
          });
        } else {
          console.log('✅ Checkout registrado en Supabase');
        }
      });

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

  // Countdown visual (sin redirección automática — el usuario paga por clic)
  useEffect(() => {
    if (!isRevealed || !calculatedRange) return;
    const t = setTimeout(() => setCountdownActive(true), 3000);
    return () => clearTimeout(t);
  }, [isRevealed, calculatedRange]);

  useEffect(() => {
    if (!countdownActive) return;
    const id = setInterval(() => {
      setCountdownSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [countdownActive]);

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

  // Auto-trigger: calcula y lanza análisis cinematic cuando todo esté listo
  useEffect(() => {
    const isContactReady = name.trim() !== '' && emailValid && whatsappValid;
    const isBaseReady = selectedIncome !== null && selectedChildren !== null && currentPension !== '' && hidesIncome !== null;
    const isDebtReady = hasDebt === false || (hasDebt === true && monthsOwed !== null && monthsOwed > 0);
    const isProtectionReady = protectionType !== null;
    const isAssetsReady = hasComplexAssets !== null;
    const isReadyToCalculate = legalMatter !== null && isContactReady && isBaseReady && isDebtReady && isProtectionReady && isAssetsReady;
    
    if (isReadyToCalculate && !isRevealed && !isAnalyzing) {
      const range = calculatePensionRange(selectedIncome, selectedChildren);
      if (range) {
        setCalculatedRange(range);
        setTimeout(() => {
          setIsAnalyzing(true);
          setTimeout(() => {
            const terminal = document.getElementById('terminal-screen');
            if (terminal) terminal.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 450);
          const texts = [
            `Verificando datos de ${name.split(' ')[0]}...`,
            "Consultando Ley 14.908 y jurisprudencia 2026...",
            `Calculando base sobre ${selectedChildren} hijo${selectedChildren! > 1 ? 's' : ''} y UTM vigente...`,
            "Evaluando medidas de apremio disponibles...",
            "Generando tu informe legal personalizado..."
          ];
          texts.forEach((text, index) => {
            setTimeout(() => setLoadingText(text), index * 1000);
          });
          setTimeout(() => {
            setIsAnalyzing(false);
            setIsRevealed(true);
            setTimeout(() => {
              const target = document.getElementById('resultado-pension');
              if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }, 5000);
        }, 100);
      }
    } else if (!isReadyToCalculate) {
      setCalculatedRange(null);
    }
  }, [legalMatter, selectedIncome, selectedChildren, currentPension, hidesIncome, hasDebt, monthsOwed, protectionType, hasComplexAssets, name, emailValid, whatsappValid, isRevealed, isAnalyzing]);

  // URL de WhatsApp dinámica
  // TODO: Reemplazar 569XXXXXXXX con el número de WhatsApp real de Punto Legal
  const WHATSAPP_NUMBER = '56962321883'; // Cambiar este número según corresponda
  const whatsappUrl = useMemo(() => {
    if (!calculatedRange || selectedChildren === null) return '';
    const message = `Hola, acabo de usar la calculadora de Punto Legal. Para ${selectedChildren} hijo(s), el monto estimado por ley es entre ${calculatedRange.min} y ${calculatedRange.max}. Quiero saber cómo exigir esto.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [calculatedRange, selectedChildren]);

  // WhatsApp Flotante Dinámico
  const floatingWhatsappUrl = useMemo(() => {
    const baseNumber = "56962321883";
    if (calculatedRange && isRevealed) {
      const isVip = isVipProfile ? "[ALTA COMPLEJIDAD] " : "";
      let msg = `🚨 DIAGNÓSTICO LEGAL: Hola, soy ${name || 'un usuario'}. ${isVip}`;
      if (protectionType === 'vif' || protectionType === 'economica') msg += `Sufro violencia/control. `;
      if (hasDebt && monthsOwed) msg += `Me deben meses de pensión. `;
      msg += `Necesito agendar mi plan de acción.`;
      return `https://wa.me/${baseNumber}?text=${encodeURIComponent(msg)}`;
    }
    return `https://wa.me/${baseNumber}?text=${encodeURIComponent("Hola, necesito ayuda urgente con mi caso de familia en Punto Legal.")}`;
  }, [calculatedRange, isRevealed, name, protectionType, hasDebt, monthsOwed, isVipProfile]);

  // Actualización silenciosa del Lead con los datos del cálculo
  useEffect(() => {
    if (calculatedRange && emailValid && emailSaved) {
      const updateLeadData = async () => {
        try {
          // Lógica para determinar si es un pez gordo (VIP)
          const isVipLead = selectedIncome === 2250000 || selectedIncome === 4000000 || hasComplexAssets === true;
          const leadScore = isVipLead ? 'HOT_VIP' : (hasDebt && monthsOwed && monthsOwed > 3) ? 'WARM_DEBT' : 'STANDARD';

          const quizAnswers = { 
            source: 'calculadora_pension',
            nombre: name.trim(),
            whatsapp: whatsapp.replace(/\s/g, ''),
            email: email,
            materia_legal: legalMatter,
            ingreso_demandado: selectedIncome,
            cantidad_hijos: selectedChildren,
            anomalia_legal: calculatedRange.isEdgeCase,
            pension_actual: currentPension,
            oculta_ingresos: hidesIncome,
            tiene_deuda: hasDebt,
            meses_deuda: monthsOwed,
            proteccion: protectionType,
            patrimonio_complejo: hasComplexAssets,
            // NUEVOS DATOS DE INTELIGENCIA COMERCIAL
            is_vip: isVipLead,
            lead_score: leadScore
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
          
          if (!error && data && data.length > 0) {
            console.log('✅ Lead actualizado con datos del cálculo:', data);
          } else if (!error && (!data || data.length === 0)) {
            // Fallback: insertar si no existía (ej. insert inicial aún no completó)
            const { data: insertData, error: insertErr } = await supabase
              .from('leads_quiz')
              .insert([{
                email,
                name: name.trim(),
                quiz_answers: quizAnswers as any,
                status: 'calculo_completado',
                income_value: selectedIncome,
                children_count: selectedChildren,
                calculated_min: calculatedRange.min,
                calculated_max: calculatedRange.max
              }])
              .select();
            if (!insertErr) {
              console.log('✅ Lead creado con cálculo (fallback):', insertData);
              setEmailSaved(true);
            } else {
              console.warn('⚠️ Fallback insert falló:', insertErr.message);
            }
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
  }, [calculatedRange, email, emailValid, emailSaved, selectedIncome, selectedChildren, currentPension, hidesIncome, hasDebt, monthsOwed, name, whatsapp, protectionType, hasComplexAssets, legalMatter]);

  // Función para scroll suave al siguiente paso con offset para móvil (header + barra progreso)
  const scrollToNext = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <>
      <SEO 
        title="Diagnóstico Legal de Familia 2026 - Punto Legal"
        description="Resuelve tu caso de familia en 3 minutos. Pensión de alimentos, divorcio, tuición, VIF y más. Plan de acción legal personalizado con abogados especializados."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <style>{`footer, .footer, [data-testid="footer"] { display: none !important; }`}</style>
        {/* Header y barra de progreso — ocultos cuando se muestra el resultado/checkout */}
        {!isRevealed && (
          <>
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

        {/* Barra de progreso Sticky */}
        <div className="sticky top-[73px] z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-3 px-4">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <div className="text-xs font-bold text-slate-300 whitespace-nowrap">
              {calculateProgress()}% <span className="hidden sm:inline">Completado</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
          </>
        )}

        {/* Contenido Principal */}
        <main className={`max-w-5xl mx-auto px-4 ${isRevealed ? 'pt-6 pb-8 md:pt-8 md:pb-12' : 'py-8 md:py-12'}`}>
          {/* Hero/Título — oculto en checkout para foco total en el resultado */}
          {!isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2 mb-6 border border-white/10 shadow-lg">
              <Scale className="w-4 h-4 text-pink-400" />
              <span className="text-xs md:text-sm font-semibold text-slate-200">Diagnóstico Legal Gratuito · Familia · 2026</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Resuelve tu Problema Legal de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Familia</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
              Responde 3 preguntas y obtén un diagnóstico legal personalizado. Pensión de alimentos, divorcio, tuición o protección urgente — nuestros abogados activan tu caso en menos de 24 horas.
            </p>

            {/* Social Proof con Avatares */}
            <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['bg-pink-400', 'bg-rose-400', 'bg-amber-400', 'bg-sky-400'].map((color, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${color} border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-900`}>
                      {['M','D','C','P'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">+1.240 casos resueltos este mes</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                <span className="text-xs text-slate-400 font-medium">4.9 · Google Reviews</span>
              </div>
            </div>
          </motion.div>
          )}

          {/* Formulario - 4 Pasos en la misma pantalla */}
          <div className="max-w-2xl mx-auto">
            <div className={`space-y-5 md:space-y-6 transition-all duration-1000 ${isAnalyzing ? 'blur-md opacity-20 pointer-events-none select-none' : ''} ${isRevealed ? 'hidden' : ''}`}>
            {/* Paso 0: Selector de Materia Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                  legalMatter !== null ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                }`}>
                  <span className={`text-sm font-bold transition-colors ${legalMatter !== null ? 'text-pink-400' : 'text-slate-600'}`}>1</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white/95">¿Qué necesitas resolver?</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Elige la que más se acerca a tu caso</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    value: 'alimentos' as const,
                    icon: Baby,
                    label: 'Pensión de alimentos',
                    sub: 'No me pagan o me pagan poco',
                    color: 'pink'
                  },
                  {
                    value: 'divorcio' as const,
                    icon: Scale,
                    label: 'Divorcio o separación',
                    sub: 'Quiero terminar el matrimonio',
                    color: 'sky'
                  },
                  {
                    value: 'tuicion' as const,
                    icon: Users,
                    label: 'Tuición o visitas',
                    sub: 'Problema con mis hijos',
                    color: 'emerald'
                  },
                  {
                    value: 'aumento' as const,
                    icon: TrendingDown,
                    label: 'Aumento de pensión',
                    sub: 'El monto ya no alcanza',
                    color: 'amber'
                  }
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = legalMatter === option.value;
                  const colorMap: Record<string, { border: string; bg: string; iconBg: string; iconColor: string; shadow: string }> = {
                    pink: {
                      border: 'border-pink-500/50',
                      bg: 'bg-pink-500/10',
                      iconBg: 'bg-pink-500/20',
                      iconColor: 'text-pink-400',
                      shadow: 'shadow-pink-500/20'
                    },
                    sky: {
                      border: 'border-sky-500/50',
                      bg: 'bg-sky-500/10',
                      iconBg: 'bg-sky-500/20',
                      iconColor: 'text-sky-400',
                      shadow: 'shadow-sky-500/20'
                    },
                    emerald: {
                      border: 'border-emerald-500/50',
                      bg: 'bg-emerald-500/10',
                      iconBg: 'bg-emerald-500/20',
                      iconColor: 'text-emerald-400',
                      shadow: 'shadow-emerald-500/20'
                    },
                    amber: {
                      border: 'border-amber-500/50',
                      bg: 'bg-amber-500/10',
                      iconBg: 'bg-amber-500/20',
                      iconColor: 'text-amber-400',
                      shadow: 'shadow-amber-500/20'
                    }
                  };
                  const c = colorMap[option.color];
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => {
                        setLegalMatter(option.value);
                        scrollToNext('paso-contacto');
                      }}
                      whileHover={{ y: -3, scale: 1.015 }}
                      whileTap={{ scale: 0.97, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                        isSelected
                          ? `${c.border} ${c.bg} shadow-lg ${c.shadow}`
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      } cursor-pointer`}
                    >
                      <div className={`p-2.5 rounded-xl transition-all flex-none ${isSelected ? c.iconBg : 'bg-white/5'}`}>
                        <Icon className={`w-5 h-5 transition-colors ${isSelected ? c.iconColor : 'text-slate-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold text-sm transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {option.label}
                        </p>
                        <p className={`text-[11px] transition-colors ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {option.sub}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Paso 1: Datos de Contacto - iOS Glassmorphism */}
            {legalMatter !== null && (
              <motion.div
                id="paso-contacto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                    name.trim() && emailValid && whatsappValid ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                  }`}>
                    <span className={`text-sm font-bold transition-colors ${name.trim() && emailValid && whatsappValid ? 'text-pink-400' : 'text-slate-600'}`}>2</span>
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
            )}

            {/* Paso 2: Rango de Ingresos - iOS Glassmorphism */}
            {legalMatter !== null && (
              <motion.div
                id="paso-ingresos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                    selectedIncome !== null ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                  }`}>
                    <span className={`text-sm font-bold transition-colors ${selectedIncome !== null ? 'text-pink-400' : 'text-slate-600'}`}>3</span>
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
                        setSelectedIncome(option.value);
                        scrollToNext('paso-hijos');
                      }}
                      whileHover={{ y: -3, scale: 1.015 }}
                      whileTap={{ scale: 0.97, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                        isSelected
                          ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      } cursor-pointer`}
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
            )}

            {/* Paso 3: Cantidad de Hijos - iOS Glassmorphism */}
            {legalMatter !== null && (
              <motion.div
                id="paso-hijos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                    selectedChildren !== null ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                  }`}>
                    <span className={`text-sm font-bold transition-colors ${selectedChildren !== null ? 'text-pink-400' : 'text-slate-600'}`}>4</span>
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
                        setSelectedChildren(option.value);
                        scrollToNext('paso-pension');
                      }}
                      whileHover={{ y: -3, scale: 1.015 }}
                      whileTap={{ scale: 0.97, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-3 ${
                        isSelected
                          ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      } cursor-pointer`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        boxShadow: isSelected 
                          ? '0 4px 16px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div className={`p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-pink-500/20'
                          : 'bg-white/5'
                      }`}>
                        <Icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-pink-400' : 'text-slate-400'}`} />
                      </div>
                      <span className={`font-medium text-sm transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
            )}

            {/* Paso 4: Monto Actual - iOS Glassmorphism */}
            {legalMatter !== null && selectedIncome !== null && selectedChildren !== null && (
              <motion.div
                id="paso-pension"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                    currentPension !== '' ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                  }`}>
                    <span className={`text-sm font-bold transition-colors ${currentPension !== '' ? 'text-pink-400' : 'text-slate-600'}`}>5</span>
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
                    onBlur={() => {
                      if (currentPension !== '') {
                        setTimeout(() => scrollToNext('paso-oculta'), 400);
                      }
                    }}
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Escribe el monto en pesos (ej: 150000). Si no recibes nada, escribe 0.
                </p>
              </motion.div>
            )}

            {/* Paso 5: Oculta ingresos - iOS Glassmorphism */}
            {legalMatter !== null && selectedIncome !== null && selectedChildren !== null && currentPension !== '' && (
              <motion.div
                id="paso-oculta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                    hidesIncome !== null ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                  }`}>
                    <span className={`text-sm font-bold transition-colors ${hidesIncome !== null ? 'text-pink-400' : 'text-slate-600'}`}>6</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white/95">¿Sospechas que el demandado oculta sus ingresos reales, trabaja en negro o se atrasa en los pagos?</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => {
                      setHidesIncome(true);
                      scrollToNext('paso-deuda');
                    }}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${
                      hidesIncome === true
                        ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hidesIncome === true 
                        ? '0 4px 16px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <AlertTriangle className={`w-5 h-5 transition-colors ${hidesIncome === true ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hidesIncome === true ? 'text-white' : 'text-slate-300'}`}>
                      Sí, lo sospecho
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setHidesIncome(false);
                      scrollToNext('paso-deuda');
                    }}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${
                      hidesIncome === false
                        ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hidesIncome === false 
                        ? '0 4px 16px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <ShieldCheck className={`w-5 h-5 transition-colors ${hidesIncome === false ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hidesIncome === false ? 'text-white' : 'text-slate-300'}`}>
                      No
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Paso 6: Deuda Acumulada - iOS Glassmorphism */}
            {legalMatter !== null && selectedIncome !== null && selectedChildren !== null && currentPension !== '' && hidesIncome !== null && (
              <motion.div
                id="paso-deuda"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                    hasDebt !== null ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                  }`}>
                    <span className={`text-sm font-bold transition-colors ${hasDebt !== null ? 'text-pink-400' : 'text-slate-600'}`}>7</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white/95">¿Existe deuda acumulada o atrasos en los pagos?</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <motion.button
                    onClick={() => {
                      setHasDebt(true);
                    }}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${
                      hasDebt === true
                        ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hasDebt === true 
                        ? '0 4px 16px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <AlertTriangle className={`w-5 h-5 transition-colors ${hasDebt === true ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hasDebt === true ? 'text-white' : 'text-slate-300'}`}>
                      Sí, me debe meses
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setHasDebt(false);
                      setMonthsOwed(null);
                      scrollToNext('paso-vif');
                    }}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${
                      hasDebt === false
                        ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hasDebt === false 
                        ? '0 4px 16px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <ShieldCheck className={`w-5 h-5 transition-colors ${hasDebt === false ? 'text-pink-400' : 'text-slate-400'}`} />
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
                      onBlur={() => { if (monthsOwed && monthsOwed > 0) scrollToNext('paso-vif'); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && monthsOwed && monthsOwed > 0) scrollToNext('paso-vif'); }}
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

            {/* Paso 7: Hostigamiento y Violencia (VIF) */}
            {legalMatter !== null && selectedIncome !== null && selectedChildren !== null && currentPension !== '' && hidesIncome !== null && hasDebt !== null && (
              <motion.div 
                id="paso-vif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                    protectionType !== null ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                  }`}>
                    <span className={`text-sm font-bold transition-colors ${protectionType !== null ? 'text-pink-400' : 'text-slate-600'}`}>8</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white/95">¿Vives alguna situación de hostigamiento o control?</h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <motion.button 
                    onClick={() => {
                      setProtectionType('vif');
                      scrollToNext('paso-patrimonio');
                    }} 
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 ${protectionType === 'vif' ? 'border-pink-500/50 bg-pink-500/10 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <AlertTriangle className={`w-5 h-5 shrink-0 flex-none ${protectionType === 'vif' ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span className={`font-medium text-sm ${protectionType === 'vif' ? 'text-white' : 'text-slate-300'}`}>Sí, violencia física/psicológica (Necesito orden de alejamiento)</span>
                  </motion.button>
                  <motion.button 
                    onClick={() => {
                      setProtectionType('economica');
                      scrollToNext('paso-patrimonio');
                    }} 
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 ${protectionType === 'economica' ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <Lock className={`w-5 h-5 shrink-0 flex-none ${protectionType === 'economica' ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span className={`font-medium text-sm ${protectionType === 'economica' ? 'text-white' : 'text-slate-300'}`}>Sí, violencia económica (Me corta el acceso al dinero para controlarme)</span>
                  </motion.button>
                  <motion.button 
                    onClick={() => {
                      setProtectionType('none');
                      scrollToNext('paso-patrimonio');
                    }} 
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 ${protectionType === 'none' ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <ShieldCheck className={`w-5 h-5 shrink-0 flex-none ${protectionType === 'none' ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span className={`font-medium text-sm ${protectionType === 'none' ? 'text-white' : 'text-slate-300'}`}>No, es solo un tema de cobranza regular</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Paso 8: Patrimonio Complejo (VIP) */}
            {legalMatter !== null && protectionType !== null && (
              <motion.div 
                id="paso-patrimonio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 flex-none ${
                    hasComplexAssets !== null ? 'bg-pink-500/15 border-pink-500/25' : 'bg-white/[0.04] border-white/[0.06]'
                  }`}>
                    <span className={`text-sm font-bold transition-colors ${hasComplexAssets !== null ? 'text-pink-400' : 'text-slate-600'}`}>9</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white/95">¿Existen empresas, múltiples propiedades o patrimonio complejo involucrado?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.button 
                    onClick={() => setComplexAssets(true)}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${hasComplexAssets === true ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hasComplexAssets === true
                        ? '0 4px 16px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Landmark className={`w-5 h-5 transition-colors ${hasComplexAssets === true ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hasComplexAssets === true ? 'text-white' : 'text-slate-300'}`}>Sí, patrimonio complejo</span>
                  </motion.button>
                  <motion.button 
                    onClick={() => setComplexAssets(false)}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className={`p-4 rounded-2xl border transition-all text-center flex items-center justify-center gap-3 ${hasComplexAssets === false ? 'border-pink-500/50 bg-pink-500/10 shadow-lg shadow-pink-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      boxShadow: hasComplexAssets === false
                        ? '0 4px 16px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <User className={`w-5 h-5 transition-colors ${hasComplexAssets === false ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span className={`font-medium transition-colors ${hasComplexAssets === false ? 'text-white' : 'text-slate-300'}`}>No, es empleado/independiente simple</span>
                  </motion.button>
                </div>
              </motion.div>
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

            {/* Pantalla de Análisis Premium */}
            {isAnalyzing && calculatedRange && (
              <motion.div
                id="terminal-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 relative"
                style={{ scrollMarginTop: 100 }}
              >
                <div
                  className="relative overflow-hidden rounded-[28px]"
                  style={{
                    background: 'linear-gradient(160deg, #020617 0%, #0a0f1e 50%, #020617 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)'
                  }}
                >
                  {/* Ambient glow */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Dot grid */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  {/* Scan line */}
                  <motion.div
                    className="absolute left-0 right-0 h-px z-20 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(236,72,153,0.8) 20%, rgba(255,255,255,0.9) 50%, rgba(236,72,153,0.8) 80%, transparent 100%)', boxShadow: '0 0 8px rgba(236,72,153,0.6), 0 0 20px rgba(236,72,153,0.3)' }}
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />

                  <div className="relative z-10 p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-7">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', boxShadow: '0 0 20px rgba(236,72,153,0.15)' }}>
                            <Scale className="w-5 h-5 text-pink-400" />
                          </div>
                          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-0.5">Analizando tu caso</p>
                          <p className="text-sm font-bold text-white">
                            {name.trim().split(' ')[0]} · {legalMatter === 'alimentos' ? 'Pensión de Alimentos' : legalMatter === 'divorcio' ? 'Divorcio' : legalMatter === 'tuicion' ? 'Tuición' : 'Aumento de Pensión'}
                          </p>
                        </div>
                      </div>
                      {isVipProfile && (
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-2.5 py-1">
                          <p className="text-[10px] text-purple-300 font-bold">A.C.</p>
                        </div>
                      )}
                      {isVulnerableProfile && !isVipProfile && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-2.5 py-1">
                          <p className="text-[10px] text-rose-300 font-bold">PRIO</p>
                        </div>
                      )}
                    </div>

                    {/* Terminal */}
                    <div className="rounded-2xl p-4 mb-6 font-mono text-xs" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-white/[0.06]">
                        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                        <span className="text-slate-600 text-[9px] ml-2 uppercase tracking-widest">punto-legal · análisis-v2026</span>
                      </div>
                      <TerminalLines
                        name={name.trim().split(' ')[0]}
                        legalMatter={legalMatter}
                        selectedIncome={selectedIncome}
                        selectedChildren={selectedChildren}
                        monthsOwed={monthsOwed}
                        isVipProfile={isVipProfile}
                      />
                    </div>

                    {/* Data cards */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {[
                        { label: 'TITULAR', value: name.trim().split(' ').slice(0, 2).join(' '), delay: 0.2 },
                        { label: 'HIJOS', value: `${selectedChildren} hijo${(selectedChildren || 0) > 1 ? 's' : ''}`, delay: 0.4 },
                        { label: 'BASE CALC.', value: selectedIncome ? (selectedIncome >= 4000000 ? '+$3M' : selectedIncome >= 2250000 ? '$1.5-3M' : selectedIncome >= 1150000 ? '$800k-1.5M' : '<$800k') : '—', delay: 0.6 },
                        { label: 'DEUDA', value: monthsOwed && monthsOwed > 0 ? `${monthsOwed} meses` : 'Sin deuda', delay: 0.8, highlight: !!(monthsOwed && monthsOwed > 0) }
                      ].map(({ label, value, delay, highlight }) => (
                        <motion.div key={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}
                          className="rounded-xl p-3"
                          style={{ background: highlight ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${highlight ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}` }}
                        >
                          <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: highlight ? 'rgb(252,165,165)' : 'rgb(100,116,139)' }}>{label}</p>
                          <p className="text-sm font-bold text-white truncate">{value}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Blurred number preview */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }}
                      className="rounded-2xl p-5 mb-6 text-center relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(14,165,233,0.05) 100%)', border: '1px solid rgba(236,72,153,0.15)' }}
                    >
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Calculando tu monto...</p>
                      <div className="relative inline-block">
                        <p className="text-5xl font-black text-white select-none" style={{ filter: 'blur(8px)', userSelect: 'none' }}>{calculatedRange.max}</p>
                        <motion.div className="absolute inset-0 flex items-center justify-center" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <div className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                            <Lock className="w-3.5 h-3.5 text-pink-400" />
                            <span className="text-xs font-bold text-pink-300">Procesando...</span>
                          </div>
                        </motion.div>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-2">Basado en Ley 14.908 · UTM 2026 · {selectedChildren} hijo{(selectedChildren || 0) > 1 ? 's' : ''}</p>
                    </motion.div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <motion.span className="text-xs text-pink-400 font-mono" key={loadingText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>{loadingText}</motion.span>
                        <motion.span className="inline-block w-0.5 h-3 bg-pink-400" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 50%, #ec4899 100%)', backgroundSize: '200% 100%', boxShadow: '0 0 8px rgba(236,72,153,0.5)' }}
                          initial={{ width: '3%' }}
                          animate={{ width: '100%', backgroundPosition: ['0% 0%', '100% 0%'] }}
                          transition={{ width: { duration: 5, ease: [0.25, 0.1, 0.25, 1] }, backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' } }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Dashboard Ejecutivo — Corporate Elite v4 */}
            {calculatedRange && isRevealed && (
              <motion.div
                id="resultado-pension"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 mb-12"
                style={{ scrollMarginTop: 24 }}
              >
                {/* HERO DEL NÚMERO — Estilo iOS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-3xl overflow-hidden mb-4 backdrop-blur-xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="relative z-10 px-6 pt-6 pb-8 md:px-8 md:pt-8 md:pb-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                          Diagnóstico Completado · {name.trim().split(' ')[0]}
                        </span>
                      </div>
                      {(isVipProfile || isVulnerableProfile) && (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          isVulnerableProfile ? 'bg-rose-500/15 text-rose-300' : 'bg-purple-500/15 text-purple-300'
                        }`}>
                          {isVulnerableProfile ? '🛡️ Prioridad Cautelar' : '⚡ Alta Complejidad'}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-3 font-medium">
                      {legalMatter === 'divorcio' ? 'Capacidad de pago mensual exigible'
                        : legalMatter === 'aumento' ? 'Monto máximo al que tienes derecho hoy'
                        : legalMatter === 'tuicion' ? 'Pensión máxima asociada a la tuición'
                        : 'Lo que la ley indica que debes recibir cada mes'}
                    </p>
                    <motion.h3
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 18 }}
                      className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-none"
                    >
                      <AnimatedCounter value={calculatedRange.max} delay={400} />
                    </motion.h3>
                    <p className="text-[11px] text-slate-500 mt-3 font-medium">
                      Ley 14.908 · UTM Marzo 2026 · {selectedChildren} hijo{(selectedChildren || 0) > 1 ? 's' : ''} · {name.trim().split(' ')[0]}
                    </p>
                  </div>
                </motion.div>

                {/* TARJETAS DE DOLOR — iOS Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {currentPension && (() => {
                    const rawPension = parseInt(currentPension.replace(/\D/g, '')) || 0;
                    const currentPensionNum = rawPension > 0 && rawPension < 1000 ? 0 : rawPension;
                    const maxPensionNum = parseInt(calculatedRange.max.replace(/\D/g, '')) || 0;
                    const monthlyLoss = Math.max(0, maxPensionNum - currentPensionNum);
                    if (monthlyLoss <= 0) return null;

                    return (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                        className="rounded-2xl p-4 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08]"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="w-4 h-4 text-rose-400" />
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Fuga mensual</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(monthlyLoss)}
                        </p>
                        <p className="text-[11px] text-rose-400/80 mt-1 font-medium">
                          Pierdes {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(monthlyLoss * 12)} al año.
                        </p>
                      </motion.div>
                    );
                  })()}

                  {hasDebt && monthsOwed && monthsOwed > 0 && (() => {
                    const rawPension = parseInt(currentPension.replace(/\D/g, '')) || 0;
                    const currentPensionNum = rawPension > 0 && rawPension < 1000 ? 0 : rawPension;
                    const baseDebt = currentPensionNum > 0 ? currentPensionNum : (parseInt(calculatedRange.min.replace(/\D/g, '')) || 0);
                    const totalDebt = baseDebt * monthsOwed;
                    const formattedTotalDebt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(totalDebt);

                    return (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                        className="rounded-2xl p-4 bg-white/[0.06] backdrop-blur-sm border border-blue-500/20"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
                      >
                        <span className="text-[11px] font-semibold text-blue-400/90 uppercase tracking-wider">Deuda acumulada</span>
                        <p className="text-2xl font-bold text-white mt-2">
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.5 }}>{formattedTotalDebt}</motion.span>
                        </p>
                        <p className="text-[11px] text-blue-300/70 mt-1 font-medium">{monthsOwed} meses exigibles · Cobrable hoy.</p>
                      </motion.div>
                    );
                  })()}
                </div>

                {/* Chanchito Alcancía — Depósito recibido (social proof iOS) */}
                {(() => {
                  const rawPension = parseInt(currentPension?.replace(/\D/g, '') || '0') || 0;
                  const currentPensionNum = rawPension > 0 && rawPension < 1000 ? 0 : rawPension;
                  const maxPensionNum = parseInt(calculatedRange.max.replace(/\D/g, '')) || 0;
                  const monthlyLoss = Math.max(0, maxPensionNum - currentPensionNum);
                  const baseDebt = currentPensionNum > 0 ? currentPensionNum : (parseInt(calculatedRange.min.replace(/\D/g, '')) || 0);
                  const totalDebt = hasDebt && monthsOwed ? baseDebt * monthsOwed : 0;
                  const depositAmount = totalDebt > 0 ? totalDebt : (monthlyLoss > 0 ? monthlyLoss * 12 : 4600000);
                  const depositNum = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(depositAmount);
                  return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }}
                      className="rounded-2xl p-4 mb-6 overflow-hidden relative"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-none border border-emerald-500/30">
                          <PiggyBank className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-emerald-400 font-bold text-lg">+{depositNum}</p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            Recibiste {depositNum} pesos gracias a Punto Legal
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Depósito · Casos como el tuyo</p>
                    </motion.div>
                  );
                })()}

                {/* ══ CHECKOUT CARD — iOS Split Layout ══ */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-3xl overflow-hidden flex flex-col lg:flex-row backdrop-blur-xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
                  }}
                >
                  {/* COLUMNA IZQUIERDA: Propuesta + Medidas + Timeline */}
                  <div className="p-6 md:p-8 lg:w-3/5 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
                    <h4 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                      {isVulnerableProfile ? 'Tu seguridad no puede esperar.'
                        : isVipProfile ? 'Patrimonio complejo: lo encontramos y lo protegemos.'
                        : legalMatter === 'divorcio' ? 'Estás en riesgo de perder la mitad de tu casa.'
                        : legalMatter === 'tuicion' ? 'La tuición se gana con estrategia.'
                        : legalMatter === 'aumento' ? 'Exige el nuevo monto que te corresponde.'
                        : hasDebt && monthsOwed && monthsOwed > 0 ? 'Recupera tu dinero con la ley de tu lado.'
                        : 'Inicia tu proceso legal definitivo.'}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {isVulnerableProfile ? 'Activamos el protocolo de emergencia: medida cautelar de alejamiento y pensión provisoria sin demoras.'
                        : isVipProfile ? 'Rastreo estratégico en SII y CBR para detectar activos ocultos. Ejecutamos embargos preventivos antes de que los muevan. El velo corporativo no los protege cuando sabemos dónde mirar.'
                        : legalMatter === 'divorcio' ? `Paga ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(consultPrice)} para bloquear los bienes antes de que los muevan. Evitamos traspasos fraudulentos y aseguramos tu futuro financiero.`
                        : legalMatter === 'tuicion' ? `La tuición se gana con evidencia. Paga ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(consultPrice)} para que un abogado construya tu caso y defienda tu derecho a estar con tus hijos.`
                        : legalMatter === 'aumento' ? `Exige el monto que te corresponde. Paga ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(consultPrice)} para calcular el retroactivo por IPC y preparar la demanda de aumento.`
                        : hasDebt ? 'Ejecutamos la Ley 21.389 al máximo: retención AFP, bloqueo bancario, retención SII, arraigo nacional y arresto por apremio.'
                        : 'Estructuramos tu demanda, calculamos el monto máximo exigible y trazamos la ruta directa al tribunal.'}
                    </p>

                    {/* Medidas disponibles — Ley 21.389 y apremios (induce compra) */}
                    <div className="rounded-2xl p-4 mb-6 bg-white/[0.04] border border-white/[0.06]">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Medidas disponibles (Ley 21.389)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'Arraigo nacional', desc: 'Impedimento de salida del país' },
                            { label: 'Arresto por apremio', desc: 'Hasta 15 días por incumplimiento' },
                            { label: 'Retención AFP', desc: 'Descuento directo del sueldo' },
                            { label: 'Bloqueo bancario', desc: 'Embargo de cuentas corrientes' },
                            { label: 'Retención SII', desc: 'Devoluciones de impuestos' },
                            { label: 'Embargo preventivo', desc: 'Sobre bienes identificados' }
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2 py-2 px-3 rounded-xl bg-white/[0.03]">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-none mt-0.5" />
                              <div>
                                <p className="text-[11px] font-semibold text-white">{item.label}</p>
                                <p className="text-[10px] text-slate-500">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>

                    {/* Timeline 48h — iOS style */}
                    <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Plan de Acción</p>
                      <div className="relative pl-3 space-y-4 before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-gradient-to-b before:from-emerald-500/40 before:via-blue-500/40 before:to-pink-500/40">
                        {([
                          { time: 'Hoy', color: 'emerald' as const, text: 'Confirmación por email y WhatsApp. Un abogado te contacta en menos de 2 horas.' },
                          { time: '24h', color: 'blue' as const, text: 'Sesión de 45 min online. Definimos la estrategia exacta para tu caso.' },
                          { time: '48h', color: 'pink' as const, text: isVulnerableProfile ? 'Medida cautelar ingresada. Pensión provisoria en tramitación.' : 'Demanda ingresada al tribunal. Apremios activados (retención, arraigo, arresto).' }
                        ] as { time: string; color: 'emerald' | 'blue' | 'pink'; text: string }[]).map(({ time, color, text }) => (
                          <div key={time} className="relative flex items-start gap-3">
                            <div className={`absolute -left-[18px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                              color === 'emerald' ? 'bg-emerald-400' : color === 'blue' ? 'bg-blue-400' : 'bg-pink-400'
                            }`} />
                            <span className={`text-[10px] font-bold uppercase w-7 ${color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-pink-400'}`}>{time}</span>
                            <p className="text-xs text-slate-300 leading-relaxed flex-1">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA DERECHA: Caja Blanca de Pago — iOS */}
                  <div className="p-6 md:p-8 lg:w-2/5 bg-white flex flex-col justify-center space-y-6"
                    style={{ boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' }}>
                    <div className="space-y-4 pb-6 border-b border-slate-200">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-center">Tu compra incluye:</p>
                      <div className="space-y-3">
                        <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <User className="w-5 h-5 text-indigo-600 shrink-0" />
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 leading-none">Abogado Senior Asignado</p>
                            <p className="text-[10px] text-slate-500 mt-1">Especialista en {legalMatter === 'divorcio' ? 'Patrimonio' : 'Familia'}.</p>
                          </div>
                        </div>
                        <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <Gavel className="w-5 h-5 text-indigo-600 shrink-0" />
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 leading-none">Estrategia de Choque</p>
                            <p className="text-[10px] text-slate-500 mt-1">Plan de embargos y medidas cautelares.</p>
                          </div>
                        </div>
                        <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 leading-none">Documentación Lista</p>
                            <p className="text-[10px] text-slate-500 mt-1">Cálculo de liquidación oficial para el tribunal.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-5 border-b border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Honorarios Únicos</p>
                      <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm text-slate-400 line-through">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(consultOriginalPrice)}</span>
                        <span className="text-[9px] font-bold uppercase text-white bg-slate-800 px-2 py-0.5 rounded">Asignación Inmediata</span>
                      </div>
                      <p className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(consultPrice)}
                      </p>
                    </div>
                    {/* Countdown visual (sin redirección automática) */}
                    {countdownActive && countdownSeconds > 0 && (
                      <div className="rounded-xl p-4 bg-indigo-50 border border-indigo-100">
                        <p className="text-xs font-bold text-slate-700 mb-2">
                          Redirigiendo al pago en {countdownSeconds} segundos...
                        </p>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                          <motion.div
                            className="h-full bg-indigo-500 rounded-full"
                            initial={{ width: '100%' }}
                            animate={{ width: `${(countdownSeconds / 15) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setCountdownActive(false)}
                          className="text-[10px] text-slate-500 hover:text-slate-700 font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                    <motion.button
                      onClick={handleDirectPayment}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #3730a3 100%)',
                        boxShadow: '0 4px 20px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      <span>IR A PAGAR SEGURO AHORA</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                    <p className="text-[10px] text-slate-500 text-center font-medium">
                      Recibirás acceso inmediato por WhatsApp tras el pago
                    </p>
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Garantía de Viabilidad 100%. Reembolso si tu caso no tiene solución.</span>
                    </div>
                    {(protectionType === 'vif' || protectionType === 'economica') && (
                      <a
                        href={`https://wa.me/56962321883?text=${encodeURIComponent('Hola, tengo urgencia VIF y no tengo acceso a medios de pago. Necesito orientación de emergencia.')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center justify-center gap-2 text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Sin acceso a pagos por violencia económica
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* TESTIMONIOS — iOS Burbujas hiper realistas */}
                <div className="flex items-center gap-3 mt-8 mb-4">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Casos resueltos</p>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                {(() => {
                  const byMatter: Record<string, { n: string; l: string; t: string }[]> = {
                    alimentos: [
                      { n: 'María José H.', l: 'Las Condes', t: 'Logré cobrar $8.000.000 de deuda. Activaron la retención AFP sin que él se enterara. Definitivo.' },
                      { n: 'Valentina S.', l: 'Puente Alto', t: 'Me debían 14 meses. El abogado activó retención de sueldo el mismo día de la consulta. Increíble.' }
                    ],
                    divorcio: [
                      { n: 'Daniela T.', l: 'La Florida', t: 'Me divorció en 60 días y aseguró mi parte del departamento antes de que él lo pasara a su empresa.' },
                      { n: 'Alejandra M.', l: 'Ñuñoa', t: 'Sociedad conyugal complicada. Detectaron bienes que yo no sabía que existían. Me cambiaron el resultado.' }
                    ],
                    tuicion: [
                      { n: 'Fernanda R.', l: 'Providencia', t: 'Obtuve la tuición en 4 meses. Construyeron el caso con evidencia concreta y fueron implacables.' },
                      { n: 'Camila V.', l: 'Las Condes', t: 'Tenía miedo de perder a mis hijos. Fueron directos y me dieron el resultado que necesitaba.' }
                    ],
                    aumento: [
                      { n: 'Carolina M.', l: 'Maipú', t: 'De $120.000 a $280.000. El juez actualizó en base a costos reales 2026. 6 semanas y valió cada peso.' },
                      { n: 'Patricia L.', l: 'Santiago Centro', t: 'Llevaba 3 años con el mismo monto. Conseguí el aumento y además un retroactivo de casi $900.000.' }
                    ]
                  };
                  const active = byMatter[legalMatter || 'alimentos'];
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {active.map((test, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.8 + i * 0.15, duration: 0.5 }}
                          className="rounded-2xl p-5 overflow-hidden relative"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
                          }}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/30 to-rose-500/20 flex items-center justify-center flex-none border border-white/10">
                              <span className="text-sm font-bold text-white">{test.n.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white">{test.n}</p>
                              <p className="text-[11px] text-slate-500">{test.l}</p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                              <span className="text-[10px] font-medium text-slate-500">Recomendado</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">"{test.t}"</p>
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {isRevealed && (
            <div className="mt-16 border-t border-white/5 pt-12">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Preguntas frecuentes sobre tu caso</h3>
              <div className="grid gap-4 max-w-2xl mx-auto text-sm text-slate-400">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                  <h4 className="font-semibold text-slate-200 mb-2">¿Puedo resolver pensión, divorcio y tuición en la misma consulta?</h4>
                  <p>Sí. En la sesión el abogado evalúa todos los aspectos de tu caso. Si tienes más de un asunto (ej: divorcio + pensión), te presentamos un plan integrado con el presupuesto total para resolverlo todo.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                  <h4 className="font-semibold text-slate-200 mb-2">¿Cómo activo la retención AFP y el arraigo nacional?</h4>
                  <p>Bajo la Ley 21.389 (Registro Nacional de Deudores), si existe deuda acumulada activamos retención de devoluciones de impuestos (SII), arraigo y bloqueo de cuentas bancarias. Sin esperar a la Defensoría Pública.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                  <h4 className="font-semibold text-slate-200 mb-2">¿Puedo pedir una Orden de Alejamiento (VIF) urgente?</h4>
                  <p>Sí. Tramitamos medidas de protección y cautelares de urgencia en tribunales de todo Chile con absoluta confidencialidad. El proceso puede iniciarse el mismo día de la consulta.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                  <h4 className="font-semibold text-slate-200 mb-2">¿Cuánto demora un divorcio o un aumento de pensión?</h4>
                  <p>Un divorcio de mutuo acuerdo demora entre 30 y 90 días. Un aumento de pensión urgente puede tener medida provisional en 2-4 semanas. En la consulta te daremos los plazos exactos para tu caso específico.</p>
                </div>
              </div>
            </div>
            )}
          </div>
        </main>

        {/* Botón Flotante de Contacto WhatsApp */}
        <a
          href={floatingWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3"
        >
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 px-3 py-2 rounded-2xl text-white text-xs font-bold shadow-2xl flex items-center gap-2 transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100">
            <span className="relative flex h-2 w-2 flex-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Hablar ahora
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
