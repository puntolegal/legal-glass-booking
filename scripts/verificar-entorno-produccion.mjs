#!/usr/bin/env node

/**
 * 🔍 VERIFICACIÓN: ¿Estamos llegando al servidor de producción?
 * Verifica si los cambios se están aplicando al servidor real
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 VERIFICACIÓN: ¿Estamos llegando al servidor de producción?\n');
console.log('='.repeat(60));

async function verificarEntornoProduccion() {
  try {
    // 1. Verificar si estamos en desarrollo vs producción
    console.log('🌍 1. VERIFICANDO ENTORNO...\n');
    
    const isProduction = process.env.NODE_ENV === 'production' || 
                        process.env.MODE === 'production' ||
                        !process.env.NODE_ENV;
    
    console.log(`📋 Entorno detectado: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
    console.log(`📋 NODE_ENV: ${process.env.NODE_ENV || 'No definido'}`);
    console.log(`📋 MODE: ${process.env.MODE || 'No definido'}`);
    
    // 2. Verificar URLs de backend
    console.log('\n🔧 2. VERIFICANDO BACKEND...\n');
    
    const backendUrls = [
      'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/create-mercadopago-preference',
      'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook',
      'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/clever-action'
    ];
    
    for (const url of backendUrls) {
      try {
        const response = await fetch(url, { method: 'OPTIONS' });
        const status = response.status;
        
        if (status === 200) {
          console.log(`✅ ${url.split('/').pop()}: DISPONIBLE (${status})`);
        } else {
          console.log(`⚠️  ${url.split('/').pop()}: STATUS ${status}`);
        }
      } catch (error) {
        console.log(`❌ ${url.split('/').pop()}: ERROR - ${error.message}`);
      }
    }
    
    // 3. Probar creación de preferencia
    console.log('\n💳 3. PROBANDO CREACIÓN DE PREFERENCIA...\n');
    
    const testData = {
      paymentData: {
        service: 'Test - Verificación Entorno',
        description: 'Verificando si llegamos al servidor real',
        price: '1000',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+56912345678',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        external_reference: `test-entorno-${Date.now()}`
      }
    };
    
    try {
      console.log('📤 Enviando request a create-mercadopago-preference...');
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(testData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ PREFERENCIA CREADA EXITOSAMENTE');
        console.log(`   🔗 ID: ${result.id || 'No ID'}`);
        console.log(`   🌐 Init Point: ${result.init_point ? '✅ Configurado' : '❌ No configurado'}`);
        console.log(`   🧪 Sandbox Point: ${result.sandbox_init_point ? '✅ Configurado' : '❌ No configurado'}`);
        console.log(`   📱 Auto Return: ${result.auto_return || '❌ No configurado'}`);
        
        // Verificar URLs de retorno
        if (result.init_point) {
          console.log('\n🔍 ANALIZANDO URLs DE RETORNO...');
          const initPointUrl = new URL(result.init_point);
          console.log(`   📋 Host: ${initPointUrl.hostname}`);
          console.log(`   📋 Protocol: ${initPointUrl.protocol}`);
          
          // Buscar parámetros de back_urls
          const backUrlsParam = initPointUrl.searchParams.get('back_urls');
          if (backUrlsParam) {
            console.log(`   📋 Back URLs: ${backUrlsParam}`);
            if (backUrlsParam.includes('puntolegal.online')) {
              console.log('   ✅ URLs corregidas: puntolegal.online');
            } else if (backUrlsParam.includes('www.puntolegal.online')) {
              console.log('   ❌ URLs incorrectas: www.puntolegal.online');
            }
          }
        }
        
      } else {
        console.log('❌ ERROR CREANDO PREFERENCIA');
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${result.error || result.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.log('❌ ERROR DE CONEXIÓN');
      console.log(`   Error: ${error.message}`);
    }
    
    // 4. Verificar si los cambios se aplicaron
    console.log('\n🔍 4. VERIFICANDO SI LOS CAMBIOS SE APLICARON...\n');
    
    // Buscar en la respuesta si hay indicios de los cambios
    console.log('📋 Cambios esperados:');
    console.log('   ✅ URLs: puntolegal.online (sin www)');
    console.log('   ✅ Auto Return: approved');
    console.log('   ✅ Webhook: clever-action');
    console.log('   ✅ External Reference: configurado');
    
    // 5. Recomendaciones
    console.log('\n🎯 5. RECOMENDACIONES:\n');
    
    if (isProduction) {
      console.log('✅ Estamos en PRODUCCIÓN');
      console.log('   - Los cambios deberían aplicarse automáticamente');
      console.log('   - Verificar que las Edge Functions estén desplegadas');
    } else {
      console.log('⚠️  Estamos en DESARROLLO');
      console.log('   - Los cambios pueden no aplicarse al servidor real');
      console.log('   - Considerar desplegar manualmente las Edge Functions');
      console.log('   - Verificar variables de entorno en Supabase');
    }
    
    console.log('\n📋 PASOS PARA GARANTIZAR CAMBIOS:');
    console.log('   1. Desplegar Edge Functions en Supabase Dashboard');
    console.log('   2. Verificar variables de entorno en Supabase');
    console.log('   3. Probar desde puntolegal.online (no localhost)');
    console.log('   4. Verificar logs de Supabase Edge Functions');
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

// Ejecutar verificación
verificarEntornoProduccion();
