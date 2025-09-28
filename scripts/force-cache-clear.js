/**
 * Script para forzar la limpieza de cache del navegador
 * Ejecutar en la consola del navegador
 */

console.log('🧹 LIMPIANDO CACHE DEL NAVEGADOR...');

// Limpiar localStorage
localStorage.clear();
console.log('✅ localStorage limpiado');

// Limpiar sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage limpiado');

// Limpiar cache del service worker si existe
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('✅ Service Worker desregistrado');
    }
  });
}

// Forzar recarga sin cache
console.log('🔄 Recargando página sin cache...');
window.location.reload(true);

console.log('🎯 PÁGINA RECARGADA - Las correcciones ahora deberían funcionar');
