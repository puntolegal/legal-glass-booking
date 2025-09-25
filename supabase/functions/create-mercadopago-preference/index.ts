// Función de Supabase para crear preferencias de MercadoPago
// Reemplaza el backend local en producción

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

  try {
    console.log('🚀 Función create-mercadopago-preference iniciada');
    console.log('🔍 Headers recibidos:', Object.fromEntries(req.headers.entries()));
    console.log('🔍 Método:', req.method);
    console.log('🔍 URL:', req.url);
    
    // Obtener credenciales de MercadoPago
    // Usar EDGE_ADMIN_TOKEN como fallback para MercadoPago
    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('EDGE_ADMIN_TOKEN') || 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947'
    
    console.log('🔑 MercadoPago Access Token:', MERCADOPAGO_ACCESS_TOKEN ? 'Configurado' : 'No configurado');
    
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('EDGE_ADMIN_TOKEN no configurado para MercadoPago')
    }

    // Obtener datos del request
    const { paymentData } = await req.json()
    
    console.log('📋 Datos de pago recibidos:', paymentData);
    
    if (!paymentData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Datos de pago requeridos' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🚀 Creando preferencia oficial...', paymentData)
    
    // Usar API REST de MercadoPago directamente (compatible con Deno)
    const preferenceBody = {
      items: [
        {
          title: `${paymentData.service} - Punto Legal`,
          description: paymentData.description || `Consulta legal agendada para ${paymentData.date} a las ${paymentData.time}`,
          quantity: 1,
          unit_price: parseFloat(paymentData.price),
          currency_id: 'CLP'
        }
      ],
      payer: {
        name: paymentData.name,
        email: paymentData.email,
        phone: {
          number: paymentData.phone
        }
      },
      back_urls: {
        success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
        failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
        pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
      },
      auto_return: 'approved', // Auto-return for approved payments
      external_reference: paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `https://www.puntolegal.online/api/mercadopago/webhook`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time,
        source: 'punto-legal-web',
        integration_type: 'checkout_pro_supabase_function'
      },
      statement_descriptor: 'PUNTO LEGAL'
    };

    console.log('📋 Estructura de preferencia:', JSON.stringify(preferenceBody, null, 2))

    // Llamada directa a la API REST de MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error API MercadoPago:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Error ${response.status}: ${errorText}` 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await response.json();

    console.log('✅ Preferencia creada exitosamente:', result.id)
    
    return new Response(
      JSON.stringify({
        success: true,
        preference_id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('❌ Error creando preferencia:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})