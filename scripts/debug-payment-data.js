#!/usr/bin/env node

/**
 * Script para debuggear los datos de pago que se transfieren
 * entre AgendamientoPage y MercadoPagoPaymentPage
 */

console.log('🔍 DEBUG: TRANSFERENCIA DE DATOS DE PAGO\n');

// Simular datos que deberían generarse en AgendamientoPage
const servicioEjemplo = {
  name: 'Consulta General',
  price: '35.000',
  category: 'General'
};

const formDataEjemplo = {
  nombre: 'Juan Pérez',
  telefono: '+56987654321',
  email: 'juan@example.com',
  empresa: 'Mi Empresa',
  descripcion: 'Consulta sobre contrato laboral',
  codigoConvenio: 'PUNTOLEGAL!'
};

const fechaEjemplo = '2025-09-18';
const horaEjemplo = '14:30';
const tipoReunionEjemplo = 'videollamada';

// Simular la lógica del código de convenio
const CODIGO_CONVENIO_VALIDO = 'PUNTOLEGAL!';
const isConvenioValido = formDataEjemplo.codigoConvenio === CODIGO_CONVENIO_VALIDO;
const descuentoConvenio = 0.8; // 80% de descuento

const precioOriginal = parseFloat(servicioEjemplo.price.replace(/\./g, ''));
const precioConConvenio = isConvenioValido ? Math.round(precioOriginal * (1 - descuentoConvenio)) : precioOriginal;
const precioFinal = precioConConvenio.toLocaleString('es-CL');

console.log('📊 CÁLCULO DE PRECIOS:');
console.log('=====================');
console.log(`💰 Precio Original: $${precioOriginal.toLocaleString('es-CL')}`);
console.log(`🔑 Código Ingresado: "${formDataEjemplo.codigoConvenio}"`);
console.log(`✅ Código Válido: ${isConvenioValido ? 'SÍ' : 'NO'}`);
console.log(`🏷️ Descuento Aplicado: ${isConvenioValido ? '80%' : '0%'}`);
console.log(`💸 Precio con Convenio: $${precioConConvenio.toLocaleString('es-CL')}`);
console.log(`📋 Precio Final: ${precioFinal}`);
console.log('');

// Simular el objeto paymentData que se debería generar
const paymentDataGenerado = {
  ...formDataEjemplo,
  service: servicioEjemplo.name,
  price: precioFinal,
  originalPrice: servicioEjemplo.price,
  category: servicioEjemplo.category,
  fecha: fechaEjemplo,
  hora: horaEjemplo,
  tipo_reunion: tipoReunionEjemplo,
  descripcion: formDataEjemplo.descripcion,
  codigoConvenio: formDataEjemplo.codigoConvenio,
  descuentoConvenio: isConvenioValido,
  porcentajeDescuento: isConvenioValido ? '80%' : null,
  id: Date.now().toString()
};

console.log('📦 OBJETO PAYMENTDATA GENERADO:');
console.log('===============================');
console.log(JSON.stringify(paymentDataGenerado, null, 2));
console.log('');

// Simular lo que debería ver MercadoPagoOfficialButton
const mercadoPagoData = {
  amount: parseInt(paymentDataGenerado.price.replace(/\./g, '')),
  description: `${paymentDataGenerado.service} - Punto Legal`,
  payer: {
    name: paymentDataGenerado.nombre,
    email: paymentDataGenerado.email,
    phone: paymentDataGenerado.telefono
  },
  metadata: {
    reservation_id: paymentDataGenerado.id,
    service_name: paymentDataGenerado.service,
    appointment_date: paymentDataGenerado.fecha,
    appointment_time: paymentDataGenerado.hora,
    client_name: paymentDataGenerado.nombre,
    client_email: paymentDataGenerado.email,
    codigo_convenio: paymentDataGenerado.codigoConvenio,
    descuento_convenio: paymentDataGenerado.descuentoConvenio,
    precio_original: paymentDataGenerado.originalPrice,
    porcentaje_descuento: paymentDataGenerado.porcentajeDescuento
  }
};

console.log('💳 DATOS PARA MERCADOPAGO:');
console.log('=========================');
console.log(`💰 Amount (número): ${mercadoPagoData.amount}`);
console.log(`📝 Description: "${mercadoPagoData.description}"`);
console.log(`👤 Payer Name: "${mercadoPagoData.payer.name}"`);
console.log(`📧 Payer Email: "${mercadoPagoData.payer.email}"`);
console.log(`📞 Payer Phone: "${mercadoPagoData.payer.phone}"`);
console.log('');

console.log('🏷️ METADATA DE CONVENIO:');
console.log('========================');
console.log(`🔑 Código Convenio: "${mercadoPagoData.metadata.codigo_convenio}"`);
console.log(`✅ Descuento Convenio: ${mercadoPagoData.metadata.descuento_convenio}`);
console.log(`💸 Precio Original: "${mercadoPagoData.metadata.precio_original}"`);
console.log(`📊 Porcentaje Descuento: "${mercadoPagoData.metadata.porcentaje_descuento}"`);
console.log('');

// Verificaciones críticas
const verificacionesCriticas = [
  {
    check: 'paymentData.price contiene precio con descuento',
    expected: precioFinal,
    actual: paymentDataGenerado.price,
    status: paymentDataGenerado.price === precioFinal ? '✅ CORRECTO' : '❌ ERROR'
  },
  {
    check: 'amount en MercadoPago es numérico correcto',
    expected: precioConConvenio,
    actual: mercadoPagoData.amount,
    status: mercadoPagoData.amount === precioConConvenio ? '✅ CORRECTO' : '❌ ERROR'
  },
  {
    check: 'descuentoConvenio flag está presente',
    expected: true,
    actual: paymentDataGenerado.descuentoConvenio,
    status: paymentDataGenerado.descuentoConvenio === true ? '✅ CORRECTO' : '❌ ERROR'
  },
  {
    check: 'originalPrice está presente para mostrar tachado',
    expected: servicioEjemplo.price,
    actual: paymentDataGenerado.originalPrice,
    status: paymentDataGenerado.originalPrice === servicioEjemplo.price ? '✅ CORRECTO' : '❌ ERROR'
  }
];

console.log('🔍 VERIFICACIONES CRÍTICAS:');
console.log('===========================');
verificacionesCriticas.forEach((verificacion, index) => {
  console.log(`${index + 1}. ${verificacion.check}`);
  console.log(`   📋 Esperado: ${verificacion.expected}`);
  console.log(`   📊 Actual: ${verificacion.actual}`);
  console.log(`   🎯 Estado: ${verificacion.status}`);
  console.log('');
});

// Instrucciones de debugging
const instruccionesDebug = [
  '1. 🌐 Ve a: http://localhost:8080/agendamiento?plan=general',
  '2. 📝 Completa el formulario con datos de prueba',
  '3. 🔑 Ingresa código: "PUNTOLEGAL!" en Código de Convenio',
  '4. ✅ Verifica que el precio cambie a $7.000',
  '5. 💳 Haz clic en "Pagar con MercadoPago"',
  '6. 🔍 Abre F12 → Console en la página MercadoPago',
  '7. 👀 Busca el log: "💳 Datos de pago cargados:"',
  '8. 📊 Verifica que price sea "7.000" y descuentoConvenio sea true',
  '9. 🎯 Confirma que la UI muestre el descuento correctamente'
];

console.log('🧪 INSTRUCCIONES DE DEBUGGING:');
console.log('==============================');
instruccionesDebug.forEach(instruccion => console.log(instruccion));
console.log('');

// Posibles problemas y soluciones
const problemasComunes = [
  {
    problema: 'Precio no se actualiza en MercadoPago',
    causa: 'paymentData.price no contiene el precio con descuento',
    solucion: 'Verificar que se use precioFinal en lugar de service.price'
  },
  {
    problema: 'No aparece badge de convenio',
    causa: 'descuentoConvenio flag no se está pasando',
    solucion: 'Verificar que se incluya en el objeto paymentData'
  },
  {
    problema: 'Precio original no aparece tachado',
    causa: 'originalPrice no está en paymentData',
    solucion: 'Asegurar que se pase service.price como originalPrice'
  }
];

console.log('🚨 POSIBLES PROBLEMAS Y SOLUCIONES:');
console.log('===================================');
problemasComunes.forEach((item, index) => {
  console.log(`${index + 1}. ${item.problema}`);
  console.log(`   🔍 Causa: ${item.causa}`);
  console.log(`   🔧 Solución: ${item.solucion}`);
  console.log('');
});

console.log('🎯 RESULTADO ESPERADO EN MERCADOPAGO:');
console.log('====================================');
console.log('📋 Servicio: Consulta General');
console.log('🏷️ Badge: "Convenio: PUNTOLEGAL!"');
console.log('💚 Caja verde: "Convenio aplicado - 80% OFF"');
console.log('💸 Precio original tachado: $35.000');
console.log('✨ Total prominente: $7.000');
console.log('📝 Descripción: "Con descuento de convenio"');
console.log('');

console.log('🔧 SI EL PROBLEMA PERSISTE:');
console.log('===========================');
console.log('1. Verificar que paymentData.price sea "7.000" en localStorage');
console.log('2. Verificar que paymentData.descuentoConvenio sea true');
console.log('3. Verificar que paymentData.originalPrice sea "35.000"');
console.log('4. Revisar logs en consola de la página MercadoPago');
console.log('5. Confirmar que no hay cache del navegador interfiriendo');
console.log('');
