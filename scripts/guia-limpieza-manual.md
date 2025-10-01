# 🧹 GUÍA: Limpieza Manual de Tabla Reservas

## 🚨 **PROBLEMA IDENTIFICADO**
Supabase no permite ejecutar comandos DDL (`ALTER TABLE`) desde Edge Functions por seguridad. Necesitamos hacerlo manualmente desde el Dashboard.

## 📋 **PASOS PARA EJECUTAR LA LIMPIEZA**

### **1️⃣ ACCEDER AL DASHBOARD**
1. Ir a: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg
2. Navegar a: **SQL Editor** (en el menú lateral)

### **2️⃣ EJECUTAR SCRIPT DE LIMPIEZA**
Copiar y pegar el siguiente script completo:

```sql
-- Script de limpieza de tabla reservas
-- Ejecutar en Supabase SQL Editor

-- PASO 1: Backup de la tabla actual
CREATE TABLE reservas_backup AS SELECT * FROM reservas;

-- PASO 2: Eliminar columnas redundantes
ALTER TABLE reservas DROP COLUMN IF EXISTS rut;
ALTER TABLE reservas DROP COLUMN IF EXISTS cliente_nombre;
ALTER TABLE reservas DROP COLUMN IF EXISTS cliente_email;
ALTER TABLE reservas DROP COLUMN IF EXISTS cliente_telefono;
ALTER TABLE reservas DROP COLUMN IF EXISTS servicio_nombre;
ALTER TABLE reservas DROP COLUMN IF EXISTS servicio_precio;
ALTER TABLE reservas DROP COLUMN IF EXISTS fecha_agendada;
ALTER TABLE reservas DROP COLUMN IF EXISTS hora_agendada;
ALTER TABLE reservas DROP COLUMN IF EXISTS motivo_consulta;
ALTER TABLE reservas DROP COLUMN IF EXISTS notas;
ALTER TABLE reservas DROP COLUMN IF EXISTS recordatorio_enviado;
ALTER TABLE reservas DROP COLUMN IF EXISTS webhook_sent;
ALTER TABLE reservas DROP COLUMN IF EXISTS user_id;
ALTER TABLE reservas DROP COLUMN IF EXISTS categoria;
ALTER TABLE reservas DROP COLUMN IF EXISTS preference_id;
ALTER TABLE reservas DROP COLUMN IF EXISTS pago_id;
ALTER TABLE reservas DROP COLUMN IF EXISTS pago_metodo;

-- PASO 3: Verificar estructura final
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- PASO 4: Verificar datos
SELECT COUNT(*) as total_reservas FROM reservas;
SELECT COUNT(*) as emails_enviados FROM reservas WHERE email_enviado = true;
```

### **3️⃣ EJECUTAR EL SCRIPT**
1. **Pegar** el script completo en el editor
2. **Hacer clic** en "Run" o presionar `Ctrl+Enter`
3. **Verificar** que no hay errores
4. **Revisar** los resultados

### **4️⃣ VERIFICAR RESULTADOS ESPERADOS**

#### **✅ Estructura Final (17 columnas):**
```
1. id
2. nombre
3. email
4. telefono
5. servicio
6. precio
7. fecha
8. hora
9. descripcion
10. tipo_reunion
11. estado
12. created_at
13. updated_at
14. external_reference
15. pago_estado
16. email_enviado
17. email_enviado_at
```

#### **✅ Datos Preservados:**
- Total de reservas: **126**
- Emails enviados: **9**

## 🎯 **BENEFICIOS DE LA LIMPIEZA**

### **📊 ANTES vs DESPUÉS:**
- **ANTES:** 34 columnas (sobrecargado)
- **DESPUÉS:** 17 columnas (optimizado)
- **REDUCCIÓN:** 50% menos columnas

### **⚡ MEJORAS:**
- ✅ **Consultas más rápidas**
- ✅ **Menos confusión en el código**
- ✅ **Datos más consistentes**
- ✅ **Mantenimiento más fácil**
- ✅ **Esquema más claro**

## 🔍 **VERIFICACIÓN POST-LIMPIEZA**

### **1️⃣ Probar Emails:**
```bash
node scripts/enviar-emails-pendientes.mjs
```

### **2️⃣ Probar Webhook:**
- Crear una nueva reserva
- Verificar que el webhook funciona
- Confirmar que emails se envían

### **3️⃣ Probar Funcionalidad Completa:**
- Agendar nueva consulta
- Procesar pago con MercadoPago
- Verificar confirmación de email

## ⚠️ **ROLLBACK DISPONIBLE**
Si hay problemas, puedes restaurar desde el backup:
```sql
DROP TABLE reservas;
CREATE TABLE reservas AS SELECT * FROM reservas_backup;
```

## 🚀 **PRÓXIMOS PASOS**
1. ✅ Ejecutar script en Supabase Dashboard
2. ✅ Verificar estructura final
3. ✅ Probar funcionalidad completa
4. ✅ Confirmar que todo funciona

---

**¡La limpieza hará el sistema más eficiente y mantenible!** 🎯✨
