import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Scale,
  FileText,
  CreditCard,
  Users,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  Calendar,
  Calculator,
  Plus,
  Minus,
  Timer,
  BookOpen,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import ServicioPageShell from '@/components/servicios/ServicioPageShell'
import { useServicioTheme } from '@/components/servicios/servicioThemeContext'
import TestimonialBubble from '@/components/servicios/TestimonialBubble'

const services = [
  {
    icon: CreditCard,
    title: 'Cobranza Judicial',
    description: 'Recuperación efectiva de deudas y créditos impagas.',
    features: ['Gestión prejudicial', 'Juicios ejecutivos', 'Embargos y remates', 'Acuerdos de pago'],
  },
  {
    icon: FileText,
    title: 'Contratos Civiles',
    description: 'Redacción y revisión de todo tipo de contratos.',
    features: ['Contratos de servicios', 'Mandatos', 'Comodatos', 'Contratos atípicos'],
  },
  {
    icon: Users,
    title: 'Responsabilidad Civil',
    description: 'Demandas por daños y perjuicios.',
    features: ['Accidentes de tránsito', 'Responsabilidad médica', 'Daño moral', 'Lucro cesante'],
  },
  {
    icon: Scale,
    title: 'Litigios Civiles',
    description: 'Representación en conflictos civiles complejos.',
    features: ['Nulidad de contratos', 'Incumplimientos', 'Resolución contractual', 'Indemnizaciones'],
  },
]

const testimonials = [
  {
    name: 'Pedro Ramírez',
    role: 'Empresario',
    content:
      'Recuperé $80 millones en deudas que creía perdidas. Su gestión de cobranza fue excepcional y muy profesional.',
    rating: 5,
  },
  {
    name: 'Sofía González',
    role: 'Víctima de accidente',
    content:
      'Me ayudaron a obtener una indemnización justa por mi accidente. Su conocimiento en responsabilidad civil es impresionante.',
    rating: 5,
  },
  {
    name: 'Comercial Los Andes',
    role: 'Empresa comercial',
    content: 'Resolvieron un conflicto contractual complejo que nos tenía paralizado. Excelente estrategia legal.',
    rating: 5,
  },
]

const stats = [
  { number: '$2.1B+', label: 'Recuperado en cobranzas' },
  { number: '1.800+', label: 'Casos resueltos' },
  { number: '89%', label: 'Tasa de éxito' },
  { number: '30d', label: 'Tiempo promedio resolución' },
]

const civilFaq = [
  {
    question: '¿Cuánto tiempo tengo para demandar una deuda civil en Chile?',
    answer:
      'Depende del tipo de obligación y del título que la acredite. En muchas acciones personales rigen plazos de prescripción de cuatro años (Código Civil), pero hay excepciones: por ejemplo, algunas acciones hipotecarias y la ejecución de ciertos títulos pueden tener reglas distintas. Conviene revisar el documento y la fecha del incumplimiento sin demora.',
  },
  {
    question: '¿Qué es un juicio ejecutivo y cuándo conviene?',
    answer:
      'Es un proceso para exigir el cumplimiento de obligaciones acreditadas con documentos que tengan mérito ejecutivo (pagarés, cheques, escrituras públicas, etc.). Suele ser más ágil que la ordinaria cuando existe un título claro y exigible.',
  },
  {
    question: '¿Puedo reclamar indemnización por accidente de tránsito?',
    answer:
      'Sí, si se acredita la culpa o el vínculo de causalidad y el daño (emergente, lucro cesante o moral según el caso). Se analiza la carpeta del accidente, informes médicos y pericias cuando corresponde.',
  },
  {
    question: '¿Qué diferencia hay entre nulidad y resolución de un contrato?',
    answer:
      'La nulidad ataca un vicio que impide que el negocio produzca efectos válidos en determinados casos; la resolución pone término a un contrato válido por incumplimiento grave o por causales legales o pactadas. La estrategia depende de los hechos y de la prueba disponible.',
  },
  {
    question: '¿Cómo funciona la consulta para evaluar mi caso civil?',
    answer:
      'Agendas una consulta estratégica, reunimos la documentación esencial y te entregamos una primera evaluación de viabilidad, riesgos procesales y próximos pasos. Si contratas un plan, el enfoque se ajusta a la complejidad del litigio o cobranza.',
  },
]

export default function ServicioCivilPage() {
  return (
    <>
      <SEO
        title="Derecho civil en Chile: cobranza, contratos y litigios | Punto Legal"
        description="Abogados civiles en Chile: cobranza judicial, juicio ejecutivo, contratos, responsabilidad civil y litigios. Consulta estratégica y defensa en tribunales."
      />
      <ServicioPageShell
        theme="civil"
        contentName="Punto Legal — Derecho Civil"
        contentCategory="Servicios Legales — Derecho Civil"
      >
        <ServicioCivilInner />
      </ServicioPageShell>
    </>
  )
}

function ServicioCivilInner() {
  const t = useServicioTheme()

  return (
    <>
      {/* Hero */}
      <section className="relative pt-8 md:pt-14 pb-10 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-900/8 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 backdrop-blur-xl ${t.chip}`}
            >
              <Scale className={`w-5 h-5 ${t.accent}`} />
              <span className="text-sm font-medium text-slate-200">Especialistas en derecho civil (Chile)</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Protege tus derechos civiles con claridad y estrategia
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              Cobranza judicial, contratos y litigios civiles con un enfoque moderno: menos incertidumbre, más
              planificación procesal.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/agendamiento?plan=civil"
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg inline-flex items-center gap-2 ${t.btnPrimary} ${t.btnPrimaryHover}`}
              >
                <Calendar className="w-5 h-5" />
                Agendar consulta civil
              </Link>
              <Link
                to="/contacto"
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${t.btnOutline} ${t.btnOutlineHover}`}
              >
                Evaluar mi caso
              </Link>
              <Link
                to="/calculadora-cobranza"
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${t.btnOutline} ${t.btnOutlineHover}`}
              >
                Calculadora de costos
              </Link>
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

      {/* Micro-conversión: plazos y contratos */}
      <section className={`py-14 md:py-16 ${t.sectionWash}`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 backdrop-blur-xl p-6 md:p-10 shadow-2xl shadow-black/40">
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/25 to-sky-500/15 border border-emerald-500/20">
                <Timer className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Verificador rápido: plazos y contratos
                </h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Antes de perder un plazo procesal o firmar un contrato adverso, revisa estos puntos típicos en
                  materia civil chilena (orientación general; tu caso puede variar).
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Prescripción y notificaciones: la cuenta puede partir del vencimiento o del conocimiento del daño, según la acción.',
                    'Contratos civiles: distingue entre cláusulas esenciales, condiciones resolutorias y penalidades.',
                    'Cobranza: valida si tu documento tiene mérito ejecutivo o si conviene vía ordinaria.',
                  ].map((line, i) => (
                    <li key={i} className="flex gap-3 text-slate-300 text-sm md:text-base">
                      <BookOpen className={`w-5 h-5 shrink-0 mt-0.5 ${t.accent}`} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/agendamiento?plan=civil-diagnostico"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white ${t.btnPrimary} ${t.btnPrimaryHover}`}
                  >
                    Revisión de mi documento
                  </Link>
                  <Link
                    to="/calculadora-cobranza"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${t.btnOutline} ${t.btnOutlineHover}`}
                  >
                    Ir a calculadora de cobranza
                  </Link>
                </div>
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Paquetes de servicios civiles</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Soluciones integrales para cobranza, litigios y asesoría continua.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${t.cardGlass} ${t.cardHover}`}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Cobranza express</h3>
                <p className="text-slate-400 mb-4">Para deudas hasta $5M</p>
                <div className={`text-4xl font-bold mb-2 ${t.stat}`}>$280.000</div>
                <p className="text-sm text-slate-500">+ 15% del monto recuperado</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Gestión extrajudicial previa',
                  'Demanda de cobro',
                  'Medidas precautorias',
                  'Ejecución de sentencia',
                  'Seguimiento hasta cobro',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${t.accent}`} />
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <div className={`rounded-lg p-3 mb-6 border ${t.pillSuccess}`}>
                <p className={`text-sm font-semibold ${t.pillSuccessText}`}>85% de éxito en cobranza</p>
              </div>

              <Link
                to="/agendamiento?plan=cobranza-express"
                className={`w-full rounded-xl py-3 px-6 font-semibold transition-all duration-300 text-center block border ${t.accentBorder} bg-emerald-500/10 ${t.accent} hover:bg-emerald-500/15`}
              >
                Agendar consulta
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${t.cardGlass} ${t.cardPopularRing}`}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div
                  className={`${t.btnPrimary} px-4 py-1 rounded-full text-sm font-semibold text-white shadow-lg`}
                >
                  Más completo
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Litigios premium</h3>
                <p className="text-slate-400 mb-4">Para casos complejos</p>
                <div className={`text-4xl font-bold mb-2 ${t.stat}`}>$950.000</div>
                <p className="text-sm text-slate-500">Proceso completo</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Todo lo del plan express',
                  'Análisis de viabilidad',
                  'Contratos civiles incluidos',
                  'Recursos de apelación',
                  'Mediación y arbitraje',
                  'Atención prioritaria',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${t.accent}`} />
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <div className={`rounded-lg p-3 mb-6 border ${t.progressBg} border-emerald-500/25`}>
                <p className={`text-sm font-semibold ${t.accent}`}>92% de éxito en litigios</p>
              </div>

              <Link
                to="/agendamiento?plan=litigios-premium"
                className={`w-full rounded-xl py-3 px-6 font-semibold transition-all duration-300 text-center block text-white ${t.btnPrimary} ${t.btnPrimaryHover}`}
              >
                Agendar consulta
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${t.cardGlass} ${t.cardHover}`}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Corporativo civil</h3>
                <p className="text-slate-400 mb-4">Para empresas</p>
                <div className={`text-4xl font-bold mb-2 ${t.accentSecondary}`}>$1.800.000</div>
                <p className="text-sm text-slate-500">Anual con soporte</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Todo lo del plan premium',
                  'Múltiples casos incluidos',
                  'Contratos comerciales',
                  'Responsabilidad civil',
                  'Abogado corporativo dedicado',
                  'Soporte legal 24/7',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${t.accentSecondary}`} />
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <div className={`rounded-lg p-3 mb-6 border ${t.accentSecondaryBg} ${t.accentSecondaryBorder}`}>
                <p className={`text-sm font-semibold ${t.accentSecondary}`}>Ahorro frente a casos individuales</p>
              </div>

              <Link
                to="/agendamiento?plan=corporativo-civil"
                className={`w-full rounded-xl py-3 px-6 font-semibold transition-all duration-300 text-center block text-white ${t.btnPrimary} ${t.btnPrimaryHover}`}
              >
                Agendar consulta
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Servicios grid */}
      <section className="py-16 md:py-20 bg-slate-950/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nuestros servicios civiles</h2>
            <p className="text-lg text-slate-400">Cobertura integral para conflictos civiles y comerciales.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div
                  className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${t.accentGlow}`}
                />

                <div className={`relative rounded-2xl p-8 transition-all duration-300 ${t.cardGlass} ${t.cardHover}`}>
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 ${t.iconBox}`}
                  >
                    <service.icon className={`w-8 h-8 ${t.accent}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-slate-400 mb-6">{service.description}</p>

                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${t.accent}`} />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cobranza */}
      <section className={`py-16 md:py-20 ${t.sectionWash}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cobranza judicial efectiva</h2>
            <p className="text-lg text-slate-400">Tres etapas para recuperar lo que es tuyo.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Gestión prejudicial',
                description: 'Intentamos recuperar la deuda sin llegar a juicio',
                features: ['Cartas de cobranza', 'Negociación directa', 'Acuerdos de pago', 'Mediación'],
                success: '70% de casos resueltos',
              },
              {
                title: 'Juicio ejecutivo',
                description: 'Proceso acelerado con título con mérito ejecutivo',
                features: ['Pagarés', 'Letras de cambio', 'Cheques protestados', 'Facturas impagas'],
                success: '85% de recuperación',
              },
              {
                title: 'Embargo y remate',
                description: 'Ejecución forzada cuando el deudor no paga',
                features: ['Embargo de bienes', 'Remate público', 'Liquidación', 'Pago efectivo'],
                success: 'Proceso confidencial',
              },
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`rounded-2xl p-6 ${t.cardGlass}`}
              >
                <h3 className={`text-xl font-bold mb-3 ${t.accent}`}>{process.title}</h3>
                <p className="text-slate-400 mb-4">{process.description}</p>

                <ul className="space-y-2 mb-4">
                  {process.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${t.dot}`} />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={`rounded-lg p-3 text-center border ${t.progressBg} border-emerald-500/20`}>
                  <span className={`font-semibold ${t.accent}`}>{process.success}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsabilidad civil */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Responsabilidad civil</h2>
            <p className="text-lg text-slate-400">Indemnización según la normativa chilena vigente.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Tipos de daños que cubrimos</h3>
              <div className="space-y-4">
                {[
                  { title: 'Daño emergente', desc: 'Pérdidas económicas directas y comprobables' },
                  { title: 'Lucro cesante', desc: 'Ganancias que dejaste de percibir' },
                  { title: 'Daño moral', desc: 'Afectación psíquica acreditable según el caso' },
                  { title: 'Daño físico', desc: 'Lesiones y tratamientos médicos vinculados al hecho dañoso' },
                ].map((damage, index) => (
                  <div key={index} className="rounded-xl p-4 border border-white/10 bg-slate-950/40">
                    <h4 className={`font-semibold mb-2 ${t.accent}`}>{damage.title}</h4>
                    <p className="text-sm text-slate-400">{damage.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Casos frecuentes</h3>
              <div className="space-y-3">
                {[
                  'Accidentes de tránsito',
                  'Negligencia médica',
                  'Accidentes laborales (vía civil)',
                  'Productos defectuosos',
                  'Responsabilidad profesional',
                  'Daños en construcción',
                  'Responsabilidad de establecimientos',
                  'Daños causados por animales domésticos',
                ].map((caso, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 shrink-0 ${t.accent}`} />
                    <span className="text-slate-300">{caso}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className={`py-16 md:py-20 ${t.sectionWash}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nuestro proceso de trabajo</h2>
            <p className="text-lg text-slate-400">Metodología clara para casos civiles.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Evaluación', desc: 'Análisis de viabilidad', icon: Clock },
              { step: '2', title: 'Estrategia', desc: 'Plan de acción personalizado', icon: FileText },
              { step: '3', title: 'Ejecución', desc: 'Tramitación y audiencias', icon: Scale },
              { step: '4', title: 'Resultado', desc: 'Cobro o indemnización', icon: Award },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <div className={`absolute inset-0 rounded-full blur-xl ${t.progressBg}`} />
                  <div
                    className={`relative rounded-full flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-br from-emerald-500 to-sky-600 shadow-lg`}
                  >
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios — burbuja iOS */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Clientes que recuperaron lo suyo 💬
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Experiencias reales en cobranza, litigios y disputas civiles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialBubble key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 border-t border-slate-800/80 bg-slate-950/40">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            Preguntas frecuentes — derecho civil en Chile
          </h2>
          <div>
            {civilFaq.map((item, index) => (
              <CivilFaqItem key={index} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Actualidad — cards compactas */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Actualidad en derecho civil</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Referencias para profundizar (blog Punto Legal).
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                tag: 'Contratos',
                urgent: true,
                title: 'Reforma al Código Civil: contratos',
                date: '23 ene 2025',
                read: '9 min',
                excerpt: 'Cambios en teoría general de contratos y nuevas causales de nulidad…',
                to: '/blog/reforma-codigo-civil-contratos',
              },
              {
                tag: 'Responsabilidad',
                urgent: true,
                title: 'Daño moral: criterios indemnizatorios',
                date: '21 ene 2025',
                read: '7 min',
                excerpt: 'Actualización de criterios de la jurisprudencia nacional…',
                to: '/blog/dano-moral-montos-2025',
              },
              {
                tag: 'Prescripción',
                urgent: false,
                title: 'Prescripción civil: plazos clave',
                date: '19 ene 2025',
                read: '6 min',
                excerpt: 'Plazos de prescripción para acciones civiles y comerciales…',
                to: '/blog/prescripcion-civil-cambios',
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
                <h3 className="text-xl font-bold mb-2 text-slate-100 transition-colors group-hover:text-emerald-300">
                  {article.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <span>{article.date}</span>
                  <span>• {article.read}</span>
                </div>
                <p className="text-slate-400 mb-4 text-sm">{article.excerpt}</p>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/blog/categoria/civil"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${t.accentBorder} bg-emerald-500/10 ${t.accent}`}
            >
              Ver todos los artículos civiles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section className={`py-16 md:py-24 bg-gradient-to-r ${t.stripeCta}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-10 md:p-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Listo para resolver tu conflicto civil?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Agenda una consulta o usa nuestras herramientas para estimar costos e indemnizaciones.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/agendamiento?plan=civil"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white ${t.btnPrimary} ${t.btnPrimaryHover}`}
              >
                <Calendar className="w-5 h-5" />
                Consulta civil
              </Link>

              <Link
                to="/calculadora-indemnizacion"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold ${t.btnOutline} ${t.btnOutlineHover}`}
              >
                <Calculator className="w-5 h-5" />
                Calculadora de indemnización
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Punto Legal Online. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs max-w-2xl mx-auto">
            La información es orientativa y no reemplaza asesoría legal. Para evaluar tu caso concreto,{' '}
            <Link to="/agendamiento?plan=civil" className={`${t.link} underline`}>
              agenda una consulta
            </Link>
            .
          </p>
        </div>
      </footer>
    </>
  )
}

function CivilFaqItem({
  item,
}: {
  item: { question: string; answer: string }
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-700/90">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-lg font-medium text-slate-200 pr-4 transition-colors hover:text-emerald-300">
          {item.question}
        </h3>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? (
            <Minus className="h-5 w-5 shrink-0 text-emerald-400" />
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
