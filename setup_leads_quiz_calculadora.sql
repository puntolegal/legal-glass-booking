-- =====================================================
-- CONFIGURACIÓN COMPLETA: Tabla leads_quiz para Calculadora de Pensión
-- =====================================================
-- Este script crea/actualiza la tabla leads_quiz con todas las columnas
-- necesarias para guardar datos de la Calculadora de Pensión de Alimentos
-- =====================================================

-- 1. Crear la tabla si no existe (con estructura base)
CREATE TABLE IF NOT EXISTS public.leads_quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  quiz_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  plan_recommended TEXT,
  status TEXT DEFAULT 'nuevo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agregar columnas adicionales para la Calculadora de Pensión (si no existen)
DO $$ 
BEGIN
  -- Columna para valor numérico del ingreso
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads_quiz' 
    AND column_name = 'income_value'
  ) THEN
    ALTER TABLE public.leads_quiz ADD COLUMN income_value INTEGER;
  END IF;

  -- Columna para rango de ingreso (texto descriptivo)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads_quiz' 
    AND column_name = 'income_range'
  ) THEN
    ALTER TABLE public.leads_quiz ADD COLUMN income_range TEXT;
  END IF;

  -- Columna para cantidad de hijos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads_quiz' 
    AND column_name = 'children_count'
  ) THEN
    ALTER TABLE public.leads_quiz ADD COLUMN children_count INTEGER;
  END IF;

  -- Columna para etiqueta de cantidad de hijos (texto descriptivo)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads_quiz' 
    AND column_name = 'children_label'
  ) THEN
    ALTER TABLE public.leads_quiz ADD COLUMN children_label TEXT;
  END IF;

  -- Columna para monto mínimo calculado (formateado como string, ej: "$215.600")
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads_quiz' 
    AND column_name = 'calculated_min'
  ) THEN
    ALTER TABLE public.leads_quiz ADD COLUMN calculated_min TEXT;
  END IF;

  -- Columna para monto máximo calculado (formateado como string, ej: "$300.000")
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads_quiz' 
    AND column_name = 'calculated_max'
  ) THEN
    ALTER TABLE public.leads_quiz ADD COLUMN calculated_max TEXT;
  END IF;
END $$;

-- 3. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_leads_quiz_updated_at ON public.leads_quiz;
CREATE TRIGGER update_leads_quiz_updated_at
  BEFORE UPDATE ON public.leads_quiz
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.leads_quiz ENABLE ROW LEVEL SECURITY;

-- 6. Eliminar políticas existentes si existen (para evitar conflictos)
DROP POLICY IF EXISTS "Permitir inserción pública de leads_quiz" ON public.leads_quiz;
DROP POLICY IF EXISTS "Permitir lectura de leads_quiz a autenticados" ON public.leads_quiz;
DROP POLICY IF EXISTS "Permitir actualización de leads_quiz por email" ON public.leads_quiz;

-- 7. Crear política para INSERT (permite que usuarios anónimos inserten leads)
CREATE POLICY "Permitir inserción pública de leads_quiz"
ON public.leads_quiz
FOR INSERT
TO anon
WITH CHECK (true);

-- 8. Crear política para SELECT (solo usuarios autenticados pueden leer)
CREATE POLICY "Permitir lectura de leads_quiz a autenticados"
ON public.leads_quiz
FOR SELECT
TO authenticated
USING (true);

-- 9. Crear política para UPDATE (permite actualizar por email, útil para la calculadora)
CREATE POLICY "Permitir actualización de leads_quiz por email"
ON public.leads_quiz
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- 10. Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_leads_quiz_email ON public.leads_quiz(email);
CREATE INDEX IF NOT EXISTS idx_leads_quiz_status ON public.leads_quiz(status);
CREATE INDEX IF NOT EXISTS idx_leads_quiz_created_at ON public.leads_quiz(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_quiz_email_status ON public.leads_quiz(email, status);

-- 11. Agregar comentarios descriptivos a las columnas
COMMENT ON TABLE public.leads_quiz IS 'Tabla para almacenar leads capturados desde el Quiz y la Calculadora de Pensión';
COMMENT ON COLUMN public.leads_quiz.email IS 'Email del lead (requerido)';
COMMENT ON COLUMN public.leads_quiz.name IS 'Nombre del lead (requerido)';
COMMENT ON COLUMN public.leads_quiz.quiz_answers IS 'Respuestas del quiz en formato JSON';
COMMENT ON COLUMN public.leads_quiz.status IS 'Estado del lead: calculadora_iniciada, calculo_completado, nuevo, etc.';
COMMENT ON COLUMN public.leads_quiz.income_value IS 'Valor numérico del ingreso del demandado (para calculadora)';
COMMENT ON COLUMN public.leads_quiz.children_count IS 'Cantidad de hijos (para calculadora)';
COMMENT ON COLUMN public.leads_quiz.calculated_min IS 'Monto mínimo calculado (formateado como string)';
COMMENT ON COLUMN public.leads_quiz.calculated_max IS 'Monto máximo calculado (formateado como string)';
