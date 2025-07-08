import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, Home, AlertTriangle, CheckCircle } from 'lucide-react'
import SEO from '../components/SEO'

export default function BlogPost8() {
  return (
    <>
      <SEO 
        title="Guía de Compraventa de Propiedades: Evita Problemas Legales | Punto Legal"
        description="Todo lo que debes verificar antes de comprar o vender una propiedad en Chile. Checklist legal completo para transacciones inmobiliarias seguras."
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
                    <time>17 de Enero, 2025</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>10 min de lectura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Dr. Patricio Morales</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Guía de Compraventa de Propiedades: Evita Problemas Legales
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  La compra de una propiedad es una de las inversiones más importantes de tu vida. 
                  Aprende qué documentos revisar, qué verificar y cómo protegerte de fraudes y 
                  problemas legales futuros.
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
                  alt="Compraventa de propiedades en Chile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    Derecho Inmobiliario
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="space-y-8">
                <section>
                  <p className="text-xl leading-relaxed">
                    En Chile, miles de personas enfrentan problemas legales después de comprar 
                    propiedades sin la debida diligencia. Desde títulos defectuosos hasta deudas 
                    ocultas, los riesgos son reales y costosos. Esta guía te ayudará a realizar 
                    una compra segura y sin sorpresas.
                  </p>
                </section>

                <section className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 my-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-6 h-6" /> Alerta de Fraudes Comunes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span><strong>Venta doble:</strong> La misma propiedad vendida a múltiples compradores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span><strong>Suplantación de identidad:</strong> Falsos propietarios con documentos adulterados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span><strong>Propiedades con prohibición:</strong> Inmuebles que no pueden venderse legalmente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span><strong>Deudas ocultas:</strong> Hipotecas o embargos no declarados</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Documentos Esenciales a Revisar</h2>
                  
                  <h3 className="text-2xl font-semibold mt-6 mb-3 flex items-center gap-2">
                    <Home className="w-6 h-6" /> 1. Certificado de Dominio Vigente
                  </h3>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <p className="mb-4">
                      El documento más importante. Debe tener <strong>máximo 30 días</strong> de antigüedad.
                    </p>
                    <h4 className="font-semibold mb-2">Qué verificar:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Que el vendedor sea efectivamente el propietario</li>
                      <li>Descripción correcta de la propiedad</li>
                      <li>Ausencia de anotaciones marginales problemáticas</li>
                      <li>Fecha de inscripción (importante para prescripción)</li>
                    </ul>
                    <p className="mt-4 text-sm text-amber-500">
                      💡 Tip: Solicítalo directamente en el Conservador de Bienes Raíces o en línea
                    </p>
                  </div>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">2. Certificado de Hipotecas y Gravámenes</h3>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <p className="mb-4">
                      Revela todas las deudas y limitaciones sobre la propiedad.
                    </p>
                    <h4 className="font-semibold mb-2">Elementos críticos:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Hipotecas vigentes (monto y acreedor)</li>
                      <li>Embargos judiciales</li>
                      <li>Prohibiciones de enajenar</li>
                      <li>Servidumbres</li>
                      <li>Usufructos o derechos de uso</li>
                    </ul>
                  </div>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">3. Certificado de Avalúo Fiscal</h3>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <p className="mb-4">
                      Necesario para calcular impuestos y verificar la valoración.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Valor fiscal actualizado</li>
                      <li>Exenciones tributarias</li>
                      <li>Clasificación de la propiedad</li>
                    </ul>
                  </div>

                  <h3 className="text-2xl font-semibold mt-6 mb-3">4. Certificado de Deuda de Contribuciones</h3>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <p>
                      Asegúrate de que no existan contribuciones impagas. Las deudas se traspasan 
                      con la propiedad.
                    </p>
                  </div>
                </section>

                <section className="bg-primary/10 rounded-2xl p-8 my-8">
                  <h3 className="text-2xl font-bold mb-4">📋 Checklist de Verificación Pre-Compra</h3>
                  <div className="space-y-3">
                    {[
                      'Verificar identidad del vendedor con cédula vigente',
                      'Confirmar estado civil y régimen matrimonial',
                      'Revisar poderes si actúa un representante',
                      'Verificar deslindes y superficie real',
                      'Comprobar al día servicios básicos',
                      'Revisar reglamento de copropiedad (si aplica)',
                      'Verificar permisos de edificación y recepción final',
                      'Confirmar situación de arriendos vigentes',
                      'Revisar litigios pendientes',
                      'Verificar cumplimiento normativa urbanística'
                    ].map((item, index) => (
                      <label key={index} className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="mt-1" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Proceso de Compraventa Paso a Paso</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="font-semibold mb-3 text-primary">Fase 1: Negociación y Promesa</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Negociar precio y condiciones</li>
                        <li>Firmar promesa de compraventa</li>
                        <li>Pagar señal o arras (típicamente 10%)</li>
                        <li>Establecer plazo para escritura definitiva</li>
                      </ul>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="font-semibold mb-3 text-primary">Fase 2: Estudio de Títulos</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Abogado revisa todos los antecedentes</li>
                        <li>Solicitud de certificados actualizados</li>
                        <li>Informe de observaciones si las hay</li>
                        <li>Subsanación de problemas detectados</li>
                      </ul>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="font-semibold mb-3 text-primary">Fase 3: Escritura Pública</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Redacción de escritura por abogado</li>
                        <li>Firma ante notario</li>
                        <li>Pago del saldo de precio</li>
                        <li>Entrega de llaves</li>
                      </ul>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="font-semibold mb-3 text-primary">Fase 4: Inscripción</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Inscripción en Conservador de Bienes Raíces</li>
                        <li>Pago de impuesto territorial</li>
                        <li>Archivo de documentación</li>
                        <li>Cambio de servicios básicos</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Costos Asociados a la Compraventa</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white/5 rounded-xl overflow-hidden">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="text-left p-4">Concepto</th>
                          <th className="text-left p-4">Quién Paga</th>
                          <th className="text-left p-4">Monto Aproximado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        <tr>
                          <td className="p-4">Escritura pública</td>
                          <td className="p-4">Comprador</td>
                          <td className="p-4">0.2% - 0.3% del precio</td>
                        </tr>
                        <tr>
                          <td className="p-4">Inscripción CBR</td>
                          <td className="p-4">Comprador</td>
                          <td className="p-4">0.2% del avalúo fiscal</td>
                        </tr>
                        <tr>
                          <td className="p-4">Impuesto territorial</td>
                          <td className="p-4">Vendedor (prorrateado)</td>
                          <td className="p-4">Variable</td>
                        </tr>
                        <tr>
                          <td className="p-4">Certificados</td>
                          <td className="p-4">Comprador</td>
                          <td className="p-4">$50.000 - $100.000</td>
                        </tr>
                        <tr>
                          <td className="p-4">Estudio de títulos</td>
                          <td className="p-4">Comprador</td>
                          <td className="p-4">$300.000 - $800.000</td>
                        </tr>
                        <tr>
                          <td className="p-4">Corretaje</td>
                          <td className="p-4">Vendedor (usual)</td>
                          <td className="p-4">2% del precio</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 my-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-6 h-6" /> Consejos para una Compra Segura
                  </h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li><strong>Nunca pagues sin escritura pública</strong> firmada y lista para inscribir</li>
                    <li><strong>Visita la propiedad múltiples veces</strong> en diferentes horarios</li>
                    <li><strong>Habla con vecinos</strong> sobre problemas del sector</li>
                    <li><strong>Contrata un abogado independiente</strong>, no el del vendedor</li>
                    <li><strong>Exige recibos</strong> por cada pago realizado</li>
                    <li><strong>No firmes bajo presión</strong>, tómate el tiempo necesario</li>
                    <li><strong>Verifica poderes</strong> si no trata directamente con el dueño</li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Casos Especiales que Requieren Mayor Cuidado</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-6 border border-amber-500/20">
                      <h4 className="font-semibold mb-2 text-amber-400">Propiedades en Sucesión</h4>
                      <p>Requieren posesión efectiva inscrita y acuerdo de todos los herederos.</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-6 border border-amber-500/20">
                      <h4 className="font-semibold mb-2 text-amber-400">Propiedades con Subsidio</h4>
                      <p>Verificar restricciones de venta y plazos mínimos de tenencia.</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-6 border border-amber-500/20">
                      <h4 className="font-semibold mb-2 text-amber-400">Propiedades en Leasing</h4>
                      <p>Confirmar término del contrato y liberación de gravámenes.</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-6 border border-amber-500/20">
                      <h4 className="font-semibold mb-2 text-amber-400">Propiedades Rurales</h4>
                      <p>Revisar derechos de agua, servidumbres de paso y normativa DL 3.516.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-bold mb-4">Conclusión</h2>
                  <p>
                    La compra de una propiedad no tiene por qué ser un proceso estresante o riesgoso. 
                    Con la debida diligencia y asesoría legal adecuada, puedes realizar una transacción 
                    segura y transparente.
                  </p>
                  <p className="mt-4">
                    Recuerda: es mejor invertir en un buen estudio de títulos que enfrentar problemas 
                    legales después. La prevención siempre será más económica que la solución de 
                    conflictos posteriores.
                  </p>
                </section>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white mt-12">
                  <h3 className="text-2xl font-bold mb-4">
                    ¿Vas a comprar o vender una propiedad?
                  </h3>
                  <p className="mb-6">
                    Protege tu inversión con nuestro servicio completo de asesoría inmobiliaria
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      to="/servicios/inmobiliario"
                      className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300"
                    >
                      Estudio de Títulos
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
                    Categoría: <Link to="/blog?categoria=inmobiliario" className="text-primary hover:underline">Derecho Inmobiliario</Link>
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