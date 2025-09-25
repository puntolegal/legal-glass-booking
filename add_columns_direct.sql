-- Ejecutar este script directamente en Supabase SQL Editor
-- https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

-- Verificar estructura actual de la tabla reservas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY column_name;

-- Agregar columna categoria
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'consulta';

-- Agregar columna cliente_email
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS cliente_email TEXT;

-- Agregar columna cliente_telefono
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS cliente_telefono TEXT;

-- Agregar columna cliente_nombre
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS cliente_nombre TEXT;

-- Agregar columna servicio_nombre
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS servicio_nombre TEXT;

-- Agregar columna servicio_precio
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS servicio_precio NUMERIC;

-- Agregar columna fecha_agendada
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS fecha_agendada TIMESTAMP WITH TIME ZONE;

-- Agregar columna hora_agendada
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS hora_agendada TEXT;

-- Agregar columna motivo_consulta
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS motivo_consulta TEXT;

-- Agregar columna notas
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS notas TEXT;

-- Agregar columna estado
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente';

-- Agregar columna created_at
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Agregar columna updated_at
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Verificar estructura final de la tabla reservas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY column_name;
