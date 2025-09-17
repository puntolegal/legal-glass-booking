-- Migración para agregar rol corporativo y funcionalidades empresariales
-- Fecha: 2025-01-25

-- 1. Actualizar el enum de roles para incluir 'corporativo'
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'corporativo';

-- 2. Agregar columnas adicionales a profiles para empresas
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS tipo_empresa VARCHAR(50) DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS razon_social VARCHAR(255),
ADD COLUMN IF NOT EXISTS rut_empresa VARCHAR(20),
ADD COLUMN IF NOT EXISTS telefono_empresa VARCHAR(20),
ADD COLUMN IF NOT EXISTS direccion_empresa TEXT,
ADD COLUMN IF NOT EXISTS industria VARCHAR(100),
ADD COLUMN IF NOT EXISTS tamano_empresa VARCHAR(50),
ADD COLUMN IF NOT EXISTS fecha_registro_empresa DATE,
ADD COLUMN IF NOT EXISTS plan_suscripcion VARCHAR(50) DEFAULT 'gratis',
ADD COLUMN IF NOT EXISTS fecha_inicio_suscripcion DATE,
ADD COLUMN IF NOT EXISTS fecha_fin_suscripcion DATE,
ADD COLUMN IF NOT EXISTS estado_suscripcion VARCHAR(20) DEFAULT 'activa' CHECK (estado_suscripcion IN ('activa', 'suspendida', 'cancelada'));

-- 3. Crear tabla para causas legales
CREATE TABLE IF NOT EXISTS causas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('laboral', 'comercial', 'tributario', 'dt', 'civil', 'penal')),
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'resuelto', 'apelacion', 'archivado')),
    prioridad VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_proxima_audiencia DATE,
    hora_proxima_audiencia TIME,
    tribunal VARCHAR(255),
    numero_causa VARCHAR(100),
    abogado_asignado UUID REFERENCES profiles(id),
    costo_estimado INTEGER,
    resultado_proyectado VARCHAR(100),
    probabilidad_exito INTEGER CHECK (probabilidad_exito >= 0 AND probabilidad_exito <= 100),
    documentos JSONB,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla para comparendos y audiencias
CREATE TABLE IF NOT EXISTS comparendos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    causa_id UUID REFERENCES causas(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('audiencia', 'comparendo', 'mediacion', 'conciliacion')),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    lugar VARCHAR(255),
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'realizada', 'cancelada', 'pospuesta')),
    resultado TEXT,
    documentos_requeridos TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear tabla para documentos legales
CREATE TABLE IF NOT EXISTS documentos_legales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    causa_id UUID REFERENCES causas(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('contrato', 'amonestacion', 'despido', 'demanda', 'respuesta', 'recurso', 'otro')),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    contenido TEXT,
    archivo_url VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'revisado', 'aprobado', 'enviado')),
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Crear tabla para proyecciones de resultados
CREATE TABLE IF NOT EXISTS proyecciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    causa_id UUID REFERENCES causas(id) ON DELETE CASCADE,
    tipo_proyeccion VARCHAR(50) NOT NULL CHECK (tipo_proyeccion IN ('resultado_juicio', 'tiempo_resolucion', 'costo_total', 'probabilidad_exito')),
    valor_proyectado VARCHAR(100) NOT NULL,
    confianza INTEGER CHECK (confianza >= 0 AND confianza <= 100),
    fundamento TEXT,
    fecha_proyeccion DATE DEFAULT CURRENT_DATE,
    fecha_actualizacion DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Crear tabla para notificaciones empresariales
CREATE TABLE IF NOT EXISTS notificaciones_empresariales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('audiencia_proxima', 'documento_vencido', 'causa_actualizada', 'pago_pendiente', 'sistema')),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    datos_adicionales JSONB
);

-- 8. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_causas_user_id ON causas(user_id);
CREATE INDEX IF NOT EXISTS idx_causas_empresa_id ON causas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_causas_estado ON causas(estado);
CREATE INDEX IF NOT EXISTS idx_causas_tipo ON causas(tipo);
CREATE INDEX IF NOT EXISTS idx_causas_fecha_inicio ON causas(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_comparendos_causa_id ON comparendos(causa_id);
CREATE INDEX IF NOT EXISTS idx_comparendos_fecha ON comparendos(fecha);
CREATE INDEX IF NOT EXISTS idx_documentos_causa_id ON documentos_legales(causa_id);
CREATE INDEX IF NOT EXISTS idx_proyecciones_causa_id ON proyecciones(causa_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_empresa_id ON notificaciones_empresariales(empresa_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones_empresariales(leida);

-- 9. Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Crear triggers para updated_at
CREATE TRIGGER update_causas_updated_at 
    BEFORE UPDATE ON causas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comparendos_updated_at 
    BEFORE UPDATE ON comparendos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documentos_legales_updated_at 
    BEFORE UPDATE ON documentos_legales 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Crear políticas RLS para empresas
ALTER TABLE causas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparendos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_legales ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones_empresariales ENABLE ROW LEVEL SECURITY;

-- Políticas para causas
CREATE POLICY "Empresas pueden ver sus propias causas" ON causas
    FOR SELECT USING (
        auth.uid() = user_id OR 
        empresa_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Empresas pueden crear causas" ON causas
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
    );

CREATE POLICY "Empresas pueden actualizar sus causas" ON causas
    FOR UPDATE USING (
        auth.uid() = user_id
    );

-- Políticas para comparendos
CREATE POLICY "Empresas pueden ver comparendos de sus causas" ON comparendos
    FOR SELECT USING (
        causa_id IN (
            SELECT id FROM causas WHERE user_id = auth.uid()
        )
    );

-- Políticas para documentos
CREATE POLICY "Empresas pueden ver documentos de sus causas" ON documentos_legales
    FOR SELECT USING (
        causa_id IN (
            SELECT id FROM causas WHERE user_id = auth.uid()
        )
    );

-- Políticas para proyecciones
CREATE POLICY "Empresas pueden ver proyecciones de sus causas" ON proyecciones
    FOR SELECT USING (
        causa_id IN (
            SELECT id FROM causas WHERE user_id = auth.uid()
        )
    );

-- Políticas para notificaciones
CREATE POLICY "Empresas pueden ver sus notificaciones" ON notificaciones_empresariales
    FOR SELECT USING (
        empresa_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- 12. Insertar datos de ejemplo para empresas
INSERT INTO profiles (
    user_id, 
    email, 
    role, 
    tipo_empresa, 
    razon_social, 
    rut_empresa, 
    plan_suscripcion,
    estado_suscripcion,
    fecha_inicio_suscripcion
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'empresa@test.com',
    'corporativo',
    'corporativo',
    'Empresa Test SPA',
    '76.123.456-7',
    'premium',
    'activa',
    CURRENT_DATE
) ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    tipo_empresa = EXCLUDED.tipo_empresa,
    razon_social = EXCLUDED.razon_social,
    rut_empresa = EXCLUDED.rut_empresa,
    plan_suscripcion = EXCLUDED.plan_suscripcion,
    estado_suscripcion = EXCLUDED.estado_suscripcion,
    fecha_inicio_suscripcion = EXCLUDED.fecha_inicio_suscripcion;

-- 13. Insertar causas de ejemplo
INSERT INTO causas (
    user_id,
    empresa_id,
    titulo,
    tipo,
    estado,
    prioridad,
    descripcion,
    fecha_inicio,
    fecha_proxima_audiencia,
    tribunal,
    numero_causa,
    costo_estimado,
    resultado_proyectado,
    probabilidad_exito
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'),
    'Causa Laboral - Despido Injustificado',
    'laboral',
    'en_proceso',
    'alta',
    'Causa por despido injustificado de empleado con 5 años de antigüedad',
    '2025-01-10',
    '2025-02-15',
    'Juzgado del Trabajo de Santiago',
    'C-1234-2025',
    2500000,
    'Favorable (85%)',
    85
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'),
    'Comparendo DT - Horas Extra',
    'dt',
    'pendiente',
    'media',
    'Comparendo por incumplimiento en registro de horas extra',
    '2025-01-12',
    '2025-01-25',
    'Inspección del Trabajo',
    'DT-5678-2025',
    800000,
    'Favorable (70%)',
    70
);

-- 14. Insertar comparendos de ejemplo
INSERT INTO comparendos (
    causa_id,
    tipo,
    fecha,
    hora,
    lugar,
    descripcion,
    estado
) VALUES 
(
    (SELECT id FROM causas WHERE numero_causa = 'C-1234-2025'),
    'audiencia',
    '2025-02-15',
    '09:00:00',
    'Juzgado del Trabajo de Santiago, Sala 3',
    'Primera audiencia de conciliación',
    'programada'
),
(
    (SELECT id FROM causas WHERE numero_causa = 'DT-5678-2025'),
    'comparendo',
    '2025-01-25',
    '14:30:00',
    'Inspección del Trabajo, Oficina Central',
    'Comparendo por infracción laboral',
    'programada'
);

-- 15. Insertar documentos de ejemplo
INSERT INTO documentos_legales (
    causa_id,
    tipo,
    titulo,
    descripcion,
    contenido,
    estado
) VALUES 
(
    (SELECT id FROM causas WHERE numero_causa = 'C-1234-2025'),
    'demanda',
    'Demanda por Despido Injustificado',
    'Demanda laboral presentada ante el Juzgado del Trabajo',
    'DEMANDA LABORAL\n\nSeñor Juez del Trabajo de Santiago\n\nPresente demanda por despido injustificado...',
    'aprobado'
),
(
    (SELECT id FROM causas WHERE numero_causa = 'DT-5678-2025'),
    'respuesta',
    'Respuesta al Comparendo DT',
    'Respuesta al comparendo por infracción laboral',
    'RESPUESTA AL COMPARENDO\n\nSeñor Inspector del Trabajo\n\nEn respuesta al comparendo...',
    'revisado'
);

-- 16. Insertar proyecciones de ejemplo
INSERT INTO proyecciones (
    causa_id,
    tipo_proyeccion,
    valor_proyectado,
    confianza,
    fundamento
) VALUES 
(
    (SELECT id FROM causas WHERE numero_causa = 'C-1234-2025'),
    'resultado_juicio',
    'Favorable',
    85,
    'Basado en jurisprudencia similar y evidencia presentada'
),
(
    (SELECT id FROM causas WHERE numero_causa = 'DT-5678-2025'),
    'tiempo_resolucion',
    '3-6 meses',
    70,
    'Tiempo promedio para casos similares en la DT'
);

-- 17. Insertar notificaciones de ejemplo
INSERT INTO notificaciones_empresariales (
    empresa_id,
    tipo,
    titulo,
    mensaje
) VALUES 
(
    (SELECT id FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'),
    'audiencia_proxima',
    'Audiencia Programada',
    'Tienes una audiencia programada para el 15 de febrero de 2025'
),
(
    (SELECT id FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'),
    'documento_vencido',
    'Documento por Vencer',
    'El documento "Respuesta al Comparendo" vence en 3 días'
);

-- 18. Crear función para obtener estadísticas de empresa
CREATE OR REPLACE FUNCTION get_empresa_stats(empresa_user_id UUID)
RETURNS TABLE (
    total_causas INTEGER,
    causas_pendientes INTEGER,
    causas_en_proceso INTEGER,
    causas_resueltas INTEGER,
    proximas_audiencias INTEGER,
    costo_total_estimado BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_causas,
        COUNT(*) FILTER (WHERE estado = 'pendiente')::INTEGER as causas_pendientes,
        COUNT(*) FILTER (WHERE estado = 'en_proceso')::INTEGER as causas_en_proceso,
        COUNT(*) FILTER (WHERE estado = 'resuelto')::INTEGER as causas_resueltas,
        COUNT(*) FILTER (WHERE fecha_proxima_audiencia >= CURRENT_DATE)::INTEGER as proximas_audiencias,
        COALESCE(SUM(costo_estimado), 0) as costo_total_estimado
    FROM causas 
    WHERE user_id = empresa_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 19. Crear función para obtener causas de empresa
CREATE OR REPLACE FUNCTION get_empresa_causas(empresa_user_id UUID)
RETURNS TABLE (
    id UUID,
    titulo VARCHAR(255),
    tipo VARCHAR(50),
    estado VARCHAR(50),
    prioridad VARCHAR(20),
    fecha_inicio DATE,
    fecha_proxima_audiencia DATE,
    tribunal VARCHAR(255),
    numero_causa VARCHAR(100),
    costo_estimado INTEGER,
    resultado_proyectado VARCHAR(100),
    probabilidad_exito INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.titulo,
        c.tipo,
        c.estado,
        c.prioridad,
        c.fecha_inicio,
        c.fecha_proxima_audiencia,
        c.tribunal,
        c.numero_causa,
        c.costo_estimado,
        c.resultado_proyectado,
        c.probabilidad_exito
    FROM causas c
    WHERE c.user_id = empresa_user_id
    ORDER BY c.fecha_inicio DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 20. Crear función para obtener notificaciones de empresa
CREATE OR REPLACE FUNCTION get_empresa_notificaciones(empresa_user_id UUID)
RETURNS TABLE (
    id UUID,
    tipo VARCHAR(50),
    titulo VARCHAR(255),
    mensaje TEXT,
    leida BOOLEAN,
    fecha_envio TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.tipo,
        n.titulo,
        n.mensaje,
        n.leida,
        n.fecha_envio
    FROM notificaciones_empresariales n
    JOIN profiles p ON n.empresa_id = p.id
    WHERE p.user_id = empresa_user_id
    ORDER BY n.fecha_envio DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar que todo se creó correctamente
SELECT 'Migración completada exitosamente' as status; 