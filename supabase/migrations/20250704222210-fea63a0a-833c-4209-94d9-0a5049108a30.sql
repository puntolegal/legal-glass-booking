-- Add user_id column to reservas table
ALTER TABLE public.reservas ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Enable Row Level Security on reservas table
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  role TEXT DEFAULT 'cliente' CHECK (role IN ('admin', 'abogado', 'cliente')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create admin user function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create abogado user function
CREATE OR REPLACE FUNCTION public.is_abogado()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND (role = 'abogado' OR role = 'admin') AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for reservas table
-- Only admins and abogados can view all reservations
CREATE POLICY "Admins and abogados can view all reservations" 
ON public.reservas 
FOR SELECT 
USING (public.is_admin() OR public.is_abogado());

-- Clients can only view their own reservations
CREATE POLICY "Clients can view their own reservations" 
ON public.reservas 
FOR SELECT 
USING (auth.uid() = user_id AND NOT (public.is_admin() OR public.is_abogado()));

-- Only authenticated users can create reservations
CREATE POLICY "Authenticated users can create reservations" 
ON public.reservas 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Only admins and abogados can update any reservation
CREATE POLICY "Admins and abogados can update any reservation" 
ON public.reservas 
FOR UPDATE 
USING (public.is_admin() OR public.is_abogado());

-- Users can update their own reservations (if not admin/abogado)
CREATE POLICY "Users can update their own reservations" 
ON public.reservas 
FOR UPDATE 
USING (auth.uid() = user_id AND NOT (public.is_admin() OR public.is_abogado()));

-- Only admins can delete any reservation
CREATE POLICY "Only admins can delete any reservation" 
ON public.reservas 
FOR DELETE 
USING (public.is_admin());

-- Users can delete their own reservations (if not admin)
CREATE POLICY "Users can delete their own reservations" 
ON public.reservas 
FOR DELETE 
USING (auth.uid() = user_id AND NOT public.is_admin());

-- Create RLS policies for profiles table
-- Only admins can view all profiles
CREATE POLICY "Only admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id AND NOT public.is_admin());

-- Users can create their own profile
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Only admins can update any profile
CREATE POLICY "Only admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin());

-- Users can update their own profile (basic info only)
CREATE POLICY "Users can update their own basic profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id AND NOT public.is_admin());

-- Only admins can delete profiles
CREATE POLICY "Only admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (public.is_admin());

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nombre, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nombre', NEW.raw_user_meta_data ->> 'name'),
    NEW.email,
    'cliente' -- Default role for new users
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (you should change this email and create the user manually)
-- INSERT INTO public.profiles (user_id, nombre, email, role) 
-- VALUES ('your-admin-user-id', 'Administrador', 'admin@puntolegal.cl', 'admin');