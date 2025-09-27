# 🔧 EDGE FUNCTION CORREGIDA - create-mercadopago-preference

## 🚨 **PROBLEMA IDENTIFICADO**

**Error CORS:** La Edge Function tenía un conflicto de merge que causaba errores de sintaxis.

## ✅ **CÓDIGO CORREGIDO**

### **Copia este código completo y reemplaza en Supabase:**

```typescript
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
    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') || 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947'
    const APP_URL = Deno.env.get('APP_URL') || 'https://www.puntolegal.online'
    
    console.log('🔑 MercadoPago Access Token:', MERCADOPAGO_ACCESS_TOKEN ? 'Configurado' : 'No configurado');
    
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado para MercadoPago')
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
    // Estructura simplificada para evitar problemas de validación
    const preferenceBody = {
      items: [
        {
          title: `${paymentData.service} - Punto Legal`,
          quantity: 1,
          unit_price: parseFloat(paymentData.price),
          currency_id: 'CLP'
        }
      ],
      payer: {
        name: paymentData.name,
        email: paymentData.email
      },
      back_urls: {
        success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
        failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
        pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
      },
      auto_return: 'approved',
      external_reference: paymentData.external_reference || `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook`
    };

    console.log('📋 Estructura de preferencia:', JSON.stringify(preferenceBody, null, 2))
    console.log('🔑 Token de acceso:', MERCADOPAGO_ACCESS_TOKEN ? `${MERCADOPAGO_ACCESS_TOKEN.substring(0, 20)}...` : 'No configurado')

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
```

---

## 🚀 **PASOS PARA APLICAR LA CORRECCIÓN**

### **1. Ir al Dashboard de Supabase:**
- **URL:** https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/functions

### **2. Editar la función:**
- **Hacer clic en:** `create-mercadopago-preference`
- **Hacer clic en:** "Edit function"

### **3. Reemplazar el código:**
- **Seleccionar todo** el código existente
- **Eliminar** el código actual
- **Pegar** el código de arriba

### **4. Desplegar:**
- **Hacer clic en:** "Deploy function"

---

## ✅ **CORRECCIONES APLICADAS**

### **🔧 Problemas resueltos:**
- ✅ **Conflicto de merge eliminado**
- ✅ **URLs de retorno fijas** (producción)
- ✅ **Headers CORS correctos**
- ✅ **Webhook configurado**
- ✅ **auto_return habilitado**

### **🎯 URLs configuradas:**
- ✅ **Success:** `https://www.puntolegal.online/payment-success?source=mercadopago`
- ✅ **Failure:** `https://www.puntolegal.online/payment-failure?source=mercadopago`
- ✅ **Pending:** `https://www.puntolegal.online/payment-pending?source=mercadopago`
- ✅ **Webhook:** `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook`

---

## 🧪 **VERIFICACIÓN POST-DEPLOY**

### **Después del deploy, probar:**
```bash
curl -X POST 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/create-mercadopago-preference' \
  -H 'Content-Type: application/json' \
  -d '{
    "paymentData": {
      "service": "Consulta Legal",
      "price": "35000",
      "name": "Juan Pérez",
      "email": "juan@test.com"
    }
  }'
```

### **Resultado esperado:**
```json
{
  "success": true,
  "preference_id": "229698947-...",
  "init_point": "https://www.mercadopago.cl/checkout/v1/redirect?..."
}
```
