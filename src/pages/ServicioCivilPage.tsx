import { motion } from 'framer-motion'
import { Scale, FileText, CreditCard, Users, CheckCircle, Star, Clock, Award, ArrowRight, Calendar, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const services = [
  {
    icon: CreditCard,
    title: 'Cobranza Judicial',
    description: 'Recuperación efectiva de deudas y créditos impagas.',
    features: ['Gestión prejudicial', 'Juicios ejecutivos', 'Embargos y remates', 'Acuerdos de pago']
  },
  {
    icon: FileText,
    title: 'Contratos Civiles',
    description: 'Redacción y revisión de todo tipo de contratos.',
    features: ['Contratos de servicios', 'Mandatos', 'Comodatos', 'Contratos atípicos']
  },
  {
    icon: Users,
    title: 'Responsabilidad Civil',
    description: 'Demandas por daños y perjuicios.',
    features: ['Accidentes de tránsito', 'Responsabilidad médica', 'Daño moral', 'Lucro cesante']
  },
  {
    icon: Scale,
    title: 'Litigios Civiles',
    description: 'Representación en conflictos civiles complejos.',
    features: ['Nulidad de contratos', 'Incumplimientos', 'Resolución contractual', 'Indemnizaciones']
  }
]

const testimonials = [
  {
    name: 'Pedro Ramírez',
    role: 'Empresario',
    content: 'Recuperé $80 millones en deudas que creía perdidas. Su gestión de cobranza fue excepcional y muy profesional.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'Sofía González',
    role: 'Víctima de Accidente',
    content: 'Me ayudaron a obtener una indemnización justa por mi accidente. Su conocimiento en responsabilidad civil es impresionante.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'Comercial Los Andes',
    role: 'Empresa Comercial',
    content: 'Resolvieron un conflicto contractual complejo que nos tenía paralizado. Excelente estrategia legal.',
    rating: 5,
    image: '/api/placeholder/80/80'
  }
]

const stats = [
  { number: '$2.1B+', label: 'Recuperado en cobranzas' },
  { number: '1,800+', label: 'Casos resueltos' },
  { number: '89%', label: 'Tasa de éxito' },
  { number: '30d', label: 'Tiempo promedio resolución' }
]

export default function ServicioCivilPage() {
  return (
    <>
      <SEO 
        title="Derecho Civil - Especialistas en Litigios Civiles | Punto Legal"
        description="Expertos en derecho civil: cobranza judicial, contratos, responsabilidad civil y litigios. Protege tus derechos civiles con especialistas."
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
                <Scale className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Especialistas en Derecho Civil</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Protege tus Derechos Civiles
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Desde recuperación de deudas hasta complejos litigios civiles, defendemos tus 
                intereses con la experiencia y dedicación que tu caso merece.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/contacto"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Evaluar mi Caso
                </Link>
                <Link
                  to="/calculadora-cobranza"
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

        {/* Civil Law Packages */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Paquetes de Servicios Civiles</h2>
              <p className="text-xl text-muted-foreground">Soluciones integrales para tus asuntos civiles</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Cobranza Rápida */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Cobranza Express</h3>
                  <p className="text-muted-foreground mb-4">Para deudas hasta $5M</p>
                  <div className="text-4xl font-bold text-primary mb-2">$280.000</div>
                  <p className="text-sm text-muted-foreground">+ 15% del monto recuperado</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Gestión extrajudicial previa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Demanda de cobro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Medidas precautorias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Ejecución de sentencia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Seguimiento hasta cobro</span>
                  </li>
                </ul>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-green-400 font-semibold">85% de éxito en cobranza</p>
                </div>
                
                <Link
                  to="/agendamiento?plan=cobranza-express"
                  className="w-full bg-primary/10 text-primary border border-primary/30 rounded-xl py-3 px-6 font-semibold hover:bg-primary/20 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Litigios Premium */}
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
                  <h3 className="text-2xl font-bold mb-2">Litigios Premium</h3>
                  <p className="text-muted-foreground mb-4">Para casos complejos</p>
                  <div className="text-4xl font-bold text-primary mb-2">$950.000</div>
                  <p className="text-sm text-muted-foreground">Proceso completo</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Express</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Análisis de viabilidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos civiles incluidos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Recursos de apelación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Mediación y arbitraje</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Atención prioritaria</span>
                  </li>
                </ul>
                
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-primary font-semibold">92% de éxito en litigios</p>
                </div>
                
                <Link
                  to="/agendamiento?plan=litigios-premium"
                  className="w-full bg-primary text-white rounded-xl py-3 px-6 font-semibold hover:bg-primary/90 transition-all duration-300 text-center block"
                >
                  Agendar Consulta
                </Link>
              </motion.div>

              {/* Corporativo Civil */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Corporativo Civil</h3>
                  <p className="text-muted-foreground mb-4">Para empresas</p>
                  <div className="text-4xl font-bold text-primary mb-2">$1.800.000</div>
                  <p className="text-sm text-muted-foreground">Anual con soporte</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Todo lo del plan Premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Múltiples casos incluidos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Contratos comerciales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Responsabilidad civil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Abogado corporativo dedicado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Soporte legal 24/7</span>
                  </li>
                </ul>
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-purple-400 font-semibold">Ahorro del 40% vs casos individuales</p>
                </div>
                
                <Link
                  to="/agendamiento?plan=corporativo-civil"
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
              <h2 className="text-4xl font-bold mb-4">Nuestros Servicios Civiles</h2>
              <p className="text-xl text-muted-foreground">Soluciones integrales para todos tus conflictos civiles</p>
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

        {/* Cobranza Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Cobranza Judicial Efectiva</h2>
              <p className="text-xl text-muted-foreground">Recupera lo que es tuyo con nuestro proceso probado</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: 'Gestión Prejudicial',
                  description: 'Intentamos recuperar la deuda sin llegar a juicio',
                  features: ['Cartas de cobranza', 'Negociación directa', 'Acuerdos de pago', 'Mediación'],
                  success: '70% de casos resueltos'
                },
                {
                  title: 'Juicio Ejecutivo',
                  description: 'Proceso rápido para documentos con mérito ejecutivo',
                  features: ['Pagarés', 'Letras de cambio', 'Cheques protestados', 'Facturas impagas'],
                  success: '85% de recuperación'
                },
                {
                  title: 'Embargo y Remate',
                  description: 'Ejecución forzada de bienes del deudor',
                  features: ['Embargo de bienes', 'Remate público', 'Liquidación', 'Pago efectivo'],
                  success: '95% de recuperación'
                }
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-bold mb-3 text-primary">{process.title}</h3>
                  <p className="text-muted-foreground mb-4">{process.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {process.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-primary/10 rounded-lg p-3 text-center">
                    <span className="font-semibold text-primary">{process.success}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Responsibility Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Responsabilidad Civil</h2>
              <p className="text-xl text-muted-foreground">Obtén la compensación que mereces</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div>
                <h3 className="text-2xl font-bold mb-6">Tipos de Daños que Cubrimos</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Daño Emergente', desc: 'Pérdidas económicas directas y comprobables' },
                    { title: 'Lucro Cesante', desc: 'Ganancias que dejaste de percibir' },
                    { title: 'Daño Moral', desc: 'Sufrimiento psicológico y emocional' },
                    { title: 'Daño Físico', desc: 'Lesiones corporales y tratamientos médicos' }
                  ].map((damage, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="font-semibold text-primary mb-2">{damage.title}</h4>
                      <p className="text-sm text-muted-foreground">{damage.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6">Casos Más Frecuentes</h3>
                <div className="space-y-4">
                  {[
                    'Accidentes de tránsito',
                    'Negligencia médica',
                    'Accidentes laborales',
                    'Productos defectuosos',
                    'Responsabilidad profesional',
                    'Daños por construcción',
                    'Responsabilidad de establecimientos',
                    'Daños por mascotas'
                  ].map((caso, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{caso}</span>
                    </div>
                  ))}
                </div>
              </div>
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
              <h2 className="text-4xl font-bold mb-4">Nuestro Proceso de Trabajo</h2>
              <p className="text-xl text-muted-foreground">Metodología probada para casos civiles</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: '1', title: 'Evaluación', desc: 'Análisis gratuito de viabilidad', icon: Clock },
                { step: '2', title: 'Estrategia', desc: 'Plan de acción personalizado', icon: FileText },
                { step: '3', title: 'Ejecución', desc: 'Implementación del plan legal', icon: Scale },
                { step: '4', title: 'Resultado', desc: 'Recuperación o indemnización', icon: Award }
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
              <h2 className="text-4xl font-bold mb-4">Casos de Éxito</h2>
              <p className="text-xl text-muted-foreground">Clientes que recuperaron su dinero</p>
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
                Actualidad en Derecho Civil
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mantente informado sobre las últimas reformas y jurisprudencia civil
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
                  <span className="text-xs text-muted-foreground">Contratos</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Reforma al Código Civil: Contratos
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>23 Enero 2025</span>
                  <span>• 9 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Modificaciones sustanciales en la teoría general de contratos y nuevas causales de nulidad...
                </p>
                <Link 
                  to="/blog/reforma-codigo-civil-contratos"
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
                  <span className="text-xs text-muted-foreground">Responsabilidad</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Daño Moral: Nuevos Montos 2025
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>21 Enero 2025</span>
                  <span>• 7 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Corte Suprema actualiza criterios para indemnización por daño moral...
                </p>
                  <Link 
                  to="/blog/dano-moral-montos-2025"
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
                  <span className="text-xs text-muted-foreground">Prescripción</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Prescripción Civil: Cambios Clave
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>19 Enero 2025</span>
                  <span>• 6 min</span>
                      </div>
                <p className="text-muted-foreground mb-4">
                  Nuevos plazos de prescripción para acciones civiles y comerciales...
                </p>
                <Link 
                  to="/blog/prescripcion-civil-cambios"
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
                  <span className="text-xs text-muted-foreground">Obligaciones</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Teoría de la Imprevisión: Aplicación
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>17 Enero 2025</span>
                  <span>• 8 min</span>
                    </div>
                <p className="text-muted-foreground mb-4">
                  Criterios actualizados para revisar contratos por cambios imprevistos...
                </p>
                <Link 
                  to="/blog/teoria-imprevision-2025"
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
                  <span className="text-xs text-muted-foreground">Garantías</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Fianza y Aval: Nuevas Reglas
                    </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>15 Enero 2025</span>
                  <span>• 5 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Modificaciones en las garantías personales y su ejecución...
                </p>
                <Link 
                  to="/blog/fianza-aval-nuevas-reglas"
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
                  <span className="text-xs text-muted-foreground">Procedimiento</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Juicio Ejecutivo: Agilización
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>13 Enero 2025</span>
                  <span>• 4 min</span>
                    </div>
                <p className="text-muted-foreground mb-4">
                  Nuevos procedimientos para acelerar la cobranza judicial...
                </p>
                <Link 
                  to="/blog/juicio-ejecutivo-agilizacion"
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
                to="/blog/categoria/civil"
                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Ver Todos los Artículos Civiles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                ¿Listo para Resolver tu Conflicto Civil?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                No dejes que los problemas legales se agraven. Actúa ahora con asesoría experta
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/agendamiento?plan=civil"
                  className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Consulta Civil
                </Link>
                
                  <Link
                  to="/calculadora-indemnizacion"
                  className="bg-white/10 backdrop-blur-sm text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 border border-white/20"
                  >
                  <Calculator className="w-5 h-5" />
                  Calculadora de Indemnización
                  </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
} 