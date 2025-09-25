-- Script para configurar Row Level Security en la tabla reservas
-- Ejecutar en Supabase SQL Editor

-- Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'reservas';

-- Habilitar RLS en la tabla reservas si no está habilitado
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "Enable insert for all users" ON reservas;
DROP POLICY IF EXISTS "Enable read for all users" ON reservas;
DROP POLICY IF EXISTS "Enable update for all users" ON reservas;

-- Crear política para permitir INSERT a todos los usuarios
CREATE POLICY "Enable insert for all users" ON reservas
    FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Crear política para permitir SELECT a todos los usuarios
CREATE POLICY "Enable read for all users" ON reservas
    FOR SELECT 
    TO public 
    USING (true);

-- Crear política para permitir UPDATE a todos los usuarios
CREATE POLICY "Enable update for all users" ON reservas
    FOR UPDATE 
    TO public 
    USING (true)
    WITH CHECK (true);

-- Verificar las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'reservas';

-- Verificar que RLS esté habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'reservas';
