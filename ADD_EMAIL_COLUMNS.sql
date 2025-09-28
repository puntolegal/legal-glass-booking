-- =====================================================
-- AGREGAR COLUMNAS DE TRACKING DE EMAILS
-- =====================================================
-- Este script agrega las columnas necesarias para el tracking de emails

-- PASO 1: Agregar columnas de tracking de emails
-- =====================================================

-- Agregar columna email_enviado para tracking de emails de confirmación
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS email_enviado BOOLEAN DEFAULT FALSE;

-- Agregar columna recordatorio_enviado para tracking de emails de recordatorio
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS recordatorio_enviado BOOLEAN DEFAULT FALSE;

-- Agregar columna webhook_sent para tracking de webhooks
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS webhook_sent BOOLEAN DEFAULT FALSE;

-- Agregar columna email_enviado_at para timestamp de envío
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS email_enviado_at TIMESTAMP WITH TIME ZONE;

-- PASO 2: Verificar que las columnas se agregaron correctamente
-- =====================================================

-- Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND table_schema = 'public'
AND column_name LIKE '%email%' OR column_name LIKE '%webhook%'
ORDER BY ordinal_position;
