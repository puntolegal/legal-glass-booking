-- =====================================================
-- CORRECCIÓN URGENTE: PERMITIR LECTURA DE RESERVAS PÚBLICAS
-- =====================================================
-- Este script corrige las políticas RLS para permitir que
-- el frontend pueda leer reservas para mostrar confirmaciones

-- PASO 1: Eliminar política restrictiva de SELECT
-- =====================================================
DROP POLICY IF EXISTS "Allow limited public access" ON public.reservas;

-- PASO 2: Crear política que permita lectura pública limitada
-- =====================================================

-- POLÍTICA: Permitir lectura de reservas con user_id migration_placeholder
-- Esto permite que el frontend pueda buscar reservas por external_reference o preference_id
CREATE POLICY "Allow public read access for reservations" 
ON public.reservas 
FOR SELECT 
USING (
  user_id = 'migration_placeholder' -- Permitir leer reservas públicas
);

-- PASO 3: Verificar que las políticas estén correctas
-- =====================================================

-- Listar todas las políticas activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'reservas'
ORDER BY policyname;

-- Verificar que RLS esté habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'reservas';
