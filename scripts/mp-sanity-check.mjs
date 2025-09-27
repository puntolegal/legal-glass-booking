// Script de verificación de Checkout Pro de MercadoPago
// Crea una preferencia de prueba para validar configuración

import fetch from "node-fetch";
import assert from "node:assert";
import dotenv from "dotenv";

// Cargar variables de entorno (backend y frontend)
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

console.log("🔍 Verificando Checkout Pro de MercadoPago...");

// Determinar entorno
const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.MODE === 'production' ||
                    (process.env.VITE_APP_BASE_URL || process.env.VITE_APP_URL || '').includes('puntolegal.online');

const MP_ENV = isProduction ? 'production' : 'sandbox';
console.log(`📋 Entorno: ${MP_ENV}`);

// Obtener credenciales (alineado al backend del repo)
const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
assert(token, "No hay MERCADOPAGO_ACCESS_TOKEN configurado");

// Obtener URLs
const baseUrl = process.env.VITE_APP_URL || process.env.VITE_APP_BASE_URL || 'https://www.puntolegal.online';
const successUrl = process.env.VITE_SUCCESS_URL || `${baseUrl}/payment-success?source=mercadopago`;
const failureUrl = process.env.VITE_FAILURE_URL || `${baseUrl}/payment-failure?source=mercadopago`;
const pendingUrl = process.env.VITE_PENDING_URL || `${baseUrl}/payment-pending?source=mercadopago`;
const webhookUrl = process.env.MP_WEBHOOK_URL || `${baseUrl}/api/mercadopago/webhook`;

console.log("📋 URLs configuradas:");
console.log(`  Success: ${successUrl}`);
console.log(`  Failure: ${failureUrl}`);
console.log(`  Pending: ${pendingUrl}`);
console.log(`  Webhook: ${webhookUrl}`);

// Crear preferencia de prueba
const preferenceBody = {
  items: [
    {
      title: "Test de configuración - Punto Legal",
      quantity: 1,
      unit_price: 1000, // $1,000 CLP
      currency_id: "CLP"
    }
  ],
  payer: {
    name: "Test User",
    email: "test@puntolegal.online"
  },
  back_urls: {
    success: successUrl,
    failure: failureUrl,
    pending: pendingUrl
  },
  // auto_return: "approved", // Deshabilitado para desarrollo local
  external_reference: `TEST-${Date.now()}`,
  notification_url: webhookUrl,
  binary_mode: true
};

console.log("🚀 Creando preferencia de prueba...");

try {
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(preferenceBody)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Error al crear preferencia:");
    console.error("Status:", response.status);
    console.error("Response:", JSON.stringify(data, null, 2));
    
    // Análisis específico de errores comunes
    if (data.message) {
      console.error("Mensaje de error:", data.message);
    }
    
    if (data.cause) {
      console.error("Causa:", data.cause);
    }
    
    if (data.status === 400) {
      console.error("💡 Error 400 - Revisar:");
      console.error("  - URLs de retorno deben ser HTTPS");
      console.error("  - Token debe ser válido");
      console.error("  - Datos de la preferencia deben ser correctos");
    }
    
    if (data.status === 401) {
      console.error("💡 Error 401 - Token inválido o expirado");
    }
    
    process.exit(1);
  }

  console.log("✅ Preferencia creada exitosamente!");
  console.log("📋 Detalles:");
  console.log(`  ID: ${data.id}`);
  console.log(`  Status: ${data.status}`);
  console.log(`  Live Mode: ${data.live_mode}`);
  console.log(`  External Reference: ${data.external_reference}`);

  // Mostrar URL de redirección correcta
  // Determinar URL de redirección según token/entorno real
  const looksLikeProd = token.startsWith('APP_USR-');
  const redirectUrl = (isProduction || looksLikeProd) ? data.init_point : (data.sandbox_init_point || data.init_point);
  console.log(`🔗 URL de redirección: ${redirectUrl}`);

  // Verificar que las URLs sean correctas
  if ((isProduction || looksLikeProd) && !data.init_point) {
    console.error("❌ Error: No se generó init_point para producción");
    process.exit(1);
  }

  if (!(isProduction || looksLikeProd) && !data.sandbox_init_point) {
    console.error("❌ Error: No se generó sandbox_init_point para sandbox");
    process.exit(1);
  }

  console.log("\n🎉 Verificación completada exitosamente!");
  console.log("💡 Para probar el flujo completo:");
  console.log(`   1. Abrir: ${redirectUrl}`);
  console.log("   2. Usar tarjeta de prueba:");
  console.log("      - Número: 4509 9535 6623 3704");
  console.log("      - CVV: 123");
  console.log("      - Vencimiento: 11/25");

} catch (error) {
  console.error("❌ Error de red o conexión:", error.message);
  process.exit(1);
}
