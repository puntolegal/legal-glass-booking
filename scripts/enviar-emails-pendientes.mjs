#!/usr/bin/env node

/**
 * 📧 ENVÍO: Emails pendientes a clientes específicos
 * Envía emails con los nuevos estilos corporativos a clientes que no han recibido confirmación
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('📧 ENVIANDO EMAILS PENDIENTES\n');
console.log('='.repeat(60));

async function enviarEmailsPendientes() {
  try {
    // IDs de las reservas específicas
    const reservaIds = [
      'a353bbef-c9ca-41b9-95c3-f5e6ed836fb5', // Pousiño
      'a7efc930-3d37-45a9-b6bc-176d15866436'  // Cabezade huebo
    ];

    console.log(`📋 Procesando ${reservaIds.length} reservas pendientes...\n`);

    for (let i = 0; i < reservaIds.length; i++) {
      const reservaId = reservaIds[i];
      console.log(`📧 ${i + 1}/${reservaIds.length} - Procesando reserva: ${reservaId}`);

      try {
        // Enviar email usando clever-action
        const cleverResponse = await fetch(`${SUPABASE_URL}/functions/v1/clever-action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'x-admin-token': 'puntolegal-admin-token-2025'
          },
          body: JSON.stringify({
            booking_id: reservaId
          })
        });

        const cleverResult = await cleverResponse.json();
        
        if (cleverResponse.ok) {
          console.log(`   ✅ ÉXITO: Emails enviados a ${cleverResult.cliente_email}`);
          console.log(`   📧 Cliente: ${cleverResult.cliente_email}`);
          console.log(`   📧 Admin: ${cleverResult.admin_email}`);
          console.log(`   🔗 Booking ID: ${cleverResult.booking_id}`);
        } else {
          console.log(`   ❌ ERROR: ${cleverResult.error || cleverResult.message || 'Error desconocido'}`);
          if (cleverResult.detail) {
            console.log(`   📋 Detail: ${cleverResult.detail}`);
          }
        }
        
      } catch (error) {
        console.log(`   ❌ ERROR DE CONEXIÓN: ${error.message}`);
      }

      console.log(''); // Línea en blanco para separar
    }

    // Verificar estado final de todas las reservas
    console.log('🔍 VERIFICANDO ESTADO FINAL...\n');
    
    const { data: reservasVerificacion, error: errorVerificacion } = await supabase
      .from('reservas')
      .select('id, nombre, email, fecha, hora, email_enviado, email_enviado_at')
      .in('id', reservaIds)
      .order('created_at', { ascending: false });

    if (errorVerificacion) {
      console.log('❌ Error verificando estado:', errorVerificacion.message);
    } else {
      console.log('📊 Estado final de las reservas:');
      reservasVerificacion.forEach((reserva, index) => {
        console.log(`   ${index + 1}. ${reserva.fecha} ${reserva.hora} - ${reserva.nombre} (${reserva.email})`);
        console.log(`      📧 Email: ${reserva.email_enviado ? '✅ Enviado' : '❌ Pendiente'}`);
        if (reserva.email_enviado_at) {
          console.log(`      📅 Fecha: ${reserva.email_enviado_at}`);
        }
        console.log('');
      });
    }

    // Resumen final
    console.log('='.repeat(60));
    console.log('🎯 RESUMEN FINAL:\n');
    
    const emailsExitosos = reservasVerificacion?.filter(r => r.email_enviado).length || 0;
    const emailsPendientes = reservasVerificacion?.filter(r => !r.email_enviado).length || 0;
    
    console.log(`📧 Emails enviados exitosamente: ${emailsExitosos}`);
    console.log(`📧 Emails pendientes: ${emailsPendientes}`);
    
    if (emailsExitosos > 0) {
      console.log('\n✅ Clientes que recibieron confirmación:');
      reservasVerificacion?.filter(r => r.email_enviado).forEach(reserva => {
        console.log(`   • ${reserva.nombre} (${reserva.email})`);
      });
    }
    
    if (emailsPendientes > 0) {
      console.log('\n⚠️  Clientes que aún no han recibido confirmación:');
      reservasVerificacion?.filter(r => !r.email_enviado).forEach(reserva => {
        console.log(`   • ${reserva.nombre} (${reserva.email})`);
      });
    }
    
    console.log('\n🚀 PROCESO COMPLETADO');
    
  } catch (error) {
    console.error('❌ Error en envío de emails pendientes:', error);
  }
}

// Ejecutar envío
enviarEmailsPendientes();
