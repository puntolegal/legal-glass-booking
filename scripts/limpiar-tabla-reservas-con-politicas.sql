-- Script de limpieza de tabla reservas con eliminación de políticas
-- Ejecutar en Supabase SQL Editor

-- PASO 1: Backup de la tabla actual
CREATE TABLE reservas_backup AS SELECT * FROM reservas;

-- PASO 2: Eliminar políticas que dependen de user_id
DROP POLICY IF EXISTS "authenticated_users_own_reservations" ON reservas;
DROP POLICY IF EXISTS "Allow public reservation creation" ON reservas;
DROP POLICY IF EXISTS "Allow public read access for reservations" ON reservas;

-- PASO 3: Eliminar columnas redundantes
ALTER TABLE reservas DROP COLUMN IF EXISTS rut;
ALTER TABLE reservas DROP COLUMN IF EXISTS cliente_nombre;
ALTER TABLE reservas DROP COLUMN IF EXISTS cliente_email;
ALTER TABLE reservas DROP COLUMN IF EXISTS cliente_telefono;
ALTER TABLE reservas DROP COLUMN IF EXISTS servicio_nombre;
ALTER TABLE reservas DROP COLUMN IF EXISTS servicio_precio;
ALTER TABLE reservas DROP COLUMN IF EXISTS fecha_agendada;
ALTER TABLE reservas DROP COLUMN IF EXISTS hora_agendada;
ALTER TABLE reservas DROP COLUMN IF EXISTS motivo_consulta;
ALTER TABLE reservas DROP COLUMN IF EXISTS notas;
ALTER TABLE reservas DROP COLUMN IF EXISTS recordatorio_enviado;
ALTER TABLE reservas DROP COLUMN IF EXISTS webhook_sent;
ALTER TABLE reservas DROP COLUMN IF EXISTS user_id;
ALTER TABLE reservas DROP COLUMN IF EXISTS categoria;
ALTER TABLE reservas DROP COLUMN IF EXISTS preference_id;
ALTER TABLE reservas DROP COLUMN IF EXISTS pago_id;
ALTER TABLE reservas DROP COLUMN IF EXISTS pago_metodo;

-- PASO 4: Recrear políticas simplificadas (sin user_id)
CREATE POLICY "Allow public reservation creation" ON reservas
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access for reservations" ON reservas
FOR SELECT USING (true);

CREATE POLICY "Allow public update for reservations" ON reservas
FOR UPDATE USING (true);

-- PASO 5: Verificar estructura final
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- PASO 6: Verificar datos
SELECT COUNT(*) as total_reservas FROM reservas;
SELECT COUNT(*) as emails_enviados FROM reservas WHERE email_enviado = true;
