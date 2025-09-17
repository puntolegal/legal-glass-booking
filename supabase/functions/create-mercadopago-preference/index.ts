import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log("MercadoPago Preference Function loaded")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paymentData } = await req.json()
    
    console.log('🚀 Creando preferencia real con MercadoPago API...')
    console.log('📋 Datos recibidos:', paymentData)

    // Configuración de MercadoPago - PRODUCCIÓN
    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') || 'APP_USR-57706641806639-091313-aa2444bdca1b521ca4540fb1fc1c2dcb-2683873567'
    
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado')
    }
    
    console.log('🚀 Usando credenciales de PRODUCCIÓN');

    // Datos de la preferencia según documentación oficial
    const preferenceData = {
      items: [
        {
          title: `${paymentData.service} - Punto Legal`,
          description: paymentData.description || `Consulta legal agendada para ${paymentData.date} a las ${paymentData.time}`,
          quantity: 1,
          unit_price: parseFloat(paymentData.price.replace(/[^0-9]/g, '')),
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
        success: `${req.headers.get('origin') || 'http://localhost:8080'}/payment-success?source=mercadopago`,
        failure: `${req.headers.get('origin') || 'http://localhost:8080'}/payment-failure?source=mercadopago`,
        pending: `${req.headers.get('origin') || 'http://localhost:8080'}/payment-pending?source=mercadopago`
      },
      auto_return: 'approved',
      external_reference: `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `${req.headers.get('origin') || 'http://localhost:8080'}/api/mercadopago/webhook`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time,
        source: 'punto-legal-web',
        integration_type: 'wallet_brick'
      },
      statement_descriptor: 'PUNTO LEGAL'
    }
    
    console.log('📤 Enviando a MercadoPago API...')
    
    // Llamar a la API real de MercadoPago
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
      console.error('❌ Error de MercadoPago API:', response.status, errorText)
      throw new Error(`Error ${response.status}: ${errorText}`)
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
    
  } catch (error) {
    console.error('❌ Error creando preferencia:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
