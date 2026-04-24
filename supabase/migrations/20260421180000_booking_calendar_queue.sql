-- Cola Zapier → Calendar/Meet antes del correo de confirmación (Resend vía clever-action)
-- Idempotente: solo añade columnas si no existen.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reservas' AND column_name = 'google_meet_link'
  ) THEN
    ALTER TABLE public.reservas ADD COLUMN google_meet_link TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reservas' AND column_name = 'google_calendar_event_id'
  ) THEN
    ALTER TABLE public.reservas ADD COLUMN google_calendar_event_id TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reservas' AND column_name = 'google_calendar_html_link'
  ) THEN
    ALTER TABLE public.reservas ADD COLUMN google_calendar_html_link TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reservas' AND column_name = 'confirmation_email_status'
  ) THEN
    ALTER TABLE public.reservas ADD COLUMN confirmation_email_status TEXT;
    COMMENT ON COLUMN public.reservas.confirmation_email_status IS 'pending_calendar: esperando Zapier/Meet; sent: correo enviado; failed: error antes de enviar';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reservas' AND column_name = 'calendar_sync_requested_at'
  ) THEN
    ALTER TABLE public.reservas ADD COLUMN calendar_sync_requested_at TIMESTAMPTZ;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reservas' AND column_name = 'calendar_sync_completed_at'
  ) THEN
    ALTER TABLE public.reservas ADD COLUMN calendar_sync_completed_at TIMESTAMPTZ;
  END IF;
END $$;
