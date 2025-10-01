#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO PROFUNDO: Problemas persistentes en producción
 * Analiza por qué los cambios no se aplican después del deploy
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 DIAGNÓSTICO PROFUNDO: Problemas persistentes\n');
console.log('='.repeat(60));

async function diagnosticoProfundo() {
  try {
    // 1. Verificar si las Edge Functions tienen los cambios
    console.log('🔧 1. VERIFICANDO EDGE FUNCTIONS ACTUALIZADAS...\n');
    
    // Test 1: Verificar si auto_return está configurado
    console.log('📋 Test 1: Verificando auto_return...');
    const testData1 = {
      paymentData: {
        service: 'Test Auto Return',
        description: 'Verificando auto_return',
        price: '1000',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+56912345678',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        external_reference: `test-auto-return-${Date.now()}`
      }
    };
    
    try {
      const response1 = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(testData1)
      });
      
      const result1 = await response1.json();
      
      if (response1.ok && result1.init_point) {
        const initPointUrl = new URL(result1.init_point);
        const autoReturnParam = initPointUrl.searchParams.get('auto_return');
        
        if (autoReturnParam === 'approved') {
          console.log('   ✅ auto_return: approved (CORRECTO)');
        } else {
          console.log(`   ❌ auto_return: ${autoReturnParam || 'No configurado'} (INCORRECTO)`);
        }
      } else {
        console.log('   ❌ No se pudo verificar auto_return');
      }
    } catch (error) {
      console.log(`   ❌ Error verificando auto_return: ${error.message}`);
    }
    
    // Test 2: Verificar URLs de retorno
    console.log('\n📋 Test 2: Verificando URLs de retorno...');
    try {
      const response2 = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(testData1)
      });
      
      const result2 = await response2.json();
      
      if (response2.ok && result2.init_point) {
        const initPointUrl = new URL(result2.init_point);
        const backUrlsParam = initPointUrl.searchParams.get('back_urls');
        
        if (backUrlsParam) {
          console.log('   📋 Back URLs encontradas:', backUrlsParam);
          
          if (backUrlsParam.includes('puntolegal.online') && !backUrlsParam.includes('www.puntolegal.online')) {
            console.log('   ✅ URLs correctas: puntolegal.online (sin www)');
          } else if (backUrlsParam.includes('www.puntolegal.online')) {
            console.log('   ❌ URLs incorrectas: www.puntolegal.online');
          } else {
            console.log('   ⚠️  URLs no identificadas claramente');
          }
        } else {
          console.log('   ❌ No se encontraron back_urls en la URL');
        }
      } else {
        console.log('   ❌ No se pudo verificar URLs de retorno');
      }
    } catch (error) {
      console.log(`   ❌ Error verificando URLs: ${error.message}`);
    }
    
    // 2. Verificar webhook
    console.log('\n🔧 2. VERIFICANDO WEBHOOK...\n');
    
    try {
      // Simular un webhook de MercadoPago
      const webhookData = {
        type: 'payment',
        data: {
          id: '123456789'
        }
      };
      
      const webhookResponse = await fetch(`${SUPABASE_URL}/functions/v1/mercadopago-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(webhookData)
      });
      
      const webhookResult = await webhookResponse.json();
      
      console.log(`📋 Webhook Status: ${webhookResponse.status}`);
      console.log(`📋 Webhook Response:`, webhookResult);
      
      if (webhookResponse.status === 404) {
        console.log('   ✅ Webhook responde 404 (esperado para pago inexistente)');
      } else if (webhookResponse.status === 200) {
        console.log('   ✅ Webhook funcionando correctamente');
      } else {
        console.log(`   ⚠️  Webhook status inesperado: ${webhookResponse.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Error probando webhook: ${error.message}`);
    }
    
    // 3. Verificar clever-action
    console.log('\n🔧 3. VERIFICANDO CLEVER-ACTION...\n');
    
    try {
      const cleverResponse = await fetch(`${SUPABASE_URL}/functions/v1/clever-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          booking_id: 'test-booking-id'
        })
      });
      
      console.log(`📋 Clever-action Status: ${cleverResponse.status}`);
      
      if (cleverResponse.ok) {
        console.log('   ✅ Clever-action disponible');
      } else {
        console.log('   ❌ Clever-action no disponible');
      }
    } catch (error) {
      console.log(`   ❌ Error probando clever-action: ${error.message}`);
    }
    
    // 4. Verificar variables de entorno
    console.log('\n🔧 4. VERIFICANDO VARIABLES DE ENTORNO...\n');
    
    // Crear una preferencia con datos que requieren variables de entorno
    const envTestData = {
      paymentData: {
        service: 'Test Variables',
        description: 'Verificando variables de entorno',
        price: '1000',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+56912345678',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        external_reference: `test-env-${Date.now()}`
      }
    };
    
    try {
      const envResponse = await fetch(`${SUPABASE_URL}/functions/v1/create-mercadopago-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(envTestData)
      });
      
      const envResult = await envResponse.json();
      
      if (envResponse.ok) {
        console.log('   ✅ Variables de entorno configuradas correctamente');
      } else {
        console.log(`   ❌ Error con variables de entorno: ${envResult.error || envResult.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Error verificando variables: ${error.message}`);
    }
    
    // 5. Análisis de problemas comunes
    console.log('\n🔍 5. ANÁLISIS DE PROBLEMAS COMUNES...\n');
    
    console.log('📋 Problemas más comunes después del deploy:');
    console.log('   1. Cache de Supabase Edge Functions');
    console.log('   2. Variables de entorno no actualizadas');
    console.log('   3. Deploy no completado correctamente');
    console.log('   4. Código desplegado en función incorrecta');
    console.log('   5. Permisos de Edge Functions');
    
    // 6. Recomendaciones específicas
    console.log('\n🎯 6. RECOMENDACIONES ESPECÍFICAS...\n');
    
    console.log('📋 Pasos para resolver:');
    console.log('   1. Verificar que el deploy se completó sin errores');
    console.log('   2. Esperar 2-3 minutos para que el cache se actualice');
    console.log('   3. Verificar logs de Supabase Edge Functions');
    console.log('   4. Confirmar que las variables de entorno están configuradas');
    console.log('   5. Probar desde un navegador incógnito');
    console.log('   6. Verificar que no hay errores en la consola del navegador');
    
    console.log('\n🔧 Comandos de verificación:');
    console.log('   - Revisar logs en Supabase Dashboard → Edge Functions → Logs');
    console.log('   - Verificar variables en Settings → Environment Variables');
    console.log('   - Confirmar que el código desplegado es el correcto');
    
  } catch (error) {
    console.error('❌ Error en diagnóstico profundo:', error);
  }
}

// Ejecutar diagnóstico
diagnosticoProfundo();
