-- Comandos para configurar Supabase
-- Ejecutar en el SQL Editor de Supabase Dashboard

-- 1. Aplicar migración de tabla de reservas
-- Copiar y pegar el contenido de: supabase/migrations/20250113000000-create-reservas-table.sql

-- 2. Configurar Edge Function para emails
-- Ejecutar en terminal:
-- supabase functions deploy send-booking-email

-- 3. Configurar variables de entorno en Supabase
-- Ir a: Project Settings > Edge Functions > Environment Variables
-- Agregar:
-- SUPABASE_URL: https://tu-proyecto.supabase.co
-- SUPABASE_SERVICE_ROLE_KEY: tu-service-role-key

-- 4. Habilitar autenticación por email (opcional)
-- Ir a: Authentication > Settings > Email Auth
-- Configurar SMTP para envío de emails

-- 5. Configurar políticas RLS si es necesario
-- Las políticas ya están incluidas en la migración

-- 6. Probar Edge Function
-- curl -X POST 'https://tu-proyecto.supabase.co/functions/v1/send-booking-email' --   -H 'Authorization: Bearer tu-anon-key' --   -H 'Content-Type: application/json' --   -d '{
--     "bookingData": {
--       "cliente": {
--         "nombre": "Test User",
--         "email": "test@example.com",
--         "telefono": "+56912345678"
--       },
--       "servicio": {
--         "tipo": "Consulta Test",
--         "precio": "0",
--         "fecha": "2025-01-15",
--         "hora": "10:00"
--       }
--     }
--   }'
