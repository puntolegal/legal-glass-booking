import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Building, TrendingUp, Calculator } from 'lucide-react';
import SEO from '../components/SEO';

export default function BlogTributario2() {
  return (
    <>
      <SEO
        title="Beneficios Tributarios para PYMES en Chile | Punto Legal"
        description="Descubre todas las ventajas fiscales disponibles para pequeñas y medianas empresas en Chile."
        keywords="beneficios tributarios, PYMES, impuestos chile, deducciones fiscales, SII"
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
                <span>10 Enero 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>7 min de lectura</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Equipo Tributario</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Guías</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Beneficios Tributarios para PYMES en Chile
            </h1>

            <p className="text-xl text-muted-foreground">
              Una guía completa de todas las ventajas fiscales disponibles para pequeñas y medianas 
              empresas que pueden ayudarte a optimizar tu carga tributaria.
            </p>
          </motion.div>

          {/* Imagen destacada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="aspect-video bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Building className="w-24 h-24 text-green-500/50" />
            </div>
          </motion.div>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2>¿Qué son las PYMES?</h2>
            <p>
              Las PYMES (Pequeñas y Medianas Empresas) representan el motor de la economía chilena, 
              generando más del 60% del empleo en el país. El Estado reconoce su importancia y ha 
              establecido diversos beneficios tributarios para fomentar su crecimiento y desarrollo.
            </p>

            <h2>Clasificación de PYMES según el SII</h2>
            <p>
              Para acceder a los beneficios, es fundamental conocer cómo te clasifica el Servicio 
              de Impuestos Internos:
            </p>
            <ul>
              <li><strong>Microempresa:</strong> Ventas anuales hasta 2.400 UF</li>
              <li><strong>Pequeña empresa:</strong> Ventas anuales entre 2.400 y 25.000 UF</li>
              <li><strong>Mediana empresa:</strong> Ventas anuales entre 25.000 y 100.000 UF</li>
            </ul>

            <h2>Beneficios Tributarios Principales</h2>
            
            <h3>1. Régimen PYME Pro</h3>
            <p>
              El nuevo régimen simplificado para empresas con ventas anuales de hasta 75.000 UF:
            </p>
            <ul>
              <li>Tasa reducida del 25% en Primera Categoría (vs 27% general)</li>
              <li>Depreciación instantánea para activos fijos hasta 500 UF</li>
              <li>Simplificación de obligaciones contables</li>
              <li>Beneficios en el pago de PPM (Pago Provisional Mensual)</li>
              <li>Acceso a créditos especiales</li>
            </ul>

            <h3>2. Deducciones Especiales</h3>
            <p>
              Las PYMES pueden acceder a deducciones adicionales que reducen su base imponible:
            </p>
            <ul>
              <li><strong>Gastos de representación:</strong> Hasta 3% de las ventas anuales</li>
              <li><strong>Capacitación:</strong> 100% de los gastos en formación del personal</li>
              <li><strong>Investigación y desarrollo:</strong> 50% adicional sobre gastos de I+D</li>
              <li><strong>Donaciones:</strong> Hasta 2% de la renta líquida imponible</li>
            </ul>

            <h3>3. Incentivos a la Inversión</h3>
            <p>
              Programas especiales para fomentar la modernización y expansión:
            </p>
            <ul>
              <li><strong>Depreciación acelerada:</strong> Para maquinarias y equipos tecnológicos</li>
              <li><strong>Crédito tributario:</strong> 35% para inversiones en energías renovables</li>
              <li><strong>Amortización instantánea:</strong> Para software y licencias tecnológicas</li>
              <li><strong>Beneficios regionales:</strong> Incentivos adicionales en zonas extremas</li>
            </ul>

            <h2>Beneficios Específicos por Sector</h2>
            
            <h3>Comercio y Servicios</h3>
            <ul>
              <li>Deducción especial para gastos de marketing digital</li>
              <li>Beneficios en arriendo de locales comerciales</li>
              <li>Créditos para modernización de equipos</li>
            </ul>

            <h3>Manufactura e Industria</h3>
            <ul>
              <li>Depreciación acelerada para maquinarias</li>
              <li>Beneficios en importación de materias primas</li>
              <li>Créditos para certificaciones de calidad</li>
            </ul>

            <h3>Tecnología e Innovación</h3>
            <ul>
              <li>Crédito del 50% en gastos de I+D certificados</li>
              <li>Amortización instantánea de software</li>
              <li>Beneficios para contratación de personal científico</li>
            </ul>

            <h2>Obligaciones Simplificadas</h2>
            <p>
              Las PYMES disfrutan de un régimen de obligaciones más simple:
            </p>
            <ul>
              <li>Declaraciones mensuales simplificadas</li>
              <li>Menor frecuencia de fiscalizaciones</li>
              <li>Procedimientos administrativos más ágiles</li>
              <li>Acceso a programas de regularización especiales</li>
            </ul>

            <h2>Programas de Apoyo Adicionales</h2>
            
            <h3>1. Sercotec</h3>
            <p>
              El Servicio de Cooperación Técnica ofrece:
            </p>
            <ul>
              <li>Capacitación gratuita en temas tributarios</li>
              <li>Asesoría para optimización fiscal</li>
              <li>Programas de modernización empresarial</li>
              <li>Acceso a redes de apoyo empresarial</li>
            </ul>

            <h3>2. Corfo</h3>
            <p>
              La Corporación de Fomento de la Producción proporciona:
            </p>
            <ul>
              <li>Créditos con garantía estatal</li>
              <li>Subsidios para innovación</li>
              <li>Programas de internacionalización</li>
              <li>Apoyo para certificaciones</li>
            </ul>

            <h2>Recomendaciones para Maximizar Beneficios</h2>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 my-8">
              <h3 className="text-green-500 mb-4">Estrategias recomendadas:</h3>
              <ol>
                <li><strong>Planificación anual:</strong> Estructura tus gastos para maximizar deducciones</li>
                <li><strong>Inversión en tecnología:</strong> Aprovecha la depreciación acelerada</li>
                <li><strong>Capacitación del equipo:</strong> Deduce el 100% de los gastos en formación</li>
                <li><strong>Documentación:</strong> Mantén registros detallados de todos los gastos</li>
                <li><strong>Asesoría especializada:</strong> Consulta con expertos para optimización</li>
                <li><strong>Revisión trimestral:</strong> Evalúa el aprovechamiento de beneficios</li>
              </ol>
            </div>

            <h2>Errores Comunes a Evitar</h2>
            <p>
              Muchas PYMES pierden beneficios por errores evitables:
            </p>
            <ul>
              <li>No conocer la clasificación exacta del SII</li>
              <li>No documentar adecuadamente los gastos</li>
              <li>No aprovechar las deducciones disponibles</li>
              <li>No planificar las inversiones estratégicamente</li>
              <li>No consultar con especialistas en momentos clave</li>
            </ul>

            <h2>Casos de Éxito</h2>
            <p>
              <strong>Ejemplo 1:</strong> Una PYME manufacturera logró reducir su carga tributaria 
              en un 30% mediante la combinación de depreciación acelerada, deducciones por 
              capacitación y créditos por I+D.
            </p>
            <p>
              <strong>Ejemplo 2:</strong> Una empresa de servicios tecnológicos optimizó su 
              estructura fiscal aprovechando la amortización instantánea de software y los 
              beneficios del régimen PYME Pro.
            </p>

            <h2>Conclusión</h2>
            <p>
              Los beneficios tributarios para PYMES representan una oportunidad significativa 
              para optimizar la carga fiscal y reinvertir en el crecimiento del negocio. Sin 
              embargo, su aprovechamiento requiere conocimiento especializado y planificación 
              estratégica.
            </p>
            <p>
              En Punto Legal, contamos con especialistas en derecho tributario que pueden 
              ayudarte a identificar y maximizar todos los beneficios disponibles para tu empresa, 
              asegurando el cumplimiento normativo mientras optimizas tu situación fiscal.
            </p>

            {/* CTA */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Eres PYME y quieres optimizar tus impuestos?</h3>
              <p className="mb-6 text-muted-foreground">
                Nuestros expertos pueden ayudarte a identificar todos los beneficios disponibles 
                para tu empresa y diseñar estrategias de optimización fiscal.
              </p>
              <Link
                to="/agendamiento?plan=tributario"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <Calculator className="w-5 h-5" />
                Consulta Gratuita
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