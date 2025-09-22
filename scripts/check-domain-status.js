#!/usr/bin/env node

/**
 * Script para verificar el estado del dominio en Resend
 */

console.log('🔍 VERIFICANDO ESTADO DEL DOMINIO');
console.log('==================================\n');

const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';

async function checkDomainStatus() {
  try {
    console.log('📋 Verificando dominios en Resend...');
    
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Dominios encontrados:', result.data.length);
      console.log('');
      
      result.data.forEach((domain, index) => {
        console.log(`📧 Dominio ${index + 1}:`);
        console.log(`   Nombre: ${domain.name}`);
        console.log(`   Estado: ${domain.status}`);
        console.log(`   Región: ${domain.region}`);
        console.log(`   Creado: ${new Date(domain.created_at).toLocaleString('es-CL')}`);
        console.log('');
        
        if (domain.status === 'verified') {
          console.log('✅ DOMINIO VERIFICADO - Listo para usar!');
          console.log(`   Email de envío: team@${domain.name}`);
        } else {
          console.log('⏳ DOMINIO PENDIENTE - Esperando verificación...');
          console.log('   Esto puede tomar unos minutos para propagación DNS');
        }
        console.log('');
      });

      // Verificar si hay dominios verificados
      const verifiedDomains = result.data.filter(d => d.status === 'verified');
      
      if (verifiedDomains.length > 0) {
        console.log('🎉 ¡DOMINIO VERIFICADO!');
        console.log('=======================');
        console.log('• El sistema está listo para enviar emails');
        console.log('• Se puede enviar a cualquier dirección');
        console.log('• Actualizar configuración en Supabase');
        console.log('');
        console.log('📋 CONFIGURACIÓN ACTUALIZADA:');
        console.log('==============================');
        console.log(`MAIL_FROM = Punto Legal <team@${verifiedDomains[0].name}>`);
        console.log('');
        console.log('🧪 PROBAR SISTEMA:');
        console.log('==================');
        console.log('node scripts/test-email-with-domain.js');
      } else {
        console.log('⏳ ESPERANDO VERIFICACIÓN...');
        console.log('============================');
        console.log('• Los registros DNS están propagándose');
        console.log('• Esto puede tomar 5-30 minutos');
        console.log('• Verificar nuevamente en unos minutos');
        console.log('');
        console.log('🔍 VERIFICAR MANUALMENTE:');
        console.log('=========================');
        console.log('1. Ir a https://resend.com/domains');
        console.log('2. Verificar el estado del dominio');
        console.log('3. Cuando esté "verified", ejecutar la prueba');
      }

    } else {
      console.error('❌ Error verificando dominios:', result);
    }

  } catch (error) {
    console.error('❌ Error en la verificación:', error.message);
  }
}

// Ejecutar la verificación
checkDomainStatus();
