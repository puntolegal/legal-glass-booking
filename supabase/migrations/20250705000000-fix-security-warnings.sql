-- Fix Security Warnings in Supabase
-- Migration: 20250705000000-fix-security-warnings.sql

-- 1. Fix Function Search Path Mutable Warning
-- Update the update_updated_at_column function to set search_path explicitly
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Fix Auth OTP Long Expiry Warning
-- Update OTP expiry settings to recommended values
-- This requires updating the auth configuration

-- Create a function to update OTP settings
CREATE OR REPLACE FUNCTION public.update_otp_settings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Update OTP expiry to recommended 10 minutes (600 seconds)
  -- Note: This is a placeholder as actual OTP settings are managed through Supabase dashboard
  -- The actual fix should be done through Supabase Auth settings
  RAISE NOTICE 'OTP settings should be updated through Supabase Auth settings in the dashboard';
END;
$$;

-- 3. Add additional security improvements
-- Create a secure function for user profile updates
CREATE OR REPLACE FUNCTION public.update_user_profile(
  user_id UUID,
  nombre TEXT DEFAULT NULL,
  email TEXT DEFAULT NULL,
  telefono TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Validate user_id matches authenticated user
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Unauthorized: Can only update own profile';
  END IF;
  
  -- Update profile
  UPDATE public.profiles 
  SET 
    nombre = COALESCE(update_user_profile.nombre, nombre),
    email = COALESCE(update_user_profile.email, email),
    telefono = COALESCE(update_user_profile.telefono, telefono),
    updated_at = now()
  WHERE profiles.user_id = update_user_profile.user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;
END;
$$;

-- 4. Create secure function for reservation management
CREATE OR REPLACE FUNCTION public.create_secure_reservation(
  servicio TEXT,
  fecha DATE,
  hora TIME,
  modalidad TEXT,
  precio INTEGER,
  estado TEXT DEFAULT 'pendiente'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  reservation_id UUID;
BEGIN
  -- Validate user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Must be authenticated to create reservation';
  END IF;
  
  -- Create reservation
  INSERT INTO public.reservas (
    user_id,
    servicio,
    fecha,
    hora,
    modalidad,
    precio,
    estado,
    created_at,
    updated_at
  ) VALUES (
    auth.uid()::text,
    create_secure_reservation.servicio,
    create_secure_reservation.fecha,
    create_secure_reservation.hora,
    create_secure_reservation.modalidad,
    create_secure_reservation.precio,
    create_secure_reservation.estado,
    now(),
    now()
  ) RETURNING id INTO reservation_id;
  
  RETURN reservation_id;
END;
$$;

-- 5. Add audit logging for security
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles 
  WHERE email IN ('admin@puntolegal.online', 'benjamin@puntolegal.online')
));

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  action TEXT,
  table_name TEXT DEFAULT NULL,
  record_id UUID DEFAULT NULL,
  old_values JSONB DEFAULT NULL,
  new_values JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    log_audit_event.action,
    log_audit_event.table_name,
    log_audit_event.record_id,
    log_audit_event.old_values,
    log_audit_event.new_values,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$;

-- 6. Update existing triggers to use secure functions
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add audit trigger for profiles
CREATE OR REPLACE FUNCTION public.audit_profiles_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      'UPDATE',
      'profiles',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      'INSERT',
      'profiles',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      'DELETE',
      'profiles',
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_profiles_changes();

-- 7. Add security headers and CORS configuration
-- Note: These are typically configured in Supabase dashboard
-- This is a reminder to configure them properly

-- 8. Create secure API endpoints wrapper
CREATE OR REPLACE FUNCTION public.get_user_reservations()
RETURNS TABLE (
  id UUID,
  servicio TEXT,
  fecha DATE,
  hora TIME,
  modalidad TEXT,
  precio INTEGER,
  estado TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Validate user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Must be authenticated';
  END IF;
  
  RETURN QUERY
  SELECT 
    r.id,
    r.servicio,
    r.fecha,
    r.hora,
    r.modalidad,
    r.precio,
    r.estado,
    r.created_at
  FROM public.reservas r
  WHERE r.user_id = auth.uid()::text
  ORDER BY r.created_at DESC;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.update_user_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_secure_reservation(TEXT, DATE, TIME, TEXT, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_reservations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_audit_event(TEXT, TEXT, UUID, JSONB, JSONB) TO authenticated;

-- Revoke unnecessary permissions for security
REVOKE ALL ON public.audit_logs FROM public;
REVOKE ALL ON public.audit_logs FROM authenticated; 