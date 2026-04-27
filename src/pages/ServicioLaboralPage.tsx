import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Scale,
  FileText,
  Users,
  TrendingUp,
  Shield,
  Globe,
  CheckCircle,
  Calendar,
  AlertTriangle,
  Plus,
  Minus,
  ArrowRight,
  Briefcase,
  Award,
  Clock,
  ListOrdered,
  Sparkles,
  Receipt,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO'
import { PUNTO_LEGAL_FOUNDER_NAME } from '@/constants/brandIdentity'
import ServicioPageShell from '@/components/servicios/ServicioPageShell'
import { LaboralThemeToggle } from '@/components/servicios/LaboralThemeToggle'
import { getLaboralPageSkin } from '@/components/servicios/laboralPageSkin'
import { useServicioTheme } from '@/components/servicios/servicioThemeContext'
import TestimonialBubble from '@/components/servicios/TestimonialBubble'
import { useTheme } from '@/hooks/useTheme'

const services = [
  {
    icon: Scale,
    title: 'Despidos y término de contrato',
    description:
      'Asesoría en despidos y términos de contrato: revisión de causal, finiquito y vías de impugnación según tu caso.',
    features: [
      'Despidos injustificados',
      'Indemnizaciones',
      'Finiquitos',
      'Tutela de derechos fundamentales',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Ley Karin y acoso laboral',
    description:
      'Asesoría en acoso, hostigamiento y procedimiento bajo la Ley 21.643: orientación sobre tutela y medidas según tu caso.',
    features: ['Ley 21.643 — ámbitos laboral y sexual', 'Acoso y discriminación', 'Canales y plazos', 'Tutela de derechos'],
  },
  {
    icon: FileText,
    title: 'Horas extra y remuneraciones',
    description: 'Reclamos por horas extraordinarias, bonificaciones y diferencias salariales.',
    features: [
      'Horas extraordinarias',
      'Bonificaciones',
      'Diferencias salariales',
      'Recargos nocturnos',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Negociación colectiva',
    description: 'Asesoría en negociación colectiva y convenios sindicales.',
    features: ['Convenios colectivos', 'Negociación sindical', 'Huelgas legales', 'Mediación'],
  },
  {
    icon: Shield,
    title: 'Seguridad social y previsión',
    description: 'Asesoría en derechos previsionales, cotizaciones y seguridad social según tus antecedentes.',
    features: ['AFP y pensiones', 'Fonasa e Isapre', 'Seguro de desempleo', 'Indemnizaciones'],
  },
  {
    icon: Globe,
    title: 'Fiscalizaciones DT',
    description: 'Orientación en fiscalizaciones y comparendos ante la Dirección del Trabajo.',
    features: ['Fiscalizaciones DT', 'Comparendos', 'Multas laborales', 'Defensa administrativa'],
  },
]

const testimonials = [
  {
    name: 'Ana Rodríguez',
    role: 'Trabajadora — Retail',
    content:
      'Me orientaron sobre un reclamo por horas extraordinarias y los plazos. El abogado explicó la viabilidad sin prometerme un monto: claridad y rigor.',
  },
  {
    name: 'Carlos Mendoza',
    role: 'Empleado — Servicios',
    content:
      'Tenía dudas por un despido y me explicaron las alternativas (negociación, mediación, demanda). Sentí que la decisión seguía siendo mía, con información completa.',
  },
  {
    name: 'María González',
    role: 'Trabajadora — Industrial',
    content:
      'Me asesoraron en un tema de acoso laboral bajo la Ley 21.643: pasos ante la empresa y la DT. Muy ordenado y respetuoso.',
  },
]

const successCases = [
  {
    icon: Briefcase,
    amount: 'Horas extra',
    case: 'Revisión de liquidaciones y estrategia de reclamo',
    client: 'Ejemplo retail',
    plan: 'Consulta / tutela',
  },
  {
    icon: Award,
    amount: 'Despido',
    case: 'Análisis de causal y plazos para demandar',
    client: 'Ejemplo servicios',
    plan: 'Consulta laboral',
  },
  {
    icon: Shield,
    amount: 'Ley 21.643',
    case: 'Procedimiento interno y posición ante la DT',
    client: 'Ejemplo administración',
    plan: 'Defensa Ley Karin',
  },
]

const procesoMicroPasos = [
  {
    paso: 1,
    title: 'Reserva en el agendador',
    body: 'Elige el plan y un horario que te calce. Primer paso de baja fricción.',
  },
  {
    paso: 2,
    title: 'Antecedentes y contexto',
    body: 'Contrato, cartas, liquidaciones: lo que tengas ayuda a afinar la evaluación.',
  },
  {
    paso: 3,
    title: 'Sesión con abogado',
    body: 'Revisión de causal, plazos y alternativas (negociación, mediación, demanda).',
  },
  {
    paso: 4,
    title: 'Plan por escrito',
    body: 'Si corresponde, recibes pasos siguientes y alcance del servicio contratado.',
  },
] as const

const differentiators = [
  {
    icon: Sparkles,
    title: 'Información que equilibra la mesa',
    description:
      'Traducimos la jerga a decisiones concretas: plazos, riesgos y opciones. El objetivo es que negocies o litigues con el panorama claro, no a ciegas.',
  },
  {
    icon: Clock,
    title: 'Contacto en horario hábil',
    description:
      'Gestionamos agendamientos y consultas según disponibilidad. Los plazos judiciales y administrativos los explica tu abogado según tu caso.',
  },
  {
    icon: Award,
    title: 'Honorarios informados',
    description:
      'Antes de contratar, conoces la tarifa publicada del servicio (o el acuerdo escrito si aplica patrocinio a porcentaje).',
  },
  {
    icon: Shield,
    title: 'Secreto profesional',
    description:
      'La información se maneja conforme al deber de secreto del abogado (Código Orgánico de Tribunales).',
  },
  {
    icon: Users,
    title: 'Enfoque laboral',
    description:
      'Orientación en derecho del trabajo chileno: despidos, tutela, Ley 21.643 y procedimientos ante la Dirección del Trabajo.',
  },
]

const trustChips: { icon: LucideIcon; label: string }[] = [
  { icon: Calendar, label: 'Reserva en pocos pasos' },
  { icon: Receipt, label: 'Tarifas publicadas antes de pagar' },
  { icon: Clock, label: 'Primera respuesta en horario hábil' },
  { icon: Shield, label: 'Plazos y causales explicados en claro' },
]

/** Planes mostrados en la página (sincronizar slugs con `constants/services.ts`). */
const laboralPlanes = [
  {
    emoji: '✨',
    name: 'Diagnóstico laboral gratis',
    sub: 'Tutela de derechos fundamentales · despido · nulidad del despido',
    priceLabel: 'Gratis',
    priceExtra: 'Primera sesión sin costo cuando corresponde',
    popular: true,
    badge: 'Empieza aquí',
    features: [
      'Evaluación inicial de tutela de derechos fundamentales',
      'Despido injustificado y nulidad del despido (orientación)',
      'Sin patrocinio automático: el abogado te indica la vía',
      'Honorarios a porcentaje solo si hay acuerdo escrito de representación',
    ],
    plan: 'tutela-laboral',
    cta: 'Agendar diagnóstico gratis',
    isFree: true,
  },
  {
    emoji: '🛡️',
    name: 'Defensa frente a Ley Karin',
    sub: 'Ley 21.643 · procedimiento como trabajador/a',
    priceLabel: '$79.000',
    priceExtra: 'Misma tarifa base que consulta laboral · sin IVA',
    popular: false,
    badge: '',
    features: [
      'Análisis de tu situación bajo la Ley Karin',
      'Estrategia ante empleador, investigación interna o DT',
      'Sesión con abogado y plan por escrito',
      'Sin promesa de resultado: depende de hechos y prueba',
    ],
    plan: 'defensa-karin-trabajador',
    cta: 'Agendar defensa Ley Karin',
    isFree: false,
  },
  {
    emoji: '📍',
    name: 'Comparendo DT · Región Metropolitana',
    sub: 'Comparendo + proyección de demanda en tribunales',
    priceLabel: '$35.000',
    priceExtra: '+ honorarios de juicio según complejidad (cotización aparte)',
    popular: false,
    badge: '',
    features: [
      'Comparendo de conciliación ante la DT (RM)',
      'Preparación de descargos y posición',
      'Indicación de pasos hacia demanda laboral',
      'Litigio pleno presupuestado en fase siguiente',
    ],
    plan: 'comparendo-rm',
    cta: 'Agendar comparendo RM',
    isFree: false,
  },
] as const

const laboralFaq = [
  {
    question: '¿Qué es la Ley Karin y cómo me protege?',
    answer:
      'La Ley Karin (Ley 21.643) amplió la obligación de los empleadores de prevenir y sancionar el acoso laboral y sexual. Exige protocolos de prevención, canales de denuncia y proceso de investigación. Si sufriste acoso, la ley te protege con tutela de derechos fundamentales y posibles indemnizaciones.',
  },
  {
    question: '¿Cuánto tiempo tengo para demandar por despido injustificado?',
    answer:
      'Tienes 60 días hábiles desde la separación para presentar la demanda laboral. Este plazo se suspende por la mediación ante la Inspección del Trabajo (hasta por 10 días). Es fundamental actuar rápido para no perder el derecho.',
  },
  {
    question: '¿Qué incluye la indemnización por años de servicio?',
    answer:
      'En líneas generales, corresponde una suma equivalente a 30 días de remuneración por cada año de servicio (con reglas de fracción y topes legales). Para contratos posteriores al 14 de agosto de 1981 suele computarse un tope de 11 años de servicio en la indemnización por años de servicio. Los montos finales dependen de hechos, contrato y prueba; en la consulta se revisa una estimación orientativa.',
  },
  {
    question: '¿Qué es la “última remuneración” para fines de indemnización (Art. 172)?',
    answer:
      'Es un concepto técnico: suele incluir el sueldo y otras sumas permanentes que percibías por el trabajo al término del contrato, con exclusiones legales (por ejemplo, la asignación familiar no forma parte de esa base). El cálculo exacto lo aplica tu abogado según tus liquidaciones y la normativa vigente.',
  },
  {
    question: '¿El empleador puede descontar el AFC de la indemnización si gano la demanda?',
    answer:
      'Hay criterios jurisprudenciales recientes en torno al descuento del aporte del empleador al seguro de cesantía en ciertos escenarios de despido injustificado. Es un tema casuístico: en la sesión se evalúa si aplica a tus hechos y documentos, sin promesa de resultado.',
  },
  {
    question: '¿Puedo reclamar horas extra no pagadas con prescripción?',
    answer:
      'El plazo de prescripción de las acciones laborales individuales es de 2 años desde que las obligaciones se hicieron exigibles (o desde la terminación del contrato). En la práctica, conviene actuar antes de los 2 años para acumular evidencia y testigos.',
  },
  {
    question: '¿Cómo funciona la consulta inicial?',
    answer:
      'Agendas una consulta online o presencial donde revisamos tu caso, contrato, liquidaciones y documentación relevante. Recibes una evaluación de viabilidad y estrategia recomendada. Los descuentos entre servicios, si corresponden, se indican al contratar.',
  },
]

export default function ServicioLaboralPage() {
  const { theme: colorMode, toggleTheme } = useTheme()
  const shellTheme = colorMode === 'dark' ? 'laboral' : 'laboralLight'

  return (
    <>
      <SEO
        title="Derecho laboral Chile: despido, tutela laboral, Ley 21.643 (Ley Karin) | Punto Legal"
        description={`Asesoría laboral en Chile con lenguaje claro: despido, plazos, tutela, Ley 21.643 (Ley Karin) y DT. Estudio fundado por ${PUNTO_LEGAL_FOUNDER_NAME}. Diagnóstico inicial sin costo cuando corresponde y tarifas publicadas antes de pagar.`}
        keywords={`abogado laboral chile, despido injustificado, tutela laboral, Ley 21.643, Ley Karin, Punto Legal, ${PUNTO_LEGAL_FOUNDER_NAME}`}
        author={PUNTO_LEGAL_FOUNDER_NAME}
      />
      <ServicioPageShell
        theme={shellTheme}
        showSiteHeader={false}
        contentName="Punto Legal — Derecho Laboral"
        contentCategory="Servicios Legales — Derecho Laboral"
      >
        <ServicioLaboralInner colorMode={colorMode} onToggleColorMode={toggleTheme} />
      </ServicioPageShell>
    </>
  )
}

function ServicioLaboralInner({
  colorMode,
  onToggleColorMode,
}: {
  colorMode: 'light' | 'dark'
  onToggleColorMode: () => void
}) {
  const t = useServicioTheme()
  const isDark = colorMode === 'dark'
  const ui = getLaboralPageSkin(isDark)

  return (
    <>
      <LaboralThemeToggle mode={colorMode} onToggle={onToggleColorMode} />
      <div className="pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0">
        {/* HERO — superficie clara, menos contraste fatigante */}
        <section className="relative pt-14 md:pt-16 pb-10 md:pb-16 overflow-hidden">
          <div
            className={`pointer-events-none absolute -top-28 -right-28 h-[22rem] w-[22rem] rounded-full blur-3xl ${ui.heroBlobTR}`}
          />
          <div
            className={`pointer-events-none absolute -bottom-24 -left-24 h-[20rem] w-[20rem] rounded-full blur-3xl ${ui.heroBlobBL}`}
          />
          {/* línea decorativa suave (ritmo visual, sin competir con el CTA) */}
          <div
            className={`pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,28rem)] -translate-x-1/2 bg-gradient-to-r ${ui.heroLine}`}
            aria-hidden
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 mb-6 ${ui.glassCard}`}>
                <Shield className={`h-4 w-4 shrink-0 ${ui.heroBadgeIcon}`} aria-hidden />
                <span className={`text-xs font-medium tracking-wide ${ui.heroBadgeText}`}>
                  Derecho laboral Chile ·{' '}
                  <span className={`${ui.heroBadgeAccent} font-semibold`}>Diagnóstico gratis</span> cuando aplica
                </span>
              </div>

              <p
                className={`text-sm md:text-base font-semibold mb-3 max-w-2xl mx-auto tracking-tight ${ui.heroLead}`}
              >
                Nivelamos la cancha con información clara: plazos, causales y siguientes pasos.
              </p>

              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.05] tracking-tight font-[family-name:Manrope] ${ui.textTitle}`}
              >
                Asesoría laboral
                <br />
                <span className={t.accent}>para personas y trabajadores</span>
              </h1>

              <p className={`text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto ${ui.textBody}`}>
                Si te despidieron, te cambiaron condiciones o enfrentas un conflicto con la empresa, aquí no estás solo
                frente a un manual: traducimos la norma a decisiones posibles —despidos, tutela, Ley 21.643 (Ley Karin),
                horas extra y fiscalizaciones DT. Puedes partir por un{' '}
                <span className={`${ui.textStrong} font-medium`}>
                  diagnóstico inicial sin costo cuando corresponde
                </span>
                , o por una consulta pagada con plan por escrito. Primera respuesta en horario hábil, según carga de
                agenda.
              </p>
              <p className="text-xs text-slate-500 max-w-xl mx-auto -mt-4 mb-8 leading-relaxed">
                Punto Legal — visión fundacional de {PUNTO_LEGAL_FOUNDER_NAME}, abogado (Instituto Nacional): acercar
                defensa y orientación jurídica con claridad.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center items-stretch sm:items-center">
                <Link
                  to="/agendamiento?plan=tutela-laboral"
                  className={`group min-h-[44px] px-7 py-3.5 rounded-2xl font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 touch-manipulation active:scale-[0.98] ${t.btnPrimary} ${t.btnPrimaryHover} hover:-translate-y-0.5 ${ui.primaryCtaShadow}`}
                >
                  <Calendar className="w-4 h-4 shrink-0" aria-hidden />
                  Agendar diagnóstico gratis
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/agendamiento?plan=laboral"
                  className={`group min-h-[44px] px-7 py-3.5 rounded-2xl font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 touch-manipulation active:scale-[0.98] ${t.btnOutline} ${t.btnOutlineHover}`}
                >
                  <span aria-hidden="true">⚡</span>
                  Consulta pagada · desde $79.000
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-2.5 md:gap-3 max-w-3xl mx-auto">
                {trustChips.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className={`inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-left ${ui.trustOuter}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${ui.trustIconBox}`}
                    >
                      <Icon className={`h-4 w-4 ${ui.trustIcon}`} aria-hidden />
                    </span>
                    <span
                      className={`text-xs font-medium max-w-[11rem] sm:max-w-none leading-snug ${ui.trustLabel}`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tres vías */}
        <section className={`relative border-b py-10 md:py-12 ${ui.borderSection}`}>
          <div className="container mx-auto max-w-4xl px-4">
            <div className={`${ui.glassPanel} p-6 md:p-8`}>
              <h2 className={`text-center text-lg font-semibold md:text-xl ${ui.textTitle}`}>
                Tres formas de empezar
              </h2>
              <p className={`mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed ${ui.textBody}`}>
                Recomendamos comenzar por el <span className={`${ui.textStrong} font-medium`}>diagnóstico sin costo</span>{' '}
                cuando corresponda; si ya necesitas plan escrito pago, usa la consulta laboral.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link
                  to="/agendamiento?plan=tutela-laboral"
                  className={`relative flex min-h-[44px] flex-col justify-center rounded-2xl px-4 py-4 text-center transition touch-manipulation active:scale-[0.98] ${t.cardPopularRing} ${ui.viasPrimaryBg}`}
                >
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md shadow-teal-900/20">
                    Prioridad
                  </span>
                  <span className={`mt-1 text-sm font-semibold ${t.link}`}>Diagnóstico gratis</span>
                  <span className={`mt-1 text-[11px] leading-snug ${ui.viasCardMuted}`}>
                    Primera evaluación sin costo si aplica
                  </span>
                </Link>
                <Link
                  to="/agendamiento?plan=laboral"
                  className={`flex min-h-[44px] flex-col justify-center rounded-2xl px-4 py-4 text-center transition touch-manipulation active:scale-[0.98] ${ui.viasSecondary} ${t.link}`}
                >
                  <span className={`text-sm font-semibold ${ui.viasCardTitle}`}>Despido y finiquito</span>
                  <span className={`mt-1 text-[11px] leading-snug ${ui.viasCardMuted}`}>
                    Consulta pagada · plan por escrito
                  </span>
                </Link>
                <Link
                  to="/agendamiento?plan=defensa-karin-trabajador"
                  className={`flex min-h-[44px] flex-col justify-center rounded-2xl px-4 py-4 text-center transition touch-manipulation active:scale-[0.98] ${ui.viasSecondary} ${t.link}`}
                >
                  <span className={`text-sm font-semibold ${ui.viasCardTitle}`}>Ley Karin (trabajador)</span>
                  <span className={`mt-1 text-[11px] leading-snug ${ui.viasCardMuted}`}>
                    Consulta $79.000 · sesión y plan por escrito
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Cuatro pasos */}
        <section className={`relative border-b py-10 md:py-14 ${ui.borderSection}`}>
          <div className="container mx-auto max-w-6xl px-4">
            <div className={`${ui.glassPanel} p-6 md:p-8`}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <div className={`inline-flex items-center gap-2 mb-2 ${ui.pasosKicker}`}>
                    <ListOrdered className="h-5 w-5 shrink-0" aria-hidden />
                    <span className="text-xs font-bold uppercase tracking-[0.25em]">Tu siguiente paso</span>
                  </div>
                  <h2 className={`text-xl md:text-2xl font-bold leading-tight ${ui.textTitle}`}>
                    Cuatro pasos, sin formularios interminables
                  </h2>
                  <p className={`mt-2 text-sm max-w-2xl leading-relaxed ${ui.textBody}`}>
                    Avanzas por etapas claras hasta tener plan y próximos hitos, sin sensación de tarea abierta sin
                    fin.
                  </p>
                </div>
                <Link
                  to="/agendamiento?plan=tutela-laboral"
                  className={`shrink-0 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold touch-manipulation active:scale-[0.98] ${t.btnPrimary} ${t.btnPrimaryHover}`}
                >
                  <Calendar className="h-4 w-4" aria-hidden />
                  Empezar por agendar
                </Link>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {procesoMicroPasos.map((s) => (
                  <li key={s.paso} className={ui.procesoCard}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${ui.procesoPaso}`}>
                      Paso {s.paso}
                    </span>
                    <p className={`mt-1.5 text-sm font-semibold ${ui.procesoTitle}`}>{s.title}</p>
                    <p className={`mt-1.5 text-xs leading-relaxed ${ui.procesoBody}`}>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* DIFERENCIADORES */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 md:mb-14"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${ui.textTitle}`}>
                ¿Por qué elegir <span className={t.accent}>Punto Legal Laboral</span>?
              </h2>
              <p className={`max-w-2xl mx-auto ${ui.textBody}`}>
                Equipo con foco en derecho del trabajo chileno: rigor en plazos y causales, comunicación sin humo y
                alcance definido en cada servicio.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
              {differentiators.map((d, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  className={`${ui.glassCard} p-5 md:p-6 transition-colors duration-300 ${t.cardHover}`}
                >
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${t.iconBox}`}>
                    <d.icon className={`h-5 w-5 ${t.accent}`} />
                  </div>
                  <h3 className={`text-base md:text-lg font-semibold mb-2 ${ui.textTitle}`}>{d.title}</h3>
                  <p className={`text-sm leading-relaxed ${ui.textBody}`}>{d.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section className={`py-16 md:py-20 ${t.sectionWash}`}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${ui.textTitle}`}>
                Servicios de <span className={t.accent}>derecho laboral</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${ui.textBody}`}>
                Evaluamos viabilidad según tus antecedentes; sin promesas de resultado.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={`${ui.glassCard} p-6 transition-all duration-300 group ${t.cardHover}`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 ${t.iconBox}`}
                  >
                    <service.icon className={`w-6 h-6 ${t.accent}`} />
                  </div>

                  <h3 className={`text-lg font-bold mb-2.5 ${ui.textTitle}`}>{service.title}</h3>
                  <p className={`text-sm mb-5 leading-relaxed ${ui.textBody}`}>{service.description}</p>

                  <ul className="space-y-2">
                    {service.features.map((feature, fi) => (
                      <li key={fi} className={`flex items-center gap-2 text-sm ${ui.textList}`}>
                        <CheckCircle className={`w-4 h-4 shrink-0 ${t.accent}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* LEY KARIN */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${ui.glassPanel} p-6 md:p-10 relative overflow-hidden`}
            >
              <div
                className={`pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl ${ui.karinBlob}`}
              />
              <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${ui.karinIconBox}`}
                >
                  <Shield className={`h-7 w-7 ${ui.karinIcon}`} aria-hidden />
                </div>
                <div className="flex-1">
                  <span className={`inline-block text-[11px] font-bold uppercase tracking-[0.35em] mb-2 ${t.accent}`}>
                    Ley Karin · vigente
                  </span>
                  <h2 className={`text-2xl md:text-3xl font-bold mb-3 leading-tight ${ui.textTitle}`}>
                    ¿Sufres acoso o malos tratos en tu trabajo?
                  </h2>
                  <p className={`leading-relaxed mb-6 ${ui.textBody}`}>
                    La <span className={`${ui.textStrong} font-medium`}>Ley 21.643</span> obliga a las empresas a
                    prevenir y sancionar el acoso laboral y sexual. Si tu empleador no cumplió o has sufrido
                    hostigamiento, puedes evaluar tutela de derechos fundamentales y otras medidas según los hechos.
                    Priorizamos la revisión inicial según urgencia y disponibilidad.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/agendamiento?plan=tutela-laboral"
                      className={`inline-flex min-h-[44px] items-center gap-2 px-6 py-3 rounded-xl font-semibold touch-manipulation active:scale-[0.98] ${t.btnPrimary} ${t.btnPrimaryHover}`}
                    >
                      <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                      Agendar diagnóstico gratis
                    </Link>
                    <Link
                      to="/agendamiento?plan=laboral"
                      className={`inline-flex min-h-[44px] items-center gap-2 px-6 py-3 rounded-xl font-semibold touch-manipulation active:scale-[0.98] ${t.btnOutline} ${t.btnOutlineHover}`}
                    >
                      Consulta pagada
                    </Link>
                    <Link
                      to="/blog"
                      className={`inline-flex min-h-[44px] items-center gap-2 px-6 py-3 rounded-xl font-semibold touch-manipulation active:scale-[0.98] ${ui.blogLink}`}
                    >
                      Blog · laboral y derechos
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PAQUETES */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${ui.textTitle}`}>
                Elige tu <span className={t.accent}>entrada</span>
              </h2>
              <p className={`max-w-2xl mx-auto text-sm md:text-base leading-relaxed ${ui.textBody}`}>
                Lo primero es el <strong className={ui.textStrong}>diagnóstico gratis</strong> cuando aplica. Las
                otras opciones son consultas pagadas con tarifa publicada en el agendamiento.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {laboralPlanes.map((pkg, i) => (
                <motion.div
                  key={pkg.plan}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative ${ui.glassCard} p-7 md:p-8 transition-all duration-300 ${
                    pkg.popular ? t.cardPopularRing : t.cardHover
                  }`}
                >
                  {pkg.popular && pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <div
                        className={`${t.btnPrimary} px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md`}
                      >
                        ⭐ {pkg.badge}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="text-3xl mb-3" aria-hidden="true">
                      {pkg.emoji}
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${ui.textTitle}`}>{pkg.name}</h3>
                    <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-4">{pkg.sub}</p>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {pkg.isFree ? (
                          <div
                            className={`text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${ui.pkgFreeGradient}`}
                          >
                            {pkg.priceLabel}
                          </div>
                        ) : (
                          <div className={`text-3xl md:text-4xl font-bold ${ui.pkgPricePaid}`}>{pkg.priceLabel}</div>
                        )}
                        {!pkg.isFree && <div className="text-xs text-slate-500">CLP · sin IVA</div>}
                      </div>
                      {pkg.priceExtra && (
                        <p className="text-[11px] leading-snug text-slate-500">{pkg.priceExtra}</p>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-7">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${t.accent}`} />
                        <span className={`text-sm leading-relaxed ${ui.pkgFeatures}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/agendamiento?plan=${pkg.plan}`}
                    className={`group/cta min-h-[44px] w-full rounded-2xl py-3 px-6 font-semibold transition-all duration-300 text-center inline-flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98] ${
                      pkg.popular
                        ? `${t.btnPrimary} ${t.btnPrimaryHover} hover:-translate-y-0.5`
                        : `${t.btnOutline} ${t.btnOutlineHover}`
                    }`}
                  >
                    {pkg.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CASOS */}
        <section className={`py-12 md:py-16 ${t.sectionWash}`}>
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className={`text-2xl md:text-3xl font-bold text-center mb-3 ${ui.textTitle}`}>
              Ejemplos orientativos
            </h2>
            <p className={`text-center mb-10 max-w-xl mx-auto text-sm leading-relaxed ${ui.textBody}`}>
              Ilustraciones anónimas; cada causa es distinta y los resultados no están garantizados.
            </p>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {successCases.map((c, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className={`${ui.glassCard} p-5 h-full text-left`}>
                    <c.icon className={`w-8 h-8 mb-3 ${t.accent}`} />
                    <div className={`text-lg md:text-xl font-bold mb-1 ${t.accent}`}>{c.amount}</div>
                    <div className={`font-semibold mb-2 ${ui.textTitle}`}>{c.case}</div>
                    <div className="text-[11px] md:text-xs text-slate-500">
                      {c.client} · Plan {c.plan}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-2xl md:text-3xl font-bold text-center mb-12 ${ui.textTitle}`}
            >
              Experiencias de personas asesoradas
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <TestimonialBubble
                  key={index}
                  testimonial={testimonial}
                  index={index}
                  surface={isDark ? 'dark' : 'light'}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq-laboral" className={`py-16 md:py-20 ${t.sectionWash}`}>
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className={`text-2xl md:text-3xl font-bold text-center mb-3 ${ui.textTitle}`}>
              Preguntas frecuentes
            </h2>
            <p className={`text-center mb-10 ${ui.textBody}`}>
              Respuestas claras a las dudas más comunes sobre derecho laboral en Chile.
            </p>
            <div>
              {laboralFaq.map((item, i) => (
                <LaboralFaqItem key={i} item={item} accentClass={t.accent} isDark={isDark} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`max-w-4xl mx-auto text-center ${ui.glassPanel} p-10 md:p-14 relative overflow-hidden`}
            >
              <div
                className={`pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full blur-3xl ${ui.ctaBlobTR}`}
              />
              <div
                className={`pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full blur-3xl ${ui.ctaBlobBL}`}
              />

              <div className="relative z-10">
                <h2 className={`text-3xl lg:text-4xl font-bold mb-4 leading-tight ${ui.textTitle}`}>
                  ¿Necesitas asesoría laboral <span className={t.accent}>ahora</span>?
                </h2>
                <p className={`mb-8 max-w-xl mx-auto ${ui.textBody}`}>
                  Agenda una sesión: en la reunión revisamos hechos, documentos y alternativas. Los honorarios del
                  servicio que contrates se informan antes de pagar; no prometemos resultados en juicio.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/agendamiento?plan=tutela-laboral"
                    className={`inline-flex min-h-[44px] items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold touch-manipulation active:scale-[0.98] ${t.btnPrimary} ${t.btnPrimaryHover} hover:-translate-y-0.5`}
                  >
                    <Calendar className="w-5 h-5" />
                    Diagnóstico gratis
                  </Link>
                  <Link
                    to="/agendamiento?plan=laboral"
                    className={`inline-flex min-h-[44px] items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold touch-manipulation active:scale-[0.98] ${t.btnOutline} ${t.btnOutlineHover}`}
                  >
                    Consulta pagada
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Barra inferior móvil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${ui.mobileDock}`}
      >
        <Link
          to="/agendamiento?plan=tutela-laboral"
          className={`flex min-h-[52px] w-full items-center justify-center px-6 py-3 text-center text-base font-bold touch-manipulation active:brightness-95 ${t.btnPrimary}`}
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          Diagnóstico gratis · Agendar
        </Link>
      </motion.div>
    </>
  )
}

function LaboralFaqItem({
  item,
  accentClass,
  isDark,
}: {
  item: { question: string; answer: string }
  accentClass: string
  isDark: boolean
}) {
  const [open, setOpen] = useState(false)
  const border = isDark ? 'border-slate-800/80' : 'border-slate-200/90'
  const q = isDark ? 'text-slate-200 hover:text-teal-300/90' : 'text-slate-800 hover:text-teal-800'
  const plus = isDark ? 'text-slate-500' : 'text-slate-400'
  const ans = isDark ? 'text-slate-400' : 'text-slate-600'

  return (
    <div className={`border-b ${border}`}>
      <button
        type="button"
        className="w-full flex min-h-[48px] justify-between items-center text-left py-4 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/30 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <h3 className={`text-base md:text-lg font-medium pr-4 transition-colors ${q}`}>{item.question}</h3>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? (
            <Minus className={`h-5 w-5 shrink-0 ${accentClass}`} />
          ) : (
            <Plus className={`h-5 w-5 shrink-0 ${plus}`} />
          )}
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className={`pb-4 pr-2 leading-relaxed ${ans}`}>{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
