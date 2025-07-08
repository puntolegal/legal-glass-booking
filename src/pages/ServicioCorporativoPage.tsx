import { motion } from 'framer-motion'
import { Building2, FileText, Users, TrendingUp, Shield, Globe, CheckCircle, Star, Clock, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Header from '../components/Header'
import { MobileLayout } from '../components/MobileLayout'

const services = [
  {
    icon: Building2,
    title: 'Constitución de Sociedades',
    description: 'Creación de empresas en 24 horas con todos los trámites incluidos.',
    features: ['SpA en 1 día', 'SRL express', 'Sociedades anónimas', 'Modificaciones societarias']
  },
  {
    icon: FileText,
    title: 'Contratos Comerciales',
    description: 'Redacción y revisión de contratos para proteger tus intereses.',
    features: ['Contratos de compraventa', 'Acuerdos de confidencialidad', 'Joint ventures', 'Licencias']
  },
  {
    icon: Users,
    title: 'Fusiones y Adquisiciones',
    description: 'Asesoría completa en procesos de M&A y due diligence.',
    features: ['Due diligence legal', 'Estructuración de deals', 'Negociación', 'Post-merger']
  },
  {
    icon: TrendingUp,
    title: 'Inversión Extranjera',
    description: 'Facilitamos la entrada de capital extranjero cumpliendo normativas.',
    features: ['Capítulo XIV', 'Estructuras de inversión', 'Compliance regulatorio', 'Repatriación']
  },
  {
    icon: Shield,
    title: 'Gobierno Corporativo',
    description: 'Implementación de mejores prácticas y compliance corporativo.',
    features: ['Directorios', 'Políticas internas', 'Códigos de ética', 'Gestión de riesgos']
  },
  {
    icon: Globe,
    title: 'Comercio Internacional',
    description: 'Asesoría en importaciones, exportaciones y acuerdos internacionales.',
    features: ['Contratos internacionales', 'Incoterms', 'Resolución de disputas', 'Arbitraje']
  }
]

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'CEO, TechStart Chile',
    content: 'Constituyeron nuestra SpA en menos de 24 horas. El proceso fue impecable y nos ahorraron semanas de trámites.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'María Fernández',
    role: 'Directora, Grupo Inmobiliario MF',
    content: 'Su asesoría en la fusión con nuestro competidor fue clave. Manejaron toda la complejidad legal con maestría.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'Roberto Silva',
    role: 'Inversionista Internacional',
    content: 'Me ayudaron a estructurar mi inversión en Chile de forma óptima. Excelente conocimiento del Capítulo XIV.',
    rating: 5,
    image: '/api/placeholder/80/80'
  }
]

const stats = [
  { number: '500+', label: 'Empresas constituidas' },
  { number: '50M+', label: 'USD en deals cerrados' },
  { number: '24h', label: 'Constitución express' },
  { number: '98%', label: 'Clientes satisfechos' }
]

export default function ServicioCorporativoPage() {
  const pageContent = (
    <div className="bg-gradient-to-b from-background to-background/95">
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
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Especialistas en Derecho Corporativo</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Potencia tu Empresa con Asesoría Legal Experta
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Desde la constitución hasta operaciones complejas de M&A, somos tu socio estratégico 
                para el crecimiento empresarial con seguridad jurídica total.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/contacto"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Consulta Gratuita
                </Link>
                <Link
                  to="/calculadora-sociedades"
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

        {/* Pricing Packages */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Paquetes de Servicios Corporativos</h2>
              <p className="text-xl text-muted-foreground">Elige el plan que mejor se adapte a tu empresa</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Básico */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Básico</h3>
                  <p className="text-muted-foreground mb-4">Para emprendedores</p>
                  <div className="text-4xl font-bold text-primary mb-2">$350.000</div>
                  <p className="text-sm text-muted-foreground">Pago único</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Constitución SpA o EIRL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Estatutos estándar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Inscripción CBR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">RUT empresa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">1 mes soporte básico</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=basico"
                  className="w-full bg-primary/10 text-primary border border-primary/30 rounded-xl py-3 px-6 font-semibold hover:bg-primary/20 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Premium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/50 hover:border-primary transition-all duration-300"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-muted-foreground mb-4">Para empresas en crecimiento</p>
                  <div className="text-4xl font-bold text-primary mb-2">$750.000</div>
                  <p className="text-sm text-muted-foreground">Pago único</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Básico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Estatutos personalizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">3 contratos comerciales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Políticas internas básicas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">6 meses soporte legal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Asesoría tributaria inicial</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=premium"
                  className="w-full bg-primary text-white rounded-xl py-3 px-6 font-semibold hover:bg-primary/90 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Enterprise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <p className="text-muted-foreground mb-4">Para grandes empresas</p>
                  <div className="text-4xl font-bold text-primary mb-2">$1.500.000</div>
                  <p className="text-sm text-muted-foreground">Pago único</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Due diligence completo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Estructuración M&A</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Compliance corporativo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">12 meses soporte premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Abogado dedicado</span>
                  </li>
                </ul>
                
                <Link
                  to="/agendamiento?plan=enterprise"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl py-3 px-6 font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Servicios Adicionales</h2>
              <p className="text-xl text-muted-foreground">Servicios específicos para necesidades puntuales</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-lg font-bold text-primary mb-2">
                        Desde $
                        {index === 0 ? '250.000' : 
                         index === 1 ? '180.000' : 
                         index === 2 ? '1.200.000' : 
                         index === 3 ? '400.000' : 
                         index === 4 ? '350.000' : '500.000'}
                      </p>
                      <Link
                        to={`/contacto?servicio=${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="w-full bg-primary/10 text-primary border border-primary/30 rounded-lg py-2 px-4 text-sm font-semibold hover:bg-primary/20 transition-all duration-300 text-center block"
                      >
                        Solicitar Cotización
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Proceso Simple y Transparente</h2>
              <p className="text-xl text-muted-foreground">Te acompañamos en cada paso</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: '1', title: 'Consulta Inicial', desc: 'Evaluamos tu caso sin costo', icon: Clock },
                { step: '2', title: 'Propuesta', desc: 'Plan de acción y honorarios claros', icon: FileText },
                { step: '3', title: 'Ejecución', desc: 'Implementamos la solución legal', icon: TrendingUp },
                { step: '4', title: 'Seguimiento', desc: 'Soporte continuo post-servicio', icon: Award }
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
              <h2 className="text-4xl font-bold mb-4">Lo que Dicen Nuestros Clientes</h2>
              <p className="text-xl text-muted-foreground">Casos de éxito reales</p>
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

        {/* Contingent Blogs Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Temas Legales de Actualidad</h2>
              <p className="text-xl text-muted-foreground">Mantente informado sobre cambios normativos y tendencias corporativas</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Nueva Ley de Modernización Tributaria 2025",
                  excerpt: "Cambios importantes en el régimen tributario que afectan a las empresas chilenas...",
                  date: "15 Enero 2025",
                  readTime: "5 min",
                  category: "Tributario",
                  urgent: true,
                  link: "/blog/ley-modernizacion-tributaria-2025"
                },
                {
                  title: "Reforma al Código de Comercio: Nuevas Obligaciones",
                  excerpt: "Las modificaciones al código de comercio que entran en vigencia este año...",
                  date: "12 Enero 2025", 
                  readTime: "7 min",
                  category: "Comercial",
                  urgent: false,
                  link: "/blog/reforma-codigo-comercio-2025"
                },
                {
                  title: "ESG y Compliance: Obligatorio para Grandes Empresas",
                  excerpt: "Nuevos requerimientos de sostenibilidad y gobierno corporativo...",
                  date: "10 Enero 2025",
                  readTime: "6 min", 
                  category: "Compliance",
                  urgent: true,
                  link: "/blog/esg-compliance-2025"
                },
                {
                  title: "Startups: Cambios en Inversión Extranjera",
                  excerpt: "Nuevas facilidades para la inversión extranjera en startups chilenas...",
                  date: "8 Enero 2025",
                  readTime: "4 min",
                  category: "Inversión",
                  urgent: false,
                  link: "/blog/inversion-extranjera-startups"
                },
                {
                  title: "Ley de Protección de Datos: Multas Récord",
                  excerpt: "Primeras multas millonarias por incumplimiento de la ley de datos...",
                  date: "5 Enero 2025",
                  readTime: "8 min",
                  category: "Datos",
                  urgent: true,
                  link: "/blog/multas-proteccion-datos"
                },
                {
                  title: "Sociedades Benefit: La Nueva Tendencia",
                  excerpt: "Cómo constituir una sociedad de beneficio e impacto en Chile...",
                  date: "3 Enero 2025",
                  readTime: "6 min",
                  category: "Innovación",
                  urgent: false,
                  link: "/blog/sociedades-benefit-chile"
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
                to="/blog?categoria=corporativo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl font-semibold hover:bg-primary/20 transition-all duration-300"
              >
                Ver Todos los Artículos Corporativos
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
                  ¿Listo para Llevar tu Empresa al Siguiente Nivel?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Agenda una consulta gratuita con nuestros especialistas en derecho corporativo
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/contacto"
                    className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Agendar Consulta
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
    );

  return (
    <>
      <SEO 
        title="Derecho Corporativo - Abogados Especialistas | Punto Legal"
        description="Expertos en derecho corporativo: constitución de sociedades, M&A, contratos comerciales y gobierno corporativo. Asesoría legal empresarial de primer nivel."
      />
      
      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen">
        <Header />
        <div className="pt-20">
          {pageContent}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen">
        <MobileLayout>
          {pageContent}
        </MobileLayout>
      </div>
    </>
  );
} 