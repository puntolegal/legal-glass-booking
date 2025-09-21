/**
 * Script para generar URL de webhook de Make.com
 * Ejecutar: node scripts/generate-make-webhook.js
 */

console.log('🔗 GENERADOR DE WEBHOOK PARA MAKE.COM\n');

console.log('📋 INSTRUCCIONES:');
console.log('1. Ir a https://www.make.com');
console.log('2. Crear nuevo scenario');
console.log('3. Agregar módulo "Webhook"');
console.log('4. Copiar la URL generada');
console.log('5. Actualizar en src/services/makeEmailService.ts');

console.log('\n🔧 CONFIGURACIÓN REQUERIDA:');
console.log('• Método: POST');
console.log('• Content-Type: application/json');
console.log('• Response: 200 OK');

console.log('\n📤 ESTRUCTURA DE DATOS ESPERADA:');
console.log(JSON.stringify({
  cliente: {
    nombre: "string",
    email: "string",
    telefono: "string"
  },
  servicio: {
    tipo: "string",
    precio: "string",
    fecha: "string",
    hora: "string"
  },
  pago: {
    metodo: "string",
    estado: "string",
    fecha_pago: "string"
  },
  reserva: {
    id: "string",
    tracking_code: "string",
    google_meet_link: "string"
  },
  calendar: {
    start_date: "string",
    end_date: "string"
  }
}, null, 2));

console.log('\n🧪 DATOS DE PRUEBA:');
console.log(JSON.stringify({
  cliente: {
    nombre: "Juan Perez",
    email: "juan@ejemplo.com",
    telefono: "+56 9 1234 5678"
  },
  servicio: {
    tipo: "Consulta Laboral",
    precio: "30000",
    fecha: "2024-01-15",
    hora: "10:00"
  },
  pago: {
    metodo: "MercadoPago",
    estado: "Aprobado",
    fecha_pago: "2024-01-10T10:30:00Z"
  },
  reserva: {
    id: "12345",
    tracking_code: "PL-ABC123",
    google_meet_link: "https://meet.google.com/abc-def-ghi"
  },
  calendar: {
    start_date: "2024-01-15T10:00:00",
    end_date: "2024-01-15T10:45:00"
  }
}, null, 2));

console.log('\n✅ PASOS SIGUIENTES:');
console.log('1. Crear scenario en Make.com');
console.log('2. Configurar módulos manualmente');
console.log('3. Copiar URL del webhook');
console.log('4. Actualizar makeEmailService.ts');
console.log('5. Probar con datos de prueba');

console.log('\n🎯 RESULTADO ESPERADO:');
console.log('• Emails enviados al cliente y admin');
console.log('• Evento creado en Google Calendar');
console.log('• Respuesta JSON con datos de confirmación');
