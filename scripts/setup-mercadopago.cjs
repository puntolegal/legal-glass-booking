#!/usr/bin/env node

// Script para configurar MercadoPago automáticamente
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando MercadoPago para Punto Legal...');

// Credenciales oficiales
const MERCADOPAGO_CREDENTIALS = {
  PUBLIC_KEY: 'APP_USR-a7d7e95c-653a-43bf-8a4d-2ab7b2ea30d3',
  ACCESS_TOKEN: 'APP_USR-4010337867785275-091313-920eb61517cac97567e501a9b30592eb-2685419265'
};

// Configuración del archivo .env
const ENV_CONTENT = `# Configuración de MercadoPago - Punto Legal
# Credenciales oficiales de la aplicación "Mercado Pago Punto Legal"
VITE_MERCADOPAGO_PUBLIC_KEY=${MERCADOPAGO_CREDENTIALS.PUBLIC_KEY}
MERCADOPAGO_ACCESS_TOKEN=${MERCADOPAGO_CREDENTIALS.ACCESS_TOKEN}

# Configuración de la aplicación
VITE_APP_NAME=Punto Legal
VITE_APP_URL=http://localhost:8081
VITE_ADMIN_EMAIL=puntolegalelgolf@gmail.com

# Configuración adicional (opcional)
# VITE_SUPABASE_URL=tu-url-de-supabase
# VITE_SUPABASE_ANON_KEY=tu-anon-key
# VITE_MAKE_WEBHOOK_URL=tu-webhook-de-make
`;

// Ruta del archivo .env
const envPath = path.join(process.cwd(), '.env');

try {
  // Verificar si ya existe .env
  if (fs.existsSync(envPath)) {
    console.log('⚠️  Archivo .env ya existe');
    console.log('📝 Creando backup como .env.backup');
    fs.copyFileSync(envPath, path.join(process.cwd(), '.env.backup'));
  }

  // Crear/actualizar archivo .env
  fs.writeFileSync(envPath, ENV_CONTENT);
  
  console.log('✅ Archivo .env configurado exitosamente');
  console.log('🔑 Credenciales de MercadoPago configuradas');
  console.log('');
  console.log('🚀 Próximos pasos:');
  console.log('1. Ejecutar: npm run dev');
  console.log('2. Ir a: http://localhost:8080/agendamiento');
  console.log('3. Probar el flujo de pago completo');
  console.log('');
  console.log('💳 Tarjetas de prueba:');
  console.log('- VISA: 4509 9535 6623 3704 (CVV: 123, Fecha: 11/25)');
  console.log('- Mastercard: 5031 7557 3453 0604 (CVV: 123, Fecha: 11/25)');
  console.log('');
  console.log('✅ ¡MercadoPago listo para usar!');
  
} catch (error) {
  console.error('❌ Error configurando MercadoPago:', error.message);
  process.exit(1);
}
