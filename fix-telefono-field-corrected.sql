-- =============================================
-- CORRECCIÓN URGENTE: CAMPO TELEFONO DEMASIADO CORTO
-- =============================================
-- Error: value too long for type character varying(12)
-- Solución: Ampliar el campo telefono a VARCHAR(50)

-- 1. Verificar la estructura actual de la tabla
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND column_name = 'telefono';

-- 2. Ampliar el campo telefono de VARCHAR(12) a VARCHAR(50)
ALTER TABLE public.reservas 
ALTER COLUMN telefono TYPE VARCHAR(50);

-- 3. Verificar que el cambio se aplicó correctamente
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND column_name = 'telefono';

-- 4. Insertar datos de prueba para verificar que funciona (SIN categoria)
INSERT INTO public.reservas (
    nombre, email, telefono, rut, fecha, hora, descripcion,
    servicio, precio, tipo_reunion, estado
) VALUES 
(
    'Test Telefono Largo',
    'test@puntolegal.cl',
    '+569123456789', -- 13 caracteres, debería funcionar ahora
    '12345678-9',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'Prueba de telefono largo',
    'Consulta General',
    '35000',
    'online',
    'pendiente'
);

-- 5. Verificar que se insertó correctamente
SELECT nombre, telefono, LENGTH(telefono) as longitud_telefono 
FROM public.reservas 
WHERE nombre = 'Test Telefono Largo';

-- 6. Limpiar datos de prueba
DELETE FROM public.reservas 
WHERE nombre = 'Test Telefono Largo';

SELECT 'Campo telefono corregido exitosamente' as resultado;
