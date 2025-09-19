/**
 * Webhook de MercadoPago para procesar notificaciones de pago
 * Se ejecuta cuando MercadoPago notifica sobre cambios en el estado del pago
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.0q_3bb8bKR8VVZZAK_hYvhzLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('🔔 Webhook MercadoPago recibido');
    
    // Parsear datos del webhook
    const webhookData = JSON.parse(event.body);
    console.log('📋 Datos del webhook:', webhookData);

    // Extraer información del pago
    const {
      id: payment_id,
      status,
      status_detail,
      transaction_amount,
      currency_id,
      payment_method_id,
      payment_type_id,
      date_approved,
      date_created,
      external_reference,
      description,
      payer: {
        email: payer_email,
        identification: { number: payer_document }
      } = {},
      metadata = {}
    } = webhookData;

    console.log('💳 Procesando pago:', {
      payment_id,
      status,
      transaction_amount,
      external_reference,
      payer_email
    });

    // Buscar reserva por external_reference
    if (!external_reference) {
      console.log('⚠️ No se encontró external_reference');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No external reference found' })
      };
    }

    // Buscar reserva en la base de datos
    const { data: reserva, error: searchError } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', external_reference)
      .single();

    if (searchError || !reserva) {
      console.log('❌ Reserva no encontrada:', external_reference);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Reservation not found' })
      };
    }

    console.log('✅ Reserva encontrada:', reserva.id);

    // Actualizar estado de la reserva según el estado del pago
    let nuevoEstado = 'pendiente';
    let webhookSent = false;

    switch (status) {
      case 'approved':
        nuevoEstado = 'confirmada';
        webhookSent = true;
        break;
      case 'pending':
        nuevoEstado = 'pendiente';
        break;
      case 'rejected':
      case 'cancelled':
        nuevoEstado = 'cancelada';
        break;
      default:
        nuevoEstado = 'pendiente';
    }

    // Actualizar reserva en la base de datos
    const { data: updatedReserva, error: updateError } = await supabase
      .from('reservas')
      .update({
        estado: nuevoEstado,
        webhook_sent: webhookSent,
        pago_id: payment_id,
        pago_estado: status,
        pago_metodo: payment_method_id,
        pago_fecha: date_approved || date_created,
        updated_at: new Date().toISOString()
      })
      .eq('id', external_reference)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error actualizando reserva:', updateError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update reservation' })
      };
    }

    console.log('✅ Reserva actualizada:', updatedReserva.id, 'Estado:', nuevoEstado);

    // Si el pago fue aprobado, enviar emails de confirmación
    if (status === 'approved' && webhookSent) {
      try {
        console.log('📧 Enviando emails de confirmación...');
        
        // Preparar datos para el email
        const emailData = {
          id: updatedReserva.id,
          cliente_nombre: updatedReserva.nombre,
          cliente_email: updatedReserva.email,
          cliente_telefono: updatedReserva.telefono,
          servicio_tipo: updatedReserva.servicio || 'Consulta General',
          servicio_precio: updatedReserva.precio || '35000',
          fecha: updatedReserva.fecha,
          hora: updatedReserva.hora,
          pago_metodo: 'MercadoPago',
          pago_estado: 'Aprobado',
          pago_id: payment_id,
          created_at: updatedReserva.created_at
        };

        // Enviar emails usando webhook de Make.com
        try {
          const webhookUrl = 'https://hook.us2.make.com/qahisda8n5e6bh9my4f9fm6dkgdg71sq';
          
          const emailPayload = {
            client_name: emailData.cliente_nombre,
            client_email: emailData.cliente_email,
            client_phone: emailData.cliente_telefono,
            service_type: emailData.servicio_tipo,
            service_price: emailData.servicio_precio,
            appointment_date: emailData.fecha,
            appointment_time: emailData.hora,
            reservation_id: emailData.id,
            payment_method: emailData.pago_metodo,
            payment_status: emailData.pago_estado,
            admin_email: 'puntolegalelgolf@gmail.com',
            created_at: emailData.created_at,
            timestamp: new Date().toISOString()
          };

          const emailResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload)
          });

          if (emailResponse.ok) {
            console.log('✅ Emails enviados exitosamente via webhook');
          } else {
            console.error('❌ Error enviando emails via webhook:', emailResponse.status);
          }
        } catch (emailError) {
          console.error('❌ Error enviando emails:', emailError);
        }

      } catch (emailError) {
        console.error('❌ Error en proceso de emails:', emailError);
      }
    }

    // Respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        reservation_id: updatedReserva.id,
        status: nuevoEstado,
        payment_id: payment_id
      })
    };

  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
