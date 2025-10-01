-- =============================================
-- CORRECCIÓN SIMPLE: CAMPO TELEFONO
-- =============================================
-- Solo ejecuta la corrección esencial

ALTER TABLE public.reservas 
ALTER COLUMN telefono TYPE VARCHAR(50);

-- Verificar el cambio
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND column_name = 'telefono';
