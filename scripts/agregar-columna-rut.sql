-- Script para agregar la columna RUT de vuelta a la tabla reservas
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estructura actual de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- 2. Agregar columna RUT
ALTER TABLE reservas 
ADD COLUMN rut VARCHAR(12);

-- 3. Agregar comentario a la columna
COMMENT ON COLUMN reservas.rut IS 'RUT del cliente en formato XX.XXX.XXX-X';

-- 4. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- 5. Actualizar registros existentes con RUT por defecto (opcional)
-- UPDATE reservas SET rut = 'No especificado' WHERE rut IS NULL;
