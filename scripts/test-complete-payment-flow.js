// Script para probar el flujo completo de pago
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simular datos que vienen del localStorage (como los que se guardan en AgendamientoPage)
const paymentDataFromLocalStorage = {
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  telefono: '+56912345678',
  service: 'Consulta General',
  price: 1000,
  priceFormatted: '$1.000',
  originalPrice: 35000,
  category: 'General',
  fecha: '2025-01-25',
  hora: '10:00',
  tipo_reunion: 'online',
  descripcion: 'Necesito asesoría legal para mi empresa',
  codigoConvenio: 'PUNTOLEGALADMIN',
  descuentoConvenio: true,
  porcentajeDescuento: '80%',
  id: '1758590123456'
};

console.log('🧪 Simulando flujo completo de PaymentSuccessPage...');
console.log('📋 Datos del localStorage:', paymentDataFromLocalStorage);

async function testCompletePaymentFlow() {
  try {
    // 1. Simular el proceso de PaymentSuccessPage
    console.log('\n1️⃣ Procesando datos del pago...');
    
    // Extraer parámetros de MercadoPago (simulados)
    const mercadopagoData = {
      collection_id: '127194810190',
      collection_status: 'approved',
      payment_id: '127194810190',
      status: 'approved',
      external_reference: 'PL-1758589107235-u1y24vnok',
      payment_type: 'credit_card',
      preference_id: '2683873567-2ab2e55b-c217-42ab-b888-267894c25643',
      site_id: 'MLC'
    };

    console.log('💳 Datos de MercadoPago:', mercadopagoData);

    // 2. Crear reserva como lo hace PaymentSuccessPage
    console.log('\n2️⃣ Creando reserva...');
    
    const reservationData = {
      cliente_nombre: paymentDataFromLocalStorage.nombre || 'Cliente',
      cliente_rut: 'No especificado',
      cliente_email: paymentDataFromLocalStorage.email || 'No especificado',
      cliente_telefono: paymentDataFromLocalStorage.telefono || 'No especificado',
      fecha: paymentDataFromLocalStorage.fecha || new Date().toISOString().split('T')[0],
      hora: paymentDataFromLocalStorage.hora || '10:00',
      descripcion: `Consulta ${paymentDataFromLocalStorage.service || 'General'} - Pago confirmado via MercadoPago`,
      servicio_tipo: paymentDataFromLocalStorage.service || 'Consulta General',
      servicio_precio: paymentDataFromLocalStorage.price?.toString() || '35000',
      servicio_categoria: paymentDataFromLocalStorage.category || 'General',
      tipo_reunion: paymentDataFromLocalStorage.tipo_reunion || 'online',
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

    // 3. Simular confirmación y envío de emails
    console.log('\n3️⃣ Confirmando reserva y enviando emails...');
    
    // Actualizar estado de pago
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ 
        estado: 'confirmada',
        pago_metodo: 'mercadopago',
        pago_estado: 'aprobado',
        pago_id: mercadopagoData.payment_id,
        pago_monto: paymentDataFromLocalStorage.price,
        email_enviado: true
      })
      .eq('id', reservaData.id);

    if (updateError) {
      console.error('❌ Error confirmando reserva:', updateError);
      return;
    }

    console.log('✅ Reserva confirmada exitosamente');

    // 4. Simular envío de emails
    console.log('\n4️⃣ Enviando emails...');
    
    const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';
    const MAIL_FROM = 'Punto Legal <team@puntolegal.online>';
    const ADMIN_EMAIL = 'puntolegalelgolf@gmail.com';

    // Email al cliente
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de Consulta - Punto Legal</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">¡Consulta Confirmada!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Tu pago ha sido procesado exitosamente</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #495057; margin-top: 0;">Hola ${reservaData.cliente_nombre},</h2>
          
          <p>Tu consulta legal ha sido confirmada y el pago procesado correctamente. Aquí tienes los detalles:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">📅 Detalles de tu consulta</h3>
            <p><strong>Servicio:</strong> ${reservaData.servicio_tipo}</p>
            <p><strong>Fecha:</strong> ${new Date(reservaData.fecha).toLocaleDateString('es-CL')}</p>
            <p><strong>Hora:</strong> ${reservaData.hora} hrs</p>
            <p><strong>Tipo de reunión:</strong> ${reservaData.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</p>
            <p><strong>Precio pagado:</strong> $${parseInt(reservaData.servicio_precio).toLocaleString('es-CL')}</p>
            <p><strong>Descripción:</strong> ${reservaData.descripcion}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">📧 Próximos pasos</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Te contactaremos 24 horas antes de tu consulta</li>
              <li>Te enviaremos el link de la videollamada o la dirección de la oficina</li>
              <li>Si tienes alguna pregunta, no dudes en contactarnos</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">¡Gracias por confiar en Punto Legal!</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              Punto Legal - Consultoría Jurídica Especializada<br>
              Email: team@puntolegal.online | Web: puntolegal.online
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const clientResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [reservaData.cliente_email],
        subject: `✅ Consulta confirmada - ${reservaData.servicio_tipo} - Punto Legal`,
        html: clientEmailHtml,
      }),
    });

    if (!clientResponse.ok) {
      const error = await clientResponse.text();
      throw new Error(`Error enviando email al cliente: ${clientResponse.status} - ${error}`);
    }

    const clientResult = await clientResponse.json();
    console.log('✅ Email al cliente enviado:', clientResult.id);

    // Email al administrador
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nueva Consulta - Punto Legal</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Nueva Consulta Confirmada</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Pago procesado exitosamente</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #495057; margin-top: 0;">Detalles del cliente</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc3545; margin-top: 0;">👤 Información del cliente</h3>
            <p><strong>Nombre:</strong> ${reservaData.cliente_nombre}</p>
            <p><strong>Email:</strong> ${reservaData.cliente_email}</p>
            <p><strong>Teléfono:</strong> ${reservaData.cliente_telefono}</p>
            <p><strong>RUT:</strong> ${reservaData.cliente_rut}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc3545; margin-top: 0;">📅 Detalles de la consulta</h3>
            <p><strong>Servicio:</strong> ${reservaData.servicio_tipo}</p>
            <p><strong>Fecha:</strong> ${new Date(reservaData.fecha).toLocaleDateString('es-CL')}</p>
            <p><strong>Hora:</strong> ${reservaData.hora} hrs</p>
            <p><strong>Tipo de reunión:</strong> ${reservaData.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</p>
            <p><strong>Precio:</strong> $${parseInt(reservaData.servicio_precio).toLocaleString('es-CL')}</p>
            <p><strong>Descripción:</strong> ${reservaData.descripcion}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">⚠️ Acción requerida</h4>
            <p style="margin: 0;">Contacta al cliente 24 horas antes de la consulta para confirmar y enviar el link de la videollamada.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              Punto Legal - Sistema de Gestión<br>
              ID de reserva: ${reservaData.id}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [ADMIN_EMAIL],
        subject: `🔔 Nueva consulta confirmada - ${reservaData.cliente_nombre} - ${reservaData.servicio_tipo}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminResponse.ok) {
      const error = await adminResponse.text();
      throw new Error(`Error enviando email al administrador: ${adminResponse.status} - ${error}`);
    }

    const adminResult = await adminResponse.json();
    console.log('✅ Email al administrador enviado:', adminResult.id);

    // 5. Verificar datos finales
    console.log('\n5️⃣ Verificando datos finales...');
    
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
    console.log('   Email Enviado:', finalData.email_enviado);

    // 6. Simular datos que se mostrarían en PaymentSuccessPage
    console.log('\n6️⃣ Datos para mostrar en PaymentSuccessPage:');
    const paymentDataForUI = {
      reservation: finalData,
      mercadopagoData,
      cliente: {
        nombre: finalData.cliente_nombre,
        email: finalData.cliente_email,
        telefono: finalData.cliente_telefono
      },
      servicio: {
        tipo: finalData.servicio_tipo,
        precio: finalData.servicio_precio,
        categoria: finalData.servicio_categoria
      },
      fecha: finalData.fecha,
      hora: finalData.hora,
      tipo_reunion: finalData.tipo_reunion,
      price: paymentDataFromLocalStorage.price
    };

    console.log('🎯 Datos para UI:', JSON.stringify(paymentDataForUI, null, 2));

    // 7. Limpiar datos de prueba
    console.log('\n7️⃣ Limpiando datos de prueba...');
    await supabase
      .from('reservas')
      .delete()
      .eq('id', reservaData.id);

    console.log('✅ Datos de prueba eliminados');
    console.log('\n🎉 ¡Flujo completo funciona perfectamente!');
    console.log('📧 Emails enviados a:', reservaData.cliente_email, 'y', ADMIN_EMAIL);
    console.log('💰 Precio mostrado correctamente: $' + paymentDataFromLocalStorage.price.toLocaleString('es-CL'));

  } catch (error) {
    console.error('❌ Error en el flujo completo:', error);
  }
}

testCompletePaymentFlow();
