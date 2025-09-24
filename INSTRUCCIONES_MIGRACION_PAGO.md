# 🚨 INSTRUCCIONES URGENTES - MIGRACIÓN DE CAMPOS DE PAGO

## ❌ PROBLEMA DETECTADO
La tabla `reservas` en Supabase **NO tiene los campos de pago necesarios**:
- `pago_metodo` ❌
- `pago_estado` ❌  
- `pago_id` ❌
- `pago_monto` ❌
- `email_enviado` ❌

## ✅ SOLUCIÓN REQUERIDA

### 1. Ejecutar Migración V2 en Supabase Dashboard

**PASO 1:** Ve al SQL Editor de Supabase
- URL: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

**PASO 2:** Copia y pega este código SQL:

```sql
-- =============================================
-- MIGRACIÓN V2: Actualizar tabla reservas con campos de pago
-- =============================================

-- 1. Agregar columnas de pago a la tabla existente
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS pago_metodo VARCHAR(50) DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS pago_estado VARCHAR(50) DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS pago_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS pago_monto DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS email_enviado BOOLEAN DEFAULT FALSE;

-- 2. Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_reservas_pago_estado ON public.reservas(pago_estado);
CREATE INDEX IF NOT EXISTS idx_reservas_pago_id ON public.reservas(pago_id);
CREATE INDEX IF NOT EXISTS idx_reservas_email_enviado ON public.reservas(email_enviado);

-- 3. Actualizar comentarios
COMMENT ON COLUMN public.reservas.pago_metodo IS 'Método de pago utilizado';
COMMENT ON COLUMN public.reservas.pago_estado IS 'Estado del pago';
COMMENT ON COLUMN public.reservas.pago_id IS 'ID del pago en MercadoPago';
COMMENT ON COLUMN public.reservas.pago_monto IS 'Monto del pago';
COMMENT ON COLUMN public.reservas.email_enviado IS 'Indica si se envió email de confirmación';

-- 4. Verificar que las columnas se agregaron correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

**PASO 3:** Ejecuta el SQL (botón "Run")

### 2. Verificar que la migración funcionó

Después de ejecutar la migración, ejecuta este comando para verificar:

```bash
node scripts/verify-payment-fields.js
```

Deberías ver:
```
✅ pago_metodo: string (pendiente)
✅ pago_estado: string (pendiente)  
✅ pago_id: string (null)
✅ pago_monto: number (0)
✅ email_enviado: boolean (false)
```

## 🎯 RESULTADO ESPERADO

Una vez aplicada la migración:
- ✅ El agendamiento funcionará sin errores
- ✅ Los datos de pago se guardarán correctamente
- ✅ Los emails se enviarán correctamente
- ✅ La página de confirmación mostrará los datos correctos

## ⚠️ IMPORTANTE

**NO continúes con el agendamiento hasta ejecutar esta migración**, ya que seguirás viendo el error:
```
Could not find the 'pago_estado' column of 'reservas' in the schema cache
```

---

**¿Necesitas ayuda?** Una vez que ejecutes la migración, avísame y verificaré que todo esté funcionando correctamente.
