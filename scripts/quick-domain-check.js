#!/usr/bin/env node

/**
 * Verificación rápida del estado del dominio
 */

console.log('🔍 VERIFICACIÓN RÁPIDA DEL DOMINIO');
console.log('===================================\n');

const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';

async function quickDomainCheck() {
  try {
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      }
    });

    const result = await response.json();

    if (response.ok && result.data.length > 0) {
      const domain = result.data[0];
      
      console.log(`📧 Dominio: ${domain.name}`);
      console.log(`📊 Estado: ${domain.status}`);
      console.log(`🌍 Región: ${domain.region}`);
      console.log(`📅 Creado: ${new Date(domain.created_at).toLocaleString('es-CL')}`);
      console.log('');

      if (domain.status === 'verified') {
        console.log('✅ ¡DOMINIO VERIFICADO!');
        console.log('=======================');
        console.log('• El sistema está listo para usar');
        console.log('• Se puede enviar a cualquier email');
        console.log('');
        console.log('🧪 PROBAR AHORA:');
        console.log('===============');
        console.log('node scripts/test-email-with-domain.js');
        console.log('');
        console.log('📋 CONFIGURAR SUPABASE:');
        console.log('=======================');
        console.log('MAIL_FROM = Punto Legal <team@comunicaciones.puntolegal.online>');
      } else {
        console.log('⏳ DOMINIO PENDIENTE');
        console.log('===================');
        console.log('• Estado:', domain.status);
        console.log('• Esperando propagación DNS...');
        console.log('• Puede tomar 5-30 minutos');
        console.log('');
        console.log('🔄 VERIFICAR NUEVAMENTE:');
        console.log('========================');
        console.log('node scripts/quick-domain-check.js');
        console.log('');
        console.log('⏰ O esperar automáticamente:');
        console.log('node scripts/wait-for-domain-verification.js');
      }

    } else {
      console.error('❌ Error verificando dominio:', result);
    }

  } catch (error) {
    console.error('❌ Error en la verificación:', error.message);
  }
}

// Ejecutar verificación
quickDomainCheck();
