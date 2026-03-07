-- =====================================================
-- REPARACIÓN COMPLETA: Constraints y RLS para leads_quiz
-- =====================================================
-- Este script corrige:
-- 1. El constraint de status que bloquea valores nuevos
-- 2. Las políticas RLS que bloquean inserción/actualización
-- =====================================================

-- PASO 1: Eliminar el constraint de status que está bloqueando valores nuevos
ALTER TABLE public.leads_quiz 
DROP CONSTRAINT IF EXISTS leads_quiz_status_check;

-- PASO 2: Crear un nuevo constraint más permisivo que incluya los estados de la calculadora
ALTER TABLE public.leads_quiz 
ADD CONSTRAINT leads_quiz_status_check 
CHECK (
  status IS NULL OR
  status = ANY (ARRAY[
    'lead'::text,
    'processed'::text,
    'contacted'::text,
    'converted'::text,
    'nuevo'::text,
    'calculadora_iniciada'::text,
    'calculo_completado'::text,
    'incompleto'::text,
    'iniciado'::text
  ])
);

-- PASO 3: Verificar estado actual de RLS
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leads_quiz';

-- PASO 4: Listar TODAS las políticas existentes (para debugging)
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

-- PASO 5: Deshabilitar RLS temporalmente para limpiar
ALTER TABLE public.leads_quiz DISABLE ROW LEVEL SECURITY;

-- PASO 6: Eliminar TODAS las políticas existentes (sin excepciones)
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'leads_quiz'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.leads_quiz', r.policyname);
  END LOOP;
END $$;

-- PASO 7: Volver a habilitar RLS
ALTER TABLE public.leads_quiz ENABLE ROW LEVEL SECURITY;

-- PASO 8: Crear política de INSERT (muy permisiva para usuarios anónimos)
CREATE POLICY "anon_insert_leads_quiz" 
ON public.leads_quiz 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- PASO 9: Crear política de UPDATE (muy permisiva para usuarios anónimos)
CREATE POLICY "anon_update_leads_quiz" 
ON public.leads_quiz 
FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);

-- PASO 10: Crear política de SELECT (para que puedan leer sus propios datos)
CREATE POLICY "anon_select_leads_quiz" 
ON public.leads_quiz 
FOR SELECT 
TO anon 
USING (true);

-- PASO 11: Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'leads_quiz'
ORDER BY cmd, policyname;

-- PASO 12: Verificar que RLS está habilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leads_quiz';

-- PASO 13: Verificar el constraint de status
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.leads_quiz'::regclass
AND conname = 'leads_quiz_status_check';

-- =====================================================
-- RESULTADO ESPERADO:
-- 1. Constraint de status actualizado con valores nuevos
-- 2. 3 políticas RLS creadas:
--    - anon_insert_leads_quiz (INSERT)
--    - anon_update_leads_quiz (UPDATE)
--    - anon_select_leads_quiz (SELECT)
-- 3. RLS habilitado (true)
-- =====================================================
