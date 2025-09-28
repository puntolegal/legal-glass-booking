# 🔧 CONFIGURAR WEBHOOK PÚBLICO EN SUPABASE

## 🎯 **PROBLEMA:**
El webhook de MercadoPago requiere autenticación, pero MercadoPago no puede autenticarse.

## 🔧 **SOLUCIÓN:**

### **PASO 1: Configurar función como pública en Supabase Dashboard**

1. **Ir a Supabase Dashboard** → **Edge Functions**
2. **Buscar** `mercadopago-webhook`
3. **Clic en Settings** (configuración)
4. **Cambiar** "Authentication" a **"Public"**
5. **Guardar** cambios

### **PASO 2: Verificar configuración**

El webhook debería poder ser llamado sin autenticación:
```
POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook
```

### **PASO 3: Configurar en MercadoPago Dashboard**

1. **Ir a MercadoPago Dashboard** → **Webhooks**
2. **URL del webhook:** `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook`
3. **Eventos:** Seleccionar "Payments"
4. **Guardar** configuración

## ✅ **RESULTADO ESPERADO:**
- MercadoPago puede llamar el webhook sin autenticación
- Webhook actualiza reservas automáticamente
- Emails se envían automáticamente
- Sistema completamente funcional
