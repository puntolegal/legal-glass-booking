#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO: Agendamiento por teléfono
 * Verifica los problemas más comunes cuando se agenda por teléfono
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 DIAGNÓSTICO: Agendamiento por teléfono\n');

async function diagnosticarAgendamientoTelefono() {
  try {
    // 1. Verificar reservas recientes sin emails enviados
    console.log('📋 1. Verificando reservas recientes sin emails...');
    const { data: reservasSinEmail, error: errorReservas } = await supabase
      .from('reservas')
      .select('*')
      .eq('email_enviado', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (errorReservas) {
      console.error('❌ Error obteniendo reservas:', errorReservas);
    } else {
      console.log(`✅ Encontradas ${reservasSinEmail.length} reservas sin emails:`);
      reservasSinEmail.forEach(reserva => {
        console.log(`   📅 ${reserva.fecha} ${reserva.hora} - ${reserva.nombre} (${reserva.email})`);
        console.log(`   💳 Pago: ${reserva.pago_estado || 'No especificado'} | Email: ${reserva.email_enviado ? '✅' : '❌'}`);
        console.log(`   🔗 External Reference: ${reserva.external_reference || 'No especificado'}`);
        console.log('');
      });
    }

    // 2. Verificar Edge Functions
    console.log('🔧 2. Verificando Edge Functions...');
    
    // Test webhook
    try {
      const webhookResponse = await fetch(`${SUPABASE_URL}/functions/v1/mercadopago-webhook`, {
        method: 'OPTIONS'
      });
      console.log(`✅ Webhook disponible: ${webhookResponse.status}`);
    } catch (error) {
      console.error('❌ Webhook no disponible:', error.message);
    }

    // Test clever-action
    try {
      const cleverResponse = await fetch(`${SUPABASE_URL}/functions/v1/clever-action`, {
        method: 'OPTIONS'
      });
      console.log(`✅ Clever-action disponible: ${cleverResponse.status}`);
    } catch (error) {
      console.error('❌ Clever-action no disponible:', error.message);
    }

    // Test create-preference
    try {
      const preferenceResponse = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-preference`, {
        method: 'OPTIONS'
      });
      console.log(`✅ Create-preference disponible: ${preferenceResponse.status}`);
    } catch (error) {
      console.error('❌ Create-preference no disponible:', error.message);
    }

    // 3. Verificar configuración de MercadoPago
    console.log('\n💳 3. Verificando configuración de MercadoPago...');
    
    // Simular una preferencia de prueba
    const testPreference = {
      items: [{
        title: 'Test - Punto Legal',
        quantity: 1,
        unit_price: 1000,
        currency_id: 'CLP'
      }],
      payer: {
        email: 'test@example.com',
        name: 'Test User'
      },
      external_reference: `test-${Date.now()}`,
      back_urls: {
        success: 'https://puntolegal.online/payment-success?source=mercadopago',
        failure: 'https://puntolegal.online/payment-failure?source=mercadopago',
        pending: 'https://puntolegal.online/payment-pending?source=mercadopago'
      },
      auto_return: 'approved',
      notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`
    };

    console.log('📋 Datos de preferencia de prueba:');
    console.log(JSON.stringify(testPreference, null, 2));

    // 4. Recomendaciones
    console.log('\n🎯 4. RECOMENDACIONES:');
    console.log('   ✅ Verificar que las variables de entorno estén configuradas en Supabase');
    console.log('   ✅ Desplegar la Edge Function actualizada del webhook');
    console.log('   ✅ Verificar que clever-action esté funcionando');
    console.log('   ✅ Comprobar que las back_urls apunten a puntolegal.online');
    console.log('   ✅ Verificar que auto_return esté en "approved"');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
}

// Ejecutar diagnóstico
diagnosticarAgendamientoTelefono();
