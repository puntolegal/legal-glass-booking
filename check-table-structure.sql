-- =============================================
-- VERIFICAR ESTRUCTURA DE LA TABLA RESERVAS
-- =============================================

-- Ver todas las columnas de la tabla reservas
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;
