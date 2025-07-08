-- Script de corrección rápida para Punto Legal
-- Este script evita errores de "already exists"

-- 1. Agregar columnas faltantes a profiles (seguro)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'cliente' CHECK (role IN ('admin', 'abogado', 'cliente')),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 2. Agregar columnas faltantes a reservas (seguro)
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS servicio VARCHAR(255),
ADD COLUMN IF NOT EXISTS precio VARCHAR(50),
ADD COLUMN IF NOT EXISTS categoria VARCHAR(100),
ADD COLUMN IF NOT EXISTS tipo_reunion VARCHAR(50) DEFAULT 'presencial',
ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
ADD COLUMN IF NOT EXISTS recordatorio_enviado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS webhook_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Crear función (reemplazar si existe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Crear trigger para profiles solo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_profiles_updated_at'
    ) THEN
        CREATE TRIGGER update_profiles_updated_at 
            BEFORE UPDATE ON profiles 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 5. Crear trigger para reservas solo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_reservas_updated_at'
    ) THEN
        CREATE TRIGGER update_reservas_updated_at 
            BEFORE UPDATE ON reservas 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 6. Crear tabla notificaciones (seguro)
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

-- 7. Crear algunos índices importantes (seguro)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);

-- 8. Insertar datos de prueba (solo si no existen)
INSERT INTO reservas (
    nombre, rut, email, telefono, fecha, hora, descripcion, 
    servicio, precio, categoria, tipo_reunion, estado
) 
SELECT 
    'Juan Pérez Test', '12345678-9', 'juan.test@puntolegal.cl', '+56912345678',
    CURRENT_DATE + INTERVAL '1 day', '15:00', 'Consulta laboral de prueba',
    'Consulta Laboral', '75000', 'laboral', 'presencial', 'confirmada'
WHERE NOT EXISTS (
    SELECT 1 FROM reservas WHERE email = 'juan.test@puntolegal.cl'
);

-- 9. Verificar que todo está correcto
SELECT 
    'Verificación: Columnas de profiles' as check_type,
    COUNT(*) as count
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('role', 'is_active')

UNION ALL

SELECT 
    'Verificación: Columnas de reservas' as check_type,
    COUNT(*) as count
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND column_name IN ('servicio', 'precio', 'categoria', 'estado')

UNION ALL

SELECT 
    'Verificación: Tabla notificaciones' as check_type,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notificaciones') 
         THEN 1 ELSE 0 END as count

UNION ALL

SELECT 
    'Verificación: Reservas de prueba' as check_type,
    COUNT(*) as count
FROM reservas 
WHERE email LIKE '%test@puntolegal.cl'; 