import { motion } from 'framer-motion'
import { HomeIcon, FileText, Shield, TrendingUp, CheckCircle, Star, Clock, Award, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const services = [
  {
    icon: FileText,
    title: 'Compraventa de Propiedades',
    description: 'Asesoría completa en transacciones inmobiliarias seguras.',
    features: ['Estudio de títulos', 'Redacción de contratos', 'Gestión de escrituras', 'Due diligence inmobiliaria']
  },
  {
    icon: HomeIcon,
    title: 'Contratos de Arriendo',
    description: 'Protección legal para propietarios e inquilinos.',
    features: ['Contratos residenciales', 'Contratos comerciales', 'Gestión de garantías', 'Resolución de conflictos']
  },
  {
    icon: Shield,
    title: 'Regularización de Propiedades',
    description: 'Solución a problemas de títulos y documentación.',
    features: ['Saneamiento de títulos', 'Prescripción adquisitiva', 'Subdivisiones', 'Fusión de predios']
  },
  {
    icon: TrendingUp,
    title: 'Inversión Inmobiliaria',
    description: 'Estructuración legal para proyectos de inversión.',
    features: ['Sociedades inmobiliarias', 'Fideicomisos', 'Joint ventures', 'Análisis de riesgos']
  }
]

const testimonials = [
  {
    name: 'Ana Rodríguez',
    role: 'Inversionista Inmobiliaria',
    content: 'Me ayudaron a detectar problemas graves en una propiedad que iba a comprar. Su estudio de títulos me ahorró una pérdida de $200 millones.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'Miguel Torres',
    role: 'Propietario',
    content: 'Resolvieron un problema de títulos que tenía hace 15 años. Ahora puedo vender mi propiedad sin problemas.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'Constructora Del Valle',
    role: 'Empresa Constructora',
    content: 'Su asesoría en la adquisición de terrenos para nuestro proyecto fue impecable. Excelente trabajo en due diligence.',
    rating: 5,
    image: '/api/placeholder/80/80'
  }
]

const stats = [
  { number: '2,500+', label: 'Transacciones exitosas' },
  { number: '$850M+', label: 'En transacciones asesoradas' },
  { number: '99.2%', label: 'Sin problemas post-venta' },
  { number: '48h', label: 'Tiempo promedio estudio títulos' }
]

export default function ServicioInmobiliarioPage() {
  return (
    <>
      <SEO 
        title="Derecho Inmobiliario - Especialistas en Propiedades | Punto Legal"
        description="Expertos en derecho inmobiliario: compraventa, arriendos, estudio de títulos y regularización de propiedades. Protege tu inversión inmobiliaria."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <HomeIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Especialistas en Derecho Inmobiliario</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Protege tu Patrimonio Inmobiliario
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Desde la compra de tu primera casa hasta complejas operaciones de inversión, 
                te acompañamos con la experiencia y seguridad jurídica que tu patrimonio merece.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/contacto"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Estudio de Títulos
                </Link>
                <Link
                  to="/calculadora-propiedades"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Calculadora de Costos
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-white/10">
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
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Packages */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Paquetes de Servicios Inmobiliarios</h2>
              <p className="text-xl text-muted-foreground">Protección completa para tu inversión inmobiliaria</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Comprador Básico */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Comprador Seguro</h3>
                  <p className="text-muted-foreground mb-4">Para compradores de vivienda</p>
                  <div className="text-4xl font-bold text-primary mb-2">$450.000</div>
                  <p className="text-sm text-muted-foreground">Por transacción</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Estudio de títulos completo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Revisión de certificados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Informe de observaciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Redacción de promesa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Acompañamiento en firma</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=comprador-seguro"
                  className="w-full bg-primary/10 text-primary border border-primary/30 rounded-xl py-3 px-6 font-semibold hover:bg-primary/20 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Inversionista Premium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/50 hover:border-primary transition-all duration-300"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Completo
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Inversionista Pro</h3>
                  <p className="text-muted-foreground mb-4">Para inversionistas inmobiliarios</p>
                  <div className="text-4xl font-bold text-primary mb-2">$850.000</div>
                  <p className="text-sm text-muted-foreground">Por transacción</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Comprador</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Due diligence inmobiliaria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Análisis de rentabilidad legal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Estructuración tributaria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos de arrendamiento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Seguimiento post-compra</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=inversionista-pro"
                  className="w-full bg-primary text-white rounded-xl py-3 px-6 font-semibold hover:bg-primary/90 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Desarrollador Enterprise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Desarrollador Elite</h3>
                  <p className="text-muted-foreground mb-4">Para desarrolladores inmobiliarios</p>
                  <div className="text-4xl font-bold text-primary mb-2">$2.500.000</div>
                  <p className="text-sm text-muted-foreground">Por proyecto</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Inversionista</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Estudios de factibilidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Tramitación de permisos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Constitución inmobiliarias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos con constructoras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Abogado dedicado al proyecto</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=desarrollador-elite"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl py-3 px-6 font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Nuestros Servicios Inmobiliarios</h2>
              <p className="text-xl text-muted-foreground">Soluciones integrales para todas tus necesidades inmobiliarias</p>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Warning Section */}
        <section className="py-20 bg-gradient-to-b from-red-500/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-red-400">
                      ¿Sabías que el 30% de las propiedades en Chile tienen problemas de títulos?
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Problemas más comunes:</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Títulos defectuosos o incompletos</li>
                          <li>• Hipotecas no alzadas</li>
                          <li>• Problemas de sucesión</li>
                          <li>• Diferencias en deslindes</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Consecuencias:</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Imposibilidad de vender</li>
                          <li>• Pérdida de financiamiento</li>
                          <li>• Litigios costosos</li>
                          <li>• Devaluación del inmueble</li>
                        </ul>
                      </div>
                    </div>
                    <p className="mt-4 font-medium">
                      Un estudio de títulos profesional puede prevenir estos problemas y proteger tu inversión.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Nuestro Proceso de Estudio de Títulos</h2>
              <p className="text-xl text-muted-foreground">Metodología probada para transacciones seguras</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: '1', title: 'Análisis Inicial', desc: 'Revisión de antecedentes básicos', icon: Clock },
                { step: '2', title: 'Investigación', desc: 'Estudio exhaustivo de títulos', icon: FileText },
                { step: '3', title: 'Informe', desc: 'Reporte detallado de hallazgos', icon: Shield },
                { step: '4', title: 'Recomendaciones', desc: 'Plan de acción y soluciones', icon: Award }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                    <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Casos de Éxito Reales</h2>
              <p className="text-xl text-muted-foreground">Clientes que protegieron su patrimonio</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Real Estate Market Updates */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Actualidad del Mercado Inmobiliario</h2>
              <p className="text-xl text-muted-foreground">Mantente informado sobre cambios legales y tendencias del mercado</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Nueva Ley de Copropiedad 2025: Cambios Importantes",
                  excerpt: "Las modificaciones a la ley de copropiedad que afectan administradores y propietarios...",
                  date: "16 Enero 2025",
                  readTime: "6 min",
                  category: "Copropiedad",
                  urgent: true,
                  link: "/blog/nueva-ley-copropiedad-2025"
                },
                {
                  title: "Crédito Hipotecario: Nuevas Regulaciones SBIF",
                  excerpt: "Cambios en los requisitos y procedimientos para créditos hipotecarios...",
                  date: "14 Enero 2025", 
                  readTime: "5 min",
                  category: "Financiamiento",
                  urgent: false,
                  link: "/blog/regulaciones-credito-hipotecario"
                },
                {
                  title: "Subsidio Habitacional 2025: Nuevos Montos y Requisitos",
                  excerpt: "Actualizaciones en los programas de subsidio habitacional del gobierno...",
                  date: "12 Enero 2025",
                  readTime: "7 min", 
                  category: "Subsidios",
                  urgent: true,
                  link: "/blog/subsidio-habitacional-2025"
                },
                {
                  title: "Inversión Extranjera en Real Estate: Facilidades",
                  excerpt: "Nuevas facilidades para inversionistas extranjeros en el mercado inmobiliario...",
                  date: "10 Enero 2025",
                  readTime: "8 min",
                  category: "Inversión",
                  urgent: false,
                  link: "/blog/inversion-extranjera-inmobiliaria"
                },
                {
                  title: "Ley de Arriendo: Modificaciones que Debes Conocer",
                  excerpt: "Cambios en la legislación de arriendo que afectan propietarios e inquilinos...",
                  date: "8 Enero 2025",
                  readTime: "6 min",
                  category: "Arriendos",
                  urgent: true,
                  link: "/blog/modificaciones-ley-arriendo"
                },
                {
                  title: "Plusvalía Inmobiliaria: Nuevas Exenciones Tributarias",
                  excerpt: "Beneficios tributarios para la venta de propiedades habitacionales...",
                  date: "6 Enero 2025",
                  readTime: "5 min",
                  category: "Tributario",
                  urgent: false,
                  link: "/blog/exenciones-plusvalia-2025"
                }
              ].map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <Link 
                    to={article.link}
                    className="relative block bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300"
                  >
                    {article.urgent && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        URGENTE
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                      <span className="text-xs text-muted-foreground">• {article.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                      <span>Leer más</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/blog?categoria=inmobiliario"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl font-semibold hover:bg-primary/20 transition-all duration-300"
              >
                Ver Todos los Artículos Inmobiliarios
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-12 text-center"
            >
              <div className="absolute inset-0 bg-grid-white/10" />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-4">
                  ¿Vas a Comprar o Vender una Propiedad?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  No arriesgues tu patrimonio. Solicita un estudio de títulos profesional
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/contacto"
                    className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Solicitar Estudio
                  </Link>
                  <a
                    href="tel:+56912345678"
                    className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                  >
                    Llamar Ahora
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
} 