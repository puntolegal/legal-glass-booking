// Función de Supabase para crear preferencias de MercadoPago
// Reemplaza el backend local en producción

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Obtener credenciales de MercadoPago
    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') || Deno.env.get('VITE_MERCADOPAGO_ACCESS_TOKEN') || 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947'
    
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN o VITE_MERCADOPAGO_ACCESS_TOKEN no configurado')
    }

    // Obtener datos del request
    const { paymentData } = await req.json()
    
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
    
    // Estructura exacta según documentación oficial de MercadoPago
    const preferenceData = {
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
        success: `https://puntolegal.online/payment-success?source=mercadopago`,
        failure: `https://puntolegal.online/payment-failure?source=mercadopago`,
        pending: `https://puntolegal.online/payment-pending?source=mercadopago`
      },
      external_reference: paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `https://puntolegal.online/api/mercadopago/webhook`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time,
        source: 'punto-legal-web',
        integration_type: 'checkout_pro_official'
      },
      statement_descriptor: 'PUNTO LEGAL',
      auto_return: 'approved'
    }
    
    console.log('📤 Enviando a API oficial de MercadoPago...')
    
    // Llamada oficial a la API de MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error API MercadoPago:', response.status, errorText)
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Error ${response.status}: ${errorText}` 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const result = await response.json()
    
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