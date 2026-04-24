// Webhook de MercadoPago CORREGIDO para Supabase Edge Functions
// Maneja notificaciones de pagos y actualiza reservas automáticamente

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configuración desde variables de entorno
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://qrgelocijmwnxcckxbdg.supabase.co'
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI'
/** Preferir service role para columnas de cola Zapier / RLS. */
const SUPABASE_DB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY
const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
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

  // Validar configuración crítica
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    console.error('❌ MERCADOPAGO_ACCESS_TOKEN no configurado');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Webhook no configurado correctamente' 
      }),
      { 
        status: 503, // Service Unavailable
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
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
      
      // Detectar pruebas de MercadoPago
      if (paymentId === '123456' || webhookData.live_mode === false) {
        console.log('🧪 Notificación de prueba detectada, respondiendo OK');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Webhook de prueba recibido correctamente',
            test: true
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // PASO 1: Obtener información del pago desde MercadoPago
      let paymentResponse;
      try {
        paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (fetchError) {
        console.error('❌ Error de red llamando a MercadoPago:', fetchError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Error de conexión con MercadoPago',
            details: (fetchError as Error).message
          }),
          { 
            status: 502, // Bad Gateway
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (!paymentResponse.ok) {
        console.error(`❌ MercadoPago respondió con error: ${paymentResponse.status}`);
        
        // Si es 404, el pago no existe (puede ser test o pago muy antiguo)
        if (paymentResponse.status === 404) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Pago no encontrado en MercadoPago',
              paymentId
            }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        
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
      const supabase = createClient(SUPABASE_URL, SUPABASE_DB_KEY);
      
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
          pago_estado: paymentInfo.status,
          estado: paymentInfo.status === 'approved' ? 'confirmada' : 'pendiente'
        })
        .eq('id', reservation.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error actualizando reserva:', updateError);
        throw new Error(`Error actualizando reserva: ${updateError.message}`);
      }

      console.log('✅ Reserva actualizada:', updatedReservation.id);

      // PASO 4: Cola Zapier (Calendar/Meet) o envío directo clever-action
      let emailsSent = false;
      let zapierDispatched = false;
      if (paymentInfo.status === 'approved') {
        const EDGE_ADMIN_TOKEN = Deno.env.get('EDGE_ADMIN_TOKEN') || 'puntolegal-admin-token-2025';
        const ZAPIER_BOOKING_HOOK_URL = (Deno.env.get('ZAPIER_BOOKING_HOOK_URL') || '').trim();

        const invokeCleverActionAndMarkEmail = async (): Promise<boolean> => {
          try {
            const emailResponse = await supabase.functions.invoke('clever-action', {
              body: { booking_id: updatedReservation.id },
              headers: { 'x-admin-token': EDGE_ADMIN_TOKEN },
            });
            if (emailResponse.error) {
              console.error('❌ Error enviando emails (clever-action):', emailResponse.error);
              return false;
            }
            console.log('✅ Emails enviados (clever-action):', emailResponse.data);
            return true;
          } catch (e) {
            console.error('❌ Error en clever-action:', e);
            return false;
          }
        };

        if (ZAPIER_BOOKING_HOOK_URL) {
          console.log('📅 Cola Zapier: marcando pending_calendar y notificando Catch Hook');
          const nowIso = new Date().toISOString();
          const { error: pendErr } = await supabase
            .from('reservas')
            .update({
              confirmation_email_status: 'pending_calendar',
              calendar_sync_requested_at: nowIso,
            })
            .eq('id', updatedReservation.id);

          if (pendErr) {
            console.error('❌ No se pudo marcar pending_calendar:', pendErr);
            emailsSent = await invokeCleverActionAndMarkEmail();
          } else {
            const tipo = String(updatedReservation.tipo_reunion ?? 'online');
            const zapPayload = {
              booking_id: updatedReservation.id,
              id: updatedReservation.id,
              nombre: updatedReservation.nombre,
              email: updatedReservation.email,
              telefono: updatedReservation.telefono,
              servicio: updatedReservation.servicio,
              fecha: updatedReservation.fecha,
              hora: updatedReservation.hora,
              tipo_reunion: tipo,
              external_reference: updatedReservation.external_reference,
              precio: updatedReservation.precio,
              descripcion: updatedReservation.descripcion,
            };

            try {
              const zr = await fetch(ZAPIER_BOOKING_HOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(zapPayload),
              });
              if (!zr.ok) {
                const zt = await zr.text();
                console.error('❌ Zapier Catch Hook HTTP', zr.status, zt);
                await supabase
                  .from('reservas')
                  .update({ confirmation_email_status: 'failed' })
                  .eq('id', updatedReservation.id);
                emailsSent = await invokeCleverActionAndMarkEmail();
              } else {
                zapierDispatched = true;
                console.log('✅ Zapier Catch Hook aceptado');
              }
            } catch (zapErr) {
              console.error('❌ Error de red hacia Zapier:', zapErr);
              await supabase
                .from('reservas')
                .update({ confirmation_email_status: 'failed' })
                .eq('id', updatedReservation.id);
              emailsSent = await invokeCleverActionAndMarkEmail();
            }
          }
        } else {
          console.log('📧 ZAPIER_BOOKING_HOOK_URL no configurada — clever-action directo');
          emailsSent = await invokeCleverActionAndMarkEmail();
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Webhook procesado correctamente',
          paymentId,
          reservationId: updatedReservation.id,
          emailsSent: paymentInfo.status === 'approved' && emailsSent,
          zapierDispatched: paymentInfo.status === 'approved' ? zapierDispatched : false,
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
});
