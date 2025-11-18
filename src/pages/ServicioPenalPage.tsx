import { motion } from 'framer-motion'
import { Shield, Gavel, FileText, Users, CheckCircle, Star, Clock, Award, AlertCircle, ArrowRight, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const services = [
  {
    icon: Shield,
    title: 'Defensa Penal',
    description: 'Representación legal especializada en procesos penales.',
    features: ['Delitos económicos', 'Delitos contra las personas', 'Delitos de tránsito', 'Defensa en flagrancia']
  },
  {
    icon: Gavel,
    title: 'Querella Criminal',
    description: 'Acciones legales para perseguir delitos que te afectan.',
    features: ['Estafas y fraudes', 'Apropiación indebida', 'Amenazas', 'Delitos informáticos']
  },
  {
    icon: FileText,
    title: 'Asesoría Preventiva',
    description: 'Prevención de riesgos penales empresariales.',
    features: ['Compliance penal', 'Protocolos internos', 'Capacitación legal', 'Auditorías preventivas']
  },
  {
    icon: Users,
    title: 'Mediación Penal',
    description: 'Soluciones alternativas en casos aplicables.',
    features: ['Acuerdos reparatorios', 'Suspensión condicional', 'Salidas alternativas', 'Mediación víctima-imputado']
  }
]

const testimonials = [
  {
    name: 'Carlos Empresario',
    role: 'Director General, Empresa Constructora',
    content: 'Me defendieron exitosamente en un caso complejo de delito económico. Su estrategia fue impecable y logramos la absolución.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'María Víctima',
    role: 'Víctima de Estafa',
    content: 'Me ayudaron a recuperar $50 millones que me habían estafado. Su querella fue precisa y efectiva.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'Empresa Tecnológica',
    role: 'Startup Tech',
    content: 'Su programa de compliance penal nos protegió de riesgos legales importantes. Excelente asesoría preventiva.',
    rating: 5,
    image: '/api/placeholder/80/80'
  }
]

const stats = [
  { number: '100%', label: 'Confidencialidad' },
  { number: '500+', label: 'Clientes defendidos' },
  { number: '24h', label: 'Respuesta en urgencias' },
  { number: '15+', label: 'Años de experiencia' }
]

export default function ServicioPenalPage() {
  return (
    <>
      <SEO 
        title="Derecho Penal - Abogados Penalistas Expertos | Punto Legal"
        description="Especialistas en derecho penal: defensa criminal, querellas, delitos económicos y asesoría preventiva. Protege tus derechos con expertos."
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
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Especialistas en Derecho Penal</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Defensa Legal Especializada
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Cuando tu libertad, honor o patrimonio están en riesgo, necesitas la mejor defensa. 
                Somos especialistas en derecho penal con experiencia comprobada en casos complejos.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/agendamiento?plan=consulta-urgente-penal"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Consulta Urgente
                </Link>
                <a
                  href="tel:+56912345678"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Llamar 24/7
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Emergency Alert */}
        <section className="py-8 bg-red-500/10 border-y border-red-500/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 animate-pulse" />
                <div>
                  <h3 className="text-2xl font-bold text-red-400 mb-2">¿Situación de Emergencia Legal?</h3>
                  <p className="text-red-300">
                    Atendemos urgencias penales 24/7. Cada minuto cuenta en tu defensa.
                  </p>
                </div>

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

        {/* Defense Packages */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Paquetes de Defensa Penal</h2>
              <p className="text-xl text-muted-foreground">Protección legal especializada según tu situación</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Defensa Básica */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Defensa Esencial</h3>
                  <p className="text-muted-foreground mb-4">Para casos simples</p>
                  <div className="text-4xl font-bold text-primary mb-2">$650.000</div>
                  <p className="text-sm text-muted-foreground">Proceso completo</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Asesoría inicial gratuita</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Preparación de defensa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Representación en audiencias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Seguimiento del caso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Soporte durante 3 meses</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=defensa-esencial"
                  className="w-full bg-primary/10 text-primary border border-primary/30 rounded-xl py-3 px-6 font-semibold hover:bg-primary/20 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Defensa Premium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/50 hover:border-primary transition-all duration-300"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Efectivo
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Defensa Premium</h3>
                  <p className="text-muted-foreground mb-4">Para casos complejos</p>
                  <div className="text-4xl font-bold text-primary mb-2">$1.200.000</div>
                  <p className="text-sm text-muted-foreground">Proceso completo</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Esencial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Investigación privada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Peritos especializados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Recursos de apelación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Atención prioritaria 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Soporte durante 6 meses</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=defensa-premium"
                  className="w-full bg-primary text-white rounded-xl py-3 px-6 font-semibold hover:bg-primary/90 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Defensa Elite */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Defensa Elite</h3>
                  <p className="text-muted-foreground mb-4">Para casos de alto perfil</p>
                  <div className="text-4xl font-bold text-primary mb-2">$2.500.000</div>
                  <p className="text-sm text-muted-foreground">Proceso completo</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Equipo de abogados senior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Estrategia mediática</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Coordinación internacional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Recursos hasta última instancia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Abogado dedicado exclusivo</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=defensa-elite"
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
              <h2 className="text-4xl font-bold mb-4">Nuestros Servicios Penales</h2>
              <p className="text-xl text-muted-foreground">Defensa integral en todas las áreas del derecho penal</p>
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

        {/* Specialties Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Especialidades Destacadas</h2>
              <p className="text-xl text-muted-foreground">Áreas donde tenemos mayor experiencia y éxito</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: 'Delitos Económicos',
                  items: ['Estafas y fraudes', 'Lavado de dinero', 'Delitos tributarios', 'Giro doloso de cheques'],
                  color: 'orange'
                },
                {
                  title: 'Delitos de Tránsito',
                  items: ['Manejo en estado de ebriedad', 'Cuasidelito de homicidio', 'Lesiones culposas', 'Fuga del lugar'],
                  color: 'amber'
                },
                {
                  title: 'Delitos Empresariales',
                  items: ['Responsabilidad penal empresarial', 'Delitos laborales', 'Delitos ambientales', 'Competencia desleal'],
                  color: 'orange'
                }
              ].map((specialty, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-bold mb-4 text-primary">{specialty.title}</h3>
                  <ul className="space-y-2">
                    {specialty.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
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
              <h2 className="text-4xl font-bold mb-4">Nuestro Proceso de Defensa</h2>
              <p className="text-xl text-muted-foreground">Metodología probada para tu defensa</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: '1', title: 'Evaluación Urgente', desc: 'Análisis inmediato del caso', icon: Clock },
                { step: '2', title: 'Estrategia', desc: 'Plan de defensa personalizado', icon: FileText },
                { step: '3', title: 'Ejecución', desc: 'Implementación de la defensa', icon: Shield },
                { step: '4', title: 'Seguimiento', desc: 'Acompañamiento post-proceso', icon: Award }
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
              <h2 className="text-4xl font-bold mb-4">Casos Defendidos con Éxito</h2>
              <p className="text-xl text-muted-foreground">Testimonios reales de clientes defendidos</p>
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

        {/* Criminal Law Updates */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Actualidad en Derecho Penal</h2>
              <p className="text-xl text-muted-foreground">Mantente informado sobre cambios en la legislación penal</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Nueva Ley de Delitos Informáticos 2025",
                  excerpt: "Importantes cambios en la tipificación de delitos cibernéticos y sus penas...",
                  date: "18 Enero 2025",
                  readTime: "7 min",
                  category: "Ciberseguridad",
                  urgent: true,
                  link: "/blog/ley-delitos-informaticos-2025"
                },
                {
                  title: "Reforma Procesal Penal: Nuevos Plazos",
                  excerpt: "Modificaciones en los plazos procesales que afectan la defensa penal...",
                  date: "16 Enero 2025", 
                  readTime: "6 min",
                  category: "Procesal",
                  urgent: true,
                  link: "/blog/reforma-procesal-penal-plazos"
                },
                {
                  title: "Violencia Intrafamiliar: Endurecimiento de Penas",
                  excerpt: "Nuevas modificaciones al marco legal de violencia doméstica...",
                  date: "14 Enero 2025",
                  readTime: "8 min", 
                  category: "VIF",
                  urgent: false,
                  link: "/blog/violencia-intrafamiliar-penas"
                },
                {
                  title: "Delitos Económicos: Nuevas Figuras Penales",
                  excerpt: "Tipificación de nuevos delitos relacionados con criptomonedas y fintech...",
                  date: "12 Enero 2025",
                  readTime: "9 min",
                  category: "Económico",
                  urgent: true,
                  link: "/blog/delitos-economicos-fintech"
                },
                {
                  title: "Prisión Preventiva: Criterios Actualizados",
                  excerpt: "Nuevos criterios para la aplicación de medidas cautelares personales...",
                  date: "10 Enero 2025",
                  readTime: "5 min",
                  category: "Cautelares",
                  urgent: false,
                  link: "/blog/prision-preventiva-criterios"
                },
                {
                  title: "Responsabilidad Penal Juvenil: Cambios 2025",
                  excerpt: "Modificaciones en el sistema de justicia penal adolescente...",
                  date: "8 Enero 2025",
                  readTime: "6 min",
                  category: "Juvenil",
                  urgent: false,
                  link: "/blog/responsabilidad-penal-juvenil"
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
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
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
                to="/blog?categoria=penal"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl font-semibold hover:bg-primary/20 transition-all duration-300"
              >
                Ver Todos los Artículos Penales
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Sección de Actualidad */}
        <section className="py-20 bg-gradient-to-b from-background/50 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Actualidad en Derecho Penal
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mantente informado sobre las últimas reformas penales y jurisprudencia
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Artículo 1 */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                    URGENTE
                  </span>
                  <span className="text-xs text-muted-foreground">Reforma</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Nuevo Código Procesal Penal 2025
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>24 Enero 2025</span>
                  <span>• 10 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Cambios fundamentales en el procedimiento penal y derechos del imputado...
                </p>
                <Link 
                  to="/blog/nuevo-codigo-procesal-penal"
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 group/link"
                >
                  Leer más 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.article>

              {/* Artículo 2 */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                    URGENTE
                  </span>
                  <span className="text-xs text-muted-foreground">Delitos</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Ciberdelitos: Nueva Tipificación
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>22 Enero 2025</span>
                  <span>• 8 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Nuevos tipos penales para delitos informáticos y penas actualizadas...
                </p>
                <Link 
                  to="/blog/ciberdelitos-nueva-tipificacion"
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 group/link"
                >
                  Leer más 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.article>

              {/* Artículo 3 */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-muted-foreground">Penas</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Penas Sustitutivas: Ampliación
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>20 Enero 2025</span>
                  <span>• 6 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Nuevos criterios para acceder a penas alternativas a la privación de libertad...
                </p>
                <Link 
                  to="/blog/penas-sustitutivas-ampliacion"
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 group/link"
                >
                  Leer más 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.article>

              {/* Artículo 4 */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                    URGENTE
                  </span>
                  <span className="text-xs text-muted-foreground">Violencia</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Violencia Intrafamiliar: Endurecimiento
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>18 Enero 2025</span>
                  <span>• 9 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Aumento de penas y nuevas medidas cautelares en casos de VIF...
                </p>
                <Link 
                  to="/blog/vif-endurecimiento-penas"
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 group/link"
                >
                  Leer más 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.article>

              {/* Artículo 5 */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-muted-foreground">Drogas</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Ley de Drogas: Despenalización Parcial
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>16 Enero 2025</span>
                  <span>• 7 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Cambios en el tratamiento penal del consumo personal y microtráfico...
                </p>
                  <Link
                  to="/blog/ley-drogas-despenalizacion"
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 group/link"
                  >
                  Leer más 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
              </motion.article>

              {/* Artículo 6 */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-muted-foreground">Defensa</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Defensoría Penal: Nuevos Protocolos
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>14 Enero 2025</span>
                  <span>• 5 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Mejoras en el sistema de defensa pública y asistencia jurídica gratuita...
                </p>
                <Link 
                  to="/blog/defensoria-nuevos-protocolos"
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 group/link"
                >
                  Leer más 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.article>
            </div>

            {/* Botón Ver Todos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                to="/blog/categoria/penal"
                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Ver Todos los Artículos Penales
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-red-500/10 to-red-600/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                ¿Necesitas Defensa Penal Urgente?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                No enfrentes solo un proceso penal. Actúa rápido con defensa especializada
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/agendamiento?plan=defensa-urgente"
                  className="bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-all inline-flex items-center gap-2 animate-pulse"
                >
                  <Shield className="w-5 h-5" />
                  Defensa Urgente 24/7
                </Link>
                
                <Link
                  to="/consulta-gratuita-penal"
                  className="bg-white/10 backdrop-blur-sm text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 border border-white/20"
                >
                  <Phone className="w-5 h-5" />
                  Consulta Gratuita
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
} 