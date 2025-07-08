import { motion } from 'framer-motion'
import { Scale, FileText, CreditCard, Users, CheckCircle, Star, Clock, Award } from 'lucide-react'
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

        {/* Civil Law Updates */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Actualidad en Derecho Civil</h2>
              <p className="text-xl text-muted-foreground">Mantente informado sobre cambios en la legislación civil</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Nueva Ley de Responsabilidad Civil 2025",
                  excerpt: "Importantes cambios en las normas de responsabilidad civil extracontractual...",
                  date: "17 Enero 2025",
                  readTime: "8 min",
                  category: "Responsabilidad",
                  urgent: true,
                  link: "/blog/nueva-ley-responsabilidad-civil"
                },
                {
                  title: "Cobranza Judicial: Nuevos Procedimientos",
                  excerpt: "Modificaciones en el procedimiento de cobro de deudas y medidas precautorias...",
                  date: "15 Enero 2025", 
                  readTime: "6 min",
                  category: "Cobranza",
                  urgent: false,
                  link: "/blog/cobranza-judicial-procedimientos"
                },
                {
                  title: "Contratos Civiles: Nuevas Regulaciones",
                  excerpt: "Cambios en la validez y efectos de los contratos civiles...",
                  date: "13 Enero 2025",
                  readTime: "7 min", 
                  category: "Contratos",
                  urgent: true,
                  link: "/blog/contratos-civiles-regulaciones"
                },
                {
                  title: "Daño Moral: Nuevos Criterios de Indemnización",
                  excerpt: "Actualización en los criterios para determinar el monto del daño moral...",
                  date: "11 Enero 2025",
                  readTime: "5 min",
                  category: "Daños",
                  urgent: false,
                  link: "/blog/dano-moral-criterios-indemnizacion"
                },
                {
                  title: "Prescripción Civil: Cambios en los Plazos",
                  excerpt: "Nuevas normativas sobre plazos de prescripción en acciones civiles...",
                  date: "9 Enero 2025",
                  readTime: "6 min",
                  category: "Prescripción",
                  urgent: true,
                  link: "/blog/prescripcion-civil-plazos"
                },
                {
                  title: "Mediación Civil: Obligatoriedad en Ciertos Casos",
                  excerpt: "Nuevos casos donde la mediación previa es obligatoria...",
                  date: "7 Enero 2025",
                  readTime: "4 min",
                  category: "Mediación",
                  urgent: false,
                  link: "/blog/mediacion-civil-obligatoria"
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
                to="/blog?categoria=civil"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl font-semibold hover:bg-primary/20 transition-all duration-300"
              >
                Ver Todos los Artículos Civiles
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
                  ¿Tienes una Deuda Impaga o un Conflicto Civil?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Evaluamos tu caso sin costo y te mostramos las mejores opciones
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/contacto"
                    className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Evaluación Gratuita
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