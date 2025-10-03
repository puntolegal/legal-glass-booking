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
    
    // Obtener credenciales de MercadoPago desde variables de entorno
    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    const APP_URL = Deno.env.get('APP_URL') || 'https://puntolegal.online'
    
    console.log('🔑 MercadoPago Access Token:', MERCADOPAGO_ACCESS_TOKEN ? 'Configurado desde variables de entorno' : 'NO CONFIGURADO');
    
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno de Supabase')
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
    
    // Usar API REST de MercadoPago con campos optimizados para mejor aprobación
    // Separar nombre en first_name y last_name para mejor aprobación
    const nameParts = (paymentData.name || '').trim().split(' ');
    const firstName = nameParts[0] || paymentData.name;
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Extraer código de área del teléfono si está disponible
    const phoneNumber = (paymentData.phone || '').replace(/\D/g, '');
    const areaCode = phoneNumber.startsWith('56') ? '56' : '56'; // Chile por defecto
    const number = phoneNumber.replace(/^56/, '') || phoneNumber;

    const preferenceBody = {
      items: [
        {
          id: `servicio_legal_${(paymentData.service || '').toLowerCase().replace(/\s+/g, '_')}`,
          title: `${paymentData.service} - Punto Legal`,
          description: `Consulta legal especializada: ${paymentData.service}. Servicio profesional de asesoría jurídica.`,
          category_id: 'services_legal', // Categoría para servicios legales
          quantity: 1,
          unit_price: parseFloat(paymentData.price),
          currency_id: 'CLP'
        }
      ],
      payer: {
        name: paymentData.name,
        first_name: firstName,
        last_name: lastName,
        email: paymentData.email,
        ...(paymentData.phone && { 
          phone: { 
            number: number,
            area_code: areaCode
          } 
        }),
        identification: {
          type: 'RUT',
          number: '12345678-9' // Placeholder - se puede mejorar con datos reales
        }
      },
      back_urls: {
        success: `https://puntolegal.online/payment-success?source=mercadopago&external_reference=${paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}`,
        failure: `https://puntolegal.online/payment-failure?source=mercadopago&external_reference=${paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}`,
        pending: `https://puntolegal.online/payment-pending?source=mercadopago&external_reference=${paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}`
      },
      auto_return: 'approved',
      external_reference: paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook`,
      metadata: {
        client_name: paymentData.name,
        client_email: paymentData.email,
        service_type: paymentData.service,
        appointment_date: paymentData.date,
        appointment_time: paymentData.time,
        source: 'punto-legal-web',
        integration_type: 'supabase_edge_function',
        mobile_compatible: 'true', // 🔧 CRÍTICO: Marcar como compatible con móvil
        auto_return_enabled: 'true', // 🔧 CRÍTICO: Confirmar auto_return habilitado
        platform: 'web_mobile' // 🔧 CRÍTICO: Identificar plataforma
      },
      statement_descriptor: 'PUNTO LEGAL'
    };

    console.log('📋 Estructura de preferencia:', JSON.stringify(preferenceBody, null, 2))
    console.log('🔑 Token de acceso:', MERCADOPAGO_ACCESS_TOKEN ? `${MERCADOPAGO_ACCESS_TOKEN.substring(0, 20)}...` : 'No configurado')
    console.log('📱 Configuración móvil:')
    console.log('   ✅ auto_return: approved')
    console.log('   ✅ back_urls configuradas')
    console.log('   ✅ mobile_compatible: true')
    console.log('   ✅ platform: web_mobile')

    // Llamada directa a la API REST de MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceBody)
    });

    console.log('📤 Respuesta de MercadoPago:', response.status, response.statusText)

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
    console.log('🔍 Resultado completo de MercadoPago:', JSON.stringify(result, null, 2))
    console.log('🔗 Init Point:', result.init_point)
    console.log('🔗 Sandbox Init Point:', result.sandbox_init_point)
    console.log('🔍 Status de la preferencia:', result.status)
    console.log('🔍 Modo de la preferencia:', result.live_mode ? 'Producción' : 'Sandbox')
    
    // Verificar que los campos necesarios estén presentes
    if (!result.id) {
      console.error('❌ ERROR: result.id no está presente')
      throw new Error('ID de preferencia no recibido de MercadoPago')
    }
    
    if (!result.init_point) {
      console.error('❌ ERROR: result.init_point no está presente')
      throw new Error('Init Point no recibido de MercadoPago')
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        preference_id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        status: result.status,
        live_mode: result.live_mode
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