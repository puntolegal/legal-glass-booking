-- Migration for automatic email sending trigger
-- Date: 2025-01-13
-- Description: Creates trigger that sends emails automatically when a reservation is created or updated with 'confirmada' status

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
  -- Only process if status is 'confirmada' and it's an insert or update
  IF NEW.estado = 'confirmada' AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.estado IS DISTINCT FROM NEW.estado)) THEN
    
    -- Get project configuration
    -- Note: In production, these values should be configured in Supabase environment variables
    project_ref := 'qrgelocijmwnxcckxbdg'; -- Replace with real project_ref
    edge_function_url := 'https://' || project_ref || '.supabase.co/functions/v1/clever-action';
    admin_token := 'puntolegal-admin-token-2025'; -- Secret token for authorization
    
    -- Log for debugging
    RAISE LOG 'Sending email notification for reservation ID: %', NEW.id;
    
    -- Make HTTP call to Edge Function
    SELECT net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Admin-Token', admin_token
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
  AFTER INSERT OR UPDATE OF estado ON public.reservas
  FOR EACH ROW
  WHEN (NEW.estado = 'confirmada')
  EXECUTE FUNCTION public.notify_email_on_paid();

-- Documentation comments
COMMENT ON FUNCTION public.notify_email_on_paid() IS 'Function that sends emails automatically when a reservation changes to confirmed status';
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
  
  -- Configure URLs
  project_ref := 'qrgelocijmwnxcckxbdg';
  edge_function_url := 'https://' || project_ref || '.supabase.co/functions/v1/clever-action';
  admin_token := 'puntolegal-admin-token-2025';
  
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
  RAISE LOG 'Trigger created: trg_notify_email_on_paid';
  RAISE LOG 'Test function: test_email_trigger(uuid)';
  RAISE LOG 'Monitoring view: reservas_with_email_status';
  RAISE LOG 'Statistics function: get_email_stats()';
END $$;
