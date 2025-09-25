-- Create the profiles table that the application expects
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL UNIQUE,
  nombre text,
  email text,
  telefono text,
  role text NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'abogado', 'cliente')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can see their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles 
FOR SELECT 
USING (auth.uid()::text = user_id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile"
ON public.profiles 
FOR UPDATE 
USING (auth.uid()::text = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();