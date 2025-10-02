-- CORRECCIÓN SIMPLE DE SEGURIDAD
-- Ejecutar paso a paso en Supabase SQL Editor

-- PASO 1: Habilitar RLS
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar políticas existentes
DROP POLICY IF EXISTS "reservas_select_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_insert_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_update_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_delete_policy" ON public.reservas;

-- PASO 3: Crear política para INSERT (formulario público)
CREATE POLICY "reservas_insert_policy" ON public.reservas
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- PASO 4: Crear política para SELECT (solo usuarios autenticados)
CREATE POLICY "reservas_select_policy" ON public.reservas
    FOR SELECT
    TO authenticated
    USING (
        auth.jwt() ->> 'email' = email OR
        auth.jwt() ->> 'role' = 'service_role'
    );

-- PASO 5: Bloquear SELECT para usuarios anónimos
CREATE POLICY "reservas_select_anon_policy" ON public.reservas
    FOR SELECT
    TO anon
    USING (false);

-- PASO 6: Política para UPDATE (solo administradores)
CREATE POLICY "reservas_update_policy" ON public.reservas
    FOR UPDATE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- PASO 7: Política para DELETE (solo administradores)
CREATE POLICY "reservas_delete_policy" ON public.reservas
    FOR DELETE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'role' = 'admin'
    );
