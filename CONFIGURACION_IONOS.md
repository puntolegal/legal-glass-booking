# 🚀 CONFIGURACIÓN PARA IONOS HOSTING - PUNTO LEGAL

## 📋 **INFORMACIÓN DE TU DOMINIO**

### **Dominio Principal:**
- ✅ `puntolegal.online` - Configurado
- ✅ IP: `185.158.133.1`
- ✅ DNS: Configurado correctamente

### **Subdominios Disponibles:**
- ✅ `www.puntolegal.online` - Configurado
- ✅ `api.puntolegal.online` - Disponible para APIs
- ✅ `app.puntolegal.online` - Disponible para aplicación

## 🔧 **CONFIGURACIÓN ESPECÍFICA PARA IONOS**

### **PASO 1: CONFIGURAR VARIABLES DE ENTORNO EN IONOS**

#### **En el Panel de Control de IONOS:**
1. Ve a **Websites & Domains**
2. Selecciona `puntolegal.online`
3. Ve a **Environment Variables** o **PHP Settings**
4. Agrega las siguientes variables:

```bash
# MercadoPago - Credenciales de Producción
VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e

# Resend - API Key para emails
VITE_RESEND_API_KEY=re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C

# Email Configuration
VITE_MAIL_FROM=Punto Legal <team@puntolegal.online>
VITE_ADMIN_EMAIL=puntolegalelgolf@gmail.com

# Supabase Configuration
VITE_SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1iozmO5fKALjbI
```

### **PASO 2: CONFIGURAR MERCADOPAGO CON TU DOMINIO**

#### **En MercadoPago Dashboard:**
1. Ve a **Desarrolladores** → **Aplicaciones**
2. Selecciona tu aplicación
3. Ve a **Configuración** → **URLs de notificación**
4. Agrega las siguientes URLs:

```
https://puntolegal.online/payment-success?source=mercadopago
https://puntolegal.online/payment-failure?source=mercadopago
https://puntolegal.online/payment-pending?source=mercadopago
https://puntolegal.online/api/mercadopago/webhook
```

### **PASO 3: CONFIGURAR DNS ADICIONALES (OPCIONAL)**

#### **Para Mejor Organización:**
Puedes agregar estos registros DNS en IONOS:

```
Tipo: CNAME
Host: api
Valor: puntolegal.online
Descripción: API subdomain

Tipo: CNAME
Host: app
Valor: puntolegal.online
Descripción: App subdomain
```

### **PASO 4: CONFIGURAR SSL/HTTPS**

#### **En IONOS:**
1. Ve a **Websites & Domains** → `puntolegal.online`
2. Ve a **SSL/TLS**
3. Activa **Let's Encrypt** o **IONOS SSL**
4. Asegúrate de que HTTPS esté habilitado

### **PASO 5: SUBIR ARCHIVOS**

#### **Método 1: FTP/SFTP**
1. Usa las credenciales FTP de IONOS
2. Sube la carpeta `dist/` al directorio raíz
3. Asegúrate de que `index.html` esté en la raíz

#### **Método 2: File Manager**
1. Ve a **File Manager** en el panel de IONOS
2. Navega al directorio `htdocs/` o `public_html/`
3. Sube todos los archivos de la carpeta `dist/`

## 🔍 **VERIFICACIÓN POST-DEPLOY**

### **URLs a Verificar:**
- ✅ `https://puntolegal.online` - Página principal
- ✅ `https://puntolegal.online/agendamiento` - Formulario de agendamiento
- ✅ `https://puntolegal.online/payment-success` - Página de éxito
- ✅ `https://puntolegal.online/payment-failure` - Página de error

### **Logs de Debug Esperados:**
```javascript
🔍 INICIO DEBUG - Verificando entorno:
window.location.origin: https://puntolegal.online
NODE_ENV: production

🔍 Debug URLs de retorno:
back_urls configuradas: {
  success: "https://puntolegal.online/payment-success?source=mercadopago",
  failure: "https://puntolegal.online/payment-failure?source=mercadopago",
  pending: "https://puntolegal.online/payment-pending?source=mercadopago"
}
```

## 🛠️ **TROUBLESHOOTING ESPECÍFICO PARA IONOS**

### **Si las variables no se cargan:**
1. Verificar que estén en **Environment Variables**
2. Verificar que tengan el prefijo `VITE_`
3. Reiniciar el servidor web
4. Limpiar caché del navegador

### **Si hay problemas de CORS:**
1. Verificar configuración de headers en IONOS
2. Agregar headers CORS si es necesario
3. Verificar configuración de Supabase

### **Si MercadoPago no funciona:**
1. Verificar que las URLs estén configuradas en MercadoPago
2. Verificar que el dominio esté verificado
3. Revisar logs de debug en la consola

## 📋 **CHECKLIST PARA IONOS**

- [ ] Variables de entorno configuradas en IONOS
- [ ] SSL/HTTPS habilitado
- [ ] Archivos subidos correctamente
- [ ] URLs configuradas en MercadoPago
- [ ] Dominio verificado en MercadoPago
- [ ] Pruebas de pago realizadas
- [ ] Pruebas de email realizadas
- [ ] Logs de debug verificados

## 🚀 **COMANDOS ÚTILES**

### **Build para Producción:**
```bash
# Verificar configuración
node scripts/verify-production.js

# Hacer build
npm run build

# Los archivos estarán en dist/
```

### **Verificar Variables:**
```bash
# Verificar que las variables se carguen
node scripts/verify-production.js
```

---

**¡Configuración específica para IONOS completada!** 🚀

**Tu dominio `puntolegal.online` está listo para la aplicación.**
