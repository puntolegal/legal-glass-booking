# 🚀 CONFIGURACIÓN DE PRODUCCIÓN - PUNTO LEGAL

## ❌ **PROBLEMAS IDENTIFICADOS EN PRODUCCIÓN**

### **1. Variables de Entorno No Configuradas:**
- MercadoPago credentials no detectadas
- Resend API key no configurada

### **2. Error de MercadoPago:**
```
auto_return invalid. back_url.success must be defined
```

## ✅ **SOLUCIÓN COMPLETA**

### **PASO 1: CONFIGURAR VARIABLES DE ENTORNO**

#### **Para Vercel:**
1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto `legal-glass-booking`
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

```bash
# MercadoPago
VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e

# Resend
VITE_RESEND_API_KEY=re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C

# Email
VITE_MAIL_FROM=Punto Legal <team@puntolegal.online>
VITE_ADMIN_EMAIL=puntolegalelgolf@gmail.com

# Supabase
VITE_SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1iozmO5fKALjbI
```

#### **Para Netlify:**
1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio
3. Ve a **Site settings** → **Environment variables**
4. Agrega las mismas variables que arriba

### **PASO 2: CONFIGURAR DOMINIO EN MERCADOPAGO**

#### **En el Dashboard de MercadoPago:**
1. Ve a **Desarrolladores** → **Aplicaciones**
2. Selecciona tu aplicación
3. Ve a **Configuración** → **URLs de notificación**
4. Agrega las siguientes URLs:

```
https://puntolegal.online/payment-success
https://puntolegal.online/payment-failure
https://puntolegal.online/payment-pending
https://puntolegal.online/api/mercadopago/webhook
```

### **PASO 3: VERIFICAR CONFIGURACIÓN**

#### **Logs de Debug Esperados:**
```javascript
🔍 INICIO DEBUG - Verificando entorno:
window.location.origin: https://puntolegal.online
window.location.href: https://puntolegal.online/agendamiento
NODE_ENV: production

🔍 Debug URLs de retorno:
back_urls configuradas: {
  success: "https://puntolegal.online/payment-success?source=mercadopago",
  failure: "https://puntolegal.online/payment-failure?source=mercadopago",
  pending: "https://puntolegal.online/payment-pending?source=mercadopago"
}

🚀 Llamando a createCheckoutPreference con: { ... }
🔍 back_urls en preferenceData: { success: "...", failure: "...", pending: "..." }
```

### **PASO 4: REDEPLOY**

Después de configurar las variables de entorno:

1. **Vercel:** Hacer un nuevo deploy automático
2. **Netlify:** Hacer un nuevo deploy manual
3. **Verificar** que las variables se carguen correctamente

## 🔧 **TROUBLESHOOTING**

### **Si las variables no se cargan:**
1. Verificar que tengan el prefijo `VITE_`
2. Verificar que estén configuradas para el entorno correcto
3. Hacer un nuevo deploy después de configurar

### **Si MercadoPago sigue fallando:**
1. Verificar que las URLs estén configuradas en MercadoPago
2. Verificar que el dominio esté verificado
3. Revisar los logs de debug en la consola

### **Si los emails no se envían:**
1. Verificar que la API key de Resend sea válida
2. Verificar que el dominio esté verificado en Resend
3. Revisar los logs de la Edge Function

## 📋 **CHECKLIST DE PRODUCCIÓN**

- [ ] Variables de entorno configuradas en hosting
- [ ] URLs configuradas en MercadoPago
- [ ] Dominio verificado en MercadoPago
- [ ] API key de Resend configurada
- [ ] Dominio verificado en Resend
- [ ] Deploy realizado
- [ ] Pruebas de pago realizadas
- [ ] Pruebas de email realizadas

---

**¡Configuración de producción lista!** 🚀
