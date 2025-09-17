#!/usr/bin/env node

/**
 * Script para verificar y configurar Supabase correctamente
 * Verifica las credenciales y la conectividad
 */

const https = require('https');

console.log('🔍 Verificando configuración de Supabase...\n');

// Credenciales proporcionadas por el usuario
const CREDENTIALS = {
  SECRET_KEY: 'sb_secret_3iFfSjSLf7OC5ewkCLLmVQ_jnsyd0UI',
  PUBLISHABLE_KEY: 'sb_publishable_nEzZtRLnXmnOGNJgNU3gMQ_1yGhX0l9'
};

// Extraer project ref de la publishable key
const extractProjectRef = (key) => {
  const parts = key.split('_');
  if (parts.length >= 3) {
    return parts[2];
  }
  return null;
};

const projectRef = extractProjectRef(CREDENTIALS.PUBLISHABLE_KEY);
console.log('📋 ANÁLISIS DE CREDENCIALES:');
console.log('🔑 Publishable Key:', CREDENTIALS.PUBLISHABLE_KEY);
console.log('🔐 Secret Key:', CREDENTIALS.SECRET_KEY);
console.log('🎯 Project Ref extraído:', projectRef);

if (!projectRef) {
  console.error('❌ No se pudo extraer el project ref de la publishable key');
  process.exit(1);
}

// Generar URL de Supabase
const supabaseUrl = `https://${projectRef.toLowerCase()}.supabase.co`;
console.log('🌐 URL de Supabase:', supabaseUrl);

// Función para probar conectividad
const testConnection = (url, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'punto-legal-verification/1.0',
        ...headers
      },
      timeout: 5000
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(5000);
    req.end();
  });
};

// Probar diferentes endpoints
const testEndpoints = async () => {
  console.log('\n🧪 PROBANDO CONECTIVIDAD:');
  
  const endpoints = [
    {
      name: 'Supabase REST API',
      url: `${supabaseUrl}/rest/v1/`,
      headers: {
        'apikey': CREDENTIALS.PUBLISHABLE_KEY,
        'Authorization': `Bearer ${CREDENTIALS.PUBLISHABLE_KEY}`
      }
    },
    {
      name: 'Supabase Health Check',
      url: `${supabaseUrl}/rest/v1/health`,
      headers: {
        'apikey': CREDENTIALS.PUBLISHABLE_KEY
      }
    },
    {
      name: 'Supabase Auth',
      url: `${supabaseUrl}/auth/v1/health`,
      headers: {
        'apikey': CREDENTIALS.PUBLISHABLE_KEY
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Probando: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      
      const result = await testConnection(endpoint.url, endpoint.headers);
      
      console.log(`   ✅ Status: ${result.status}`);
      if (result.status === 200) {
        console.log(`   ✅ Conectividad exitosa`);
      } else if (result.status === 401) {
        console.log(`   ⚠️  No autorizado (credenciales incorrectas)`);
      } else if (result.status === 404) {
        console.log(`   ⚠️  Endpoint no encontrado`);
      } else {
        console.log(`   ⚠️  Respuesta inesperada`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      if (error.code === 'ENOTFOUND') {
        console.log(`   ❌ El dominio no existe o no es accesible`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`   ❌ Conexión rechazada`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`   ❌ Timeout de conexión`);
      }
    }
  }
};

// Verificar formato de credenciales
const verifyCredentialFormat = () => {
  console.log('\n🔍 VERIFICANDO FORMATO DE CREDENCIALES:');
  
  // Verificar publishable key
  if (CREDENTIALS.PUBLISHABLE_KEY.startsWith('sb_publishable_')) {
    console.log('✅ Formato de Publishable Key correcto');
  } else {
    console.log('❌ Formato de Publishable Key incorrecto');
    console.log('   Debe empezar con: sb_publishable_');
  }
  
  // Verificar secret key
  if (CREDENTIALS.SECRET_KEY.startsWith('sb_secret_')) {
    console.log('✅ Formato de Secret Key correcto');
  } else {
    console.log('❌ Formato de Secret Key incorrecto');
    console.log('   Debe empezar con: sb_secret_');
  }
  
  // Verificar que ambas keys tengan el mismo project ref
  const pubRef = extractProjectRef(CREDENTIALS.PUBLISHABLE_KEY);
  const secRef = extractProjectRef(CREDENTIALS.SECRET_KEY);
  
  if (pubRef === secRef) {
    console.log('✅ Project Ref coincide en ambas keys');
  } else {
    console.log('❌ Project Ref NO coincide entre las keys');
    console.log(`   Publishable: ${pubRef}`);
    console.log(`   Secret: ${secRef}`);
  }
};

// Generar configuración para archivos
const generateConfig = () => {
  console.log('\n📝 CONFIGURACIÓN RECOMENDADA:');
  
  console.log('\n📄 Para .env:');
  console.log(`VITE_SUPABASE_URL=${supabaseUrl}`);
  console.log(`VITE_SUPABASE_ANON_KEY=${CREDENTIALS.PUBLISHABLE_KEY}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY=${CREDENTIALS.SECRET_KEY}`);
  
  console.log('\n📄 Para src/integrations/supabase/client.ts:');
  console.log(`const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "${supabaseUrl}";`);
  console.log(`const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "${CREDENTIALS.PUBLISHABLE_KEY}";`);
};

// Ejecutar todas las verificaciones
const main = async () => {
  try {
    verifyCredentialFormat();
    await testEndpoints();
    generateConfig();
    
    console.log('\n🎯 RECOMENDACIONES:');
    console.log('1. Verifica que el proyecto de Supabase esté activo');
    console.log('2. Confirma que las credenciales sean correctas');
    console.log('3. Asegúrate de que el proyecto no esté pausado');
    console.log('4. Revisa la configuración de RLS en las tablas');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    process.exit(1);
  }
};

// Ejecutar
main();
