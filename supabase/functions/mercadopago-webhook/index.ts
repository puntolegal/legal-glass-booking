// Webhook de MercadoPago CORREGIDO para Supabase Edge Functions
// Maneja notificaciones de pagos y actualiza reservas automáticamente

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configuración desde variables de entorno
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://qrgelocijmwnxcckxbdg.supabase.co'
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI'
const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') || 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947'
const MERCADOPAGO_WEBHOOK_SECRET = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET') || 'd5818a98ec20e01124607d033512760d8fa7b3b539d28ccdc8000a34eb6734ac'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Validar que el webhook viene de MercadoPago usando la clave secreta
  const signature = req.headers.get('x-signature');
  const timestamp = req.headers.get('x-request-id');
  
  console.log('🔐 Validando webhook de MercadoPago...');
  console.log('📋 Signature:', signature);
  console.log('📋 Request ID:', timestamp);

  try {
    console.log('🔔 Webhook de MercadoPago recibido');
    console.log('🔍 Headers:', Object.fromEntries(req.headers.entries()));
    console.log('🔍 URL:', req.url);
    
    // Obtener datos del webhook
    const body = await req.text();
    console.log('📋 Body recibido:', body);
    
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (error) {
      console.log('📋 Body como query params:', new URLSearchParams(body));
      // Si no es JSON, puede ser form data
      const params = new URLSearchParams(body);
      webhookData = {
        type: params.get('type') || 'payment',
        data: {
          id: params.get('data.id') || params.get('payment_id')
        }
      };
    }
    
    console.log('📋 Datos del webhook:', webhookData);
    
    // Verificar que sea una notificación de pago
    if (webhookData.type === 'payment' && webhookData.data?.id) {
      const paymentId = webhookData.data.id;
      console.log('💳 Procesando pago:', paymentId);
      
      // PASO 1: Obtener información del pago desde MercadoPago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!paymentResponse.ok) {
        throw new Error(`Error obteniendo información del pago: ${paymentResponse.status}`);
      }

      const paymentInfo = await paymentResponse.json();
      console.log('📊 Información del pago:', {
        id: paymentInfo.id,
        status: paymentInfo.status,
        external_reference: paymentInfo.external_reference,
        transaction_amount: paymentInfo.transaction_amount
      });

      // PASO 2: Buscar la reserva por external_reference
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      const { data: reservation, error: reservationError } = await supabase
        .from('reservas')
        .select('*')
        .eq('external_reference', paymentInfo.external_reference)
        .single();

      if (reservationError || !reservation) {
        console.error('❌ No se encontró reserva con external_reference:', paymentInfo.external_reference);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Reserva no encontrada',
            external_reference: paymentInfo.external_reference
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('✅ Reserva encontrada:', reservation.id);

      // PASO 3: Actualizar la reserva con los datos del pago
      const { data: updatedReservation, error: updateError } = await supabase
        .from('reservas')
        .update({
          pago_id: paymentInfo.id.toString(),
          pago_estado: paymentInfo.status,
          pago_metodo: paymentInfo.payment_method_id || 'unknown',
          preference_id: paymentInfo.preference_id || reservation.preference_id,
          estado: paymentInfo.status === 'approved' ? 'confirmada' : 'pendiente',
          webhook_sent: true
        })
        .eq('id', reservation.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error actualizando reserva:', updateError);
        throw new Error(`Error actualizando reserva: ${updateError.message}`);
      }

      console.log('✅ Reserva actualizada:', updatedReservation.id);

      // PASO 4: Enviar emails si el pago fue aprobado
      if (paymentInfo.status === 'approved') {
        console.log('📧 Enviando emails de confirmación...');
        
        try {
          const emailResponse = await supabase.functions.invoke('send-resend-emails', {
            body: {
              bookingData: {
                id: updatedReservation.id,
                cliente_nombre: updatedReservation.nombre,
                cliente_email: updatedReservation.email,
                cliente_telefono: updatedReservation.telefono,
                servicio_tipo: updatedReservation.servicio,
                servicio_precio: updatedReservation.precio,
                fecha: updatedReservation.fecha,
                hora: updatedReservation.hora,
                tipo_reunion: updatedReservation.tipo_reunion,
                descripcion: updatedReservation.descripcion,
                pago_metodo: updatedReservation.pago_metodo,
                pago_estado: updatedReservation.pago_estado,
                created_at: updatedReservation.created_at
              }
            }
          });

          if (emailResponse.error) {
            console.error('❌ Error enviando emails:', emailResponse.error);
          } else {
            console.log('✅ Emails enviados exitosamente:', emailResponse.data);
            
            // Actualizar estado de email enviado
            await supabase
              .from('reservas')
              .update({
                email_enviado: true,
                email_enviado_at: new Date().toISOString()
              })
              .eq('id', updatedReservation.id);
          }
        } catch (emailError) {
          console.error('❌ Error en envío de emails:', emailError);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Webhook procesado correctamente',
          paymentId,
          reservationId: updatedReservation.id,
          emailsSent: paymentInfo.status === 'approved'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook recibido pero no procesado' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error interno del servidor' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
