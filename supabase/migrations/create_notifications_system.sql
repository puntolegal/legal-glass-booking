-- Actualizar tabla profiles para incluir rol y estado activo
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'cliente' CHECK (role IN ('admin', 'abogado', 'cliente')),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Actualizar tabla reservas para soportar notificaciones automáticas
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS servicio VARCHAR(255),
ADD COLUMN IF NOT EXISTS precio VARCHAR(50),
ADD COLUMN IF NOT EXISTS categoria VARCHAR(100),
ADD COLUMN IF NOT EXISTS tipo_reunion VARCHAR(50) DEFAULT 'presencial',
ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
ADD COLUMN IF NOT EXISTS recordatorio_enviado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS webhook_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear tabla para notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('nueva_reserva', 'recordatorio', 'comprobante')),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'fallido')),
    intentos INTEGER DEFAULT 0,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    ultimo_error TEXT,
    webhook_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para pagos (futura implementación)
CREATE TABLE IF NOT EXISTS pagos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
    numero_comprobante VARCHAR(100) UNIQUE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    numero_transaccion VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'fallido', 'reembolsado')),
    fecha_pago TIMESTAMP WITH TIME ZONE,
    datos_pago JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para updated_at (solo si no existen)
DO $$
BEGIN
    -- Trigger para profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_profiles_updated_at'
    ) THEN
        CREATE TRIGGER update_profiles_updated_at 
            BEFORE UPDATE ON profiles 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger para reservas
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_reservas_updated_at'
    ) THEN
        CREATE TRIGGER update_reservas_updated_at 
            BEFORE UPDATE ON reservas 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger para notificaciones
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_notificaciones_updated_at'
    ) THEN
        CREATE TRIGGER update_notificaciones_updated_at 
            BEFORE UPDATE ON notificaciones 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger para pagos
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_pagos_updated_at'
    ) THEN
        CREATE TRIGGER update_pagos_updated_at 
            BEFORE UPDATE ON pagos 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_recordatorio ON reservas(recordatorio_enviado, fecha);
CREATE INDEX IF NOT EXISTS idx_notificaciones_reserva ON notificaciones(reserva_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_tipo ON notificaciones(tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_estado ON notificaciones(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_reserva ON pagos(reserva_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado);

-- Crear un usuario administrador por defecto (opcional)
-- Nota: Esto solo funcionará si ya tienes usuarios en auth.users
DO $$
BEGIN
    -- Intentar crear un perfil de admin para el primer usuario
    IF EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
        INSERT INTO profiles (user_id, nombre, email, role, is_active)
        SELECT 
            id as user_id,
            COALESCE(raw_user_meta_data->>'full_name', 'Administrador') as nombre,
            email,
            'admin' as role,
            true as is_active
        FROM auth.users 
        WHERE id NOT IN (SELECT user_id FROM profiles)
        LIMIT 1
        ON CONFLICT (user_id) DO UPDATE SET
            role = 'admin',
            is_active = true;
    END IF;
END $$;

-- Insertar algunos datos de ejemplo para testing
INSERT INTO reservas (
    nombre, rut, email, telefono, fecha, hora, descripcion, 
    servicio, precio, categoria, tipo_reunion, estado
) VALUES 
(
    'Juan Pérez', '12345678-9', 'juan@test.com', '+56912345678',
    CURRENT_DATE + INTERVAL '1 day', '15:00', 'Consulta laboral sobre despido',
    'Consulta Laboral', '75000', 'laboral', 'presencial', 'confirmada'
),
(
    'María González', '98765432-1', 'maria@test.com', '+56987654321',
    CURRENT_DATE + INTERVAL '2 days', '10:30', 'Constitución de sociedad',
    'Constitución Sociedad', '120000', 'corporativo', 'virtual', 'pendiente'
),
(
    'Carlos Rojas', '11111111-1', 'carlos@test.com', '+56911111111',
    CURRENT_DATE + INTERVAL '3 days', '14:00', 'Divorcio mutuo acuerdo',
    'Divorcio Express', '85000', 'familia', 'presencial', 'confirmada'
)
ON CONFLICT DO NOTHING;

-- Habilitar Row Level Security (RLS) para seguridad
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS (solo si no existen)
DO $$
BEGIN
    -- Política para notificaciones
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notificaciones' 
        AND policyname = 'Admin can view all notifications'
    ) THEN
        CREATE POLICY "Admin can view all notifications" ON notificaciones
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.user_id = auth.uid() 
                    AND profiles.role = 'admin'
                )
            );
    END IF;

    -- Política para pagos (view)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'pagos' 
        AND policyname = 'Users can view own payments'
    ) THEN
        CREATE POLICY "Users can view own payments" ON pagos
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM reservas 
                    WHERE reservas.id = pagos.reserva_id 
                    AND reservas.user_id = auth.uid()
                )
                OR EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.user_id = auth.uid() 
                    AND profiles.role IN ('admin', 'abogado')
                )
            );
    END IF;

    -- Política para pagos (admin)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'pagos' 
        AND policyname = 'Admin can manage all payments'
    ) THEN
        CREATE POLICY "Admin can manage all payments" ON pagos
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.user_id = auth.uid() 
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END $$;

-- Comentarios para documentación
COMMENT ON TABLE profiles IS 'Perfiles de usuario con roles y estado activo';
COMMENT ON TABLE notificaciones IS 'Registro de todas las notificaciones enviadas via Make.com';
COMMENT ON TABLE pagos IS 'Gestión de pagos y comprobantes para reservas';
COMMENT ON COLUMN profiles.role IS 'Rol del usuario: admin, abogado, cliente';
COMMENT ON COLUMN profiles.is_active IS 'Indica si el usuario está activo en el sistema';
COMMENT ON COLUMN reservas.recordatorio_enviado IS 'Indica si ya se envió recordatorio 24h antes';
COMMENT ON COLUMN reservas.webhook_sent IS 'Indica si se envió webhook a Make.com exitosamente';
COMMENT ON COLUMN notificaciones.webhook_response IS 'Respuesta completa del webhook de Make.com';
COMMENT ON COLUMN pagos.datos_pago IS 'Metadatos adicionales del procesador de pagos'; 