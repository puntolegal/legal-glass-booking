// Script para verificar que las variables de entorno se carguen correctamente
console.log('🔍 Verificando variables de entorno...');

console.log('VITE_MERCADOPAGO_ACCESS_TOKEN:', process.env.VITE_MERCADOPAGO_ACCESS_TOKEN ? 'Configurado' : 'No configurado');
console.log('VITE_MERCADOPAGO_PUBLIC_KEY:', process.env.VITE_MERCADOPAGO_PUBLIC_KEY ? 'Configurado' : 'No configurado');

if (process.env.VITE_MERCADOPAGO_ACCESS_TOKEN) {
  console.log('✅ Token de acceso encontrado');
} else {
  console.log('❌ Token de acceso no encontrado');
}

if (process.env.VITE_MERCADOPAGO_PUBLIC_KEY) {
  console.log('✅ Public key encontrado');
} else {
  console.log('❌ Public key no encontrado');
}
