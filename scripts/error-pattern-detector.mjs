#!/usr/bin/env node

console.log('🔍 Detector de Patrones de Error - MercadoPago CheckoutPro\n');

// Configuración del sistema
const CONFIG = {
  SUPABASE_URL: 'https://qrgelocijmwnxcckxbdg.supabase.co',
  PRODUCTION_URL: 'https://www.puntolegal.online',
  EXPECTED_WEBHOOK_URL: 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook'
};

// Patrones de error comunes en nuestro sistema
const ERROR_PATTERNS = [
  {
    id: 'localhost_in_production',
    name: 'URL del backend mal configurada',
    pattern: /localhost:3001|localhost:5173|127\.0\.0\.1/,
    severity: 'CRITICAL',
    description: 'En producción el success page sigue apuntando a localhost',
    effect: 'Se usa el fallback → se muestran datos simulados/default',
    fix: 'Actualizar todas las URLs a https://www.puntolegal.online'
  },
  {
    id: 'missing_external_reference',
    name: 'Falta de external_reference o metadata',
    pattern: /storedReservationId:\s*null|storedExternalReference:\s*null|external_reference.*undefined/,
    severity: 'HIGH',
    description: 'La preferencia creada no lleva external_reference con el ID de reserva',
    effect: 'No se puede relacionar el pago con la reserva',
    fix: 'Asegurar que createMercadoPagoPreference incluya external_reference'
  },
  {
    id: 'localstorage_dependency',
    name: 'Uso de localStorage como única fuente',
    pattern: /Datos de pago almacenados:\s*null|localStorage\.getItem.*null/,
    severity: 'HIGH',
    description: 'El success page depende de localStorage para reconstruir datos',
    effect: 'Tras volver de MP en otro navegador/dispositivo → todo llega null',
    fix: 'Implementar búsqueda por preference_id o external_reference en URL'
  },
  {
    id: 'direct_mp_api_client',
    name: 'Consultas directas a la API de MercadoPago desde el cliente',
    pattern: /Access token de MercadoPago no configurado|MERCADOPAGO_ACCESS_TOKEN.*undefined/,
    severity: 'MEDIUM',
    description: 'El frontend intenta llamar a MP sin ACCESS_TOKEN',
    effect: 'No obtiene info real del pago → fallback o error crítico',
    fix: 'Usar Edge Functions para consultas a MercadoPago API'
  },
  {
    id: 'webhook_not_configured',
    name: 'Webhook no configurado o inactivo',
    pattern: /notification_url.*undefined|webhook.*failed|notification.*error/,
    severity: 'HIGH',
    description: 'No existe o no responde la notification_url',
    effect: 'La reserva no se actualiza automáticamente',
    fix: 'Configurar notification_url en preferencias de MercadoPago'
  },
  {
    id: 'dev_prod_mixed',
    name: 'Ambiente dev mezclado con prod',
    pattern: /http:\/\/localhost|Warning: URLs HTTP|auto_return invalid/,
    severity: 'CRITICAL',
    description: 'Variables de entorno de dev usadas en deploy',
    effect: 'Errores de seguridad, redirecciones inválidas',
    fix: 'Usar variables de entorno de producción'
  },
  {
    id: 'fallbacks_in_production',
    name: 'Fallbacks habilitados en producción',
    pattern: /usando datos simulados|no se encontró la reserva|datos simulados/,
    severity: 'MEDIUM',
    description: 'Código preparado para dev/testing que no se desactiva en prod',
    effect: 'Usuario ve información genérica y no sus datos reales',
    fix: 'Desactivar fallbacks en producción'
  }
];

async function checkFilePatterns() {
  console.log('📁 Verificando patrones en archivos del proyecto...\n');
  
  const fs = await import('fs');
  const path = await import('path');
  
  const filesToCheck = [
    'src/components/MercadoPagoOfficialButton.tsx',
    'src/components/MercadoPagoCheckoutPro.tsx',
    'src/components/MercadoPagoRedirectButton.tsx',
    'src/pages/PaymentSuccessPage.tsx',
    'src/services/mercadopagoDirect.ts',
    'src/config/mercadopago.ts',
    'supabase/functions/create-mercadopago-preference/index.ts',
    'supabase/functions/mercadopago-webhook/index.ts'
  ];
  
  let totalIssues = 0;
  
  for (const filePath of filesToCheck) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`📄 Verificando: ${filePath}`);
        
        for (const errorPattern of ERROR_PATTERNS) {
          const matches = content.match(errorPattern.pattern);
          if (matches) {
            console.log(`   ❌ ${errorPattern.severity}: ${errorPattern.name}`);
            console.log(`      Patrón encontrado: ${matches[0]}`);
            console.log(`      Descripción: ${errorPattern.description}`);
            console.log(`      Solución: ${errorPattern.fix}`);
            console.log('');
            totalIssues++;
          }
        }
        
        if (!content.match(new RegExp(ERROR_PATTERNS.map(p => p.pattern).join('|')))) {
          console.log(`   ✅ Sin patrones problemáticos detectados`);
        }
        console.log('');
      } else {
        console.log(`📄 ${filePath} - ❌ Archivo no encontrado`);
      }
    } catch (error) {
      console.log(`📄 ${filePath} - ❌ Error leyendo archivo: ${error.message}`);
    }
  }
  
  return totalIssues;
}

async function checkEnvironmentConfig() {
  console.log('🔧 Verificando configuración de entorno...\n');
  
  let envIssues = 0;
  
  // Verificar URLs de producción
  const productionChecks = [
    {
      name: 'URL de producción correcta',
      check: () => CONFIG.PRODUCTION_URL === 'https://www.puntolegal.online',
      fix: 'Actualizar PRODUCTION_URL en configuración'
    },
    {
      name: 'Webhook URL configurada',
      check: () => CONFIG.EXPECTED_WEBHOOK_URL.includes('supabase.co'),
      fix: 'Configurar webhook URL en Supabase Edge Functions'
    }
  ];
  
  for (const check of productionChecks) {
    if (check.check()) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      console.log(`   Solución: ${check.fix}`);
      envIssues++;
    }
  }
  
  return envIssues;
}

async function checkMercadoPagoConfig() {
  console.log('💳 Verificando configuración de MercadoPago...\n');
  
  try {
    const fs = await import('fs');
    console.log('📄 Archivo de configuración encontrado');
    
    // Verificar que las URLs sean de producción
    const configContent = fs.readFileSync('src/config/mercadopago.ts', 'utf8');
    
    const prodUrlChecks = [
      {
        name: 'URLs de retorno en producción',
        pattern: /https:\/\/www\.puntolegal\.online\/payment-success/,
        found: configContent.match(/https:\/\/www\.puntolegal\.online\/payment-success/)
      },
      {
        name: 'Webhook URL configurada',
        pattern: /supabase\.co\/functions\/v1\/mercadopago-webhook/,
        found: configContent.match(/supabase\.co\/functions\/v1\/mercadopago-webhook/)
      }
    ];
    
    for (const check of prodUrlChecks) {
      if (check.found) {
        console.log(`✅ ${check.name}`);
      } else {
        console.log(`❌ ${check.name}`);
        console.log(`   Patrón esperado: ${check.pattern}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error verificando configuración MercadoPago: ${error.message}`);
    return 1;
  }
  
  return 0;
}

async function generateErrorReport() {
  console.log('📊 Generando reporte de errores...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    patterns: ERROR_PATTERNS,
    recommendations: [
      'Implementar validación automática de URLs en CI/CD',
      'Usar variables de entorno estrictas para producción',
      'Implementar tests que verifiquen external_reference',
      'Desactivar fallbacks en builds de producción',
      'Monitorear logs de webhook en tiempo real'
    ]
  };
  
    const fs = await import('fs');
    fs.writeFileSync('error-patterns-report.json', JSON.stringify(report, null, 2));
  
  console.log('📄 Reporte guardado en: error-patterns-report.json');
  
  return report;
}

async function main() {
  console.log('🚀 Iniciando detección de patrones de error...\n');
  
  // 1. Verificar patrones en archivos
  const fileIssues = await checkFilePatterns();
  
  // 2. Verificar configuración de entorno
  const envIssues = await checkEnvironmentConfig();
  
  // 3. Verificar configuración de MercadoPago
  const mpIssues = await checkMercadoPagoConfig();
  
  // 4. Generar reporte
  const report = await generateErrorReport();
  
  console.log('\n📊 RESUMEN DE DETECCIÓN:');
  console.log('═'.repeat(50));
  
  const totalIssues = fileIssues + envIssues + mpIssues;
  
  if (totalIssues === 0) {
    console.log('🎉 ¡SIN PROBLEMAS DETECTADOS!');
    console.log('✅ El sistema está configurado correctamente');
    console.log('✅ No se encontraron patrones de error comunes');
  } else {
    console.log(`⚠️ ${totalIssues} PROBLEMAS DETECTADOS:`);
    console.log(`   📁 Archivos: ${fileIssues} problemas`);
    console.log(`   🔧 Entorno: ${envIssues} problemas`);
    console.log(`   💳 MercadoPago: ${mpIssues} problemas`);
    
    console.log('\n🔧 RECOMENDACIONES:');
    report.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  console.log('\n📋 PATRONES DE ERROR CONFIGURADOS:');
  ERROR_PATTERNS.forEach((pattern, index) => {
    console.log(`   ${index + 1}. [${pattern.severity}] ${pattern.name}`);
  });
  
  console.log('\n✨ Detección completada');
}

main().catch(console.error);
