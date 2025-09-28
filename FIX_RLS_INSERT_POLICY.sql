-- =====================================================
-- CORRECCIÓN URGENTE: Política RLS para INSERT de reservas
-- Error: new row violates row-level security policy for table "reservas"
-- =====================================================

-- ⚠️ PROBLEMA IDENTIFICADO:
-- Las políticas RLS están bloqueando la creación de nuevas reservas
-- Error 42501: new row violates row-level security policy

-- 🎯 SOLUCIÓN:
-- Permitir que usuarios anónimos puedan crear reservas (INSERT)
-- pero mantener restricciones para SELECT, UPDATE, DELETE

-- =====================================================
-- PASO 1: VERIFICAR POLÍTICAS ACTUALES
-- =====================================================

-- Verificar políticas existentes
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'reservas' AND schemaname = 'public';

-- =====================================================
-- PASO 2: CORREGIR POLÍTICAS DE INSERT
-- =====================================================

-- Eliminar política de INSERT restrictiva para anon
DROP POLICY IF EXISTS "anonymous_users_create_only" ON public.reservas;

-- Crear nueva política que permita INSERT a usuarios anónimos
CREATE POLICY "allow_anon_insert_reservas" ON public.reservas
FOR INSERT
TO anon
WITH CHECK (true);

-- Verificar que la política de SELECT siga siendo restrictiva
-- (Esta debería estar funcionando correctamente)
DROP POLICY IF EXISTS "deny_anon_select" ON public.reservas;

CREATE POLICY "deny_anon_select" ON public.reservas
FOR SELECT
TO anon
USING (false);

-- =====================================================
-- PASO 3: VERIFICAR POLÍTICAS PARA SERVICE_ROLE
-- =====================================================

-- Asegurar que service_role tenga acceso completo (para Edge Functions)
DROP POLICY IF EXISTS "service_role_full_access" ON public.reservas;

CREATE POLICY "service_role_full_access" ON public.reservas
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =====================================================
-- PASO 4: VERIFICAR POLÍTICAS PARA USUARIOS AUTENTICADOS
-- =====================================================

-- Política para usuarios autenticados (solo sus propias reservas)
DROP POLICY IF EXISTS "authenticated_users_own_reservations" ON public.reservas;

CREATE POLICY "authenticated_users_own_reservations" ON public.reservas
FOR ALL
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- =====================================================
-- PASO 5: VERIFICACIÓN FINAL
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
   - Usuarios anónimos PUEDEN crear reservas (INSERT)
   - Usuarios anónimos NO pueden leer datos (SELECT)
   - Edge Functions SÍ pueden acceder (service_role)
   - Solo se pueden crear nuevas reservas (no leer existentes)
*/

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================

/*
✅ RLS habilitado en tabla reservas
✅ Usuarios anónimos pueden crear reservas (INSERT)
✅ Usuarios anónimos NO pueden leer datos (SELECT)
✅ Solo Edge Functions (service_role) pueden leer/modificar
✅ Usuarios autenticados solo ven sus reservas
✅ Datos de clientes protegidos
✅ Creación de reservas funcionando
*/
