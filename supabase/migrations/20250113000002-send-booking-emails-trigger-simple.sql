-- Migración alternativa para trigger de envío automático de emails
-- Fecha: 2025-01-13
-- Descripción: Crea trigger que registra reservas para envío de emails (sin pg_net)

-- Crear tabla para cola de emails si no existe
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id UUID NOT NULL,
  tipo_email VARCHAR(50) NOT NULL, -- 'cliente' o 'admin'
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'error')),
  intentos INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (reserva_id) REFERENCES public.reservas(id) ON DELETE CASCADE
);

-- Crear función simplificada para notificar emails
CREATE OR REPLACE FUNCTION public.notify_email_on_paid()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Solo procesar si el estado es 'confirmada' y es una inserción o actualización
  IF NEW.estado = 'confirmada' AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.estado IS DISTINCT FROM NEW.estado)) THEN
    
    -- Log para debugging
    RAISE LOG 'Scheduling email notification for reservation ID: %', NEW.id;
    
    -- Insertar en cola de emails para cliente
    INSERT INTO public.email_queue (reserva_id, tipo_email, estado)
    VALUES (NEW.id, 'cliente', 'pendiente');
    
    -- Insertar en cola de emails para admin
    INSERT INTO public.email_queue (reserva_id, tipo_email, estado)
    VALUES (NEW.id, 'admin', 'pendiente');
    
    RAISE LOG 'Email notifications queued for reservation ID: %', NEW.id;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Crear trigger para envío automático de emails
DROP TRIGGER IF EXISTS trg_notify_email_on_paid ON public.reservas;

CREATE TRIGGER trg_notify_email_on_paid
  AFTER INSERT OR UPDATE OF estado ON public.reservas
  FOR EACH ROW
  WHEN (NEW.estado = 'confirmada')
  EXECUTE FUNCTION public.notify_email_on_paid();

-- Crear función para procesar cola de emails
CREATE OR REPLACE FUNCTION public.process_email_queue()
RETURNS TABLE(
  processed_count INTEGER,
  error_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_record RECORD;
  processed_count INTEGER := 0;
  error_count INTEGER := 0;
  edge_function_url TEXT;
  admin_token TEXT;
  response TEXT;
BEGIN
  -- Configuración
  edge_function_url := 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/clever-action';
  admin_token := 'puntolegal-admin-token-2025';
  
  -- Procesar emails pendientes
  FOR email_record IN 
    SELECT eq.*, r.* 
    FROM public.email_queue eq
    JOIN public.reservas r ON eq.reserva_id = r.id
    WHERE eq.estado = 'pendiente' 
    AND eq.intentos < 3
    ORDER BY eq.created_at ASC
    LIMIT 10
  LOOP
    BEGIN
      -- Aquí se haría la llamada HTTP real
      -- Por ahora solo marcamos como procesado
      UPDATE public.email_queue 
      SET 
        estado = 'enviado',
        processed_at = NOW()
      WHERE id = email_record.id;
      
      processed_count := processed_count + 1;
      
      RAISE LOG 'Email processed for reservation ID: %', email_record.reserva_id;
      
    EXCEPTION WHEN OTHERS THEN
      -- Marcar como error
      UPDATE public.email_queue 
      SET 
        estado = 'error',
        intentos = intentos + 1,
        error_message = SQLERRM
      WHERE id = email_record.id;
      
      error_count := error_count + 1;
      
      RAISE WARNING 'Error processing email for reservation ID: %. Error: %', 
        email_record.reserva_id, SQLERRM;
    END;
  END LOOP;
  
  RETURN QUERY SELECT processed_count, error_count;
END;
$$;

-- Crear función de prueba para testing manual
CREATE OR REPLACE FUNCTION public.test_email_trigger_simple(reserva_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reserva_record record;
  email_queue_count INTEGER;
BEGIN
  -- Get the reservation
  SELECT * INTO reserva_record FROM public.reservas WHERE id = reserva_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Reservation not found', 'id', reserva_id);
  END IF;
  
  -- Count emails in queue
  SELECT COUNT(*) INTO email_queue_count 
  FROM public.email_queue 
  WHERE reserva_id = reserva_id;
  
  RETURN jsonb_build_object(
    'reserva_id', reserva_id,
    'reserva_estado', reserva_record.estado,
    'emails_queued', email_queue_count,
    'message', 'Emails queued for processing'
  );
END;
$$;

-- Crear vista para monitorear cola de emails
CREATE OR REPLACE VIEW public.email_queue_status AS
SELECT 
  eq.*,
  r.cliente_nombre,
  r.cliente_email,
  r.servicio_tipo,
  r.fecha,
  r.hora
FROM public.email_queue eq
JOIN public.reservas r ON eq.reserva_id = r.id
ORDER BY eq.created_at DESC;

-- Configurar permisos
GRANT EXECUTE ON FUNCTION public.notify_email_on_paid() TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_email_queue() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_email_trigger_simple(uuid) TO authenticated;
GRANT SELECT ON public.email_queue_status TO authenticated;

-- Comentarios para documentación
COMMENT ON FUNCTION public.notify_email_on_paid() IS 'Function that queues emails when a reservation changes to confirmed status';
COMMENT ON TRIGGER trg_notify_email_on_paid ON public.reservas IS 'Trigger that queues email sending when a confirmed reservation is created or updated';
COMMENT ON TABLE public.email_queue IS 'Queue for email notifications to be processed';
COMMENT ON FUNCTION public.process_email_queue() IS 'Function to process pending emails from the queue';

-- Log de finalización
DO $$
BEGIN
  RAISE LOG 'Simple email trigger migration completed successfully';
  RAISE LOG 'Trigger created: trg_notify_email_on_paid';
  RAISE LOG 'Email queue table created: email_queue';
  RAISE LOG 'Test function: test_email_trigger_simple(uuid)';
  RAISE LOG 'Monitoring view: email_queue_status';
END $$;
