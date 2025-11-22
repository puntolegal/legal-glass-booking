-- =============================================
-- MIGRACIÓN: Crear tabla email_campaigns_sent
-- Fecha: 2025-01-29
-- Propósito: Trackear campañas de email enviadas para evitar duplicados
-- =============================================

-- Crear tabla para trackear campañas enviadas
CREATE TABLE IF NOT EXISTS public.email_campaigns_sent (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Relación con el lead
    lead_id UUID NOT NULL REFERENCES public.leads_quiz(id) ON DELETE CASCADE,
    
    -- Tipo de campaña enviada
    campaign_type VARCHAR(50) NOT NULL CHECK (campaign_type IN ('recovery', 'nurturing', 'urgency', 'testimonial')),
    
    -- Timestamp de envío
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Métricas de engagement (para futuro tracking)
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    
    -- Prevenir duplicados: un lead no puede recibir el mismo tipo de campaña dos veces
    CONSTRAINT unique_lead_campaign UNIQUE(lead_id, campaign_type)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_email_campaigns_lead_id ON public.email_campaigns_sent(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_campaign_type ON public.email_campaigns_sent(campaign_type);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_sent_at ON public.email_campaigns_sent(sent_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.email_campaigns_sent ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden ver las campañas
CREATE POLICY "Solo autenticados pueden ver campañas de email"
    ON public.email_campaigns_sent
    FOR SELECT
    TO authenticated
    USING (true);

-- Política: Solo service role puede insertar (para Edge Functions)
CREATE POLICY "Solo service role puede insertar campañas"
    ON public.email_campaigns_sent
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Comentarios de documentación
COMMENT ON TABLE public.email_campaigns_sent IS 'Registro de campañas de email enviadas a leads para evitar duplicados';
COMMENT ON COLUMN public.email_campaigns_sent.campaign_type IS 'Tipo de campaña: recovery (día 1), nurturing (día 3), urgency (día 6), testimonial (día 10)';
COMMENT ON COLUMN public.email_campaigns_sent.opened_at IS 'Timestamp cuando el email fue abierto (requiere pixel tracking)';
COMMENT ON COLUMN public.email_campaigns_sent.clicked_at IS 'Timestamp cuando se hizo clic en el CTA (requiere UTM tracking)';

-- Función para obtener el próximo tipo de campaña para un lead
CREATE OR REPLACE FUNCTION get_next_campaign_for_lead(p_lead_id UUID)
RETURNS TABLE(
    campaign_type VARCHAR(50),
    days_since_created INTEGER
) AS $$
DECLARE
    v_created_at TIMESTAMP WITH TIME ZONE;
    v_days_since_created INTEGER;
BEGIN
    -- Obtener fecha de creación del lead
    SELECT created_at INTO v_created_at
    FROM public.leads_quiz
    WHERE id = p_lead_id;
    
    IF v_created_at IS NULL THEN
        RETURN;
    END IF;
    
    -- Calcular días desde la creación
    v_days_since_created := EXTRACT(DAY FROM (NOW() - v_created_at));
    
    -- Determinar qué campaña corresponde según los días
    -- y verificar que no se haya enviado ya
    IF v_days_since_created >= 1 AND NOT EXISTS (
        SELECT 1 FROM public.email_campaigns_sent 
        WHERE lead_id = p_lead_id AND campaign_type = 'recovery'
    ) THEN
        RETURN QUERY SELECT 'recovery'::VARCHAR(50), v_days_since_created;
        
    ELSIF v_days_since_created >= 3 AND NOT EXISTS (
        SELECT 1 FROM public.email_campaigns_sent 
        WHERE lead_id = p_lead_id AND campaign_type = 'nurturing'
    ) THEN
        RETURN QUERY SELECT 'nurturing'::VARCHAR(50), v_days_since_created;
        
    ELSIF v_days_since_created >= 6 AND NOT EXISTS (
        SELECT 1 FROM public.email_campaigns_sent 
        WHERE lead_id = p_lead_id AND campaign_type = 'urgency'
    ) THEN
        RETURN QUERY SELECT 'urgency'::VARCHAR(50), v_days_since_created;
        
    ELSIF v_days_since_created >= 10 AND NOT EXISTS (
        SELECT 1 FROM public.email_campaigns_sent 
        WHERE lead_id = p_lead_id AND campaign_type = 'testimonial'
    ) THEN
        RETURN QUERY SELECT 'testimonial'::VARCHAR(50), v_days_since_created;
    END IF;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Vista para ver el estado de las campañas de cada lead
CREATE OR REPLACE VIEW v_lead_campaign_status AS
SELECT 
    l.id,
    l.name,
    l.email,
    l.created_at,
    l.plan_recommended,
    l.status as lead_status,
    EXTRACT(DAY FROM (NOW() - l.created_at)) as days_since_created,
    CASE 
        WHEN EXISTS(SELECT 1 FROM email_campaigns_sent WHERE lead_id = l.id AND campaign_type = 'recovery') THEN '✅'
        ELSE '⏳'
    END as recovery_sent,
    CASE 
        WHEN EXISTS(SELECT 1 FROM email_campaigns_sent WHERE lead_id = l.id AND campaign_type = 'nurturing') THEN '✅'
        ELSE '⏳'
    END as nurturing_sent,
    CASE 
        WHEN EXISTS(SELECT 1 FROM email_campaigns_sent WHERE lead_id = l.id AND campaign_type = 'urgency') THEN '✅'
        ELSE '⏳'
    END as urgency_sent,
    CASE 
        WHEN EXISTS(SELECT 1 FROM email_campaigns_sent WHERE lead_id = l.id AND campaign_type = 'testimonial') THEN '✅'
        ELSE '⏳'
    END as testimonial_sent,
    (
        SELECT campaign_type 
        FROM get_next_campaign_for_lead(l.id)
    ) as next_campaign
FROM public.leads_quiz l
WHERE l.status IN ('lead', 'contacted')
ORDER BY l.created_at DESC;















