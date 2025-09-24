-- =============================================
-- CREAR TABLA RESERVAS - ESTRUCTURA CORRECTA
-- =============================================
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase
-- URL: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

-- 1. Eliminar la tabla existente si existe
DROP TABLE IF EXISTS public.reservas CASCADE;

-- 2. Crear la tabla reservas con la estructura que coincide con los tipos de Supabase
CREATE TABLE public.reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Campos requeridos según los tipos de Supabase
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    rut VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    descripcion TEXT NOT NULL,
    
    -- Campos opcionales
    servicio VARCHAR(255),
    precio VARCHAR(50),
    categoria VARCHAR(100),
    tipo_reunion VARCHAR(50) DEFAULT 'online',
    
    -- Estado de la reserva
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    
    -- Campos de seguimiento
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    webhook_sent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Campo de usuario (opcional)
    user_id VARCHAR(255)
);

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_email ON public.reservas(email);
CREATE INDEX IF NOT EXISTS idx_reservas_created_at ON public.reservas(created_at);

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

-- 8. Insertar datos de prueba
INSERT INTO public.reservas (
    nombre, email, telefono, rut, fecha, hora, descripcion,
    servicio, precio, categoria, tipo_reunion, estado
) VALUES 
(
    'Juan Pérez Test',
    'juan.test@puntolegal.cl',
    '+56912345678',
    '12345678-9',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'Consulta de prueba - sistema funcionando',
    'Consulta General',
    '35000',
    'General',
    'online',
    'pendiente'
),
(
    'María González Test',
    'maria.test@puntolegal.cl',
    '+56987654321',
    '98765432-1',
    CURRENT_DATE + INTERVAL '2 days',
    '15:30:00',
    'Consulta laboral de prueba',
    'Consulta Laboral',
    '40000',
    'Laboral',
    'presencial',
    'pendiente'
);

-- 9. Verificar que la tabla se creó correctamente
SELECT 'Tabla reservas creada exitosamente' as resultado;
SELECT COUNT(*) as total_reservas FROM public.reservas;
