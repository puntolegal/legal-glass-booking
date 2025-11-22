#!/usr/bin/env node

/**
 * Script para enviar correos de demostración visual al admin
 * Usa curl directamente para evitar problemas con el SDK
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { createClient } from '@supabase/supabase-js';

const execPromise = promisify(exec);

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';
const ADMIN_TOKEN = 'puntolegal-admin-token-2025';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function enviarCorreosVisualAdmin() {
  try {
    console.log('🎨 DEMOSTRACIÓN DE DISEÑO DE CORREOS\n');
    console.log('=' .repeat(70));

    // Obtener el último registro
    const { data: reserva, error } = await supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !reserva) {
      console.error('❌ Error al buscar registro:', error?.message);
      process.exit(1);
    }

    console.log('📋 Usando datos del último registro:');
    console.log(`   👤 Cliente: ${reserva.nombre}`);
    console.log(`   📧 Email original: ${reserva.email}`);
    console.log(`   🏢 Servicio: ${reserva.servicio}`);
    console.log(`   📅 Fecha: ${reserva.fecha} a las ${reserva.hora}`);
    console.log(`   💰 Precio: $${reserva.precio}`);
    console.log('=' .repeat(70));

    console.log('\n📤 Enviando correos de demostración a: puntolegalelgolf@gmail.com');
    console.log('   ⚡ Se enviarán 2 correos:');
    console.log('   1️⃣  Email de confirmación (vista del cliente)');
    console.log('   2️⃣  Email de notificación (vista del admin)');
    console.log('=' .repeat(70));

    // Usar curl para enviar la solicitud
    const curlCommand = `curl -X POST '${SUPABASE_URL}/functions/v1/clever-action' \\
      -H 'Content-Type: application/json' \\
      -H 'x-admin-token: ${ADMIN_TOKEN}' \\
      -H 'Authorization: Bearer ${SUPABASE_ANON_KEY}' \\
      -d '{"booking_id":"${reserva.id}"}'`;

    console.log('\n🔄 Ejecutando solicitud...\n');
    
    const { stdout, stderr } = await execPromise(curlCommand);

    if (stderr) {
      console.error('⚠️  Advertencia:', stderr);
    }

    const response = JSON.parse(stdout);

    if (response.success) {
      console.log('✅ ¡CORREOS ENVIADOS EXITOSAMENTE!\n');
      console.log('=' .repeat(70));
      console.log('📬 REVISA TU BANDEJA DE ENTRADA: puntolegalelgolf@gmail.com');
      console.log('=' .repeat(70));
      console.log('\n🎨 DISEÑO ACTUAL DE LOS CORREOS:');
      console.log('\n📧 EMAIL AL CLIENTE:');
      console.log('   • Header: Gradiente azul-morado (#667eea → #764ba2)');
      console.log('   • Emoji: ⚖️ (Balanza de justicia)');
      console.log('   • Título: "✅ Cita Confirmada"');
      console.log('   • Cards: Fondo azul claro (#f8f9ff)');
      console.log('   • Botones destacados: Gradiente azul-morado');
      console.log('   • Tipografía: SF Pro Display / -apple-system');
      console.log('   • Estilo: Profesional, confiable, amigable');
      
      console.log('\n📧 EMAIL AL ADMIN:');
      console.log('   • Header: Gradiente rosa-rojo (#f093fb → #f5576c)');
      console.log('   • Badge: "🚨 ACCIÓN REQUERIDA"');
      console.log('   • Título: "🔔 Nueva Reserva"');
      console.log('   • Alerta: Fondo amarillo (#fff3cd) con borde amarillo');
      console.log('   • Cards: Fondo azul claro (#f8f9ff) con borde rosa');
      console.log('   • Acciones: Caja verde con checklist');
      console.log('   • Estilo: Urgente, llamativo, accionable');
      
      console.log('\n💡 CARACTERÍSTICAS GENERALES:');
      console.log('   ✓ Diseño iOS moderno con bordes redondeados (12px)');
      console.log('   ✓ Sombras sutiles para profundidad');
      console.log('   ✓ Responsive (se adapta a móvil)');
      console.log('   ✓ Sin emojis excesivos (solo los necesarios)');
      console.log('   ✓ Paleta de colores profesional');
      console.log('   ✓ Tipografía system native (-apple-system)');
      
      console.log('\n🎯 SIGUIENTE PASO:');
      console.log('   Revisa los correos y dime si quieres ajustar:');
      console.log('   • Colores (más elegantes, corporativos, legales)');
      console.log('   • Estilo del header (menos negro, más premium)');
      console.log('   • Cantidad de emojis (mantener mínimo)');
      console.log('   • Diseño de las cards');
      console.log('=' .repeat(70));
      
      console.log('\n✨ Los correos fueron enviados correctamente a tu bandeja.');
      console.log('   Revisa tu email y luego conversemos sobre los cambios.');
      
    } else {
      console.error('❌ Error:', response.error);
    }

  } catch (error) {
    console.error('\n❌ Error general:', error.message);
    process.exit(1);
  }
}

// Ejecutar
enviarCorreosVisualAdmin();




















