-- Cualificación inmobiliaria + riesgo para embudo / Zapier / Notion
ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS qualification_data JSONB;

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'low';

COMMENT ON COLUMN public.reservas.qualification_data IS 'JSON de micro-cualificación (perfil, tramo UF, comuna, situación legal).';
COMMENT ON COLUMN public.reservas.risk_level IS 'low | medium | high — priorización interna.';

CREATE OR REPLACE FUNCTION public.reservas_set_risk_from_qualification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.qualification_data IS NOT NULL AND jsonb_typeof(NEW.qualification_data) = 'object' THEN
    IF (NEW.qualification_data->>'legal_status') IN ('herencia_pendiente', 'divorcio_en_curso') THEN
      NEW.risk_level := 'high';
    ELSIF (NEW.qualification_data->>'legal_status') = 'hipoteca_vigente' THEN
      IF NEW.risk_level IS NULL OR NEW.risk_level = 'low' THEN
        NEW.risk_level := 'medium';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reservas_qualification_risk ON public.reservas;
CREATE TRIGGER trg_reservas_qualification_risk
  BEFORE INSERT OR UPDATE OF qualification_data
  ON public.reservas
  FOR EACH ROW
  EXECUTE FUNCTION public.reservas_set_risk_from_qualification();

COMMENT ON FUNCTION public.reservas_set_risk_from_qualification() IS 'Ajusta risk_level según legal_status en qualification_data.';
