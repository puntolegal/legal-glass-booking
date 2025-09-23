#!/usr/bin/env node

/**
 * Script para probar el flujo completo de datos desde AgendamientoPage hasta PaymentSuccessPage
 */

console.log('🧪 Probando flujo completo de datos...\n');

// Simular datos de AgendamientoPage
const formData = {
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  telefono: '+56912345678',
  empresa: 'Mi Empresa',
  descripcion: 'Necesito asesoría legal',
  codigoConvenio: 'PUNTOLEGALADMIN'
};

const service = {
  name: 'Consulta General - Punto Legal',
  price: '35.000',
  category: 'General'
};

const selectedDate = '2025-09-23';
const selectedTime = '10:00';
const selectedMeetingType = 'videollamada';
const precioNumerico = 1000; // Precio con código admin
const precioFinal = '1.000';

// Simular creación de paymentData (como en AgendamientoPage)
const paymentData = {
  ...formData,
  service: service.name,
  price: precioNumerico,
  priceFormatted: precioFinal,
  originalPrice: service.price,
  category: service.category,
  fecha: selectedDate,
  hora: selectedTime,
  tipo_reunion: selectedMeetingType,
  descripcion: formData.descripcion,
  codigoConvenio: formData.codigoConvenio,
  descuentoConvenio: false,
  porcentajeDescuento: null,
  id: Date.now().toString()
};

console.log('📋 paymentData creado:', paymentData);

// Simular guardado en localStorage
localStorage.setItem('paymentData', JSON.stringify(paymentData));

// Simular lectura en PaymentSuccessPage
const storedData = localStorage.getItem('paymentData');
const paymentInfo = JSON.parse(storedData);

console.log('\n📋 Datos recuperados en PaymentSuccessPage:', paymentInfo);

// Simular mapeo de datos
const reservationData = {
  cliente_nombre: paymentInfo.nombre || 'Cliente',
  cliente_rut: 'No especificado',
  cliente_email: paymentInfo.email || 'No especificado',
  cliente_telefono: paymentInfo.telefono || 'No especificado',
  fecha: paymentInfo.fecha || new Date().toISOString().split('T')[0],
  hora: paymentInfo.hora || '10:00',
  descripcion: `Consulta ${paymentInfo.service || 'General'} - Pago confirmado via MercadoPago`,
  servicio_tipo: paymentInfo.service || 'Consulta General',
  servicio_precio: paymentInfo.price || '35000',
  servicio_categoria: paymentInfo.category || 'General',
  tipo_reunion: paymentInfo.tipo_reunion || 'online',
  estado: 'confirmada',
  webhook_sent: false
};

console.log('\n📋 reservationData mapeado:', reservationData);

// Simular datos para mostrar en UI
const cliente = {
  nombre: paymentInfo.nombre || 'Cliente',
  email: paymentInfo.email || 'No especificado',
  telefono: paymentInfo.telefono || 'No especificado'
};

console.log('\n👤 Datos del cliente para UI:', cliente);

// Verificar si los datos se mantienen
const dataIntegrity = {
  nombre: paymentInfo.nombre === formData.nombre,
  email: paymentInfo.email === formData.email,
  telefono: paymentInfo.telefono === formData.telefono,
  service: paymentInfo.service === service.name,
  price: paymentInfo.price === precioNumerico
};

console.log('\n✅ Integridad de datos:', dataIntegrity);

// Limpiar localStorage
localStorage.removeItem('paymentData');

console.log('\n🎉 Prueba completada');
