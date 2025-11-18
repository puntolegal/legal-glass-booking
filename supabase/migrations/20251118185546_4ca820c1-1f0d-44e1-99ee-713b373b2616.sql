-- Tabla para guardar respuestas del formulario de familia
CREATE TABLE IF NOT EXISTS public.family_quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  nombre TEXT,
  servicio TEXT NOT NULL,
  bienes TEXT,
  empresa TEXT,
  internacional TEXT,
  recommended_plan TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'lead',
  contacted BOOLEAN DEFAULT FALSE
);

-- Habilitar RLS
ALTER TABLE public.family_quiz_responses ENABLE ROW LEVEL SECURITY;

-- Política para inserción pública (leads)
CREATE POLICY "Permitir inserción pública de family_quiz_responses"
ON public.family_quiz_responses
FOR INSERT
TO anon
WITH CHECK (true);

-- Política para lectura solo autenticados
CREATE POLICY "Permitir lectura de family_quiz_responses a autenticados"
ON public.family_quiz_responses
FOR SELECT
TO authenticated
USING (true);

-- Índice para búsquedas por email
CREATE INDEX idx_family_quiz_email ON public.family_quiz_responses(email);
CREATE INDEX idx_family_quiz_created ON public.family_quiz_responses(created_at DESC);