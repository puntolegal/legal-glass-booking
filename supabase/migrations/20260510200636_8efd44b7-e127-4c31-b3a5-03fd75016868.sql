-- 1. Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'cliente');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. family_quiz_responses: restrict reads to admins only
DROP POLICY IF EXISTS "Permitir lectura de family_quiz_responses a autenticados" ON public.family_quiz_responses;
CREATE POLICY "Admins can read family quiz responses"
  ON public.family_quiz_responses
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. leads_quiz: remove anon UPDATE; allow only admins to update
DROP POLICY IF EXISTS anon_update_leads_quiz ON public.leads_quiz;
DROP POLICY IF EXISTS "Lanzamiento_Calculadora_Update" ON public.leads_quiz;
DROP POLICY IF EXISTS "Admins can update leads_quiz" ON public.leads_quiz;
CREATE POLICY "Admins can update leads_quiz"
  ON public.leads_quiz
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. apuntes_audits: restrict all operations to admins
DROP POLICY IF EXISTS "Anyone can create audits" ON public.apuntes_audits;
DROP POLICY IF EXISTS "Anyone can delete audits" ON public.apuntes_audits;
DROP POLICY IF EXISTS "Anyone can update audits" ON public.apuntes_audits;
DROP POLICY IF EXISTS "Anyone can view audits" ON public.apuntes_audits;

CREATE POLICY "Admins can view audits"
  ON public.apuntes_audits FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create audits"
  ON public.apuntes_audits FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update audits"
  ON public.apuntes_audits FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete audits"
  ON public.apuntes_audits FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));