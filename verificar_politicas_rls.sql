-- =====================================================
-- VERIFICACIÓN: Políticas RLS para leads_quiz
-- =====================================================
-- Ejecuta este script para verificar que las políticas
-- estén correctamente configuradas
-- =====================================================

-- 1. Verificar que RLS está habilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Habilitado'
    ELSE '❌ RLS Deshabilitado'
  END as estado
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leads_quiz';

-- 2. Listar TODAS las políticas existentes
SELECT 
  policyname as "Nombre de Política",
  cmd as "Comando",
  roles as "Roles",
  CASE 
    WHEN qual IS NULL THEN 'Sin restricción'
    ELSE qual::text
  END as "Condición USING",
  CASE 
    WHEN with_check IS NULL THEN 'Sin restricción'
    ELSE with_check::text
  END as "Condición WITH CHECK"
FROM pg_policies 
WHERE tablename = 'leads_quiz'
ORDER BY cmd, policyname;

-- 3. Verificar que existen políticas para INSERT, UPDATE y SELECT
SELECT 
  cmd,
  COUNT(*) as cantidad_politicas,
  STRING_AGG(policyname, ', ') as nombres_politicas
FROM pg_policies 
WHERE tablename = 'leads_quiz'
GROUP BY cmd
ORDER BY cmd;

-- 4. Verificar el constraint de status (ya actualizado)
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.leads_quiz'::regclass
AND conname = 'leads_quiz_status_check';

-- =====================================================
-- RESULTADO ESPERADO:
-- 1. RLS debe estar habilitado (rls_enabled: true)
-- 2. Debe haber 3 políticas:
--    - Una para INSERT (anon_insert_leads_quiz)
--    - Una para UPDATE (anon_update_leads_quiz)
--    - Una para SELECT (anon_select_leads_quiz)
-- 3. Todas deben tener roles = {anon}
-- 4. Constraint de status debe incluir los nuevos valores
-- =====================================================
