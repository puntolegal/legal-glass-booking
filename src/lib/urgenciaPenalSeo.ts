import { siteUrl } from '@/config/siteUrl';

export const URGENCIA_CANONICAL_URL = siteUrl('/urgencia');

export const URGENCIA_SEO_TITLE =
  '¿Familiar detenido? Abogado penal urgente RM oriente | Punto Legal Chile';

export const URGENCIA_SEO_DESCRIPTION =
  '¿Tu familiar está detenido? Coordinación prioritaria con abogado penal para detención y control de detención en la Región Metropolitana, foco sector oriente (Las Condes, Providencia, Ñuñoa, Vitacura, Lo Barnechea, La Florida y cercanas). En pocos pasos dejas tus datos; la presencia en comisaría depende del caso y la disponibilidad del equipo.';

export const URGENCIA_SEO_KEYWORDS =
  'familiar detenido abogado, abogado penal urgente Santiago, Ley Emilia abogado, control de detención RM, delito sexual abogado urgencia, orden detención PDI abogado, drogas sintéticas defensa, VIF detención abogado, alcoholemia abogado, desórdenes públicos defensa, defensa penal Las Condes, abogado comisaría Providencia, Punto Legal Chile';

export const URGENCIA_FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question:
      '¿Atienden detenciones o controles de detención en Las Condes, Providencia, Ñuñoa, Vitacura, Lo Barnechea y La Florida?',
    answer:
      'Sí. Recibimos consultas de urgencia desde esas comunas y desde toda la Región Metropolitana. La coordinación concreta depende de la disponibilidad del equipo, de los plazos del procedimiento y de la información que aportes sobre la unidad o tribunal involucrado.',
  },
  {
    question: '¿Cuándo me contactan después de dejar mis datos?',
    answer:
      'Priorizamos el primer contacto lo antes posible en situaciones de urgencia. El canal (por ejemplo WhatsApp) y los plazos exactos se confirman al avanzar en el formulario o al completar el pago, según corresponda.',
  },
  {
    question: '¿El análisis en pantalla es lo que decidirá el juez o la Fiscalía?',
    answer:
      'No. Lo que ves es una simulación orientativa con los datos que ingresas, para ayudarte a ordenar la situación. Las medidas cautelares y las decisiones procesales las adopta el tribunal y la Fiscalía según las reglas legales y los antecedentes del expediente.',
  },
  {
    question: '¿Qué tipo de causas cubre esta vía de urgencia?',
    answer:
      'Está pensada para contextos de detención o riesgo inminente de formalización en flagrancia, con foco en situaciones como accidente de tránsito (Ley Emilia / lesiones graves), delitos sexuales o abuso, orden de detención (PDI, aeropuerto), ley de drogas en contexto de sintéticas o fiestas, violencia intrafamiliar (VIF), conducción en estado de ebriedad (caso simple), desórdenes o altercado público, y otras urgencias penales afines. El encargo concreto y el monto orientativo se ajustan al motivo indicado y a los hechos que cuentes.',
  },
  {
    question: '¿La atención puede ser presencial en la comisaría?',
    answer:
      'La modalidad (remota o presencial) y el desplazamiento se coordinan caso a caso, según la urgencia, la ubicación y lo que permita el procedimiento. No garantizamos un resultado ni un formato de actuación sin conocer los antecedentes.',
  },
  {
    question: '¿Para qué usan mi teléfono y los datos de contacto?',
    answer:
      'Para contactarte en relación con tu consulta de urgencia, coordinar la atención y, si contratas el servicio, las comunicaciones propias del encargo. Si completas el flujo con WhatsApp válido, puede generarse un correo técnico interno asociado a tu número para la pasarela de pago y el registro del lead, sin que tengas que escribir un email en el formulario. El tratamiento se rige por nuestra política de privacidad y por la normativa aplicable.',
  },
  {
    question: 'Busqué “abogado penal” tras una detención: ¿esto es orientación o patrocinio?',
    answer:
      'Este canal sirve para priorizar el primer contacto y, si corresponde, contratar una intervención de urgencia. El alcance del patrocinio (qué actuaciones incluye) se define por escrito según el caso; no anticipamos resultados ni decisiones del tribunal.',
  },
  {
    question: '¿Pueden ayudarme si la detención fue en otra comuna de la RM fuera del oriente?',
    answer:
      'Sí. Atendemos consultas desde toda la Región Metropolitana. La viabilidad de desplazamiento o actuación concreta depende de la urgencia, de los plazos procesales y de la información que entregues sobre la unidad o el tribunal.',
  },
  {
    question: '¿Qué debo tener a mano al contactarlos por una urgencia penal?',
    answer:
      'Si puedes, indica unidad o comisaría, identificación del detenido, antecedentes generales del hecho y el plazo aproximado en retén. Nada de lo que ingreses en el formulario reemplaza la revisión documental que haga el abogado al asumir el encargo.',
  },
];

export function buildUrgenciaFaqJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: URGENCIA_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
