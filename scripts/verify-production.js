#!/usr/bin/env node

/**
 * Script para verificar la configuración de producción
 * Ejecutar: node scripts/verify-production.js
 */

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE PRODUCCIÓN - PUNTO LEGAL\n');

// Verificar variables de entorno
function checkEnvironmentVariables() {
  console.log('📋 1. Verificando Variables de Entorno...');
  
  const requiredVars = [
    'VITE_MERCADOPAGO_ACCESS_TOKEN',
    'VITE_MERCADOPAGO_PUBLIC_KEY',
    'VITE_RESEND_API_KEY',
    'VITE_MAIL_FROM',
    'VITE_ADMIN_EMAIL',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
      console.log(`❌ ${varName}: No configurada`);
    } else {
      console.log(`✅ ${varName}: Configurada (${value.substring(0, 20)}...)`);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`\n⚠️ Variables faltantes: ${missingVars.join(', ')}`);
    console.log('📝 Configura estas variables en tu plataforma de hosting:');
    console.log('   - Vercel: Settings → Environment Variables');
    console.log('   - Netlify: Site settings → Environment variables');
    return false;
  }
  
  console.log('✅ Todas las variables de entorno están configuradas');
  return true;
}

// Verificar configuración de MercadoPago
function checkMercadoPagoConfig() {
  console.log('\n💳 2. Verificando Configuración de MercadoPago...');
  
  const accessToken = process.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
  const publicKey = process.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  
  if (!accessToken || !publicKey) {
    console.log('❌ Credenciales de MercadoPago no configuradas');
    return false;
  }
  
  // Verificar formato de las credenciales
  if (!accessToken.startsWith('APP_USR-')) {
    console.log('❌ ACCESS_TOKEN no tiene formato válido');
    return false;
  }
  
  if (!publicKey.startsWith('APP_USR-')) {
    console.log('❌ PUBLIC_KEY no tiene formato válido');
    return false;
  }
  
  console.log('✅ Credenciales de MercadoPago válidas');
  return true;
}

// Verificar configuración de Resend
function checkResendConfig() {
  console.log('\n📧 3. Verificando Configuración de Resend...');
  
  const apiKey = process.env.VITE_RESEND_API_KEY;
  const mailFrom = process.env.VITE_MAIL_FROM;
  const adminEmail = process.env.VITE_ADMIN_EMAIL;
  
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY no configurada');
    return false;
  }
  
  if (!apiKey.startsWith('re_')) {
    console.log('❌ RESEND_API_KEY no tiene formato válido');
    return false;
  }
  
  if (!mailFrom) {
    console.log('❌ MAIL_FROM no configurado');
    return false;
  }
  
  if (!adminEmail) {
    console.log('❌ ADMIN_EMAIL no configurado');
    return false;
  }
  
  console.log('✅ Configuración de Resend válida');
  return true;
}

// Verificar configuración de Supabase
function checkSupabaseConfig() {
  console.log('\n🗄️ 4. Verificando Configuración de Supabase...');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    console.log('❌ SUPABASE_URL no configurada');
    return false;
  }
  
  if (!supabaseKey) {
    console.log('❌ SUPABASE_ANON_KEY no configurada');
    return false;
  }
  
  if (!supabaseUrl.startsWith('https://')) {
    console.log('❌ SUPABASE_URL no tiene formato válido');
    return false;
  }
  
  console.log('✅ Configuración de Supabase válida');
  return true;
}

// Verificar URLs de producción
function checkProductionUrls() {
  console.log('\n🌐 5. Verificando URLs de Producción...');
  
  const expectedUrls = [
    'https://puntolegal.online/payment-success',
    'https://puntolegal.online/payment-failure',
    'https://puntolegal.online/payment-pending',
    'https://puntolegal.online/api/mercadopago/webhook'
  ];
  
  console.log('📝 URLs que deben estar configuradas en MercadoPago:');
  expectedUrls.forEach(url => {
    console.log(`   ✅ ${url}`);
  });
  
  console.log('\n📝 Verificar en MercadoPago Dashboard:');
  console.log('   1. Desarrolladores → Aplicaciones');
  console.log('   2. Tu aplicación → Configuración');
  console.log('   3. URLs de notificación');
  console.log('   4. Agregar las URLs de arriba');
  
  return true;
}

// Función principal
async function runVerification() {
  const envOk = checkEnvironmentVariables();
  const mpOk = checkMercadoPagoConfig();
  const resendOk = checkResendConfig();
  const supabaseOk = checkSupabaseConfig();
  const urlsOk = checkProductionUrls();
  
  console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
  console.log('========================');
  console.log(`Variables de Entorno: ${envOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`MercadoPago: ${mpOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Resend: ${resendOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Supabase: ${supabaseOk ? '✅ OK' : '❌ ERROR'}`);
  console.log(`URLs de Producción: ${urlsOk ? '✅ OK' : '❌ ERROR'}`);
  
  if (envOk && mpOk && resendOk && supabaseOk && urlsOk) {
    console.log('\n🎉 ¡CONFIGURACIÓN DE PRODUCCIÓN COMPLETA!');
    console.log('🚀 El sistema está listo para funcionar en producción');
  } else {
    console.log('\n⚠️ ALGUNAS CONFIGURACIONES FALTAN');
    console.log('❌ Revisar los errores anteriores y configurar las variables faltantes');
  }
}

// Ejecutar verificación
runVerification().catch(console.error);
