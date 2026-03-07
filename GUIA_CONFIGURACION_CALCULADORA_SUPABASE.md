# 📋 Guía: Configuración de Supabase para Calculadora de Pensión

## 🎯 Objetivo
Configurar la tabla `leads_quiz` en Supabase para que guarde correctamente todos los datos de la Calculadora de Pensión de Alimentos.

---

## 📊 Paso 1: Acceder al SQL Editor de Supabase

1. Abre tu proyecto en Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/[TU_PROJECT_ID]
   ```

2. Ve al menú lateral izquierdo y haz clic en **"SQL Editor"**

3. Haz clic en **"New Query"** para crear una nueva consulta

---

## 🔧 Paso 2: Ejecutar el Script SQL

### Opción A: Ejecutar Manualmente (Recomendado)

1. Abre el archivo `SETUP_LEADS_QUIZ_CALCULADORA.sql` que está en la raíz del proyecto

2. **Copia TODO el contenido** del archivo

3. **Pega el contenido** en el SQL Editor de Supabase

4. Haz clic en **"Run"** o presiona `Ctrl+Enter` (Windows/Linux) o `Cmd+Enter` (Mac)

5. Verifica que aparezca el mensaje: **"Success. No rows returned"**

### Opción B: Ejecutar desde Terminal (Si tienes Supabase CLI)

```bash
# Desde la raíz del proyecto
supabase db execute -f SETUP_LEADS_QUIZ_CALCULADORA.sql
```

---

## ✅ Paso 3: Verificar que Todo Esté Correcto

Ejecuta esta consulta en el SQL Editor para verificar la estructura:

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'leads_quiz'
ORDER BY ordinal_position;
```

**Deberías ver estas columnas:**

| column_name | data_type | is_nullable |
|------------|-----------|-------------|
| id | uuid | NO |
| email | text | NO |
| name | text | NO |
| quiz_answers | jsonb | NO |
| plan_recommended | text | YES |
| status | text | YES |
| created_at | timestamptz | YES |
| updated_at | timestamptz | YES |
| income_value | integer | YES |
| income_range | text | YES |
| children_count | integer | YES |
| children_label | text | YES |
| calculated_min | text | YES |
| calculated_max | text | YES |

---

## 🧪 Paso 4: Probar la Inserción

Ejecuta esta consulta de prueba para verificar que puedes insertar datos:

```sql
-- Insertar un lead de prueba
INSERT INTO public.leads_quiz (
  email,
  name,
  quiz_answers,
  status,
  income_value,
  children_count,
  calculated_min,
  calculated_max
) VALUES (
  'test@ejemplo.com',
  'Calculadora Pensión Lead',
  '{"source": "calculadora_pension", "ingreso_demandado": 800000, "cantidad_hijos": 2}'::jsonb,
  'calculadora_iniciada',
  800000,
  2,
  '$215.600',
  '$400.000'
);

-- Verificar que se insertó correctamente
SELECT * FROM public.leads_quiz WHERE email = 'test@ejemplo.com';

-- Limpiar el registro de prueba (opcional)
-- DELETE FROM public.leads_quiz WHERE email = 'test@ejemplo.com';
```

---

## 📝 Estructura de Datos que se Guardan

### Cuando el usuario ingresa su email (Paso 1):
```json
{
  "name": "Calculadora Pensión Lead",
  "email": "usuario@ejemplo.com",
  "quiz_answers": {"source": "calculadora_pension"},
  "status": "calculadora_iniciada"
}
```

### Cuando el usuario completa el cálculo (Paso 4):
```json
{
  "quiz_answers": {
    "source": "calculadora_pension",
    "ingreso_demandado": 800000,
    "cantidad_hijos": 2,
    "anomalia_legal": false
  },
  "income_value": 800000,
  "children_count": 2,
  "calculated_min": "$215.600",
  "calculated_max": "$400.000",
  "status": "calculo_completado"
}
```

---

## 🔒 Políticas de Seguridad (RLS)

El script configura automáticamente:

- ✅ **INSERT**: Cualquier usuario anónimo puede insertar leads (necesario para la calculadora)
- ✅ **SELECT**: Solo usuarios autenticados pueden leer los leads
- ✅ **UPDATE**: Los usuarios anónimos pueden actualizar sus propios leads (por email)

---

## 🐛 Solución de Problemas

### Error: "relation leads_quiz does not exist"
- **Solución**: Ejecuta el script completo desde el principio

### Error: "permission denied for table leads_quiz"
- **Solución**: Verifica que las políticas RLS estén creadas correctamente. Ejecuta:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'leads_quiz';
  ```

### Error: "column does not exist"
- **Solución**: El script usa `DO $$ BEGIN ... END $$` para agregar columnas solo si no existen. Si aún así falla, ejecuta manualmente:
  ```sql
  ALTER TABLE public.leads_quiz ADD COLUMN [nombre_columna] [tipo];
  ```

---

## 📊 Consultas Útiles para Analizar los Leads

### Ver todos los leads de la calculadora:
```sql
SELECT 
  email,
  status,
  income_value,
  children_count,
  calculated_min,
  calculated_max,
  created_at
FROM public.leads_quiz
WHERE quiz_answers->>'source' = 'calculadora_pension'
ORDER BY created_at DESC;
```

### Contar leads por estado:
```sql
SELECT 
  status,
  COUNT(*) as total
FROM public.leads_quiz
WHERE quiz_answers->>'source' = 'calculadora_pension'
GROUP BY status;
```

### Ver leads completados (con cálculo):
```sql
SELECT 
  email,
  income_value,
  children_count,
  calculated_min,
  calculated_max,
  quiz_answers->>'anomalia_legal' as tiene_anomalia_legal
FROM public.leads_quiz
WHERE status = 'calculo_completado'
ORDER BY created_at DESC;
```

---

## ✅ Checklist Final

- [ ] Script SQL ejecutado sin errores
- [ ] Todas las columnas están presentes (verificar con consulta de verificación)
- [ ] Prueba de inserción funciona correctamente
- [ ] Las políticas RLS están activas
- [ ] Los índices están creados

---

## 🎉 ¡Listo!

Una vez completados estos pasos, la Calculadora de Pensión guardará automáticamente:
- ✅ Email del usuario (cuando lo ingresa)
- ✅ Respuestas del cálculo (ingresos e hijos)
- ✅ Montos calculados (mínimo y máximo)
- ✅ Estado del lead (calculadora_iniciada → calculo_completado)

Los datos estarán disponibles en la tabla `leads_quiz` de Supabase para análisis y seguimiento.
