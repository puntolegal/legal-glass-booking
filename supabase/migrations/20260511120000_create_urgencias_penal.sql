-- Tabla dedicada a fichas del flujo /urgencia (Urgencia penal).
-- Escritura desde el cliente vía RPC SECURITY DEFINER (sin INSERT/UPDATE directo anónimo).

CREATE TABLE IF NOT EXISTS public.urgencias_penal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL UNIQUE,
  email text NOT NULL,
  nombre text,
  telefono text,
  rut_detenido text,
  situacion text,
  unidad_policial text,
  geoloc_status text,
  tiene_antecedentes boolean,
  gravedad_lesiones integer,
  horas_detenido integer,
  is_complejo boolean,
  precio_clp integer,
  lead_score text,
  paso text NOT NULL DEFAULT 'cualificacion',
  riesgo_porcentaje integer,
  user_agent text,
  mercado_pago_iniciado boolean NOT NULL DEFAULT false,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_urgencias_penal_email ON public.urgencias_penal (lower(email));
CREATE INDEX IF NOT EXISTS idx_urgencias_penal_created_at ON public.urgencias_penal (created_at DESC);

COMMENT ON TABLE public.urgencias_penal IS 'Leads y estado del formulario Urgencia penal (/urgencia). Una fila por session_id (navegador).';

CREATE OR REPLACE FUNCTION public.touch_urgencias_penal_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS urgencias_penal_touch_updated ON public.urgencias_penal;
CREATE TRIGGER urgencias_penal_touch_updated
  BEFORE UPDATE ON public.urgencias_penal
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_urgencias_penal_updated_at();

ALTER TABLE public.urgencias_penal ENABLE ROW LEVEL SECURITY;

-- Sin políticas públicas: el anon no lee ni escribe la tabla directamente.

DROP POLICY IF EXISTS "Admins can read urgencias_penal" ON public.urgencias_penal;
CREATE POLICY "Admins can read urgencias_penal"
  ON public.urgencias_penal
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.urgencias_penal FROM PUBLIC;
GRANT ALL ON TABLE public.urgencias_penal TO service_role;

-- Merge por session_id (UUID en sessionStorage del navegador).
CREATE OR REPLACE FUNCTION public.merge_urgencia_penal(p_session_id text, p_row jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_email text;
  v_tiene_ant boolean;
  v_grav int;
  v_horas int;
  v_compl boolean;
  v_precio int;
  v_riesgo int;
BEGIN
  IF p_session_id IS NULL OR length(trim(p_session_id)) < 16 THEN
    RAISE EXCEPTION 'invalid session_id';
  END IF;

  v_email := lower(trim(p_row->>'email'));
  IF v_email IS NULL OR v_email = '' OR position('@' in v_email) < 2 THEN
    RAISE EXCEPTION 'invalid email';
  END IF;

  IF p_row ? 'tiene_antecedentes' AND jsonb_typeof(p_row->'tiene_antecedentes') = 'boolean' THEN
    v_tiene_ant := (p_row->>'tiene_antecedentes')::boolean;
  ELSE
    v_tiene_ant := NULL;
  END IF;

  IF p_row ? 'gravedad_lesiones' AND (p_row->>'gravedad_lesiones') ~ '^[0-9]+$' THEN
    v_grav := (p_row->>'gravedad_lesiones')::int;
  ELSE
    v_grav := NULL;
  END IF;

  IF p_row ? 'horas_detenido' AND (p_row->>'horas_detenido') ~ '^[0-9]+$' THEN
    v_horas := (p_row->>'horas_detenido')::int;
  ELSE
    v_horas := NULL;
  END IF;

  IF p_row ? 'is_complejo' AND jsonb_typeof(p_row->'is_complejo') = 'boolean' THEN
    v_compl := (p_row->>'is_complejo')::boolean;
  ELSE
    v_compl := NULL;
  END IF;

  IF p_row ? 'precio_clp' AND (p_row->>'precio_clp') ~ '^[0-9]+$' THEN
    v_precio := (p_row->>'precio_clp')::int;
  ELSE
    v_precio := NULL;
  END IF;

  IF p_row ? 'riesgo_porcentaje' AND (p_row->>'riesgo_porcentaje') ~ '^[0-9]+$' THEN
    v_riesgo := (p_row->>'riesgo_porcentaje')::int;
  ELSE
    v_riesgo := NULL;
  END IF;

  INSERT INTO public.urgencias_penal (
    session_id,
    email,
    nombre,
    telefono,
    rut_detenido,
    situacion,
    unidad_policial,
    geoloc_status,
    tiene_antecedentes,
    gravedad_lesiones,
    horas_detenido,
    is_complejo,
    precio_clp,
    lead_score,
    paso,
    riesgo_porcentaje,
    user_agent,
    mercado_pago_iniciado,
    extra
  )
  VALUES (
    trim(p_session_id),
    v_email,
    nullif(trim(p_row->>'nombre'), ''),
    nullif(trim(p_row->>'telefono'), ''),
    nullif(trim(p_row->>'rut_detenido'), ''),
    nullif(trim(p_row->>'situacion'), ''),
    nullif(trim(p_row->>'unidad_policial'), ''),
    nullif(trim(p_row->>'geoloc_status'), ''),
    v_tiene_ant,
    v_grav,
    v_horas,
    v_compl,
    v_precio,
    nullif(trim(p_row->>'lead_score'), ''),
    coalesce(nullif(trim(p_row->>'paso'), ''), 'cualificacion'),
    v_riesgo,
    nullif(trim(p_row->>'user_agent'), ''),
    CASE
      WHEN p_row ? 'mercado_pago_iniciado' AND jsonb_typeof(p_row->'mercado_pago_iniciado') = 'boolean'
      THEN (p_row->>'mercado_pago_iniciado')::boolean
      ELSE false
    END,
    CASE
      WHEN p_row ? 'extra' AND jsonb_typeof(p_row->'extra') = 'object' THEN p_row->'extra'
      ELSE '{}'::jsonb
    END
  )
  ON CONFLICT (session_id) DO UPDATE SET
    email = EXCLUDED.email,
    nombre = EXCLUDED.nombre,
    telefono = EXCLUDED.telefono,
    rut_detenido = EXCLUDED.rut_detenido,
    situacion = EXCLUDED.situacion,
    unidad_policial = EXCLUDED.unidad_policial,
    geoloc_status = EXCLUDED.geoloc_status,
    tiene_antecedentes = EXCLUDED.tiene_antecedentes,
    gravedad_lesiones = EXCLUDED.gravedad_lesiones,
    horas_detenido = EXCLUDED.horas_detenido,
    is_complejo = EXCLUDED.is_complejo,
    precio_clp = EXCLUDED.precio_clp,
    lead_score = EXCLUDED.lead_score,
    paso = EXCLUDED.paso,
    riesgo_porcentaje = EXCLUDED.riesgo_porcentaje,
    user_agent = COALESCE(EXCLUDED.user_agent, public.urgencias_penal.user_agent),
    mercado_pago_iniciado = public.urgencias_penal.mercado_pago_iniciado OR EXCLUDED.mercado_pago_iniciado,
    extra = public.urgencias_penal.extra || EXCLUDED.extra,
    updated_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION public.merge_urgencia_penal(text, jsonb) IS 'Upsert ficha urgencia penal por session_id (cliente).';

REVOKE ALL ON FUNCTION public.merge_urgencia_penal(text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_urgencia_penal(text, jsonb) TO anon;
GRANT EXECUTE ON FUNCTION public.merge_urgencia_penal(text, jsonb) TO authenticated;
