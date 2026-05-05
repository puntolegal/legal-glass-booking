-- RPC de respaldo: copia fecha/hora desde reservas → agendamiento_intakes.
-- Útil si el trigger no corrió (migración pendiente) o como refuerzo desde el cliente tras INSERT.

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
    hora_cita = NULLIF(trim(COALESCE(r.hora::text, '')), '')
  FROM public.reservas r
  WHERE r.id = p_reserva_id
    AND r.agendamiento_intake_id IS NOT NULL
    AND ai.id = r.agendamiento_intake_id;
END;
$$;

COMMENT ON FUNCTION public.apply_intake_cita_from_reserva(uuid) IS
  'Sincroniza fecha_cita/hora_cita del intake enlazado a la reserva (misma lógica que sync_cita_from_reserva_to_intake).';

GRANT EXECUTE ON FUNCTION public.apply_intake_cita_from_reserva(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.apply_intake_cita_from_reserva(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_intake_cita_from_reserva(uuid) TO service_role;
