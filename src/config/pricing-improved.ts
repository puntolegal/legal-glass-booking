// ESTRUCTURA DE PRECIOS MEJORADA Y OPTIMIZADA PARA CONVERSIÓN
// Basada en auditoría de valor real y mejores prácticas de pricing

export interface ImprovedServicePricing {
  id: string;
  title: string;
  price: number;
  originalPrice: number; // Precio de ancla para mostrar descuento
  currency: string;
  description: string;
  duration?: string;
  features: string[];
  category: 'express' | 'specialized' | 'premium';
  valueMetrics: {
    timesSaved?: string;
    potentialRecovery?: string;
    successRate?: string;
    roi?: string;
  };
  urgency?: {
    spotsLeft?: number;
    expiresIn?: string;
  };
}

export const IMPROVED_PRICING: ImprovedServicePricing[] = [
  // ===== SERVICIOS LABORALES =====
  {
    id: 'laboral-consulta',
    title: 'Consulta Laboral Especializada',
    price: 80000,
    originalPrice: 150000,
    currency: 'CLP',
    description: 'Análisis completo de tu situación laboral con estrategia legal',
    duration: '1 hora',
    category: 'specialized',
    features: [
      'Revisión exhaustiva de tu caso',
      'Análisis de documentos laborales',
      'Estrategia legal personalizada',
      'Cálculo de posibles indemnizaciones',
      'Plan de acción paso a paso'
    ],
    valueMetrics: {
      timesSaved: '40 horas de investigación legal',
      successRate: '87% en casos similares',
      roi: 'Recuperación promedio: $3.2M'
    }
  },
  {
    id: 'despido-injustificado',
    title: 'Defensa por Despido Injustificado',
    price: 150000,
    originalPrice: 350000,
    currency: 'CLP',
    description: 'Recupera TODAS las indemnizaciones que te corresponden',
    duration: 'Proceso completo',
    category: 'premium',
    features: [
      'Análisis de causa de despido',
      'Cálculo exacto de indemnizaciones',
      'Negociación con empleador',
      'Representación judicial si es necesario',
      'Todas las audiencias incluidas',
      'Seguimiento hasta cobro efectivo'
    ],
    valueMetrics: {
      potentialRecovery: 'Hasta $8.5M recuperados',
      timesSaved: '6 meses de trámites',
      successRate: '89% casos ganados',
      roi: '35x en promedio'
    },
    urgency: {
      spotsLeft: 3,
      expiresIn: '72 horas'
    }
  },
  {
    id: 'tutela-derechos-laborales',
    title: 'Tutela de Derechos Fundamentales',
    price: 200000,
    originalPrice: 450000,
    currency: 'CLP',
    description: 'Protección judicial ante vulneración de derechos',
    duration: 'Proceso completo + seguimiento',
    category: 'premium',
    features: [
      'Análisis de vulneración de derechos',
      'Procedimiento de tutela laboral',
      'Solicitud de indemnizaciones',
      'Representación en todas las instancias',
      'Medidas cautelares urgentes',
      'Garantía de reposición o indemnización máxima'
    ],
    valueMetrics: {
      potentialRecovery: 'Hasta 11 meses de sueldo',
      successRate: '92% favorable al trabajador',
      timesSaved: '4-6 meses vs procedimiento ordinario'
    }
  },

  // ===== SERVICIOS CORPORATIVOS =====
  {
    id: 'corporativo-consulta',
    title: 'Asesoría Corporativa Especializada',
    price: 120000,
    originalPrice: 250000,
    currency: 'CLP',
    description: 'Consulta estratégica para decisiones empresariales críticas',
    duration: '1.5 horas',
    category: 'specialized',
    features: [
      'Análisis de situación corporativa',
      'Revisión de estructura legal',
      'Identificación de riesgos',
      'Recomendaciones estratégicas',
      'Plan de implementación'
    ],
    valueMetrics: {
      potentialRecovery: 'Evita pérdidas de $5M+',
      timesSaved: '80 horas de investigación',
      successRate: '94% clientes satisfechos'
    }
  },
  {
    id: 'constitucion-sociedades',
    title: 'Constitución de Sociedades',
    price: 280000,
    originalPrice: 550000,
    currency: 'CLP',
    description: 'Tu empresa lista para operar en 5 días hábiles',
    duration: '5-7 días hábiles',
    category: 'express',
    features: [
      'Asesoría en tipo de sociedad óptima',
      'Redacción de estatutos',
      'Inscripción en Registro de Comercio',
      'Publicación en Diario Oficial',
      'Obtención de RUT empresarial',
      'Timbraje de documentos tributarios',
      '1 año de asesoría post-constitución'
    ],
    valueMetrics: {
      timesSaved: '3 semanas vs trámite personal',
      successRate: '100% aprobación SII',
      roi: 'Ahorro $180k en errores comunes'
    }
  },
  {
    id: 'compliance-empresarial',
    title: 'Compliance Empresarial Integral',
    price: 350000,
    originalPrice: 800000,
    currency: 'CLP',
    description: 'Protege tu empresa de sanciones millonarias',
    duration: 'Auditoría + implementación',
    category: 'premium',
    features: [
      'Auditoría legal completa',
      'Modelo de prevención de delitos Ley 20.393',
      'Políticas y procedimientos',
      'Capacitación al equipo',
      'Canal de denuncias',
      'Certificación de cumplimiento'
    ],
    valueMetrics: {
      potentialRecovery: 'Evita multas de hasta $18M',
      successRate: '98% aprobación auditorías',
      roi: 'Reduce riesgo legal 85%'
    }
  },

  // ===== SERVICIOS INMOBILIARIOS =====
  {
    id: 'inmobiliario-consulta',
    title: 'Consulta Inmobiliaria Especializada',
    price: 90000,
    originalPrice: 180000,
    currency: 'CLP',
    description: 'Protege tu inversión inmobiliaria más importante',
    duration: '1 hora',
    category: 'specialized',
    features: [
      'Revisión de títulos de dominio',
      'Análisis de prohibiciones y gravámenes',
      'Evaluación de riesgos legales',
      'Recomendaciones para la transacción',
      'Lista de documentos necesarios'
    ],
    valueMetrics: {
      potentialRecovery: 'Evita pérdidas de $8M+',
      timesSaved: '30 horas de trámites',
      successRate: '96% transacciones exitosas'
    }
  },
  {
    id: 'tramite-inmobiliario-completo',
    title: 'Tramitación Inmobiliaria Completa',
    price: 380000,
    originalPrice: 750000,
    currency: 'CLP',
    description: 'Compra/venta segura de principio a fin',
    duration: 'Proceso completo',
    category: 'premium',
    features: [
      'Due diligence completa',
      'Redacción de promesa de compraventa',
      'Gestión de escrituras',
      'Tramitación de hipotecas',
      'Inscripción en Conservador de Bienes Raíces',
      'Entrega de propiedad',
      'Seguimiento post-venta 3 meses'
    ],
    valueMetrics: {
      potentialRecovery: 'Inversión protegida 100%',
      timesSaved: '12 semanas vs autogestión',
      successRate: '99% sin problemas legales'
    }
  },

  // ===== SERVICIOS SUCESORIOS =====
  {
    id: 'sucesorio-consulta',
    title: 'Consulta de Herencias y Sucesiones',
    price: 120000,
    originalPrice: 240000,
    currency: 'CLP',
    description: 'Claridad total sobre tu herencia o sucesión',
    duration: '1.5 horas',
    category: 'specialized',
    features: [
      'Análisis de masa hereditaria',
      'Identificación de herederos',
      'Cálculo de legítimas',
      'Estrategia de tramitación',
      'Estimación de costos y plazos'
    ],
    valueMetrics: {
      potentialRecovery: 'Patrimonio familiar completo',
      timesSaved: '6 meses de confusión',
      successRate: '91% acuerdos familiares'
    }
  },
  {
    id: 'posesion-efectiva',
    title: 'Posesión Efectiva Completa',
    price: 450000,
    originalPrice: 900000,
    currency: 'CLP',
    description: 'Tramitación integral de tu herencia',
    duration: '3-6 meses',
    category: 'premium',
    features: [
      'Inventario de bienes',
      'Tramitación judicial o notarial',
      'Liquidación de sociedad conyugal',
      'Partición de bienes',
      'Inscripciones de dominio',
      'Distribución final',
      'Asesoría tributaria incluida'
    ],
    valueMetrics: {
      potentialRecovery: 'Hasta $45M en herencias',
      timesSaved: '9 meses vs autogestión',
      successRate: '94% sin conflictos'
    }
  },

  // ===== SERVICIOS TRIBUTARIOS =====
  {
    id: 'tributario-consulta',
    title: 'Asesoría Tributaria Especializada',
    price: 150000,
    originalPrice: 320000,
    currency: 'CLP',
    description: 'Optimiza tu carga tributaria legalmente',
    duration: '1.5 horas',
    category: 'specialized',
    features: [
      'Análisis de situación tributaria',
      'Identificación de ahorros legales',
      'Revisión de declaraciones',
      'Estrategia de planificación',
      'Recomendaciones de compliance'
    ],
    valueMetrics: {
      potentialRecovery: 'Ahorro promedio $2.5M/año',
      successRate: '97% sin reparos SII',
      roi: '12x en optimización'
    }
  },
  {
    id: 'planificacion-tributaria',
    title: 'Planificación Tributaria Integral',
    price: 380000,
    originalPrice: 850000,
    currency: 'CLP',
    description: 'Minimiza tu carga fiscal todo el año',
    duration: 'Anual con revisiones trimestrales',
    category: 'premium',
    features: [
      'Estrategia tributaria anual',
      'Optimización de estructura',
      'Declaraciones mensuales',
      'Revisión de operaciones',
      'Defensa ante SII',
      '4 revisiones trimestrales'
    ],
    valueMetrics: {
      potentialRecovery: 'Ahorro $8M+ anual',
      timesSaved: '200 horas/año',
      roi: '18x inversión inicial'
    }
  },
  {
    id: 'defensa-tributaria',
    title: 'Defensa Tributaria Completa',
    price: 650000,
    originalPrice: 1500000,
    currency: 'CLP',
    description: 'Representación experta ante el SII',
    duration: 'Hasta resolución final',
    category: 'premium',
    features: [
      'Análisis de fiscalización',
      'Estrategia de defensa',
      'Presentaciones ante SII',
      'Recursos administrativos',
      'Reclamación judicial si necesario',
      'Negociación de facilidades',
      'Seguimiento completo'
    ],
    valueMetrics: {
      potentialRecovery: 'Reducción multas 65%',
      successRate: '83% resolución favorable',
      roi: 'Ahorro promedio $12M'
    }
  },

  // ===== SERVICIOS EXPRESS =====
  {
    id: 'contratos-express-mejorado',
    title: 'Contratos Express Premium',
    price: 60000,
    originalPrice: 120000,
    currency: 'CLP',
    description: 'Contratos profesionales en 24-48 horas',
    duration: '24-48 horas',
    category: 'express',
    features: [
      'Redacción profesional',
      'Revisión de cláusulas críticas',
      'Adaptación a tu caso específico',
      'Asesoría en negociación',
      'Documento listo para firmar',
      '1 revisión adicional incluida'
    ],
    valueMetrics: {
      timesSaved: '5 días de trabajo',
      successRate: '99% contratos válidos',
      roi: 'Evita litigios costosos'
    }
  },
  {
    id: 'marcas-patentes-mejorado',
    title: 'Registro de Marcas y Patentes',
    price: 180000,
    originalPrice: 380000,
    currency: 'CLP',
    description: 'Protege tu propiedad intelectual',
    duration: '7-10 días hábiles + seguimiento',
    category: 'express',
    features: [
      'Búsqueda exhaustiva de disponibilidad',
      'Análisis de viabilidad',
      'Redacción de solicitud estratégica',
      'Presentación ante INAPI',
      'Seguimiento completo del trámite',
      'Respuesta a observaciones',
      'Notificación de resolución'
    ],
    valueMetrics: {
      potentialRecovery: 'Protege activo valorado en $25M+',
      timesSaved: '6 meses vs trámite personal',
      successRate: '91% aprobación INAPI'
    }
  },
  {
    id: 'reclamos-sernac-mejorado',
    title: 'Reclamos SERNAC Pro',
    price: 45000,
    originalPrice: 90000,
    currency: 'CLP',
    description: 'Gestión profesional de tu reclamo',
    duration: '5-7 días hábiles',
    category: 'express',
    features: [
      'Análisis de viabilidad del caso',
      'Redacción técnica del reclamo',
      'Presentación formal ante SERNAC',
      'Seguimiento de respuesta',
      'Asesoría en próximos pasos',
      'Orientación para juicio si aplica'
    ],
    valueMetrics: {
      potentialRecovery: 'Resoluciones $50k-$2M',
      timesSaved: '3 semanas de trámites',
      successRate: '78% resolución favorable'
    }
  }
];

// Función helper para obtener precios por categoría
export const getPricingByCategory = (category: 'express' | 'specialized' | 'premium') => {
  return IMPROVED_PRICING.filter(service => service.category === category);
};

// Función helper para calcular descuento
export const getDiscountPercentage = (serviceId: string): number => {
  const service = IMPROVED_PRICING.find(s => s.id === serviceId);
  if (!service) return 0;
  
  const discount = ((service.originalPrice - service.price) / service.originalPrice) * 100;
  return Math.round(discount);
};

// Formato de precio con descuento
export const formatPriceWithDiscount = (serviceId: string): { 
  current: string; 
  original: string; 
  discount: number;
  savings: string;
} => {
  const service = IMPROVED_PRICING.find(s => s.id === serviceId);
  if (!service) return { current: '', original: '', discount: 0, savings: '' };
  
  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return {
    current: formatter.format(service.price),
    original: formatter.format(service.originalPrice),
    discount: getDiscountPercentage(serviceId),
    savings: formatter.format(service.originalPrice - service.price)
  };
};
