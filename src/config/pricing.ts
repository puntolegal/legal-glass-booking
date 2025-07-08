export interface ServicePricing {
  id: string;
  title: string;
  price: number;
  currency: string;
  description: string;
  duration?: string;
  features?: string[];
  category: 'express' | 'specialized';
}

export const SERVICE_PRICING: ServicePricing[] = [
  // Servicios Express
  {
    id: 'contratos-express',
    title: 'Contratos Express',
    price: 25000,
    currency: 'CLP',
    description: 'Revisión y redacción de contratos laborales',
    duration: '24-48 horas',
    category: 'express',
    features: [
      'Revisión completa del contrato',
      'Redacción de cláusulas específicas',
      'Asesoría legal personalizada',
      'Documento listo para firmar'
    ]
  },
  {
    id: 'sociedades-express',
    title: 'Sociedades Express',
    price: 45000,
    currency: 'CLP',
    description: 'Constitución de sociedades comerciales',
    duration: '3-5 días hábiles',
    category: 'express',
    features: [
      'Constitución de sociedad',
      'Redacción de estatutos',
      'Inscripción en Registro de Comercio',
      'Obtención de RUT empresarial'
    ]
  },
  {
    id: 'marcas-patentes',
    title: 'Marcas & Patentes',
    price: 35000,
    currency: 'CLP',
    description: 'Registro de marcas comerciales y patentes',
    duration: '7-10 días hábiles',
    category: 'express',
    features: [
      'Búsqueda de disponibilidad',
      'Redacción de solicitud',
      'Presentación ante INAPI',
      'Seguimiento del trámite'
    ]
  },
  {
    id: 'reclamos-sernac',
    title: 'Reclamos SERNAC',
    price: 15000,
    currency: 'CLP',
    description: 'Gestión de reclamos ante SERNAC',
    duration: '5-7 días hábiles',
    category: 'express',
    features: [
      'Análisis del caso',
      'Redacción del reclamo',
      'Presentación ante SERNAC',
      'Seguimiento de la respuesta'
    ]
  },

  // Servicios Especializados
  {
    id: 'laboral',
    title: 'Derecho Laboral',
    price: 35000,
    currency: 'CLP',
    description: 'Asesoría completa en derecho laboral',
    duration: '1 hora',
    category: 'specialized',
    features: [
      'Análisis de situación laboral',
      'Asesoría sobre derechos',
      'Estrategia legal personalizada',
      'Documentos de respaldo'
    ]
  },
  {
    id: 'corporativo',
    title: 'Derecho Corporativo',
    price: 50000,
    currency: 'CLP',
    description: 'Asesoría en derecho corporativo y empresarial',
    duration: '1.5 horas',
    category: 'specialized',
    features: [
      'Análisis corporativo',
      'Estructuración legal',
      'Compliance empresarial',
      'Documentación corporativa'
    ]
  },
  {
    id: 'familia',
    title: 'Derecho de Familia',
    price: 40000,
    currency: 'CLP',
    description: 'Asesoría en derecho de familia',
    duration: '1 hora',
    category: 'specialized',
    features: [
      'Análisis de situación familiar',
      'Asesoría en divorcios',
      'Custodia y alimentos',
      'Acuerdos familiares'
    ]
  },
  {
    id: 'herencias',
    title: 'Herencias',
    price: 45000,
    currency: 'CLP',
    description: 'Gestión de herencias y sucesiones',
    duration: '1.5 horas',
    category: 'specialized',
    features: [
      'Análisis de herencia',
      'Gestión de sucesión',
      'Documentación necesaria',
      'Seguimiento del proceso'
    ]
  },
  {
    id: 'proteccion-datos',
    title: 'Protección de Datos',
    price: 30000,
    currency: 'CLP',
    description: 'Cumplimiento de Ley de Protección de Datos',
    duration: '1 hora',
    category: 'specialized',
    features: [
      'Auditoría de datos',
      'Políticas de privacidad',
      'Cumplimiento legal',
      'Documentación requerida'
    ]
  },
  {
    id: 'ecommerce-compliance',
    title: 'E-Commerce Compliance',
    price: 40000,
    currency: 'CLP',
    description: 'Cumplimiento legal para comercio electrónico',
    duration: '1.5 horas',
    category: 'specialized',
    features: [
      'Análisis de plataforma',
      'Términos y condiciones',
      'Políticas de devolución',
      'Cumplimiento SII'
    ]
  }
];

export const getServicePricing = (serviceId: string): ServicePricing | undefined => {
  return SERVICE_PRICING.find(service => service.id === serviceId);
};

export const formatPrice = (price: number, currency: string = 'CLP'): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}; 