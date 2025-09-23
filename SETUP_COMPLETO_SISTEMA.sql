-- =====================================================
-- CONFIGURACIÓN COMPLETA DEL SISTEMA DE AGENDAMIENTO
-- Punto Legal - Sistema con Resend
-- =====================================================

-- PASO 1: CREAR TABLA RESERVAS
-- =====================================================

-- Eliminar tabla existente si existe
DROP TABLE IF EXISTS public.reservas CASCADE;

-- Crear tabla reservas con estructura completa
CREATE TABLE public.reservas (
    -- ID y timestamps
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Datos del cliente
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(50) NOT NULL,
    cliente_rut VARCHAR(20),
    cliente_empresa VARCHAR(255),
    
    -- Datos del servicio
    servicio_tipo VARCHAR(255) NOT NULL,
    servicio_precio DECIMAL(10,2) NOT NULL,
    servicio_categoria VARCHAR(100),
    descripcion TEXT,
    
    -- Fecha y hora de la cita
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo_reunion VARCHAR(50) DEFAULT 'online',
    
    -- Datos de pago
    pago_metodo VARCHAR(50) DEFAULT 'pendiente',
    pago_estado VARCHAR(50) DEFAULT 'pendiente',
    pago_id VARCHAR(255),
    pago_monto DECIMAL(10,2),
    external_reference VARCHAR(255),
    preference_id VARCHAR(255),
    
    -- Estado de la reserva
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    
    -- Control de emails
    email_enviado BOOLEAN DEFAULT FALSE,
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    
    -- Metadatos adicionales
    user_id UUID REFERENCES auth.users(id),
    notas TEXT,
    tracking_code VARCHAR(50),
    google_meet_link TEXT
);

-- PASO 2: CREAR ÍNDICES
-- =====================================================

CREATE INDEX idx_reservas_cliente_email ON public.reservas(cliente_email);
CREATE INDEX idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX idx_reservas_estado ON public.reservas(estado);
CREATE INDEX idx_reservas_external_reference ON public.reservas(external_reference);
CREATE INDEX idx_reservas_preference_id ON public.reservas(preference_id);
CREATE INDEX idx_reservas_created_at ON public.reservas(created_at);

-- PASO 3: CONFIGURAR ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de reservas (público)
CREATE POLICY "Permitir inserción de reservas" ON public.reservas
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura de reservas por email del cliente
CREATE POLICY "Permitir lectura por email" ON public.reservas
    FOR SELECT USING (cliente_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para permitir actualización de reservas (admin y cliente)
CREATE POLICY "Permitir actualización de reservas" ON public.reservas
    FOR UPDATE USING (
        cliente_email = current_setting('request.jwt.claims', true)::json->>'email' OR
        current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
    );

-- PASO 4: CREAR FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_reservas_updated_at
    BEFORE UPDATE ON public.reservas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- PASO 5: INSERTAR DATOS DE PRUEBA
-- =====================================================

INSERT INTO public.reservas (
    cliente_nombre, cliente_email, cliente_telefono, cliente_rut,
    servicio_tipo, servicio_precio, servicio_categoria, descripcion,
    fecha, hora, tipo_reunion, pago_metodo, pago_estado, estado
) VALUES 
(
    'Juan Pérez', 'juan.perez@email.com', '+56912345678', '12.345.678-9',
    'Consulta General', 35000.00, 'General', 'Consulta sobre contrato de trabajo',
    '2025-01-25', '10:00:00', 'online', 'mercadopago', 'approved', 'confirmada'
),
(
    'María González', 'maria.gonzalez@email.com', '+56987654321', '98.765.432-1',
    'Consulta Corporativa', 50000.00, 'Corporativo', 'Asesoría para constitución de empresa',
    '2025-01-26', '14:30:00', 'presencial', 'mercadopago', 'pending', 'pendiente'
),
(
    'Carlos Silva', 'carlos.silva@email.com', '+56911223344', '11.222.333-4',
    'Consulta Laboral', 30000.00, 'Laboral', 'Despido injustificado',
    '2025-01-27', '16:00:00', 'online', 'mercadopago', 'approved', 'confirmada'
);

-- PASO 6: CREAR VISTA PARA REPORTES
-- =====================================================

CREATE VIEW public.reservas_summary AS
SELECT 
    id,
    cliente_nombre,
    cliente_email,
    servicio_tipo,
    servicio_precio,
    fecha,
    hora,
    estado,
    pago_estado,
    created_at
FROM public.reservas
ORDER BY created_at DESC;

-- PASO 7: CONFIRMAR CONFIGURACIÓN
-- =====================================================

SELECT '✅ Sistema de agendamiento configurado exitosamente' as status;
SELECT COUNT(*) as total_reservas FROM public.reservas;
SELECT '📧 Configurar variables de Resend en Supabase Dashboard' as next_step;

-- =====================================================
-- VARIABLES DE ENTORNO REQUERIDAS
-- =====================================================

/*
Configurar en Supabase Dashboard → Settings → Configuration → Secrets:

RESEND_API_KEY = re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW
MAIL_FROM = Punto Legal <team@puntolegal.online>
ADMIN_EMAIL = puntolegalelgolf@gmail.com
SUPABASE_URL = https://qrgelocijmwnxcckxbdg.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [tu_service_role_key]
EDGE_ADMIN_TOKEN = puntolegal-admin-token-2025
PROJECT_REF = qrgelocijmwnxcckxbdg
*/
