import { motion, AnimatePresence } from 'framer-motion'
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
  LogIn,
  X,
  ArrowRight,
  Briefcase,
  Award,
  Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO'
import ServicioPageShell from '@/components/servicios/ServicioPageShell'
import { useServicioTheme } from '@/components/servicios/servicioThemeContext'
import TestimonialBubble from '@/components/servicios/TestimonialBubble'
import CorporateLoginSimple from '../components/CorporateLoginSimple'

const services = [
  {
    icon: Scale,
    title: 'Despidos y término de contrato',
    description:
      'Defensa completa en despidos justificados e injustificados, con protección total de tus derechos laborales.',
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
      'Defensa especializada en acoso, hostigamiento y vulneración de derechos fundamentales.',
    features: ['Ley Karin completa', 'Acoso laboral', 'Discriminación', 'Tutela de derechos'],
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
    description: 'Gestión completa de derechos previsionales y seguridad social.',
    features: ['AFP y pensiones', 'Fonasa e Isapre', 'Seguro de desempleo', 'Indemnizaciones'],
  },
  {
    icon: Globe,
    title: 'Fiscalizaciones DT',
    description: 'Defensa ante la Dirección del Trabajo y comparendos laborales.',
    features: ['Fiscalizaciones DT', 'Comparendos', 'Multas laborales', 'Defensa administrativa'],
  },
]

const testimonials = [
  {
    name: 'Ana Rodríguez',
    role: 'Trabajadora — Retail',
    content:
      'Recuperé más de $2.000.000 en horas extra que no me habían pagado durante años. El proceso fue rápido, transparente y muy humano.',
  },
  {
    name: 'Carlos Mendoza',
    role: 'Empleado — Servicios',
    content:
      'Mi despido fue claramente injustificado y Punto Legal lo demostró. La indemnización superó mis expectativas. Profesionalismo total.',
  },
  {
    name: 'María González',
    role: 'Trabajadora — Industrial',
    content:
      'Sufrí acoso laboral durante meses. Aplicaron la Ley Karin con rigor y logramos indemnización + traslado. Su apoyo fue fundamental.',
  },
]

const stats = [
  { number: '1.000+', label: 'Casos resueltos' },
  { number: '100%', label: 'Confidencialidad' },
  { number: '48h', label: 'Respuesta garantizada' },
  { number: '98%', label: 'Clientes satisfechos' },
]

const successCases = [
  {
    icon: Briefcase,
    amount: '$2.4M',
    case: 'Horas extra recuperadas',
    client: 'Trabajadora retail',
    plan: 'Defensa Laboral',
  },
  {
    icon: Award,
    amount: '100%',
    case: 'Indemnización por despido injustificado',
    client: 'Ejecutivo de ventas',
    plan: 'Defensa Laboral',
  },
  {
    icon: Shield,
    amount: '11 meses',
    case: 'Tope máximo de indemnización + Ley Karin',
    client: 'Profesional administrativa',
    plan: 'Protección Integral',
  },
]

const differentiators = [
  {
    icon: Clock,
    title: 'Respondemos en 48 horas',
    description: 'Sabemos que cada día cuenta. Cero burocracia, cero esperas eternas.',
  },
  {
    icon: Award,
    title: 'Precio cerrado, sin sorpresas',
    description: 'Conoces el valor total antes de empezar. No hay cobros por audiencia.',
  },
  {
    icon: Shield,
    title: 'Confidencialidad absoluta',
    description: 'Tu caso es tratado por abogados con secreto profesional, nunca asistentes.',
  },
  {
    icon: Users,
    title: 'Especialistas, no generalistas',
    description: 'Solo derecho laboral chileno: Ley Karin, despidos, remuneraciones, DT.',
  },
]

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
      'Corresponde a 30 días de la última remuneración mensual por cada año de servicio (y fracción superior a 6 meses), con tope de 11 meses. Si el despido fue injustificado, procede el recargo del 30% al 100% adicional según la causal usada.',
  },
  {
    question: '¿Puedo reclamar horas extra no pagadas con prescripción?',
    answer:
      'El plazo de prescripción de las acciones laborales individuales es de 2 años desde que las obligaciones se hicieron exigibles (o desde la terminación del contrato). En la práctica, conviene actuar antes de los 2 años para acumular evidencia y testigos.',
  },
  {
    question: '¿Cómo funciona la consulta inicial?',
    answer:
      'Agendas una consulta online o presencial donde revisamos tu caso, contrato, liquidaciones y documentación relevante. Recibes una evaluación de viabilidad y estrategia recomendada. Si contratas el plan, el valor de la consulta se descuenta.',
  },
]

export default function ServicioLaboralPage() {
  return (
    <>
      <SEO
        title="Abogado laboral en Chile: despidos, Ley Karin, horas extra | Punto Legal"
        description="Especialistas en derecho laboral en Chile. Despidos injustificados, Ley Karin, horas extraordinarias, fiscalizaciones DT. Respuesta en 48h, precio cerrado."
      />
      <ServicioPageShell
        theme="laboral"
        contentName="Punto Legal — Derecho Laboral"
        contentCategory="Servicios Legales — Derecho Laboral"
      >
        <ServicioLaboralInner />
      </ServicioPageShell>
    </>
  )
}

function ServicioLaboralInner() {
  const t = useServicioTheme()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {/* HERO sobrio fintech-legal */}
      <section className="relative pt-10 md:pt-16 pb-12 md:pb-20 overflow-hidden">
        {/* blobs ultra sutiles */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 backdrop-blur-xl bg-slate-900/70 border border-slate-800">
              <span aria-hidden="true">🛡️</span>
              <span className="text-xs font-medium text-slate-300 tracking-wide">
                Especialistas en derecho laboral · Chile
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              Defendemos tus derechos
              <br />
              <span className={t.accent}>laborales con resultados.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Despidos, Ley Karin, horas extra y fiscalizaciones DT. Respuesta en{' '}
              <span className="text-slate-200 font-medium">48 horas</span>, precio cerrado y
              confidencialidad absoluta.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/agendamiento?plan=laboral"
                className={`group px-7 py-3.5 rounded-2xl font-semibold inline-flex items-center gap-2 transition-all duration-300 ${t.btnPrimary} ${t.btnPrimaryHover} hover:-translate-y-0.5`}
              >
                <span aria-hidden="true">⚡</span>
                Consulta laboral hoy
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => setShowLogin(true)}
                className={`px-7 py-3.5 rounded-2xl font-semibold inline-flex items-center gap-2 transition-all duration-300 ${t.btnOutline} ${t.btnOutlineHover}`}
              >
                <LogIn className="w-4 h-4" />
                Portal trabajador
              </button>
            </div>

            {/* Trust micro-bar */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">✅</span> Sin compromiso
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">⏱️</span> Respuesta 48h
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">🔒</span> 100% confidencial
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS minimalistas */}
      <section className="border-y border-slate-800/80 bg-slate-950/40 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="text-center"
              >
                <div className={`text-3xl md:text-4xl font-bold mb-1 ${t.stat}`}>
                  {stat.number}
                </div>
                <div className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-slate-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIADORES (NUEVO — clave para conversión) */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              ¿Por qué elegir <span className={t.accent}>Punto Legal Laboral</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              No somos un call center jurídico. Somos abogados especializados en derecho laboral
              chileno, con casos ganados y procesos transparentes.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {differentiators.map((d, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className={`rounded-3xl p-5 md:p-6 transition-colors duration-300 ${t.cardGlass} ${t.cardHover}`}
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${t.iconBox}`}
                >
                  <d.icon className={`h-5 w-5 ${t.accent}`} />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">{d.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{d.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Servicios de <span className={t.accent}>derecho laboral</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Cobertura completa con resultados reales, no promesas.
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
                className={`rounded-3xl p-6 transition-all duration-300 group ${t.cardGlass} ${t.cardHover}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 ${t.iconBox}`}
                >
                  <service.icon className={`w-6 h-6 ${t.accent}`} />
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5">{service.title}</h3>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
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

      {/* LEY KARIN — bloque hero secundario */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[28px] border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 md:p-10 shadow-2xl shadow-black/40 relative overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10`}
              >
                <span className="text-2xl" aria-hidden="true">
                  🛡️
                </span>
              </div>
              <div className="flex-1">
                <span
                  className={`inline-block text-[11px] font-bold uppercase tracking-[0.35em] mb-2 ${t.accent}`}
                >
                  Ley Karin · vigente
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  ¿Sufres acoso o malos tratos en tu trabajo?
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  La <span className="text-slate-200 font-medium">Ley 21.643</span> obliga a las
                  empresas a prevenir y sancionar el acoso laboral y sexual. Si tu empleador no
                  cumplió o has sufrido hostigamiento, tienes derecho a tutela de derechos
                  fundamentales e indemnizaciones. Actuamos en{' '}
                  <span className="text-slate-200 font-medium">48 horas</span>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/agendamiento?plan=laboral-karin"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${t.btnPrimary} ${t.btnPrimaryHover}`}
                  >
                    <span aria-hidden="true">🛡️</span>
                    Consultar por Ley Karin
                  </Link>
                  <Link
                    to="/blog/ley-karin-guia"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${t.btnOutline} ${t.btnOutlineHover}`}
                  >
                    Guía Ley Karin
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Planes claros, <span className={t.accent}>sin sorpresas</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Precio cerrado por escrito. Sin cobros adicionales por audiencia.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                emoji: '⚡',
                name: 'Consulta Express',
                sub: 'Orientación y estrategia',
                price: '$30.000',
                popular: false,
                features: [
                  'Revisión de tu caso (1h)',
                  'Análisis de documentos clave',
                  'Estrategia recomendada',
                  'Informe escrito en PDF',
                  'Descontable del plan si contratas',
                ],
                badge: '',
                plan: 'laboral-consulta',
              },
              {
                emoji: '🛡️',
                name: 'Defensa Laboral',
                sub: 'Despidos y remuneraciones',
                price: '$480.000',
                popular: true,
                features: [
                  'Todo Consulta Express +',
                  'Demanda ante tribunal laboral',
                  'Audiencias preparatoria y juicio',
                  'Negociación extrajudicial previa',
                  'Apelación incluida',
                ],
                badge: 'Más elegido',
                plan: 'laboral-defensa',
              },
              {
                emoji: '💎',
                name: 'Protección Integral',
                sub: 'Ley Karin + DDFF',
                price: '$850.000',
                popular: false,
                features: [
                  'Todo Defensa Laboral +',
                  'Tutela de derechos fundamentales',
                  'Ley Karin completa',
                  'Acciones preventivas y cautelares',
                  'Seguimiento por 6 meses',
                ],
                badge: '',
                plan: 'laboral-integral',
              },
            ].map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-7 md:p-8 transition-all duration-300 ${t.cardGlass} ${
                  pkg.popular ? t.cardPopularRing : t.cardHover
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div
                      className={`${t.btnPrimary} px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg`}
                    >
                      ⭐ {pkg.badge}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-3xl mb-3" aria-hidden="true">
                    {pkg.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-4">
                    {pkg.sub}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl md:text-4xl font-bold text-white">{pkg.price}</div>
                    <div className="text-xs text-slate-500">CLP · sin IVA</div>
                  </div>
                </div>

                <ul className="space-y-3 mb-7">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle className={`w-4.5 h-4.5 mt-0.5 shrink-0 ${t.accent}`} />
                      <span className="text-sm text-slate-300 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/agendamiento?plan=${pkg.plan}`}
                  className={`group/cta w-full rounded-2xl py-3 px-6 font-semibold transition-all duration-300 text-center inline-flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? `${t.btnPrimary} ${t.btnPrimaryHover} hover:-translate-y-0.5`
                      : `${t.btnOutline} ${t.btnOutlineHover}`
                  }`}
                >
                  Agendar consulta
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS DE ÉXITO */}
      <section className={`py-12 md:py-16 ${t.sectionWash}`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-white">
            Resultados que hablan por sí solos
          </h2>
          <p className="text-center text-slate-400 mb-10 max-w-xl mx-auto">
            Casos reales (cifras anonimizadas) defendidos por nuestro equipo.
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
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl h-full shadow-md shadow-slate-950/40 text-left">
                  <c.icon className={`w-8 h-8 mb-3 ${t.accent}`} />
                  <div className={`text-2xl md:text-3xl font-bold mb-1 ${t.accent}`}>
                    {c.amount}
                  </div>
                  <div className="font-semibold mb-2 text-slate-100">{c.case}</div>
                  <div className="text-[11px] md:text-xs text-slate-500">
                    {c.client} · Plan {c.plan}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS — burbuja iOS Familia */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-12 text-white"
          >
            Trabajadores que recuperaron sus derechos 💬
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialBubble
                key={index}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-16 md:py-20 ${t.sectionWash}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            Preguntas frecuentes
          </h2>
          <p className="text-center text-slate-400 mb-10">
            Respuestas claras a las dudas más comunes sobre derecho laboral en Chile.
          </p>
          <div>
            {laboralFaq.map((item, i) => (
              <LaboralFaqItem key={i} item={item} accentClass={t.accent} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final sobrio */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center rounded-[32px] border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-10 md:p-14 relative overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-sky-500/6 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 bg-slate-800/80 border border-slate-700">
                <span aria-hidden="true">⚡</span>
                <span className="text-[11px] font-medium text-slate-200 uppercase tracking-[0.3em]">
                  Respuesta en 48h
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                ¿Necesitas asesoría laboral <span className={t.accent}>ahora</span>?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Cuéntanos tu caso. Te confirmamos viabilidad, estrategia y precio cerrado en menos
                de dos días hábiles.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/agendamiento?plan=laboral"
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold ${t.btnPrimary} ${t.btnPrimaryHover} hover:-translate-y-0.5`}
                >
                  <Calendar className="w-5 h-5" />
                  Agendar consulta
                </Link>
                <button
                  onClick={() => setShowLogin(true)}
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold ${t.btnOutline} ${t.btnOutlineHover}`}
                >
                  <LogIn className="w-5 h-5" />
                  Portal trabajador
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Punto Legal Online. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs max-w-2xl mx-auto">
            Información orientativa. Para evaluar tu caso,{' '}
            <Link to="/agendamiento?plan=laboral" className={`${t.link} underline`}>
              agenda una consulta
            </Link>
            .
          </p>
        </div>
      </footer>

      {/* Modal login trabajador */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto mt-4 sm:mt-0"
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>
              <CorporateLoginSimple
                onClose={() => setShowLogin(false)}
                onLoginSuccess={() => setShowLogin(false)}
                isModal={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón mobile flotante */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      >
        <Link
          to="/agendamiento?plan=laboral"
          className={`block w-full py-4 px-6 text-center font-bold text-base shadow-2xl ${t.btnPrimary} pb-safe`}
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          🛡️ Consulta laboral · 48h
        </Link>
      </motion.div>
    </>
  )
}

function LaboralFaqItem({
  item,
  accentClass,
}: {
  item: { question: string; answer: string }
  accentClass: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-800/80">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-base md:text-lg font-medium text-slate-200 pr-4 hover:text-amber-300 transition-colors">
          {item.question}
        </h3>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? (
            <Minus className={`h-5 w-5 shrink-0 ${accentClass}`} />
          ) : (
            <Plus className="text-slate-500 h-5 w-5 shrink-0" />
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
            <p className="pb-4 text-slate-400 pr-2 leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
