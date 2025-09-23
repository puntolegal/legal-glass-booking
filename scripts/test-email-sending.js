// Script para probar el envío de emails
const RESEND_API_KEY = 're_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW';
const MAIL_FROM = 'Punto Legal <team@puntolegal.online>';
const ADMIN_EMAIL = 'puntolegalelgolf@gmail.com';

async function testEmailSending() {
  console.log('📧 Probando envío de emails...');
  
  const testBookingData = {
    id: 'test-' + Date.now(),
    cliente_nombre: 'Juan Pérez',
    cliente_email: 'juan@ejemplo.com',
    cliente_telefono: '+56912345678',
    servicio_tipo: 'Consulta General',
    servicio_precio: '1000',
    fecha: '2025-01-25',
    hora: '10:00',
    tipo_reunion: 'online',
    descripcion: 'Consulta de prueba',
    cliente_rut: 'No especificado'
  };

  console.log('📋 Datos de prueba:', testBookingData);

  try {
    // 1. Email al cliente
    console.log('\n1️⃣ Enviando email al cliente...');
    
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
          <h2 style="color: #495057; margin-top: 0;">Hola ${testBookingData.cliente_nombre},</h2>
          
          <p>Tu consulta legal ha sido confirmada y el pago procesado correctamente. Aquí tienes los detalles:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">📅 Detalles de tu consulta</h3>
            <p><strong>Servicio:</strong> ${testBookingData.servicio_tipo}</p>
            <p><strong>Fecha:</strong> ${new Date(testBookingData.fecha).toLocaleDateString('es-CL')}</p>
            <p><strong>Hora:</strong> ${testBookingData.hora} hrs</p>
            <p><strong>Tipo de reunión:</strong> ${testBookingData.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</p>
            <p><strong>Precio pagado:</strong> $${parseInt(testBookingData.servicio_precio).toLocaleString('es-CL')}</p>
            <p><strong>Descripción:</strong> ${testBookingData.descripcion}</p>
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
        to: [testBookingData.cliente_email],
        subject: `✅ Consulta confirmada - ${testBookingData.servicio_tipo} - Punto Legal`,
        html: clientEmailHtml,
      }),
    });

    if (!clientResponse.ok) {
      const error = await clientResponse.text();
      throw new Error(`Error enviando email al cliente: ${clientResponse.status} - ${error}`);
    }

    const clientResult = await clientResponse.json();
    console.log('✅ Email al cliente enviado:', clientResult.id);

    // 2. Email al administrador
    console.log('\n2️⃣ Enviando email al administrador...');
    
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
            <p><strong>Nombre:</strong> ${testBookingData.cliente_nombre}</p>
            <p><strong>Email:</strong> ${testBookingData.cliente_email}</p>
            <p><strong>Teléfono:</strong> ${testBookingData.cliente_telefono}</p>
            <p><strong>RUT:</strong> ${testBookingData.cliente_rut}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc3545; margin-top: 0;">📅 Detalles de la consulta</h3>
            <p><strong>Servicio:</strong> ${testBookingData.servicio_tipo}</p>
            <p><strong>Fecha:</strong> ${new Date(testBookingData.fecha).toLocaleDateString('es-CL')}</p>
            <p><strong>Hora:</strong> ${testBookingData.hora} hrs</p>
            <p><strong>Tipo de reunión:</strong> ${testBookingData.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</p>
            <p><strong>Precio:</strong> $${parseInt(testBookingData.servicio_precio).toLocaleString('es-CL')}</p>
            <p><strong>Descripción:</strong> ${testBookingData.descripcion}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">⚠️ Acción requerida</h4>
            <p style="margin: 0;">Contacta al cliente 24 horas antes de la consulta para confirmar y enviar el link de la videollamada.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              Punto Legal - Sistema de Gestión<br>
              ID de reserva: ${testBookingData.id}
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
        subject: `🔔 Nueva consulta confirmada - ${testBookingData.cliente_nombre} - ${testBookingData.servicio_tipo}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminResponse.ok) {
      const error = await adminResponse.text();
      throw new Error(`Error enviando email al administrador: ${adminResponse.status} - ${error}`);
    }

    const adminResult = await adminResponse.json();
    console.log('✅ Email al administrador enviado:', adminResult.id);

    console.log('\n🎉 ¡Todos los emails enviados exitosamente!');
    console.log('📧 Cliente:', testBookingData.cliente_email);
    console.log('📧 Administrador:', ADMIN_EMAIL);

  } catch (error) {
    console.error('❌ Error enviando emails:', error);
  }
}

testEmailSending();
