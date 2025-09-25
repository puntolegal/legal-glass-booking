-- CRITICAL SECURITY FIX: Implement basic secure RLS policies for reservas table

-- First, drop the existing insecure policies
DROP POLICY IF EXISTS "Permitir crear reservas públicas" ON public.reservas;
DROP POLICY IF EXISTS "Permitir leer reservas públicas" ON public.reservas;
DROP POLICY IF EXISTS "Permitir actualizar reservas públicas" ON public.reservas;

-- SECURE POLICY 1: Only authenticated users can see their own reservations
CREATE POLICY "Users can only view own reservations" 
ON public.reservas 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()::text
);

-- SECURE POLICY 2: Only authenticated users can create reservations with their own user_id
CREATE POLICY "Authenticated users can create own reservations" 
ON public.reservas 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()::text
);

-- SECURE POLICY 3: Users can only update their own reservations
CREATE POLICY "Users can only update own reservations" 
ON public.reservas 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()::text
);

-- SECURE POLICY 4: Users can only delete their own reservations
CREATE POLICY "Users can only delete own reservations" 
ON public.reservas 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()::text
);

-- Update existing records to use placeholder user_id (they'll need proper user assignment later)
UPDATE public.reservas SET user_id = 'migration_placeholder' WHERE user_id IS NULL OR user_id = 'anonymous';

-- Make user_id NOT NULL to prevent security bypass
ALTER TABLE public.reservas ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.reservas ALTER COLUMN user_id DROP DEFAULT;