# 🔧 CONFIGURACIÓN DE EDGE FUNCTIONS EN SUPABASE

## 🎯 **OBJETIVO**
Configurar las variables de entorno necesarias para que las Edge Functions funcionen correctamente.

---

## 📋 **ESTADO ACTUAL**

### **✅ Edge Functions Disponibles:**
1. **`create-mercadopago-preference`** - Crea preferencias de pago
2. **`mercadopago-webhook`** - Procesa notificaciones de pagos
3. **`send-booking-emails`** - Envía emails de confirmación

### **❌ Problema Identificado:**
```
Error 401: Invalid JWT
```
**Causa:** Variables de entorno no configuradas en Supabase Dashboard

---

## 🚀 **PASOS PARA CONFIGURAR**

### **PASO 1: Acceder al Dashboard de Supabase**
1. **Ir a:** https://supabase.com/dashboard
2. **Proyecto:** `qrgelocijmwnxcckxbdg`
3. **Ir a:** Settings → Edge Functions

### **PASO 2: Configurar Variables de Entorno**

#### **2.1 Variables para `create-mercadopago-preference`:**
```bash
MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
APP_URL=https://puntolegal.online
```

#### **2.2 Variables para `send-booking-emails`:**
```bash
RESEND_API_KEY=re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C
MAIL_FROM=Punto Legal <team@puntolegal.online>
ADMIN_EMAIL=puntolegalelgolf@gmail.com
SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg
EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025
```

#### **2.3 Variables para `mercadopago-webhook`:**
```bash
WEBHOOK_SECRET_TOKEN=ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd
```

### **PASO 3: Configurar en Supabase Dashboard**

#### **3.1 Ir a Edge Functions Settings:**
- **Menú:** Settings → Edge Functions → Environment Variables
- **O:** Settings → Configuration → Edge Functions

#### **3.2 Agregar Variables:**
1. **Hacer clic en "Add Variable"**
2. **Nombre:** `MERCADOPAGO_ACCESS_TOKEN`
3. **Valor:** `APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947`
4. **Repetir para cada variable**

#### **3.3 Lista Completa de Variables:**
| Variable | Valor |
|----------|-------|
| `MERCADOPAGO_ACCESS_TOKEN` | `APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947` |
| `APP_URL` | `https://puntolegal.online` |
| `RESEND_API_KEY` | `re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C` |
| `MAIL_FROM` | `Punto Legal <team@puntolegal.online>` |
| `ADMIN_EMAIL` | `puntolegalelgolf@gmail.com` |
| `SUPABASE_URL` | `https://qrgelocijmwnxcckxbdg.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `EDGE_ADMIN_TOKEN` | `puntolegal-admin-token-2025` |
| `WEBHOOK_SECRET_TOKEN` | `ee672ff228a693e920ef6e5948e5b0329241cf76895b95c0c3675c8c286276dd` |

### **PASO 4: Verificar  Configuración**

#### **4.1 Ejecutar Script de Prueba:**
```bash
node scripts/test-edge-functions.mjs
```

#### **4.2 Resultado Esperado:**
```
✅ create-mercadopago-preference: Funcionando correctamente
✅ mercadopago-webhook: Funcionando correctamente  
✅ send-booking-emails: Funcionando correctamente
```

---

## 🔍 **VERIFICACIÓN DETALLADA**

### **Probar Edge Function de MercadoPago:**
```bash
# Probar creación de preferencia
curl -X POST 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/create-mercadopago-preference' \
  -H 'Authorization: Bearer [ANON_KEY]' \
  -H 'Content-Type: application/json' \
  -d '{
    "paymentData": {
      "service": "Test",
      "price": "1000",
      "name": "Test User",
      "email": "test@puntolegal.online"
    }
  }'
```

### **Probar Edge Function de Emails:**
```bash
# Probar envío de emails
curl -X POST 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-booking-emails' \
  -H 'Authorization: Bearer [ANON_KEY]' \
  -H 'Content-Type: application/json' \
  -d '{"booking_id": "test-123"}'
```

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

### **En Supabase Dashboard:**
- [ ] Variables de entorno configuradas
- [ ] Edge Functions desplegadas
- [ ] Logs de Edge Functions accesibles
- [ ] Configuración guardada

### **Pruebas:**
- [ ] create-mercadopago-preference responde 200 OK
- [ ] mercadopago-webhook responde 200 OK
- [ ] send-booking-emails responde 200 OK
- [ ] Script de prueba ejecutado exitosamente

---

## 🚨 **SOLUCIÓN A ERRORES COMUNES**

### **Error: "Invalid JWT"**
- **Causa:** Variables de entorno no configuradas
- **Solución:** Configurar todas las variables en Supabase Dashboard

### **Error: "MERCADOPAGO_ACCESS_TOKEN no configurado"**
- **Causa:** Token de MercadoPago faltante
- **Solución:** Agregar variable `MERCADOPAGO_ACCESS_TOKEN`

### **Error: "RESEND_API_KEY no configurada"**
- **Causa:** API Key de Resend faltante
- **Solución:** Agregar variable `RESEND_API_KEY`

---

## 🎉 **RESULTADO ESPERADO**

Una vez configuradas las variables:
- ✅ Las Edge Functions responderán correctamente
- ✅ Los pagos se procesarán sin errores
- ✅ Los emails se enviarán automáticamente
- ✅ El sistema funcionará completamente

---

## 📞 **SOPORTE**

Si encuentras problemas:
1. **Verificar logs** en Supabase Dashboard → Edge Functions → Logs
2. **Revisar variables** en Settings → Edge Functions
3. **Probar individualmente** cada Edge Function
4. **Verificar conectividad** con el script de prueba
