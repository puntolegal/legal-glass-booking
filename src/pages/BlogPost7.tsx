import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, Heart } from 'lucide-react'
import SEO from '../components/SEO'

export default function BlogPost7() {
  return (
    <>
      <SEO 
        title="Divorcio en Chile: Todo lo que Necesitas Saber en 2025 | Punto Legal"
        description="Guía completa sobre el proceso de divorcio en Chile: tipos, requisitos, costos, plazos y derechos. Información actualizada para 2025."
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
                    <time>16 de Enero, 2025</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>15 min de lectura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Dra. Carmen Valdés</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Divorcio en Chile: Todo lo que Necesitas Saber en 2025
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  Una guía completa y sensible sobre el proceso de divorcio en Chile. Conoce tus 
                  derechos, opciones legales y cómo proteger tus intereses y los de tu familia 
                  durante este proceso.
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
                  alt="Proceso de divorcio en Chile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    Derecho de Familia
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="space-y-8">
                <section>
                  <p className="text-xl leading-relaxed">
                    El divorcio es una de las decisiones más difíciles en la vida de una persona. 
                    En Chile, la ley contempla diferentes alternativas que buscan proteger los 
                    derechos de ambos cónyuges y, especialmente, el bienestar de los hijos. Esta 
                    guía te ayudará a entender el proceso y tomar decisiones informadas.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Tipos de Divorcio en Chile</h2>
                  
                  <h3 className="text-2xl font-semibold mt-6 mb-3">1. Divorcio de Mutuo Acuerdo</h3>
                  <p>
                    Es la opción más rápida y menos traumática cuando ambos cónyuges están de 
                    acuerdo en divorciarse y en las condiciones.
                  </p>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-4">
                    <h4 className="font-semibold mb-3">Requisitos:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Cese de convivencia de al menos 1 año</li>
                      <li>Acuerdo completo y suficiente regulando:
                        <ul className="list-circle pl-6 mt-2">
                          <li>Cuidado personal de los hijos</li>
                          <li>Régimen de visitas (relación directa y regular)</li>
                          <li>Pensión de alimentos</li>
                          <li>Compensación económica (si corresponde)</li>
                        </ul>
                      </li>
                      <li>Ambos cónyuges deben comparecer personalmente</li>
                    </ul>
                    <p className="mt-4"><strong>Tiempo estimado:</strong> 2-4 meses</p>
                    <p><strong>Costo aproximado:</strong> $500.000 - $1.000.000 (por abogado)</p>
                  </div>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">2. Divorcio Unilateral</h3>
                  <p>
                    Cuando uno de los cónyuges no está de acuerdo o no es posible llegar a un 
                    acuerdo completo.
                  </p>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-4">
                    <h4 className="font-semibold mb-3">Requisitos:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Cese de convivencia de al menos 3 años</li>
                      <li>Notificación personal al otro cónyuge</li>
                      <li>Acreditar el cese de convivencia con pruebas</li>
                    </ul>
                    <p className="mt-4"><strong>Tiempo estimado:</strong> 6-12 meses</p>
                    <p><strong>Costo aproximado:</strong> $800.000 - $2.000.000</p>
                  </div>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">3. Divorcio por Culpa</h3>
                  <p>
                    Basado en el incumplimiento grave de los deberes del matrimonio por parte 
                    de uno de los cónyuges.
                  </p>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-4">
                    <h4 className="font-semibold mb-3">Causales:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Atentado contra la vida o malos tratos graves</li>
                      <li>Transgresión grave de los deberes del matrimonio</li>
                      <li>Conducta homosexual</li>
                      <li>Alcoholismo o drogadicción</li>
                      <li>Tentativa de prostituir al otro cónyuge o hijos</li>
                    </ul>
                    <p className="mt-4 text-amber-500">
                      ⚠️ Este tipo de divorcio es complejo, costoso y emocionalmente desgastante. 
                      Se recomienda solo en casos extremos.
                    </p>
                  </div>
                </section>

                <section className="bg-primary/10 rounded-2xl p-8 my-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Heart className="w-6 h-6" /> Protegiendo a los Hijos
                  </h3>
                  <p className="mb-4">
                    El bienestar de los hijos es la prioridad principal en todo proceso de divorcio. 
                    La ley chilena establece que:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Los hijos tienen derecho a mantener relación con ambos padres</li>
                    <li>Las decisiones deben tomarse considerando el interés superior del niño</li>
                    <li>Los acuerdos sobre hijos menores deben ser aprobados por el tribunal</li>
                    <li>Se puede solicitar mediación familiar gratuita</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Proceso Paso a Paso</h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Evaluación Inicial</h4>
                        <p>Consulta con un abogado especialista para evaluar tu situación y opciones.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Mediación Familiar (Obligatoria)</h4>
                        <p>Para materias de alimentos, cuidado personal y relación directa con hijos.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Preparación de Documentos</h4>
                        <ul className="list-disc pl-6 mt-2 text-sm">
                          <li>Certificado de matrimonio</li>
                          <li>Certificados de nacimiento de hijos</li>
                          <li>Acuerdo completo (si es mutuo acuerdo)</li>
                          <li>Documentos que acrediten cese de convivencia</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Presentación de la Demanda</h4>
                        <p>Se ingresa en el Juzgado de Familia correspondiente al domicilio.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        5
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Audiencias</h4>
                        <p>Preparatoria y de juicio (según el tipo de divorcio).</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        6
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Sentencia</h4>
                        <p>El juez dicta sentencia declarando el divorcio.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        7
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Inscripción</h4>
                        <p>Subinscripción al margen del matrimonio en Registro Civil.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Aspectos Económicos Importantes</h2>
                  
                  <h3 className="text-2xl font-semibold mt-6 mb-3">Compensación Económica</h3>
                  <p>
                    Si uno de los cónyuges se dedicó al cuidado del hogar o los hijos, puede 
                    tener derecho a compensación económica.
                  </p>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-4">
                    <h4 className="font-semibold mb-3">Factores que se consideran:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Duración del matrimonio</li>
                      <li>Situación patrimonial de ambos</li>
                      <li>Edad y estado de salud</li>
                      <li>Cualificación profesional y posibilidades de acceso al trabajo</li>
                      <li>Colaboración prestada a las actividades del otro cónyuge</li>
                    </ul>
                  </div>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">Régimen Patrimonial</h3>
                  <p>
                    La liquidación de bienes dependerá del régimen matrimonial:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Sociedad conyugal:</strong> División 50/50 de los gananciales</li>
                    <li><strong>Separación de bienes:</strong> Cada uno conserva sus bienes</li>
                    <li><strong>Participación en gananciales:</strong> Se comparten las ganancias</li>
                  </ul>
                </section>

                <section className="bg-gradient-to-r from-amber-500/20 to-amber-500/10 rounded-2xl p-8 my-8">
                  <h3 className="text-2xl font-bold mb-4">⚡ Tips para un Proceso más Rápido</h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>Intenta llegar a acuerdos antes de iniciar el proceso</li>
                    <li>Ten toda la documentación preparada desde el inicio</li>
                    <li>Considera la mediación privada si pueden pagarla</li>
                    <li>Mantén una comunicación respetuosa con tu ex pareja</li>
                    <li>Prioriza siempre el bienestar de los hijos</li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">¿Puedo divorciarme sin abogado?</h4>
                      <p>No, la ley exige patrocinio de abogado en todos los casos de divorcio.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">¿Qué pasa si mi cónyuge está en el extranjero?</h4>
                      <p>Se puede tramitar, pero requiere notificación internacional y puede demorar más.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">¿Puedo volver a casarme inmediatamente?</h4>
                      <p>Sí, una vez inscrito el divorcio en el Registro Civil, puedes casarte nuevamente.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">¿El divorcio afecta la nacionalidad de mi cónyuge extranjero?</h4>
                      <p>No, la nacionalidad adquirida por matrimonio no se pierde con el divorcio.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Conclusión</h2>
                  <p>
                    El divorcio es un proceso complejo que afecta múltiples aspectos de la vida. 
                    Aunque puede ser emocionalmente desafiante, contar con la información correcta 
                    y el apoyo legal adecuado puede hacer una gran diferencia.
                  </p>
                  <p className="mt-4">
                    Recuerda que cada situación es única. Lo que funcionó para otros puede no ser 
                    lo mejor para ti. Por eso es fundamental contar con asesoría legal personalizada 
                    que considere todos los aspectos de tu caso particular.
                  </p>
                </section>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white mt-12">
                  <h3 className="text-2xl font-bold mb-4">
                    ¿Necesitas orientación para tu proceso de divorcio?
                  </h3>
                  <p className="mb-6">
                    Nuestros abogados especialistas en familia te acompañan con empatía y profesionalismo
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      to="/servicios/familia"
                      className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300"
                    >
                      Consulta Confidencial
                    </Link>
                    <a
                      href="tel:+56912345678"
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                    >
                      Llamar Ahora
                    </a>
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
                    Categoría: <Link to="/blog?categoria=familia" className="text-primary hover:underline">Derecho de Familia</Link>
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