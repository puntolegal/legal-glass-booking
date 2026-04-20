-- Captura de datos al completar el paso 1 del agendamiento (antes de fecha/pago)

CREATE TABLE IF NOT EXISTS public.agendamiento_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  rut TEXT,
  empresa TEXT,
  codigo_convenio TEXT,
  descripcion TEXT,
  servicio_slug TEXT,
  servicio_nombre TEXT NOT NULL,
  categoria TEXT,
  precio_indicativo TEXT,
  source_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agendamiento_intakes_email_created
  ON public.agendamiento_intakes (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agendamiento_intakes_created
  ON public.agendamiento_intakes (created_at DESC);

ALTER TABLE public.agendamiento_intakes ENABLE ROW LEVEL SECURITY;

-- Inserción pública desde el formulario de agendamiento (anon + authenticated)
DROP POLICY IF EXISTS "agendamiento_intakes_insert_public" ON public.agendamiento_intakes;
CREATE POLICY "agendamiento_intakes_insert_public"
  ON public.agendamiento_intakes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Lectura restringida al rol de servicio / dashboard (no exposición pública de leads)
DROP POLICY IF EXISTS "agendamiento_intakes_select_none_public" ON public.agendamiento_intakes;
CREATE POLICY "agendamiento_intakes_select_none_public"
  ON public.agendamiento_intakes
  FOR SELECT
  TO anon, authenticated
  USING (false);

COMMENT ON TABLE public.agendamiento_intakes IS 'Datos del paso 1 del agendamiento; enlazados opcionalmente a reservas cuando se confirma la cita.';

-- Vincular reserva al intake (opcional)
ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS agendamiento_intake_id UUID
  REFERENCES public.agendamiento_intakes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reservas_agendamiento_intake
  ON public.reservas (agendamiento_intake_id);

COMMENT ON COLUMN public.reservas.agendamiento_intake_id IS 'Opcional: lead capturado en paso 1 del mismo flujo.';
