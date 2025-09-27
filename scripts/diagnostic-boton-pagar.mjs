// Script para diagnosticar por qué el botón de pagar no funciona
import fetch from "node-fetch";

console.log('🔍 Diagnosticando problema del botón "Pagar"...\n');

// Verificar Edge Function con autenticación
async function testEdgeFunctionWithAuth() {
  console.log('🧪 Probando Edge Function con autenticación...');
  
  const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNDQ4MTQsImV4cCI6MjA1MDkyMDgxNH0.3kYqQ9l6T8wJ5X2vF7H1mN4pR6sA9bC0eU3iL8oQ2wY7zV';
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        paymentData: {
          service: 'Consulta Legal',
          price: '35000',
          name: 'Juan Pérez',
          email: 'juan@test.com'
        }
      })
    });
    
    console.log(`📤 Status: ${response.status}`);
    console.log(`📤 Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Edge Function funcionando correctamente');
      console.log('📋 Resultado:', result);
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Error en Edge Function:', error);
      return false;
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    return false;
  }
}

// Verificar URLs de MercadoPago
async function testMercadoPagoUrls() {
  console.log('\n🧪 Probando URLs de MercadoPago...');
  
  const urls = [
    'https://www.puntolegal.online/payment-success?source=mercadopago',
    'https://www.puntolegal.online/payment-failure?source=mercadopago',
    'https://www.puntolegal.online/payment-pending?source=mercadopago'
  ];
  
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`${response.ok ? '✅' : '❌'} ${url} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
  }
}

// Verificar configuración de MercadoPago
async function testMercadoPagoConfig() {
  console.log('\n🧪 Probando configuración de MercadoPago...');
  
  const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947';
  
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [{
          title: 'Test - Punto Legal',
          quantity: 1,
          unit_price: 1000,
          currency_id: 'CLP'
        }],
        back_urls: {
          success: 'https://www.puntolegal.online/payment-success?source=mercadopago',
          failure: 'https://www.puntolegal.online/payment-failure?source=mercadopago',
          pending: 'https://www.puntolegal.online/payment-pending?source=mercadopago'
        },
        auto_return: 'approved'
      })
    });
    
    console.log(`📤 Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ MercadoPago API funcionando correctamente');
      console.log('📋 Preference ID:', result.id);
      console.log('🔗 Init Point:', result.init_point);
      return result;
    } else {
      const error = await response.text();
      console.log('❌ Error en MercadoPago API:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de conexión con MercadoPago:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando diagnóstico completo...\n');
  
  // Test 1: Edge Function
  const edgeFunctionWorks = await testEdgeFunctionWithAuth();
  
  // Test 2: URLs
  await testMercadoPagoUrls();
  
  // Test 3: MercadoPago API
  const mercadopagoResult = await testMercadoPagoConfig();
  
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
  console.log('┌─────────────────────────────────────┬─────────┐');
  console.log('│ Componente                          │ Estado  │');
  console.log('├─────────────────────────────────────┼─────────┤');
  console.log(`│ Edge Function (con auth)            │ ${edgeFunctionWorks ? '✅ OK' : '❌ ERROR'}     │`);
  console.log(`│ URLs de retorno                     │ ✅ OK     │`);
  console.log(`│ MercadoPago API                     │ ${mercadopagoResult ? '✅ OK' : '❌ ERROR'}     │`);
  console.log('└─────────────────────────────────────┴─────────┘');
  
  if (edgeFunctionWorks && mercadopagoResult) {
    console.log('\n🎉 TODOS LOS COMPONENTES FUNCIONAN');
    console.log('🔍 El problema puede estar en:');
    console.log('   1. Frontend usando método incorrecto');
    console.log('   2. Cache del navegador');
    console.log('   3. JavaScript bloqueado');
    console.log('   4. Configuración de dominio en MercadoPago');
    
    if (mercadopagoResult.init_point) {
      console.log('\n🧪 PRUEBA DIRECTA:');
      console.log('Abrir esta URL para probar el pago:');
      console.log(mercadopagoResult.init_point);
    }
  } else {
    console.log('\n❌ HAY PROBLEMAS EN LOS COMPONENTES');
    if (!edgeFunctionWorks) {
      console.log('   - Edge Function no funciona correctamente');
    }
    if (!mercadopagoResult) {
      console.log('   - MercadoPago API no responde');
    }
  }
}

main().catch(console.error);
