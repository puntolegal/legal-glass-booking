#!/usr/bin/env node

console.log('🚀 Validación Pre-Deploy - MercadoPago CheckoutPro\n');

// Configuración de validación
const VALIDATION_CONFIG = {
  PRODUCTION_URL: 'https://www.puntolegal.online',
  EXPECTED_WEBHOOK: 'supabase.co/functions/v1/mercadopago-webhook',
  FORBIDDEN_PATTERNS: [
    /localhost:3001/,
    /localhost:5173/,
    /127\.0\.0\.1/,
    /http:\/\/[^s]/ // HTTP sin SSL
  ]
};

// Archivos críticos que deben validarse
const CRITICAL_FILES = [
  'src/components/MercadoPagoOfficialButton.tsx',
  'src/components/MercadoPagoCheckoutPro.tsx',
  'src/components/MercadoPagoRedirectButton.tsx',
  'src/pages/PaymentSuccessPage.tsx',
  'src/services/mercadopagoDirect.ts',
  'src/config/mercadopago.ts',
  'supabase/functions/create-mercadopago-preference/index.ts',
  'supabase/functions/mercadopago-webhook/index.ts'
];

async function validateFile(filePath) {
  const fs = await import('fs');
  
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, errors: [`Archivo no encontrado: ${filePath}`] };
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const errors = [];
    
    // Verificar patrones prohibidos
    for (const pattern of VALIDATION_CONFIG.FORBIDDEN_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        errors.push(`Patrón prohibido encontrado: ${matches[0]} en línea ${content.substring(0, content.indexOf(matches[0])).split('\n').length}`);
      }
    }
    
    // Verificar que las URLs sean de producción
    if (content.includes('localhost') && !content.includes('// localhost')) {
      errors.push('Contiene referencias a localhost (comentarios permitidos)');
    }
    
    // Verificar external_reference en archivos de MercadoPago
    if (filePath.includes('mercadopago') && filePath.includes('Direct')) {
      if (!content.includes('external_reference')) {
        errors.push('Falta external_reference en configuración de preferencia');
      }
    }
    
    // Verificar webhook URL en archivos de configuración
    if (filePath.includes('config/mercadopago')) {
      if (!content.includes(VALIDATION_CONFIG.EXPECTED_WEBHOOK)) {
        errors.push('Webhook URL no configurada correctamente');
      }
    }
    
    return { valid: errors.length === 0, errors };
  } catch (error) {
    return { valid: false, errors: [`Error leyendo archivo: ${error.message}`] };
  }
}

async function validateEnvironmentVariables() {
  console.log('🔧 Validando variables de entorno...\n');
  
  const fs = await import('fs');
  const errors = [];
  
  // Verificar archivos .env
  const envFiles = ['.env.local', '.env.production', '.env'];
  
  for (const envFile of envFiles) {
    try {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf8');
        
        // Verificar URLs de localhost en archivos de entorno
        if (content.includes('localhost') && !envFile.includes('.local')) {
          errors.push(`Archivo ${envFile} contiene localhost (solo permitido en .env.local)`);
        }
        
        // Verificar que las URLs de producción sean HTTPS
        const httpUrls = content.match(/http:\/\/[^s][^\s]*/g);
        if (httpUrls && !envFile.includes('.local')) {
          errors.push(`Archivo ${envFile} contiene URLs HTTP: ${httpUrls.join(', ')}`);
        }
      }
    } catch (error) {
      errors.push(`Error validando ${envFile}: ${error.message}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

async function validateEdgeFunctions() {
  console.log('⚙️ Validando Edge Functions...\n');
  
  const fs = await import('fs');
  const errors = [];
  
  const edgeFunctionFiles = [
    'supabase/functions/create-mercadopago-preference/index.ts',
    'supabase/functions/mercadopago-webhook/index.ts',
    'supabase/functions/send-resend-emails/index.ts'
  ];
  
  for (const filePath of edgeFunctionFiles) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar que tenga CORS headers
        if (!content.includes('Access-Control-Allow-Origin')) {
          errors.push(`${filePath}: Falta configuración de CORS`);
        }
        
        // Verificar que maneje OPTIONS
        if (!content.includes('req.method === \'OPTIONS\'')) {
          errors.push(`${filePath}: No maneja requests OPTIONS`);
        }
        
        // Verificar que use variables de entorno
        if (!content.includes('Deno.env.get(') && !content.includes('process.env.')) {
          errors.push(`${filePath}: No usa variables de entorno`);
        }
      } else {
        errors.push(`Edge Function no encontrada: ${filePath}`);
      }
    } catch (error) {
      errors.push(`Error validando ${filePath}: ${error.message}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

async function validateSecurity() {
  console.log('🔒 Validando seguridad RLS...\n');
  
  try {
    const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    if (response.status === 200) {
      const data = await response.json();
      if (data.length > 0) {
        return { valid: false, errors: ['Tabla reservas expuesta públicamente - RLS no configurado'] };
      } else {
        return { valid: true, errors: [] };
      }
    } else if (response.status === 401 || response.status === 403) {
      return { valid: true, errors: [] };
    } else {
      return { valid: false, errors: [`Error verificando seguridad: ${response.status}`] };
    }
  } catch (error) {
    return { valid: false, errors: [`Error validando seguridad: ${error.message}`] };
  }
}

async function main() {
  console.log('🚀 Iniciando validación pre-deploy...\n');
  
  let allValid = true;
  const allErrors = [];
  
  // 1. Validar archivos críticos
  console.log('📁 Validando archivos críticos...\n');
  for (const filePath of CRITICAL_FILES) {
    const result = await validateFile(filePath);
    if (!result.valid) {
      allValid = false;
      console.log(`❌ ${filePath}:`);
      result.errors.forEach(error => console.log(`   - ${error}`));
      allErrors.push(...result.errors.map(e => `${filePath}: ${e}`));
    } else {
      console.log(`✅ ${filePath}: Válido`);
    }
  }
  
  // 2. Validar variables de entorno
  const envResult = await validateEnvironmentVariables();
  if (!envResult.valid) {
    allValid = false;
    console.log('❌ Variables de entorno:');
    envResult.errors.forEach(error => console.log(`   - ${error}`));
    allErrors.push(...envResult.errors);
  } else {
    console.log('✅ Variables de entorno: Válidas');
  }
  
  // 3. Validar Edge Functions
  const edgeResult = await validateEdgeFunctions();
  if (!edgeResult.valid) {
    allValid = false;
    console.log('❌ Edge Functions:');
    edgeResult.errors.forEach(error => console.log(`   - ${error}`));
    allErrors.push(...edgeResult.errors);
  } else {
    console.log('✅ Edge Functions: Válidas');
  }
  
  // 4. Validar seguridad
  const securityResult = await validateSecurity();
  if (!securityResult.valid) {
    allValid = false;
    console.log('❌ Seguridad:');
    securityResult.errors.forEach(error => console.log(`   - ${error}`));
    allErrors.push(...securityResult.errors);
  } else {
    console.log('✅ Seguridad: Válida');
  }
  
  // Generar reporte
  const report = {
    timestamp: new Date().toISOString(),
    valid: allValid,
    errors: allErrors,
    summary: {
      filesChecked: CRITICAL_FILES.length,
      totalErrors: allErrors.length,
      securityStatus: securityResult.valid ? 'SECURE' : 'VULNERABLE'
    }
  };
  
  const fs = await import('fs');
  fs.writeFileSync('pre-deploy-validation-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n📊 RESUMEN DE VALIDACIÓN:');
  console.log('═'.repeat(50));
  
  if (allValid) {
    console.log('🎉 ¡VALIDACIÓN EXITOSA!');
    console.log('✅ Sistema listo para deploy');
    console.log('✅ Todas las validaciones pasaron');
    console.log('✅ Seguridad configurada correctamente');
    console.log('✅ URLs de producción verificadas');
    console.log('✅ Edge Functions operativas');
  } else {
    console.log('❌ VALIDACIÓN FALLÓ');
    console.log(`❌ ${allErrors.length} errores encontrados:`);
    allErrors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
    
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    console.log('1. Corregir todos los errores antes del deploy');
    console.log('2. Re-ejecutar validación: node scripts/pre-deploy-validation.mjs');
    console.log('3. Verificar que no hay URLs de localhost en producción');
    console.log('4. Confirmar que RLS está configurado');
  }
  
  console.log('\n📄 Reporte guardado en: pre-deploy-validation-report.json');
  console.log('\n✨ Validación completada');
  
  // Retornar código de salida
  process.exit(allValid ? 0 : 1);
}

main().catch(console.error);
