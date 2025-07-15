import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, AlertTriangle, Shield, FileText, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function BlogTributario3() {
  return (
    <>
      <SEO
        title="Cómo Enfrentar una Fiscalización del SII | Punto Legal"
        description="Guía práctica para responder adecuadamente a los requerimientos del Servicio de Impuestos Internos."
        keywords="fiscalización SII, requerimientos tributarios, defensa tributaria, SII Chile"
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
                <span>5 Enero 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>10 min de lectura</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Equipo Tributario</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">Procedimientos</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Cómo Enfrentar una Fiscalización del SII
            </h1>

            <p className="text-xl text-muted-foreground">
              Una guía práctica para responder adecuadamente a los requerimientos del Servicio 
              de Impuestos Internos y proteger tus derechos como contribuyente.
            </p>
          </motion.div>

          {/* Imagen destacada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="aspect-video bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="w-24 h-24 text-red-500/50" />
            </div>
          </motion.div>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2>¿Qué es una Fiscalización del SII?</h2>
            <p>
              Una fiscalización del Servicio de Impuestos Internos es un proceso de revisión 
              y verificación de la información tributaria declarada por un contribuyente. 
              El objetivo es asegurar el cumplimiento de las obligaciones fiscales y detectar 
              posibles irregularidades.
            </p>

            <h2>Tipos de Fiscalización</h2>
            
            <h3>1. Fiscalización de Oficio</h3>
            <ul>
              <li>Iniciada por el SII sin denuncia previa</li>
              <li>Basada en análisis de riesgo y algoritmos</li>
              <li>Puede ser selectiva o masiva</li>
              <li>Generalmente enfocada en períodos específicos</li>
            </ul>

            <h3>2. Fiscalización por Denuncia</h3>
            <ul>
              <li>Iniciada a partir de una denuncia anónima</li>
              <li>Requiere elementos de convicción</li>
              <li>Puede ser más específica y detallada</li>
              <li>Mayor probabilidad de encontrar irregularidades</li>
            </ul>

            <h3>3. Fiscalización Especial</h3>
            <ul>
              <li>Enfocada en temas específicos (ej: facturación electrónica)</li>
              <li>Puede ser sectorial o por tipo de contribuyente</li>
              <li>Generalmente más limitada en alcance</li>
            </ul>

            <h2>Señales de Alerta</h2>
            <p>
              Es importante estar atento a estas señales que pueden indicar una fiscalización:
            </p>
            <ul>
              <li>Requerimientos de información adicional</li>
              <li>Notificaciones de inconsistencias en declaraciones</li>
              <li>Visitas de inspectores del SII</li>
              <li>Correcciones automáticas de declaraciones</li>
              <li>Bloqueos temporales de acceso a sistemas</li>
            </ul>

            <h2>Pasos Inmediatos al Recibir una Fiscalización</h2>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 my-8">
              <h3 className="text-red-500 mb-4">Acciones inmediatas:</h3>
              <ol>
                <li><strong>No ignores la notificación:</strong> Los plazos son estrictos</li>
                <li><strong>Revisa el alcance:</strong> Identifica qué períodos y temas revisan</li>
                <li><strong>Organiza la documentación:</strong> Reúne todos los antecedentes</li>
                <li><strong>Busca asesoría especializada:</strong> No enfrentes solo el proceso</li>
                <li><strong>Mantén la calma:</strong> Una fiscalización no significa culpabilidad</li>
              </ol>
            </div>

            <h2>Documentación Requerida</h2>
            <p>
              El SII puede solicitar diversos documentos según el tipo de fiscalización:
            </p>
            
            <h3>Documentos Básicos</h3>
            <ul>
              <li>Libros contables y registros auxiliares</li>
              <li>Declaraciones de impuestos del período</li>
              <li>Comprobantes de pago de impuestos</li>
              <li>Documentación de gastos y costos</li>
              <li>Registros de ventas y compras</li>
            </ul>

            <h3>Documentos Específicos</h3>
            <ul>
              <li>Facturas electrónicas y respaldos</li>
              <li>Contratos y convenios</li>
              <li>Estados bancarios y movimientos</li>
              <li>Documentación de activos fijos</li>
              <li>Registros de personal y remuneraciones</li>
            </ul>

            <h2>Derechos del Contribuyente</h2>
            <p>
              Es fundamental conocer y ejercer tus derechos durante una fiscalización:
            </p>
            <ul>
              <li><strong>Derecho a ser informado:</strong> Conocer el motivo y alcance</li>
              <li><strong>Derecho a defensa:</strong> Presentar descargos y pruebas</li>
              <li><strong>Derecho a plazos razonables:</strong> Tiempo suficiente para responder</li>
              <li><strong>Derecho a confidencialidad:</strong> Protección de información sensible</li>
              <li><strong>Derecho a recurso:</strong> Impugnar resoluciones desfavorables</li>
            </ul>

            <h2>Estrategias de Defensa</h2>
            
            <h3>1. Respuesta Técnica</h3>
            <ul>
              <li>Presentar descargos fundamentados</li>
              <li>Acompañar documentación respaldatoria</li>
              <li>Explicar el contexto de las operaciones</li>
              <li>Demostrar cumplimiento de obligaciones</li>
            </ul>

            <h3>2. Negociación</h3>
            <ul>
              <li>Evaluar acuerdos de pago</li>
              <li>Considerar programas de regularización</li>
              <li>Negociar reducción de multas</li>
              <li>Establecer plazos de cumplimiento</li>
            </ul>

            <h3>3. Recursos Administrativos</h3>
            <ul>
              <li>Presentar reclamos ante el SII</li>
              <li>Recurrir al Tribunal Tributario</li>
              <li>Considerar recursos judiciales</li>
              <li>Evaluar mediación tributaria</li>
            </ul>

            <h2>Errores Comunes a Evitar</h2>
            <p>
              Muchos contribuyentes cometen errores que agravan su situación:
            </p>
            <ul>
              <li>No responder a los requerimientos</li>
              <li>Proporcionar información incompleta o falsa</li>
              <li>No buscar asesoría especializada</li>
              <li>Ignorar los plazos establecidos</li>
              <li>No mantener copias de toda la documentación</li>
              <li>Admitir responsabilidades sin fundamento</li>
            </ul>

            <h2>Programas de Regularización</h2>
            <p>
              El SII ofrece programas especiales para contribuyentes en situación irregular:
            </p>
            
            <h3>1. Programa de Regularización Voluntaria</h3>
            <ul>
              <li>Reducción significativa de multas</li>
              <li>Plazos de pago extendidos</li>
              <li>Facilidades de pago</li>
              <li>Confidencialidad del proceso</li>
            </ul>

            <h3>2. Acuerdos de Pago</h3>
            <ul>
              <li>Cuotas mensuales accesibles</li>
              <li>Reducción de intereses</li>
              <li>Flexibilidad en los plazos</li>
              <li>Posibilidad de renegociación</li>
            </ul>

            <h2>Prevención de Fiscalizaciones</h2>
            <p>
              La mejor estrategia es prevenir las fiscalizaciones:
            </p>
            <ul>
              <li>Mantener contabilidad al día</li>
              <li>Declarar correctamente todos los impuestos</li>
              <li>Conservar documentación respaldatoria</li>
              <li>Realizar auditorías internas periódicas</li>
              <li>Capacitar al personal en temas tributarios</li>
              <li>Contar con asesoría tributaria permanente</li>
            </ul>

            <h2>Casos de Éxito</h2>
            <p>
              <strong>Ejemplo 1:</strong> Una empresa logró revertir una fiscalización de 
              50 millones de pesos mediante una defensa técnica sólida y documentación 
              respaldatoria completa.
            </p>
            <p>
              <strong>Ejemplo 2:</strong> Un contribuyente individual negoció exitosamente 
              un acuerdo de pago que redujo su deuda en un 60% y estableció cuotas 
              mensuales accesibles.
            </p>

            <h2>Conclusión</h2>
            <p>
              Una fiscalización del SII puede ser un proceso estresante, pero no necesariamente 
              significa que hay irregularidades. Con la preparación adecuada, documentación 
              completa y asesoría especializada, es posible enfrentar exitosamente el proceso 
              y proteger tus derechos como contribuyente.
            </p>
            <p>
              En Punto Legal, contamos con especialistas en defensa tributaria que pueden 
              acompañarte durante todo el proceso de fiscalización, desde la respuesta inicial 
              hasta la resolución final, asegurando que tus derechos sean respetados y 
              optimizando el resultado del proceso.
            </p>

            {/* CTA */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Estás siendo fiscalizado por el SII?</h3>
              <p className="mb-6 text-muted-foreground">
                No enfrentes solo el proceso. Nuestros expertos en defensa tributaria pueden 
                ayudarte a proteger tus derechos y optimizar el resultado.
              </p>
              <Link
                to="/agendamiento?plan=emergencia-tributaria"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <Shield className="w-5 h-5" />
                Defensa Urgente
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