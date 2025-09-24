import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simular datos que vienen del localStorage
const paymentData = {
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  telefono: '+56912345678',
  service: 'Consulta General',
  price: 1000,
  category: 'General',
  fecha: '2025-01-25',
  hora: '10:00',
  tipo_reunion: 'online',
  descripcion: 'Necesito asesoría legal'
};

console.log('🧪 Simulando flujo de PaymentSuccessPage...');
console.log('📋 Datos de pago simulados:', paymentData);

async function testPaymentSuccessFlow() {
  try {
    // 1. Crear reserva como lo hace PaymentSuccessPage
    console.log('\n1️⃣ Creando reserva...');
    
    const reservationData = {
      cliente_nombre: paymentData.nombre || 'Cliente',
      cliente_rut: 'No especificado',
      cliente_email: paymentData.email || 'No especificado',
      cliente_telefono: paymentData.telefono || 'No especificado',
      fecha: paymentData.fecha || new Date().toISOString().split('T')[0],
      hora: paymentData.hora || '10:00',
      descripcion: `Consulta ${paymentData.service || 'General'} - Pago confirmado via MercadoPago`,
      servicio_tipo: paymentData.service || 'Consulta General',
      servicio_precio: paymentData.price?.toString() || '35000',
      servicio_categoria: paymentData.category || 'General',
      tipo_reunion: paymentData.tipo_reunion || 'online',
      estado: 'confirmada',
      webhook_sent: false
    };

    console.log('📝 Datos de reserva:', reservationData);

    const { data: reservaData, error: insertError } = await supabase
      .from('reservas')
      .insert([{
        cliente_nombre: reservationData.cliente_nombre,
        cliente_rut: reservationData.cliente_rut,
        cliente_email: reservationData.cliente_email,
        cliente_telefono: reservationData.cliente_telefono,
        fecha: reservationData.fecha,
        hora: reservationData.hora,
        descripcion: reservationData.descripcion,
        servicio_tipo: reservationData.servicio_tipo,
        servicio_precio: reservationData.servicio_precio,
        servicio_categoria: reservationData.servicio_categoria,
        tipo_reunion: reservationData.tipo_reunion,
        estado: reservationData.estado,
        webhook_sent: reservationData.webhook_sent,
        recordatorio_enviado: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'anonymous'
      }])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error insertando reserva:', insertError);
      return;
    }

    console.log('✅ Reserva creada exitosamente:', reservaData);

    // 2. Simular confirmación
    console.log('\n2️⃣ Confirmando reserva...');
    
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ 
        estado: 'confirmada',
        pago_metodo: 'mercadopago',
        pago_estado: 'aprobado',
        pago_id: 'test-payment-' + Date.now(),
        pago_monto: paymentData.price,
        email_enviado: true
      })
      .eq('id', reservaData.id);

    if (updateError) {
      console.error('❌ Error confirmando reserva:', updateError);
      return;
    }

    console.log('✅ Reserva confirmada exitosamente');

    // 3. Verificar datos finales
    console.log('\n3️⃣ Verificando datos finales...');
    
    const { data: finalData, error: selectError } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', reservaData.id)
      .single();

    if (selectError) {
      console.error('❌ Error obteniendo datos finales:', selectError);
      return;
    }

    console.log('📊 Datos finales de la reserva:');
    console.log('   Cliente:', finalData.cliente_nombre);
    console.log('   Email:', finalData.cliente_email);
    console.log('   Teléfono:', finalData.cliente_telefono);
    console.log('   Servicio:', finalData.servicio_tipo);
    console.log('   Precio:', finalData.servicio_precio);
    console.log('   Estado:', finalData.estado);
    console.log('   Pago Estado:', finalData.pago_estado);

    // 4. Limpiar datos de prueba
    console.log('\n4️⃣ Limpiando datos de prueba...');
    await supabase
      .from('reservas')
      .delete()
      .eq('id', reservaData.id);

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Flujo de PaymentSuccessPage funciona correctamente!');

  } catch (error) {
    console.error('❌ Error en el flujo:', error);
  }
}

testPaymentSuccessFlow();
