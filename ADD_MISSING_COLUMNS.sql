-- =====================================================
-- AGREGAR COLUMNAS FALTANTES A LA TABLA RESERVAS
-- =====================================================
-- Este script agrega las columnas necesarias para el tracking de pagos

-- PASO 1: Agregar columnas faltantes
-- =====================================================

-- Agregar columna external_reference para tracking de MercadoPago
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS external_reference VARCHAR(255);

-- Agregar columna preference_id para tracking de MercadoPago
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS preference_id VARCHAR(255);

-- Agregar columna pago_id para tracking del pago
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS pago_id VARCHAR(255);

-- Agregar columna pago_estado para tracking del estado del pago
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS pago_estado VARCHAR(50);

-- Agregar columna pago_metodo para tracking del método de pago
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS pago_metodo VARCHAR(50);

-- PASO 2: Crear índices para mejorar rendimiento
-- =====================================================

-- Índice para external_reference (usado frecuentemente en búsquedas)
CREATE INDEX IF NOT EXISTS idx_reservas_external_reference 
ON public.reservas(external_reference);

-- Índice para preference_id (usado frecuentemente en búsquedas)
CREATE INDEX IF NOT EXISTS idx_reservas_preference_id 
ON public.reservas(preference_id);

-- Índice para pago_id (usado para tracking de pagos)
CREATE INDEX IF NOT EXISTS idx_reservas_pago_id 
ON public.reservas(pago_id);

-- PASO 3: Verificar que las columnas se agregaron correctamente
-- =====================================================

-- Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar índices creados
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'reservas' 
AND schemaname = 'public';
