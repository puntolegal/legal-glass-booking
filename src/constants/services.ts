// RUTA: src/constants/services.ts
// Catálogo único de servicios — fuente de verdad para precios mostrados
// en la página de agendamiento. SINCRONIZADO con ServicesSection.tsx.

import type { Service } from '@/types/agendamiento';

export const serviceCatalog: Record<string, Service> = {
  // ===== Plan Gratis (prueba/lead magnet) =====
  'gratis': {
    name: 'Consulta Gratis - Prueba',
    price: '0',
    category: 'Gratis',
    note: 'Solo para probar la automatización',
  },

  // ===== Tutela Laboral GRATIS (lead magnet a porcentaje) =====
  'tutela-laboral': {
    name: 'Punto Legal Tutela Laboral',
    price: '0',
    category: 'Laboral',
    note: 'Diagnóstico gratuito · Honorarios sólo si recuperamos',
  },

  // ===== Personas =====
  'familia': {
    name: 'Punto Legal Familia',
    price: '89.000',
    category: 'Familia',
    originalPrice: '149.000',
    discount: '40% OFF',
  },
  'consulta-estrategica-familia': {
    name: 'Consulta Estratégica Familia',
    price: '89.000',
    category: 'Familia',
    originalPrice: '149.000',
    discount: '40% OFF',
    note: 'Primera consulta con abogado especialista',
  },
  'laboral': {
    name: 'Punto Legal Laboral',
    price: '79.000',
    category: 'Laboral',
  },
  'sucesorio': {
    name: 'Punto Legal Sucesorio',
    price: '89.000',
    category: 'Sucesorio',
  },
  'migratorio': {
    name: 'Punto Legal Migratorio',
    price: '129.000',
    category: 'Migratorio',
  },
  'penal': {
    name: 'Punto Legal Penal',
    price: '169.000',
    category: 'Penal',
    note: 'Atención inmediata',
  },
  'penal-economico': {
    name: 'Punto Legal Penal Económico',
    price: '169.000',
    category: 'Penal',
  },

  // ===== Empresas =====
  'empresarial': {
    name: 'Punto Legal Empresarial',
    price: '149.000',
    category: 'Empresarial',
  },
  'tributario': {
    name: 'Punto Legal Tributario',
    price: '99.000',
    category: 'Tributario',
  },
  'contratos': {
    name: 'Punto Legal Contratos',
    price: '59.000',
    category: 'Contratos',
    note: 'Entrega en 24 horas',
  },
  'comparendos': {
    name: 'Punto Legal Comparendos DT',
    price: '130.000',
    category: 'Laboral Empresarial',
    note: 'Comparendo Dirección del Trabajo',
  },
  'fiscalizaciones-dt': {
    name: 'Punto Legal Fiscalizaciones DT',
    price: '110.000',
    category: 'Laboral Empresarial',
    note: 'Fiscalización + reconsideración de multas',
  },
  'defensa-laboral-empresarial': {
    name: 'Punto Legal Defensa Empresarial',
    price: '189.000',
    category: 'Laboral Empresarial',
    note: 'Defensa empresa frente a juicios laborales',
  },
  'ley-karin': {
    name: 'Punto Legal Ley Karin',
    price: '169.000',
    category: 'Laboral Empresarial',
    note: 'Implementación protocolo + capacitación',
  },
  'cumplimiento': {
    name: 'Punto Legal Cumplimiento',
    price: '179.000',
    category: 'Cumplimiento',
    note: 'Modelo de prevención del delito (Ley 20.393)',
  },
  'compliance': {
    name: 'Punto Legal Cumplimiento',
    price: '179.000',
    category: 'Cumplimiento',
  },
  'marcas': {
    name: 'Punto Legal Marcas',
    price: '89.000',
    category: 'Propiedad Intelectual',
    note: 'Registro INAPI',
  },
  'propiedad-intelectual': {
    name: 'Punto Legal Marcas',
    price: '89.000',
    category: 'Propiedad Intelectual',
  },

  // ===== Patrimonio =====
  'inmobiliario': {
    name: 'Punto Legal Inmobiliario',
    price: '119.000',
    category: 'Inmobiliario',
  },
  'cobranza': {
    name: 'Punto Legal Cobranza',
    price: '109.000',
    category: 'Patrimonio',
    note: 'Juicio ejecutivo y embargos',
  },
  'cae-tesoreria': {
    name: 'Punto Legal Defensa CAE',
    price: '109.000',
    category: 'Patrimonio',
    originalPrice: '169.000',
    discount: '35% OFF',
    note: 'Defensa frente a Tesorería General de la República',
  },

  // ===== Nuevos servicios alto ticket =====
  'constitucion-empresarial': {
    name: 'Punto Legal Constitución Empresarial',
    price: '229.000',
    category: 'Empresarial',
    note: 'Sociedad Anónima, estructuras complejas',
  },
  'reestructuracion': {
    name: 'Punto Legal Reestructuración',
    price: '290.000',
    category: 'Empresarial',
    note: 'Fusión, escisión, transformación societaria',
  },
  'holding-patrimonial': {
    name: 'Punto Legal Holding Patrimonial',
    price: '350.000',
    category: 'Patrimonio',
    note: 'Holding familiar o empresarial a medida',
  },
  'gestion-patrimonial': {
    name: 'Punto Legal Gestión Patrimonial',
    price: '390.000',
    category: 'Empresarial',
    note: 'Asesoría mensual · 5 horas incluidas',
  },
  'despido-empresa': {
    name: 'Punto Legal Despido Empresas',
    price: '149.000',
    category: 'Laboral Empresarial',
    note: 'Asesoría preventiva al empleador',
  },
  'delitos-economicos': {
    name: 'Punto Legal Delitos Económicos',
    price: '290.000',
    category: 'Penal',
    note: 'Defensa Ley 21.595 — alta complejidad',
  },

  // ===== General (fallback / consulta inicial) =====
  'general': {
    name: 'Consulta Legal General',
    price: '59.000',
    category: 'General',
    note: '45 min · Plan de acción por escrito',
  },

  // ===== Planes corporativos (mantenidos por compatibilidad) =====
  'basico': { name: 'Corporativo Básico', price: '350.000', category: 'Corporativo' },
  'premium': { name: 'Corporativo Premium', price: '800.000', category: 'Corporativo' },
  'enterprise': { name: 'Corporativo Enterprise', price: '1.500.000', category: 'Corporativo' },
  'corporativo': {
    name: 'Asesoría Corporativa',
    price: '149.000',
    category: 'Corporativo',
    note: 'Consulta especializada',
  },

  // ===== Planes anuales familia (mantenidos por compatibilidad) =====
  'integral': { name: 'Protección Familiar Integral', price: '550.000', category: 'Familia' },
  'familia-integral': { name: 'Protección Familiar Integral', price: '550.000', category: 'Familia' },
  'familia-premium': { name: 'Defensa Familiar Anual', price: '1.100.000', category: 'Familia' },
  'elite': { name: 'Defensa Familiar Premium', price: '1.700.000', category: 'Familia' },
  'familia-elite': { name: 'Defensa Familiar Premium', price: '1.700.000', category: 'Familia' },

  // ===== Aliases / planes administrativos legacy =====
  'administracion-publica': {
    name: 'Punto Legal Administración Pública',
    price: '110.000',
    category: 'Administración Pública',
  },
  'consumidor': {
    name: 'Punto Legal Consumidor',
    price: '79.000',
    category: 'Consumidor',
  },
  'civil': { name: 'Derecho Civil', price: '79.000', category: 'Civil' },
};
