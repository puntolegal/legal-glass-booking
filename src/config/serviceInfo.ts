// RUTA: src/config/serviceInfo.ts
// Información contextual específica por servicio para el agendamiento

import { Heart, Briefcase, Home, FileText, Shield, Calculator, Globe, DollarSign, Scale, Building2, Users } from 'lucide-react';

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
    title: 'Consulta General',
    subtitle: 'Asesoría Legal Integral',
    description: 'Consulta jurídica integral en múltiples áreas del derecho. Ideal para casos que requieren orientación inicial o asesoría en múltiples materias.',
    benefits: [
      '1 sesión consulta con abogado especialista.',
      'Análisis completo de tu situación legal.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
    ],
    testimonial: {
      quote: 'Me ayudaron a entender mi situación legal y me dieron claridad sobre qué hacer. Profesionales y eficientes.',
      author: 'María González',
      location: 'Providencia, Santiago',
      initials: 'MG'
    },
    icon: Scale,
    duration: '60 minutos',
    deliverable: 'PDF + asesoría'
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
    subtitle: 'Protección de Derechos Laborales',
    description: 'Asesoría especializada en derecho laboral. Protección ante vulneraciones de derechos fundamentales, despidos injustificados y asesoría Ley Karin.',
    benefits: [
      '1 sesión consulta con abogado especialista en derecho laboral.',
      'Análisis de tu situación laboral y derechos vulnerados.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
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
    subtitle: 'Redacción Express de Contratos',
    description: 'Consulta especializada en contratos. Redacción express de contratos de servicios, NDA, licencias y franquicias.',
    benefits: [
      '1 sesión consulta con abogado especialista en contratos.',
      'Revisión y redacción de contratos personalizados.',
      'Plan de acción detallado en un PDF adaptado a tu caso.',
      'El 100% del valor se abona a tu plan contratado.'
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
