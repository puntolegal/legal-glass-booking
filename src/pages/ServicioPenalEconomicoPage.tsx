import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, FileSearch, Briefcase, TrendingDown, Users, Scale, ArrowRight, Calendar, Phone, BarChart3, Lock, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ServicioPenalEconomicoPage: React.FC = () => {
  const services = [
    {
      title: "Defensa Penal Corporativa",
      description: "Defensa en delitos económicos empresariales",
      price: "$500.000",
      features: [
        "Defensa en fraudes corporativos",
        "Delitos tributarios y aduaneros",
        "Lavado de activos",
        "Representación integral"
      ],
      icon: Shield,
      highlighted: false
    },
    {
      title: "Compliance Penal",
      description: "Prevención de delitos en la empresa",
      price: "$350.000",
      features: [
        "Programas de cumplimiento",
        "Auditorías de riesgo penal",
        "Protocolos anti-corrupción",
        "Capacitación ejecutiva"
      ],
      icon: FileSearch,
      highlighted: true
    },
    {
      title: "Crisis Management",
      description: "Gestión de crisis penales corporativas",
      price: "$750.000",
      features: [
        "Respuesta inmediata 24/7",
        "Manejo de medios",
        "Negociación con fiscalía",
        "Protección reputacional"
      ],
      icon: AlertTriangle,
      highlighted: false
    }
  ];

  const crimes = [
    {
      icon: TrendingDown,
      title: "Fraude y Estafa",
      description: "Defensa en casos de fraude empresarial y estafas"
    },
    {
      icon: BarChart3,
      title: "Delitos Tributarios",
      description: "Evasión fiscal, fraude al fisco y delitos aduaneros"
    },
    {
      icon: Lock,
      title: "Lavado de Activos",
      description: "Defensa en casos de blanqueo de capitales"
    },
    {
      icon: Users,
      title: "Corrupción",
      description: "Cohecho, tráfico de influencias y malversación"
    }
  ];

  const stats = [
    { value: "200+", label: "Casos defendidos" },
    { value: "85%", label: "Absoluciones" },
    { value: "$100M+", label: "Patrimonio protegido" },
    { value: "24/7", label: "Disponibilidad" }
  ];

  return (
    <>
      <SEO 
        title="Derecho Penal Económico - Defensa Corporativa y Compliance"
        description="Expertos en defensa penal económica, compliance corporativo y gestión de crisis. Protegemos tu empresa y patrimonio."
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-orange-900/10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-red-900/20 text-red-400 px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Defensa Penal Corporativa</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Derecho Penal <span className="text-orange-400">Económico</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Protección integral para empresas y ejecutivos en casos de delitos económicos
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/agendamiento?plan=penal-economico-urgente"
                  className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all inline-flex items-center gap-2 animate-pulse"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Defensa Urgente
                </Link>
                
                <Link
                  to="/evaluacion-riesgo-penal"
                  className="bg-white/10 backdrop-blur-sm text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 border border-white/20"
                >
                  <Eye className="w-5 h-5" />
                  Evaluación de Riesgo
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
                    <div className="text-2xl font-bold text-orange-400">{stat.value}</div>
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
                Servicios Especializados
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Defensa integral en delitos económicos y compliance corporativo
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
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      RECOMENDADO
                    </div>
                  )}
                  
                  <div className={`h-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border ${
                    service.highlighted ? 'border-orange-500/50' : 'border-white/10'
                  } hover:border-orange-500/30 transition-all`}>
                    <service.icon className={`w-12 h-12 ${
                      service.highlighted ? 'text-orange-400' : 'text-primary'
                    } mb-4`} />
                    
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    
                    <div className="text-3xl font-bold mb-6 text-orange-400">
                      {service.price}
                      <span className="text-sm text-muted-foreground font-normal"> /consulta</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      to={`/agendamiento?plan=${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                        service.highlighted
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-white/10 text-foreground hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                      Contratar Ahora
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Types of Crimes Section */}
        <section className="py-20 bg-gradient-to-b from-red-900/5 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Delitos que Defendemos
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experiencia comprobada en los casos más complejos
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {crimes.map((crime, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <crime.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{crime.title}</h3>
                  <p className="text-muted-foreground">{crime.description}</p>
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
                Actualidad en Derecho Penal Económico
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mantente informado sobre las últimas tendencias en delitos económicos
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
                  <span className="text-xs text-muted-foreground">Compliance</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Ley 21.595: Compliance Obligatorio
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>26 Enero 2025</span>
                  <span>• 11 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Nuevas obligaciones de compliance para empresas medianas y grandes...
                </p>
                <Link 
                  to="/blog/ley-compliance-obligatorio"
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
                  <span className="text-xs text-muted-foreground">Lavado</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  UAF: Nuevas Señales de Alerta
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>24 Enero 2025</span>
                  <span>• 9 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Actualización de indicadores para prevención de lavado de activos...
                </p>
                <Link 
                  to="/blog/uaf-nuevas-senales-alerta"
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
                  <span className="text-xs text-muted-foreground">Fraude</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Fraude Corporativo: Casos 2025
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>22 Enero 2025</span>
                  <span>• 7 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Análisis de los principales casos de fraude empresarial del año...
                </p>
                <Link 
                  to="/blog/fraude-corporativo-casos-2025"
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
                  <span className="text-xs text-muted-foreground">Corrupción</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Anticorrupción: Nuevas Sanciones
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>20 Enero 2025</span>
                  <span>• 10 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Endurecimiento de penas para delitos de corrupción pública y privada...
                </p>
                <Link 
                  to="/blog/anticorrupcion-nuevas-sanciones"
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
                  <span className="text-xs text-muted-foreground">Crypto</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Criptodelitos: Marco Penal
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>18 Enero 2025</span>
                  <span>• 8 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Nueva tipificación de delitos relacionados con criptomonedas...
                </p>
                <Link 
                  to="/blog/criptodelitos-marco-penal"
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
                  <span className="text-xs text-muted-foreground">Fiscalía</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  ULDDECO: Nuevos Protocolos
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>16 Enero 2025</span>
                  <span>• 6 min</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Cambios en la investigación de delitos económicos complejos...
                </p>
                <Link 
                  to="/blog/ulddeco-nuevos-protocolos"
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
                to="/blog/categoria/penal-economico"
                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Ver Todos los Artículos de Penal Económico
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-red-900/10 to-orange-900/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                ¿Tu Empresa Enfrenta una Investigación Penal?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                No esperes. La defensa temprana marca la diferencia entre el éxito y el fracaso
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/agendamiento?plan=defensa-corporativa-urgente"
                  className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all inline-flex items-center gap-2 animate-pulse"
                >
                  <Phone className="w-5 h-5" />
                  Defensa Urgente 24/7
                </Link>
                
                <Link
                  to="/auditoria-compliance"
                  className="bg-white/10 backdrop-blur-sm text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2 border border-white/20"
                >
                  <FileSearch className="w-5 h-5" />
                  Auditoría de Compliance
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicioPenalEconomicoPage; 