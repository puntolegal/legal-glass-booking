import { motion } from 'framer-motion'
import { Globe, Shield, FileText, Smartphone, CheckCircle, Star, Clock, Award, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const services = [
  {
    icon: FileText,
    title: 'Términos y Condiciones',
    description: 'Documentos legales que protegen tu negocio digital.',
    features: ['Términos de uso', 'Políticas de privacidad', 'Avisos legales', 'Cookies policy']
  },
  {
    icon: Shield,
    title: 'Protección de Datos (RGPD)',
    description: 'Cumplimiento de normativas de protección de datos.',
    features: ['Ley 19.628', 'RGPD europeo', 'Auditorías de cumplimiento', 'Políticas internas']
  },
  {
    icon: Globe,
    title: 'E-commerce Legal',
    description: 'Marco legal completo para tiendas online.',
    features: ['Contratos de venta online', 'Derecho de retracto', 'Facturación electrónica', 'Resolución de disputas']
  },
  {
    icon: Smartphone,
    title: 'Apps y Software',
    description: 'Protección legal para desarrolladores y startups.',
    features: ['Licencias de software', 'Contratos SaaS', 'APIs terms', 'Propiedad intelectual']
  }
]

const testimonials = [
  {
    name: 'TechStart Solutions',
    role: 'Startup de Software',
    content: 'Nos ayudaron a estructurar legalmente nuestra plataforma SaaS. Sus términos de servicio nos han protegido de múltiples conflictos.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'E-shop Chile',
    role: 'Tienda Online',
    content: 'Su asesoría en e-commerce fue clave para nuestro crecimiento. Cumplimos todas las normativas sin complicaciones.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'DataSecure Corp',
    role: 'Empresa de Datos',
    content: 'Implementaron un sistema completo de protección de datos RGPD. Pasamos todas las auditorías sin problemas.',
    rating: 5,
    image: '/api/placeholder/80/80'
  }
]

const stats = [
  { number: '200+', label: 'Empresas digitales asesoradas' },
  { number: '100%', label: 'Cumplimiento normativo' },
  { number: '24h', label: 'Respuesta a urgencias' },
  { number: '5+', label: 'Años especializados en digital' }
]

export default function ServicioDigitalPage() {
  return (
    <>
      <SEO 
        title="Derecho Digital - Especialistas en Tecnología y E-commerce | Punto Legal"
        description="Expertos en derecho digital: términos y condiciones, protección de datos, e-commerce legal y contratos SaaS. Protege tu negocio digital."
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
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Especialistas en Derecho Digital</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Protege tu Negocio Digital
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                En la era digital, la protección legal es fundamental. Te ayudamos a navegar 
                las complejidades del derecho tecnológico con soluciones innovadoras y actualizadas.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/contacto"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Consulta Digital
                </Link>
                <Link
                  to="/generador-terminos"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Generador de Términos
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Innovation Badge */}
        <section className="py-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-y border-blue-500/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-4 text-center">
                <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">Derecho Digital de Vanguardia</h3>
                  <p className="text-blue-300">
                    Pioneros en Chile en asesoría legal para startups, e-commerce y tecnología
                  </p>
                </div>
                <div className="bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-blue-400 font-semibold">Nuevo</span>
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

        {/* Digital Law Packages */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Paquetes de Derecho Digital</h2>
              <p className="text-xl text-muted-foreground">Protección legal completa para tu negocio digital</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Startup Legal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Startup Legal</h3>
                  <p className="text-muted-foreground mb-4">Para emprendimientos digitales</p>
                  <div className="text-4xl font-bold text-primary mb-2">$480.000</div>
                  <p className="text-sm text-muted-foreground">Paquete completo</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Términos y condiciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Política de privacidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Aviso legal básico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos de desarrollo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Soporte durante 3 meses</span>
                  </li>
                </ul>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-green-400 font-semibold">Cumplimiento RGPD incluido</p>
                </div>
                
                <Link
                  to="/agendamiento?plan=startup-legal"
                  className="w-full bg-primary/10 text-primary border border-primary/30 rounded-xl py-3 px-6 font-semibold hover:bg-primary/20 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* E-commerce Pro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/50 hover:border-primary transition-all duration-300"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Vendido
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">E-commerce Pro</h3>
                  <p className="text-muted-foreground mb-4">Para tiendas online</p>
                  <div className="text-4xl font-bold text-primary mb-2">$850.000</div>
                  <p className="text-sm text-muted-foreground">Paquete completo</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Startup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Políticas de devolución</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos con proveedores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Cumplimiento SERNAC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Registro de marca digital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Soporte durante 6 meses</span>
                  </li>
                </ul>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-blue-400 font-semibold">Protección completa e-commerce</p>
                </div>
                
                <Link
                  to="/agendamiento?plan=ecommerce-pro"
                  className="w-full bg-primary text-white rounded-xl py-3 px-6 font-semibold hover:bg-primary/90 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Tech Enterprise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Tech Enterprise</h3>
                  <p className="text-muted-foreground mb-4">Para empresas tecnológicas</p>
                  <div className="text-4xl font-bold text-primary mb-2">$1.650.000</div>
                  <p className="text-sm text-muted-foreground">Paquete premium</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan E-commerce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos SaaS avanzados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Protección de datos empresarial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Compliance internacional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos de API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Abogado tech dedicado</span>
                  </li>
                </ul>
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-purple-400 font-semibold">Cobertura legal 360° tech</p>
                </div>
                
                <Link
                  to="/agendamiento?plan=tech-enterprise"
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
              <h2 className="text-4xl font-bold mb-4">Servicios Digitales Especializados</h2>
              <p className="text-xl text-muted-foreground">Protección legal integral para tu ecosistema digital</p>
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

        {/* GDPR Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Cumplimiento de Protección de Datos</h2>
              <p className="text-xl text-muted-foreground">Asegura el cumplimiento normativo de tu empresa</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div>
                <h3 className="text-2xl font-bold mb-6">Normativas que Cubrimos</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Ley 19.628 (Chile)', desc: 'Protección de la vida privada y datos personales' },
                    { title: 'RGPD (Europa)', desc: 'Para empresas que manejan datos de ciudadanos europeos' },
                    { title: 'CCPA (California)', desc: 'Normativa de privacidad de California' },
                    { title: 'LGPD (Brasil)', desc: 'Ley General de Protección de Datos brasileña' }
                  ].map((law, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="font-semibold text-primary mb-2">{law.title}</h4>
                      <p className="text-sm text-muted-foreground">{law.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6">Servicios de Cumplimiento</h3>
                <div className="space-y-4">
                  {[
                    'Auditoría de cumplimiento normativo',
                    'Políticas de privacidad personalizadas',
                    'Procedimientos de manejo de datos',
                    'Capacitación de equipos',
                    'Respuesta a solicitudes de datos',
                    'Notificación de brechas de seguridad',
                    'Contratos con procesadores de datos',
                    'Evaluaciones de impacto de privacidad'
                  ].map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* E-commerce Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">E-commerce Legal Completo</h2>
              <p className="text-xl text-muted-foreground">Todo lo que necesitas para vender online legalmente</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: 'Documentos Legales',
                  items: ['Términos de venta', 'Política de devoluciones', 'Política de envíos', 'Política de privacidad'],
                  color: 'orange'
                },
                {
                  title: 'Cumplimiento Normativo',
                  items: ['Ley del consumidor', 'Facturación electrónica', 'Libro de reclamos digital', 'Sello de confianza'],
                  color: 'orange'
                },
                {
                  title: 'Protección Legal',
                  items: ['Contratos con proveedores', 'Acuerdos de afiliados', 'Protección de marca', 'Resolución de disputas'],
                  color: 'orange'
                }
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-bold mb-4 text-primary">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
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
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Proceso de Implementación Digital</h2>
              <p className="text-xl text-muted-foreground">Metodología ágil para protección legal digital</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: '1', title: 'Análisis Digital', desc: 'Evaluación de tu ecosistema digital', icon: Clock },
                { step: '2', title: 'Estrategia Legal', desc: 'Plan de protección personalizado', icon: FileText },
                { step: '3', title: 'Implementación', desc: 'Desarrollo de documentos legales', icon: Globe },
                { step: '4', title: 'Monitoreo', desc: 'Seguimiento y actualizaciones', icon: Award }
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
              <h2 className="text-4xl font-bold mb-4">Casos de Éxito Tech</h2>
              <p className="text-xl text-muted-foreground">Startups y empresas que protegimos legalmente</p>
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

        {/* Digital Law Updates */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Actualidad en Derecho Digital</h2>
              <p className="text-xl text-muted-foreground">Mantente al día con las últimas regulaciones tech</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Nueva Ley de Inteligencia Artificial 2025",
                  excerpt: "Regulaciones específicas para el uso de IA en empresas y startups chilenas...",
                  date: "20 Enero 2025",
                  readTime: "9 min",
                  category: "IA & Tech",
                  urgent: true,
                  link: "/blog/ley-inteligencia-artificial-2025"
                },
                {
                  title: "RGPD: Nuevas Sanciones para E-commerce",
                  excerpt: "Actualización de multas y procedimientos para tiendas online...",
                  date: "18 Enero 2025", 
                  readTime: "7 min",
                  category: "E-commerce",
                  urgent: true,
                  link: "/blog/rgpd-sanciones-ecommerce"
                },
                {
                  title: "Contratos SaaS: Nuevas Cláusulas Obligatorias",
                  excerpt: "Cambios en los contratos de software como servicio...",
                  date: "16 Enero 2025",
                  readTime: "6 min", 
                  category: "SaaS",
                  urgent: false,
                  link: "/blog/contratos-saas-clausulas"
                },
                {
                  title: "Criptomonedas: Marco Legal Definitivo",
                  excerpt: "Nueva regulación para intercambios y wallets de criptomonedas...",
                  date: "14 Enero 2025",
                  readTime: "10 min",
                  category: "Crypto",
                  urgent: true,
                  link: "/blog/criptomonedas-marco-legal"
                },
                {
                  title: "Startup Law: Beneficios Tributarios 2025",
                  excerpt: "Nuevos incentivos fiscales para emprendimientos tecnológicos...",
                  date: "12 Enero 2025",
                  readTime: "5 min",
                  category: "Startups",
                  urgent: false,
                  link: "/blog/startup-law-beneficios-tributarios"
                },
                {
                  title: "Cookies y Tracking: Nuevas Regulaciones",
                  excerpt: "Cambios en el consentimiento y gestión de cookies...",
                  date: "10 Enero 2025",
                  readTime: "4 min",
                  category: "Privacidad",
                  urgent: false,
                  link: "/blog/cookies-tracking-regulaciones"
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
                to="/blog?categoria=digital"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl font-semibold hover:bg-primary/20 transition-all duration-300"
              >
                Ver Todos los Artículos Digitales
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
                  ¿Listo para Proteger tu Negocio Digital?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  No dejes que la falta de protección legal frene tu crecimiento digital
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/contacto"
                    className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Consulta Digital
                  </Link>
                  <Link
                    to="/generador-terminos"
                    className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                  >
                    Generador Automático
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
} 