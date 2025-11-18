import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Heart, Users, Baby, Scale, FileText, Home, CheckCircle, Star, Clock, Award, 
  ArrowRight, Calendar, Shield, Sparkles, AlertCircle, TrendingUp, 
  DollarSign, Zap, X, ChevronLeft, Ban
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import CountdownTimer from "@/components/familia/CountdownTimer"
import QuizModal from "@/components/familia/QuizModal"
import FamilyIntakeModal from "@/components/familia/FamilyIntakeModal"

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
]

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
]

const stats = [
  { number: '2,400+', label: 'Familias asesoradas' },
  { number: '92%', label: 'Casos exitosos' },
  { number: '15d', label: 'Tiempo promedio tramitación' },
  { number: '24/7', label: 'Soporte en crisis' }
]

const packages = [
  {
    id: 'familia-integral',
    name: 'Protección Familiar Integral',
    shortName: 'Integral',
    price: '$550.000',
    originalPrice: '$1.100.000',
    discount: '50%',
    description: 'Común acuerdo + pensión',
    features: [
      'Divorcio de común acuerdo completo',
      'Regulación pensión + visitas',
      'Liquidación simple (hasta 2 bienes)',
      'Mediación familiar (2 sesiones)',
      'Hasta 5 audiencias incluidas',
      'Apoyo psicológico básico',
      'Seguimiento 3 meses',
      'WhatsApp horario laboral',
      'Upgrade sin costo si no hay acuerdo'
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
      'Apelación incluida sin costo adicional'
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
      'Hasta Corte Suprema incluido'
    ],
    popular: false
  }
]

const successCases = [
  {
    amount: '$22M',
    color: 'from-emerald-500 to-green-600',
    case: 'Compensación económica recuperada',
    client: 'Claudia M., 41 años',
    plan: 'Premium',
    icon: DollarSign
  },
  {
    amount: '65%',
    color: 'from-blue-500 to-cyan-600',
    case: 'Aumento en pensión alimenticia',
    client: 'Patricia R., 35 años',
    plan: 'Integral',
    icon: TrendingUp
  },
  {
    amount: '100%',
    color: 'from-purple-500 to-pink-600',
    case: 'Custodia completa obtenida',
    client: 'María S., 38 años',
    plan: 'Elite',
    icon: Heart
  }
]

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
]

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
    answer: 'Reunión de 2 horas con abogado especializado, análisis completo de tu caso, estrategia legal personalizada y recomendación del plan ideal. Si contratas cualquier plan, los $150.000 se descuentan del total.'
  }
]

// Contador Auto-renovable
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const getTargetDate = () => {
      const stored = localStorage.getItem('cyber_familia_end_date')
      if (stored) {
        const targetDate = new Date(stored)
        if (targetDate.getTime() < Date.now()) {
          const newTarget = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          localStorage.setItem('cyber_familia_end_date', newTarget.toISOString())
          return newTarget
        }
        return targetDate
      } else {
        const newTarget = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        localStorage.setItem('cyber_familia_end_date', newTarget.toISOString())
        return newTarget
      }
    }

    const calculateTimeLeft = () => {
      const target = getTargetDate()
      const difference = target.getTime() - Date.now()
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }
      return { days: 3, hours: 0, minutes: 0, seconds: 0 }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

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
  )
}

// Quiz Modal MEJORADO - Más Opciones
const QuizModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<any>({})
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const getRecommendation = () => {
    const servicio = answers.servicio
    
    // Lógica mejorada basada en el servicio
    if (servicio === 'vif' || servicio === 'custodia-urgente' || answers.internacional === 'si') {
      return 'elite'
    }
    if (servicio === 'divorcio-contencioso' || servicio === 'pension-compleja' || answers.empresa === 'si') {
      return 'premium'
    }
    return 'integral'
  }

  const saveToSupabase = async () => {
    setIsSaving(true)
    try {
      const { supabase } = await import('@/integrations/supabase/client')
      const recommendation = getRecommendation()
      
      const { error } = await supabase
        .from('family_quiz_responses')
        .insert({
          email,
          nombre: nombre || null,
          servicio: answers.servicio || 'no_especificado',
          bienes: answers.bienes || null,
          empresa: answers.empresa || null,
          internacional: answers.internacional || null,
          recommended_plan: recommendation
        })
      
      if (error) {
        console.error('Error guardando respuesta:', error)
      } else {
        console.log('✅ Respuesta guardada exitosamente')
      }
    } catch (error) {
      console.error('Error guardando en Supabase:', error)
    } finally {
      setIsSaving(false)
      setStep(5) // Pasar al resultado
    }
  }

  const planDetails = {
    integral: { name: 'Protección Familiar Integral', price: '$550.000', plan: 'familia-integral' },
    premium: { name: 'Defensa Familiar Premium', price: '$1.100.000', plan: 'familia-premium' },
    elite: { name: 'Blindaje Familiar Elite', price: '$1.700.000', plan: 'familia-elite' }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border border-white/20 my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl md:text-2xl font-bold mb-6 pr-8">Encuentra tu plan ideal</h3>
        
        {step === 1 && (
          <div className="space-y-4">
            <p className="font-medium mb-4 text-sm md:text-base">¿Qué servicio necesitas?</p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => { setAnswers({ ...answers, servicio: 'divorcio-acuerdo' }); setStep(2) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base mb-1">💑 Divorcio de Común Acuerdo</div>
                <div className="text-xs md:text-sm text-muted-foreground">Ambos de acuerdo en separarse</div>
              </button>
              <button
                onClick={() => { setAnswers({ ...answers, servicio: 'divorcio-contencioso' }); setStep(2) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base mb-1">⚖️ Divorcio Contencioso</div>
                <div className="text-xs md:text-sm text-muted-foreground">Hay desacuerdos importantes</div>
              </button>
              <button
                onClick={() => { setAnswers({ ...answers, servicio: 'pension' }); setStep(2) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base mb-1">👶 Pensión de Alimentos</div>
                <div className="text-xs md:text-sm text-muted-foreground">Demanda, aumento o cobro</div>
              </button>
              <button
                onClick={() => { setAnswers({ ...answers, servicio: 'custodia' }); setStep(2) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base mb-1">👨‍👩‍👧 Custodia y Visitas</div>
                <div className="text-xs md:text-sm text-muted-foreground">Cuidado personal y régimen de visitas</div>
              </button>
              <button
                onClick={() => { setAnswers({ ...answers, servicio: 'vif' }); setStep(2) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base mb-1">🛡️ Violencia Intrafamiliar (VIF)</div>
                <div className="text-xs md:text-sm text-muted-foreground">Medidas de protección urgentes</div>
              </button>
              <button
                onClick={() => { setAnswers({ ...answers, servicio: 'otro' }); setStep(2) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base mb-1">📄 Otro (Adopción, Filiación, etc.)</div>
                <div className="text-xs md:text-sm text-muted-foreground">Otros temas familiares</div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="font-medium mb-4 text-sm md:text-base">¿Hay patrimonio empresarial involucrado?</p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => { setAnswers({ ...answers, empresa: 'no' }); setStep(3) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base">No, solo bienes personales</div>
              </button>
              <button
                onClick={() => { setAnswers({ ...answers, empresa: 'si' }); setStep(3) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base">Sí, hay empresas o sociedades</div>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="font-medium mb-4 text-sm md:text-base">¿Hay componente internacional?</p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => { setAnswers({ ...answers, internacional: 'no' }); setStep(4) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base">No, todo en Chile</div>
              </button>
              <button
                onClick={() => { setAnswers({ ...answers, internacional: 'si' }); setStep(4) }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
              >
                <div className="font-semibold text-sm md:text-base">Sí, menores o bienes en el extranjero</div>
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold mb-2">¡Casi listo! 🎯</h4>
              <p className="text-sm text-muted-foreground">
                Ingresa tu email para recibir tu plan recomendado personalizado
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre (opcional)
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
              
              <button
                onClick={saveToSupabase}
                disabled={!email || isSaving}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Guardando...' : 'Ver Mi Plan Recomendado'}
              </button>
              
              <button
                onClick={() => setStep(3)}
                className="block w-full text-center py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {step === 5 && (() => {
          const recommendation = getRecommendation()
          const plan = planDetails[recommendation as keyof typeof planDetails]
          
          return (
            <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl border border-pink-200/50 dark:border-pink-800/50">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-rose-600" />
                <h4 className="font-bold text-base md:text-lg">Recomendamos: {plan.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Precio CYBER: <span className="text-2xl md:text-3xl font-bold text-rose-600">{plan.price}</span>
              </p>
              <Link 
                to={`/agendamiento?plan=${plan.plan}`}
                className="block w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-center py-3 md:py-4 rounded-xl font-semibold hover:shadow-xl transition-all shadow-2xl shadow-rose-500/30"
              >
                Agendar Ahora
              </Link>
              <button
                onClick={() => { setStep(1); setAnswers({}) }}
                className="block w-full mt-3 text-center py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Volver a empezar
              </button>
            </div>
          )
        })()}
      </motion.div>
    </div>
  )
}

export default function ServicioFamiliaPage() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [isIntakeOpen, setIsIntakeOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'integral' | 'premium' | 'elite';
    name: string;
    price: string;
  } | null>(null)

  const handlePlanSelect = (type: 'integral' | 'premium' | 'elite', name: string, price: string) => {
    setSelectedPlan({ type, name, price })
    setIsIntakeOpen(true)
  }

  return (
    <>
      <SEO 
        title="Derecho de Familia Premium - Divorcios | Punto Legal"
        description="Protección familiar integral. Divorcios, pensiones, custodia. Planes desde $550k. CYBER 50% OFF."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 relative pb-24">
        {/* Patrón de fondo */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(236 72 153 / 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Header Móvil Sticky */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-white/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <a href="https://puntolegal.online" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-5 h-5" />
                Volver
              </a>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-semibold">Familia</span>
              </div>
              <a href="https://puntolegal.online" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                <Home className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Hero + Consulta Estratégica + Planes - Look iOS */}
        <section className="relative pt-6 md:pt-12 pb-8 md:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-rose-500/10" />
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Hero Compacto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-5xl mx-auto mb-6 md:mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-pink-500/10 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-3 md:mb-4 backdrop-blur-sm border border-pink-200/50">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                <span className="text-xs md:text-sm font-medium text-rose-600">Especialistas en Derecho de Familia</span>
              </div>
              
              <h1 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent leading-tight px-2">
                Tu familia, protegida con estrategia y empatía
              </h1>

              {/* Consulta Estratégica Premium - CTA Prominente */}
              <div className="max-w-2xl mx-auto mb-6 md:mb-8">
                <div className="relative rounded-3xl">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-pink-600/20 blur-xl" />
                  <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-white/60 via-pink-200/40 to-rose-200/60">
                    <div className="h-full w-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl" />
                  </div>
                  
                  <div className="relative p-6 md:p-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold">
                        50% OFF CYBER
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                      Consulta Estratégica Premium
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-4">
                      Análisis completo de tu caso + hoja de ruta + 100% reembolsable si contratas un plan
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground line-through mb-1">$300.000</div>
                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                          $150.000
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/agendamiento?plan=consulta-estrategica-familia"
                      className="block w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-base md:text-lg"
                      style={{
                        boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)'
                      }}
                    >
                      <Calendar className="w-5 h-5" />
                      Agendar Consulta Estratégica
                    </Link>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-3">
                      <CheckCircle className="w-4 h-4 text-rose-500" />
                      <span>Reembolso completo si contratas cualquier plan</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contador CYBER */}
              <div className="max-w-lg mx-auto mb-6">
                <div className="relative rounded-3xl">
                  <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-white/60 via-pink-200/40 to-rose-200/60">
                    <div className="h-full w-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl" />
                  </div>
                  
                  <div className="relative p-4 md:p-6">
                    <div className="flex justify-center mb-3">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg text-xs md:text-sm font-bold">
                        <Sparkles className="w-4 h-4" />
                        50% OFF CYBER
                      </div>
                    </div>
                    
                    <h3 className="text-sm md:text-lg font-bold text-center mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                      Oferta termina en:
                    </h3>
                    
                    <CountdownTimer />
                    
                    <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground mt-3">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span>Solo <strong className="text-rose-600">8 cupos</strong> disponibles este mes</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* PLANES - Look iOS Glassmorphism */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={pkg.popular ? 'md:scale-105' : ''}
                >
                  <div className="relative rounded-3xl h-full">
                    {/* Glow effect para el más popular */}
                    {pkg.popular && (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-pink-600/20 blur-xl" />
                    )}
                    
                    <div className={`absolute inset-0 rounded-3xl p-[1px] ${
                      pkg.popular
                        ? 'bg-gradient-to-br from-pink-400/60 via-rose-400/60 to-pink-400/60'
                        : 'bg-gradient-to-br from-white/50 via-gray-200/30 to-white/50 dark:from-gray-700/50'
                    }`}>
                      <div className="h-full w-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl" />
                    </div>
                    
                    <div className="relative p-5 md:p-8">
                      {pkg.popular && (
                        <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2">
                          <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-3 md:px-5 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-xl shadow-rose-500/30">
                            ⭐ Más Popular
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center mb-4 md:mb-6">
                        <h3 className="text-base md:text-2xl font-bold mb-1 md:mb-2">{pkg.shortName}</h3>
                        <p className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-4">{pkg.description}</p>
                        
                        <div className="mb-1 md:mb-2">
                          <span className="text-xs md:text-base text-gray-500 line-through">{pkg.originalPrice}</span>
                        </div>
                        <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-2">
                          {pkg.price}
                        </div>
                        
                        <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
                          {pkg.discount} OFF
                        </div>
                      </div>
                      
                      <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-6 min-h-[120px] md:min-h-[200px]">
                        {pkg.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                            <span className="text-[10px] md:text-xs leading-tight">{feature}</span>
                          </li>
                        ))}
                        {pkg.features.length > 5 && (
                          <li className="text-[10px] md:text-xs text-muted-foreground italic">
                            +{pkg.features.length - 5} beneficios más
                          </li>
                        )}
                      </ul>
                      
                      <button
                        onClick={() => handlePlanSelect(
                          pkg.id.replace('familia-', '') as 'integral' | 'premium' | 'elite',
                          pkg.name,
                          `${pkg.price} (antes ${pkg.originalPrice})`
                        )}
                        className={`block w-full text-center py-3 md:py-4 px-4 rounded-2xl font-bold transition-all duration-300 text-sm md:text-base ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-2xl hover:shadow-rose-500/40'
                            : 'bg-white/60 dark:bg-slate-800/60 border border-pink-200/50 dark:border-pink-900/50 text-rose-700 dark:text-rose-400 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm'
                        }`}
                        style={pkg.popular ? {
                          boxShadow: '0 8px 24px rgba(244, 63, 94, 0.3)'
                        } : undefined}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Elegir {pkg.shortName}
                        </div>
                      </button>
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Botón Quiz - Look iOS */}
            <div className="text-center mt-8">
              <div className="max-w-md mx-auto">
                <div className="relative rounded-3xl">
                  <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-white/50 via-gray-200/30 to-white/50">
                    <div className="h-full w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl" />
                  </div>
                  
                  <div className="relative p-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      ¿No sabes cuál plan necesitas?
                    </p>
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="w-full py-4 bg-white/80 dark:bg-slate-800/80 border border-pink-200/50 dark:border-pink-900/50 text-rose-700 dark:text-rose-400 rounded-2xl font-bold hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Descubre tu plan ideal en 2 minutos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 md:py-12 bg-gradient-to-r from-pink-50/50 to-rose-50/50 dark:from-pink-950/10 dark:to-rose-950/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-rose-600 mb-1">{stat.number}</div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">{stat.label}</div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por qué somos diferentes */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-pink-50/30 to-rose-50/30 dark:from-pink-950/10 dark:to-rose-950/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12">¿Por qué elegirnos?</h2>

            <div className="grid md:grid-cols-4 gap-4 md:gap-6">
              {whyDifferent.map((item, i) => (
                <div key={i}>
                  <div className="relative rounded-2xl h-full">
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/40 via-gray-200/20 to-white/40">
                      <div className="h-full w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl" />
                    </div>
                    
                    <div className="relative p-4 md:p-6">
                      <div className={`w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-lg`}>
                        <item.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                      </div>
                      
                      <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">{item.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Consulta Estratégica */}
        <section id="consulta-section" className="py-12 md:py-16 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-2xl">
                <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/40 via-gray-200/30 to-white/40">
                  <div className="h-full w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl" />
                </div>
                
                <div className="relative p-5 md:p-8">
                  <div className="text-center mb-4 md:mb-6">
                    <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold mb-3 border border-amber-200/50">
                      50% OFF
                    </div>
                    
                    <h3 className="text-lg md:text-3xl font-bold mb-2 md:mb-3">Consulta Estratégica Premium</h3>
                    
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-3">
                      <span className="text-2xl md:text-4xl font-bold text-rose-600">$150.000</span>
                      <span className="text-base md:text-xl text-gray-500 line-through">$300.000</span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm mb-4 md:mb-6">
                    {['Análisis completo con abogado', 'Estrategia personalizada', 'Recomendación de plan', '100% reembolsable'].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3 md:p-4 mb-4">
                    <p className="text-xs md:text-sm font-medium text-rose-800 dark:text-rose-200 text-center">
                      💎 Se descuenta 100% si contratas un plan
                    </p>
                  </div>
                  
                  <Link
                    to="/agendamiento?plan=consulta-estrategica-familia"
                    className="block w-full bg-rose-600 text-white text-center py-2.5 md:py-3 rounded-xl font-semibold hover:bg-rose-700 transition-all shadow-lg text-sm md:text-base"
                  >
                    Agendar Consulta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Casos de Éxito */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-pink-50/30 to-rose-50/30 dark:from-pink-950/10 dark:to-rose-950/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-pink-500/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-3 border border-pink-200/50">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                <span className="text-xs md:text-sm font-semibold text-rose-600">Resultados Reales</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Casos de Éxito</h2>
              <p className="text-sm md:text-lg text-muted-foreground">Resultados verificados de clientes reales</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
              {successCases.map((item, i) => (
                <div key={i}>
                  <div className="relative rounded-2xl">
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/40 via-gray-200/20 to-white/40">
                      <div className="h-full w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl" />
                    </div>
                    
                    <div className="relative p-4 md:p-6">
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                        <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      
                      <div className={`text-3xl md:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>
                        {item.amount}
                      </div>
                      
                      <p className="text-xs md:text-sm font-medium mb-3 text-foreground">{item.case}</p>
                      
                      <div className="pt-3 border-t border-current/10">
                        <p className="text-xs text-muted-foreground mb-1">{item.client}</p>
                        <div className="inline-flex items-center gap-1 bg-white/60 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-medium">{item.plan}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Servicios Especializados */}
        <section className="py-12 md:py-16 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12">Áreas Especializadas</h2>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {services.map((service, index) => (
                <div key={index}>
                  <div className="relative rounded-2xl">
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/40 via-gray-200/20 to-white/40">
                      <div className="h-full w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl" />
                    </div>
                    
                    <div className="relative p-5 md:p-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                        <service.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      
                      <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">{service.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{service.description}</p>
                      
                      <ul className="space-y-1.5 md:space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs md:text-sm">
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-rose-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimoniales */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-pink-50/30 to-rose-50/30 dark:from-pink-950/10 dark:to-rose-950/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12">Familias que Confiaron en Nosotros</h2>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index}>
                  <div className="relative rounded-2xl">
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/40 via-gray-200/20 to-white/40">
                      <div className="h-full w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl" />
                    </div>
                    
                    <div className="relative p-5 md:p-6">
                      <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                      <p className="text-xs md:text-sm text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  
                  <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-semibold text-sm md:text-lg">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                          <div className="font-semibold text-sm md:text-base">{testimonial.name}</div>
                          <div className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12">Preguntas Frecuentes</h2>

            <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
              {faq.map((item, index) => (
                <div key={index}>
                  <div className="relative rounded-2xl">
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/40 via-gray-200/20 to-white/40">
                      <div className="h-full w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl" />
                    </div>
                    
                    <div className="relative p-5 md:p-8">
                      <h3 className="text-sm md:text-lg font-bold mb-2 md:mb-4">{item.question}</h3>
                      <p className="text-xs md:text-base text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600" />
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
                ¿Necesitas Asesoría Urgente?
              </h2>
              <p className="text-sm md:text-xl text-white/90 mb-6 md:mb-8">
                Nuestros especialistas están listos para proteger a tu familia.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/agendamiento?plan=consulta-estrategica-familia"
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-rose-600 rounded-xl font-semibold hover:bg-gray-50 shadow-2xl flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Calendar className="w-5 h-5" />
                  Consulta $150k
                </Link>
                <Link
                  to="/agendamiento?plan=familia"
                  className="px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Shield className="w-5 h-5" />
                  Agendar Consulta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quiz Modal */}
      <QuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} />

      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
}
