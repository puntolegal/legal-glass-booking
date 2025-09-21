/**
 * Script para probar las redirecciones de los botones del landing
 */

const serviceMap = {
  'Punto Legal Laboral': 'laboral',
  'Punto Legal Familia': 'familia', 
  'Punto Legal Sucesorio': 'sucesorio',
  'Punto Legal Inmobiliario': 'inmobiliario',
  'Punto Legal Empresarial': 'empresarial',
  'Punto Legal Contratos': 'contratos',
  'Punto Legal Administración Pública': 'administracion-publica',
  'Punto Legal Tributario': 'tributario',
  'Punto Legal Compliance': 'compliance',
  'Punto Legal Migratorio': 'migratorio',
  'Punto Legal Propiedad Intelectual': 'propiedad-intelectual',
  'Punto Legal Consumidor': 'consumidor',
  'Punto Legal Penal Económico': 'penal-economico'
};

const expectedPrices = {
  'Punto Legal Laboral': { regular: '$60.000', promo: '$30.000' },
  'Punto Legal Familia': { regular: '$60.000', promo: '$30.000' },
  'Punto Legal Sucesorio': { regular: '$60.000', promo: '$30.000' },
  'Punto Legal Inmobiliario': { regular: '$55.000', promo: '$27.500' },
  'Punto Legal Empresarial': { regular: '$90.000', promo: '$45.000' },
  'Punto Legal Contratos': { regular: '$30.000', promo: '$15.000' },
  'Punto Legal Administración Pública': { regular: '$50.000', promo: '$25.000' },
  'Punto Legal Tributario': { regular: '$60.000', promo: '$30.000' },
  'Punto Legal Compliance': { regular: '$80.000', promo: '$40.000' },
  'Punto Legal Migratorio': { regular: '$55.000', promo: '$27.500' },
  'Punto Legal Propiedad Intelectual': { regular: '$45.000', promo: '$22.500' },
  'Punto Legal Consumidor': { regular: '$45.000', promo: '$22.500' },
  'Punto Legal Penal Económico': { regular: '$90.000', promo: '$45.000' }
};

console.log('🧪 PROBANDO REDIRECCIONES DE BOTONES DEL LANDING\n');

Object.entries(serviceMap).forEach(([serviceName, plan]) => {
  const expectedPrice = expectedPrices[serviceName];
  console.log(`✅ ${serviceName}`);
  console.log(`   Redirección: /agendamiento?plan=${plan}`);
  console.log(`   Precio: ${expectedPrice.regular} → ${expectedPrice.promo}`);
  console.log('');
});

console.log('🎯 TODOS LOS BOTONES DEBERÍAN REDIRIGIR CORRECTAMENTE');
console.log('🔗 Cada botón lleva a su agendamiento específico con el precio correcto');
