#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO BOTÓN MERCADOPAGO
 * Script para identificar problemas comunes con el botón de pagar
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 DIAGNÓSTICO BOTÓN MERCADOPAGO');
console.log('================================\n');

// 1. Verificar variables de entorno
console.log('📋 1. VERIFICANDO VARIABLES DE ENTORNO:');
const envFiles = [
  '.env.local',
  '.env.production',
  'env-production-final'
];

let envContent = '';
for (const envFile of envFiles) {
  if (existsSync(envFile)) {
    console.log(`✅ Encontrado: ${envFile}`);
    envContent += readFileSync(envFile, 'utf8') + '\n';
  } else {
    console.log(`❌ No encontrado: ${envFile}`);
  }
}

// Extraer variables MercadoPago
const mercadopagoVars = {
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: '',
  MERCADOPAGO_ACCESS_TOKEN: '',
  NEXT_PUBLIC_SUPABASE_URL: '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ''
};

Object.keys(mercadopagoVars).forEach(key => {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  if (match) {
    mercadopagoVars[key] = match[1];
    console.log(`✅ ${key}: ${match[1].substring(0, 20)}...`);
  } else {
    console.log(`❌ ${key}: NO ENCONTRADA`);
  }
});

console.log('\n📋 2. VERIFICANDO CONFIGURACIÓN MERCADOPAGO:');
const mercadopagoConfigPath = 'src/config/mercadopago.ts';
if (existsSync(mercadopagoConfigPath)) {
  const config = readFileSync(mercadopagoConfigPath, 'utf8');
  console.log('✅ Archivo de configuración encontrado');
  
  // Verificar URLs
  const urls = {
    'back_urls success': config.includes('https://www.puntolegal.online/payment-success'),
    'back_urls failure': config.includes('https://www.puntolegal.online/payment-failure'),
    'back_urls pending': config.includes('https://www.puntolegal.online/payment-pending'),
    'notification_url': config.includes('https://puntolegal.online/supabase/functions/v1/mercadopago-webhook'),
    'auto_return': config.includes('approved')
  };
  
  Object.entries(urls).forEach(([key, value]) => {
    console.log(`${value ? '✅' : '❌'} ${key}: ${value ? 'Configurado' : 'FALTANTE'}`);
  });
} else {
  console.log('❌ Archivo de configuración NO encontrado');
}

console.log('\n📋 3. VERIFICANDO COMPONENTES MERCADOPAGO:');
const components = [
  'src/components/MercadoPagoOfficialButton.tsx',
  'src/components/MercadoPagoCheckoutPro.tsx',
  'src/services/mercadopagoDirect.ts'
];

components.forEach(component => {
  if (existsSync(component)) {
    const content = readFileSync(component, 'utf8');
    const hasErrors = content.includes('console.error') || content.includes('throw new Error');
    const hasUrls = content.includes('puntolegal.online');
    console.log(`✅ ${component}: ${hasErrors ? 'TIENE ERRORES' : 'OK'} | ${hasUrls ? 'URLs OK' : 'URLs FALTANTES'}`);
  } else {
    console.log(`❌ ${component}: NO ENCONTRADO`);
  }
});

console.log('\n📋 4. VERIFICANDO EDGE FUNCTIONS:');
const edgeFunctions = [
  'supabase/functions/create-mercadopago-preference/index.ts',
  'supabase/functions/mercadopago-webhook/index.ts'
];

edgeFunctions.forEach(func => {
  if (existsSync(func)) {
    const content = readFileSync(func, 'utf8');
    const hasCORS = content.includes('Access-Control-Allow-Origin');
    const hasAuth = content.includes('Authorization');
    console.log(`✅ ${func}: CORS=${hasCORS ? 'OK' : 'FALTANTE'} | AUTH=${hasAuth ? 'OK' : 'FALTANTE'}`);
  } else {
    console.log(`❌ ${func}: NO ENCONTRADO`);
  }
});

console.log('\n📋 5. VERIFICANDO BUILD:');
if (existsSync('dist')) {
  console.log('✅ Build encontrado');
  const indexHtml = join('dist', 'index.html');
  if (existsSync(indexHtml)) {
    const content = readFileSync(indexHtml, 'utf8');
    const hasJS = content.includes('.js');
    console.log(`✅ index.html: ${hasJS ? 'JavaScript incluido' : 'JavaScript FALTANTE'}`);
  }
} else {
  console.log('❌ Build NO encontrado - ejecutar: npm run build');
}

console.log('\n🔍 DIAGNÓSTICO COMPLETO');
console.log('========================');
console.log('Si hay ❌ en las verificaciones anteriores, esos son los problemas a corregir.');
console.log('Los errores más comunes son:');
console.log('1. Variables de entorno faltantes');
console.log('2. URLs incorrectas en configuración');
console.log('3. Edge Functions no desplegadas');
console.log('4. CORS mal configurado');
console.log('5. JavaScript errors en el build');
