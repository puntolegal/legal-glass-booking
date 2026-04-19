import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  FileText,
  Users,
  TrendingUp,
  Shield,
  Globe,
  CheckCircle,
  Calendar,
  BarChart3,
  AlertTriangle,
  LogIn,
  X,
  ArrowRight,
  Plus,
  Minus,
  Clock,
  Award,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO'
import ServicioPageShell from '@/components/servicios/ServicioPageShell'
import { useServicioTheme } from '@/components/servicios/servicioThemeContext'
import TestimonialBubble from '@/components/servicios/TestimonialBubble'
import CorporateLoginSimple from '../components/CorporateLoginSimple'
import CorporateDashboard from '../components/CorporateDashboard'

const services = [
  {
    icon: Building2,
    title: 'Constitución de sociedades',
    description: 'SpA, SRL y SA en 24 horas con todos los trámites incluidos.',
    features: ['SpA en 1 día', 'SRL express', 'Sociedades anónimas', 'Modificaciones societarias'],
  },
  {
    icon: FileText,
    title: 'Contratos comerciales',
    description: 'Redacción y revisión de contratos para proteger los intereses de tu empresa.',
    features: ['Compraventa comercial', 'Confidencialidad (NDA)', 'Joint ventures', 'Licencias'],
  },
  {
    icon: Users,
    title: 'Fusiones y adquisiciones',
    description: 'Asesoría completa en procesos de M&A y due diligence.',
    features: ['Due diligence legal', 'Estructuración de deals', 'Negociación', 'Post-merger'],
  },
  {
    icon: TrendingUp,
    title: 'Inversión extranjera',
    description: 'Facilitamos la entrada de capital extranjero cumpliendo normativa chilena.',
    features: ['Capítulo XIV', 'Estructuras de inversión', 'Compliance regulatorio', 'Repatriación'],
  },
  {
    icon: Shield,
    title: 'Gobierno corporativo',
    description: 'Buenas prácticas y compliance para directores y ejecutivos.',
    features: ['Directorio', 'Políticas internas', 'Códigos de ética', 'Gestión de riesgos'],
  },
  {
    icon: Globe,
    title: 'Comercio internacional',
    description: 'Contratos, Incoterms y resolución de disputas transfronterizas.',
    features: ['Contratos internacionales', 'Incoterms', 'Resolución de disputas', 'Arbitraje'],
  },
]

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'CEO, TechStart Chile',
    content:
      'Implementaron políticas de compliance que nos ahorraron multas millonarias. El equipo manejó toda la complejidad con maestría y nos dieron tranquilidad total.',
    rating: 5,
  },
  {
    name: 'María Fernández',
    role: 'Directora, Grupo Inmobiliario MF',
    content:
      'La asesoría en la fusión con nuestro competidor fue clave. Manejaron toda la complejidad legal con profesionalismo excepcional y conocimiento del sector.',
    rating: 5,
  },
  {
    name: 'Roberto Silva',
    role: 'Inversionista internacional',
    content:
      'Me ayudaron a estructurar mi inversión en Chile de forma óptima. Excelente manejo del Capítulo XIV y las regulaciones internacionales.',
    rating: 5,
  },
]

const stats = [
  { number: '500+', label: 'Empresas constituidas' },
  { number: '50M+', label: 'USD en deals cerrados' },
  { number: '24h', label: 'Constitución express' },
  { number: '98%', label: 'Clientes satisfechos' },
]

const corporativoFaq = [
  {
    question: '¿En cuánto tiempo se constituye una SpA en Chile?',
    answer:
      'Una SpA puede constituirse en 24 a 48 horas hábiles mediante escritura pública electrónica en el Repertorio Electrónico Notarial. Incluye estatutos, publicación en el Diario Oficial, inscripción en el Registro de Comercio y obtención del RUT.',
  },
  {
    question: '¿Qué es el due diligence y cuándo es necesario?',
    answer:
      'Es un proceso de revisión legal, financiera y operativa de una empresa antes de una compra, fusión o inversión significativa. Es indispensable para identificar pasivos ocultos, litigios pendientes y riesgos regulatorios antes de cerrar un deal.',
  },
  {
    question: '¿Qué incluye el Panel de Control Empresarial?',
    answer:
      'El portal corporativo incluye seguimiento de causas laborales y civiles, gestión de comparendos ante la Inspección del Trabajo, redacción de contratos y cartas de amonestación, proyecciones de resultados y línea directa con el abogado dedicado.',
  },
  {
    question: '¿Qué es el Capítulo XIV del BCCH?',
    answer:
      'Regula los créditos, inversiones y aportes de capital desde y hacia Chile. Su cumplimiento es obligatorio para operaciones internacionales que superen los USD 10.000. El incumplimiento implica multas significativas del Banco Central.',
  },
  {
    question: '¿Cómo funciona la consulta inicial para empresas?',
    answer:
      'Es una sesión de 1 hora con el abogado corporativo asignado donde evaluamos la situación societaria, contratos vigentes y riesgos identificados. Se entrega un informe con recomendaciones y la propuesta de plan más adecuado.',
  },
]

export default function ServicioCorporativoPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [currentUser, setCurrentUser] = useState<Record<string, unknown> | null>(null)

  const handleLoginSuccess = (user: Record<string, unknown>) => {
    setCurrentUser(user)
    setShowLogin(false)
    setShowDashboard(true)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setShowDashboard(false)
  }

  if (showDashboard && currentUser) {
    return (
      <>
        <SEO
          title="Portal Corporativo — Punto Legal"
          description="Panel de administración corporativo para gestión de causas legales y comparendos."
        />
        <CorporateDashboard user={currentUser} onLogout={handleLogout} />
      </>
    )
  }

  return (
    <>
      <SEO
        title="Abogado corporativo en Chile: sociedades, contratos y M&A | Punto Legal"
        description="Expertos en derecho corporativo: constitución de SpA en 24h, contratos comerciales, M&A y gobierno corporativo. Asesoría legal empresarial de primer nivel."
      />
      <ServicioPageShell
        theme="corporativo"
        contentName="Punto Legal — Derecho Corporativo"
        contentCategory="Servicios Legales — Derecho Corporativo"
      >
        <ServicioCorporativoInner
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      </ServicioPageShell>
    </>
  )
}

function ServicioCorporativoInner({
  showLogin,
  setShowLogin,
  onLoginSuccess,
}: {
  showLogin: boolean
  setShowLogin: (v: boolean) => void
  onLoginSuccess: (user: Record<string, unknown>) => void
}) {
  const t = useServicioTheme()

  return (
    <>
      {/* Hero */}
      <section className="relative pt-8 md:pt-14 pb-10 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/12 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-700/8 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 backdrop-blur-xl ${t.chip}`}>
              <Building2 className={`w-5 h-5 ${t.accent}`} />
              <span className="text-sm font-medium text-slate-200">Especialistas en derecho corporativo (Chile)</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Potencia tu empresa con asesoría legal experta
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              Desde la constitución de tu SpA hasta operaciones complejas de M&A: somos tu socio estratégico
              con seguridad jurídica total.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/agendamiento?plan=corporativo"
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg inline-flex items-center gap-2 text-white ${t.btnPrimary} ${t.btnPrimaryHover}`}
              >
                <Calendar className="w-5 h-5" />
                Consulta corporativa
              </Link>
              <button
                onClick={() => setShowLogin(true)}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2 ${t.btnOutline} ${t.btnOutlineHover}`}
              >
                <LogIn className="w-5 h-5" />
                Portal empresa
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-y border-slate-800/80 bg-slate-950/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${t.stat}`}>{stat.number}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal corporativo highlight */}
      <section className={`py-14 md:py-16 ${t.sectionWash}`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div
            className={`rounded-[28px] border border-white/10 bg-gradient-to-r from-indigo-600/90 to-slate-700/90 backdrop-blur-2xl p-8 md:p-10 shadow-2xl shadow-indigo-950/50`}
          >
            <div className="grid md:grid-cols-2 gap-8 text-white">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.35em] mb-3 text-indigo-200">
                  Panel corporativo
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-5">
                  Control total de tu gestión legal empresarial
                </h2>
                <ul className="space-y-3">
                  {[
                    { icon: BarChart3, text: 'Seguimiento completo de causas' },
                    { icon: Calendar, text: 'Comparendos Inspección del Trabajo' },
                    { icon: FileText, text: 'Contratos y amonestaciones' },
                    { icon: AlertTriangle, text: 'Gestión de despidos y procesos' },
                    { icon: TrendingUp, text: 'Proyecciones de resultado en juicio' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-indigo-300 shrink-0" />
                      <span className="text-white/90 text-sm">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center justify-center text-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="text-indigo-200 text-sm uppercase tracking-widest">Suscripción mensual</p>
                <div className="text-5xl font-bold">$800.000</div>
                <p className="text-indigo-200 text-sm max-w-xs">
                  Acceso ilimitado al portal + abogado dedicado durante todo el mes.
                </p>
                <button
                  onClick={() => setShowLogin(true)}
                  className="mt-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Acceder al panel
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paquetes */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Paquetes corporativos</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Elige el plan que mejor se adapta al tamaño y necesidades de tu empresa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Básico',
                sub: 'Para emprendedores',
                price: '$350.000',
                popular: false,
                plan: 'corporativo-basico',
                features: [
                  'Constitución SpA o EIRL',
                  'Estatutos estándar',
                  'Inscripción CBR',
                  'RUT empresa',
                  '1 mes soporte básico',
                ],
                badge: '',
              },
              {
                name: 'Premium',
                sub: 'Para empresas en crecimiento',
                price: '$800.000',
                popular: true,
                plan: 'corporativo-premium',
                features: [
                  'Todo lo del plan Básico',
                  'Estatutos personalizados',
                  '3 contratos comerciales',
                  'Políticas internas básicas',
                  '6 meses soporte legal',
                  'Asesoría tributaria inicial',
                ],
                badge: 'Más popular',
              },
              {
                name: 'Enterprise',
                sub: 'Para grandes empresas',
                price: '$1.500.000',
                popular: false,
                plan: 'corporativo-enterprise',
                features: [
                  'Todo lo del plan Premium',
                  'Due diligence completo',
                  'Estructuración M&A',
                  'Compliance corporativo',
                  '12 meses soporte premium',
                  'Abogado dedicado',
                ],
                badge: '',
              },
            ].map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${t.cardGlass} ${
                  pkg.popular ? t.cardPopularRing : t.cardHover
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className={`${t.btnPrimary} text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                      {pkg.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{pkg.sub}</p>
                  <div className={`text-4xl font-bold mb-2 ${t.stat}`}>{pkg.price}</div>
                  <p className="text-sm text-slate-500">Pago único</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${t.accent}`} />
                      <span className="text-sm text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/agendamiento?plan=${pkg.plan}`}
                  className={`w-full rounded-xl py-3 px-6 font-semibold transition-all duration-300 text-center block text-white ${t.btnPrimary} ${t.btnPrimaryHover}`}
                >
                  Agendar consulta
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios adicionales */}
      <section className={`py-16 md:py-20 ${t.sectionWash}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Servicios adicionales</h2>
            <p className="text-lg text-slate-400">Soluciones puntuales para necesidades específicas.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className={`rounded-2xl p-6 transition-all duration-300 group ${t.cardGlass} ${t.cardHover}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 ${t.iconBox}`}
                >
                  <service.icon className={`w-7 h-7 ${t.accent}`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 mb-5 text-sm leading-relaxed">{service.description}</p>

                <ul className="space-y-2 mb-5">
                  {service.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${t.accent}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/agendamiento?plan=corporativo"
                  className={`w-full rounded-lg py-2 px-4 text-sm font-semibold text-center block border ${t.accentBorder} bg-indigo-500/10 ${t.accent} hover:bg-indigo-500/15 transition-colors`}
                >
                  Consultar
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proceso simple y transparente</h2>
            <p className="text-lg text-slate-400">Te acompañamos en cada etapa.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Consulta inicial', desc: 'Evaluamos tu caso sin costo', icon: Clock },
              { step: '2', title: 'Propuesta', desc: 'Plan de acción y honorarios claros', icon: FileText },
              { step: '3', title: 'Ejecución', desc: 'Implementamos la solución legal', icon: TrendingUp },
              { step: '4', title: 'Seguimiento', desc: 'Soporte continuo post-servicio', icon: Award },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mx-auto w-20 h-20 mb-5">
                  <div className={`absolute inset-0 rounded-full blur-xl ${t.progressBg}`} />
                  <div
                    className={`relative w-full h-full rounded-full flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-br from-indigo-600 to-slate-500 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios — burbuja iOS */}
      <section className={`py-16 md:py-20 ${t.sectionWash}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Empresas que crecen con Punto Legal 💬
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Compañías y holdings que confían en nuestro equipo para sus operaciones.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialBubble key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog corporativo */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Actualidad corporativa</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Cambios normativos que impactan a tu empresa.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                tag: 'Tributario',
                urgent: true,
                title: 'Modernización tributaria 2025',
                date: '15 ene 2025',
                read: '5 min',
                to: '/blog/ley-modernizacion-tributaria-2025',
              },
              {
                tag: 'Compliance',
                urgent: true,
                title: 'ESG: obligatorio para grandes empresas',
                date: '10 ene 2025',
                read: '6 min',
                to: '/blog/esg-compliance-2025',
              },
              {
                tag: 'Inversión',
                urgent: false,
                title: 'Facilidades para inversión extranjera en startups',
                date: '8 ene 2025',
                read: '4 min',
                to: '/blog/inversion-extranjera-startups',
              },
            ].map((article, i) => (
              <motion.article
                key={article.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-6 transition-all group ${t.cardGlass} ${t.cardHover}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {article.urgent && (
                    <span className="px-3 py-1 bg-red-500/15 text-red-400 rounded-full text-xs font-semibold">
                      Urgente
                    </span>
                  )}
                  <span className="text-xs text-slate-500">{article.tag}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-100 transition-colors group-hover:text-indigo-300">
                  {article.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <span>{article.date}</span>
                  <span>• {article.read}</span>
                </div>
                <Link
                  to={article.to}
                  className={`font-medium flex items-center gap-2 group/link ${t.link} ${t.linkHover}`}
                >
                  Leer más
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/blog/categoria/corporativo"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${t.accentBorder} bg-indigo-500/10 ${t.accent}`}
            >
              Ver todos los artículos corporativos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 border-t border-slate-800/80 bg-slate-950/40">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            Preguntas frecuentes — derecho corporativo en Chile
          </h2>
          <div>
            {corporativoFaq.map((item, i) => (
              <CorporativoFaqItem key={i} item={item} accentClass={t.accent} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className={`py-16 md:py-24 bg-gradient-to-r ${t.stripeCta}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-10 md:p-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Listo para llevar tu empresa al siguiente nivel?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Agenda una consulta especializada con nuestros expertos en derecho corporativo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/agendamiento?plan=corporativo"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white ${t.btnPrimary} ${t.btnPrimaryHover}`}
              >
                <Calendar className="w-5 h-5" />
                Consulta corporativa
              </Link>
              <button
                onClick={() => setShowLogin(true)}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold ${t.btnOutline} ${t.btnOutlineHover}`}
              >
                <LogIn className="w-5 h-5" />
                Acceder al portal empresa
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Punto Legal Online. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs max-w-2xl mx-auto">
            Información orientativa. Para evaluar tu caso,{' '}
            <Link to="/agendamiento?plan=corporativo" className={`${t.link} underline`}>
              agenda una consulta
            </Link>
            .
          </p>
        </div>
      </footer>

      {/* Modal login empresa */}
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
                onLoginSuccess={onLoginSuccess}
                isModal={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function CorporativoFaqItem({
  item,
  accentClass,
}: {
  item: { question: string; answer: string }
  accentClass: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-700/90">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-lg font-medium text-slate-200 pr-4 hover:text-indigo-300 transition-colors">
          {item.question}
        </h3>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? (
            <Minus className={`h-5 w-5 shrink-0 ${accentClass}`} />
          ) : (
            <Plus className="text-slate-400 h-5 w-5 shrink-0" />
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
