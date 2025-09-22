#!/usr/bin/env node

/**
 * Script para probar el sistema de emails con dominio verificado
 */

console.log('🧪 PROBANDO SISTEMA CON DOMINIO VERIFICADO');
console.log('==========================================\n');

const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';
const FROM_EMAIL = 'Punto Legal <team@comunicaciones.puntolegal.online>';
const CLIENT_EMAIL = 'benja.soza@gmail.com';
const ADMIN_EMAIL = 'puntolegalelgolf@gmail.com';

async function testEmailWithDomain() {
  try {
    console.log('📧 Enviando emails con dominio verificado...');
    console.log(`   From: ${FROM_EMAIL}`);
    console.log(`   To Cliente: ${CLIENT_EMAIL}`);
    console.log(`   To Admin: ${ADMIN_EMAIL}`);
    console.log('');

    // Email para el cliente
    console.log('👤 Enviando email al cliente...');
    const clientResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [CLIENT_EMAIL],
        subject: '✅ Confirmación de Cita - Punto Legal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✅ Reserva confirmada</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Tu consulta ha sido agendada exitosamente</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hola <strong>Benjamín</strong>,</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">Nos complace confirmar que tu cita ha sido agendada correctamente.</p>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #333;">📋 Detalles de tu Cita</h3>
                <p style="margin: 8px 0;"><strong>Servicio:</strong> Consulta General</p>
                <p style="margin: 8px 0;"><strong>Fecha y hora:</strong> 15 de enero de 2025, 10:00</p>
                <p style="margin: 8px 0;"><strong>Duración:</strong> 45 min</p>
                <p style="margin: 8px 0;"><strong>Ubicación:</strong> Online (Google Meet)</p>
                <p style="margin: 8px 0;"><strong>Monto:</strong> $35.000 CLP</p>
                <p style="margin: 8px 0;"><strong>ID Reserva:</strong> test-domain-${Date.now()}</p>
              </div>
              
              <p style="font-size: 16px; margin-top: 20px;">Gracias por confiar en Punto Legal. Esperamos poder ayudarte con tu consulta jurídica.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              <p>© 2025 Punto Legal - Soluciones Jurídicas Especializadas</p>
            </div>
          </div>
        `
      })
    });

    const clientResult = await clientResponse.json();

    if (clientResponse.ok) {
      console.log('✅ Email al cliente enviado exitosamente!');
      console.log('📧 ID del email:', clientResult.id);
    } else {
      console.error('❌ Error enviando email al cliente:', clientResult);
    }

    console.log('');

    // Email para el admin
    console.log('👨‍💼 Enviando email al admin...');
    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: '🧾 Nueva reserva pagada - Punto Legal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🧾 Nueva reserva pagada</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Un cliente ha agendado una consulta</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
                <h3 style="margin: 0 0 10px 0; color: #856404;">⚡ Acción Requerida</h3>
                <p style="margin: 0; color: #856404;">Se ha registrado una nueva reserva que requiere tu atención.</p>
              </div>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f5576c;">
                <h3 style="margin: 0 0 15px 0; color: #333;">👤 Información del Cliente</h3>
                <p style="margin: 8px 0;"><strong>Nombre:</strong> Benjamín Soza</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> benja.soza@gmail.com</p>
                <p style="margin: 8px 0;"><strong>Teléfono:</strong> +56912345678</p>
              </div>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
                <h3 style="margin: 0 0 15px 0; color: #333;">📅 Detalles de la Cita</h3>
                <p style="margin: 8px 0;"><strong>ID:</strong> test-domain-${Date.now()}</p>
                <p style="margin: 8px 0;"><strong>Servicio:</strong> Consulta General</p>
                <p style="margin: 8px 0;"><strong>Fecha/hora:</strong> 15 de enero de 2025, 10:00</p>
                <p style="margin: 8px 0;"><strong>Método de pago:</strong> MercadoPago</p>
                <p style="margin: 8px 0;"><strong>Monto:</strong> $35.000 CLP</p>
                <p style="margin: 8px 0;"><strong>Estado:</strong> confirmada</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              <p>© 2025 Punto Legal - Sistema de Gestión de Reservas</p>
            </div>
          </div>
        `
      })
    });

    const adminResult = await adminResponse.json();

    if (adminResponse.ok) {
      console.log('✅ Email al admin enviado exitosamente!');
      console.log('📧 ID del email:', adminResult.id);
    } else {
      console.error('❌ Error enviando email al admin:', adminResult);
    }

    console.log('\n📧 RESULTADO ESPERADO:');
    console.log('======================');
    console.log('✅ Deberías recibir 2 emails:');
    console.log('   - benja.soza@gmail.com (confirmación de cita)');
    console.log('   - puntolegalelgolf@gmail.com (notificación admin)');
    console.log('');
    console.log('🔍 VERIFICAR:');
    console.log('=============');
    console.log('1. Revisar bandeja de entrada de benja.soza@gmail.com');
    console.log('2. Revisar bandeja de entrada de puntolegalelgolf@gmail.com');
    console.log('3. Los emails vendrán de: team@comunicaciones.puntolegal.online');
    console.log('');

    if (clientResponse.ok && adminResponse.ok) {
      console.log('✅ SISTEMA COMPLETO FUNCIONANDO');
      console.log('===============================');
      console.log('• Dominio verificado correctamente');
      console.log('• Emails enviados a cualquier dirección');
      console.log('• Sistema listo para producción');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
testEmailWithDomain();
