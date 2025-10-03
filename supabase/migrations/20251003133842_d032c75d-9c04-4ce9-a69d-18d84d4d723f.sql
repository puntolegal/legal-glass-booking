-- Agregar columnas faltantes para funcionalidad de recordatorios y webhooks
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS recordatorio_enviado BOOLEAN DEFAULT FALSE;

ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS webhook_sent BOOLEAN DEFAULT FALSE;

-- Agregar columna preference_id para MercadoPago
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS preference_id VARCHAR(255);

-- Comentarios
COMMENT ON COLUMN public.reservas.recordatorio_enviado IS 'Indica si se envió recordatorio al cliente';
COMMENT ON COLUMN public.reservas.webhook_sent IS 'Indica si se procesó el webhook de pago';
COMMENT ON COLUMN public.reservas.preference_id IS 'ID de preferencia de MercadoPago';

-- Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_reservas_recordatorio ON public.reservas(recordatorio_enviado);
CREATE INDEX IF NOT EXISTS idx_reservas_webhook ON public.reservas(webhook_sent);