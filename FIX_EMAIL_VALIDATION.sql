-- =============================================
-- CORREGIR VALIDACIÓN DE EMAIL
-- =============================================
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase
-- URL: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

-- 1. Eliminar la restricción de email existente
ALTER TABLE public.reservas DROP CONSTRAINT IF EXISTS reservas_email_check;

-- 2. Crear una validación de email más flexible
ALTER TABLE public.reservas 
ADD CONSTRAINT reservas_email_check 
CHECK (cliente_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR cliente_email = '');

-- 3. Verificar que la corrección se aplicó
SELECT '✅ Validación de email corregida exitosamente' as resultado;
