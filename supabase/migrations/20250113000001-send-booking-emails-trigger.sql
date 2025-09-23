-- Migration for automatic email sending trigger
-- Date: 2025-01-13
-- Description: Creates trigger that can notify when a payment is approved (safe defaults, no hardcoded secrets)

-- Enable pg_net extension if not enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Check if pg_net is available
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    RAISE WARNING 'pg_net extension not available. Email trigger will not work.';
  END IF;
END $$;

-- Create function to notify email sending
CREATE OR REPLACE FUNCTION public.notify_email_on_paid()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  resp jsonb;
  project_ref text;
  edge_function_url text;
  admin_token text;
BEGIN
  -- Only process if MercadoPago payment is approved
  IF NEW.pago_estado = 'approved' AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND COALESCE(OLD.pago_estado,'') IS DISTINCT FROM COALESCE(NEW.pago_estado,''))) THEN
    
    -- Read configuration from custom settings if present
    -- Set these via: ALTER DATABASE ... SET app.edge_function_url = 'https://...';
    project_ref := current_setting('app.project_ref', true);
    edge_function_url := current_setting('app.edge_function_url', true);
    admin_token := current_setting('app.admin_token', true);
    
    -- If no configuration is present, skip safely
    IF edge_function_url IS NULL OR edge_function_url = '' THEN
      RAISE WARNING 'notify_email_on_paid: edge_function_url not configured; skipping HTTP call.';
      RETURN NEW;
    END IF;
    
    RAISE LOG 'Sending email notification for reservation ID: %', NEW.id;
    
    -- Make HTTP call to Edge Function
    SELECT net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Admin-Token', COALESCE(admin_token, '')
      ),
      body := jsonb_build_object('booking_id', NEW.id)::text
    ) INTO resp;
    
    -- Log the result
    RAISE LOG 'Edge Function response: %', resp;
    
    -- Check if response was successful
    IF resp->>'status_code' = '200' THEN
      RAISE LOG 'Email sent successfully for reservation ID: %', NEW.id;
    ELSE
      RAISE WARNING 'Error sending email for reservation ID: %. Response: %', NEW.id, resp;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic email sending
DROP TRIGGER IF EXISTS trg_notify_email_on_paid ON public.reservas;

CREATE TRIGGER trg_notify_email_on_paid
  AFTER INSERT OR UPDATE OF pago_estado ON public.reservas
  FOR EACH ROW
  WHEN (NEW.pago_estado = 'approved')
  EXECUTE FUNCTION public.notify_email_on_paid();

-- Documentation comments
COMMENT ON FUNCTION public.notify_email_on_paid() IS 'Function that can notify via HTTP when a payment changes to approved status';
COMMENT ON TRIGGER trg_notify_email_on_paid ON public.reservas IS 'Trigger that executes email sending when a confirmed reservation is created or updated';

-- Create test function for manual testing
CREATE OR REPLACE FUNCTION public.test_email_trigger(reserva_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reserva_record record;
  resp jsonb;
  project_ref text;
  edge_function_url text;
  admin_token text;
BEGIN
  -- Get the reservation
  SELECT * INTO reserva_record FROM public.reservas WHERE id = reserva_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Reservation not found', 'id', reserva_id);
  END IF;
  
  -- Read configuration from settings, fallback to NULLs
  project_ref := current_setting('app.project_ref', true);
  edge_function_url := current_setting('app.edge_function_url', true);
  admin_token := current_setting('app.admin_token', true);

  IF edge_function_url IS NULL OR edge_function_url = '' THEN
    RETURN jsonb_build_object(
      'warning', 'edge_function_url not configured; skipping HTTP call',
      'reserva_id', reserva_id,
      'reserva_estado', reserva_record.estado
    );
  END IF;
  
  -- Make HTTP call
  SELECT net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Admin-Token', admin_token
    ),
    body := jsonb_build_object('booking_id', reserva_id)::text
  ) INTO resp;
  
  RETURN jsonb_build_object(
    'reserva_id', reserva_id,
    'reserva_estado', reserva_record.estado,
    'response', resp
  );
END;
$$;

COMMENT ON FUNCTION public.test_email_trigger(uuid) IS 'Test function to send emails manually using an existing reservation';

-- Create view to monitor reservations with emails sent
CREATE OR REPLACE VIEW public.reservas_with_email_status AS
SELECT 
  r.*,
  CASE 
    WHEN r.estado = 'confirmada' THEN 'Email debería haberse enviado'
    ELSE 'Email no enviado'
  END as email_status,
  r.created_at as fecha_creacion,
  r.updated_at as fecha_actualizacion
FROM public.reservas r
ORDER BY r.created_at DESC;

COMMENT ON VIEW public.reservas_with_email_status IS 'View to monitor email sending status of reservations';

-- Create function to get email statistics
CREATE OR REPLACE FUNCTION public.get_email_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_reservas integer;
  reservas_confirmadas integer;
  reservas_pendientes integer;
  reservas_canceladas integer;
BEGIN
  SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE estado = 'confirmada') as confirmadas,
    COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes,
    COUNT(*) FILTER (WHERE estado = 'cancelada') as canceladas
  INTO total_reservas, reservas_confirmadas, reservas_pendientes, reservas_canceladas
  FROM public.reservas;
  
  RETURN jsonb_build_object(
    'total_reservas', total_reservas,
    'reservas_confirmadas', reservas_confirmadas,
    'reservas_pendientes', reservas_pendientes,
    'reservas_canceladas', reservas_canceladas,
    'emails_enviados', reservas_confirmadas,
    'fecha_consulta', NOW()
  );
END;
$$;

COMMENT ON FUNCTION public.get_email_stats() IS 'Function to get reservation and email sending statistics';

-- Configure permissions
GRANT EXECUTE ON FUNCTION public.notify_email_on_paid() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_email_trigger(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_stats() TO authenticated;
GRANT SELECT ON public.reservas_with_email_status TO authenticated;

-- Completion log
DO $$
BEGIN
  RAISE LOG 'Email trigger migration completed successfully';
  RAISE LOG 'Trigger created: trg_notify_email_on_paid (fires on pago_estado = approved)';
  RAISE LOG 'Test function: test_email_trigger(uuid)';
  RAISE LOG 'Monitoring view: reservas_with_email_status';
  RAISE LOG 'Statistics function: get_email_stats()';
END $$;
