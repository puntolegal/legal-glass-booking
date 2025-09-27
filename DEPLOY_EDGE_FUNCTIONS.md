# 🚀 DEPLOYAR EDGE FUNCTIONS EN SUPABASE

## 🎯 **PROBLEMA IDENTIFICADO**

**Error:** `Status: 401` en webhook  
**Causa:** Edge Function `mercadopago-webhook` no está desplegada en Supabase  
**Solución:** Desplegar todas las Edge Functions

---

## 📋 **EDGE FUNCTIONS A DESPLEGAR**

### **✅ Edge Functions Disponibles:**
1. **`create-mercadopago-preference`** - Crea preferencias de pago
2. **`mercadopago-webhook`** - Procesa notificaciones de pagos ⚠️ **NO DESPLEGADA**
3. **`send-booking-emails`** - Envía emails de confirmación
4. **`send-resend-emails`** - Envía emails con Resend

---

## 🚀 **MÉTODOS PARA DESPLEGAR**

### **MÉTODO 1: Supabase CLI (RECOMENDADO)**

#### **1.1 Instalar Supabase CLI:**
```bash
# macOS con Homebrew
brew install supabase/tap/supabase

# O descargar desde: https://github.com/supabase/cli/releases
```

#### **1.2 Autenticarse:**
```bash
supabase login
```

#### **1.3 Vincular Proyecto:**
```bash
supabase link --project-ref qrgelocijmwnxcckxbdg
```

#### **1.4 Desplegar Edge Functions:**
```bash
# Desplegar todas las funciones
supabase functions deploy

# O desplegar función específica
supabase functions deploy mercadopago-webhook
supabase functions deploy create-mercadopago-preference
supabase functions deploy send-booking-emails
```

### **MÉTODO 2: Dashboard de Supabase**

#### **2.1 Acceder al Dashboard:**
- **URL:** https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg
- **Ir a:** Edge Functions

#### **2.2 Crear Edge Function:**
1. **Hacer clic en "Create a new function"**
2. **Nombre:** `mercadopago-webhook`
3. **Copiar el código** de `supabase/functions/mercadopago-webhook/index.ts`
4. **Hacer clic en "Deploy function"**

---

## 🔧 **CONFIGURACIÓN DE VARIABLES**

### **Variables Requeridas para `mercadopago-webhook`:**
```bash
WEBHOOK_SECRET_TOKEN=ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd
```

### **Variables Requeridas para `create-mercadopago-preference`:**
```bash
MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
APP_URL=https://puntolegal.online
```

### **Variables Requeridas para `send-booking-emails`:**
```bash
RESEND_API_KEY=re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C
MAIL_FROM=Punto Legal <team@puntolegal.online>
ADMIN_EMAIL=puntolegalelgolf@gmail.com
SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025
```

---

## 📝 **PASOS DETALLADOS**

### **PASO 1: Instalar Supabase CLI**
```bash
# Verificar si está instalado
which supabase

# Si no está instalado, instalar
brew install supabase/tap/supabase
```

### **PASO 2: Configurar Proyecto**
```bash
# Login en Supabase
supabase login

# Vincular proyecto
supabase link --project-ref qrgelocijmwnxcckxbdg
```

### **PASO 3: Configurar Variables de Entorno**
```bash
# Configurar variables para Edge Functions
supabase secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
supabase secrets set RESEND_API_KEY=re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C
supabase secrets set WEBHOOK_SECRET_TOKEN=ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd
```

### **PASO 4: Desplegar Edge Functions**
```bash
# Desplegar todas las funciones
supabase functions deploy

# Verificar deployment
supabase functions list
```

---

## 🧪 **VERIFICACIÓN POST-DEPLOY**

### **Probar Edge Function de Webhook:**
```bash
curl -X POST 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "payment",
    "data": {
      "id": "123456789"
    }
  }'
```

### **Resultado Esperado:**
```json
{
  "success": true,
  "message": "Webhook procesado correctamente",
  "paymentId": "123456789"
}
```

---

## 🚨 **SOLUCIÓN RÁPIDA**

### **Si no tienes Supabase CLI instalado:**

#### **Opción A: Instalar CLI**
```bash
brew install supabase/tap/supabase
```

#### **Opción B: Usar Dashboard Web**
1. **Ir a:** https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg
2. **Edge Functions → Create new function**
3. **Nombre:** `mercadopago-webhook`
4. **Copiar código** de `supabase/functions/mercadopago-webhook/index.ts`
5. **Deploy**

---

## ✅ **CHECKLIST DE DEPLOYMENT**

### **Edge Functions:**
- [ ] `create-mercadopago-preference` desplegada
- [ ] `mercadopago-webhook` desplegada ⚠️ **CRÍTICO**
- [ ] `send-booking-emails` desplegada
- [ ] `send-resend-emails` desplegada

### **Variables de Entorno:**
- [ ] `MERCADOPAGO_ACCESS_TOKEN` configurada
- [ ] `RESEND_API_KEY` configurada
- [ ] `WEBHOOK_SECRET_TOKEN` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada

### **Verificación:**
- [ ] Webhook responde 200 OK
- [ ] Preferencias se crean correctamente
- [ ] Emails se envían automáticamente

---

## 🎯 **PRÓXIMO PASO INMEDIATO**

**DEPLEGAR LA EDGE FUNCTION `mercadopago-webhook`** es crítico para resolver el problema del botón de pago.

¿Tienes acceso para instalar Supabase CLI o prefieres usar el dashboard web?
