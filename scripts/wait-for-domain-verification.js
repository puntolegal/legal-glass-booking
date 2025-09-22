#!/usr/bin/env node

/**
 * Script para esperar la verificación del dominio
 */

console.log('⏳ ESPERANDO VERIFICACIÓN DEL DOMINIO');
console.log('=====================================\n');

const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';

async function waitForDomainVerification() {
  let attempts = 0;
  const maxAttempts = 12; // 12 intentos = 1 hora (5 min cada uno)
  
  console.log('🔍 Verificando estado del dominio cada 5 minutos...');
  console.log('⏰ Máximo tiempo de espera: 1 hora');
  console.log('');

  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      console.log(`📋 Intento ${attempts}/${maxAttempts} - ${new Date().toLocaleString('es-CL')}`);
      
      const response = await fetch('https://api.resend.com/domains', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        }
      });

      const result = await response.json();

      if (response.ok && result.data.length > 0) {
        const domain = result.data[0];
        console.log(`   Estado: ${domain.status}`);
        
        if (domain.status === 'verified') {
          console.log('');
          console.log('🎉 ¡DOMINIO VERIFICADO!');
          console.log('=======================');
          console.log(`• Dominio: ${domain.name}`);
          console.log(`• Estado: ${domain.status}`);
          console.log(`• Región: ${domain.region}`);
          console.log('');
          console.log('✅ SISTEMA LISTO PARA USAR');
          console.log('==========================');
          console.log('• Se puede enviar a cualquier email');
          console.log('• Dominio completamente funcional');
          console.log('');
          console.log('📋 CONFIGURACIÓN PARA SUPABASE:');
          console.log('===============================');
          console.log('MAIL_FROM = Punto Legal <team@comunicaciones.puntolegal.online>');
          console.log('');
          console.log('🧪 PROBAR SISTEMA:');
          console.log('==================');
          console.log('node scripts/test-email-with-domain.js');
          console.log('');
          console.log('🚀 SISTEMA COMPLETO FUNCIONANDO');
          return;
        } else {
          console.log(`   ⏳ Aún pendiente... (${domain.status})`);
        }
      } else {
        console.log('   ❌ Error verificando dominio');
      }

      if (attempts < maxAttempts) {
        console.log('   ⏰ Esperando 5 minutos antes del siguiente intento...');
        console.log('');
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // 5 minutos
      }

    } catch (error) {
      console.log(`   ❌ Error en intento ${attempts}:`, error.message);
      if (attempts < maxAttempts) {
        console.log('   ⏰ Esperando 5 minutos antes del siguiente intento...');
        console.log('');
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
      }
    }
  }

  console.log('');
  console.log('⏰ TIEMPO DE ESPERA AGOTADO');
  console.log('============================');
  console.log('• El dominio aún no está verificado');
  console.log('• Verificar manualmente en https://resend.com/domains');
  console.log('• Ejecutar nuevamente cuando esté verificado');
  console.log('');
  console.log('🔍 VERIFICAR MANUALMENTE:');
  console.log('=========================');
  console.log('1. Ir a https://resend.com/domains');
  console.log('2. Verificar que el estado sea "verified"');
  console.log('3. Ejecutar: node scripts/test-email-with-domain.js');
}

// Ejecutar la verificación
waitForDomainVerification();
