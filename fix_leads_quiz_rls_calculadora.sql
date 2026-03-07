-- =====================================================
-- REPARACIÓN: Limpieza de RLS y Flexibilización de Tabla leads_quiz
-- =====================================================
-- Este script corrige los problemas de permisos que impiden
-- guardar leads de la Calculadora de Pensión
-- =====================================================

-- 1. Eliminar políticas duplicadas que causan conflicto
DROP POLICY IF EXISTS "Permitir inserción pública" ON public.leads_quiz;
DROP POLICY IF EXISTS "Permitir inserción pública de leads_quiz" ON public.leads_quiz;
DROP POLICY IF EXISTS "Permitir actualización de leads_quiz por email" ON public.leads_quiz;
DROP POLICY IF EXISTS "Lanzamiento_Calculadora_Insert" ON public.leads_quiz;
DROP POLICY IF EXISTS "Lanzamiento_Calculadora_Update" ON public.leads_quiz;

-- 2. Crear políticas limpias y definitivas
CREATE POLICY "Lanzamiento_Calculadora_Insert" 
ON public.leads_quiz 
FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Lanzamiento_Calculadora_Update" 
ON public.leads_quiz 
FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);

-- 3. Hacer que el nombre sea opcional para evitar errores de 'NOT NULL'
-- Primero verificamos si la columna existe y tiene restricción NOT NULL
DO $$ 
BEGIN
  -- Verificar si la columna name tiene restricción NOT NULL
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads_quiz' 
    AND column_name = 'name'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.leads_quiz ALTER COLUMN name DROP NOT NULL;
  END IF;
END $$;

-- 4. Verificar que las políticas estén activas
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
WHERE tablename = 'leads_quiz';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
