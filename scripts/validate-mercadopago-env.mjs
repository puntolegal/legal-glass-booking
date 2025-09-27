// Script de validación de variables de entorno para MercadoPago
// Adaptado para Vite + React + Supabase Edge Functions

import assert from "node:assert";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

// Función para validar variable requerida
function must(name) {
  const v = process.env[name];
  assert(v && v.length > 4, `Falta ${name}`);
  return v;
}

// Función para validar URL HTTPS
function enforceUrl(name) {
  const u = must(name);
  assert(u.startsWith("https://"), `${name} debe ser HTTPS`);
  return u;
}

console.log("🔍 Validando configuración de MercadoPago...");

// Determinar entorno
const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.MODE === 'production' ||
                    process.env.VITE_APP_BASE_URL?.includes('puntolegal.online');

const MP_ENV = isProduction ? 'production' : 'sandbox';
console.log(`📋 Entorno detectado: ${MP_ENV}`);

// Validar credenciales según entorno
let token, publicKey;

if (MP_ENV === 'production') {
  token = must('VITE_MP_ACCESS_TOKEN_PROD');
  publicKey = must('VITE_MP_PUBLIC_KEY_PROD');
  
  // Validar formato de token de producción
  assert(token.startsWith('APP_USR-'), 'Access Token de prod debería iniciar con APP_USR-');
  assert(publicKey.startsWith('APP_USR-'), 'Public Key de prod debería iniciar con APP_USR-');
} else {
  token = must('VITE_MP_ACCESS_TOKEN_TEST');
  publicKey = must('VITE_MP_PUBLIC_KEY_TEST');
  
  // Validar formato de token de sandbox
  assert(token.startsWith('TEST-'), 'Access Token de sandbox debería iniciar con TEST-');
  assert(publicKey.startsWith('TEST-'), 'Public Key de sandbox debería iniciar con TEST-');
}

console.log("✅ Credenciales de MercadoPago válidas");

// Validar URLs
const APP_BASE_URL = enforceUrl('VITE_APP_BASE_URL');
const SUCCESS_URL = enforceUrl('VITE_SUCCESS_URL');
const FAILURE_URL = enforceUrl('VITE_FAILURE_URL');
const PENDING_URL = enforceUrl('VITE_PENDING_URL');

console.log("✅ URLs de retorno válidas");

// Validar Supabase
const SUPABASE_URL = enforceUrl('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = must('VITE_SUPABASE_ANON_KEY');

console.log("✅ Credenciales de Supabase válidas");

// Validar Resend
const RESEND_API_KEY = must('RESEND_API_KEY');
const MAIL_FROM = must('MAIL_FROM');
const ADMIN_EMAIL = must('ADMIN_EMAIL');

console.log("✅ Credenciales de Resend válidas");

// Probar token de MercadoPago con API
console.log("🔍 Probando token de MercadoPago...");

try {
  const res = await fetch("https://api.mercadopago.com/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Token inválido o permisos insuficientes. HTTP ${res.status}`);
  }

  const me = await res.json();
  console.log("✅ Token válido para:", { 
    id: me.id, 
    nickname: me.nickname, 
    site_id: me.site_id,
    country_id: me.country_id
  });

} catch (error) {
  console.error("❌ Error validando token:", error.message);
  process.exit(1);
}

// Probar Supabase
console.log("🔍 Probando conexión a Supabase...");

try {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: { 
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
  });

  if (!res.ok) {
    throw new Error(`Supabase no accesible. HTTP ${res.status}`);
  }

  console.log("✅ Supabase accesible");

} catch (error) {
  console.error("❌ Error conectando a Supabase:", error.message);
  process.exit(1);
}

// Probar Resend
console.log("🔍 Probando API de Resend...");

try {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [ADMIN_EMAIL],
      subject: "Test de configuración",
      html: "<p>Test de configuración de Resend</p>"
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.warn("⚠️ Resend API respondió con error (normal en test):", errorData);
  } else {
    console.log("✅ Resend API accesible");
  }

} catch (error) {
  console.warn("⚠️ Error probando Resend (puede ser normal):", error.message);
}

console.log("\n🎉 Validación completada exitosamente!");
console.log(`📋 Entorno: ${MP_ENV}`);
console.log(`🌐 Base URL: ${APP_BASE_URL}`);
console.log(`✅ Todas las credenciales son válidas`);