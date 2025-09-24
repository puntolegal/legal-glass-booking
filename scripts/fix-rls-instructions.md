# 🔧 CORREGIR POLÍTICAS RLS EN SUPABASE

## ❌ PROBLEMA ACTUAL
El error `42501: new row violates row-level security policy for table "reservas"` indica que las políticas RLS no permiten insertar reservas.

## ✅ SOLUCIÓN TEMPORAL IMPLEMENTADA
- La aplicación ahora usa **modo offline** cuando falla Supabase
- Las reservas se guardan en `localStorage` como respaldo
- El código PUNTOLEGALADMIN sigue funcionando correctamente

## 🎯 SOLUCIÓN PERMANENTE

### Opción 1: SQL Editor de Supabase (RECOMENDADO)

1. **Ve al Dashboard de Supabase:**
   - URL: https://supabase.com/dashboard
   - Proyecto: `qrgelocijmwnxcckxbdg`

2. **Abre el SQL Editor:**
   - Menú lateral → SQL Editor
   - Crea una nueva consulta

3. **Ejecuta este script:**
   ```sql
   -- Eliminar políticas existentes si hay conflictos
   DROP POLICY IF EXISTS "Permitir crear reservas públicas" ON public.reservas;
   DROP POLICY IF EXISTS "Permitir insertar reservas" ON public.reservas;
   DROP POLICY IF EXISTS "Permitir crear reservas" ON public.reservas;

   -- Crear política RLS para permitir inserción de reservas
   CREATE POLICY "Permitir crear reservas públicas" 
   ON public.reservas 
   FOR INSERT 
   TO public 
   WITH CHECK (true);

   -- Crear política RLS para permitir lectura de reservas
   CREATE POLICY "Permitir leer reservas públicas" 
   ON public.reservas 
   FOR SELECT 
   TO public 
   USING (true);

   -- Crear política RLS para permitir actualización de reservas
   CREATE POLICY "Permitir actualizar reservas públicas" 
   ON public.reservas 
   FOR UPDATE 
   TO public 
   USING (true) 
   WITH CHECK (true);

   -- Verificar que RLS esté habilitado
   ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
   ```

4. **Verifica que funcionó:**
   - Ejecuta: `node scripts/test-supabase-connection.js`
   - Debería mostrar "✅ CONEXIÓN EXITOSA"

### Opción 2: Authentication > Policies

1. **Ve a Authentication > Policies:**
   - Dashboard → Authentication → Policies
   - Busca la tabla `reservas`

2. **Crea las políticas:**
   - **Insert Policy:** `Permitir crear reservas públicas`
   - **Select Policy:** `Permitir leer reservas públicas`
   - **Update Policy:** `Permitir actualizar reservas públicas`

3. **Configuración de cada política:**
   - **Target roles:** `public`
   - **Operation:** `INSERT/SELECT/UPDATE`
   - **Check expression:** `true`
   - **Using expression:** `true` (para SELECT y UPDATE)

## 🧪 VERIFICACIÓN

Después de aplicar la solución:

```bash
# Probar conexión
node scripts/test-supabase-connection.js

# Probar inserción específica
node scripts/test-reserva-insert.js
```

## 📊 ESTADO ACTUAL

- ✅ **Código PUNTOLEGALADMIN:** Funcionando perfectamente
- ✅ **Validación inmediata:** Confirmación visual correcta
- ✅ **Precio $1.000:** Aplicado correctamente
- ⚠️ **Base de datos:** Modo offline (temporal)
- 🔧 **Políticas RLS:** Necesitan corrección

## 🎉 RESULTADO ESPERADO

Una vez corregidas las políticas RLS:
- Las reservas se guardarán en Supabase
- Los emails se enviarán automáticamente
- El sistema funcionará completamente online
- El modo offline será solo un respaldo

---

**Nota:** La aplicación funciona correctamente en modo offline, pero para funcionalidad completa (emails automáticos, persistencia en base de datos), es necesario corregir las políticas RLS.
