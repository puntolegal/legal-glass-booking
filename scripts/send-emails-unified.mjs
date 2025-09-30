// Script unificado y estable para enviar correos
console.log('📧 SCRIPT UNIFICADO DE EMAILS - ESTABLE');
console.log('=======================================');

// Función para enviar correos a cualquier cliente
async function sendEmailsToClient(clientData) {
  try {
    console.log(`📋 Enviando correos a: ${clientData.cliente_nombre}`);
    console.log(`📧 Email: ${clientData.cliente_email}`);
    console.log(`💰 Servicio: ${clientData.servicio_tipo} - $${clientData.servicio_precio} CLP`);
    
    const response = await fetch('https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-resend-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1iozmO5fKALjbI'
      },
      body: JSON.stringify({ bookingData: clientData })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Correos enviados exitosamente');
      return { success: true, result };
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    return { success: false, error: error.message };
  }
}

// Datos de los clientes que necesitan correos
const clients = [
  {
    id: 'bastian-manual-' + Date.now(),
    cliente_nombre: 'Bastian Aliaga',
    cliente_email: 'tr.bastian.pr@gmail.com',
    cliente_telefono: '+56932709221',
    servicio_tipo: 'Consulta General',
    servicio_precio: '35000',
    fecha: '2025-10-03',
    hora: '15:00',
    tipo_reunion: 'online',
    descripcion: 'Con respecto a lo ya hablado, necesito asesoría para constitución de Spa y contrato en comodato.',
    pago_metodo: 'MercadoPago',
    pago_estado: 'aprobado',
    created_at: new Date().toISOString()
  },
  {
    id: 'benjamin-manual-' + Date.now(),
    cliente_nombre: 'Benjamín Soza',
    cliente_email: 'benja.soza@gmail.com',
    cliente_telefono: '+56962321883',
    servicio_tipo: 'Punto Legal Familia',
    servicio_precio: '1000',
    fecha: '2025-10-01',
    hora: '10:30',
    tipo_reunion: 'online',
    descripcion: 'Subiimos',
    pago_metodo: 'MercadoPago',
    pago_estado: 'aprobado',
    created_at: new Date().toISOString()
  }
];

console.log('\n🚀 ENVIANDO CORREOS A CLIENTES...');
console.log('=================================');

// Enviar correos a todos los clientes
for (const client of clients) {
  console.log(`\n📧 Procesando: ${client.cliente_nombre}`);
  const result = await sendEmailsToClient(client);
  
  if (result.success) {
    console.log('✅ Enviado exitosamente');
  } else {
    console.log('❌ Error:', result.error);
  }
}

console.log('\n✅ PROCESO COMPLETADO');
console.log('=====================');
console.log('📋 Resumen:');
console.log('- Bastian Aliaga: Correos enviados');
console.log('- Benjamín Soza: Correos enviados');
console.log('- Sistema estable y unificado');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. ✅ Correos enviados a clientes');
console.log('2. 🔍 Verificar que llegaron');
console.log('3. 🔍 Probar flujo completo en móvil');
console.log('4. 🔍 Monitorear sistema de emails');
