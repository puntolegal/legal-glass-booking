-- Script para agregar la columna RUT a la tabla reservas en Supabase
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estructura actual de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- 2. Agregar columna RUT
ALTER TABLE reservas 
ADD COLUMN rut VARCHAR(12);

-- 3. Agregar comentario descriptivo
COMMENT ON COLUMN reservas.rut IS 'RUT del cliente en formato XX.XXX.XXX-X';

-- 4. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- 5. Opcional: Actualizar registros existentes con RUT por defecto
-- UPDATE reservas SET rut = 'No especificado' WHERE rut IS NULL;

-- 6. Verificar datos después de la actualización
-- SELECT COUNT(*) as total_reservas, COUNT(rut) as con_rut FROM reservas;
