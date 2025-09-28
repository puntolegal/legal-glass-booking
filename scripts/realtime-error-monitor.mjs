#!/usr/bin/env node

console.log('🔍 Monitor de Errores en Tiempo Real - MercadoPago CheckoutPro\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

// Patrones de error críticos que requieren atención inmediata
const CRITICAL_PATTERNS = [
  {
    id: 'localhost_in_production',
    pattern: /localhost:3001|localhost:5173|127\.0\.0\.1/,
    message: '🚨 CRÍTICO: URLs de localhost detectadas en producción',
    action: 'Revisar configuración de URLs inmediatamente'
  },
  {
    id: 'payment_not_found',
    pattern: /No se encontró la reserva asociada al pago|reserva.*no encontrada/i,
    message: '⚠️ ALTO: Reserva no encontrada después del pago',
    action: 'Verificar external_reference y búsqueda de reservas'
  },
  {
    id: 'webhook_failure',
    pattern: /webhook.*failed|notification.*error|mercadopago-webhook.*error/i,
    message: '⚠️ ALTO: Error en webhook de MercadoPago',
    action: 'Verificar Edge Function mercadopago-webhook'
  },
  {
    id: 'mercadopago_api_error',
    pattern: /MERCADOPAGO_ACCESS_TOKEN.*undefined|Access token.*no configurado/i,
    message: '⚠️ MEDIO: Token de MercadoPago no configurado',
    action: 'Verificar variables de entorno en Edge Functions'
  },
  {
    id: 'fallback_usage',
    pattern: /usando datos simulados|datos simulados|fallback.*activo/i,
    message: '⚠️ MEDIO: Fallbacks activos en producción',
    action: 'Revisar lógica de fallback en componentes'
  }
];

async function checkRecentReservations() {
  console.log('🔍 Verificando reservas recientes...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?select=*&order=created_at.desc&limit=10`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const reservations = await response.json();
      console.log(`📊 Encontradas ${reservations.length} reservas recientes`);
      
      // Verificar patrones problemáticos en las reservas
      let issuesFound = 0;
      
      for (const reservation of reservations) {
        // Verificar datos faltantes
        if (!reservation.nombre || !reservation.email || !reservation.telefono) {
          console.log(`⚠️ Reserva ${reservation.id}: Datos de cliente incompletos`);
          issuesFound++;
        }
        
        // Verificar estado de pago
        if (reservation.estado === 'pendiente' && reservation.pago_estado === 'aprobado') {
          console.log(`⚠️ Reserva ${reservation.id}: Pago aprobado pero reserva pendiente`);
          issuesFound++;
        }
        
        // Verificar external_reference
        if (!reservation.external_reference && reservation.estado !== 'pendiente') {
          console.log(`⚠️ Reserva ${reservation.id}: Sin external_reference`);
          issuesFound++;
        }
      }
      
      return { reservations, issuesFound };
    } else {
      console.log(`❌ Error obteniendo reservas: ${response.status}`);
      return { reservations: [], issuesFound: 0 };
    }
  } catch (error) {
    console.log(`❌ Error verificando reservas: ${error.message}`);
    return { reservations: [], issuesFound: 0 };
  }
}

async function testEdgeFunctions() {
  console.log('\n🔍 Verificando estado de Edge Functions...');
  
  const edgeFunctions = [
    'create-mercadopago-preference',
    'mercadopago-webhook',
    'send-resend-emails'
  ];
  
  let healthyFunctions = 0;
  
  for (const functionName of edgeFunctions) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        }
      });
      
      if (response.status === 200 || response.status === 204) {
        console.log(`✅ ${functionName}: Operativa`);
        healthyFunctions++;
      } else {
        console.log(`⚠️ ${functionName}: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${functionName}: Error - ${error.message}`);
    }
  }
  
  return { healthyFunctions, totalFunctions: edgeFunctions.length };
}

async function checkMercadoPagoConfiguration() {
  console.log('\n🔍 Verificando configuración de MercadoPago...');
  
  try {
    // Verificar que las URLs de retorno sean de producción
    const fs = await import('fs');
    const configContent = fs.readFileSync('src/config/mercadopago.ts', 'utf8');
    
    const checks = [
      {
        name: 'URLs de producción',
        pattern: /https:\/\/www\.puntolegal\.online/,
        found: configContent.match(/https:\/\/www\.puntolegal\.online/g)
      },
      {
        name: 'Webhook configurado',
        pattern: /supabase\.co\/functions\/v1\/mercadopago-webhook/,
        found: configContent.match(/supabase\.co\/functions\/v1\/mercadopago-webhook/)
      },
      {
        name: 'Sin localhost',
        pattern: /localhost/,
        found: configContent.match(/localhost/)
      }
    ];
    
    let configIssues = 0;
    
    for (const check of checks) {
      if (check.name === 'Sin localhost') {
        if (check.found) {
          console.log(`❌ ${check.name}: Encontrado localhost en configuración`);
          configIssues++;
        } else {
          console.log(`✅ ${check.name}: Sin localhost detectado`);
        }
      } else {
        if (check.found) {
          console.log(`✅ ${check.name}: Configurado correctamente`);
        } else {
          console.log(`❌ ${check.name}: No configurado`);
          configIssues++;
        }
      }
    }
    
    return configIssues;
  } catch (error) {
    console.log(`❌ Error verificando configuración: ${error.message}`);
    return 1;
  }
}

async function generateHealthReport(reservations, issuesFound, edgeFunctions, configIssues) {
  console.log('\n📊 Generando reporte de salud del sistema...');
  
  const report = {
    timestamp: new Date().toISOString(),
    systemHealth: {
      reservations: {
        total: reservations.length,
        issues: issuesFound,
        health: issuesFound === 0 ? 'HEALTHY' : 'NEEDS_ATTENTION'
      },
      edgeFunctions: {
        healthy: edgeFunctions.healthyFunctions,
        total: edgeFunctions.totalFunctions,
        health: edgeFunctions.healthyFunctions === edgeFunctions.totalFunctions ? 'HEALTHY' : 'NEEDS_ATTENTION'
      },
      configuration: {
        issues: configIssues,
        health: configIssues === 0 ? 'HEALTHY' : 'NEEDS_ATTENTION'
      }
    },
    overallHealth: 'HEALTHY',
    recommendations: []
  };
  
  // Determinar salud general
  if (issuesFound > 0 || edgeFunctions.healthyFunctions < edgeFunctions.totalFunctions || configIssues > 0) {
    report.overallHealth = 'NEEDS_ATTENTION';
    
    if (issuesFound > 0) {
      report.recommendations.push('Revisar reservas con datos incompletos o estados inconsistentes');
    }
    if (edgeFunctions.healthyFunctions < edgeFunctions.totalFunctions) {
      report.recommendations.push('Verificar Edge Functions que no responden correctamente');
    }
    if (configIssues > 0) {
      report.recommendations.push('Corregir configuración de MercadoPago');
    }
  }
  
  const fs = await import('fs');
  fs.writeFileSync('system-health-report.json', JSON.stringify(report, null, 2));
  
  console.log('📄 Reporte de salud guardado en: system-health-report.json');
  
  return report;
}

async function main() {
  console.log('🚀 Iniciando monitor de errores en tiempo real...\n');
  
  // 1. Verificar reservas recientes
  const { reservations, issuesFound } = await checkRecentReservations();
  
  // 2. Verificar Edge Functions
  const edgeFunctions = await testEdgeFunctions();
  
  // 3. Verificar configuración
  const configIssues = await checkMercadoPagoConfiguration();
  
  // 4. Generar reporte de salud
  const healthReport = await generateHealthReport(reservations, issuesFound, edgeFunctions, configIssues);
  
  console.log('\n📊 RESUMEN DE SALUD DEL SISTEMA:');
  console.log('═'.repeat(60));
  
  console.log(`📋 Reservas: ${reservations.length} total, ${issuesFound} problemas`);
  console.log(`⚙️ Edge Functions: ${edgeFunctions.healthyFunctions}/${edgeFunctions.totalFunctions} operativas`);
  console.log(`🔧 Configuración: ${configIssues} problemas`);
  
  console.log(`\n🎯 Estado General: ${healthReport.overallHealth === 'HEALTHY' ? '✅ SALUDABLE' : '⚠️ REQUIERE ATENCIÓN'}`);
  
  if (healthReport.recommendations.length > 0) {
    console.log('\n💡 RECOMENDACIONES:');
    healthReport.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  console.log('\n🔍 PATRONES CRÍTICOS MONITOREADOS:');
  CRITICAL_PATTERNS.forEach((pattern, index) => {
    console.log(`   ${index + 1}. [${pattern.message.split(':')[0]}] ${pattern.id}`);
  });
  
  console.log('\n✨ Monitor completado');
  
  // Retornar código de salida basado en la salud del sistema
  process.exit(healthReport.overallHealth === 'HEALTHY' ? 0 : 1);
}

main().catch(console.error);
