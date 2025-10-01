#!/usr/bin/env node

/**
 * 📧 PRUEBA: Enviar emails a Bastian usando clever-action
 * Prueba el sistema de emails con el cliente que no recibió confirmación
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('📧 PRUEBA: Enviando emails a Bastian\n');
console.log('='.repeat(60));

async function probarEmailsBastian() {
  try {
    // 1. Buscar la reserva de Bastian
    console.log('🔍 1. BUSCANDO RESERVA DE BASTIAN...\n');
    
    const { data: reservasBastian, error: errorBastian } = await supabase
      .from('reservas')
      .select('*')
      .ilike('nombre', '%bastian%')
      .order('created_at', { ascending: false })
      .limit(5);

    if (errorBastian) {
      console.error('❌ Error buscando reservas de Bastian:', errorBastian);
      return;
    }

    if (!reservasBastian || reservasBastian.length === 0) {
      console.log('❌ No se encontraron reservas de Bastian');
      return;
    }

    console.log(`✅ Encontradas ${reservasBastian.length} reservas de Bastian:`);
    reservasBastian.forEach((reserva, index) => {
      console.log(`   ${index + 1}. ${reserva.fecha} ${reserva.hora} - ${reserva.nombre} (${reserva.email})`);
      console.log(`      💳 Pago: ${reserva.pago_estado || 'No especificado'} | Email: ${reserva.email_enviado ? '✅' : '❌'}`);
      console.log(`      🔗 ID: ${reserva.id}`);
      console.log('');
    });

    // 2. Seleccionar la reserva más reciente de Bastian
    const reservaBastian = reservasBastian[0];
    console.log(`📋 Seleccionando reserva más reciente: ${reservaBastian.nombre}`);
    console.log(`📧 Email: ${reservaBastian.email}`);
    console.log(`🔗 ID: ${reservaBastian.id}`);

    // 3. Probar clever-action con la reserva de Bastian
    console.log('\n📧 2. PROBANDO CLEVER-ACTION CON BASTIAN...\n');
    
    try {
      const cleverResponse = await fetch(`${SUPABASE_URL}/functions/v1/clever-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'x-admin-token': 'puntolegal-admin-token-2025'
        },
        body: JSON.stringify({
          booking_id: reservaBastian.id
        })
      });

      const cleverResult = await cleverResponse.json();
      
      console.log(`📋 Clever-action Status: ${cleverResponse.status}`);
      console.log(`📋 Response:`, JSON.stringify(cleverResult, null, 2));
      
      if (cleverResponse.ok) {
        console.log('✅ EMAILS ENVIADOS EXITOSAMENTE A BASTIAN');
        console.log(`   📧 Cliente: ${cleverResult.cliente_email}`);
        console.log(`   📧 Admin: ${cleverResult.admin_email}`);
        console.log(`   🔗 Booking ID: ${cleverResult.booking_id}`);
        
        // 4. Verificar que se actualizó el estado en la BD
        console.log('\n🔍 3. VERIFICANDO ACTUALIZACIÓN EN BASE DE DATOS...\n');
        
        const { data: reservaActualizada, error: errorActualizada } = await supabase
          .from('reservas')
          .select('email_enviado, email_enviado_at')
          .eq('id', reservaBastian.id)
          .single();
        
        if (errorActualizada) {
          console.log('⚠️  No se pudo verificar actualización en BD:', errorActualizada.message);
        } else {
          console.log('📋 Estado actualizado en BD:');
          console.log(`   📧 Email enviado: ${reservaActualizada.email_enviado ? '✅' : '❌'}`);
          console.log(`   📅 Fecha envío: ${reservaActualizada.email_enviado_at || 'No especificada'}`);
        }
        
      } else {
        console.log('❌ ERROR ENVIANDO EMAILS A BASTIAN');
        console.log(`   Status: ${cleverResponse.status}`);
        console.log(`   Error: ${cleverResult.error || cleverResult.message || 'Error desconocido'}`);
        
        if (cleverResult.detail) {
          console.log(`   Detail: ${cleverResult.detail}`);
        }
      }
      
    } catch (cleverError) {
      console.log('❌ ERROR DE CONEXIÓN CON CLEVER-ACTION');
      console.log(`   Error: ${cleverError.message}`);
    }

    // 5. Verificar si clever-action está desplegada
    console.log('\n🔧 4. VERIFICANDO ESTADO DE CLEVER-ACTION...\n');
    
    try {
      const statusResponse = await fetch(`${SUPABASE_URL}/functions/v1/clever-action`, {
        method: 'OPTIONS'
      });
      
      console.log(`📋 Clever-action Status Check: ${statusResponse.status}`);
      
      if (statusResponse.status === 200) {
        console.log('✅ Clever-action está desplegada y disponible');
      } else {
        console.log('❌ Clever-action no está disponible o no desplegada');
        console.log('   💡 Necesitas desplegar clever-action en Supabase Dashboard');
      }
    } catch (statusError) {
      console.log('❌ No se puede acceder a clever-action');
      console.log(`   Error: ${statusError.message}`);
      console.log('   💡 Asegúrate de que clever-action esté desplegada');
    }

    // 6. Resumen y recomendaciones
    console.log('\n' + '='.repeat(60));
    console.log('🎯 RESUMEN Y RECOMENDACIONES:\n');
    
    console.log('📋 Si los emails se enviaron exitosamente:');
    console.log('   ✅ Bastian debería recibir su confirmación');
    console.log('   ✅ El administrador debería ser notificado');
    console.log('   ✅ El sistema de emails está funcionando');
    
    console.log('\n📋 Si hubo errores:');
    console.log('   1. Verificar que clever-action esté desplegada');
    console.log('   2. Verificar variables de entorno en Supabase');
    console.log('   3. Verificar logs de Supabase Edge Functions');
    console.log('   4. Confirmar que RESEND_API_KEY esté configurada');
    
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Bastian debería revisar su email');
    console.log('   2. Verificar carpeta de spam si no llega');
    console.log('   3. Confirmar que el webhook use clever-action');
    
  } catch (error) {
    console.error('❌ Error en prueba de emails:', error);
  }
}

// Ejecutar prueba
probarEmailsBastian();
