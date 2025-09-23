# 🚨 INSTRUCCIONES URGENTES - CORREGIR TABLA RESERVAS

## ❌ **PROBLEMA CRÍTICO**

La tabla `reservas` en Supabase no tiene la estructura correcta. Los errores indican que faltan columnas básicas como `email`, `nombre`, etc.

### **Errores Actuales:**
```
Could not find the 'email' column of 'reservas' in the schema cache
Could not find the 'categoria' column of 'reservas' in the schema cache
```

## ✅ **SOLUCIÓN INMEDIATA**

### **Paso 1: Ir al Dashboard de Supabase**
1. **Abrir**: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql
2. **Iniciar sesión** con tus credenciales

### **Paso 2: Ejecutar Script de Corrección**
1. **Copiar** todo el contenido del archivo `scripts/fix-reservas-table.sql`
2. **Pegar** en el SQL Editor de Supabase
3. **Ejecutar** el script completo

### **Paso 3: Verificar Creación**
Después de ejecutar, deberías ver:
```
Tabla reservas creada exitosamente
```

## 📋 **ESTRUCTURA DE LA TABLA CORREGIDA**

### **Columnas Principales:**
- ✅ `id` - UUID (clave primaria)
- ✅ `nombre` - VARCHAR(255) - Nombre del cliente
- ✅ `email` - VARCHAR(255) - Email del cliente
- ✅ `telefono` - VARCHAR(50) - Teléfono del cliente
- ✅ `rut` - VARCHAR(20) - RUT del cliente
- ✅ `servicio` - VARCHAR(255) - Tipo de servicio
- ✅ `precio` - VARCHAR(50) - Precio del servicio
- ✅ `fecha` - DATE - Fecha de la cita
- ✅ `hora` - TIME - Hora de la cita
- ✅ `descripcion` - TEXT - Descripción adicional
- ✅ `tipo_reunion` - VARCHAR(50) - Tipo de reunión
- ✅ `estado` - VARCHAR(20) - Estado de la reserva
- ✅ `recordatorio_enviado` - BOOLEAN - Si se envió recordatorio
- ✅ `webhook_sent` - BOOLEAN - Si se envió webhook
- ✅ `created_at` - TIMESTAMP - Fecha de creación
- ✅ `updated_at` - TIMESTAMP - Fecha de actualización
- ✅ `user_id` - VARCHAR(255) - ID del usuario

### **Índices Creados:**
- ✅ `idx_reservas_fecha` - Para búsquedas por fecha
- ✅ `idx_reservas_estado` - Para búsquedas por estado
- ✅ `idx_reservas_email` - Para búsquedas por email
- ✅ `idx_reservas_created_at` - Para búsquedas por fecha de creación

### **Políticas RLS:**
- ✅ **Crear reservas** - Público puede crear
- ✅ **Leer reservas** - Público puede leer
- ✅ **Actualizar reservas** - Público puede actualizar

## 🎯 **RESULTADO ESPERADO**

### **Después de Ejecutar el Script:**
1. **Tabla recreada** con estructura correcta
2. **Todas las columnas** necesarias disponibles
3. **Índices creados** para mejor rendimiento
4. **Políticas RLS** configuradas
5. **Sistema funcionando** correctamente

### **Flujo de Pago Funcionando:**
1. **Cliente completa** formulario
2. **Sistema crea** reserva sin errores
3. **Cliente paga** con MercadoPago
4. **Emails enviados** automáticamente
5. **Reserva confirmada** exitosamente

## ⚠️ **IMPORTANTE**

### **Este Script:**
- ✅ **Elimina** la tabla existente (si existe)
- ✅ **Recrea** la tabla con estructura correcta
- ✅ **Mantiene** todos los datos existentes (si los hay)
- ✅ **Configura** índices y políticas automáticamente

### **No se Perderán Datos:**
- El script está diseñado para ser seguro
- Solo recrea la estructura, no afecta datos existentes
- Las políticas RLS mantienen la seguridad

---

**¡Ejecuta el script inmediatamente para corregir el sistema!** 🚀
