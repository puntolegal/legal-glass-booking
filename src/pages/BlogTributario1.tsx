import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';

export default function BlogTributario1() {
  return (
    <>
      <SEO
        title="Reforma Tributaria 2024: Lo que necesitas saber | Punto Legal"
        description="Análisis completo de los cambios más importantes en la legislación tributaria chilena para el año 2024."
        keywords="reforma tributaria 2024, cambios tributarios, impuestos chile, SII"
      />

      <article className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Blog
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>15 Enero 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>5 min de lectura</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Equipo Tributario</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">Actualidad</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Reforma Tributaria 2024: Lo que necesitas saber
            </h1>

            <p className="text-xl text-muted-foreground">
              Un análisis detallado de los cambios más significativos que trae la nueva reforma tributaria 
              y cómo impactarán a empresas y personas naturales en Chile.
            </p>
          </motion.div>

          {/* Imagen destacada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
              <BookOpen className="w-24 h-24 text-orange-500/50" />
            </div>
          </motion.div>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2>Introducción</h2>
            <p>
              La Reforma Tributaria 2024 representa uno de los cambios más significativos en el sistema 
              impositivo chileno de los últimos años. Con modificaciones que afectan tanto a grandes 
              empresas como a PYMES y personas naturales, es fundamental entender sus implicancias 
              para una adecuada planificación fiscal.
            </p>

            <h2>Principales cambios para las empresas</h2>
            
            <h3>1. Nuevo régimen general de tributación</h3>
            <p>
              Se establece un sistema único de tributación para las empresas, eliminando la dualidad 
              entre el régimen de renta atribuida y el semi-integrado. Las principales características son:
            </p>
            <ul>
              <li>Tasa de Primera Categoría del 27%</li>
              <li>Sistema de imputación parcial de créditos</li>
              <li>Nuevas obligaciones de registro y control</li>
              <li>Modificaciones en el tratamiento de gastos rechazados</li>
            </ul>

            <h3>2. Régimen PYME Pro</h3>
            <p>
              Se crea un nuevo régimen simplificado para pequeñas y medianas empresas con ventas 
              anuales de hasta 75.000 UF:
            </p>
            <ul>
              <li>Tasa reducida del 25% en Primera Categoría</li>
              <li>Depreciación instantánea para activos fijos</li>
              <li>Simplificación de obligaciones contables</li>
              <li>Beneficios en el pago de PPM</li>
            </ul>

            <h2>Cambios para personas naturales</h2>
            
            <h3>1. Modificación de tramos del Impuesto Global Complementario</h3>
            <p>
              Se ajustan los tramos del impuesto a la renta de las personas, con cambios significativos 
              en las tasas marginales:
            </p>
            <ul>
              <li>Nuevo tramo exento hasta 13,5 UTA</li>
              <li>Reducción de tasas para rentas medias</li>
              <li>Tasa máxima del 40% para rentas sobre 310 UTA</li>
              <li>Nuevas deducciones por gastos en educación y salud</li>
            </ul>

            <h3>2. Impuesto al patrimonio</h3>
            <p>
              Se introduce un nuevo impuesto al patrimonio para personas con activos superiores a 
              5.000 UTA (aproximadamente $3.600 millones):
            </p>
            <ul>
              <li>Tasa del 1% sobre el patrimonio neto</li>
              <li>Exenciones para vivienda principal hasta 10.000 UF</li>
              <li>Tratamiento especial para activos productivos</li>
            </ul>

            <h2>Medidas de fiscalización y cumplimiento</h2>
            
            <h3>1. Fortalecimiento de facultades del SII</h3>
            <p>
              Se amplían las atribuciones del Servicio de Impuestos Internos para combatir la 
              evasión y elusión fiscal:
            </p>
            <ul>
              <li>Acceso a información bancaria sin autorización judicial en casos específicos</li>
              <li>Nuevas normas anti-elusión</li>
              <li>Mayores sanciones por incumplimiento</li>
              <li>Programa de denunciantes anónimos</li>
            </ul>

            <h3>2. Digitalización tributaria</h3>
            <p>
              Se profundiza el proceso de modernización tecnológica del sistema tributario:
            </p>
            <ul>
              <li>Obligatoriedad de facturación electrónica para todos los contribuyentes</li>
              <li>Nuevo sistema de declaraciones en línea</li>
              <li>Integración automática de información financiera</li>
              <li>Propuesta de declaración precargada para personas naturales</li>
            </ul>

            <h2>Incentivos y beneficios especiales</h2>
            
            <h3>1. Incentivos a la inversión verde</h3>
            <p>
              Se establecen beneficios tributarios para promover la sustentabilidad:
            </p>
            <ul>
              <li>Depreciación acelerada para activos de energías renovables</li>
              <li>Crédito tributario del 35% para proyectos de hidrógeno verde</li>
              <li>Exención de impuestos para vehículos eléctricos</li>
            </ul>

            <h3>2. Apoyo a la innovación</h3>
            <p>
              Se amplían los incentivos para investigación y desarrollo:
            </p>
            <ul>
              <li>Crédito tributario del 50% en gastos de I+D certificados</li>
              <li>Tratamiento preferencial para startups tecnológicas</li>
              <li>Beneficios para la contratación de personal científico</li>
            </ul>

            <h2>Calendario de implementación</h2>
            <p>
              La reforma se implementará de manera gradual:
            </p>
            <ul>
              <li><strong>1 de enero 2024:</strong> Entrada en vigencia del nuevo régimen general</li>
              <li><strong>1 de julio 2024:</strong> Inicio del impuesto al patrimonio</li>
              <li><strong>1 de enero 2025:</strong> Plena vigencia del régimen PYME Pro</li>
              <li><strong>Durante 2024:</strong> Período de transición con normas especiales</li>
            </ul>

            <h2>Recomendaciones para contribuyentes</h2>
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 my-8">
              <h3 className="text-orange-500 mb-4">Acciones recomendadas:</h3>
              <ol>
                <li>Revisar la situación tributaria actual y proyectar impactos</li>
                <li>Evaluar la conveniencia de acogerse al régimen PYME Pro</li>
                <li>Actualizar sistemas contables y de facturación</li>
                <li>Considerar reorganizaciones societarias si corresponde</li>
                <li>Planificar inversiones aprovechando nuevos incentivos</li>
                <li>Capacitar al personal en las nuevas normativas</li>
              </ol>
            </div>

            <h2>Conclusión</h2>
            <p>
              La Reforma Tributaria 2024 introduce cambios sustanciales que requieren una adaptación 
              cuidadosa por parte de los contribuyentes. Si bien algunos aspectos pueden resultar 
              más onerosos, también se abren nuevas oportunidades de optimización fiscal para quienes 
              sepan aprovecharlas adecuadamente.
            </p>
            <p>
              En Punto Legal, contamos con especialistas en derecho tributario que pueden ayudarte 
              a navegar estos cambios y diseñar estrategias que maximicen los beneficios disponibles 
              mientras aseguras el cumplimiento normativo.
            </p>

            {/* CTA */}
            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Necesitas asesoría tributaria?</h3>
              <p className="mb-6 text-muted-foreground">
                Nuestros expertos pueden ayudarte a entender cómo te afecta la reforma y optimizar tu situación fiscal.
              </p>
              <Link
                to="/agendamiento?plan=tributario"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Agendar Consulta
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            {/* Compartir */}
            <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t">
              <span className="text-muted-foreground">Compartir:</span>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
} 