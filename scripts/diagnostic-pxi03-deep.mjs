// Diagnóstico profundo para PXI03 persistente
console.log('🔍 DIAGNÓSTICO PROFUNDO PXI03 PERSISTENTE');
console.log('=========================================');

console.log('\n📋 PXI03 PERSISTENTE - OTRAS CAUSAS POSIBLES:');
console.log('==============================================');

const causes = [
  '1. PROBLEMA EN LOS ITEMS DE LA PREFERENCIA:',
  '   - currency_id no es "CLP" exactamente',
  '   - unit_price es 0 o negativo',
  '   - title está vacío o tiene caracteres especiales',
  '   - quantity no es 1',
  '',
  '2. PROBLEMA EN PAGER DATA:',
  '   - email no tiene formato válido',
  '   - phone tiene formato incorrecto',
  '   - name está vacío o tiene caracteres especiales',
  '',
  '3. PROBLEMA EN BACK_URLS:',
  '   - URLs no son HTTPS',
  '   - URLs no son públicas (localhost, IP privada)',
  '   - URLs tienen caracteres especiales',
  '',
  '4. PROBLEMA EN EXTERNAL_REFERENCE:',
  '   - external_reference está vacío',
  '   - external_reference tiene caracteres especiales',
  '   - external_reference es muy largo',
  '',
  '5. PROBLEMA EN NOTIFICATION_URL:',
  '   - notification_url no es HTTPS',
  '   - notification_url no es pública',
  '   - notification_url no responde 200',
  '',
  '6. PROBLEMA EN METADATA:',
  '   - metadata tiene caracteres especiales',
  '   - metadata es muy grande',
  '   - metadata tiene valores null/undefined',
  '',
  '7. PROBLEMA EN AMBIENTE:',
  '   - Token de sandbox en producción',
  '   - Token de producción en sandbox',
  '   - Token expirado o inválido',
  '',
  '8. PROBLEMA EN NAVEGADOR:',
  '   - AdBlockers bloqueando MercadoPago',
  '   - Extensions interfiriendo',
  '   - Cookies bloqueadas',
  '   - JavaScript deshabilitado',
  '',
  '9. PROBLEMA EN RED:',
  '   - Firewall corporativo',
  '   - Proxy bloqueando MercadoPago',
  '   - DNS no resolviendo MercadoPago',
  '',
  '10. PROBLEMA EN DISPOSITIVO:',
  '   - WebView de app (Instagram, Facebook)',
  '   - Navegador muy antiguo',
  '   - Memoria insuficiente'
];

causes.forEach(cause => console.log(cause));

console.log('\n🔧 CHECKLIST DE DIAGNÓSTICO:');
console.log('============================');

const checklist = [
  '✅ 1. VERIFICAR PREFERENCIA COMPLETA:',
  '   - Logs del backend mostrando la preferencia creada',
  '   - Verificar cada campo individualmente',
  '',
  '✅ 2. VERIFICAR CREDENCIALES:',
  '   - Token válido y del ambiente correcto',
  '   - Cuenta de MercadoPago activa',
  '',
  '✅ 3. VERIFICAR NAVEGADOR:',
  '   - Probar en navegador limpio (incógnito)',
  '   - Deshabilitar adblockers temporalmente',
  '   - Probar en dispositivo diferente',
  '',
  '✅ 4. VERIFICAR RED:',
  '   - Probar desde red diferente',
  '   - Verificar que MercadoPago esté accesible',
  '',
  '✅ 5. VERIFICAR LOGS:',
  '   - Backend: logs de creación de preferencia',
  '   - Frontend: logs de redirección',
  '   - Navegador: consola de errores',
  '',
  '✅ 6. VERIFICAR AMBIENTE:',
  '   - Variables de entorno correctas',
  '   - Detección de ambiente funcionando',
  '   - URLs de retorno públicas'
];

checklist.forEach(item => console.log(item));

console.log('\n🎯 PRUEBAS ESPECÍFICAS:');
console.log('======================');

const tests = [
  '1. CREAR PREFERENCIA MANUAL:',
  '   - Usar Postman/curl para crear preferencia',
  '   - Verificar que se crea correctamente',
  '   - Probar el init_point manualmente',
  '',
  '2. VERIFICAR DATOS MÍNIMOS:',
  '   - Preferencia con solo campos obligatorios',
  '   - Sin metadata, sin phone, sin extras',
  '   - Ver si funciona con datos mínimos',
  '',
  '3. VERIFICAR EN DIFERENTES DISPOSITIVOS:',
  '   - iPhone Safari',
  '   - Android Chrome',
  '   - Desktop Chrome/Firefox',
  '   - Ver si es específico de dispositivo',
  '',
  '4. VERIFICAR EN DIFERENTES REDES:',
  '   - WiFi casa',
  '   - Datos móviles',
  '   - Red corporativa',
  '   - Ver si es específico de red'
];

tests.forEach(test => console.log(test));

console.log('\n🚀 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. Revisar logs del backend para ver la preferencia creada');
console.log('2. Verificar que el token sea válido');
console.log('3. Probar en navegador limpio/incógnito');
console.log('4. Crear preferencia manual para comparar');
console.log('5. Verificar en dispositivo/red diferente');

console.log('\n📋 INFORMACIÓN NECESARIA:');
console.log('=========================');
console.log('- ¿En qué dispositivo/navegador ocurre?');
console.log('- ¿Qué muestra la consola del navegador?');
console.log('- ¿Qué muestran los logs del backend?');
console.log('- ¿La preferencia se crea correctamente?');
console.log('- ¿El init_point es válido?');
console.log('- ¿Es específico de móvil o también en desktop?');

console.log('\n✅ DIAGNÓSTICO COMPLETO LISTO');
