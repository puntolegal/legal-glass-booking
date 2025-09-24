-- =============================================
-- MIGRACIÓN V2: Actualizar tabla reservas con campos de pago
-- =============================================
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase
-- URL: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

-- 1. Agregar columnas de pago a la tabla existente
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS pago_metodo VARCHAR(50) DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS pago_estado VARCHAR(50) DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS pago_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS pago_monto DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS email_enviado BOOLEAN DEFAULT FALSE;

-- 2. Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_reservas_pago_estado ON public.reservas(pago_estado);
CREATE INDEX IF NOT EXISTS idx_reservas_pago_id ON public.reservas(pago_id);
CREATE INDEX IF NOT EXISTS idx_reservas_email_enviado ON public.reservas(email_enviado);

-- 3. Actualizar comentarios
COMMENT ON COLUMN public.reservas.pago_metodo IS 'Método de pago utilizado';
COMMENT ON COLUMN public.reservas.pago_estado IS 'Estado del pago';
COMMENT ON COLUMN public.reservas.pago_id IS 'ID del pago en MercadoPago';
COMMENT ON COLUMN public.reservas.pago_monto IS 'Monto del pago';
COMMENT ON COLUMN public.reservas.email_enviado IS 'Indica si se envió email de confirmación';

-- 4. Verificar que las columnas se agregaron correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Insertar un registro de prueba con campos de pago
INSERT INTO public.reservas (
    cliente_nombre, cliente_rut, cliente_email, cliente_telefono,
    fecha, hora, descripcion, servicio_tipo, servicio_precio,
    servicio_categoria, tipo_reunion, estado, pago_metodo, pago_estado, pago_id, pago_monto
) VALUES (
    'Usuario de Prueba V2', '12345678-9', 'prueba@ejemplo.com', '+56912345678',
    '2025-09-23', '10:00', 'Consulta de prueba con campos de pago',
    'Consulta General', 1000.00, 'General', 'online', 'pendiente',
    'mercadopago', 'pendiente', 'test-payment-123', 1000.00
);

-- 6. Verificar el registro de prueba
SELECT * FROM public.reservas WHERE cliente_nombre = 'Usuario de Prueba V2';

-- 7. Limpiar el registro de prueba
DELETE FROM public.reservas WHERE cliente_nombre = 'Usuario de Prueba V2';

-- =============================================
-- MIGRACIÓN V2 COMPLETADA
-- =============================================
-- La tabla reservas ahora incluye todos los campos necesarios para el pago
