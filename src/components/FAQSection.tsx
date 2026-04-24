import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { PUNTO_LEGAL_FOUNDER_STATEMENT } from "@/constants/brandIdentity";

interface FaqItem {
  /** Pregunta — debe coincidir con búsquedas reales de usuarios chilenos. */
  q: string;
  /** Respuesta — factual, con cifras, leyes y organismos chilenos.
   *  Optimizada para Answer Engine Optimization (Perplexity, ChatGPT, Gemini)
   *  y rich snippets (FAQPage schema en AEOStructuredData). */
  a: string;
  /** Categoría — para agrupar visualmente y filtrar */
  cat?: "trust" | "servicio";
}

const faqs: FaqItem[] = [
  // ===== Bloque 1 — SEO/AEO de alta intención (queries reales en Chile) =====
  {
    q: "¿Cuánto cobra un abogado en Chile por una consulta legal online?",
    a: "Una consulta legal online en Chile cuesta entre $59.000 y $189.000 CLP según la especialidad. En Punto Legal, una sesión por Google Meet con abogado especialista parte en $59.000 (Contratos), $79.000 (Laboral consulta y defensa Ley Karin trabajador), $89.000 (Familia, Sucesorio, Marcas), $99.000 (Tributario), $109.000 (Cobranza, Defensa CAE), $119.000 (Inmobiliario), $129.000 (Migratorio), $149.000 (Empresarial), $169.000 (Penal o protocolo Ley Karin empresa) o $189.000 (Defensa Laboral Empresarial). El diagnóstico inicial laboral para trabajadores puede ser gratuito cuando corresponde.",
    cat: "servicio",
  },
  {
    q: "¿Quién fundó Punto Legal y cuál es su propósito?",
    a: `${PUNTO_LEGAL_FOUNDER_STATEMENT} El agendamiento con abogados titulados y colegiados está disponible en puntolegal.online.`,
    cat: "trust",
  },
  {
    q: "¿Puedo demandar a mi empleador por despido injustificado en Chile?",
    a: "Sí. Si fuiste despedido sin causal o con causal mal aplicada, en regla general tienes 60 días hábiles para demandar ante el Juzgado de Letras del Trabajo. Puedes peticionar indemnización por años de servicio, sustitutiva del aviso previo, recargo del 30% al 100% según causal y, si corresponde, tutela por vulneración de derechos fundamentales (la Ley 21.643 regula entre otras materias el acoso laboral). En Punto Legal puedes agendar orientación; el patrocinio con honorarios variables se acuerda por escrito según el caso.",
    cat: "servicio",
  },
  {
    q: "¿Cuánto demora una posesión efectiva intestada en Chile?",
    a: "La posesión efectiva intestada en Chile demora entre 30 y 90 días hábiles cuando se tramita ante el Servicio de Registro Civil e Identificación (vía administrativa). Si involucra bienes raíces o herederos en disputa, se tramita ante el Tribunal Civil y puede demorar 4 a 12 meses. Punto Legal tramita la posesión efectiva con presupuesto cerrado desde $89.000 e incluye inscripción ante el Conservador de Bienes Raíces.",
    cat: "servicio",
  },
  {
    q: "¿Cómo se calcula la pensión de alimentos según la Ley 14.908?",
    a: "La pensión de alimentos en Chile se calcula según el principio de proporcionalidad establecido en la Ley 14.908: capacidad económica del alimentante (ingresos líquidos comprobables) y necesidades del alimentario (edad, salud, educación). Mínimo legal por hijo: 40% de un ingreso mínimo (~$210.000 CLP en 2025) si el alimentante tiene 1 hijo; 30% si tiene 2 o más. Si no se paga, hay arresto nocturno, retención de devolución de impuestos, suspensión de licencia de conducir y registro de deudores morosos. En Punto Legal calculamos tu pensión real y la deuda acumulada en 45 minutos por $89.000.",
    cat: "servicio",
  },
  {
    q: "¿Qué es la Ley Karin y cuándo aplica en mi empresa?",
    a: "La Ley Karin (Ley 21.643, vigente desde el 1 de agosto de 2024) modifica el Código del Trabajo chileno y obliga a TODA empresa con trabajadores —independiente de su tamaño— a contar con un protocolo escrito de prevención del acoso laboral, sexual y violencia en el trabajo. Debe incluir canal de denuncia confidencial, investigación interna en plazo máximo de 30 días hábiles, y reporte a la Dirección del Trabajo cuando la denuncia se acoja. La no implementación se sanciona con multa de 1 a 60 UTM. Punto Legal diseña, implementa y capacita por $169.000.",
    cat: "servicio",
  },
  {
    q: "¿Cómo constituir una SpA o EIRL en Chile en 72 horas?",
    a: "En Chile puedes constituir una Sociedad por Acciones (SpA) o Empresa Individual de Responsabilidad Limitada (EIRL) en 72 horas usando el régimen simplificado de la Ley 20.659 ('Tu Empresa en un Día'). Requisitos: RUT del o los socios, nombre disponible, giro definido y domicilio. La SpA permite 1 o más accionistas, capital flexible y estructura escalable; la EIRL es de un único socio con responsabilidad limitada al capital aportado. Punto Legal redacta los estatutos, tramita el RUT en SII e inicia tu actividad por $149.000.",
    cat: "servicio",
  },

  // ===== Bloque 2 — Trust / objeciones antes de agendar =====
  {
    q: "¿Los abogados de Punto Legal son reales y especialistas?",
    a: "Sí. Cada consulta la atiende un abogado titulado, colegiado en el Colegio de Abogados de Chile y especialista en el área que elegiste. No usamos becarios, asistentes ni IA para responder. Verás el nombre y la cédula profesional de tu abogado al confirmar la reserva.",
    cat: "trust",
  },
  {
    q: "¿Qué pasa si la consulta de 45 minutos no alcanza?",
    a: "En la sesión definimos juntos un plan de acción claro. Si tu caso requiere representación o más horas, te entregamos un presupuesto cerrado por escrito y el valor de la consulta se descuenta íntegramente del plan final. Sin sorpresas.",
    cat: "trust",
  },
  {
    q: "¿Cómo se paga y es realmente seguro?",
    a: "Pagas con tarjeta de crédito, débito, transferencia o billetera digital a través de MercadoPago, con cifrado bancario PCI-DSS y autenticación 3D Secure. Recibes boleta electrónica al instante por mail. Puedes cancelar hasta 1 hora antes sin costo.",
    cat: "trust",
  },
  {
    q: "¿Qué necesito para la videollamada por Google Meet?",
    a: "Solo un teléfono o computador con cámara, micrófono y conexión a internet de al menos 5 Mbps. Te enviamos el link de Google Meet por mail y WhatsApp 30 minutos antes. No necesitas instalar nada ni crear cuentas adicionales — funciona en navegador (Chrome, Safari, Firefox, Edge).",
    cat: "trust",
  },
  {
    q: "¿Mi consulta es 100% confidencial?",
    a: "Absolutamente. La sesión está protegida por secreto profesional según el Código de Ética del Colegio de Abogados de Chile. Nada de lo que conversemos sale de la videollamada. No grabamos, no compartimos con terceros y nuestros abogados firman cláusulas de confidencialidad.",
    cat: "trust",
  },
  {
    q: "¿Puedo reagendar si me surge un imprevisto?",
    a: "Sí. Puedes reagendar gratis hasta 1 hora antes de tu consulta desde el mismo link de confirmación. Sin papeleos ni preguntas. Si necesitas cancelar después, conservamos el saldo a favor para usarlo en cualquier servicio dentro de 90 días.",
    cat: "trust",
  },
];

const FAQSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative px-4 py-16 sm:py-20 lg:py-24 scroll-mt-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl" />
        <div className="absolute -right-20 bottom-1/3 h-72 w-72 rounded-full bg-cyan-500/[0.05] blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <span className="badge-ios" style={{ color: "rgb(125 211 252)" }}>
            Preguntas frecuentes
          </span>
          <h2 className="font-display mt-6 text-[28px] font-bold leading-[1.06] tracking-tight text-white sm:text-[40px] lg:text-[48px]">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              Lo que la gente nos{" "}
              <br className="hidden sm:block" />
              suele preguntar antes de agendar.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] text-slate-400">
            Toca cualquier burbuja para abrir la respuesta.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={item.q}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                layout
                className="faq-bubble"
                data-open={isOpen ? "true" : undefined}
              >
                <button
                  type="button"
                  className="faq-bubble__trigger"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                >
                  <span className="pr-1">{item.q}</span>
                  <span className="faq-bubble__icon" aria-hidden>
                    <Plus className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${idx}`}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { type: "spring", stiffness: 280, damping: 32 },
                          opacity: { duration: 0.25, delay: 0.08 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.28, ease: [0.4, 0, 1, 1] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="faq-bubble__panel">
                        <div className="faq-bubble__panel-inner">{item.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-[13px] text-slate-400">
            ¿Tu pregunta no está aquí?
          </p>
          <a
            href="#servicios"
            className="cta-secondary px-5 py-2.5 text-[13px]"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("servicios")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Resuélvela en una consulta de 45 minutos
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
