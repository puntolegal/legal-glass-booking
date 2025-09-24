# 🚨 CORRECCIÓN URGENTE - Tabla Reservas

## ❌ Problema Identificado

La tabla `reservas` en Supabase tiene una estructura incorrecta. Solo tiene estas columnas:
- `id`, `fecha`, `hora`, `estado`, `recordatorio_enviado`, `created_at`, `updated_at`

**Faltan las columnas necesarias:**
- `cliente_nombre`, `cliente_rut`, `cliente_email`, `cliente_telefono`
- `descripcion`, `servicio_tipo`, `servicio_precio`, `servicio_categoria`
- `tipo_reunion`, `webhook_sent`, `user_id`

## ✅ Solución

### Paso 1: Ejecutar Migración SQL

1. **Ve al Dashboard de Supabase**: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/sql

2. **Copia y pega este SQL completo** en el SQL Editor:

```sql
-- =============================================
-- MIGRACIÓN: Crear tabla reservas con estructura correcta
-- =============================================

-- 1. Eliminar la tabla existente si existe
DROP TABLE IF EXISTS public.reservas CASCADE;

-- 2. Crear la tabla reservas con la estructura correcta
CREATE TABLE public.reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_rut VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    descripcion TEXT,
    servicio_tipo VARCHAR(100) NOT NULL,
    servicio_precio DECIMAL(10,2) NOT NULL,
    servicio_categoria VARCHAR(50) DEFAULT 'General',
    tipo_reunion VARCHAR(20) DEFAULT 'online',
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    webhook_sent BOOLEAN DEFAULT FALSE,
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id VARCHAR(255) DEFAULT 'anonymous'
);

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX idx_reservas_estado ON public.reservas(estado);
CREATE INDEX idx_reservas_cliente_email ON public.reservas(cliente_email);
CREATE INDEX idx_reservas_created_at ON public.reservas(created_at);

-- 4. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Crear trigger para updated_at
CREATE TRIGGER update_reservas_updated_at 
    BEFORE UPDATE ON public.reservas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar RLS (Row Level Security)
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas RLS para permitir operaciones públicas
CREATE POLICY "Permitir crear reservas públicas" 
    ON public.reservas FOR INSERT TO public 
    WITH CHECK (true);

CREATE POLICY "Permitir leer reservas públicas" 
    ON public.reservas FOR SELECT TO public 
    USING (true);

CREATE POLICY "Permitir actualizar reservas públicas" 
    ON public.reservas FOR UPDATE TO public 
    USING (true) WITH CHECK (true);

CREATE POLICY "Permitir eliminar reservas públicas" 
    ON public.reservas FOR DELETE TO public 
    USING (true);
```

3. **Haz clic en "Run"** para ejecutar la migración

### Paso 2: Verificar que Funciona

Después de ejecutar la migración, ejecuta este comando para verificar:

```bash
node scripts/verify-table-after-migration.js
```

### Paso 3: Probar el Sistema

1. **Asegúrate de que el backend esté corriendo**:
   ```bash
   cd server && npm start
   ```

2. **Asegúrate de que el frontend esté corriendo**:
   ```bash
   npm run dev
   ```

3. **Prueba el flujo completo**:
   - Ve a http://localhost:8081/agendamiento?plan=general
   - Completa el formulario
   - Usa el código `PUNTOLEGALADMIN`
   - Procede al pago

## 🎯 Resultado Esperado

Después de aplicar la migración:
- ✅ La tabla `reservas` tendrá todas las columnas necesarias
- ✅ El sistema de agendamiento funcionará correctamente
- ✅ Los pagos de MercadoPago se procesarán sin errores
- ✅ Los emails se enviarán correctamente
- ✅ El sistema estará listo para producción

## 📋 Archivos de Migración

- `MIGRATION_RESERVAS_TABLE.sql` - Script SQL completo para ejecutar
- `scripts/verify-table-after-migration.js` - Script de verificación
- `scripts/create-table-manual.js` - Script alternativo (si es necesario)

---

**⚠️ IMPORTANTE: Esta corrección es CRÍTICA para que el sistema funcione. Sin ella, no se pueden crear reservas ni procesar pagos.**
