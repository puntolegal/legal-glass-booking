#!/usr/bin/env node

/**
 * Script para probar el sistema de correos completo
 */

import { sendBookingEmailsDirect } from '../src/services/emailService.ts';

async function testEmailSystem() {
  console.log('🧪 Probando sistema de correos...\n');

  const testBookingData = {
    id: 'test-' + Date.now(),
    cliente_nombre: 'Juan Pérez',
    cliente_email: 'benja.soza@gmail.com',
    cliente_telefono: '+56912345678',
    cliente_rut: '12345678-9',
    servicio_tipo: 'Consulta General',
    servicio_precio: '1000',
    descripcion: 'Consulta de prueba del sistema',
    fecha: '2025-09-23',
    hora: '10:00',
    tipo_reunion: 'online'
  };

  console.log('📋 Datos de prueba:', testBookingData);

  try {
    const result = await sendBookingEmailsDirect(testBookingData);
    
    console.log('\n📧 Resultado del envío:');
    console.log('✅ Éxito:', result.success);
    
    if (result.success) {
      console.log('📨 Email cliente ID:', result.clientEmail?.id);
      console.log('📨 Email admin ID:', result.adminEmail?.id);
      console.log('🔍 Código de seguimiento:', result.trackingCode);
      console.log('🔗 Google Meet:', result.googleMeetLink);
    } else {
      console.log('❌ Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar prueba
testEmailSystem();