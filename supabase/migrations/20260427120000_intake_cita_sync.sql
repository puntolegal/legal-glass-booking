-- Copia fecha/hora de cita del flujo completo a agendamiento_intakes (vía reservas)
ALTER TABLE public.agendamiento_intakes
  ADD COLUMN IF NOT EXISTS fecha_cita text,
  ADD COLUMN IF NOT EXISTS hora_cita text;

COMMENT ON COLUMN public.agendamiento_intakes.fecha_cita IS 'Fecha acordada al agendar (misma lógica que reservas.fecha), p. ej. YYYY-MM-DD';
COMMENT ON COLUMN public.agendamiento_intakes.hora_cita IS 'Hora acordada (misma que reservas.hora)';

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
    hora_cita = NULLIF(trim(COALESCE(NEW.hora::text, '')), '')
  WHERE id = NEW.agendamiento_intake_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reservas_sync_intake_cita ON public.reservas;
CREATE TRIGGER trg_reservas_sync_intake_cita
  AFTER INSERT OR UPDATE OF fecha, hora, agendamiento_intake_id
  ON public.reservas
  FOR EACH ROW
  WHEN (NEW.agendamiento_intake_id IS NOT NULL)
  EXECUTE FUNCTION public.sync_cita_from_reserva_to_intake();

COMMENT ON FUNCTION public.sync_cita_from_reserva_to_intake() IS 'Mantiene fecha/hora de la cita en el lead (intake) al crear/actualizar la reserva.';
