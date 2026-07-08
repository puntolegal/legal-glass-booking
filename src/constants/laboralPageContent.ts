export type LaboralFaqItem = {
  question: string
  answer: string
}

export const LABORAL_FAQ_ITEMS: LaboralFaqItem[] = [
  {
    question: '¿En cuánto tiempo puedo demandar tras un despido?',
    answer:
      'En Chile tienes 60 días hábiles desde la separación para presentar la demanda por despido injustificado, indebido o improcedente ante el Juzgado de Letras del Trabajo.',
  },
  {
    question: '¿Cuánto cuesta iniciar el caso?',
    answer:
      'El diagnóstico laboral inicial (despido, finiquito y tutela de derechos) es gratuito: primera sesión sin costo cuando corresponde, y si asumimos el caso a porcentaje pagas honorarios solo si recuperas. Otras vías tienen tarifa publicada: defensa Ley Karin (Ley 21.643) desde $79.000 y comparendo de conciliación en la Región Metropolitana desde $35.000. Todas las tarifas se muestran antes de pagar en la sección de planes.',
  },
  {
    question: '¿La consulta es online o presencial?',
    answer:
      'La consulta es 100% telemática por Google Meet. Un abogado especialista te contactará para coordinar la reunión online dentro de las próximas horas hábiles.',
  },
  {
    question: '¿Qué documentos necesito?',
    answer:
      'Idealmente tu contrato de trabajo, últimas liquidaciones de sueldo, carta de despido (si la hubo) y cualquier comunicación relevante con el empleador. Si no los tienes todos, igual podemos avanzar.',
  },
  {
    question: '¿Qué indemnizaciones puedo reclamar?',
    answer:
      'Dependiendo del caso: indemnización por años de servicio, sustitutiva del aviso previo, feriado proporcional, recargos legales (30%, 50% u 80%) y, en casos graves, tutela de derechos fundamentales.',
  },
]
