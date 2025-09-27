# 🔐 CONFIGURACIÓN DE CREDENCIALES SECRETAS

## 📋 **ARCHIVOS CREADOS:**

He creado los siguientes archivos para configurar las credenciales secretas de forma segura:

### **1. `env-backend-template`**
- **Uso:** Configuración completa del backend
- **Contiene:** Todas las credenciales secretas
- **Dónde usar:** Servidor backend, Supabase Edge Functions

### **2. `env-supabase-secrets`**
- **Uso:** Variables para Supabase Edge Functions
- **Contiene:** Solo las credenciales necesarias para Edge Functions
- **Dónde usar:** Supabase Dashboard → Settings → Edge Functions → Secrets

### **3. `env-production-secure`**
- **Uso:** Variables para plataformas de hosting (Vercel, Netlify)
- **Contiene:** Solo variables públicas para el frontend
- **Dónde usar:** Panel de hosting → Environment Variables

### **4. `env-development-secure`**
- **Uso:** Desarrollo local
- **Contiene:** Solo variables públicas para desarrollo
- **Dónde usar:** Archivo `.env.local` en tu proyecto

---

## 🚀 **INSTRUCCIONES DE CONFIGURACIÓN:**

### **PASO 1: CONFIGURAR SUPABASE EDGE FUNCTIONS**

1. **Ir a Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Seleccionar tu proyecto

2. **Ir a Settings → Edge Functions → Secrets**

3. **Agregar estas variables:**
   ```bash
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token-real
   RESEND_API_KEY=re_tu-resend-api-key-real
   MAIL_FROM=Tu Nombre <tu-email@dominio.com>
   ADMIN_EMAIL=tu-admin-email@dominio.com
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...tu-service-role-key-real
   EDGE_ADMIN_TOKEN=tu-edge-admin-token-super-seguro
   WEBHOOK_SECRET_TOKEN=tu-webhook-secret-token
   APP_URL=https://tu-dominio.com
   APP_NAME=Punto Legal
   NODE_ENV=production
   ```

### **PASO 2: CONFIGURAR HOSTING (VERCEL/NETLIFY)**

1. **Ir al panel de tu hosting:**
   - Vercel: https://vercel.com/dashboard
   - Netlify: https://app.netlify.com

2. **Ir a Settings → Environment Variables**

3. **Agregar estas variables (solo públicas):**
   ```bash
   VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key-real
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...tu-anon-key-real
   VITE_SUPABASE_PROJECT_REF=tu-proyecto-ref
   VITE_MAIL_FROM=Tu Nombre <tu-email@dominio.com>
   VITE_ADMIN_EMAIL=tu-admin-email@dominio.com
   VITE_APP_NAME=Punto Legal
   VITE_APP_URL=https://tu-dominio.com
   VITE_APP_VERSION=1.0.0
   VITE_SUCCESS_URL=https://tu-dominio.com/payment-success?source=mercadopago
   VITE_FAILURE_URL=https://tu-dominio.com/payment-failure?source=mercadopago
   VITE_PENDING_URL=https://tu-dominio.com/payment-pending?source=mercadopago
   VITE_DEBUG=false
   VITE_LOG_LEVEL=info
   ```

### **PASO 3: CONFIGURAR DESARROLLO LOCAL**

1. **Crear archivo `.env.local` en la raíz del proyecto**

2. **Copiar contenido de `env-development-secure`**

3. **Actualizar con tus valores reales:**
   ```bash
   VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-sandbox
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...tu-anon-key-real
   VITE_SUPABASE_PROJECT_REF=tu-proyecto-ref
   VITE_MAIL_FROM=Desarrollo <dev@tu-dominio.com>
   VITE_ADMIN_EMAIL=dev-admin@tu-dominio.com
   VITE_APP_NAME=Punto Legal (Dev)
   VITE_APP_URL=http://localhost:5173
   VITE_APP_VERSION=1.0.0-dev
   VITE_SUCCESS_URL=http://localhost:5173/payment-success?source=mercadopago
   VITE_FAILURE_URL=http://localhost:5173/payment-failure?source=mercadopago
   VITE_PENDING_URL=http://localhost:5173/payment-pending?source=mercadopago
   VITE_DEBUG=true
   VITE_LOG_LEVEL=debug
   ```

---

## 🔒 **SEGURIDAD IMPLEMENTADA:**

### **✅ SEPARACIÓN CLARA:**
- **Frontend:** Solo variables públicas (`VITE_*`)
- **Backend:** Credenciales secretas (sin `VITE_`)

### **✅ ARCHIVOS SEGUROS:**
- **No hay credenciales secretas** en archivos del frontend
- **Todas las operaciones sensibles** se manejan en el backend
- **Variables públicas** están claramente identificadas

### **✅ CONFIGURACIÓN POR ENTORNO:**
- **Desarrollo:** Credenciales de sandbox
- **Producción:** Credenciales reales
- **Backend:** Credenciales secretas separadas

---

## 🚨 **ACCIÓN INMEDIATA:**

1. **🔄 ROTAR CREDENCIALES** que estuvieron expuestas
2. **⚙️ CONFIGURAR** Supabase Edge Functions con las nuevas credenciales
3. **🌐 CONFIGURAR** hosting con variables públicas
4. **💻 CONFIGURAR** desarrollo local con variables de sandbox
5. **🧪 PROBAR** que todo funcione correctamente

---

## 📋 **CHECKLIST DE CONFIGURACIÓN:**

- [ ] ✅ Credenciales rotadas en todos los servicios
- [ ] ✅ Supabase Edge Functions configuradas
- [ ] ✅ Hosting configurado con variables públicas
- [ ] ✅ Desarrollo local configurado
- [ ] ✅ Aplicación probada en desarrollo
- [ ] ✅ Aplicación desplegada en producción
- [ ] ✅ Pagos funcionando correctamente
- [ ] ✅ Emails enviándose correctamente

---

**⚠️ RECUERDA: Nunca subir archivos con credenciales secretas al repositorio. Solo usar los templates proporcionados.**
