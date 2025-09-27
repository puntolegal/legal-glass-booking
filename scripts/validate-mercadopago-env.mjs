// Validación de variables de entorno de MercadoPago (alineado al repo)
// Uso: node scripts/validate-mercadopago-env.mjs [--online]

import assert from "node:assert";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Cargar frontend (.env.local) y backend (.env) sin romper si falta alguno
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const ONLINE = process.argv.includes('--online');

function must(name, msg) {
  const v = process.env[name];
  assert(v && v.trim().length > 0, msg || `Falta ${name}`);
  return v.trim();
}

function httpsUrlOr(name, fallback) {
  const v = process.env[name] || fallback;
  assert(/^https?:\/\//.test(v), `${name} debe ser URL válida`);
  if (v.startsWith('http://')) {
    console.warn(`⚠️ ${name} es HTTP (ok en local), usa HTTPS en producción`);
  }
  return v;
}

console.log('🔍 Validando configuración de MercadoPago…');

const baseUrl = process.env.VITE_APP_URL || process.env.VITE_APP_BASE_URL || 'http://localhost:8080';
const isProduction = (process.env.NODE_ENV === 'production')
  || (process.env.MODE === 'production')
  || /puntolegal\.online$/.test(baseUrl);

const publicKey = must('VITE_MERCADOPAGO_PUBLIC_KEY', 'Falta VITE_MERCADOPAGO_PUBLIC_KEY (frontend)');
const accessToken = must('MERCADOPAGO_ACCESS_TOKEN', 'Falta MERCADOPAGO_ACCESS_TOKEN (backend)');

console.log('✅ Encontradas variables básicas');

// Prefijos esperados por entorno
const expectedPkPrefix = isProduction ? 'APP_USR-' : 'TEST-';
const expectedAtPrefix = isProduction ? 'APP_USR-' : 'TEST-';

if (!publicKey.startsWith(expectedPkPrefix)) {
  console.warn(`⚠️ VITE_MERCADOPAGO_PUBLIC_KEY debería empezar con ${expectedPkPrefix} para este entorno`);
}
if (!accessToken.startsWith(expectedAtPrefix)) {
  console.warn(`⚠️ MERCADOPAGO_ACCESS_TOKEN debería empezar con ${expectedAtPrefix} para este entorno`);
}

const successUrl = httpsUrlOr('VITE_SUCCESS_URL', `${baseUrl}/payment-success?source=mercadopago`);
const failureUrl = httpsUrlOr('VITE_FAILURE_URL', `${baseUrl}/payment-failure?source=mercadopago`);
const pendingUrl = httpsUrlOr('VITE_PENDING_URL', `${baseUrl}/payment-pending?source=mercadopago`);
const webhookUrl = httpsUrlOr('MP_WEBHOOK_URL', `${baseUrl}/api/mercadopago/webhook`);

console.log('✅ URLs de retorno y webhook válidas');

if (ONLINE) {
  console.log('🌐 --online: validando token contra API de MercadoPago…');
  try {
    const res = await fetch('https://api.mercadopago.com/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const me = await res.json();
    console.log('✅ Token válido para:', {
      id: me.id,
      nickname: me.nickname,
      site_id: me.site_id,
      country_id: me.country_id,
    });
  } catch (e) {
    console.error('❌ Error validando token:', e?.message || e);
    process.exit(1);
  }
}

console.log('\n🎉 Validación completada');
console.log(`📋 Entorno: ${isProduction ? 'production' : 'sandbox'}`);
console.log(`🌐 Base URL: ${baseUrl}`);
console.log('🔑 Public Key:', publicKey.substring(0, 16) + '…');
console.log('🔐 Access Token:', accessToken.substring(0, 16) + '…');
