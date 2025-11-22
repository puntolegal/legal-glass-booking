import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  Baby,
  FileText,
  Home,
  CheckCircle,
  Shield,
  Sparkles,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Zap,
  X,
  Ban,
  Plus,
  Minus,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import DecisionHelperModal from '../components/DecisionHelperModal';
import Header from '../components/Header';
import QuizModal from '../components/QuizModal';
import PremiumHeroCard from '@/components/PremiumHeroCard';
import SecondaryOfferCard from '@/components/SecondaryOfferCard';
import ToolCard from '@/components/ToolCard';
import FloatingIcon from '@/components/ui/FloatingIcon';
import GlassCard from '@/components/ui/GlassCard';

const services = [
  {
    icon: Heart,
    title: 'Divorcios y Separaciones',
    description: 'Procesos de divorcio con enfoque humano y eficiente.',
    features: ['Divorcio de mutuo acuerdo', 'Divorcio unilateral', 'Separación de bienes', 'Compensación económica']
  },
  {
    icon: Baby,
    title: 'Pensiones de Alimentos',
    description: 'Establecimiento y cobro de pensiones alimenticias.',
    features: ['Demanda de alimentos', 'Aumento de pensión', 'Cobro ejecutivo', 'Liquidación de deudas']
  },
  {
    icon: Users,
    title: 'Filiación y Paternidad',
    description: 'Acciones de filiación y reconocimiento paterno.',
    features: ['Reconocimiento de paternidad', 'Pruebas de ADN', 'Impugnación de paternidad', 'Derechos del menor']
  },
  {
    icon: Home,
    title: 'Régimen de Visitas',
    description: 'Regulación del cuidado personal y visitas.',
    features: ['Cuidado personal compartido', 'Régimen comunicacional', 'Relación directa y regular', 'Modificación de régimen']
  },
  {
    icon: Shield,
    title: 'Violencia Intrafamiliar',
    description: 'Protección legal en casos de violencia familiar.',
    features: ['Medidas de protección', 'Denuncias VIF', 'Cautelares urgentes', 'Acompañamiento legal']
  },
  {
    icon: FileText,
    title: 'Adopción y Tutela',
    description: 'Procesos de adopción y designación de tutores.',
    features: ['Adopción simple y plena', 'Tutela y curaduría', 'Guarda del menor', 'Autorización judicial']
  }
];

const testimonials = [
  {
    name: 'María José Herrera',
    role: 'Madre de Familia',
    content: 'Me ayudaron a obtener la pensión de alimentos que mi hijo necesitaba. El proceso fue rápido y siempre me mantuvieron informada.',
    rating: 5
  },
  {
    name: 'Carlos Mendoza',
    role: 'Padre Divorciado',
    content: 'Logramos un divorcio de mutuo acuerdo sin complicaciones. Su enfoque humano hizo la diferencia en un momento difícil.',
    rating: 5
  },
  {
    name: 'Patricia Silva',
    role: 'Abuela Cuidadora',
    content: 'Obtuve la custodia de mi nieta gracias a su excelente trabajo. Son especialistas reales en derecho de familia.',
    rating: 5
  }
];

const stats = [
  { number: '2,400+', label: 'Familias asesoradas' },
  { number: '92%', label: 'Casos exitosos' },
  { number: '15d', label: 'Tiempo promedio tramitación' },
  { number: '24/7', label: 'Soporte en crisis' }
];

const packages = [
  {
    id: 'familia-integral',
    name: 'Protección Familiar Integral',
    shortName: 'Integral',
    price: '$550.000',
    originalPrice: '$1.100.000',
    discount: '50%',
    description: 'Común acuerdo + pensión',
    context: 'Ideal para acuerdos en buen pie y procesos colaborativos.',
    color: 'from-sky-500 to-cyan-600', // Adjusted color
    features: [
      'Divorcio de común acuerdo completo',
      'Regulación pensión + visitas',
      'Liquidación simple (hasta 2 bienes)',
      'Mediación familiar (2 sesiones)',
      'Hasta 5 audiencias incluidas',
      'Apoyo psicológico básico',
      'Seguimiento 3 meses',
      'WhatsApp horario laboral',
      '🎁 Upgrade gratis si no hay acuerdo'
    ],
    popular: false
  },
  {
    id: 'familia-premium',
    name: 'Defensa Familiar Premium',
    shortName: 'Premium',
    price: '$1.100.000',
    originalPrice: '$2.200.000',
    discount: '50%',
    description: 'Contencioso + equipo completo',
    context: 'Diseñado para defensas contenciosas con un equipo completo detrás.',
    color: 'from-pink-500 to-rose-600',
    features: [
      'Todo lo del plan Integral +',
      'Divorcio contencioso (audiencias ilimitadas)',
      'Compensación económica completa',
      'Liquidación compleja (hasta 5 bienes)',
      'Medidas precautorias y VIF',
      'Apoyo psicológico extendido (6 sesiones)',
      'WhatsApp prioritario (respuesta en 4h)',
      'Portal del cliente online',
      'Seguimiento 6 meses',
      '🎁 Apelación incluida sin costo'
    ],
    popular: true
  },
  {
    id: 'familia-elite',
    name: 'Blindaje Familiar Elite',
    shortName: 'Elite',
    price: '$1.700.000',
    originalPrice: '$3.400.000',
    discount: '50%',
    description: 'Casos complejos + internacional',
    context: 'Pensado para casos complejos, patrimonio familiar o alcance internacional.',
    color: 'from-purple-600 to-indigo-700',
    features: [
      'Todo lo del plan Premium +',
      'Casos con componente internacional',
      'Protección empresas familiares',
      'Coordinación legal completa',
      'Liquidación sin límite de bienes',
      'Abogado especializado dedicado',
      'Apoyo psicológico ilimitado',
      'WhatsApp 24/7 (incluye fines de semana)',
      'Seguimiento 12 meses + 1 modificación gratis',
      '🎁 Hasta Corte Suprema incluido'
    ],
    popular: false
  }
];

const planVisuals = {
  'familia-integral': {
    chip: 'border-sky-400/40 bg-sky-500/15 text-sky-100',
    iconColor: 'text-sky-200',
    iconRing: 'border-sky-400/40 bg-sky-500/10',
    buttonGradient: 'from-sky-400 via-cyan-400 to-emerald-400',
    buttonShadow: 'shadow-[0_22px_50px_rgba(14,165,233,0.35)]',
    glow: 'from-sky-400/25 via-emerald-400/10 to-transparent',
    border: 'border-sky-400/20',
  },
  'familia-premium': {
    chip: 'border-rose-400/40 bg-rose-500/15 text-rose-100',
    iconColor: 'text-pink-200',
    iconRing: 'border-rose-400/40 bg-rose-500/10',
    buttonGradient: 'from-pink-500 via-rose-500 to-amber-400',
    buttonShadow: 'shadow-[0_24px_55px_rgba(236,72,153,0.45)]',
    glow: 'from-rose-500/30 via-pink-500/10 to-transparent',
    border: 'border-rose-400/25',
  },
  'familia-elite': {
    chip: 'border-purple-400/40 bg-purple-500/15 text-purple-100',
    iconColor: 'text-purple-200',
    iconRing: 'border-purple-400/40 bg-purple-500/10',
    buttonGradient: 'from-purple-600 via-indigo-600 to-blue-500',
    buttonShadow: 'shadow-[0_24px_55px_rgba(99,102,241,0.45)]',
    glow: 'from-violet-500/25 via-indigo-500/10 to-transparent',
    border: 'border-indigo-400/20',
  },
} as const;

const successCases = [
  {
    amount: '$22M',
    case: 'Compensación económica recuperada',
    client: 'Claudia M., 41 años',
    plan: 'Premium',
    icon: DollarSign
  },
  {
    amount: '65%',
    case: 'Aumento en pensión alimenticia',
    client: 'Patricia R., 35 años',
    plan: 'Integral',
    icon: TrendingUp
  },
  {
    amount: '100%',
    case: 'Custodia completa obtenida',
    client: 'María S., 38 años',
    plan: 'Elite',
    icon: Heart
  }
];

const whyDifferent = [
  {
    icon: Ban,
    title: 'Sin Cobros Ocultos',
    description: 'Precio cerrado. Audiencias ilimitadas sin costo extra.',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    icon: Zap,
    title: 'Respuesta Rápida',
    description: 'WhatsApp directo. Respuesta en menos de 4 horas.',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    icon: CheckCircle,
    title: 'Garantía Real',
    description: 'Si no hay acuerdo, upgrade gratis o apelación incluida.',
    gradient: 'from-rose-400 to-pink-500'
  },
  {
    icon: Heart,
    title: 'Apoyo Integral',
    description: 'Abogado + apoyo psicológico trabajando para ti.',
    gradient: 'from-rose-500 to-pink-600'
  }
];

const faq = [
  {
    question: '¿Cuánto tiempo demora un proceso de divorcio?',
    answer: 'Un divorcio de mutuo acuerdo puede resolverse en 2-3 meses, mientras que un divorcio unilateral puede tomar 6-12 meses dependiendo de la complejidad del caso.'
  },
  {
    question: '¿Cómo se calcula una pensión de alimentos?',
    answer: 'La pensión se calcula considerando las necesidades del alimentario y las facultades económicas del alimentante, generalmente entre el 20% y 50% de los ingresos.'
  },
  {
    question: '¿Puedo modificar un régimen de visitas establecido?',
    answer: 'Sí, cuando cambien las circunstancias que motivaron la resolución original, se puede solicitar la modificación del régimen ante el tribunal.'
  },
  {
    question: '¿Qué documentos necesito para iniciar un proceso de filiación?',
    answer: 'Certificado de nacimiento del menor, antecedentes que acrediten la relación paterno-filial, y documentación de ingresos para efectos alimentarios.'
  },
  {
    question: '¿Qué incluye la Consulta Estratégica Premium?',
    answer: 'Reunión de 1 hora con abogado especializado, análisis completo de tu caso, estrategia legal personalizada y recomendación del plan ideal. Si contratas cualquier plan, los $150.000 se descuentan del total.'
  }
];

// Contador Auto-renovable
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getTargetDate = () => {
      const stored = localStorage.getItem('cyber_familia_end_date');
      if (stored) {
        const targetDate = new Date(stored);
        if (targetDate.getTime() < Date.now()) {
          const newTarget = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
          localStorage.setItem('cyber_familia_end_date', newTarget.toISOString());
          return newTarget;
        }
        return targetDate;
      } else {
        const newTarget = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        localStorage.setItem('cyber_familia_end_date', newTarget.toISOString());
        return newTarget;
      }
    };

    const calculateTimeLeft = () => {
      const target = getTargetDate();
      const difference = target.getTime() - Date.now();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { days: 3, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-2 md:gap-4">
      {[
        { value: String(timeLeft.days).padStart(2, '0'), label: 'Días' },
        { value: String(timeLeft.hours).padStart(2, '0'), label: 'Horas' },
        { value: String(timeLeft.minutes).padStart(2, '0'), label: 'Min' },
        { value: String(timeLeft.seconds).padStart(2, '0'), label: 'Seg' }
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl md:rounded-2xl p-2 md:p-3 shadow-xl shadow-rose-500/25 min-w-[45px] md:min-w-[70px]">
            <div className="text-xl md:text-3xl font-bold tabular-nums">{item.value}</div>
          </div>
          <div className="text-[9px] md:text-xs text-muted-foreground mt-1 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default function ServicioFamiliaPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showEliteModal, setShowEliteModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isHelperModalOpen, setIsHelperModalOpen] = useState(false);

  const openHelperModal = (plan: any) => {
    setSelectedPlan(plan);
    setIsHelperModalOpen(true);
  };

  return (
    <>
      <SEO
        title="Derecho de Familia: Divorcios, Pensiones, Custodia | Punto Legal Chile"
        description="Abogado especialista en Familia. Obtén tu Diagnóstico de Pensión por $6.990 o agenda tu Pack de Inicio. Consulta aquí."
      />

      <div className="min-h-screen bg-slate-900 text-slate-300 antialiased relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20rem] left-[-20rem] w-[50rem] h-[50rem] bg-gradient-radial from-pink-500/10 via-slate-900/0 to-transparent blur-3xl"></div>
          <div className="absolute bottom-[-20rem] right-[-20rem] w-[50rem] h-[50rem] bg-gradient-radial from-sky-500/10 via-slate-900/0 to-transparent blur-3xl"></div>
        </div>

        <Header />
        <div className="h-20" />

        {/* HERO */}
        <section className="relative pt-10 md:pt-14 pb-10 md:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-rose-500/10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-5xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-1.5 mb-4 border border-slate-700">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-sm font-medium text-slate-300">Abogado Especialista en Derecho de Familia</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-tight mb-4">
                Tu tranquilidad familiar, nuestra prioridad legal
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
                Enfrentar un problema familiar es difícil. Te damos claridad y defensa legal para proteger tu futuro.
              </p>
              <div className="max-w-lg mx-auto mt-8">
                <div className="relative p-4 md:p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
                  <div className="flex justify-center mb-3">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg text-xs md:text-sm font-bold">
                      <Sparkles className="w-4 h-4" />
                      HASTA 50% OFF (Cyber Extendido)
                    </div>
                  </div>
                  <h3 className="text-sm md:text-lg font-bold text-center mb-3 bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                    Termina en:
                  </h3>
                  <CountdownTimer />
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-slate-500 mt-3">
                    <AlertCircle className="w-4 h-4 text-pink-500" />
                    <span>Cupos limitados este mes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECCIÓN “Guía de caminos” */}
        <section className="relative overflow-hidden border-t border-slate-800/60 bg-slate-950 py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_55%)]" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                3 caminos diseñados para ti
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Encuentra tu camino hacia la tranquilidad
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Hemos diseñado rutas claras para cada etapa del proceso familiar. Parte gratis, avanza con IA o agenda directo con tu abogado especializado.
              </p>
            </div>

            <div className="relative mt-12 rounded-[32px] border border-white/10 bg-slate-950/60 p-4 shadow-2xl shadow-black/40 md:p-8">
              <FloatingIcon
                icon={Sparkles}
                className="hidden md:block -left-4 top-8 opacity-30 blur-3xl"
                size={120}
                colorClass="from-sky-500/25 to-purple-500/30"
              />
              <FloatingIcon
                icon={Zap}
                className="hidden md:block right-12 -bottom-6 opacity-30 blur-3xl"
                size={150}
                colorClass="from-pink-500/20 to-amber-500/25"
              />

              <div className="relative z-10 grid items-stretch gap-6 md:grid-cols-3 md:gap-8">
                {/* Izquierda: Diagnóstico Gratis */}
                <div className="order-1">
                  <ToolCard
                    icon={Sparkles}
                    title="Descubre tu Plan Ideal"
                    description="¿No tienes claro por dónde empezar? Responde 3 preguntas y recibe una recomendación de plan <strong>gratis</strong> y sin compromiso."
                    context="Ideal si estás explorando opciones o necesitas claridad inicial."
                    price="$0"
                    ctaText="Empezar el Quiz Gratis"
                    onClick={() => setShowQuiz(true)}
                    badge="Empieza aquí si tienes dudas"
                  />
                </div>

                {/* Centro: Diagnóstico IA */}
                <div className="order-3 md:order-2">
                  <SecondaryOfferCard
                    icon={Zap}
                    title="Diagnóstico de Pensión IA"
                    description="Obtén un <strong>Diagnóstico de Pensión 100% automatizado</strong>, entrenado por tu abogado, y recibe un PDF con <strong>montos estimados y riesgos clave</strong> en menos de 3 minutos."
                    context="Perfecto cuando necesitas una estimación concreta para decidir rápido."
                    price="$6.990"
                    priceDetails="Precio Normal: $13.990 (50% OFF Cyber)"
                    ctaText="Obtener Claridad Ahora"
                    href="/pago/diagnostico-ia"
                    badge="Para una respuesta inmediata"
                  />
                </div>

                {/* Derecha: Estrategia Personalizada */}
                <div className="order-2 md:order-3">
                  <PremiumHeroCard
                    title="Consulta Estratégica con Abogado"
                    description="Agenda 1 hora de trabajo <strong>directo con tu abogado especialista</strong> para ordenar tu caso, definir un <strong>Plan de Acción claro</strong> y saber exactamente qué hacer en los próximos 30 días."
                    context="Para quienes quieren acompañamiento completo, ejecución y seguimiento experto."
                    price="$150.000"
                    priceTag="Consulta preferente Cyber"
                    originalPrice="$300.000"
                    priceDetails="Se descuenta íntegramente del plan final y asegura prioridad en agenda."
                    deliverableLabel="PDF + asesoría"
                    ctaText="Agendar Pack con Garantía"
                    href="/agendamiento?plan=consulta-estrategica-familia"
                    testimonial={{
                      quote: 'En 1 hora me dio más claridad que meses de incertidumbre. Valió cada peso.',
                      author: 'Conztanza M., Las Condes',
                    }}
                    highlightLabel="El Camino Directo al Éxito"
                  />
                </div>
              </div>

              <div className="relative z-10 mt-8 flex flex-col items-center gap-4 text-xs text-slate-400 md:flex-row md:justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                  <Shield className="h-3.5 w-3.5 text-pink-400" />
                  Garantía Cyber 50%
                </div>
                <p className="text-center text-slate-500 md:text-left">
                  Promoción renovable cada 72 horas según disponibilidad. Cupos limitados por agenda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN “Servicios” */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12 text-slate-200">
              Te representamos en todas las áreas del Derecho de Familia
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="bg-slate-900/60 border border-slate-800 p-5 md:p-6 rounded-3xl h-full shadow-md shadow-slate-950/40 hover:border-pink-500/40 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-2xl bg-slate-800/80 flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-pink-400" />
                      </div>
                      <h3 className="text-sm md:text-base font-semibold md:font-bold text-slate-100 tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-3">
                      {service.description}
                    </p>
                    <p className="text-[11px] md:text-xs text-slate-500">
                      <span className="text-slate-400">Incluye: </span>
                      <span className="text-slate-300">{service.features.slice(0, 2).join(' · ')}</span>
                      {service.features.length > 2 && <span className="text-pink-400"> · y más</span>}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN “¿Por qué Punto Legal…?” */}
        <section className="py-12 md:py-16 bg-slate-900/60">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white">
              ¿Por qué somos diferentes?
            </h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {whyDifferent.slice(0, 2).map((item, i) => (
                <div key={i}>
                  <div className="relative rounded-3xl h-full border border-slate-800 bg-slate-900/60 p-6 text-left shadow-md shadow-slate-950/40">
                    <div className="flex justify-start mb-4">
                      <div className={`w-11 h-11 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold md:font-bold mb-2 text-slate-100">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
              Familias que recuperaron su tranquilidad 💬
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl h-full shadow-md shadow-slate-950/40">
                    <div className="flex items-center justify-between mb-3">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700">
                        <span className="text-xs" aria-hidden="true">
                          ⭐️⭐️⭐️⭐️⭐️
                        </span>
                        <span className="text-[11px] font-medium text-slate-200">
                          Experiencia verificada
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {testimonial.role}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-slate-300 mb-4 italic leading-relaxed">
                      “{testimonial.content}”
                    </p>
                    <p className="text-sm font-semibold text-slate-100">
                      {testimonial.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CASOS DE ÉXITO */}
        <section className="py-12 md:py-16 bg-slate-900/70">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
              Resultados que hablan por sí solos
            </h2>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {successCases.map((c, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl h-full shadow-md shadow-slate-950/40 text-left">
                    <c.icon
                      className={`w-8 h-8 mb-3 ${
                        c.plan === 'Premium'
                          ? 'text-pink-400'
                          : c.plan === 'Integral'
                          ? 'text-sky-400'
                          : 'text-purple-400'
                      }`}
                    />
                    <div
                      className={`text-2xl md:text-3xl font-bold mb-1 ${
                        c.plan === 'Premium'
                          ? 'text-pink-400'
                          : c.plan === 'Integral'
                          ? 'text-sky-400'
                          : 'text-purple-400'
                      }`}
                    >
                      {c.amount}
                    </div>
                    <div className="font-semibold mb-2 text-slate-100">
                      {c.case}
                    </div>
                    <div className="text-[11px] md:text-xs text-slate-500">
                      {c.client} (Plan {c.plan})
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PACKAGES (Planes completos) */}
        <section className="py-12 md:py-16 bg-slate-900/80 border-t border-slate-800 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              Planes de Protección Integral
            </h2>
            <p className="text-lg text-slate-400 text-center mb-10 md:mb-16 max-w-2xl mx-auto">
              Cuando buscas una solución completa y representación total, estos son nuestros planes de servicio.
            </p>
            <FloatingIcon
              icon={Shield}
              className="hidden lg:block left-6 top-8 opacity-20 blur-3xl"
              size={150}
              colorClass="from-purple-500/20 to-indigo-500/25"
            />
            <FloatingIcon
              icon={Heart}
              className="hidden lg:block right-10 bottom-0 opacity-25 blur-2xl"
              size={140}
              colorClass="from-pink-500/20 to-rose-500/25"
            />
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start relative z-10">
              {packages.map((pkg, index) => {
                const visuals = planVisuals[pkg.id as keyof typeof planVisuals];
                const ButtonIcon = pkg.id === 'familia-elite' ? Scale : Sparkles;
                const buttonLabel =
                  pkg.id === 'familia-elite'
                    ? 'Blindaje Elite Personalizado'
                    : pkg.id === 'familia-premium'
                    ? 'Elegir Plan Premium (Recomendado)'
                    : 'Elegir Plan Integral';

                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative ${pkg.popular ? 'lg:scale-105 z-10' : ''}`}
                  >
                    <GlassCard
                      className={`relative flex h-full flex-col overflow-hidden ${visuals.border} bg-slate-950/80 p-8 backdrop-blur-3xl ${
                        pkg.popular ? 'ring-2 ring-pink-500/35 shadow-[0_30px_80px_rgba(236,72,153,0.25)]' : 'shadow-[0_20px_60px_rgba(15,23,42,0.45)]'
                      }`}
                    >
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${visuals.glow}`} />
                      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-[120px]" />

                      <div className="relative z-10 flex h-full flex-col">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] ${
                              visuals.chip
                            }`}
                          >
                            {pkg.discount} OFF
                          </span>
                          {pkg.popular && (
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-pink-100">
                              Más elegido
                            </span>
                          )}
                        </div>

                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Plan {pkg.shortName}</p>
                          <h3 className="mt-1 text-2xl font-bold text-white">{pkg.name}</h3>
                          <p className="mt-2 text-slate-300">{pkg.description}</p>
                          {pkg.context && (
                            <p className="text-sm text-slate-400">
                              {pkg.context}
                            </p>
                          )}
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="flex items-end justify-between gap-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Inversión preferente</p>
                              <div className="text-4xl font-bold text-white">{pkg.price}</div>
                            </div>
                            <span className="text-sm font-semibold text-white/70">
                              Nivel {pkg.id === 'familia-integral' ? '1' : pkg.id === 'familia-premium' ? '2' : '3'}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-400">
                            <span className="text-slate-500">Valor normal:</span>{' '}
                            <span className="line-through">{pkg.originalPrice}</span>
                          </p>
                        </div>

                        <ul className="mt-6 space-y-3 text-sm flex-1">
                          {pkg.features.map((feature) => {
                            const isBonus = feature.includes('🎁');
                            const cleanFeature = feature.replace('🎁 ', '');

                            return (
                              <li key={feature} className="flex items-start gap-3">
                                <div
                                  className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border ${visuals.iconRing}`}
                                >
                                  <CheckCircle className={`h-4 w-4 ${visuals.iconColor}`} />
                                </div>
                                <span className="text-slate-200">{cleanFeature}</span>
                                {isBonus && (
                                  <span className="ml-auto text-[10px] uppercase tracking-[0.3em] text-amber-300">
                                    Bonus
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>

                        <button
                          onClick={() => openHelperModal(pkg)}
                          className={`group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-r ${visuals.buttonGradient} px-5 py-3.5 text-base font-semibold uppercase tracking-wide text-white ${visuals.buttonShadow} transition-transform hover:scale-[1.02]`}
                        >
                          <ButtonIcon className="h-5 w-5" />
                          <span>{buttonLabel}</span>
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-8 md:py-10 bg-slate-900">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-center shadow-sm shadow-slate-950/30"
                >
                  <div className="text-2xl md:text-3xl font-bold text-slate-100 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-[11px] md:text-xs text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Resolvemos tus dudas</h2>
            <div className="space-y-0">
              {faq.map((item, index) => (
                <FaqItem key={index} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="pb-20 sm:pb-28">
          <div className="container mx-auto px-6">
            <div className="relative bg-gradient-to-r from-pink-600 to-sky-600 rounded-2xl p-12 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-slate-900/30 mix-blend-multiply"></div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">¿Listo/a para recuperar tu tranquilidad?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-pink-100">No dejes que las dudas te paralicen. Elige el primer paso que te acomode hoy.</p>
                <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                  <Link
                    to="/pago/diagnostico-ia"
                    className="bg-white/10 border border-white/30 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/20 transition-all w-full md:w-auto"
                  >
                    Obtener Diagnóstico Inmediato ($6.990)
                  </Link>
                  <Link
                    to="/agendamiento?plan=consulta-estrategica-familia"
                    className="bg-white text-pink-600 font-bold py-3 px-8 rounded-lg hover:bg-pink-50 transition-transform hover:scale-105 inline-block shadow-lg w-full md:w-auto"
                  >
                    Agendar Pack de Inicio (Garantizado)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800 py-8">
          <div className="container mx-auto px-6 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} Punto Legal Online. Todos los derechos reservados.</p>
            <p className="text-xs mt-2">La información en este sitio es referencial y no constituye asesoría legal. <a href="#empezar" className="text-pink-400 hover:text-pink-300 underline">Agenda una consulta</a> para evaluar tu caso.</p>
          </div>
        </footer>
      </div>

      <QuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
      <AnimatePresence>
        {isHelperModalOpen && selectedPlan && (
          <DecisionHelperModal
            isOpen={isHelperModalOpen}
            onClose={() => setIsHelperModalOpen(false)}
            plan={selectedPlan}
          />
        )}
      </AnimatePresence>
      <EliteModal isOpen={showEliteModal} onClose={() => setShowEliteModal(false)} />
      <ExitIntentModal isOpen={showExitModal} onClose={() => setShowExitModal(false)} />
    </>
  );
}

const FaqItem: React.FC<{ item: { question: string; answer: string } }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-700">
      <button
        className="w-full flex justify-between items-center text-left py-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-slate-200 hover:text-pink-400 transition-colors pr-4">{item.question}</h3>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <Minus className="text-pink-400 h-5 w-5 flex-shrink-0" /> : <Plus className="text-slate-400 h-5 w-5 flex-shrink-0" />}
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-slate-400 pr-6">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EliteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold mb-4">Modal Elite (Próximamente)</h3>
        <p className="text-muted-foreground">Formulario para Nombre y Teléfono irá aquí.</p>
      </div>
    </div>
  );
};

const ExitIntentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold mb-4">¡Espera! (Modal Salida Próximamente)</h3>
        <p className="text-muted-foreground">Oferta de Lead Magnet (PDF Gratis) a cambio de email irá aquí.</p>
      </div>
    </div>
  );
};
