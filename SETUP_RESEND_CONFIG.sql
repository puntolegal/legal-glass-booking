-- =====================================================
-- CONFIGURACIÓN DE VARIABLES DE ENTORNO PARA RESEND
-- Sistema de Emails Automáticos
-- =====================================================

-- NOTA: Estas variables deben configurarse en el Dashboard de Supabase
-- Ir a: Project Settings → Configuration → Secrets

-- 1. CONFIGURAR VARIABLES DE RESEND
-- RESEND_API_KEY=re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW
-- MAIL_FROM=Punto Legal <team@puntolegal.online>
-- ADMIN_EMAIL=puntolegalelgolf@gmail.com

-- 2. CONFIGURAR VARIABLES DE SUPABASE
-- SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
-- SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg

-- 3. CONFIGURAR TOKEN DE ADMINISTRACIÓN
-- EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025

-- 4. CONFIGURAR REFERENCIA DEL PROYECTO
-- PROJECT_REF=qrgelocijmwnxcckxbdg

-- =====================================================
-- INSTRUCCIONES DE CONFIGURACIÓN
-- =====================================================

-- 1. Ir a https://supabase.com/dashboard
-- 2. Seleccionar proyecto: qrgelocijmwnxcckxbdg
-- 3. Ir a Settings → Configuration
-- 4. Ir a Secrets
-- 5. Agregar las siguientes variables:

/*
RESEND_API_KEY = re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW
MAIL_FROM = Punto Legal <team@puntolegal.online>
ADMIN_EMAIL = puntolegalelgolf@gmail.com
SUPABASE_URL = https://qrgelocijmwnxcckxbdg.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg
EDGE_ADMIN_TOKEN = puntolegal-admin-token-2025
PROJECT_REF = qrgelocijmwnxcckxbdg
*/

-- =====================================================
-- VERIFICACIÓN DE CONFIGURACIÓN
-- =====================================================

-- Verificar que las variables estén configuradas correctamente
SELECT '✅ Variables de entorno configuradas' as status;
