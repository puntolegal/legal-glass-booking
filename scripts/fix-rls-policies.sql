-- Script para corregir las políticas RLS de la tabla reservas
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- 1. Verificar si existe la política de inserción
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'reservas';

-- 2. Eliminar políticas existentes si hay conflictos
DROP POLICY IF EXISTS "Permitir crear reservas públicas" ON public.reservas;
DROP POLICY IF EXISTS "Permitir insertar reservas" ON public.reservas;
DROP POLICY IF EXISTS "Permitir crear reservas" ON public.reservas;

-- 3. Crear política RLS para permitir inserción de reservas
CREATE POLICY "Permitir crear reservas públicas" 
ON public.reservas 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 4. Crear política RLS para permitir lectura de reservas
CREATE POLICY "Permitir leer reservas públicas" 
ON public.reservas 
FOR SELECT 
TO public 
USING (true);

-- 5. Crear política RLS para permitir actualización de reservas
CREATE POLICY "Permitir actualizar reservas públicas" 
ON public.reservas 
FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

-- 6. Verificar que RLS esté habilitado en la tabla
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 7. Verificar las políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'reservas'
ORDER BY policyname;
