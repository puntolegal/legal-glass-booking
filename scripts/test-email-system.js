/**
 * Script para probar el sistema de emails
 * Verifica que las Edge Functions estén funcionando correctamente
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailSystem() {
  console.log('🧪 Probando sistema de emails...\n');

  try {
    // Datos de prueba
    const testBookingData = {
      id: 'test-' + Date.now(),
      cliente_nombre: 'Juan Pérez',
      cliente_email: 'test@example.com',
      cliente_telefono: '+56 9 1234 5678',
      servicio_tipo: 'Consulta General',
      servicio_precio: '35000',
      fecha: new Date().toISOString().split('T')[0],
      hora: '10:00',
      pago_metodo: 'MercadoPago',
      pago_estado: 'Aprobado',
      created_at: new Date().toISOString()
    };

    console.log('📋 Datos de prueba:', testBookingData);
    console.log('');

    // Probar Edge Function
    console.log('📧 Probando Edge Function send-booking-emails...');
    
    const { data, error } = await supabase.functions.invoke('send-booking-emails', {
      body: { bookingData: testBookingData }
    });

    if (error) {
      console.error('❌ Error en Edge Function:', error);
      console.log('');
      console.log('🔧 SOLUCIONES:');
      console.log('1. Verificar que la Edge Function esté desplegada');
      console.log('2. Verificar que RESEND_API_KEY esté configurado');
      console.log('3. Verificar permisos de la función');
      return;
    }

    console.log('✅ Edge Function ejecutada correctamente');
    console.log('📧 Resultado:', data);
    console.log('');

    // Verificar si los emails se enviaron
    if (data.success) {
      console.log('🎉 ¡Sistema de emails funcionando correctamente!');
      console.log('');
      console.log('📧 EMAILS ENVIADOS:');
      console.log(`• Cliente: ${testBookingData.cliente_email}`);
      console.log(`• Admin: puntolegalelgolf@gmail.com`);
      console.log('');
      console.log('✅ El sistema está listo para procesar pagos reales');
    } else {
      console.log('⚠️ Sistema en modo simulación');
      console.log('📧 Los emails se simularán en la consola');
    }

  } catch (error) {
    console.error('❌ Error probando sistema:', error);
  }
}

// Ejecutar prueba
testEmailSystem();
