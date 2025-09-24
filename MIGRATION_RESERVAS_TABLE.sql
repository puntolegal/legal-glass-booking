-- =============================================
-- MIGRACIÓN: Crear tabla reservas con estructura correcta
-- =============================================
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase
-- URL: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

-- 1. Eliminar la tabla existente si existe
DROP TABLE IF EXISTS public.reservas CASCADE;

-- 2. Crear la tabla reservas con la estructura correcta
CREATE TABLE public.reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_rut VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    descripcion TEXT,
    servicio_tipo VARCHAR(100) NOT NULL,
    servicio_precio DECIMAL(10,2) NOT NULL,
    servicio_categoria VARCHAR(50) DEFAULT 'General',
    tipo_reunion VARCHAR(20) DEFAULT 'online',
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    webhook_sent BOOLEAN DEFAULT FALSE,
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id VARCHAR(255) DEFAULT 'anonymous'
);

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX idx_reservas_estado ON public.reservas(estado);
CREATE INDEX idx_reservas_cliente_email ON public.reservas(cliente_email);
CREATE INDEX idx_reservas_created_at ON public.reservas(created_at);

-- 4. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Crear trigger para updated_at
CREATE TRIGGER update_reservas_updated_at 
    BEFORE UPDATE ON public.reservas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar RLS (Row Level Security)
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas RLS para permitir operaciones públicas
CREATE POLICY "Permitir crear reservas públicas" 
    ON public.reservas FOR INSERT TO public 
    WITH CHECK (true);

CREATE POLICY "Permitir leer reservas públicas" 
    ON public.reservas FOR SELECT TO public 
    USING (true);

CREATE POLICY "Permitir actualizar reservas públicas" 
    ON public.reservas FOR UPDATE TO public 
    USING (true) WITH CHECK (true);

CREATE POLICY "Permitir eliminar reservas públicas" 
    ON public.reservas FOR DELETE TO public 
    USING (true);

-- 8. Comentarios en la tabla
COMMENT ON TABLE public.reservas IS 'Tabla para almacenar reservas de consultas legales';
COMMENT ON COLUMN public.reservas.cliente_nombre IS 'Nombre completo del cliente';
COMMENT ON COLUMN public.reservas.cliente_rut IS 'RUT del cliente';
COMMENT ON COLUMN public.reservas.cliente_email IS 'Email del cliente';
COMMENT ON COLUMN public.reservas.cliente_telefono IS 'Teléfono del cliente';
COMMENT ON COLUMN public.reservas.fecha IS 'Fecha de la consulta';
COMMENT ON COLUMN public.reservas.hora IS 'Hora de la consulta';
COMMENT ON COLUMN public.reservas.descripcion IS 'Descripción de la consulta';
COMMENT ON COLUMN public.reservas.servicio_tipo IS 'Tipo de servicio legal';
COMMENT ON COLUMN public.reservas.servicio_precio IS 'Precio del servicio';
COMMENT ON COLUMN public.reservas.servicio_categoria IS 'Categoría del servicio';
COMMENT ON COLUMN public.reservas.tipo_reunion IS 'Tipo de reunión (online/presencial)';
COMMENT ON COLUMN public.reservas.estado IS 'Estado de la reserva';
COMMENT ON COLUMN public.reservas.webhook_sent IS 'Indica si se envió webhook';
COMMENT ON COLUMN public.reservas.recordatorio_enviado IS 'Indica si se envió recordatorio';

-- 9. Insertar un registro de prueba para verificar que todo funciona
INSERT INTO public.reservas (
    cliente_nombre, cliente_rut, cliente_email, cliente_telefono,
    fecha, hora, descripcion, servicio_tipo, servicio_precio,
    servicio_categoria, tipo_reunion, estado
) VALUES (
    'Usuario de Prueba', '12345678-9', 'prueba@ejemplo.com', '+56912345678',
    '2025-09-23', '10:00', 'Consulta de prueba del sistema',
    'Consulta General', 1000.00, 'General', 'online', 'pendiente'
);

-- 10. Verificar que la tabla se creó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 11. Mostrar el registro de prueba
SELECT * FROM public.reservas WHERE cliente_nombre = 'Usuario de Prueba';

-- 12. Limpiar el registro de prueba
DELETE FROM public.reservas WHERE cliente_nombre = 'Usuario de Prueba';

-- =============================================
-- MIGRACIÓN COMPLETADA
-- =============================================
-- La tabla reservas está lista para usar con la estructura correcta
