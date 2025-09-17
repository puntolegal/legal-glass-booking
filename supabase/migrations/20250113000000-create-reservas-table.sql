-- Crear tabla de reservas para Punto Legal
-- Archivo: supabase/migrations/20250113000000-create-reservas-table.sql

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS public.reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Información del cliente
  cliente_nombre VARCHAR(255) NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,
  cliente_telefono VARCHAR(50) NOT NULL,
  cliente_rut VARCHAR(20),
  
  -- Información del servicio
  servicio_tipo VARCHAR(100) NOT NULL,
  servicio_precio VARCHAR(50) NOT NULL,
  servicio_descripcion TEXT,
  
  -- Fecha y hora
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'America/Santiago',
  
  -- Información de pago
  pago_metodo VARCHAR(50) DEFAULT 'pendiente',
  pago_estado VARCHAR(50) DEFAULT 'pendiente',
  pago_id VARCHAR(255),
  pago_monto DECIMAL(10,2),
  
  -- Estado de la reserva
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
  
  -- Notas adicionales
  notas TEXT,
  motivo_consulta TEXT,
  
  -- Información de seguimiento
  email_enviado BOOLEAN DEFAULT FALSE,
  recordatorio_enviado BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para búsquedas
  CONSTRAINT reservas_email_check CHECK (cliente_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_reservas_cliente_email ON public.reservas(cliente_email);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_pago_estado ON public.reservas(pago_estado);
CREATE INDEX IF NOT EXISTS idx_reservas_created_at ON public.reservas(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_reservas_updated_at 
    BEFORE UPDATE ON public.reservas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Política para permitir insertar reservas (público)
CREATE POLICY "Permitir insertar reservas" ON public.reservas
    FOR INSERT WITH CHECK (true);

-- Política para que solo admins puedan ver todas las reservas
CREATE POLICY "Solo admins pueden ver reservas" ON public.reservas
    FOR SELECT USING (
        auth.jwt() ->> 'email' = 'puntolegalelgolf@gmail.com'
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- Política para que solo admins puedan actualizar reservas
CREATE POLICY "Solo admins pueden actualizar reservas" ON public.reservas
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = 'puntolegalelgolf@gmail.com'
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- Crear vista para estadísticas (opcional)
CREATE OR REPLACE VIEW public.reservas_stats AS
SELECT 
    COUNT(*) as total_reservas,
    COUNT(*) FILTER (WHERE estado = 'confirmada') as confirmadas,
    COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes,
    COUNT(*) FILTER (WHERE pago_estado = 'approved') as pagos_aprobados,
    SUM(CASE WHEN pago_monto IS NOT NULL THEN pago_monto ELSE 0 END) as ingresos_total,
    DATE_TRUNC('month', created_at) as mes
FROM public.reservas
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes DESC;

-- Comentarios para documentación
COMMENT ON TABLE public.reservas IS 'Tabla principal para almacenar reservas de consultas legales';
COMMENT ON COLUMN public.reservas.cliente_email IS 'Email del cliente (requerido para notificaciones)';
COMMENT ON COLUMN public.reservas.pago_estado IS 'Estado del pago: pendiente, approved, rejected, cancelled';
COMMENT ON COLUMN public.reservas.estado IS 'Estado de la reserva: pendiente, confirmada, completada, cancelada';
COMMENT ON COLUMN public.reservas.pago_id IS 'ID del pago desde MercadoPago o Transbank';

-- Insertar datos de ejemplo (opcional, solo para testing)
-- INSERT INTO public.reservas (
--     cliente_nombre, cliente_email, cliente_telefono,
--     servicio_tipo, servicio_precio,
--     fecha, hora,
--     estado
-- ) VALUES (
--     'Juan Pérez', 'juan@example.com', '+56912345678',
--     'Consulta General', '35000',
--     CURRENT_DATE + INTERVAL '7 days', '10:00:00',
--     'pendiente'
-- );
