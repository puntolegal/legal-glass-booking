-- Script para configurar las políticas de Supabase
-- Ejecutar en el SQL Editor de Supabase Dashboard

-- 1. Habilitar RLS en la tabla reservas (si no está habilitado)
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Permitir insertar reservas" ON public.reservas;
DROP POLICY IF EXISTS "Solo admins pueden ver reservas" ON public.reservas;
DROP POLICY IF EXISTS "Solo admins pueden actualizar reservas" ON public.reservas;
DROP POLICY IF EXISTS "Users can view their own reservations" ON public.reservas;
DROP POLICY IF EXISTS "Authenticated users can create reservations" ON public.reservas;
DROP POLICY IF EXISTS "Users can update their own reservations" ON public.reservas;
DROP POLICY IF EXISTS "Users can delete their own reservations" ON public.reservas;

-- 3. Crear políticas más permisivas para permitir reservas públicas
-- Permitir a cualquiera crear reservas (necesario para clientes no autenticados)
CREATE POLICY "Permitir crear reservas públicas" ON public.reservas
    FOR INSERT WITH CHECK (true);

-- Permitir leer reservas solo a usuarios autenticados o por email
CREATE POLICY "Permitir leer reservas por email" ON public.reservas
    FOR SELECT USING (
        auth.jwt() ->> 'email' = cliente_email 
        OR auth.jwt() ->> 'role' = 'admin'
        OR auth.jwt() ->> 'email' = 'puntolegalelgolf@gmail.com'
    );

-- Permitir actualizar reservas solo a admins
CREATE POLICY "Solo admins pueden actualizar reservas" ON public.reservas
    FOR UPDATE USING (
        auth.jwt() ->> 'role' = 'admin'
        OR auth.jwt() ->> 'email' = 'puntolegalelgolf@gmail.com'
    );

-- Permitir eliminar reservas solo a admins
CREATE POLICY "Solo admins pueden eliminar reservas" ON public.reservas
    FOR DELETE USING (
        auth.jwt() ->> 'role' = 'admin'
        OR auth.jwt() ->> 'email' = 'puntolegalelgolf@gmail.com'
    );

-- 4. Crear función para insertar reservas sin autenticación
CREATE OR REPLACE FUNCTION public.create_public_reservation(
    p_cliente_nombre text,
    p_cliente_email text,
    p_cliente_telefono text,
    p_servicio_tipo text,
    p_servicio_precio text,
    p_fecha date,
    p_hora time,
    p_cliente_rut text DEFAULT NULL,
    p_servicio_descripcion text DEFAULT NULL,
    p_timezone text DEFAULT 'America/Santiago',
    p_pago_metodo text DEFAULT 'pendiente',
    p_pago_estado text DEFAULT 'pendiente',
    p_pago_id text DEFAULT NULL,
    p_pago_monto numeric DEFAULT NULL,
    p_estado text DEFAULT 'pendiente',
    p_notas text DEFAULT NULL,
    p_motivo_consulta text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id uuid;
BEGIN
    INSERT INTO public.reservas (
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        cliente_rut,
        servicio_tipo,
        servicio_precio,
        servicio_descripcion,
        fecha,
        hora,
        timezone,
        pago_metodo,
        pago_estado,
        pago_id,
        pago_monto,
        estado,
        notas,
        motivo_consulta
    ) VALUES (
        p_cliente_nombre,
        p_cliente_email,
        p_cliente_telefono,
        p_cliente_rut,
        p_servicio_tipo,
        p_servicio_precio,
        p_servicio_descripcion,
        p_fecha,
        p_hora,
        p_timezone,
        p_pago_metodo,
        p_pago_estado,
        p_pago_id,
        p_pago_monto,
        p_estado,
        p_notas,
        p_motivo_consulta
    ) RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$;

-- 5. Dar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION public.create_public_reservation TO anon;
GRANT EXECUTE ON FUNCTION public.create_public_reservation TO authenticated;

-- 6. Verificar que todo está configurado correctamente
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'reservas';

-- 7. Mostrar las políticas activas
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

-- Comentarios para documentación
COMMENT ON FUNCTION public.create_public_reservation IS 'Función para crear reservas públicas sin autenticación requerida';
COMMENT ON POLICY "Permitir crear reservas públicas" ON public.reservas IS 'Permite a cualquier usuario crear reservas';
COMMENT ON POLICY "Permitir leer reservas por email" ON public.reservas IS 'Permite leer reservas solo al cliente propietario o admins';
