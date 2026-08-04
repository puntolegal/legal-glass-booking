-- 1) Fix mutable search_path on functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_leads_quiz_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_apuntes_audits_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_urgencias_penal_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_note_audit_status(note_id_param text)
RETURNS TABLE(is_audited boolean, auditor_name text, audited_at timestamp with time zone, comments text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  SELECT
    TRUE as is_audited,
    aa.auditor_name,
    aa.audited_at,
    aa.comments
  FROM public.apuntes_audits aa
  WHERE aa.note_id = note_id_param
    AND aa.status = 'audited'
  ORDER BY aa.audited_at DESC
  LIMIT 1;
END;
$$;

-- 2) Revoke EXECUTE on SECURITY DEFINER / internal functions not meant to be called from the client
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.get_note_audit_status(text) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.sync_cita_from_reserva_to_intake() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.touch_urgencias_penal_updated_at() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.update_leads_quiz_updated_at() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.update_apuntes_audits_updated_at() FROM anon, authenticated, public;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_note_audit_status(text) TO service_role;

-- 3) Keep only the RPCs the app actually uses callable, plus service_role
REVOKE ALL ON FUNCTION public.calculadora_track_lead(text, text, text, jsonb, integer, integer, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.calculadora_track_lead(text, text, text, jsonb, integer, integer, text, text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.merge_urgencia_penal(text, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.merge_urgencia_penal(text, jsonb) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.save_intake_schedule(uuid, text, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.save_intake_schedule(uuid, text, text, text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.apply_intake_cita_from_reserva(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.apply_intake_cita_from_reserva(uuid) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.merge_urgencia_penal(text, jsonb) IS 'Unico camino de escritura permitido para public.urgencias_penal (SECURITY DEFINER, valida session_id y email).';

-- 4) Admin read access for agendamiento_intakes
CREATE POLICY "Admins can read agendamiento_intakes"
ON public.agendamiento_intakes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 5) user_roles: keep admin-only management explicit (no self-service role escalation path)
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;