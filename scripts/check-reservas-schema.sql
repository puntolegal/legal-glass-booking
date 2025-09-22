-- Script para verificar la estructura de la tabla reservas
-- Ejecutar en el SQL Editor de Supabase

-- Verificar estructura de la tabla reservas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar si existe la columna categoria
SELECT 
    column_name
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND table_schema = 'public'
AND column_name = 'categoria';
