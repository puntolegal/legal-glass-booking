/**
 * Contenido único para `/servicios/laboral`: FAQ visible + JSON-LD (FAQPage).
 * Mantener alineado con tono prudente en docs/conversion-copia-juridica-mejoras.md.
 */

export type LaboralFaqItem = {
  question: string
  answer: string
}

export const LABORAL_FAQ_ITEMS: LaboralFaqItem[] = [
  {
    question: '¿Qué es la Ley Karin y cómo me protege?',
    answer:
      'La Ley Karin (Ley 21.643) amplió la obligación de los empleadores de prevenir y sancionar el acoso laboral y sexual. Exige protocolos de prevención, canales de denuncia y proceso de investigación. Si sufriste acoso, la ley te protege con tutela de derechos fundamentales y posibles indemnizaciones.',
  },
  {
    question: '¿Cuánto tiempo tengo para demandar por despido injustificado?',
    answer:
      'Tienes 60 días hábiles desde la separación para presentar la demanda laboral. Este plazo se suspende por la mediación ante la Inspección del Trabajo (hasta por 10 días). Es fundamental actuar rápido para no perder el derecho.',
  },
  {
    question: '¿Qué incluye la indemnización por años de servicio?',
    answer:
      'En líneas generales, corresponde una suma equivalente a 30 días de remuneración por cada año de servicio (con reglas de fracción y topes legales). Para contratos posteriores al 14 de agosto de 1981 suele computarse un tope de 11 años de servicio en la indemnización por años de servicio. Los montos finales dependen de hechos, contrato y prueba; en la consulta se revisa una estimación orientativa.',
  },
  {
    question: '¿Qué es la “última remuneración” para fines de indemnización (Art. 172)?',
    answer:
      'Es un concepto técnico: suele incluir el sueldo y otras sumas permanentes que percibías por el trabajo al término del contrato, con exclusiones legales (por ejemplo, la asignación familiar no forma parte de esa base). El cálculo exacto lo aplica tu abogado según tus liquidaciones y la normativa vigente.',
  },
  {
    question: '¿El empleador puede descontar el AFC de la indemnización si gano la demanda?',
    answer:
      'Hay criterios jurisprudenciales recientes en torno al descuento del aporte del empleador al seguro de cesantía en ciertos escenarios de despido injustificado. Es un tema casuístico: en la sesión se evalúa si aplica a tus hechos y documentos, sin promesa de resultado.',
  },
  {
    question: '¿Puedo reclamar horas extra no pagadas con prescripción?',
    answer:
      'El plazo de prescripción de las acciones laborales individuales es de 2 años desde que las obligaciones se hicieron exigibles (o desde la terminación del contrato). En la práctica, conviene actuar antes de los 2 años para acumular evidencia y testigos.',
  },
  {
    question: '¿Cómo funciona la consulta inicial?',
    answer:
      'Agendas una consulta online o presencial donde revisamos tu caso, contrato, liquidaciones y documentación relevante. Recibes una evaluación de viabilidad y estrategia recomendada. Los descuentos entre servicios, si corresponden, se indican al contratar.',
  },
  {
    question: '¿Qué es la mediación obligatoria ante la Inspección del Trabajo?',
    answer:
      'Antes de demandar por ciertas materias laborales, la ley puede exigir intentar una mediación ante la Inspección del Trabajo. Si se inicia, el plazo de 60 días para demandar puede suspenderse hasta por 10 días según reglas legales de cómputo. En la sesión se revisa si aplica a tu conflicto y cómo contar plazos en tu caso concreto.',
  },
  {
    question: '¿En qué tribunal se demanda por despido u otras materias laborales individuales?',
    answer:
      'En regla general, las demandas laborales individuales se tramitan ante los Juzgados de Letras del Trabajo que correspondan según competencia territorial y materia. La vía exacta y el momento procesal dependen de tu situación y de si hay mediación o comparendo previo.',
  },
  {
    question: '¿Cuál es la diferencia entre tutela laboral y nulidad del despido?',
    answer:
      'La nulidad del despido ataca la validez del término del contrato cuando hay vicios que la ley permite sanear o declarar sin efecto bajo requisitos probatorios. La tutela de derechos fundamentales protege libertades y garantías básicas vulneradas (por ejemplo, en contextos de acoso o discriminación), con efectos y remedios que el tribunal define según hechos y prueba. No son intercambiables: tu abogado indica cuál vía —o ambas— conviene evaluar.',
  },
  {
    question: '¿Cuánto puede durar la investigación interna por Ley Karin en la empresa?',
    answer:
      'La Ley 21.643 establece un plazo máximo de 30 días hábiles para concluir la investigación, con posibilidad de ampliación en supuestos calificados en la propia ley. Si el protocolo de tu empleador no respetó plazos o garantías, puede influir en la estrategia; en la consulta se revisan cartas, respuestas y actas.',
  },
  {
    question: '¿El comparendo de conciliación sustituye la demanda laboral?',
    answer:
      'No. El comparendo ante la Dirección del Trabajo es una etapa de conciliación con ritos propios; no reemplaza una demanda ante el Juzgado de Letras del Trabajo. Sirve para explorar acuerdo y, si no hay convenio, tu abogado proyecta la demanda conforme a plazos y competencia.',
  },
]
