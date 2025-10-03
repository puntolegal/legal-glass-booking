-- Expandir longitud de RUT para evitar errores 22001
ALTER TABLE public.reservas
ALTER COLUMN rut TYPE VARCHAR(20);

COMMENT ON COLUMN public.reservas.rut IS 'RUT del cliente, permite formato con puntos y guión (hasta 20 caracteres).';