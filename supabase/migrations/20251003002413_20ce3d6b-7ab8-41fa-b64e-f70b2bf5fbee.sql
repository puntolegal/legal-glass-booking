-- Fix 1: Enable RLS on reservas_backup table
ALTER TABLE public.reservas_backup ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only service role access to backup table
CREATE POLICY "Only service role can access backup"
ON public.reservas_backup
FOR ALL
USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- Fix 2: Update function to set search_path (recreate with SET search_path)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public
SECURITY DEFINER;