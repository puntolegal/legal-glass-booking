// RUTA: src/constants/services.ts

import type { Service } from '@/types/agendamiento';

export const serviceCatalog: Record<string, Service> = {
  // Plan Gratis - Prueba de automatización
  'gratis': { name: 'Consulta Gratis - Prueba', price: '0', category: 'Gratis', note: 'Solo para probar la automatización' },
  
  // Corporativo
  'basico': { name: 'Corporativo Básico', price: '350.000', category: 'Corporativo' },
  'premium': { name: 'Corporativo Premium', price: '800.000', category: 'Corporativo' },
  'enterprise': { name: 'Corporativo Enterprise', price: '1.500.000', category: 'Corporativo' },
  'corporativo': { name: 'Asesoría Corporativa', price: '35.000', category: 'Corporativo', note: 'Consulta especializada' },
  
  // Inmobiliario
  'inmobiliario': { name: 'Punto Legal Inmobiliario', price: '27.500', category: 'Inmobiliario', originalPrice: '55.000', discount: '50% OFF' },
  
  // Familia - Consulta Estratégica y Planes
  'consulta-estrategica-familia': { name: 'Consulta Estratégica Premium Familia', price: '150.000', category: 'Familia', originalPrice: '300.000', discount: '50% OFF CYBER', note: '100% reembolsable si contratas un plan' },
  'familia': { name: 'Punto Legal Familia', price: '35.000', category: 'Familia', originalPrice: '70.000', discount: '50% OFF' },
  'integral': { name: 'Protección Familiar Integral', price: '550.000', category: 'Familia', originalPrice: '1.100.000', discount: '50% OFF CYBER' },
  'familia-integral': { name: 'Protección Familiar Integral', price: '550.000', category: 'Familia', originalPrice: '1.100.000', discount: '50% OFF CYBER' },
  'familia-premium': { name: 'Defensa Familiar Premium', price: '1.100.000', category: 'Familia', originalPrice: '2.200.000', discount: '50% OFF CYBER' },
  'elite': { name: 'Blindaje Familiar Elite', price: '1.700.000', category: 'Familia', originalPrice: '3.400.000', discount: '50% OFF CYBER' },
  'familia-elite': { name: 'Blindaje Familiar Elite', price: '1.700.000', category: 'Familia', originalPrice: '3.400.000', discount: '50% OFF CYBER' },
  
  // Laboral
  'laboral': { name: 'Punto Legal Laboral', price: '30.000', category: 'Laboral', originalPrice: '60.000', discount: '50% OFF' },
  
  // General
  'general': { name: 'Consulta General', price: '35.000', category: 'General', originalPrice: '70.000', discount: '50% OFF' },
  
  // Sucesorio
  'sucesorio': { name: 'Punto Legal Sucesorio', price: '30.000', category: 'Sucesorio', originalPrice: '60.000', discount: '50% OFF' },
  
  // Empresarial
  'empresarial': { name: 'Punto Legal Empresarial', price: '45.000', category: 'Empresarial', originalPrice: '90.000', discount: '50% OFF' },
  
  // Contratos
  'contratos': { name: 'Punto Legal Contratos', price: '15.000', category: 'Contratos', originalPrice: '30.000', discount: '50% OFF' },
  
  // Administración Pública
  'administracion-publica': { name: 'Punto Legal Administración Pública', price: '25.000', category: 'Administración Pública', originalPrice: '50.000', discount: '50% OFF' },
  
  // Tributario
  'tributario': { name: 'Punto Legal Tributario', price: '30.000', category: 'Tributario', originalPrice: '60.000', discount: '50% OFF' },
  
  // Compliance
  'compliance': { name: 'Punto Legal Compliance', price: '40.000', category: 'Compliance', originalPrice: '80.000', discount: '50% OFF' },
  
  // Migratorio
  'migratorio': { name: 'Punto Legal Migratorio', price: '32.500', category: 'Migratorio', originalPrice: '65.000', discount: '50% OFF' },
  
  // Propiedad Intelectual
  'propiedad-intelectual': { name: 'Punto Legal Propiedad Intelectual', price: '22.500', category: 'Propiedad Intelectual', originalPrice: '45.000', discount: '50% OFF' },
  
  // Consumidor
  'consumidor': { name: 'Punto Legal Consumidor', price: '45.000', category: 'Consumidor', originalPrice: '90.000', discount: '50% OFF' },
  
  // Penal Económico
  'penal-economico': { name: 'Punto Legal Penal Económico', price: '45.000', category: 'Penal Económico', originalPrice: '90.000', discount: '50% OFF' },
  
  // Otros servicios
  'civil': { name: 'Derecho Civil', price: '45.000', category: 'Civil' },
  'penal': { name: 'Derecho Penal', price: '65.000', category: 'Penal' },
};

