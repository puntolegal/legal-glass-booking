# 🔒 GUÍA DE SEGURIDAD - VARIABLES DE ENTORNO

## ⚠️ **PROBLEMA CRÍTICO IDENTIFICADO:**

Con **Vite**, todas las variables que empiezan con `VITE_` se **EXponen en el cliente** (navegador). Esto significa que cualquier credencial secreta con `VITE_` es visible para los usuarios.

## 🚨 **VARIABLES PROHIBIDAS EN FRONTEND:**

### ❌ **NUNCA usar VITE_ con:**
- `ACCESS_TOKEN` (MercadoPago, APIs)
- `API_KEY` (Resend, servicios externos)
- `SECRET` (cualquier secreto)
- `PASSWORD` (contraseñas)
- `PRIVATE_KEY` (claves privadas)

### ✅ **SEGURO usar VITE_ con:**
- `PUBLIC_KEY` (claves públicas)
- `URL` (URLs públicas)
- `DOMAIN` (dominios)
- `APP_NAME` (nombres de app)
- `VERSION` (versiones)

## 🛡️ **ARQUITECTURA SEGURA:**

### **Frontend (Cliente):**
```bash
# ✅ SEGURO - Solo variables públicas
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_MAIL_FROM=Tu Nombre <email@dominio.com>
VITE_APP_URL=https://tu-dominio.com
```

### **Backend (Servidor):**
```bash
# ✅ SEGURO - Credenciales secretas
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx
RESEND_API_KEY=re_xxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
EDGE_ADMIN_TOKEN=tu-token-seguro
```

## 🔧 **CONFIGURACIÓN CORRECTA:**

### **1. Archivo .env (Frontend):**
```bash
# Solo variables públicas
VITE_MERCADOPAGO_PUBLIC_KEY=tu-public-key
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_MAIL_FROM=Tu Nombre <email@dominio.com>
```

### **2. Supabase Edge Functions:**
```bash
# Variables secretas en Supabase Dashboard
MERCADOPAGO_ACCESS_TOKEN=tu-access-token
RESEND_API_KEY=tu-resend-key
EDGE_ADMIN_TOKEN=tu-admin-token
```

### **3. Servidor Backend:**
```bash
# Variables secretas en servidor
MERCADOPAGO_ACCESS_TOKEN=tu-access-token
RESEND_API_KEY=tu-resend-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-key
```

## 🚀 **OPERACIONES SEGURAS:**

### **Frontend:**
- ✅ Crear preferencias de pago (usar Supabase Edge Function)
- ✅ Mostrar formularios de pago
- ✅ Validar datos del usuario
- ✅ Mostrar estado de pagos

### **Backend:**
- ✅ Procesar pagos reales
- ✅ Enviar emails
- ✅ Acceder a base de datos
- ✅ Validar webhooks

## 📋 **CHECKLIST DE SEGURIDAD:**

- [ ] ❌ Eliminar `VITE_ACCESS_TOKEN` del frontend
- [ ] ❌ Eliminar `VITE_API_KEY` del frontend
- [ ] ❌ Eliminar `VITE_SECRET` del frontend
- [ ] ✅ Mover credenciales secretas a backend
- [ ] ✅ Usar Supabase Edge Functions para operaciones sensibles
- [ ] ✅ Validar que no hay credenciales en el bundle del cliente

## 🔍 **VERIFICACIÓN:**

### **1. Revisar bundle del cliente:**
```bash
# Buscar credenciales expuestas
grep -r "APP_USR-" dist/
grep -r "re_" dist/
grep -r "eyJhbGci" dist/
```

### **2. Revisar variables de entorno:**
```bash
# Solo deben aparecer variables públicas
console.log(import.meta.env)
```

## ⚡ **ACCIÓN INMEDIATA REQUERIDA:**

1. **Rotar todas las credenciales** que estuvieron expuestas
2. **Eliminar variables secretas** del frontend
3. **Configurar credenciales** en el backend únicamente
4. **Verificar logs** por accesos no autorizados

---

**⚠️ RECUERDA: La seguridad es responsabilidad de todos. Nunca expongas credenciales secretas en el frontend.**
