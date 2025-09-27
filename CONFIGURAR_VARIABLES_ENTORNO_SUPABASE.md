# 🔧 CONFIGURAR VARIABLES DE ENTORNO EN SUPABASE

## 🚨 PROBLEMA ACTUAL
Todas las Edge Functions están fallando con error `401 Invalid JWT` porque las variables de entorno no están configuradas en Supabase.

## 📋 VARIABLES REQUERIDAS

### 1. **RESEND_API_KEY**
- **Valor:** `re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C`
- **Función:** Enviar emails con Resend

### 2. **MERCADOPAGO_ACCESS_TOKEN**
- **Valor:** `APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947`
- **Función:** Crear preferencias de pago

### 3. **MAIL_FROM**
- **Valor:** `Punto Legal <team@puntolegal.online>`
- **Función:** Email de origen

### 4. **ADMIN_EMAIL**
- **Valor:** `puntolegalelgolf@gmail.com`
- **Función:** Email de administrador

## 🎯 PASOS PARA CONFIGURAR

### **Paso 1: Ir a Supabase Dashboard**
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona el proyecto **Punto Legal**

### **Paso 2: Navegar a Edge Functions**
1. En el menú lateral, haz clic en **Edge Functions**
2. Haz clic en **Secrets** (o **Variables de entorno**)

### **Paso 3: Agregar Variables**
Para cada variable, haz clic en **Add new secret** y agrega:

#### **Variable 1: RESEND_API_KEY**
- **Name:** `RESEND_API_KEY`
- **Value:** `re_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C`

#### **Variable 2: MERCADOPAGO_ACCESS_TOKEN**
- **Name:** `MERCADOPAGO_ACCESS_TOKEN`
- **Value:** `APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947`

#### **Variable 3: MAIL_FROM**
- **Name:** `MAIL_FROM`
- **Value:** `Punto Legal <team@puntolegal.online>`

#### **Variable 4: ADMIN_EMAIL**
- **Name:** `ADMIN_EMAIL`
- **Value:** `puntolegalelgolf@gmail.com`

### **Paso 4: Guardar y Re-desplegar**
1. Haz clic en **Save** para cada variable
2. Ve a **Edge Functions** → **Manage Functions**
3. Para cada función, haz clic en **Deploy** (o **Redeploy**)

## 🧪 VERIFICAR CONFIGURACIÓN

Después de configurar las variables, ejecuta este comando para verificar:

```bash
node scripts/diagnostic-edge-functions.mjs
```

**Resultado esperado:**
- ✅ Status: 200 para todas las funciones
- ✅ Emails enviados correctamente
- ✅ Preferencias de MercadoPago creadas

## 🔍 TROUBLESHOOTING

### **Si sigue dando error 401:**
1. **Verificar que las variables estén guardadas** en Supabase
2. **Re-desplegar todas las Edge Functions**
3. **Esperar 1-2 minutos** para que se propaguen los cambios
4. **Verificar que no haya espacios** en los nombres de las variables

### **Si da error de sintaxis:**
1. **Verificar que el código esté correcto** en cada Edge Function
2. **No copiar comentarios markdown** al código
3. **Solo copiar el código TypeScript puro**

## 📊 ESTADO ACTUAL

```
❌ send-resend-emails: 401 Invalid JWT
❌ create-mercadopago-preference: 401 Invalid JWT  
❌ mercadopago-webhook: 401 Invalid JWT
```

## 🎯 ESTADO DESEADO

```
✅ send-resend-emails: 200 OK
✅ create-mercadopago-preference: 200 OK
✅ mercadopago-webhook: 200 OK
```

## 🚀 SIGUIENTE PASO

**Configura las 4 variables de entorno en Supabase** y luego ejecuta:

```bash
node scripts/diagnostic-edge-functions.mjs
```

¡Esto debería resolver todos los problemas de autenticación!
