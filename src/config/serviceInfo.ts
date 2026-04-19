// RUTA: src/config/serviceInfo.ts
// Información contextual específica por servicio para el agendamiento.
// SINCRONIZADO con ServicesSection.tsx y serviceCatalog.

import {
  Heart,
  Briefcase,
  Home,
  FileText,
  Shield,
  Calculator,
  Globe,
  DollarSign,
  Scale,
  Building2,
  Users,
  Award,
  Banknote,
  FileSignature,
  Gavel,
  Landmark,
  Plane,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  Stamp,
} from 'lucide-react';

export interface ServiceInfo {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  testimonial?: {
    quote: string;
    author: string;
    location: string;
    initials: string;
  };
  icon: any;
  duration: string;
  deliverable: string;
}

export const serviceInfoMap: Record<string, ServiceInfo> = {
  'general': {
    title: 'Consulta Legal General',
    subtitle: 'Orientación legal inicial',
    description: 'Sesión con un abogado especialista para diagnosticar tu caso, definir la estrategia y entregarte un plan de acción claro. Si decides contratar un servicio específico, descontamos el valor de esta consulta.',
    benefits: [
      '45 minutos con abogado especialista por Google Meet.',
      'Diagnóstico claro de tu situación legal.',
      'Plan de acción por escrito (PDF) adaptado a tu caso.',
      'El valor se descuenta si contratas un plan posterior.'
    ],
    testimonial: {
      quote: 'Me ayudaron a entender mi situación legal y me dieron claridad sobre qué hacer.',
      author: 'María González',
      location: 'Providencia, Santiago',
      initials: 'MG'
    },
    icon: Scale,
    duration: '45 minutos',
    deliverable: 'PDF + asesoría'
  },

  // ===== Tutela Laboral GRATIS (lead magnet) =====
  'tutela-laboral': {
    title: 'Punto Legal Tutela Laboral',
    subtitle: 'Diagnóstico gratuito',
    description: 'Si te despidieron sin justificación, sufriste acoso laboral o creemos que te calcularon mal el finiquito, evaluamos tu caso gratis. Si tiene mérito, lo tomamos a porcentaje: pagas sólo si recuperamos.',
    benefits: [
      'Diagnóstico gratuito de tu caso por Google Meet.',
      'Cálculo real de tu indemnización por despido.',
      'Evaluación de tutela laboral, Ley Karin y nulidad del despido.',
      'Honorarios sólo si recuperas (cobro a porcentaje).'
    ],
    testimonial: {
      quote: 'Gracias a Punto Legal conseguí una indemnización de 18 millones. Chao jefe.',
      author: 'Felipe R.',
      location: 'Maipú, Santiago',
      initials: 'FR'
    },
    icon: Scale,
    duration: '45 minutos',
    deliverable: 'Diagnóstico + estrategia'
  },

  // ===== Empresas — laborales =====
  'comparendos': {
    title: 'Punto Legal Comparendos DT',
    subtitle: 'Comparendo Dirección del Trabajo',
    description: 'Te representamos en el comparendo de conciliación ante la Dirección del Trabajo. Calculamos riesgo real, preparamos posición y negociamos avenimientos que protejan a tu empresa.',
    benefits: [
      'Representación letrada en comparendo DT.',
      'Cálculo de contingencia laboral real.',
      'Negociación de avenimiento estratégico.',
      'Preparación de documentación y descargos.'
    ],
    testimonial: {
      quote: 'Cerramos el caso con un avenimiento muy por debajo de lo que pedía el trabajador. Excelente preparación.',
      author: 'Andrea Soto',
      location: 'Santiago Centro',
      initials: 'AS'
    },
    icon: Gavel,
    duration: '45 minutos',
    deliverable: 'Estrategia + representación'
  },
  'fiscalizaciones-dt': {
    title: 'Punto Legal Fiscalizaciones DT',
    subtitle: 'Defensa en fiscalización + multas',
    description: 'Te asistimos durante la fiscalización de la Dirección del Trabajo, presentamos descargos y solicitudes de reconsideración de multas. Recurrimos en sede laboral cuando corresponde.',
    benefits: [
      'Asistencia legal durante la fiscalización.',
      'Descargos formales ante la DT.',
      'Reconsideración administrativa de multas.',
      'Reclamación judicial en sede laboral.'
    ],
    testimonial: {
      quote: 'Lograron rebajar la multa en más de un 60% con la reconsideración.',
      author: 'Rodrigo Pinto',
      location: 'Las Condes, Santiago',
      initials: 'RP'
    },
    icon: ShieldAlert,
    duration: '45 minutos',
    deliverable: 'Estrategia + descargos'
  },
  'defensa-laboral-empresarial': {
    title: 'Punto Legal Defensa Empresarial',
    subtitle: 'Juicios laborales en tribunales',
    description: 'Asumimos la defensa de tu empresa en juicios por despido, tutela laboral, indemnizaciones y nulidad. Audiencia preparatoria, audiencia de juicio y ejecución cuando corresponde.',
    benefits: [
      'Defensa en audiencia preparatoria y de juicio.',
      'Estrategia conciliatoria o contenciosa según el caso.',
      'Cálculo de contingencia para provisión contable.',
      'Recursos de nulidad y unificación cuando corresponde.'
    ],
    testimonial: {
      quote: 'Ganamos en juicio un caso que parecía perdido. Sólida estrategia procesal.',
      author: 'Constanza Bravo',
      location: 'Providencia, Santiago',
      initials: 'CB'
    },
    icon: Briefcase,
    duration: '45 minutos',
    deliverable: 'Estrategia + defensa'
  },
  'ley-karin': {
    title: 'Punto Legal Ley Karin',
    subtitle: 'Protocolo + capacitación + defensa',
    description: 'Diseñamos e implementamos tu protocolo Ley Karin (Ley 21.643). Capacitamos a jefaturas y RRHH, y te asesoramos cuando llega una denuncia interna o ante la Dirección del Trabajo.',
    benefits: [
      'Diseño e implementación del protocolo.',
      'Capacitación a jefaturas y equipo de RRHH.',
      'Asesoría en investigación interna de denuncias.',
      'Defensa frente a la Dirección del Trabajo.'
    ],
    testimonial: {
      quote: 'Implementaron todo el protocolo y nos dejaron capacitados. Recomendados.',
      author: 'Marcela Ovalle',
      location: 'Vitacura, Santiago',
      initials: 'MO'
    },
    icon: ShieldCheck,
    duration: '45 minutos',
    deliverable: 'Protocolo + capacitación'
  },
  'cumplimiento': {
    title: 'Punto Legal Cumplimiento',
    subtitle: 'Modelo de prevención del delito',
    description: 'Diseñamos tu modelo de prevención del delito según Ley 20.393, programas de cumplimiento normativo y protocolos de protección de datos personales (Ley 19.628).',
    benefits: [
      'Modelo de prevención del delito Ley 20.393.',
      'Protección de datos personales Ley 19.628.',
      'Capacitación y protocolos internos.',
      'Auditoría de riesgos normativos.'
    ],
    testimonial: {
      quote: 'Excelente diseño del modelo de prevención. Quedamos listos para la certificación.',
      author: 'Lucía Sánchez',
      location: 'Vitacura, Santiago',
      initials: 'LS'
    },
    icon: ShieldCheck,
    duration: '45 minutos',
    deliverable: 'Modelo + protocolos'
  },
  'marcas': {
    title: 'Punto Legal Marcas',
    subtitle: 'Registro de marca en INAPI',
    description: 'Búsqueda de antecedentes, redacción de la solicitud y registro de marca ante INAPI. También te defendemos frente a oposiciones y resolvemos disputas por nombre comercial.',
    benefits: [
      'Búsqueda de antecedentes en INAPI.',
      'Redacción y presentación de la solicitud.',
      'Defensa frente a oposiciones de terceros.',
      'Asesoría en disputas por nombre comercial.'
    ],
    testimonial: {
      quote: 'Registramos la marca sin contratiempos. Muy buena gestión.',
      author: 'Valentina Castro',
      location: 'Providencia, Santiago',
      initials: 'VC'
    },
    icon: Award,
    duration: '45 minutos',
    deliverable: 'Solicitud + seguimiento'
  },

  // ===== Patrimonio nuevos =====
  'cobranza': {
    title: 'Punto Legal Cobranza',
    subtitle: 'Cobranza judicial y extrajudicial',
    description: 'Cobranza extrajudicial inicial y juicio ejecutivo de facturas, pagarés y cheques protestados. Embargamos bienes, ejecutamos garantías y te representamos en remates.',
    benefits: [
      'Cobranza extrajudicial inicial.',
      'Juicio ejecutivo y embargos.',
      'Ejecución de pagarés y cheques.',
      'Representación en remates.'
    ],
    testimonial: {
      quote: 'Recuperamos cinco facturas que dábamos por perdidas. Trabajo serio.',
      author: 'Pedro Henríquez',
      location: 'Maipú, Santiago',
      initials: 'PH'
    },
    icon: Banknote,
    duration: '45 minutos',
    deliverable: 'Estrategia + acción judicial'
  },
  'cae-tesoreria': {
    title: 'Punto Legal Defensa CAE',
    subtitle: 'Defensa frente a Tesorería',
    description: 'Defensa de deudores morosos del Crédito con Aval del Estado (CAE) frente a la Tesorería General de la República. Frenamos embargos, repactamos saldos y solicitamos rebajas o condonaciones.',
    benefits: [
      'Frenar embargo de la TGR.',
      'Repactación y plan de pago.',
      'Solicitud de rebajas y condonaciones.',
      'Defensa en sede administrativa y judicial.'
    ],
    testimonial: {
      quote: 'Frenaron mi embargo y logramos un plan de pago muy razonable.',
      author: 'Camilo Vergara',
      location: 'Ñuñoa, Santiago',
      initials: 'CV'
    },
    icon: Receipt,
    duration: '45 minutos',
    deliverable: 'Estrategia + tramitación'
  },

  // ===== Penal renombrado =====
  'penal': {
    title: 'Punto Legal Penal',
    subtitle: 'Defensa penal con litigantes',
    description: 'Asumimos defensas en delitos económicos, contra las personas y la propiedad. Negociamos suspensión condicional, acuerdos reparatorios y vamos a juicio oral cuando corresponde.',
    benefits: [
      'Defensa en juicio oral.',
      'Querellas y representación de víctimas.',
      'Suspensión condicional y acuerdos reparatorios.',
      'Salidas alternativas y procedimiento abreviado.'
    ],
    testimonial: {
      quote: 'Resolvieron mi caso con suspensión condicional. Profesionales y discretos.',
      author: 'Diego Reyes',
      location: 'Santiago Centro',
      initials: 'DR'
    },
    icon: Gavel,
    duration: '45 minutos',
    deliverable: 'Estrategia + defensa'
  },
  'familia': {
    title: 'Consulta Estratégica Familia',
    subtitle: 'Consulta Especializada',
    description: 'Agenda 1 hora de trabajo directo con tu abogado especialista para ordenar tu caso, definir un Plan de Acción claro y saber exactamente qué hacer en los próximos 30 días.',
    benefits: [
      '1 sesión consulta con abogado especialista.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'En 1 hora me dio más claridad que meses de incertidumbre. Valió cada peso.',
      author: 'Conztanza M.',
      location: 'Las Condes, Santiago',
      initials: 'CM'
    },
    icon: Heart,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'consulta-estrategica-familia': {
    title: 'Consulta Estratégica Familia',
    subtitle: 'Consulta Especializada',
    description: 'Agenda 1 hora de trabajo directo con tu abogado especialista para ordenar tu caso, definir un Plan de Acción claro y saber exactamente qué hacer en los próximos 30 días.',
    benefits: [
      '1 sesión consulta con abogado especialista.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'En 1 hora me dio más claridad que meses de incertidumbre. Valió cada peso.',
      author: 'Conztanza M.',
      location: 'Las Condes, Santiago',
      initials: 'CM'
    },
    icon: Heart,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'corporativo': {
    title: 'Asesoría Corporativa',
    subtitle: 'Consulta Especializada',
    description: 'Consulta especializada en derecho corporativo para empresas. Análisis de estructura societaria, compliance y estrategias legales para tu negocio.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho corporativo.',
      'Análisis de estructura societaria y recomendaciones.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Excelente asesoría corporativa. Nos ayudaron a estructurar nuestra empresa de manera óptima.',
      author: 'Roberto Silva',
      location: 'Las Condes, Santiago',
      initials: 'RS'
    },
    icon: Building2,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'laboral': {
    title: 'Punto Legal Laboral',
    subtitle: 'Protección de derechos laborales',
    description: 'Asesoría en derecho laboral: despido injustificado, tutela laboral, Ley Karin, finiquitos y nulidad del despido. Si tu caso califica, lo derivamos al diagnóstico gratuito de Tutela Laboral.',
    benefits: [
      'Sesión con abogado especialista en derecho laboral.',
      'Cálculo real de tu indemnización.',
      'Estrategia para tutela laboral o nulidad del despido.',
      'Plan de acción por escrito (PDF) adaptado a tu caso.'
    ],
    testimonial: {
      quote: 'Me ayudaron a recuperar lo que me correspondía después de un despido injustificado. Profesionales y comprometidos.',
      author: 'Patricia Ramírez',
      location: 'Ñuñoa, Santiago',
      initials: 'PR'
    },
    icon: Briefcase,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'inmobiliario': {
    title: 'Punto Legal Inmobiliario',
    subtitle: 'Asesoría Inmobiliaria Especializada',
    description: 'Consulta especializada en derecho inmobiliario. Asesoría en compraventas, arrendamientos, desalojos y litigios inmobiliarios.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho inmobiliario.',
      'Revisión de contratos y documentación inmobiliaria.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Excelente asesoría en la compra de mi departamento. Todo salió perfecto gracias a su orientación.',
      author: 'Fernando Torres',
      location: 'Vitacura, Santiago',
      initials: 'FT'
    },
    icon: Home,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'sucesorio': {
    title: 'Punto Legal Sucesorio',
    subtitle: 'Gestión de Herencias y Sucesiones',
    description: 'Asesoría especializada en herencias y sucesiones. Gestión completa de testamentos, posesión efectiva y particiones.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho sucesorio.',
      'Análisis de documentación sucesoria y derechos hereditarios.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Nos ayudaron a resolver la sucesión de manera ordenada y sin conflictos familiares.',
      author: 'Carmen López',
      location: 'La Reina, Santiago',
      initials: 'CL'
    },
    icon: FileText,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'empresarial': {
    title: 'Punto Legal Empresarial',
    subtitle: 'Asesoría Empresarial Integral',
    description: 'Consulta especializada en derecho empresarial. Constitución de sociedades, modificaciones estatutarias y compliance corporativo.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho empresarial.',
      'Análisis de estructura empresarial y recomendaciones.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Profesionales y eficientes. Nos ayudaron a constituir nuestra empresa de manera correcta.',
      author: 'Andrés Martínez',
      location: 'Providencia, Santiago',
      initials: 'AM'
    },
    icon: Building2,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'tributario': {
    title: 'Punto Legal Tributario',
    subtitle: 'Asesoría Fiscal Especializada',
    description: 'Consulta especializada en derecho tributario. Asesoría fiscal, planificación tributaria y recursos contra liquidaciones del SII.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho tributario.',
      'Análisis de situación tributaria y optimización fiscal.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Me ayudaron a resolver un problema tributario complejo. Excelente servicio y conocimiento técnico.',
      author: 'Jorge Fernández',
      location: 'Las Condes, Santiago',
      initials: 'JF'
    },
    icon: Calculator,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'compliance': {
    title: 'Punto Legal Compliance',
    subtitle: 'Programas de Cumplimiento',
    description: 'Consulta especializada en compliance y gestión de riesgos. Programas de cumplimiento, políticas internas y auditorías corporativas.',
    benefits: [
      '1 sesión consulta con abogado especialista en compliance.',
      'Análisis de riesgos y recomendaciones de cumplimiento.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Excelente asesoría en compliance. Nos ayudaron a estructurar nuestros programas de cumplimiento.',
      author: 'Lucía Sánchez',
      location: 'Vitacura, Santiago',
      initials: 'LS'
    },
    icon: Shield,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'penal-economico': {
    title: 'Punto Legal Penal Económico',
    subtitle: 'Defensa Penal Especializada',
    description: 'Consulta especializada en derecho penal económico. Defensa en delitos económicos, societarios y acuerdos de colaboración eficaz.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho penal económico.',
      'Análisis de situación penal y estrategia de defensa.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Profesionales y comprometidos. Me ayudaron a resolver un caso penal económico complejo.',
      author: 'Miguel Rodríguez',
      location: 'Providencia, Santiago',
      initials: 'MR'
    },
    icon: DollarSign,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'contratos': {
    title: 'Punto Legal Contratos',
    subtitle: 'Redacción y revisión en 24 horas',
    description: 'Redactamos y revisamos contratos civiles y comerciales con cláusulas claras: servicios, acuerdos de confidencialidad, licencias y franquicias.',
    benefits: [
      'Sesión con abogado especialista en contratos.',
      'Redacción a medida o revisión en 24 horas.',
      'Plan de acción por escrito (PDF) con cláusulas críticas.',
      'El valor se descuenta si contratas un plan posterior.'
    ],
    testimonial: {
      quote: 'Rápido y eficiente. Me ayudaron a redactar un contrato profesional en tiempo récord.',
      author: 'Ana Morales',
      location: 'Ñuñoa, Santiago',
      initials: 'AM'
    },
    icon: FileText,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'administracion-publica': {
    title: 'Punto Legal Administración Pública',
    subtitle: 'Defensa Administrativa',
    description: 'Consulta especializada en derecho administrativo. Impugnación de multas, recursos administrativos y defensa en fiscalizaciones.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho administrativo.',
      'Análisis de multas y recursos administrativos.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Me ayudaron a impugnar una multa injusta. Excelente conocimiento del derecho administrativo.',
      author: 'Carlos Vega',
      location: 'Maipú, Santiago',
      initials: 'CV'
    },
    icon: Shield,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'migratorio': {
    title: 'Punto Legal Migratorio',
    subtitle: 'Asesoría Migratoria',
    description: 'Consulta especializada en derecho migratorio. Visas de trabajo y residencia, reagrupación familiar y recursos migratorios.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho migratorio.',
      'Análisis de situación migratoria y opciones disponibles.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Excelente asesoría migratoria. Me ayudaron a obtener mi visa de trabajo sin problemas.',
      author: 'Diego Herrera',
      location: 'Santiago Centro',
      initials: 'DH'
    },
    icon: Globe,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'propiedad-intelectual': {
    title: 'Punto Legal Propiedad Intelectual',
    subtitle: 'Protección de Creaciones',
    description: 'Consulta especializada en propiedad intelectual. Registro de marcas y patentes, derechos de autor y defensa contra infracciones.',
    benefits: [
      '1 sesión consulta con abogado especialista en propiedad intelectual.',
      'Análisis de protección de marcas y patentes.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Me ayudaron a registrar mi marca correctamente. Profesionales y conocedores del tema.',
      author: 'Valentina Castro',
      location: 'Providencia, Santiago',
      initials: 'VC'
    },
    icon: FileText,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  },
  'consumidor': {
    title: 'Punto Legal Consumidor',
    subtitle: 'Protección del Consumidor',
    description: 'Consulta especializada en derecho del consumidor. Reclamos ante SERNAC, defensa en juicios y asesoría en cláusulas abusivas.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho del consumidor.',
      'Análisis de reclamos y derechos como consumidor.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Me ayudaron a resolver un reclamo ante SERNAC exitosamente. Excelente servicio.',
      author: 'Paula Jiménez',
      location: 'La Florida, Santiago',
      initials: 'PJ'
    },
    icon: Users,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
  }
};

// Función helper para obtener información del servicio
export const getServiceInfo = (plan: string): ServiceInfo => {
  return serviceInfoMap[plan] || serviceInfoMap['general'];
};
