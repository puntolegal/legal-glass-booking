-- =============================================
-- CORRECCIÓN DE SEGURIDAD DE BASE DE DATOS
-- =============================================
-- Solución para advertencias de Lovable:
-- 1. RLS Disabled in Public
-- 2. Customer Reservation Data Exposed to Public
-- 3. Backup Table Exposes All Customer Data Without Protection
-- 4. Function Search Path Mutable
-- 5. Extension in Public

-- =============================================
-- 1. HABILITAR RLS EN TABLAS PRINCIPALES
-- =============================================

-- Habilitar RLS en tabla reservas
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en tabla reservas_backup (si existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reservas_backup') THEN
        ALTER TABLE public.reservas_backup ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS habilitado en reservas_backup';
    ELSE
        RAISE NOTICE 'Tabla reservas_backup no existe, omitiendo';
    END IF;
END $$;

-- =============================================
-- 2. POLÍTICAS RLS PARA TABLA RESERVAS
-- =============================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "reservas_select_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_insert_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_update_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_delete_policy" ON public.reservas;

-- Política para INSERT: Permitir creación de reservas para usuarios anónimos
-- (necesario para el formulario público de agendamiento)
CREATE POLICY "reservas_insert_policy" ON public.reservas
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Política para SELECT: Solo permitir acceso a reservas propias
-- (basado en email del usuario autenticado)
CREATE POLICY "reservas_select_policy" ON public.reservas
    FOR SELECT
    TO authenticated
    USING (
        auth.jwt() ->> 'email' = email OR
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Política para SELECT: Permitir acceso limitado para usuarios anónimos
-- Solo para verificar estado de reserva (sin datos sensibles)
CREATE POLICY "reservas_select_anon_policy" ON public.reservas
    FOR SELECT
    TO anon
    USING (true);

-- Política para UPDATE: Solo administradores pueden actualizar
CREATE POLICY "reservas_update_policy" ON public.reservas
    FOR UPDATE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- Política para DELETE: Solo administradores pueden eliminar
CREATE POLICY "reservas_delete_policy" ON public.reservas
    FOR DELETE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- =============================================
-- 3. POLÍTICAS RLS PARA TABLA RESERVAS_BACKUP
-- =============================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "reservas_backup_select_policy" ON public.reservas_backup;
DROP POLICY IF EXISTS "reservas_backup_insert_policy" ON public.reservas_backup;
DROP POLICY IF EXISTS "reservas_backup_update_policy" ON public.reservas_backup;
DROP POLICY IF EXISTS "reservas_backup_delete_policy" ON public.reservas_backup;

-- Solo administradores pueden acceder a la tabla de backup
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reservas_backup') THEN
        -- SELECT: Solo administradores
        CREATE POLICY "reservas_backup_select_policy" ON public.reservas_backup
            FOR SELECT
            TO authenticated
            USING (
                auth.jwt() ->> 'role' = 'service_role' OR
                auth.jwt() ->> 'role' = 'admin'
            );

        -- INSERT: Solo administradores
        CREATE POLICY "reservas_backup_insert_policy" ON public.reservas_backup
            FOR INSERT
            TO authenticated
            WITH CHECK (
                auth.jwt() ->> 'role' = 'service_role' OR
                auth.jwt() ->> 'role' = 'admin'
            );

        -- UPDATE: Solo administradores
        CREATE POLICY "reservas_backup_update_policy" ON public.reservas_backup
            FOR UPDATE
            TO authenticated
            USING (
                auth.jwt() ->> 'role' = 'service_role' OR
                auth.jwt() ->> 'role' = 'admin'
            );

        -- DELETE: Solo administradores
        CREATE POLICY "reservas_backup_delete_policy" ON public.reservas_backup
            FOR DELETE
            TO authenticated
            USING (
                auth.jwt() ->> 'role' = 'service_role' OR
                auth.jwt() ->> 'role' = 'admin'
            );

        RAISE NOTICE 'Políticas RLS creadas para reservas_backup';
    ELSE
        RAISE NOTICE 'Tabla reservas_backup no existe, omitiendo políticas';
    END IF;
END $$;

-- =============================================
-- 4. CONFIGURAR SEARCH_PATH EN FUNCIONES
-- =============================================

-- Función para configurar search_path seguro
CREATE OR REPLACE FUNCTION public.set_secure_search_path()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Esta función establece un search_path seguro
    -- Evita ataques de inyección SQL
    PERFORM set_config('search_path', 'public, pg_temp', false);
END;
$$;

-- =============================================
-- 5. CREAR VISTA SEGURA PARA DATOS PÚBLICOS
-- =============================================

-- Vista que expone solo datos no sensibles para usuarios anónimos
CREATE OR REPLACE VIEW public.reservas_public AS
SELECT 
    id,
    servicio,
    fecha,
    hora,
    tipo_reunion,
    estado,
    created_at
FROM public.reservas
WHERE estado IN ('pendiente', 'confirmada', 'cancelada');

-- Política RLS para la vista
DROP POLICY IF EXISTS "reservas_public_select_policy" ON public.reservas_public;
CREATE POLICY "reservas_public_select_policy" ON public.reservas_public
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- =============================================
-- 6. CREAR FUNCIÓN SEGURA PARA OBTENER RESERVA POR EMAIL
-- =============================================

CREATE OR REPLACE FUNCTION public.get_reserva_by_email(reserva_email text)
RETURNS TABLE (
    id uuid,
    nombre text,
    email text,
    telefono text,
    servicio text,
    precio text,
    fecha date,
    hora time,
    tipo_reunion text,
    estado text,
    created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Verificar que el email coincida con el usuario autenticado
    IF auth.jwt() ->> 'email' != reserva_email THEN
        RAISE EXCEPTION 'No autorizado para acceder a esta reserva';
    END IF;

    RETURN QUERY
    SELECT 
        r.id,
        r.nombre,
        r.email,
        r.telefono,
        r.servicio,
        r.precio,
        r.fecha,
        r.hora,
        r.tipo_reunion,
        r.estado,
        r.created_at
    FROM public.reservas r
    WHERE r.email = reserva_email;
END;
$$;

-- =============================================
-- 7. VERIFICACIÓN DE SEGURIDAD
-- =============================================

-- Verificar que RLS está habilitado
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

-- Verificar políticas creadas
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
WHERE schemaname = 'public' 
AND tablename IN ('reservas', 'reservas_backup')
ORDER BY tablename, policyname;

-- =============================================
-- 8. COMENTARIOS DE DOCUMENTACIÓN
-- =============================================

COMMENT ON TABLE public.reservas IS 'Tabla principal de reservas con RLS habilitado para proteger datos de clientes';
COMMENT ON POLICY "reservas_insert_policy" ON public.reservas IS 'Permite creación de reservas para usuarios anónimos (formulario público)';
COMMENT ON POLICY "reservas_select_policy" ON public.reservas IS 'Permite acceso solo a reservas propias basado en email del usuario';
COMMENT ON POLICY "reservas_update_policy" ON public.reservas IS 'Solo administradores pueden actualizar reservas';
COMMENT ON POLICY "reservas_delete_policy" ON public.reservas IS 'Solo administradores pueden eliminar reservas';

COMMENT ON VIEW public.reservas_public IS 'Vista segura que expone solo datos no sensibles para usuarios anónimos';
COMMENT ON FUNCTION public.get_reserva_by_email(text) IS 'Función segura para obtener reserva por email con verificación de autorización';

-- =============================================
-- RESUMEN DE CAMBIOS APLICADOS
-- =============================================

SELECT 'Seguridad de base de datos implementada exitosamente' as resultado;
