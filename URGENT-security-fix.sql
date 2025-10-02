-- =============================================
-- CORRECCIÓN URGENTE DE SEGURIDAD
-- =============================================
-- PROBLEMA: Datos de clientes expuestos públicamente
-- SOLUCIÓN: Implementar RLS inmediatamente

-- PASO 1: Habilitar RLS en tabla reservas
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "reservas_select_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_insert_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_update_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_delete_policy" ON public.reservas;

-- PASO 3: Crear políticas restrictivas

-- Política para INSERT: Permitir creación de reservas (formulario público)
CREATE POLICY "reservas_insert_policy" ON public.reservas
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Política para SELECT: Solo usuarios autenticados pueden ver sus propias reservas
CREATE POLICY "reservas_select_policy" ON public.reservas
    FOR SELECT
    TO authenticated
    USING (
        auth.jwt() ->> 'email' = email OR
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Política para SELECT: Usuarios anónimos NO pueden ver datos sensibles
CREATE POLICY "reservas_select_anon_policy" ON public.reservas
    FOR SELECT
    TO anon
    USING (false); -- BLOQUEAR completamente el acceso anónimo

-- Política para UPDATE: Solo administradores
CREATE POLICY "reservas_update_policy" ON public.reservas
    FOR UPDATE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- Política para DELETE: Solo administradores
CREATE POLICY "reservas_delete_policy" ON public.reservas
    FOR DELETE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- PASO 4: Verificar que RLS está habilitado
DO $$
DECLARE
    rls_enabled boolean;
BEGIN
    SELECT rowsecurity INTO rls_enabled
    FROM pg_tables 
    WHERE tablename = 'reservas' AND schemaname = 'public';
    
    IF rls_enabled THEN
        RAISE NOTICE '✅ RLS habilitado en tabla reservas';
    ELSE
        RAISE NOTICE '❌ RLS NO habilitado en tabla reservas';
    END IF;
END $$;

-- PASO 5: Verificar políticas creadas
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'reservas'
ORDER BY policyname;

SELECT 'Corrección de seguridad aplicada exitosamente' as resultado;
