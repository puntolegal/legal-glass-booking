-- =====================================================
-- CORRECCIÓN URGENTE DE SEGURIDAD RLS
-- Tabla reservas expuesta públicamente - DATOS SENSIBLES
-- =====================================================

-- ⚠️ PROBLEMA CRÍTICO:
-- La tabla 'reservas' es públicamente accesible y contiene:
-- - Nombres de clientes
-- - Emails personales  
-- - Números de teléfono
-- - RUT (números de identificación nacional)
-- - Información de servicios contratados

-- 🚨 RIESGOS:
-- - Violación de privacidad
-- - Posible robo de identidad
-- - Acoso a clientes
-- - Incumplimiento de normativas de protección de datos

-- =====================================================
-- PASO 1: ELIMINAR POLÍTICAS CONFLICTIVAS
-- =====================================================

-- Deshabilitar RLS temporalmente para poder modificar políticas
ALTER TABLE public.reservas DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes que permiten acceso público
DROP POLICY IF EXISTS "Enable read for all users" ON public.reservas;
DROP POLICY IF EXISTS "Users can only view own reservations" ON public.reservas;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.reservas;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.reservas;
DROP POLICY IF EXISTS "Allow anonymous users to create reservations only" ON public.reservas;
DROP POLICY IF EXISTS "Deny read and update for anonymous users" ON public.reservas;

-- =====================================================
-- PASO 2: HABILITAR RLS
-- =====================================================

-- Habilitar Row Level Security
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 3: CREAR POLÍTICAS SEGURAS
-- =====================================================

-- Política 1: Permitir acceso completo solo al service_role (Edge Functions)
CREATE POLICY "service_role_full_access" ON public.reservas
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Política 2: Permitir a usuarios autenticados solo acceso a sus propias reservas
CREATE POLICY "authenticated_users_own_reservations" ON public.reservas
FOR ALL
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Política 3: Permitir a usuarios anónimos SOLO crear nuevas reservas (no leer ni modificar)
CREATE POLICY "anonymous_users_create_only" ON public.reservas
FOR INSERT
TO anon
WITH CHECK (true);

-- Política 4: EXPLÍCITAMENTE denegar SELECT, UPDATE, DELETE para usuarios anónimos
CREATE POLICY "deny_anon_read_update_delete" ON public.reservas
FOR SELECT, UPDATE, DELETE
TO anon
USING (false);

-- =====================================================
-- PASO 4: VERIFICACIÓN
-- =====================================================

-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'reservas' AND schemaname = 'public';

-- Verificar políticas creadas
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'reservas' AND schemaname = 'public';

-- =====================================================
-- INSTRUCCIONES DE APLICACIÓN:
-- =====================================================

/*
1. Ir a Supabase Dashboard
2. Navegar a: Database > SQL Editor
3. Copiar y pegar este archivo completo
4. Ejecutar el script
5. Verificar que las políticas se crearon correctamente
6. Probar que:
   - Usuarios anónimos NO pueden leer datos
   - Edge Functions SÍ pueden acceder
   - Solo se pueden crear nuevas reservas (no leer existentes)
*/

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================

/*
✅ RLS habilitado en tabla reservas
✅ Acceso público denegado
✅ Solo Edge Functions (service_role) pueden leer/modificar
✅ Usuarios anónimos solo pueden crear reservas
✅ Datos de clientes protegidos
✅ Cumplimiento de normativas de privacidad
*/
