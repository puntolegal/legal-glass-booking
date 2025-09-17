# 🔧 Deshabilitar Confirmación de Email

## 🚨 **Problema Actual:**
El login se queda colgado en "Iniciando sesión..." porque el email no está confirmado.

## ✅ **Solución Rápida:**

### **Paso 1: Ir a Supabase Dashboard**
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto: `legal-glass-booking`

### **Paso 2: Deshabilitar Confirmación de Email**
1. Ve a **Authentication > Settings**
2. Busca la sección **"Email Auth"**
3. **Desactiva** la opción **"Enable email confirmations"**
4. **Guarda los cambios**

### **Paso 3: Probar Login**
1. Ve a: `http://localhost:8080/servicios/corporativo`
2. Haz clic en "Iniciar Sesión Empresa"
3. Usa las credenciales:
   - **Email**: `puntolegalelgolf@gmail.com`
   - **Contraseña**: `adminadmin`
4. Debería funcionar inmediatamente

## 🔄 **Alternativa: Confirmar Email Manualmente**

### **Opción A: Desde Supabase Dashboard**
1. Ve a **Authentication > Users**
2. Busca: `puntolegalelgolf@gmail.com`
3. Haz clic en el usuario
4. Cambia **"Email Confirmed"** de **"No"** a **"Yes"**
5. Guarda los cambios

### **Opción B: Desde Email**
1. Revisa tu email: `puntolegalelgolf@gmail.com`
2. Busca el email de Supabase
3. Haz clic en el enlace de confirmación

## ⚡ **Solución Inmediata (Recomendada):**

**Deshabilitar la confirmación de email es la forma más rápida para desarrollo:**

1. **Supabase Dashboard > Authentication > Settings**
2. **Desactiva "Enable email confirmations"**
3. **Guarda**
4. **Prueba login inmediatamente**

## 🎯 **Resultado Esperado:**
- ✅ Login funciona inmediatamente
- ✅ No más pantalla de carga infinita
- ✅ Acceso directo al panel administrativo
- ✅ Todas las funcionalidades disponibles

---

**¡Después de deshabilitar la confirmación, el login funcionará perfectamente! 🚀** 