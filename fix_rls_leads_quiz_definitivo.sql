-- =====================================================
-- REPARACIÓN DEFINITIVA: Políticas RLS para leads_quiz
-- =====================================================
-- Este script limpia y recrea las políticas RLS para
-- permitir que la Calculadora de Pensión guarde leads
-- =====================================================

-- 1. Deshabilitar y volver a habilitar RLS para limpiar el estado
ALTER TABLE public.leads_quiz DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_quiz ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar cualquier política previa que pueda estar chocando
DROP POLICY IF EXISTS "Lanzamiento_Calculadora_Insert" ON public.leads_quiz;
DROP POLICY IF EXISTS "Permitir inserción pública" ON public.leads_quiz;
DROP POLICY IF EXISTS "Permitir inserción pública de leads_quiz" ON public.leads_quiz;
DROP POLICY IF EXISTS "Lanzamiento_Calculadora_Update" ON public.leads_quiz;
DROP POLICY IF EXISTS "Permitir actualización de leads_quiz por email" ON public.leads_quiz;
DROP POLICY IF EXISTS "Calculadora_Public_Insert" ON public.leads_quiz;
DROP POLICY IF EXISTS "Calculadora_Public_Update" ON public.leads_quiz;

-- 3. Crear la política de INSERCIÓN definitiva para usuarios no registrados (anon)
CREATE POLICY "Calculadora_Public_Insert" 
ON public.leads_quiz 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. Crear la política de ACTUALIZACIÓN (necesaria para el Paso 4 del cálculo)
CREATE POLICY "Calculadora_Public_Update" 
ON public.leads_quiz 
FOR UPDATE 
TO anon 
USING (true);

-- 5. Verificar que las políticas estén creadas correctamente
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
WHERE tablename = 'leads_quiz'
ORDER BY policyname;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
-- Después de ejecutar este script, deberías ver 2 políticas:
-- 1. Calculadora_Public_Insert (INSERT para anon)
-- 2. Calculadora_Public_Update (UPDATE para anon)
-- =====================================================
