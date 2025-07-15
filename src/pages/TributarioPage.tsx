import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  FileText, 
  Shield, 
  TrendingUp, 
  Users, 
  Award,
  ChevronRight,
  Sparkles,
  Building,
  Receipt,
  PiggyBank,
  AlertCircle,
  BookOpen,
  Phone
} from 'lucide-react';
import SEO from '../components/SEO';

export default function TributarioPage() {
  const services = [
    {
      title: 'Planificación Tributaria',
      description: 'Optimiza tu carga tributaria de manera legal y eficiente',
      price: '45.000',
      originalPrice: '90.000',
      features: [
        'Análisis de situación tributaria',
        'Estrategias de optimización',
        'Proyección de ahorros',
        'Informe detallado'
      ],
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/30',
      preferred: false
    },
    {
      title: 'Defensa Tributaria Premium',
      description: 'Representación experta ante el SII y Tribunales Tributarios',
      price: '85.000',
      originalPrice: '170.000',
      features: [
        'Defensa ante fiscalizaciones',
        'Recursos y reclamaciones',
        'Representación en juicios',
        'Asesoría permanente'
      ],
      icon: Shield,
      color: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/30',
      preferred: true,
      badge: 'Más Popular'
    },
    {
      title: 'Compliance Tributario',
      description: 'Cumplimiento normativo y prevención de contingencias',
      price: '60.000',
      originalPrice: '120.000',
      features: [
        'Revisión de cumplimiento',
        'Actualización normativa',
        'Procedimientos internos',
        'Capacitación tributaria'
      ],
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/30',
      preferred: false
    }
  ];

  const blogPosts = [
    {
      id: 'reforma-tributaria-2024',
      title: 'Reforma Tributaria 2024: Lo que necesitas saber',
      excerpt: 'Análisis completo de los cambios más importantes en la legislación tributaria chilena.',
      date: '15 Enero 2024',
      readTime: '5 min',
      category: 'Actualidad'
    },
    {
      id: 'beneficios-pyme',
      title: 'Beneficios tributarios para PYMES en Chile',
      excerpt: 'Descubre todas las ventajas fiscales disponibles para pequeñas y medianas empresas.',
      date: '10 Enero 2024',
      readTime: '7 min',
      category: 'Guías'
    },
    {
      id: 'fiscalizacion-sii',
      title: 'Cómo enfrentar una fiscalización del SII',
      excerpt: 'Guía práctica para responder adecuadamente a los requerimientos del Servicio de Impuestos Internos.',
      date: '5 Enero 2024',
      readTime: '10 min',
      category: 'Procedimientos'
    }
  ];

  return (
    <>
      <SEO 
        title="Derecho Tributario | Punto Legal"
        description="Asesoría tributaria especializada. Optimización fiscal, defensa ante el SII y cumplimiento normativo."
        keywords="derecho tributario, impuestos, SII, planificación tributaria, defensa tributaria"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section con partículas */}
        <section className="relative py-20 overflow-hidden">
          {/* Fondo con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent" />
          
          {/* Partículas flotantes naranjas */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full"
                animate={{
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * -300],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: `${Math.random() * 50}%`,
                  filter: 'blur(0.5px)'
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 px-4 py-2 rounded-full mb-6 border border-orange-500/30"
              >
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-semibold">Expertos en Tributación</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                Derecho Tributario
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Optimizamos tu carga tributaria y te defendemos ante el SII con estrategias legales innovadoras
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/agendamiento?plan=tributario"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Consulta Gratuita
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="#servicios"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-foreground px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Ver Servicios
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sección de Servicios Premium */}
        <section id="servicios" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Nuestros Servicios</h2>
              <p className="text-xl text-muted-foreground">Soluciones tributarias integrales para tu tranquilidad</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`
                    relative h-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border 
                    ${service.preferred 
                      ? 'border-amber-500/50 shadow-2xl shadow-amber-500/20' 
                      : 'border-white/10 hover:border-white/20'
                    } 
                    transition-all duration-300 overflow-hidden group
                  `}>
                    {/* Efectos de fondo premium para tarjeta preferida */}
                    {service.preferred && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent" />
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                        
                        {/* Badge "Más Popular" */}
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg"
                        >
                          {service.badge}
                        </motion.div>
                      </>
                    )}

                    {/* Partículas brillantes para tarjeta preferida */}
                    {service.preferred && (
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-amber-400 rounded-full"
                            animate={{
                              x: [0, Math.random() * 100],
                              y: [0, Math.random() * -100],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 3 + Math.random() * 2,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                            }}
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="relative z-10">
                      {/* Icono */}
                      <div className={`
                        w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} 
                        flex items-center justify-center mb-6 shadow-lg ${service.shadowColor}
                        ${service.preferred ? 'animate-pulse' : ''}
                      `}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Contenido */}
                      <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-6">{service.description}</p>

                      {/* Precio */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-primary">${service.price}</span>
                          <span className="text-lg text-muted-foreground line-through">${service.originalPrice}</span>
                        </div>
                        <span className="text-sm text-green-400">50% descuento</span>
                      </div>

                      {/* Características */}
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Botón */}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/agendamiento?plan=tributario"
                          className={`
                            w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                            ${service.preferred
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl'
                              : 'bg-white/10 text-foreground border border-white/20 hover:bg-white/20'
                            }
                          `}
                        >
                          Agendar Consulta
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de Blog */}
        <section className="py-20 bg-white/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Recursos y Actualidad Tributaria</h2>
              <p className="text-xl text-muted-foreground">Mantente informado sobre las últimas novedades fiscales</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold bg-primary/20 text-primary px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readTime} lectura</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1 text-primary hover:gap-2 transition-all"
                    >
                      Leer más
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to="/blog?categoria=tributario"
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary/20 transition-all"
              >
                <BookOpen className="w-5 h-5" />
                Ver todos los artículos
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-orange-600/20 rounded-3xl p-12 text-center overflow-hidden"
            >
              {/* Efectos de fondo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/30 rounded-full blur-3xl" />

              <div className="relative z-10">
                <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">¿Problemas con el SII?</h3>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  No enfrentes solo una fiscalización. Nuestros expertos te acompañan en todo el proceso.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/agendamiento?plan=emergencia-tributaria"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Shield className="w-5 h-5" />
                    Solicitar Defensa Urgente
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
} 