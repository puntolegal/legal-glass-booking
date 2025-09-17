import { motion } from 'framer-motion'
import { Heart, Users, Baby, Scale, FileText, Home, CheckCircle, Star, Clock, Award, ArrowRight, Calendar, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const services = [
  {
    icon: Heart,
    title: 'Divorcios y Separaciones',
    description: 'Procesos de divorcio con enfoque humano y eficiente.',
    features: ['Divorcio de mutuo acuerdo', 'Divorcio unilateral', 'Separación de bienes', 'Compensación económica']
  },
  {
    icon: Baby,
    title: 'Pensiones de Alimentos',
    description: 'Establecimiento y cobro de pensiones alimenticias.',
    features: ['Demanda de alimentos', 'Aumento de pensión', 'Cobro ejecutivo', 'Liquidación de deudas']
  },
  {
    icon: Users,
    title: 'Filiación y Paternidad',
    description: 'Acciones de filiación y reconocimiento paterno.',
    features: ['Reconocimiento de paternidad', 'Pruebas de ADN', 'Impugnación de paternidad', 'Derechos del menor']
  },
  {
    icon: Home,
    title: 'Régimen de Visitas',
    description: 'Regulación del cuidado personal y visitas.',
    features: ['Cuidado personal compartido', 'Régimen comunicacional', 'Relación directa y regular', 'Modificación de régimen']
  },
  {
    icon: Shield,
    title: 'Violencia Intrafamiliar',
    description: 'Protección legal en casos de violencia familiar.',
    features: ['Medidas de protección', 'Denuncias VIF', 'Cautelares urgentes', 'Acompañamiento legal']
  },
  {
    icon: FileText,
    title: 'Adopción y Tutela',
    description: 'Procesos de adopción y designación de tutores.',
    features: ['Adopción simple y plena', 'Tutela y curaduría', 'Guarda del menor', 'Autorización judicial']
  }
]

const testimonials = [
  {
    name: 'María José Herrera',
    role: 'Madre de Familia',
    content: 'Me ayudaron a obtener la pensión de alimentos que mi hijo necesitaba. El proceso fue rápido y siempre me mantuvieron informada.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'Carlos Mendoza',
    role: 'Padre Divorciado',
    content: 'Logramos un divorcio de mutuo acuerdo sin complicaciones. Su enfoque humano hizo la diferencia en un momento difícil.',
    rating: 5,
    image: '/api/placeholder/80/80'
  },
  {
    name: 'Patricia Silva',
    role: 'Abuela Cuidadora',
    content: 'Obtuve la custodia de mi nieta gracias a su excelente trabajo. Son especialistas reales en derecho de familia.',
    rating: 5,
    image: '/api/placeholder/80/80'
  }
]

const stats = [
  { number: '2,400+', label: 'Familias asesoradas' },
  { number: '92%', label: 'Casos exitosos' },
  { number: '15d', label: 'Tiempo promedio tramitación' },
  { number: '24/7', label: 'Soporte en crisis' }
]

const packages = [
  {
    name: 'Familiar Básico',
    price: '$180.000',
    description: 'Para consultas y trámites simples',
    features: [
      'Consulta inicial especializada',
      'Redacción de documentos básicos',
      'Orientación legal familiar',
      'Seguimiento por 30 días',
      'Soporte vía WhatsApp'
    ],
    popular: false
  },
  {
    name: 'Familiar Completo',
    price: '$450.000',
    description: 'Para procesos judiciales completos',
    features: [
      'Todo lo del plan Básico',
      'Representación judicial completa',
      'Gestión de medidas precautorias',
      'Seguimiento hasta sentencia',
      'Soporte prioritario 24/7',
      'Audiencias incluidas'
    ],
    popular: true
  },
  {
    name: 'Familiar Premium',
    price: '$750.000',
    description: 'Para casos complejos y urgentes',
    features: [
      'Todo lo del plan Completo',
      'Atención de urgencia 24/7',
      'Gestión de casos complejos',
      'Coordinación con otros especialistas',
      'Seguimiento post-sentencia',
      'Abogado dedicado exclusivo'
    ],
    popular: false
  }
]

const faq = [
  {
    question: '¿Cuánto tiempo demora un proceso de divorcio?',
    answer: 'Un divorcio de mutuo acuerdo puede resolverse en 2-3 meses, mientras que un divorcio unilateral puede tomar 6-12 meses dependiendo de la complejidad del caso.'
  },
  {
    question: '¿Cómo se calcula una pensión de alimentos?',
    answer: 'La pensión se calcula considerando las necesidades del alimentario y las facultades económicas del alimentante, generalmente entre el 20% y 50% de los ingresos.'
  },
  {
    question: '¿Puedo modificar un régimen de visitas establecido?',
    answer: 'Sí, cuando cambien las circunstancias que motivaron la resolución original, se puede solicitar la modificación del régimen ante el tribunal.'
  },
  {
    question: '¿Qué documentos necesito para iniciar un proceso de filiación?',
    answer: 'Certificado de nacimiento del menor, antecedentes que acrediten la relación paterno-filial, y documentación de ingresos para efectos alimentarios.'
  }
]

export default function ServicioFamiliaPage() {
  return (
    <>
      <SEO 
        title="Derecho de Familia - Especialistas en Asuntos Familiares | Punto Legal"
        description="Expertos en derecho de familia: divorcios, pensiones de alimentos, filiación, régimen de visitas. Protegemos a tu familia con calidez humana y excelencia jurídica."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-pink-500/10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-rose-500/10 rounded-full px-4 py-2 mb-6">
                <Heart className="w-5 h-5 text-rose-600" />
                <span className="text-sm font-medium text-rose-600">Especialistas en Derecho de Familia</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Protegemos a tu Familia
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                Enfrentamos los desafíos familiares con sensibilidad humana y excelencia jurídica. 
                Desde divorcios hasta pensiones alimenticias, cuidamos lo que más importa.
              </p>
              
              {/* Oferta Especial */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200 rounded-2xl px-6 py-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-rose-600">$35.000</span>
                  <span className="text-lg text-gray-500 line-through">$70.000</span>
                </div>
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  50% OFF
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/agendamiento?plan=familia"
                  className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-semibold hover:from-rose-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Consulta por $35.000
                </Link>
                <Link
                  to="/contacto"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-foreground rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Consulta de Urgencia
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-rose-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">
                Servicios Especializados en Familia
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Abordamos cada área del derecho familiar con la experiencia y sensibilidad 
                que tu situación requiere.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-rose-200 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-20 bg-gradient-to-r from-rose-50/50 to-pink-50/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">
                Planes de Asesoría Familiar
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Elige el plan que mejor se adapte a las necesidades de tu familia
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl ${
                    pkg.popular 
                      ? 'border-rose-200 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-rose-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Más Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-muted-foreground mb-4">{pkg.description}</p>
                    <div className="text-4xl font-bold text-rose-600 mb-2">{pkg.price}</div>
                    <p className="text-sm text-muted-foreground">Pago único</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/agendamiento?plan=familia"
                    className={`block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    Elegir Plan
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">
                Familias que Confiaron en Nosotros
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Cada caso es único, pero nuestro compromiso con la excelencia es constante
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-r from-rose-50/50 to-pink-50/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">
                Preguntas Frecuentes
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Resolvemos las dudas más comunes sobre derecho de familia
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faq.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-gray-200"
                >
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600" />
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                ¿Necesitas Asesoría Familiar Urgente?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                No enfrentes sola/o los desafíos familiares. Nuestros especialistas están listos 
                para proteger los derechos de tu familia con la urgencia que requiere tu situación.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/agendamiento?plan=familia"
                  className="px-8 py-4 bg-white text-rose-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Consulta por $35.000
                </Link>
                <Link
                  to="/contacto"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Contacto de Emergencia
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
