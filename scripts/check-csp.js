/**
 * Script para verificar la configuración de Content Security Policy
 * Ejecutar: node scripts/check-csp.js
 */

console.log('🔍 VERIFICANDO CONFIGURACIÓN CSP\n');

// Verificar que nginx.conf existe
const fs = require('fs');
const path = require('path');

const nginxConfPath = path.join(__dirname, '..', 'nginx.conf');
const nginxCspPath = path.join(__dirname, '..', 'nginx-csp.conf');

console.log('📁 ARCHIVOS CSP:');
console.log(`• nginx.conf: ${fs.existsSync(nginxConfPath) ? '✅ Existe' : '❌ No existe'}`);
console.log(`• nginx-csp.conf: ${fs.existsSync(nginxCspPath) ? '✅ Existe' : '❌ No existe'}`);

if (fs.existsSync(nginxConfPath)) {
  const nginxContent = fs.readFileSync(nginxConfPath, 'utf8');
  
  console.log('\n🔧 CONFIGURACIÓN CSP EN nginx.conf:');
  
  // Verificar si CSP está configurado
  if (nginxContent.includes('Content-Security-Policy')) {
    console.log('✅ CSP configurado');
    
    // Verificar dominios importantes
    const importantDomains = [
      '*.google.com',
      '*.googletagmanager.com',
      '*.google-analytics.com',
      '*.make.com',
      '*.rudderlabs.com',
      '*.rudderstack.com',
      '*.clarity.ms',
      '*.chameleon.io',
      '*.userflow.com',
      '*.redditstatic.com',
      '*.reddit.com',
      '*.linkedin.com',
      '*.bing.com',
      '*.youtube.com',
      '*.gstatic.com',
      '*.onetrust.com',
      'cdn.cookielaw.org',
      'connect.facebook.net',
      'snap.licdn.com',
      'stats.g.doubleclick.net',
      '*.dataplane.rudderstack.com',
      'e.userflow.com',
      'js.userflow.com',
      'wss://e.userflow.com',
      'bat.bing.com',
      '*.google.ie',
      '*.google.cz',
      '*.ads.linkedin.com',
      'https://cdn.make.com',
      'https://browser-intake-datadoghq.com',
      'cdn.cookielaw.org',
      '*.onetrust.com'
    ];
    
    console.log('\n🌐 DOMINIOS PERMITIDOS:');
    importantDomains.forEach(domain => {
      const isAllowed = nginxContent.includes(domain);
      console.log(`• ${domain}: ${isAllowed ? '✅ Permitido' : '❌ No permitido'}`);
    });
    
    // Verificar directivas importantes
    const directives = [
      'script-src',
      'connect-src',
      'img-src',
      'style-src',
      'font-src'
    ];
    
    console.log('\n📋 DIRECTIVAS CSP:');
    directives.forEach(directive => {
      const isConfigured = nginxContent.includes(directive);
      console.log(`• ${directive}: ${isConfigured ? '✅ Configurado' : '❌ No configurado'}`);
    });
    
    // Verificar unsafe-inline y unsafe-eval
    const unsafeInline = nginxContent.includes("'unsafe-inline'");
    const unsafeEval = nginxContent.includes("'unsafe-eval'");
    
    console.log('\n⚠️  CONFIGURACIONES UNSAFE:');
    console.log(`• unsafe-inline: ${unsafeInline ? '✅ Habilitado' : '❌ Deshabilitado'}`);
    console.log(`• unsafe-eval: ${unsafeEval ? '✅ Habilitado' : '❌ Deshabilitado'}`);
    
  } else {
    console.log('❌ CSP no configurado');
  }
}

console.log('\n🎯 RECOMENDACIONES:');
console.log('1. Verificar que nginx esté reiniciado después de los cambios');
console.log('2. Probar la aplicación en el navegador');
console.log('3. Revisar la consola del navegador para errores CSP');
console.log('4. Ajustar dominios según sea necesario');

console.log('\n🔧 COMANDOS ÚTILES:');
console.log('• Reiniciar nginx: sudo nginx -s reload');
console.log('• Verificar configuración: nginx -t');
console.log('• Ver logs: tail -f /var/log/nginx/error.log');

console.log('\n✅ VERIFICACIÓN COMPLETADA');
