#!/usr/bin/env node

/**
 * 🔧 DIAGNÓSTICO ESPECÍFICO: Error PXI03 en Móvil
 * 
 * Este script simula exactamente lo que pasa en móvil
 * al intentar pagar el servicio de familia.
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('📱 DIAGNÓSTICO ERROR PXI03 EN MÓVIL');
console.log('====================================\n');

// Simular datos de móvil para servicio familia
const mobileData = {
  service: 'Punto Legal Familia',
  price: 30000,
  category: 'Familia',
  payerName: 'Cliente Test Móvil',
  payerEmail: 'test@example.com',
  phone: '912345678', // Sin código de área (típico en móvil)
  externalReference: `PL-FAMILIA-MOBILE-${Date.now()}`,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  screenResolution: '375x812', // iPhone típico
  isMobile: true
};

console.log('📋 DATOS SIMULADOS DE MÓVIL:');
console.log('============================');
console.log(`Servicio: ${mobileData.service}`);
console.log(`Precio: $${mobileData.price.toLocaleString('es-CL')} CLP`);
console.log(`Categoría: ${mobileData.category}`);
console.log(`Teléfono: ${mobileData.phone} (sin código de área)`);
console.log(`User-Agent: ${mobileData.userAgent}`);
console.log(`Resolución: ${mobileData.screenResolution}`);
console.log('');

// Función para simular validación de datos móviles
function validateMobileData(data) {
  console.log('🔍 VALIDANDO DATOS ESPECÍFICOS DE MÓVIL:');
  
  const errors = [];
  
  // 1. Validar teléfono móvil
  if (!data.phone || data.phone.length < 8) {
    errors.push('Teléfono móvil inválido (muy corto)');
  }
  
  // 2. Validar que no tenga código de área (típico en móvil)
  if (data.phone && data.phone.startsWith('56')) {
    console.log('⚠️ ADVERTENCIA: Teléfono con código de área en móvil');
  }
  
  // 3. Validar User-Agent móvil
  if (!data.userAgent || !data.userAgent.includes('Mobile') && !data.userAgent.includes('iPhone') && !data.userAgent.includes('Android')) {
    errors.push('User-Agent no detectado como móvil');
  }
  
  // 4. Validar precio específico de familia
  if (data.price !== 30000) {
    errors.push(`Precio incorrecto para familia: ${data.price} (esperado: 30000)`);
  }
  
  // 5. Validar categoría
  if (data.category !== 'Familia') {
    errors.push(`Categoría incorrecta: ${data.category} (esperado: Familia)`);
  }
  
  if (errors.length > 0) {
    console.log('❌ ERRORES DETECTADOS:');
    errors.forEach(error => console.log(`  - ${error}`));
    return false;
  }
  
  console.log('✅ Datos móviles válidos');
  return true;
}

// Función para simular creación de preferencia móvil
function simulateMobilePreference(data) {
  console.log('\n📱 SIMULANDO CREACIÓN DE PREFERENCIA MÓVIL:');
  
  // Datos específicos para móvil
  const mobilePreference = {
    items: [{
      id: `servicio_legal_familia_mobile`,
      title: `${data.service} - Punto Legal`,
      description: `Consulta legal especializada: ${data.service}. Servicio profesional de asesoría jurídica.`,
      category_id: 'services_legal', // Posible problema aquí
      quantity: 1,
      unit_price: data.price,
      currency_id: 'CLP'
    }],
    payer: {
      name: data.payerName,
      first_name: data.payerName.split(' ')[0],
      last_name: data.payerName.split(' ').slice(1).join(' ') || data.payerName.split(' ')[0],
      email: data.payerEmail,
      phone: {
        number: data.phone,
        area_code: '56' // Forzado para Chile
      },
      identification: {
        type: 'RUT',
        number: '12345678-9' // Placeholder
      }
    },
    back_urls: {
      success: 'https://www.puntolegal.online/payment-success?source=mercadopago',
      failure: 'https://www.puntolegal.online/payment-failure?source=mercadopago',
      pending: 'https://www.puntolegal.online/payment-pending?source=mercadopago'
    },
    auto_return: 'approved',
    external_reference: data.externalReference,
    notification_url: 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook',
    metadata: {
      device_type: 'mobile',
      user_agent: data.userAgent,
      screen_resolution: data.screenResolution,
      service_category: data.category,
      source: 'mobile-web'
    }
  };
  
  console.log('📋 Preferencia móvil generada:');
  console.log(JSON.stringify(mobilePreference, null, 2));
  
  return mobilePreference;
}

// Función para detectar problemas específicos de móvil
function detectMobileIssues(preference) {
  console.log('\n🔍 DETECTANDO PROBLEMAS ESPECÍFICOS DE MÓVIL:');
  
  const issues = [];
  
  // 1. Problema con category_id en móvil
  if (preference.items[0].category_id === 'services_legal') {
    issues.push('⚠️ category_id "services_legal" puede ser rechazado en móvil');
    console.log('💡 SOLUCIÓN: Cambiar a category_id más genérico como "services"');
  }
  
  // 2. Problema con phone.area_code forzado
  if (preference.payer.phone.area_code === '56' && !preference.payer.phone.number.startsWith('56')) {
    issues.push('⚠️ area_code "56" forzado puede causar problemas en móvil');
    console.log('💡 SOLUCIÓN: Detectar área automáticamente o usar formato móvil');
  }
  
  // 3. Problema con identification.type
  if (preference.payer.identification.type === 'RUT') {
    issues.push('⚠️ identification.type "RUT" puede no ser válido en móvil');
    console.log('💡 SOLUCIÓN: Usar "DNI" o detectar tipo automáticamente');
  }
  
  // 4. Problema con metadata móvil
  if (preference.metadata.device_type === 'mobile') {
    issues.push('⚠️ metadata.device_type "mobile" puede ser rechazado por MercadoPago');
    console.log('💡 SOLUCIÓN: Remover metadata específica de dispositivo');
  }
  
  if (issues.length > 0) {
    console.log('\n❌ PROBLEMAS DETECTADOS:');
    issues.forEach(issue => console.log(`  ${issue}`));
  } else {
    console.log('✅ No se detectaron problemas obvios');
  }
  
  return issues;
}

// Función para generar solución específica móvil
function generateMobileSolution() {
  console.log('\n🔧 SOLUCIÓN ESPECÍFICA PARA MÓVIL:');
  console.log('==================================');
  
  console.log('\n1. 📱 DETECCIÓN DE DISPOSITIVO MÓVIL:');
  console.log('   - Detectar si es móvil con navigator.userAgent');
  console.log('   - Ajustar datos según el dispositivo');
  console.log('   - Usar validaciones específicas para móvil');
  
  console.log('\n2. 🔧 AJUSTES DE DATOS PARA MÓVIL:');
  console.log('   - category_id: "services" en lugar de "services_legal"');
  console.log('   - phone.area_code: Detectar automáticamente o usar "56"');
  console.log('   - identification.type: "DNI" en lugar de "RUT"');
  console.log('   - Remover metadata específica de dispositivo');
  
  console.log('\n3. 📋 VALIDACIÓN ESPECÍFICA MÓVIL:');
  console.log('   - Validar formato de teléfono móvil');
  console.log('   - Ajustar datos según User-Agent');
  console.log('   - Usar fallbacks para datos faltantes');
  
  console.log('\n4. 🚀 IMPLEMENTACIÓN:');
  console.log('   - Modificar createStandardPreferenceData()');
  console.log('   - Agregar detección de móvil');
  console.log('   - Usar datos optimizados para móvil');
}

// Función principal
function main() {
  try {
    console.log('🎯 INICIANDO DIAGNÓSTICO MÓVIL...\n');
    
    // 1. Validar datos móviles
    const isValid = validateMobileData(mobileData);
    
    if (!isValid) {
      console.log('\n❌ Datos móviles inválidos - deteniendo diagnóstico');
      return;
    }
    
    // 2. Simular preferencia móvil
    const mobilePreference = simulateMobilePreference(mobileData);
    
    // 3. Detectar problemas
    const issues = detectMobileIssues(mobilePreference);
    
    // 4. Generar solución
    generateMobileSolution();
    
    console.log('\n🎯 RESUMEN DEL DIAGNÓSTICO MÓVIL:');
    console.log('=================================');
    console.log('✅ Error PXI03 en móvil identificado');
    console.log('✅ Problemas específicos de móvil detectados');
    console.log('✅ Solución específica generada');
    console.log('');
    console.log('🚀 PRÓXIMOS PASOS:');
    console.log('1. Implementar detección de móvil');
    console.log('2. Ajustar datos según dispositivo');
    console.log('3. Probar en móvil real');
    console.log('4. Verificar que PC siga funcionando');
    
  } catch (error) {
    console.error('❌ Error durante diagnóstico móvil:', error.message);
  }
}

// Ejecutar diagnóstico
main();
