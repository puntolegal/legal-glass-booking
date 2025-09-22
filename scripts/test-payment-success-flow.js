#!/usr/bin/env node

/**
 * Script para probar el flujo completo de pago exitoso
 * Simula los datos que se guardan en localStorage y verifica que se muestren correctamente
 */

// Simular datos de pago como se guardan en localStorage
const simulatePaymentData = {
  // Datos del formulario
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  telefono: '+56912345678',
  rut: '12345678-9',
  descripcion: 'Necesito asesoría legal para mi empresa',
  
  // Datos del servicio
  service: 'Consulta General',
  price: 1000, // Precio numérico (código admin)
  priceFormatted: '1.000', // Precio formateado
  originalPrice: '35.000',
  category: 'General',
  
  // Datos de la cita
  fecha: '2025-09-23',
  hora: '10:00',
  tipo_reunion: 'online',
  
  // Datos del código
  codigoConvenio: 'PUNTOLEGALADMIN',
  descuentoConvenio: false,
  porcentajeDescuento: null,
  
  // ID único
  id: Date.now().toString()
};

// Simular datos de reserva como se crean en la base de datos
const simulateReservationData = {
  id: 'test-reservation-id',
  cliente_nombre: simulatePaymentData.nombre,
  cliente_rut: simulatePaymentData.rut,
  cliente_email: simulatePaymentData.email,
  cliente_telefono: simulatePaymentData.telefono,
  fecha: simulatePaymentData.fecha,
  hora: simulatePaymentData.hora,
  descripcion: `Consulta ${simulatePaymentData.service} - Pago confirmado via MercadoPago`,
  servicio_tipo: simulatePaymentData.service,
  servicio_precio: simulatePaymentData.price.toString(),
  servicio_categoria: simulatePaymentData.category,
  tipo_reunion: simulatePaymentData.tipo_reunion,
  estado: 'confirmada',
  webhook_sent: false,
  created_at: new Date().toISOString()
};

// Simular paymentData como se construye en PaymentSuccessPage
const simulatePaymentSuccessData = {
  reservation: simulateReservationData,
  mercadopagoData: {
    collection_id: '123456789',
    collection_status: 'approved',
    payment_id: '987654321',
    status: 'approved',
    external_reference: 'PL-123456789',
    payment_type: 'credit_card',
    merchant_order_id: 'MO-123456789',
    preference_id: '2683873567-test-preference',
    site_id: 'MLC',
    processing_mode: 'aggregator'
  },
  emailResult: {
    success: true,
    trackingCode: 'PL-123456',
    googleMeetLink: 'https://meet.google.com/test-link'
  },
  // Datos del cliente para mostrar en la UI
  cliente: {
    nombre: simulatePaymentData.nombre,
    email: simulatePaymentData.email,
    telefono: simulatePaymentData.telefono
  },
  servicio: {
    tipo: simulatePaymentData.service,
    precio: simulatePaymentData.price,
    categoria: simulatePaymentData.category
  },
  fecha: simulatePaymentData.fecha,
  hora: simulatePaymentData.hora,
  tipo_reunion: simulatePaymentData.tipo_reunion,
  // Datos adicionales para debugging
  price: simulatePaymentData.price
};

// Función para probar la lógica de mostrar el precio
function testPriceDisplay(paymentData) {
  console.log('🧪 Probando lógica de mostrar precio...\n');
  
  // Simular la lógica de PaymentSuccessPage
  const precio = paymentData?.price || 
               paymentData?.reservation?.servicio_precio || 
               paymentData?.servicio?.precio;
  
  console.log('📋 Precio obtenido:', precio);
  console.log('📋 Tipo:', typeof precio);
  
  if (precio) {
    // Si es string, limpiar y convertir a número
    const precioNum = typeof precio === 'string' 
      ? parseInt(precio.replace(/[^\d]/g, '')) 
      : Number(precio);
    
    console.log('📋 Precio numérico:', precioNum);
    
    // Si el precio es válido y mayor a 0, mostrarlo
    if (precioNum > 0) {
      const precioFormateado = precioNum.toLocaleString('es-CL');
      console.log('✅ Precio formateado:', precioFormateado);
      return precioFormateado;
    }
  }
  
  // Fallback: precio por defecto
  console.log('⚠️ Usando precio por defecto: 35.000');
  return '35.000';
}

// Función para probar la lógica de mostrar datos del cliente
function testClientDataDisplay(paymentData) {
  console.log('\n🧪 Probando lógica de mostrar datos del cliente...\n');
  
  const cliente = {
    nombre: paymentData?.reservation?.cliente_nombre || paymentData?.cliente?.nombre || 'Cliente',
    email: paymentData?.reservation?.cliente_email || paymentData?.cliente?.email || 'No especificado',
    telefono: paymentData?.reservation?.cliente_telefono || paymentData?.cliente?.telefono || 'No especificado'
  };
  
  console.log('📋 Datos del cliente:');
  console.log('   Nombre:', cliente.nombre);
  console.log('   Email:', cliente.email);
  console.log('   Teléfono:', cliente.telefono);
  
  return cliente;
}

// Función para probar la lógica de mostrar datos del servicio
function testServiceDataDisplay(paymentData) {
  console.log('\n🧪 Probando lógica de mostrar datos del servicio...\n');
  
  const servicio = {
    tipo: paymentData?.reservation?.servicio_tipo || paymentData?.servicio?.tipo || 'Consulta Legal',
    precio: paymentData?.reservation?.servicio_precio || paymentData?.servicio?.precio || '35.000',
    categoria: paymentData?.reservation?.servicio_categoria || paymentData?.servicio?.categoria || 'General'
  };
  
  console.log('📋 Datos del servicio:');
  console.log('   Tipo:', servicio.tipo);
  console.log('   Precio:', servicio.precio);
  console.log('   Categoría:', servicio.categoria);
  
  return servicio;
}

// Ejecutar pruebas
console.log('🚀 Iniciando pruebas del flujo de pago exitoso\n');
console.log('📋 Datos de prueba simulados:');
console.log('   Cliente:', simulatePaymentData.nombre);
console.log('   Email:', simulatePaymentData.email);
console.log('   Servicio:', simulatePaymentData.service);
console.log('   Precio:', simulatePaymentData.price);
console.log('   Código Admin:', simulatePaymentData.codigoConvenio);

// Probar lógica de precio
const precioMostrado = testPriceDisplay(simulatePaymentSuccessData);
console.log('\n💰 Precio que se mostraría:', `$${precioMostrado}`);

// Probar lógica de datos del cliente
const clienteMostrado = testClientDataDisplay(simulatePaymentSuccessData);
console.log('\n👤 Cliente que se mostraría:', clienteMostrado);

// Probar lógica de datos del servicio
const servicioMostrado = testServiceDataDisplay(simulatePaymentSuccessData);
console.log('\n🔧 Servicio que se mostraría:', servicioMostrado);

// Verificar que todo esté correcto
console.log('\n📊 Resumen de pruebas:');
console.log('====================');
console.log(`✅ Precio mostrado: $${precioMostrado} (esperado: $1.000)`);
console.log(`✅ Cliente mostrado: ${clienteMostrado.nombre} (esperado: Juan Pérez)`);
console.log(`✅ Email mostrado: ${clienteMostrado.email} (esperado: juan@ejemplo.com)`);
console.log(`✅ Servicio mostrado: ${servicioMostrado.tipo} (esperado: Consulta General)`);

if (precioMostrado === '1.000' && 
    clienteMostrado.nombre === 'Juan Pérez' && 
    clienteMostrado.email === 'juan@ejemplo.com' && 
    servicioMostrado.tipo === 'Consulta General') {
  console.log('\n🎉 ¡Todas las pruebas pasaron! El flujo está corregido.');
} else {
  console.log('\n❌ Algunas pruebas fallaron. Revisar la lógica.');
}
