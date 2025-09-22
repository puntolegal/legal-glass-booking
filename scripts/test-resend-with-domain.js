#!/usr/bin/env node

/**
 * Script para probar Resend con dominio verificado
 */

console.log('🧪 PROBANDO RESEND CON DOMINIO VERIFICADO');
console.log('==========================================\n');

const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';

async function testResendWithDomain() {
  try {
    console.log('📧 Probando diferentes opciones de email...');
    console.log('');

    // Opción 1: Usar el dominio por defecto de Resend
    console.log('🔧 Opción 1: Usando dominio por defecto de Resend...');
    
    const response1 = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Punto Legal <onboarding@resend.dev>',
        to: ['benja.soza@gmail.com'],
        subject: '🧪 Prueba del Sistema - Punto Legal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">🧪 Prueba del Sistema de Emails</h1>
            <p>Este es un email de prueba para verificar que el sistema funciona correctamente.</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL')}</p>
            <p><strong>Estado:</strong> Prueba exitosa</p>
          </div>
        `
      })
    });

    const result1 = await response1.json();

    if (response1.ok) {
      console.log('✅ Email enviado exitosamente con dominio por defecto!');
      console.log('📧 ID del email:', result1.id);
      console.log('');
      console.log('🔍 VERIFICAR:');
      console.log('=============');
      console.log('1. Revisar bandeja de entrada de benja.soza@gmail.com');
      console.log('2. Buscar el email con asunto: "🧪 Prueba del Sistema - Punto Legal"');
      console.log('3. El email vendrá de: onboarding@resend.dev');
      console.log('');
      console.log('✅ SISTEMA FUNCIONANDO CON DOMINIO POR DEFECTO');
      console.log('==============================================');
    } else {
      console.error('❌ Error con dominio por defecto:', result1);
      
      // Opción 2: Verificar dominios disponibles
      console.log('\n🔧 Opción 2: Verificando dominios disponibles...');
      
      const domainsResponse = await fetch('https://api.resend.com/domains', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        }
      });

      const domains = await domainsResponse.json();
      console.log('📋 Dominios disponibles:', domains);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
testResendWithDomain();
