import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark } from 'lucide-react'
import SEO from '../components/SEO'

export default function BlogPost6() {
  return (
    <>
      <SEO 
        title="Guía Completa para Constituir una Empresa en Chile 2025 | Punto Legal"
        description="Todo lo que necesitas saber para crear tu empresa en Chile: tipos de sociedades, requisitos, costos y plazos actualizados para 2025."
      />
      
      <article className="min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary/10 via-transparent to-primary/10 py-8 border-b border-white/10">
          <div className="container mx-auto px-4">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Blog
            </Link>
            
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time>15 de Enero, 2025</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>12 min de lectura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Dr. Roberto Méndez</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Guía Completa para Constituir una Empresa en Chile 2025
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  Actualización completa con los últimos cambios legales, costos actualizados y 
                  nuevas modalidades de constitución digital. Todo lo que necesitas saber para 
                  emprender con seguridad jurídica.
                </p>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              {/* Featured Image */}
              <div className="relative rounded-2xl overflow-hidden mb-12 aspect-video">
                <img 
                  src="/api/placeholder/1200/600"
                  alt="Constitución de empresas en Chile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    Derecho Corporativo
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="space-y-8">
                <section>
                  <p className="text-xl leading-relaxed">
                    En 2025, constituir una empresa en Chile es más simple que nunca gracias a las 
                    nuevas herramientas digitales y reformas legales. Sin embargo, elegir la estructura 
                    societaria correcta sigue siendo crucial para el éxito de tu emprendimiento.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Tipos de Sociedades en Chile</h2>
                  
                  <h3 className="text-2xl font-semibold mt-6 mb-3">1. Sociedad por Acciones (SpA)</h3>
                  <p>
                    La <strong>SpA es la opción más popular</strong> entre emprendedores por su flexibilidad 
                    y simplicidad. Permite un solo socio, facilita la entrada de inversionistas y tiene 
                    estatutos modificables.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Capital mínimo: Sin monto mínimo</li>
                    <li>Número de socios: Desde 1 en adelante</li>
                    <li>Responsabilidad: Limitada al aporte</li>
                    <li>Tiempo de constitución: 1 día hábil (digital)</li>
                    <li>Costo aproximado: $150.000 - $250.000</li>
                  </ul>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">2. Sociedad de Responsabilidad Limitada (SRL)</h3>
                  <p>
                    Ideal para negocios familiares o sociedades con pocos socios que buscan simplicidad 
                    en la administración.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Capital mínimo: Sin monto mínimo</li>
                    <li>Número de socios: Entre 2 y 50</li>
                    <li>Responsabilidad: Limitada al aporte</li>
                    <li>Tiempo de constitución: 1-3 días hábiles</li>
                    <li>Costo aproximado: $200.000 - $300.000</li>
                  </ul>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">3. Empresa Individual de Responsabilidad Limitada (EIRL)</h3>
                  <p>
                    Para emprendedores individuales que quieren separar su patrimonio personal del empresarial.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Capital mínimo: Sin monto mínimo</li>
                    <li>Número de socios: Solo 1 (el titular)</li>
                    <li>Responsabilidad: Limitada al patrimonio de la empresa</li>
                    <li>Tiempo de constitución: 1 día hábil</li>
                    <li>Costo aproximado: $120.000 - $200.000</li>
                  </ul>
                </section>

                <section className="bg-primary/10 rounded-2xl p-8 my-8">
                  <h3 className="text-2xl font-bold mb-4">💡 Tip Profesional</h3>
                  <p>
                    Si planeas buscar inversión o tener socios en el futuro, la SpA es tu mejor opción. 
                    Si eres un profesional independiente sin planes de expansión, considera la EIRL.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Proceso de Constitución Paso a Paso</h2>
                  
                  <h3 className="text-2xl font-semibold mt-6 mb-3">Opción 1: Constitución Digital (Recomendada)</h3>
                  <ol className="list-decimal pl-6 space-y-4">
                    <li>
                      <strong>Ingresa a registrodeempresasysociedades.cl</strong>
                      <p>Usa tu ClaveÚnica para acceder al portal oficial.</p>
                    </li>
                    <li>
                      <strong>Selecciona el tipo de sociedad</strong>
                      <p>El sistema te guiará según tu elección.</p>
                    </li>
                    <li>
                      <strong>Completa el formulario</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Razón social y nombre de fantasía</li>
                        <li>Objeto social (actividades de la empresa)</li>
                        <li>Capital y aportes de socios</li>
                        <li>Administración y representación</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Firma electrónica</strong>
                      <p>Todos los socios deben firmar con ClaveÚnica.</p>
                    </li>
                    <li>
                      <strong>Pago en línea</strong>
                      <p>Aproximadamente $70.000 por derechos.</p>
                    </li>
                    <li>
                      <strong>Obtención del RUT</strong>
                      <p>Se genera automáticamente en 1 día hábil.</p>
                    </li>
                  </ol>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">Opción 2: Constitución Tradicional</h3>
                  <p>
                    Aunque más lenta y costosa, sigue siendo necesaria para sociedades complejas o 
                    con requerimientos especiales.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Costos Detallados 2025</h2>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="font-semibold mb-4">Constitución Digital (SpA/EIRL)</h4>
                    <ul className="space-y-2">
                      <li>• Derechos de constitución: $70.000</li>
                      <li>• Publicación Diario Oficial: Incluida</li>
                      <li>• Inscripción CBR: Incluida</li>
                      <li><strong>Total: $70.000</strong></li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-4">
                    <h4 className="font-semibold mb-4">Constitución Tradicional</h4>
                    <ul className="space-y-2">
                      <li>• Escritura notarial: $150.000 - $300.000</li>
                      <li>• Publicación Diario Oficial: $80.000</li>
                      <li>• Inscripción CBR: $70.000</li>
                      <li>• Legalización documentos: $20.000</li>
                      <li><strong>Total: $320.000 - $470.000</strong></li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Requisitos Post-Constitución</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="font-semibold mb-3">Obligatorios</h4>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Inicio de actividades en SII</li>
                        <li>✓ Timbraje de documentos tributarios</li>
                        <li>✓ Apertura cuenta bancaria empresa</li>
                        <li>✓ Patente municipal</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="font-semibold mb-3">Según el Giro</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Resolución sanitaria</li>
                        <li>• Permisos ambientales</li>
                        <li>• Registro de marca</li>
                        <li>• Certificaciones especiales</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-8 my-8">
                  <h3 className="text-2xl font-bold mb-4">⚠️ Errores Comunes a Evitar</h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li><strong>Objeto social muy restrictivo:</strong> Limita futuras actividades</li>
                    <li><strong>Capital social irreal:</strong> Puede generar problemas tributarios</li>
                    <li><strong>No considerar el régimen tributario:</strong> 14A vs 14D</li>
                    <li><strong>Olvidar la patente municipal:</strong> Multas desde el primer día</li>
                    <li><strong>No abrir cuenta bancaria empresarial:</strong> Mezclar patrimonios</li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Conclusión</h2>
                  <p>
                    Constituir una empresa en Chile en 2025 es un proceso accesible y rápido si 
                    conoces las opciones disponibles. La modalidad digital ha reducido tiempos y 
                    costos significativamente, permitiendo que más emprendedores formalicen sus 
                    negocios.
                  </p>
                  <p className="mt-4">
                    Sin embargo, la elección del tipo societario y la redacción de los estatutos 
                    siguen siendo decisiones críticas que impactarán el futuro de tu empresa. Por 
                    eso, siempre recomendamos contar con asesoría legal especializada.
                  </p>
                </section>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white mt-12">
                  <h3 className="text-2xl font-bold mb-4">
                    ¿Necesitas ayuda para constituir tu empresa?
                  </h3>
                  <p className="mb-6">
                    Nuestros abogados especialistas te guían en todo el proceso
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      to="/servicios/corporativo"
                      className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300"
                    >
                      Constitución Express
                    </Link>
                    <Link
                      to="/contacto"
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                    >
                      Consulta Gratuita
                    </Link>
                  </div>
                </div>

                {/* Share */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <Share2 className="w-5 h-5" />
                      Compartir
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <Bookmark className="w-5 h-5" />
                      Guardar
                    </button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Categoría: <Link to="/blog?categoria=corporativo" className="text-primary hover:underline">Derecho Corporativo</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </article>
    </>
  )
} 