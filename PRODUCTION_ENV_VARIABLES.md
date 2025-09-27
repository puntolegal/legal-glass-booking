# 🔧 Variables de Entorno para Producción

## 📋 **Variables que deben configurarse en Vercel/Netlify:**

### **MercadoPago:**
```
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e
VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
```

### **Resend (Email):**
```
VITE_RESEND_API_KEY=re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C
VITE_MAIL_FROM=Punto Legal <team@puntolegal.online>
VITE_ADMIN_EMAIL=puntolegalelgolf@gmail.com
```

### **Supabase:**
```
VITE_SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI
VITE_SUPABASE_PROJECT_REF=qrgelocijmwnxcckxbdg
```

### **Configuración de la App:**
```
VITE_APP_NAME=Punto Legal
VITE_APP_URL=https://legal-glass-booking.vercel.app
```

## 🚀 **Cómo configurar en Vercel:**

1. **Ir a Vercel Dashboard**
2. **Seleccionar el proyecto** `legal-glass-booking`
3. **Ir a Settings > Environment Variables**
4. **Agregar cada variable** con su valor correspondiente
5. **Redeploy** el proyecto

## 🚀 **Cómo configurar en Netlify:**

1. **Ir a Netlify Dashboard**
2. **Seleccionar el sitio** `legal-glass-booking`
3. **Ir a Site settings > Environment variables**
4. **Agregar cada variable** con su valor correspondiente
5. **Redeploy** el sitio

## ✅ **Verificación:**

Después de configurar las variables y hacer redeploy, verificar que:
- ✅ MercadoPago se conecte correctamente
- ✅ Los pagos funcionen sin errores
- ✅ Los emails se envíen correctamente
- ✅ Supabase esté conectado

## 🔧 **Solución Implementada:**

- ✅ **Valores de fallback** configurados en el código
- ✅ **Configuración centralizada** en `mercadopago.ts`
- ✅ **Compatibilidad** con desarrollo y producción
- ✅ **Manejo de errores** mejorado
