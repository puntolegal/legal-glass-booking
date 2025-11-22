-- =============================================
-- MIGRACIÓN: Crear tabla leads_quiz
-- Fecha: 2025-01-28
-- Propósito: Capturar leads del quiz de recomendación de planes familia
-- =============================================
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase
-- URL: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

-- Crear tabla leads_quiz para capturar leads del quiz
CREATE TABLE IF NOT EXISTS public.leads_quiz (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información del lead
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Respuestas del quiz en formato JSONB para flexibilidad
    quiz_answers JSONB NOT NULL,
    
    -- Plan recomendado
    plan_recommended VARCHAR(50),
    
    -- Estado del lead (para tracking de n8n)
    status VARCHAR(50) DEFAULT 'lead' CHECK (status IN ('lead', 'processed', 'contacted', 'converted')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Validación de email
    CONSTRAINT leads_quiz_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_leads_quiz_email ON public.leads_quiz(email);
CREATE INDEX IF NOT EXISTS idx_leads_quiz_status ON public.leads_quiz(status);
CREATE INDEX IF NOT EXISTS idx_leads_quiz_created_at ON public.leads_quiz(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_quiz_plan_recommended ON public.leads_quiz(plan_recommended);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_leads_quiz_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para updated_at
CREATE TRIGGER update_leads_quiz_updated_at 
    BEFORE UPDATE ON public.leads_quiz
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_quiz_updated_at();

-- Habilitar RLS (Row Level Security) para seguridad
ALTER TABLE public.leads_quiz ENABLE ROW LEVEL SECURITY;

-- Política: Permitir inserción pública (para el formulario)
CREATE POLICY "Permitir inserción pública de leads_quiz"
    ON public.leads_quiz
    FOR INSERT
    WITH CHECK (true);

-- Política: Permitir lectura solo para autenticados (admin/abogados)
CREATE POLICY "Permitir lectura de leads_quiz a autenticados"
    ON public.leads_quiz
    FOR SELECT
    TO authenticated
    USING (true);

-- Comentarios de documentación
COMMENT ON TABLE public.leads_quiz IS 'Tabla para capturar leads del quiz de recomendación de planes familia';
COMMENT ON COLUMN public.leads_quiz.quiz_answers IS 'Respuestas del quiz en formato JSON. Ejemplo: {"servicio": "divorcio-acuerdo", "empresa": "no", "internacional": "no"}';
COMMENT ON COLUMN public.leads_quiz.plan_recommended IS 'Plan recomendado: integral, premium, o elite';
COMMENT ON COLUMN public.leads_quiz.status IS 'Estado del lead: lead (nuevo), processed (procesado por n8n), contacted (contactado), converted (convertido)';

