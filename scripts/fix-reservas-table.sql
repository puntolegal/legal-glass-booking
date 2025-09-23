-- =============================================
-- CORREGIR TABLA RESERVAS - ESTRUCTURA COMPLETA
-- =============================================
-- Ejecutar este script en el SQL Editor de Supabase
-- URL: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

-- 1. Eliminar la tabla existente si existe
DROP TABLE IF EXISTS public.reservas CASCADE;

-- 2. Crear la tabla reservas con la estructura correcta
CREATE TABLE public.reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información del cliente
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    rut VARCHAR(20) NOT NULL,
    
    -- Información del servicio
    servicio VARCHAR(255) NOT NULL,
    precio VARCHAR(50) NOT NULL,
    
    -- Fecha y hora
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    
    -- Información adicional
    descripcion TEXT,
    tipo_reunion VARCHAR(50) DEFAULT 'online',
    
    -- Estado de la reserva
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    
    -- Campos de seguimiento
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    webhook_sent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Campo de usuario
    user_id VARCHAR(255) DEFAULT 'anonymous'
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
    ON public.reservas FOR INSERT 
    TO public 
    WITH CHECK (true);

CREATE POLICY "Permitir leer reservas públicas" 
    ON public.reservas FOR SELECT 
    TO public 
    USING (true);

CREATE POLICY "Permitir actualizar reservas públicas" 
    ON public.reservas FOR UPDATE 
    TO public 
    USING (true);

-- 8. Verificar que la tabla se creó correctamente
SELECT 'Tabla reservas creada exitosamente' as status;
