// Script para verificar que las URLs del dashboard coincidan con el código
import fetch from "node-fetch";

console.log('🔍 Verificando coherencia entre URLs del código y dashboard...');

// URLs que deben estar configuradas en el dashboard de MercadoPago
const DASHBOARD_URLS = {
  success: 'https://www.puntolegal.online/payment-success?source=mercadopago',
  failure: 'https://www.puntolegal.online/payment-failure?source=mercadopago', 
  pending: 'https://www.puntolegal.online/payment-pending?source=mercadopago',
  webhook: 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook'
};

// URLs que están en el código
const CODE_URLS = {
  success: 'https://www.puntolegal.online/payment-success?source=mercadopago',
  failure: 'https://www.puntolegal.online/payment-failure?source=mercadopago',
  pending: 'https://www.puntolegal.online/payment-pending?source=mercadopago', 
  webhook: 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook'
};

console.log('\n📋 URLs que deben configurarse en el Dashboard de MercadoPago:');
console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
console.log('│ URL de Éxito:                                                               │');
console.log(`│ ${DASHBOARD_URLS.success.padEnd(75)} │`);
console.log('├─────────────────────────────────────────────────────────────────────────────┤');
console.log('│ URL de Fallo:                                                               │');
console.log(`│ ${DASHBOARD_URLS.failure.padEnd(75)} │`);
console.log('├─────────────────────────────────────────────────────────────────────────────┤');
console.log('│ URL de Pendiente:                                                           │');
console.log(`│ ${DASHBOARD_URLS.pending.padEnd(75)} │`);
console.log('├─────────────────────────────────────────────────────────────────────────────┤');
console.log('│ URL de Webhook:                                                             │');
console.log(`│ ${DASHBOARD_URLS.webhook.padEnd(75)} │`);
console.log('└─────────────────────────────────────────────────────────────────────────────┘');

console.log('\n✅ Verificación de coherencia:');
let allMatch = true;

Object.keys(DASHBOARD_URLS).forEach(key => {
  const matches = DASHBOARD_URLS[key] === CODE_URLS[key];
  console.log(`${matches ? '✅' : '❌'} ${key.toUpperCase()}: ${matches ? 'Coincide' : 'NO COINCIDE'}`);
  if (!matches) allMatch = false;
});

if (allMatch) {
  console.log('\n🎉 ¡Todas las URLs coinciden! El código está listo para el dashboard.');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Ir a: https://www.mercadopago.cl/developers/panel');
  console.log('2. Configurar las URLs listadas arriba en el dashboard');
  console.log('3. Ejecutar: node scripts/mp-sanity-check.mjs');
  console.log('4. Probar el flujo completo de pago');
} else {
  console.log('\n❌ Hay inconsistencias entre el código y las URLs del dashboard.');
  console.log('Revisa las URLs que no coinciden antes de continuar.');
}

console.log('\n🔗 Enlaces útiles:');
console.log('- Dashboard MercadoPago: https://www.mercadopago.cl/developers/panel');
console.log('- Guía de configuración: CONFIGURACION_DASHBOARD_MERCADOPAGO_ACTUALIZADA.md');
console.log('- Script de prueba: node scripts/mp-sanity-check.mjs');
