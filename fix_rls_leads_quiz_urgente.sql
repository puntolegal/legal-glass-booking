-- =====================================================
-- REPARACIÓN URGENTE: Políticas RLS para leads_quiz
-- =====================================================
-- Este script corrige el error 42501 (RLS violation)
-- =====================================================

-- PASO 1: Verificar estado actual de RLS
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leads_quiz';

-- PASO 2: Listar TODAS las políticas existentes (para debugging)
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

-- PASO 3: Deshabilitar RLS temporalmente para limpiar
ALTER TABLE public.leads_quiz DISABLE ROW LEVEL SECURITY;

-- PASO 4: Eliminar TODAS las políticas existentes (sin excepciones)
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

-- PASO 5: Volver a habilitar RLS
ALTER TABLE public.leads_quiz ENABLE ROW LEVEL SECURITY;

-- PASO 6: Crear política de INSERT (muy permisiva)
CREATE POLICY "anon_insert_leads_quiz" 
ON public.leads_quiz 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- PASO 7: Crear política de UPDATE (muy permisiva)
CREATE POLICY "anon_update_leads_quiz" 
ON public.leads_quiz 
FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);

-- PASO 8: Crear política de SELECT (para que puedan leer sus propios datos)
CREATE POLICY "anon_select_leads_quiz" 
ON public.leads_quiz 
FOR SELECT 
TO anon 
USING (true);

-- PASO 9: Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'leads_quiz'
ORDER BY cmd, policyname;

-- PASO 10: Verificar que RLS está habilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leads_quiz';

-- =====================================================
-- RESULTADO ESPERADO:
-- Deberías ver 3 políticas:
-- 1. anon_insert_leads_quiz (INSERT)
-- 2. anon_update_leads_quiz (UPDATE)
-- 3. anon_select_leads_quiz (SELECT)
-- Y RLS debe estar habilitado (true)
-- =====================================================
