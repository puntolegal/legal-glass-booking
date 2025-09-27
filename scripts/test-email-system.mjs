// Script para probar el sistema de emails con Resend
import fetch from "node-fetch";

console.log('🧪 Probando sistema de emails con Resend...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

// Datos de prueba para el email
const testBookingData = {
  id: 'test-reservation-' + Date.now(),
  cliente_nombre: 'Juan Pérez Test',
  cliente_email: 'juan.test@puntolegal.online',
  cliente_telefono: '+56912345678',
  servicio_tipo: 'Consulta Legal',
  servicio_precio: '35000',
  fecha: '2025-01-30',
  hora: '10:00',
  tipo_reunion: 'online',
  descripcion: 'Consulta de prueba del sistema de emails',
  pago_metodo: 'MercadoPago',
  pago_estado: 'aprobado',
  created_at: new Date().toISOString()
};

async function testEmailSystem() {
  console.log('📧 Datos de prueba:');
  console.log(JSON.stringify(testBookingData, null, 2));
  console.log('');

  try {
    console.log('🚀 Enviando email de prueba...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-resend-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ 
        bookingData: testBookingData
      })
    });

    console.log('📤 Respuesta de la Edge Function:');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email enviado exitosamente!');
      console.log('📋 Resultado:', JSON.stringify(result, null, 2));
      
      console.log('\n🎉 SISTEMA DE EMAILS FUNCIONANDO:');
      console.log('✅ Edge Function respondiendo');
      console.log('✅ Resend configurado');
      console.log('✅ Emails enviándose correctamente');
      
    } else {
      const error = await response.text();
      console.log('❌ Error enviando email:', error);
      
      if (response.status === 401) {
        console.log('\n🔧 POSIBLE SOLUCIÓN:');
        console.log('1. Verificar que la Edge Function esté desplegada');
        console.log('2. Verificar variables de entorno en Supabase');
        console.log('3. Verificar configuración de Resend');
      }
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que la Edge Function esté desplegada');
    console.log('2. Verificar conectividad de red');
    console.log('3. Verificar configuración de Supabase');
  }
}

async function testResendConfig() {
  console.log('\n🔍 Verificando configuración de Resend...');
  
  const resendApiKey = 're_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C';
  const testEmail = {
    from: 'Punto Legal <team@puntolegal.online>',
    to: ['test@puntolegal.online'],
    subject: 'Test de configuración - Punto Legal',
    html: '<h1>Test de configuración</h1><p>Este es un email de prueba.</p>'
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testEmail)
    });

    console.log('📤 Status de Resend API:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Resend API funcionando correctamente');
      console.log('📋 Email ID:', result.id);
    } else {
      const error = await response.text();
      console.log('❌ Error en Resend API:', error);
    }

  } catch (error) {
    console.log('❌ Error conectando con Resend API:', error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas del sistema de emails...\n');
  
  // Test 1: Configuración de Resend
  await testResendConfig();
  
  // Test 2: Sistema completo
  await testEmailSystem();
  
  console.log('\n📊 RESUMEN DE PRUEBAS:');
  console.log('┌─────────────────────────────────────┬─────────┐');
  console.log('│ Componente                          │ Estado  │');
  console.log('├─────────────────────────────────────┼─────────┤');
  console.log('│ Resend API                          │ Verificar arriba │');
  console.log('│ Edge Function send-resend-emails    │ Verificar arriba │');
  console.log('│ Sistema completo de emails          │ Verificar arriba │');
  console.log('└─────────────────────────────────────┴─────────┘');
  
  console.log('\n💡 NOTAS:');
  console.log('- Si Resend API falla: Verificar API key');
  console.log('- Si Edge Function falla: Verificar deployment y variables');
  console.log('- Si todo funciona: Los emails se enviarán automáticamente');
}

main().catch(console.error);
