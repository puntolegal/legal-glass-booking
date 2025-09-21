-- Migración para trigger de envío automático de emails
-- Fecha: 2025-01-13
-- Descripción: Crea trigger que envía emails automáticamente cuando se crea o actualiza una reserva con estado 'confirmada'

-- Habilitar extensión pg_net si no está habilitada
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Crear función para notificar envío de emails
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
  -- Solo procesar si el estado es 'confirmada' y es una inserción o actualización
  IF NEW.estado = 'confirmada' AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.estado IS DISTINCT FROM NEW.estado)) THEN
    
    -- Obtener configuración del proyecto
    -- Nota: En producción, estos valores deben configurarse en las variables de entorno de Supabase
    project_ref := 'qrgelocijmwnxcckxbdg'; -- Reemplazar con el project_ref real
    edge_function_url := 'https://' || project_ref || '.supabase.co/functions/v1/send-booking-emails';
    admin_token := 'puntolegal-admin-token-2025'; -- Token secreto para autorización
    
    -- Log para debugging
    RAISE LOG 'Enviando notificación de email para reserva ID: %', NEW.id;
    
    -- Hacer llamada HTTP a la Edge Function
    SELECT net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-Admin-Token', admin_token
      ),
      body := jsonb_build_object('booking_id', NEW.id)::text
    ) INTO resp;
    
    -- Log del resultado
    RAISE LOG 'Respuesta de Edge Function: %', resp;
    
    -- Verificar si la respuesta fue exitosa
    IF resp->>'status_code' = '200' THEN
      RAISE LOG 'Email enviado exitosamente para reserva ID: %', NEW.id;
    ELSE
      RAISE WARNING 'Error enviando email para reserva ID: %. Respuesta: %', NEW.id, resp;
    END IF;
    
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

-- Comentarios para documentación
COMMENT ON FUNCTION public.notify_email_on_paid() IS 'Función que envía emails automáticamente cuando una reserva cambia a estado confirmada';
COMMENT ON TRIGGER trg_notify_email_on_paid ON public.reservas IS 'Trigger que ejecuta el envío de emails cuando se crea o actualiza una reserva confirmada';

-- Crear función de prueba para testing manual
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
  -- Obtener la reserva
  SELECT * INTO reserva_record FROM public.reservas WHERE id = reserva_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Reserva no encontrada', 'id', reserva_id);
  END IF;
  
  -- Configurar URLs
  project_ref := 'qrgelocijmwnxcckxbdg';
  edge_function_url := 'https://' || project_ref || '.supabase.co/functions/v1/send-booking-emails';
  admin_token := 'puntolegal-admin-token-2025';
  
  -- Hacer llamada HTTP
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

COMMENT ON FUNCTION public.test_email_trigger(uuid) IS 'Función de prueba para enviar emails manualmente usando una reserva existente';

-- Crear vista para monitorear reservas con emails enviados
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

COMMENT ON VIEW public.reservas_with_email_status IS 'Vista para monitorear el estado de envío de emails de las reservas';

-- Crear función para obtener estadísticas de emails
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

COMMENT ON FUNCTION public.get_email_stats() IS 'Función para obtener estadísticas de reservas y emails enviados';

-- Configurar permisos
GRANT EXECUTE ON FUNCTION public.notify_email_on_paid() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_email_trigger(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_stats() TO authenticated;
GRANT SELECT ON public.reservas_with_email_status TO authenticated;

-- Log de finalización
DO $$
BEGIN
  RAISE LOG 'Migración de trigger de emails completada exitosamente';
  RAISE LOG 'Trigger creado: trg_notify_email_on_paid';
  RAISE LOG 'Función de prueba: test_email_trigger(uuid)';
  RAISE LOG 'Vista de monitoreo: reservas_with_email_status';
  RAISE LOG 'Función de estadísticas: get_email_stats()';
END $$;
