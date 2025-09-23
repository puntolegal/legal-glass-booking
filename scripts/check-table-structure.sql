-- Verificar la estructura actual de la tabla reservas
-- Ejecutar en el SQL Editor de Supabase

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
