# 🚨 CORRECCIÓN URGENTE - MEZCLA DE ENTORNOS MERCADOPAGO

## **❌ PROBLEMA DETECTADO:**

Se están usando **credenciales de PRODUCCIÓN** en desarrollo, lo cual es **PELIGROSO** y puede causar:
- Pagos reales durante pruebas
- Cobros accidentales a usuarios
- Violación de términos de MercadoPago

## **🔍 CREDENCIALES INCORRECTAS ENCONTRADAS:**

```bash
# ❌ INCORRECTO - Credenciales de PRODUCCIÓN en desarrollo
VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e
```

## **✅ CORRECCIÓN INMEDIATA:**

### **1. OBTENER CREDENCIALES DE SANDBOX:**

1. **Ir a MercadoPago Developers:**
   - https://www.mercadopago.com.ar/developers
   - Iniciar sesión con tu cuenta

2. **Crear aplicación de TEST:**
   - Ir a "Tus integraciones"
   - Crear nueva aplicación
   - Seleccionar "Test" (no "Producción")

3. **Obtener credenciales de SANDBOX:**
   ```bash
   # ✅ CORRECTO - Credenciales de SANDBOX
   VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-sandbox-aqui
   # (Access Token no debe estar en frontend)
   ```

### **2. CONFIGURAR ARCHIVOS CORRECTOS:**

#### **Desarrollo Local (.env.local):**
```bash
# ===========================================
# DESARROLLO - SOLO CREDENCIALES DE SANDBOX
# ===========================================
NODE_ENV=development
MODE=development

# MercadoPago - SANDBOX únicamente
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-sandbox-aqui

# Supabase - Puede usar las mismas credenciales
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...tu-anon-key-real

# Email - Desarrollo
VITE_MAIL_FROM=Desarrollo <dev@tu-dominio.com>
VITE_ADMIN_EMAIL=dev-admin@tu-dominio.com

# URLs de desarrollo
VITE_APP_URL=http://localhost:5173
VITE_SUCCESS_URL=http://localhost:5173/payment-success?source=mercadopago
VITE_FAILURE_URL=http://localhost:5173/payment-failure?source=mercadopago
VITE_PENDING_URL=http://localhost:5173/payment-pending?source=mercadopago
```

#### **Producción (Hosting):**
```bash
# ===========================================
# PRODUCCIÓN - CREDENCIALES DE PRODUCCIÓN
# ===========================================
NODE_ENV=production
MODE=production

# MercadoPago - PRODUCCIÓN únicamente
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key-prod-aqui

# Supabase - Mismas credenciales
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...tu-anon-key-real

# Email - Producción
VITE_MAIL_FROM=Punto Legal <team@puntolegal.online>
VITE_ADMIN_EMAIL=puntolegalelgolf@gmail.com

# URLs de producción
VITE_APP_URL=https://puntolegal.online
VITE_SUCCESS_URL=https://puntolegal.online/payment-success?source=mercadopago
VITE_FAILURE_URL=https://puntolegal.online/payment-failure?source=mercadopago
VITE_PENDING_URL=https://puntolegal.online/payment-pending?source=mercadopago
```

### **3. CONFIGURAR SUPABASE EDGE FUNCTIONS:**

#### **Para Desarrollo:**
```bash
# Edge Functions - Desarrollo
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-sandbox-aqui
NODE_ENV=development
APP_URL=http://localhost:5173
```

#### **Para Producción:**
```bash
# Edge Functions - Producción
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token-prod-aqui
NODE_ENV=production
APP_URL=https://puntolegal.online
```

## **🔒 SEPARACIÓN DE ENTORNOS:**

### **✅ DESARROLLO:**
- **Credenciales:** `TEST-` (Sandbox)
- **Base de datos:** Desarrollo/Test
- **URLs:** `localhost:5173`
- **Pagos:** Simulados (no reales)

### **✅ PRODUCCIÓN:**
- **Credenciales:** `APP_USR-` (Producción)
- **Base de datos:** Producción
- **URLs:** `puntolegal.online`
- **Pagos:** Reales

## **🚨 ACCIÓN INMEDIATA REQUERIDA:**

1. **🔄 ROTAR** las credenciales de producción que estuvieron expuestas
2. **📝 CREAR** aplicación de sandbox en MercadoPago
3. **⚙️ CONFIGURAR** credenciales de sandbox para desarrollo
4. **🧪 PROBAR** que los pagos de sandbox funcionen
5. **🚀 DESPLEGAR** con credenciales de producción correctas

## **📋 CHECKLIST DE CORRECCIÓN:**

- [ ] ✅ Crear aplicación de sandbox en MercadoPago
- [ ] ✅ Obtener credenciales de sandbox (`TEST-`)
- [ ] ✅ Configurar `.env.local` con credenciales de sandbox
- [ ] ✅ Configurar Supabase Edge Functions para desarrollo
- [ ] ✅ Probar pagos de sandbox en desarrollo
- [ ] ✅ Rotar credenciales de producción expuestas
- [ ] ✅ Configurar producción con credenciales correctas
- [ ] ✅ Verificar que no haya mezcla de entornos

## **⚠️ IMPORTANTE:**

**NUNCA** usar credenciales de producción en desarrollo. Esto puede causar:
- Cobros accidentales
- Violación de términos de servicio
- Problemas legales
- Pérdida de credibilidad

---

**🔐 La seguridad y separación de entornos es CRÍTICA para el funcionamiento correcto del sistema.**
