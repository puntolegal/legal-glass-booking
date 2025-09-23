-- =============================================
-- CONFIGURACIÓN DEFINITIVA PARA PRODUCCIÓN
-- =============================================
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase
-- URL: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

-- 1. Eliminar la tabla existente si existe
DROP TABLE IF EXISTS public.reservas CASCADE;

-- 2. Crear la tabla reservas con la estructura que espera el código
CREATE TABLE public.reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Campos que espera el código (nombres con prefijo cliente_)
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(50) NOT NULL,
    cliente_rut VARCHAR(20),
    
    -- Información del servicio
    servicio_tipo VARCHAR(100) NOT NULL,
    servicio_precio VARCHAR(50) NOT NULL,
    servicio_categoria VARCHAR(100),
    servicio_descripcion TEXT,
    
    -- Fecha y hora
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    
    -- Información de pago
    pago_metodo VARCHAR(50) DEFAULT 'pendiente',
    pago_estado VARCHAR(50) DEFAULT 'pendiente',
    pago_id VARCHAR(255),
    pago_monto DECIMAL(10,2),
    
    -- Campos adicionales para MercadoPago
    external_reference VARCHAR(255),
    preference_id VARCHAR(255),
    
    -- Estado de la reserva
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    
    -- Información de reunión
    tipo_reunion VARCHAR(50) DEFAULT 'online',
    
    -- Notas adicionales
    descripcion TEXT,
    motivo_consulta TEXT,
    notas TEXT,
    
    -- Información de seguimiento
    email_enviado BOOLEAN DEFAULT FALSE,
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    webhook_sent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Campo de usuario
    user_id VARCHAR(255),
    
    -- Validación de email
    CONSTRAINT reservas_email_check CHECK (cliente_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 3. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_reservas_cliente_email ON public.reservas(cliente_email);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_pago_estado ON public.reservas(pago_estado);
CREATE INDEX IF NOT EXISTS idx_reservas_created_at ON public.reservas(created_at);
CREATE INDEX IF NOT EXISTS idx_reservas_external_reference ON public.reservas(external_reference);
CREATE INDEX IF NOT EXISTS idx_reservas_preference_id ON public.reservas(preference_id);

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

-- 7. Crear políticas RLS para producción
-- Permitir operaciones públicas para el sistema de reservas
CREATE POLICY "Permitir crear reservas públicas" 
    ON public.reservas 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Permitir leer reservas públicas" 
    ON public.reservas 
    FOR SELECT 
    USING (true);

CREATE POLICY "Permitir actualizar reservas públicas" 
    ON public.reservas 
    FOR UPDATE 
    USING (true);

CREATE POLICY "Permitir eliminar reservas públicas" 
    ON public.reservas 
    FOR DELETE 
    USING (true);

-- 8. Insertar datos de prueba para verificar funcionamiento
INSERT INTO public.reservas (
    cliente_nombre, cliente_email, cliente_telefono, cliente_rut,
    servicio_tipo, servicio_precio, servicio_categoria,
    fecha, hora, descripcion, tipo_reunion, estado
) VALUES 
(
    'Juan Pérez Test',
    'juan.test@puntolegal.cl',
    '+56912345678',
    '12345678-9',
    'Consulta General',
    '35000',
    'General',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'Consulta de prueba - sistema funcionando',
    'online',
    'pendiente'
),
(
    'María González Test',
    'maria.test@puntolegal.cl',
    '+56987654321',
    '98765432-1',
    'Consulta Laboral',
    '40000',
    'Laboral',
    CURRENT_DATE + INTERVAL '2 days',
    '15:30:00',
    'Consulta laboral de prueba',
    'presencial',
    'pendiente'
);

-- 9. Verificar que la tabla se creó correctamente
SELECT '✅ Tabla reservas creada exitosamente para producción' as resultado;
SELECT COUNT(*) as total_reservas FROM public.reservas;
SELECT '🎉 Sistema listo para producción' as estado;
