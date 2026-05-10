-- reservas: drop broad/public policies
DROP POLICY IF EXISTS "Allow public read access for reservations" ON public.reservas;
DROP POLICY IF EXISTS "Allow public update for reservations" ON public.reservas;
DROP POLICY IF EXISTS "Enable update for all users" ON public.reservas;
DROP POLICY IF EXISTS "Allow admin updates only" ON public.reservas;
DROP POLICY IF EXISTS "Allow admin deletes only" ON public.reservas;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.reservas;

-- Keep authenticated SELECT (own email + service_role) — already present as reservas_select_policy
-- Add admin SELECT (via has_role) for staff dashboards
DROP POLICY IF EXISTS "Admins can read reservas" ON public.reservas;
CREATE POLICY "Admins can read reservas"
  ON public.reservas FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin update / delete (in addition to service_role)
DROP POLICY IF EXISTS "Admins can update reservas" ON public.reservas;
CREATE POLICY "Admins can update reservas"
  ON public.reservas FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete reservas" ON public.reservas;
CREATE POLICY "Admins can delete reservas"
  ON public.reservas FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- leads_quiz: remove anon SELECT
DROP POLICY IF EXISTS anon_select_leads_quiz ON public.leads_quiz;
DROP POLICY IF EXISTS "Admins can read leads_quiz" ON public.leads_quiz;
CREATE POLICY "Admins can read leads_quiz"
  ON public.leads_quiz FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Lock down has_role execution: only authenticated/postgres needed
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;