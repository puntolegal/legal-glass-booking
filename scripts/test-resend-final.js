#!/usr/bin/env node

/**
 * Script final para probar Resend enviando a la dirección de la cuenta
 */

console.log('🧪 PRUEBA FINAL DE RESEND');
console.log('==========================\n');

const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';

async function testResendFinal() {
  try {
    console.log('📧 Enviando email de prueba a la dirección de la cuenta...');
    console.log('   From: Punto Legal <onboarding@resend.dev>');
    console.log('   To: puntolegalelgolf@gmail.com');
    console.log('');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Punto Legal <onboarding@resend.dev>',
        to: ['puntolegalelgolf@gmail.com'],
        subject: '🧪 Prueba del Sistema de Emails - Punto Legal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🧪 Prueba del Sistema</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Email de prueba enviado correctamente</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hola <strong>Admin</strong>,</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">Este es un email de prueba para verificar que el sistema de emails de Punto Legal está funcionando correctamente.</p>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #333;">📋 Detalles de la Prueba</h3>
                <p style="margin: 8px 0;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL')}</p>
                <p style="margin: 8px 0;"><strong>Servicio:</strong> Consulta General</p>
                <p style="margin: 8px 0;"><strong>Precio:</strong> $35.000 CLP</p>
                <p style="margin: 8px 0;"><strong>Estado:</strong> Prueba exitosa</p>
                <p style="margin: 8px 0;"><strong>Cliente:</strong> Benjamín Soza</p>
                <p style="margin: 8px 0;"><strong>Email Cliente:</strong> benja.soza@gmail.com</p>
              </div>
              
              <p style="font-size: 16px; margin-top: 20px;">Si recibes este email, significa que el sistema está funcionando correctamente.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              <p>© 2025 Punto Legal - Sistema de Pruebas</p>
            </div>
          </div>
        `
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Email enviado exitosamente!');
      console.log('📧 ID del email:', result.id);
      console.log('');
      console.log('🔍 VERIFICAR:');
      console.log('=============');
      console.log('1. Revisar bandeja de entrada de puntolegalelgolf@gmail.com');
      console.log('2. Buscar el email con asunto: "🧪 Prueba del Sistema de Emails"');
      console.log('3. El email vendrá de: onboarding@resend.dev');
      console.log('');
      console.log('✅ API DE RESEND FUNCIONANDO CORRECTAMENTE');
      console.log('==========================================');
      console.log('');
      console.log('📋 PRÓXIMOS PASOS:');
      console.log('==================');
      console.log('1. Configurar las variables de entorno en Supabase');
      console.log('2. Cambiar MAIL_FROM a: Punto Legal <onboarding@resend.dev>');
      console.log('3. Probar el sistema completo');
      console.log('');
      console.log('⚠️  NOTA IMPORTANTE:');
      console.log('====================');
      console.log('• Para enviar a cualquier email, necesitas verificar un dominio');
      console.log('• Por ahora, solo se puede enviar a puntolegalelgolf@gmail.com');
      console.log('• Para producción, verifica tu dominio en resend.com/domains');
    } else {
      console.error('❌ Error enviando email:', result);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
testResendFinal();
