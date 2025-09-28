// Webhook de MercadoPago para Supabase Edge Functions
// Maneja notificaciones de pagos en producción

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configuración desde variables de entorno
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://qrgelocijmwnxcckxbdg.supabase.co'
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI'

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

  // Verificar autenticación solo si no viene de MercadoPago
  const authHeader = req.headers.get('authorization');
  const userAgent = req.headers.get('user-agent') || '';
  const isFromMercadoPago = userAgent.includes('MercadoPago') || 
                           req.headers.get('x-mercadopago-signature') ||
                           req.url.includes('topic=') ||
                           req.url.includes('payment');

  // Si no viene de MercadoPago y no tiene auth, rechazar
  if (!isFromMercadoPago && !authHeader) {
    console.log('❌ Acceso no autorizado - falta autenticación');
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

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
      
      // Aquí puedes agregar lógica para procesar el pago
      // Por ejemplo, actualizar el estado en la base de datos
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Webhook procesado correctamente',
          paymentId 
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
