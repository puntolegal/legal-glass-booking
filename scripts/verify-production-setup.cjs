#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN DE PRODUCCIÓN');
console.log('==============================================');
console.log('');

// Verificar archivo .env
const envPath = path.join(process.cwd(), '.env');
let envConfig = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envConfig[key.trim()] = value.trim();
    }
  });
  console.log('✅ Archivo .env encontrado');
} else {
  console.log('❌ Archivo .env no encontrado');
}

console.log('');
console.log('📋 VERIFICACIÓN DE CREDENCIALES:');
console.log('===============================');

// Verificar Public Key
const publicKey = envConfig['VITE_MERCADOPAGO_PUBLIC_KEY'];
if (publicKey && publicKey.startsWith('APP_USR-e02e0cc8')) {
  console.log('✅ Public Key de PRODUCCIÓN configurado');
  console.log(`   ${publicKey.substring(0, 30)}...`);
} else if (publicKey && publicKey.startsWith('APP_USR-a7d7e95c')) {
  console.log('⚠️  Public Key de PRUEBA detectado');
  console.log('   Cambia a credenciales de producción');
} else {
  console.log('❌ Public Key no configurado o inválido');
}

// Verificar Access Token
const accessToken = envConfig['MERCADOPAGO_ACCESS_TOKEN'];
if (accessToken && accessToken.startsWith('APP_USR-57706641806639')) {
  console.log('✅ Access Token de PRODUCCIÓN configurado');
  console.log(`   ${accessToken.substring(0, 30)}...`);
} else if (accessToken && accessToken.startsWith('APP_USR-4010337867785275')) {
  console.log('⚠️  Access Token de PRUEBA detectado');
  console.log('   Cambia a credenciales de producción');
} else {
  console.log('❌ Access Token no configurado o inválido');
}

// Verificar entorno
const environment = envConfig['MERCADOPAGO_ENVIRONMENT'];
if (environment === 'production') {
  console.log('✅ Entorno configurado como PRODUCCIÓN');
} else {
  console.log('⚠️  Entorno no configurado o no es producción');
}

console.log('');
console.log('🔧 VERIFICACIÓN DE ARCHIVOS:');
console.log('============================');

// Verificar configuración de MercadoPago
const configPath = path.join(process.cwd(), 'src', 'config', 'mercadopago.ts');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  if (configContent.includes('APP_USR-e02e0cc8')) {
    console.log('✅ Configuración de MercadoPago actualizada');
  } else {
    console.log('⚠️  Configuración de MercadoPago necesita actualización');
  }
} else {
  console.log('❌ Archivo de configuración no encontrado');
}

// Verificar Edge Function
const edgeFunctionPath = path.join(process.cwd(), 'supabase', 'functions', 'create-mercadopago-preference', 'index.ts');
if (fs.existsSync(edgeFunctionPath)) {
  const functionContent = fs.readFileSync(edgeFunctionPath, 'utf8');
  if (functionContent.includes('APP_USR-57706641806639')) {
    console.log('✅ Edge Function actualizado para producción');
  } else {
    console.log('⚠️  Edge Function necesita actualización');
  }
} else {
  console.log('⚠️  Edge Function no encontrado (opcional)');
}

console.log('');
console.log('🚀 ESTADO GENERAL:');
console.log('==================');

const hasProductionPublicKey = publicKey && publicKey.startsWith('APP_USR-e02e0cc8');
const hasProductionAccessToken = accessToken && accessToken.startsWith('APP_USR-57706641806639');
const hasProductionEnv = environment === 'production';

if (hasProductionPublicKey && hasProductionAccessToken) {
  console.log('✅ CONFIGURACIÓN DE PRODUCCIÓN COMPLETA');
  console.log('');
  console.log('🎯 PRÓXIMOS PASOS:');
  console.log('• Reinicia el servidor si no lo has hecho');
  console.log('• Prueba con tarjetas de prueba');
  console.log('• Verifica que los pagos se procesen correctamente');
  console.log('• Configura webhooks para notificaciones');
} else {
  console.log('❌ CONFIGURACIÓN INCOMPLETA');
  console.log('');
  console.log('🔧 ACCIONES REQUERIDAS:');
  if (!hasProductionPublicKey) {
    console.log('• Configurar Public Key de producción');
  }
  if (!hasProductionAccessToken) {
    console.log('• Configurar Access Token de producción');
  }
  if (!hasProductionEnv) {
    console.log('• Configurar MERCADOPAGO_ENVIRONMENT=production');
  }
}

console.log('');
console.log('⚠️  RECORDATORIO DE SEGURIDAD:');
console.log('==============================');
console.log('• Ahora se procesarán PAGOS REALES');
console.log('• Usa solo tarjetas de prueba para testing');
console.log('• Verifica todas las transacciones');
console.log('• Mantén las credenciales seguras');
console.log('');
