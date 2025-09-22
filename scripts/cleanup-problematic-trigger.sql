-- Limpiar trigger problemático que usa pg_net
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar trigger
DROP TRIGGER IF EXISTS trg_notify_email_on_paid ON public.reservas;

-- 2. Eliminar función problemática
DROP FUNCTION IF EXISTS public.notify_email_on_paid();

-- 3. Eliminar función de prueba
DROP FUNCTION IF EXISTS public.test_email_trigger(uuid);

-- 4. Eliminar vista de monitoreo
DROP VIEW IF EXISTS public.reservas_with_email_status;

-- 5. Eliminar función de estadísticas
DROP FUNCTION IF EXISTS public.get_email_stats();

-- 6. Verificar que se eliminó correctamente
SELECT 'Trigger eliminado' as status WHERE NOT EXISTS (
  SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notify_email_on_paid'
);

-- 7. Verificar que la función se eliminó
SELECT 'Función eliminada' as status WHERE NOT EXISTS (
  SELECT 1 FROM pg_proc WHERE proname = 'notify_email_on_paid'
);

-- 8. Mostrar mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger problemático eliminado exitosamente';
  RAISE NOTICE '✅ Sistema listo para usar Edge Function directamente';
  RAISE NOTICE '✅ No se requieren extensiones adicionales';
END $$;
