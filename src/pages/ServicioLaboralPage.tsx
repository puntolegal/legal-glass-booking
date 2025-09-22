import { motion } from 'framer-motion'
import { Scale, FileText, Users, TrendingUp, Shield, Globe, CheckCircle, Star, Clock, Award, LogIn, BarChart3, Calendar, AlertTriangle, Briefcase, Gavel, UserCheck, Building, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO'
import Header from '../components/Header'
import { MobileLayout } from '../components/MobileLayout'
import CorporateLoginSimple from '../components/CorporateLoginSimple'

const services = [
  {
    icon: Scale,
    title: 'Despidos y Terminación de Contrato',
    description: 'Asesoría completa en despidos justificados e injustificados, con protección total de tus derechos.',
    features: ['Despidos injustificados', 'Indemnizaciones', 'Finiquitos', 'Tutela de derechos fundamentales']
  },
  {
    icon: FileText,
    title: 'Ley Karin y Protección Laboral',
    description: 'Defensa especializada en casos de acoso laboral y vulneración de derechos fundamentales.',
    features: ['Ley Karin completa', 'Acoso laboral', 'Discriminación', 'Tutela de derechos']
  },
  {
    icon: Users,
    title: 'Horas Extra y Remuneraciones',
    description: 'Reclamos por horas extraordinarias, bonificaciones y diferencias salariales.',
    features: ['Horas extraordinarias', 'Bonificaciones', 'Diferencias salariales', 'Recargos nocturnos']
  },
  {
    icon: TrendingUp,
    title: 'Negociación Colectiva',
    description: 'Asesoría en procesos de negociación colectiva y convenios laborales.',
    features: ['Convenios colectivos', 'Negociación sindical', 'Huelgas legales', 'Mediación laboral']
  },
  {
    icon: Shield,
    title: 'Seguridad Social',
    description: 'Gestión completa de derechos previsionales y de seguridad social.',
    features: ['AFP y pensiones', 'Fonasa e Isapre', 'Seguro de desempleo', 'Indemnizaciones']
  },
  {
    icon: Globe,
    title: 'Fiscalizaciones DT',
    description: 'Defensa ante fiscalizaciones de la Dirección del Trabajo y comparendos.',
    features: ['Fiscalizaciones DT', 'Comparendos', 'Multas laborales', 'Defensa administrativa']
  }
]

const testimonials = [
  {
    name: 'Ana Rodríguez',
    role: 'Trabajadora, Empresa Retail',
    content: 'Me ayudaron a recuperar mis horas extra que no me habían pagado durante años. El proceso fue rápido y eficiente, y lograron recuperar más de $2.000.000 que me debían. Su conocimiento de la legislación laboral es excepcional.',
    rating: 5
  },
  {
    name: 'Carlos Mendoza',
    role: 'Empleado, Empresa de Servicios',
    content: 'Mi despido fue claramente injustificado y Punto Legal me ayudó a demostrarlo. Lograron una indemnización que superó mis expectativas y me dieron todo el apoyo durante el proceso. Su profesionalismo y dedicación son incomparables.',
    rating: 5
  },
  {
    name: 'María González',
    role: 'Trabajadora, Empresa Industrial',
    content: 'Sufrí acoso laboral durante meses y no sabía qué hacer. Punto Legal me ayudó con la Ley Karin y logramos que me indemnizaran y me trasladaran a otro sector. Su apoyo fue fundamental para recuperar mi tranquilidad.',
    rating: 5
  }
]

const stats = [
  { number: '1000+', label: 'Casos laborales resueltos' },
  { number: '100%', label: 'Confidencialidad' },
  { number: '48h', label: 'Respuesta garantizada' },
  { number: '98%', label: 'Clientes satisfechos' }
]

export default function ServicioLaboralPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setShowLogin(false);
    // Aquí podrías redirigir a un dashboard laboral si lo creas
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const pageContent = (
    <div className="bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 rounded-full px-4 py-2 mb-6">
              <Scale className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">Especialistas en Derecho Laboral</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Protege tus Derechos Laborales con Asesoría Experta
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Desde despidos injustificados hasta Ley Karin, somos tu aliado para defender 
              tus derechos laborales con la máxima eficiencia y resultados garantizados.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/agendamiento?plan=laboral"
                className="px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Consulta por $30.000
              </Link>
              <button
                onClick={() => setShowLogin(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión Trabajador
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Servicios de <span className="text-orange-500">Derecho Laboral</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cobertura completa en todas las áreas del derecho laboral con resultados garantizados
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-orange-500" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Lo que dicen nuestros <span className="text-orange-500">clientes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Miles de trabajadores han confiado en nosotros para defender sus derechos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Necesitas Asesoría Laboral?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              No esperes más. Nuestros especialistas están listos para defender tus derechos laborales
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/agendamiento?plan=laboral"
                className="px-8 py-4 bg-white text-orange-500 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Agendar Consulta
              </Link>
              <Link
                to="/contacto"
                className="px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
              >
                Contactar Ahora
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );

  return (
    <>
      <SEO 
        title="Derecho Laboral - Punto Legal"
        description="Especialistas en derecho laboral. Despidos, Ley Karin, horas extra, fiscalizaciones DT. Asesoría legal experta para trabajadores."
        keywords="derecho laboral, despidos, ley karin, horas extra, fiscalizaciones DT, asesoría legal"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="lg:hidden">
          <MobileLayout>
            {pageContent}
          </MobileLayout>
        </div>
        
        <div className="hidden lg:block">
          {pageContent}
        </div>

        {/* Modal de Login - Posicionamiento fijo para móvil */}
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Botón de cerrar */}
              <button
                onClick={handleCloseLogin}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Contenido del modal */}
              <CorporateLoginSimple
                onClose={handleCloseLogin}
                onLoginSuccess={handleLoginSuccess}
                isModal={true}
              />
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
