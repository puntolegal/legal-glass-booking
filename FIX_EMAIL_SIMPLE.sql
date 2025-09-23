-- =============================================
-- CORREGIR VALIDACIÓN DE EMAIL - VERSIÓN SIMPLE
-- =============================================
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase

-- Eliminar la restricción de email existente
ALTER TABLE public.reservas DROP CONSTRAINT IF EXISTS reservas_email_check;

-- Crear una validación más permisiva
ALTER TABLE public.reservas 
ADD CONSTRAINT reservas_email_check 
CHECK (cliente_email ~* '^.+@.+\..+$');

SELECT '✅ Validación de email corregida - ahora acepta cualquier formato válido' as resultado;
