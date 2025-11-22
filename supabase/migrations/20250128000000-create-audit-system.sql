-- Migración: Sistema de Auditoría de Apuntes
-- Fecha: 2025-01-28
-- Descripción: Tabla para guardar el estado de auditoría de notas/apuntes

-- Tabla principal de auditorías
CREATE TABLE IF NOT EXISTS public.apuntes_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id TEXT NOT NULL,
  auditor_id TEXT NOT NULL, -- Cambiado a TEXT para usar IDs de localStorage (usr_amanda_legal, usr_benjamin_legal)
  auditor_name TEXT NOT NULL,
  audited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  comments TEXT,
  status TEXT NOT NULL DEFAULT 'audited' CHECK (status IN ('audited', 'pending', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Un auditor solo puede auditar una nota una vez (última auditoría)
  UNIQUE(note_id, auditor_id)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_apuntes_audits_note_id ON public.apuntes_audits(note_id);
CREATE INDEX IF NOT EXISTS idx_apuntes_audits_auditor_id ON public.apuntes_audits(auditor_id);
CREATE INDEX IF NOT EXISTS idx_apuntes_audits_status ON public.apuntes_audits(status);
CREATE INDEX IF NOT EXISTS idx_apuntes_audits_audited_at ON public.apuntes_audits(audited_at DESC);

-- Habilitar RLS
ALTER TABLE public.apuntes_audits ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura a todos (incluyendo usuarios anónimos)
-- Esto permite que la app funcione sin autenticación real de Supabase
CREATE POLICY "Anyone can view audits"
ON public.apuntes_audits
FOR SELECT
USING (true);

-- Política: Permitir inserción a todos (la validación se hace en la app)
-- En producción, puedes restringir esto usando service_role key
CREATE POLICY "Anyone can create audits"
ON public.apuntes_audits
FOR INSERT
WITH CHECK (true);

-- Política: Permitir actualización a todos (la validación se hace en la app)
CREATE POLICY "Anyone can update audits"
ON public.apuntes_audits
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Política: Permitir eliminación a todos (la validación se hace en la app)
CREATE POLICY "Anyone can delete audits"
ON public.apuntes_audits
FOR DELETE
USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_apuntes_audits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_apuntes_audits_updated_at ON public.apuntes_audits;
CREATE TRIGGER update_apuntes_audits_updated_at
BEFORE UPDATE ON public.apuntes_audits
FOR EACH ROW
EXECUTE FUNCTION update_apuntes_audits_updated_at();

-- Función helper para obtener el estado de auditoría de una nota
CREATE OR REPLACE FUNCTION get_note_audit_status(note_id_param TEXT)
RETURNS TABLE (
  is_audited BOOLEAN,
  auditor_name TEXT,
  audited_at TIMESTAMP WITH TIME ZONE,
  comments TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as is_audited,
    aa.auditor_name,
    aa.audited_at,
    aa.comments
  FROM public.apuntes_audits aa
  WHERE aa.note_id = note_id_param
    AND aa.status = 'audited'
  ORDER BY aa.audited_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON TABLE public.apuntes_audits IS 'Registro de auditorías de apuntes/notas legales';
COMMENT ON COLUMN public.apuntes_audits.note_id IS 'ID de la nota/apunte auditada';
COMMENT ON COLUMN public.apuntes_audits.auditor_id IS 'ID del usuario auditor (ej: usr_amanda_legal, usr_benjamin_legal)';
COMMENT ON COLUMN public.apuntes_audits.auditor_name IS 'Nombre del auditor (ej: Amanda G., Benjamin)';
COMMENT ON COLUMN public.apuntes_audits.status IS 'Estado: audited, pending, rejected';
COMMENT ON COLUMN public.apuntes_audits.comments IS 'Comentarios opcionales del auditor';

