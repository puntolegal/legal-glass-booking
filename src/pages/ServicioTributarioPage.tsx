import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, Shield, TrendingUp, AlertTriangle, Clock, CheckCircle, ArrowRight, Calendar, DollarSign, BarChart3, FileSearch, Briefcase, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ServicioTributarioPage: React.FC = () => {
  const services = [
    {
      title: "Planificación Tributaria",
      description: "Optimización legal de tu carga impositiva",
      price: "$150.000",
      features: [
        "Análisis de estructura tributaria",
        "Estrategias de optimización fiscal",
        "Proyección de ahorros tributarios",
        "Implementación de planificación"
      ],
      icon: TrendingUp,
      highlighted: false
    },
    {
      title: "Defensa ante SII",
      description: "Representación en fiscalizaciones y auditorías",
      price: "$200.000",
      features: [
        "Defensa en fiscalizaciones",
        "Respuesta a requerimientos",
        "Recursos y reclamaciones",
        "Negociación con SII"
      ],
      icon: Shield,
      highlighted: true
    },
    {
      title: "Consultoría Empresarial",
      description: "Asesoría tributaria integral para empresas",
      price: "$300.000",
      features: [
        "Revisión mensual tributaria",
        "Alertas de vencimientos",
        "Optimización de impuestos",
        "Capacitación al equipo"
      ],
      icon: Briefcase,
      highlighted: false
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Ahorro Fiscal",
      description: "Reducción legal de hasta 30% en impuestos"
    },
    {
      icon: Shield,
      title: "Protección Legal",
      description: "Evita multas y sanciones del SII"
    },
    {
      icon: Clock,
      title: "Respuesta Rápida",
      description: "Atención urgente en fiscalizaciones"
    },
    {
      icon: CheckCircle,
      title: "Cumplimiento",
      description: "100% apegado a la normativa vigente"
    }
  ];

  const stats = [
    { value: "$50M+", label: "Ahorrados en impuestos" },
    { value: "500+", label: "Empresas asesoradas" },
    { value: "100%", label: "Confidencialidad" },
    { value: "24h", label: "Respuesta urgente" }
  ];

  return (
    <>
      <SEO 
        title="Derecho Tributario - Optimización Fiscal y Defensa ante SII"
        description="Expertos en planificación tributaria, defensa ante el SII y optimización fiscal legal. Ahorra hasta 30% en impuestos."
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-6">
                <Calculator className="w-5 h-5" />
                <span className="font-semibold">Optimización Fiscal Legal</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Derecho <span className="text-green-400">Tributario</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Protege tu patrimonio y optimiza legalmente tu carga tributaria con expertos en legislación fiscal
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/agendamiento?plan=tributario"
                  className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all inline-flex items-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Consulta Tributaria
                </Link>
                
                <Link
                  to="/calculadora-impuestos"
                  className="bg-white/10 backdrop-blur-sm text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 border border-white/20"
                >
                  <BarChart3 className="w-5 h-5" />
                  Calculadora de Impuestos
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                  >
                    <div className="text-2xl font-bold text-green-400">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Servicios Tributarios Especializados
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Soluciones integrales para tu situación fiscal
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group ${service.highlighted ? 'scale-105' : ''}`}
                >
                  {service.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MÁS POPULAR
                    </div>
                  )}
                  
                  <div className={`h-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border ${
                    service.highlighted ? 'border-green-500/50' : 'border-white/10'
                  } hover:border-green-500/30 transition-all`}>
                    <service.icon className={`w-12 h-12 ${
                      service.highlighted ? 'text-green-400' : 'text-primary'
                    } mb-4`} />
                    
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    
                    <div className="text-3xl font-bold mb-6 text-green-400">
                      {service.price}
                      <span className="text-sm text-muted-foreground font-normal"> /consulta</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      to={`/agendamiento?plan=${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                        service.highlighted
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-white/10 text-foreground hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                      Agendar Consulta
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-green-500/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                ¿Por qué elegirnos para tu asesoría tributaria?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experiencia y resultados comprobados en optimización fiscal
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Nuestro Proceso de Asesoría
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Simple, transparente y orientado a resultados
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Diagnóstico Fiscal",
                  description: "Analizamos tu situación tributaria actual e identificamos oportunidades de optimización",
                  icon: FileSearch
                },
                {
                  step: "02",
                  title: "Plan de Acción",
                  description: "Diseñamos estrategias personalizadas para reducir legalmente tu carga tributaria",
                  icon: FileText
                },
                {
                  step: "03",
                  title: "Implementación",
                  description: "Ejecutamos las acciones necesarias y te acompañamos en todo el proceso",
                  icon: CheckCircle
                },
                {
                  step: "04",
                  title: "Seguimiento",
                  description: "Monitoreo continuo y ajustes para mantener tu situación fiscal optimizada",
                  icon: TrendingUp
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 mb-8"
                >
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-400">{step.step}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                      <step.icon className="w-6 h-6 text-green-400" />
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
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
                Actualidad en Derecho Tributario
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mantente al día con las últimas reformas y cambios fiscales
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
                  Reforma Tributaria 2025: Cambios Clave
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>25 Enero 2025</span>
                  <span>• 12 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Nuevas tasas impositivas y modificaciones al sistema de renta presunta...
                </p>
                <Link 
                  to="/blog/reforma-tributaria-2025"
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
                  <span className="text-xs text-muted-foreground">IVA</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  IVA Digital: Nuevas Obligaciones
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>23 Enero 2025</span>
                  <span>• 8 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Cambios en la tributación de servicios digitales y comercio electrónico...
                </p>
                <Link 
                  to="/blog/iva-digital-obligaciones"
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
                  <span className="text-xs text-muted-foreground">Fiscalización</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  SII: Nuevos Protocolos de Fiscalización
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>21 Enero 2025</span>
                  <span>• 6 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Cambios en los procedimientos de auditoría y plazos de respuesta...
                </p>
                <Link 
                  to="/blog/sii-protocolos-fiscalizacion"
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
                  <span className="text-xs text-muted-foreground">PyMEs</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Régimen PyME: Beneficios Ampliados
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>19 Enero 2025</span>
                  <span>• 7 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Nuevos incentivos tributarios para pequeñas y medianas empresas...
                </p>
                <Link 
                  to="/blog/regimen-pyme-beneficios"
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
                  <span className="text-xs text-muted-foreground">Internacional</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Convenios Tributarios: Nuevos Acuerdos
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>17 Enero 2025</span>
                  <span>• 5 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Chile firma nuevos convenios para evitar doble tributación...
                </p>
                <Link 
                  to="/blog/convenios-tributarios-2025"
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
                  <span className="text-xs text-muted-foreground">Crypto</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Criptomonedas: Régimen Tributario
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>15 Enero 2025</span>
                  <span>• 9 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Nuevas normas para la tributación de activos digitales...
                </p>
                <Link 
                  to="/blog/criptomonedas-regimen-tributario"
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
                to="/blog/categoria/tributario"
                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Ver Todos los Artículos Tributarios
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                ¿Listo para Optimizar tu Situación Tributaria?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                No pagues más impuestos de los necesarios. Optimiza legalmente tu carga fiscal
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/agendamiento?plan=tributario"
                  className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all inline-flex items-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Consulta Tributaria
                </Link>
                
                <Link
                  to="/diagnostico-fiscal-gratuito"
                  className="bg-white/10 backdrop-blur-sm text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 border border-white/20"
                >
                  <FileSearch className="w-5 h-5" />
                  Diagnóstico Gratuito
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicioTributarioPage; 