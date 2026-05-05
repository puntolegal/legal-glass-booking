-- Modalidad elegida en agendamiento + persistencia antes del pago + sync desde reservas

ALTER TABLE public.agendamiento_intakes
  ADD COLUMN IF NOT EXISTS tipo_reunion_cita TEXT;

COMMENT ON COLUMN public.agendamiento_intakes.tipo_reunion_cita IS
  'Modalidad elegida (videollamada | telefonica | presencial); se refuerza desde reservas.tipo_reunion al crear la reserva.';

-- Trigger: copiar también tipo_reunion desde la reserva al intake
CREATE OR REPLACE FUNCTION public.sync_cita_from_reserva_to_intake()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.agendamiento_intake_id IS NULL THEN
    RETURN NEW;
  END IF;
  UPDATE public.agendamiento_intakes
  SET
    fecha_cita = NULLIF(trim(COALESCE(NEW.fecha::text, '')), ''),
    hora_cita = NULLIF(trim(COALESCE(NEW.hora::text, '')), ''),
    tipo_reunion_cita = NULLIF(trim(COALESCE(NEW.tipo_reunion::text, '')), '')
  WHERE id = NEW.agendamiento_intake_id;
  RETURN NEW;
END;
$$;

-- RPC existente: misma lógica ampliada
CREATE OR REPLACE FUNCTION public.apply_intake_cita_from_reserva(p_reserva_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.agendamiento_intakes ai
  SET
    fecha_cita = NULLIF(trim(COALESCE(r.fecha::text, '')), ''),
    hora_cita = NULLIF(trim(COALESCE(r.hora::text, '')), ''),
    tipo_reunion_cita = NULLIF(trim(COALESCE(r.tipo_reunion::text, '')), '')
  FROM public.reservas r
  WHERE r.id = p_reserva_id
    AND r.agendamiento_intake_id IS NOT NULL
    AND ai.id = r.agendamiento_intake_id;
END;
$$;

-- Guardar agenda en el lead al terminar paso 2 (antes de Mercado Pago / confirmar)
CREATE OR REPLACE FUNCTION public.save_intake_schedule(
  p_intake_id uuid,
  p_fecha text,
  p_hora text,
  p_tipo_reunion text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.agendamiento_intakes
  SET
    fecha_cita = NULLIF(trim(COALESCE(p_fecha, '')), ''),
    hora_cita = NULLIF(trim(COALESCE(p_hora, '')), ''),
    tipo_reunion_cita = NULLIF(trim(COALESCE(p_tipo_reunion, '')), '')
  WHERE id = p_intake_id;
END;
$$;

COMMENT ON FUNCTION public.save_intake_schedule(uuid, text, text, text) IS
  'Persiste fecha, hora y modalidad en agendamiento_intakes al cerrar agenda (paso 2).';

GRANT EXECUTE ON FUNCTION public.save_intake_schedule(uuid, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.save_intake_schedule(uuid, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_intake_schedule(uuid, text, text, text) TO service_role;
