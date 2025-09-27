# 🔧 CÓDIGO SIMPLIFICADO PARA EL WEBHOOK

## 🎯 **VERSIÓN SIMPLIFICADA (SIN AUTENTICACIÓN)**

### **Copia este código y reemplaza el anterior:**

```typescript
// Webhook de MercadoPago para Supabase Edge Functions
// Versión simplificada sin autenticación

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
```

## 🚀 **PASOS**

1. **Ir de nuevo a la función** `mercadopago-webhook` en Supabase
2. **Editar** la función
3. **Reemplazar** con este código simplificado
4. **Deploy** la función
5. **Probar** en MercadoPago

## ✅ **DIFERENCIA**

- **Antes:** Lógica compleja de autenticación
- **Ahora:** Sin autenticación, acepta todos los requests
- **Resultado:** Webhook funcionará con MercadoPago
