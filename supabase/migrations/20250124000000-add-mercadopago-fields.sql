-- Agregar campos necesarios para integración con MercadoPago
-- Archivo: supabase/migrations/20250124000000-add-mercadopago-fields.sql

-- Agregar campos para MercadoPago
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS external_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS preference_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS servicio_categoria VARCHAR(100),
ADD COLUMN IF NOT EXISTS descripcion TEXT;

-- Crear índices para optimizar consultas de MercadoPago
CREATE INDEX IF NOT EXISTS idx_reservas_external_reference ON public.reservas(external_reference);
CREATE INDEX IF NOT EXISTS idx_reservas_preference_id ON public.reservas(preference_id);

-- Agregar comentarios para documentar los nuevos campos
COMMENT ON COLUMN public.reservas.external_reference IS 'Referencia externa de MercadoPago para sincronización';
COMMENT ON COLUMN public.reservas.preference_id IS 'ID de la preferencia de MercadoPago';
COMMENT ON COLUMN public.reservas.servicio_categoria IS 'Categoría del servicio (consulta_general, consulta_especializada, etc.)';
COMMENT ON COLUMN public.reservas.descripcion IS 'Descripción adicional de la consulta';
