-- Script para agregar columnas faltantes a la tabla reservas
-- Ejecutar en Supabase SQL Editor

-- Agregar columna categoria si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'categoria'
    ) THEN
        ALTER TABLE reservas ADD COLUMN categoria TEXT DEFAULT 'consulta';
    END IF;
END $$;

-- Agregar columna cliente_email si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'cliente_email'
    ) THEN
        ALTER TABLE reservas ADD COLUMN cliente_email TEXT;
    END IF;
END $$;

-- Agregar columna cliente_telefono si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'cliente_telefono'
    ) THEN
        ALTER TABLE reservas ADD COLUMN cliente_telefono TEXT;
    END IF;
END $$;

-- Agregar columna cliente_nombre si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'cliente_nombre'
    ) THEN
        ALTER TABLE reservas ADD COLUMN cliente_nombre TEXT;
    END IF;
END $$;

-- Agregar columna servicio_nombre si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'servicio_nombre'
    ) THEN
        ALTER TABLE reservas ADD COLUMN servicio_nombre TEXT;
    END IF;
END $$;

-- Agregar columna servicio_precio si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'servicio_precio'
    ) THEN
        ALTER TABLE reservas ADD COLUMN servicio_precio NUMERIC;
    END IF;
END $$;

-- Agregar columna fecha_agendada si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'fecha_agendada'
    ) THEN
        ALTER TABLE reservas ADD COLUMN fecha_agendada TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Agregar columna hora_agendada si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'hora_agendada'
    ) THEN
        ALTER TABLE reservas ADD COLUMN hora_agendada TEXT;
    END IF;
END $$;

-- Agregar columna motivo_consulta si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'motivo_consulta'
    ) THEN
        ALTER TABLE reservas ADD COLUMN motivo_consulta TEXT;
    END IF;
END $$;

-- Agregar columna notas si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'notas'
    ) THEN
        ALTER TABLE reservas ADD COLUMN notas TEXT;
    END IF;
END $$;

-- Agregar columna estado si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'estado'
    ) THEN
        ALTER TABLE reservas ADD COLUMN estado TEXT DEFAULT 'pendiente';
    END IF;
END $$;

-- Agregar columna created_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE reservas ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Agregar columna updated_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservas' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE reservas ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Verificar que todas las columnas existen
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY column_name;
