-- SQL CORRECTO PARA PROBAR EL TRIGGER DE EMAILS
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar que el trigger existe
SELECT * FROM pg_trigger WHERE tgname = 'trg_notify_email_on_paid';

-- 2. Verificar que la función existe
SELECT * FROM pg_proc WHERE proname = 'notify_email_on_paid';

-- 3. Verificar estructura de la tabla reservas
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'reservas';

-- 4. Probar el trigger manualmente (INSERTAR RESERVA)
INSERT INTO public.reservas (
  id, 
  cliente_nombre, 
  cliente_email, 
  cliente_telefono, 
  servicio_tipo, 
  servicio_precio, 
  fecha, 
  hora, 
  estado
) VALUES (
  gen_random_uuid(),
  'Test Cliente',
  'benja.soza@gmail.com',
  '+56912345678',
  'Consulta General',
  '35000',
  '2025-01-15',
  '10:00:00',
  'confirmada'
);

-- 5. Verificar que se insertó correctamente
SELECT * FROM public.reservas WHERE cliente_email = 'benja.soza@gmail.com' ORDER BY created_at DESC LIMIT 1;

-- 6. Verificar logs (buscar en Supabase Dashboard → Logs → Database)
-- Buscar mensajes que contengan:
-- - "Sending email notification for reservation ID"
-- - "Email sent successfully for reservation ID"
-- - "Edge Function response"
