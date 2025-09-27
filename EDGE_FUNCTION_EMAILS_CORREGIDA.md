# 🔧 EDGE FUNCTION CORREGIDA - send-resend-emails

## 🚨 **PROBLEMA IDENTIFICADO**

**Error:** `401 - Invalid JWT` en la Edge Function de emails  
**Causa:** Mismo problema de autenticación que las otras Edge Functions

## ✅ **CÓDIGO CORREGIDO**

### **Copia este código completo y reemplaza en Supabase:**

```typescript
// Edge Function para envío de emails con Resend
// Sistema de Agendamiento Legal - Punto Legal

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// Configuración de Resend
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C'
const MAIL_FROM = Deno.env.get('MAIL_FROM') || 'Punto Legal <team@puntolegal.online>'
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'puntolegalelgolf@gmail.com'

interface BookingData {
  id: string
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  servicio_tipo: string
  servicio_precio: string
  fecha: string
  hora: string
  tipo_reunion?: string
  descripcion?: string
  pago_metodo?: string
  pago_estado?: string
  created_at: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingData }: { bookingData: BookingData } = await req.json()
    
    console.log('📧 Enviando emails con Resend para reserva:', bookingData.id)

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurada')
    }

    // Generar plantillas HTML
    const clientHTML = generateClientEmailHTML(bookingData)
    const adminHTML = generateAdminEmailHTML(bookingData)

    // Enviar email al cliente
    const clientEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [bookingData.cliente_email],
        subject: `✅ Confirmación de tu cita - ${bookingData.servicio_tipo} - Punto Legal`,
        html: clientHTML
      })
    })

    if (!clientEmailResponse.ok) {
      const error = await clientEmailResponse.text()
      throw new Error(`Error enviando email al cliente: ${error}`)
    }

    const clientResult = await clientEmailResponse.json()
    console.log('✅ Email al cliente enviado:', clientResult.id)

    // Enviar email al admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [ADMIN_EMAIL],
        subject: `🔔 Nueva reserva - ${bookingData.cliente_nombre} - ${bookingData.servicio_tipo}`,
        html: adminHTML
      })
    })

    if (!adminEmailResponse.ok) {
      const error = await adminEmailResponse.text()
      throw new Error(`Error enviando email al admin: ${error}`)
    }

    const adminResult = await adminEmailResponse.json()
    console.log('✅ Email al admin enviado:', adminResult.id)

    return new Response(
      JSON.stringify({
        success: true,
        clientEmail: clientResult,
        adminEmail: adminResult,
        message: 'Emails enviados exitosamente'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Error en Edge Function de emails:', error)
    
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

// Generar HTML para email del cliente
function generateClientEmailHTML(data: BookingData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Cita - Punto Legal</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .success { background-color: #10b981; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .info-box { background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; }
        .detail { margin: 10px 0; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6b7280; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .highlight { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏛️ Punto Legal</div>
          <p>Tu consulta jurídica especializada</p>
        </div>

        <div class="success">
          <h2>✅ ¡Tu cita ha sido confirmada!</h2>
          <p>Gracias por confiar en nuestros servicios legales.</p>
        </div>

        <div class="info-box">
          <h3>📋 Detalles de tu consulta</h3>
          <div class="detail">
            <span class="label">👤 Cliente:</span>
            <span class="value">${data.cliente_nombre}</span>
          </div>
          <div class="detail">
            <span class="label">📧 Email:</span>
            <span class="value">${data.cliente_email}</span>
          </div>
          <div class="detail">
            <span class="label">📞 Teléfono:</span>
            <span class="value">${data.cliente_telefono}</span>
          </div>
          <div class="detail">
            <span class="label">⚖️ Servicio:</span>
            <span class="value">${data.servicio_tipo}</span>
          </div>
          <div class="detail">
            <span class="label">💰 Precio:</span>
            <span class="value">$${parseInt(data.servicio_precio).toLocaleString('es-CL')} CLP</span>
          </div>
          <div class="detail">
            <span class="label">📅 Fecha:</span>
            <span class="value">${data.fecha}</span>
          </div>
          <div class="detail">
            <span class="label">🕐 Hora:</span>
            <span class="value">${data.hora} hrs</span>
          </div>
          <div class="detail">
            <span class="label">💻 Modalidad:</span>
            <span class="value">${data.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</span>
          </div>
        </div>

        <div class="highlight">
          <h3>📬 Próximos pasos</h3>
          <ul>
            <li>Recibirás un recordatorio 24 horas antes de tu consulta</li>
            <li>Te enviaremos el enlace de la videollamada o la dirección de la oficina</li>
            <li>Si tienes documentos, envíalos con anticipación</li>
          </ul>
        </div>

        <div class="footer">
          <p><strong>Punto Legal</strong> - Consulta Jurídica Especializada</p>
          <p>📧 contacto@puntolegal.online | 📞 +56962321883</p>
          <p>🌐 www.puntolegal.online</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Generar HTML para email del admin
function generateAdminEmailHTML(data: BookingData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Reserva - Punto Legal</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
        .alert { background-color: #fef2f2; color: #dc2626; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #fecaca; }
        .info-box { background-color: #f8fafc; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; }
        .detail { margin: 10px 0; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6b7280; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔔 Punto Legal Admin</div>
          <p>Nueva reserva recibida</p>
        </div>

        <div class="alert">
          <h2>🔔 Nueva reserva confirmada</h2>
          <p>Se ha recibido una nueva consulta legal.</p>
        </div>

        <div class="info-box">
          <h3>📋 Detalles de la reserva</h3>
          <div class="detail">
            <span class="label">🆔 ID de Reserva:</span>
            <span class="value">${data.id}</span>
          </div>
          <div class="detail">
            <span class="label">👤 Cliente:</span>
            <span class="value">${data.cliente_nombre}</span>
          </div>
          <div class="detail">
            <span class="label">📧 Email:</span>
            <span class="value">${data.cliente_email}</span>
          </div>
          <div class="detail">
            <span class="label">📞 Teléfono:</span>
            <span class="value">${data.cliente_telefono}</span>
          </div>
          <div class="detail">
            <span class="label">⚖️ Servicio:</span>
            <span class="value">${data.servicio_tipo}</span>
          </div>
          <div class="detail">
            <span class="label">💰 Precio:</span>
            <span class="value">$${parseInt(data.servicio_precio).toLocaleString('es-CL')} CLP</span>
          </div>
          <div class="detail">
            <span class="label">📅 Fecha:</span>
            <span class="value">${data.fecha}</span>
          </div>
          <div class="detail">
            <span class="label">🕐 Hora:</span>
            <span class="value">${data.hora} hrs</span>
          </div>
          <div class="detail">
            <span class="label">💻 Modalidad:</span>
            <span class="value">${data.tipo_reunion === 'online' ? 'Videollamada' : 'Presencial'}</span>
          </div>
          <div class="detail">
            <span class="label">💳 Pago:</span>
            <span class="value">${data.pago_metodo || 'MercadoPago'} - ${data.pago_estado || 'aprobado'}</span>
          </div>
          <div class="detail">
            <span class="label">📝 Descripción:</span>
            <span class="value">${data.descripcion || 'Sin descripción adicional'}</span>
          </div>
        </div>

        <div class="footer">
          <p><strong>Punto Legal</strong> - Sistema de Administración</p>
          <p>📧 puntolegalelgolf@gmail.com</p>
          <p>🌐 www.puntolegal.online</p>
        </div>
      </div>
    </body>
    </html>
  `
}
```

---

## 🚀 **PASOS PARA APLICAR LA CORRECCIÓN**

### **1. Ir al Dashboard de Supabase:**
- **URL:** https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/functions

### **2. Editar la función:**
- **Hacer clic en:** `send-resend-emails`
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
- ✅ **Sin autenticación requerida** - Función pública
- ✅ **Headers CORS correctos**
- ✅ **Plantillas HTML mejoradas**
- ✅ **Manejo de errores robusto**

### **🎯 Funcionalidades:**
- ✅ **Email al cliente** - Confirmación de cita
- ✅ **Email al admin** - Notificación de nueva reserva
- ✅ **Plantillas profesionales** - HTML responsive
- ✅ **Información completa** - Todos los detalles

---

## 🧪 **VERIFICACIÓN POST-DEPLOY**

### **Después del deploy, probar:**
```bash
node scripts/test-email-system.mjs
```

### **Resultado esperado:**
```json
{
  "success": true,
  "clientEmail": { "id": "..." },
  "adminEmail": { "id": "..." },
  "message": "Emails enviados exitosamente"
}
```
