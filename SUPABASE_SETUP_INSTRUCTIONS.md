# 🚀 Configuración de Supabase - Instrucciones Paso a Paso

## 📊 **PASO 1: CONFIGURAR BASE DE DATOS**

### **1.1 Ir al SQL Editor:**
```
1. Abrir: https://supabase.com/dashboard/project/nEzZtRLnXmnOGNJgNU3gMQ
2. Ir a: SQL Editor (en el menú lateral)
3. Hacer clic en: "New Query"
```

### **1.2 Ejecutar migración:**
**Copiar y pegar TODO el siguiente código SQL:**

```sql
-- Crear tabla de reservas para Punto Legal
-- Migración: 20250113000000-create-reservas-table.sql

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS public.reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Información del cliente
  cliente_nombre VARCHAR(255) NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,
  cliente_telefono VARCHAR(50) NOT NULL,
  cliente_rut VARCHAR(20),
  
  -- Información del servicio
  servicio_tipo VARCHAR(100) NOT NULL,
  servicio_precio VARCHAR(50) NOT NULL,
  servicio_descripcion TEXT,
  
  -- Fecha y hora
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'America/Santiago',
  
  -- Información de pago
  pago_metodo VARCHAR(50) DEFAULT 'pendiente',
  pago_estado VARCHAR(50) DEFAULT 'pendiente',
  pago_id VARCHAR(255),
  pago_monto DECIMAL(10,2),
  
  -- Estado de la reserva
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
  
  -- Notas adicionales
  notas TEXT,
  motivo_consulta TEXT,
  
  -- Información de seguimiento
  email_enviado BOOLEAN DEFAULT FALSE,
  recordatorio_enviado BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para búsquedas
  CONSTRAINT reservas_email_check CHECK (cliente_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_reservas_cliente_email ON public.reservas(cliente_email);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_pago_estado ON public.reservas(pago_estado);
CREATE INDEX IF NOT EXISTS idx_reservas_created_at ON public.reservas(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_reservas_updated_at 
    BEFORE UPDATE ON public.reservas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Política para permitir insertar reservas (público)
CREATE POLICY "Permitir insertar reservas" ON public.reservas
    FOR INSERT WITH CHECK (true);

-- Política para que solo admins puedan ver todas las reservas
CREATE POLICY "Solo admins pueden ver reservas" ON public.reservas
    FOR SELECT USING (
        auth.jwt() ->> 'email' = 'puntolegalelgolf@gmail.com'
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- Política para que solo admins puedan actualizar reservas
CREATE POLICY "Solo admins pueden actualizar reservas" ON public.reservas
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = 'puntolegalelgolf@gmail.com'
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- Crear vista para estadísticas (opcional)
CREATE OR REPLACE VIEW public.reservas_stats AS
SELECT 
    COUNT(*) as total_reservas,
    COUNT(*) FILTER (WHERE estado = 'confirmada') as confirmadas,
    COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes,
    COUNT(*) FILTER (WHERE pago_estado = 'approved') as pagos_aprobados,
    SUM(CASE WHEN pago_monto IS NOT NULL THEN pago_monto ELSE 0 END) as ingresos_total,
    DATE_TRUNC('month', created_at) as mes
FROM public.reservas
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes DESC;

-- Comentarios para documentación
COMMENT ON TABLE public.reservas IS 'Tabla principal para almacenar reservas de consultas legales';
COMMENT ON COLUMN public.reservas.cliente_email IS 'Email del cliente (requerido para notificaciones)';
COMMENT ON COLUMN public.reservas.pago_estado IS 'Estado del pago: pendiente, approved, rejected, cancelled';
COMMENT ON COLUMN public.reservas.estado IS 'Estado de la reserva: pendiente, confirmada, completada, cancelada';
COMMENT ON COLUMN public.reservas.pago_id IS 'ID del pago desde MercadoPago o Transbank';
```

### **1.3 Ejecutar la query:**
```
1. Hacer clic en "Run" (botón azul)
2. Verificar que aparezca: "Success. No rows returned"
3. Ir a: Table Editor > reservas (para verificar que se creó)
```

---

## 📧 **PASO 2: CONFIGURAR EDGE FUNCTION PARA EMAILS**

### **2.1 Instalar Supabase CLI:**
```bash
npm install -g supabase
```

### **2.2 Login en Supabase:**
```bash
supabase login
```

### **2.3 Inicializar proyecto:**
```bash
# En el directorio del proyecto:
supabase init
```

### **2.4 Link con tu proyecto:**
```bash
supabase link --project-ref nEzZtRLnXmnOGNJgNU3gMQ
```

### **2.5 Deploy Edge Function:**
```bash
supabase functions deploy send-booking-email
```

### **2.6 Configurar variables de entorno:**
```
1. Ir a: Supabase Dashboard > Project Settings > Edge Functions
2. Agregar variables:
   - SUPABASE_URL: https://nEzZtRLnXmnOGNJgNU3gMQ.supabase.co
   - SUPABASE_SERVICE_ROLE_KEY: sb_secret_3iFfSjSLf7OC5ewkCLLmVQ_jnsyd0UI
```

---

## 💳 **PASO 3: INTEGRAR CON MERCADOPAGO**

### **3.1 Verificar credenciales MercadoPago:**
Ya están configuradas en `.env`:
```env
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-a7d7e95c-653a-43bf-8a4d-2ab7b2ea30d3
MERCADOPAGO_ACCESS_TOKEN=APP_USR-4010337867785275-091313-920eb61517cac97567e501a9b30592eb-2685419265
```

### **3.2 Configurar external_reference:**
En `src/services/mercadopagoBackend.ts`, el sistema ya está configurado para:
- Crear preferencias con `external_reference` único
- Vincular pagos con reservas en Supabase
- Actualizar estados automáticamente

### **3.3 Flujo integrado:**
```
1. Cliente agenda → Reserva en Supabase
2. Cliente paga → MercadoPago procesa
3. Webhook → Actualiza estado en Supabase
4. Email automático → Confirmación enviada
```

---

## 🧪 **PASO 4: PROBAR EL SISTEMA**

### **4.1 Probar consulta gratuita:**
```
1. Ir a: http://localhost:8081/agendamiento?plan=gratis
2. Completar formulario con datos reales
3. Hacer clic en "Confirmar Reserva Gratis"
4. Verificar:
   - Email llegó a puntolegalelgolf@gmail.com
   - Reserva aparece en Supabase Table Editor
```

### **4.2 Probar consulta con pago:**
```
1. Ir a: http://localhost:8081/agendamiento?plan=general
2. Completar formulario
3. Proceder al pago
4. Usar tarjeta de prueba: 4509 9535 6623 3704
5. Verificar flujo completo
```

### **4.3 Verificar en Supabase:**
```sql
-- En SQL Editor:
SELECT * FROM reservas ORDER BY created_at DESC LIMIT 5;
```

---

## 🔧 **TROUBLESHOOTING**

### **Error: Edge Function no funciona**
```bash
# Verificar deployment:
supabase functions list

# Ver logs:
supabase functions logs send-booking-email

# Re-deployar si es necesario:
supabase functions deploy send-booking-email --no-verify-jwt
```

### **Error: No se pueden insertar reservas**
```sql
-- Verificar políticas RLS:
SELECT * FROM pg_policies WHERE tablename = 'reservas';

-- Deshabilitar RLS temporalmente para testing:
ALTER TABLE public.reservas DISABLE ROW LEVEL SECURITY;
```

### **Error: Emails no llegan**
```
1. Verificar que Edge Function esté deployada
2. Revisar logs en Supabase Dashboard
3. Verificar variables de entorno
4. Probar con supabase functions invoke
```

---

## ✅ **CHECKLIST DE CONFIGURACIÓN**

- [x] ✅ Credenciales actualizadas en .env
- [ ] 🗄️ Migración SQL ejecutada
- [ ] 📧 Edge Function deployada
- [ ] 🔧 Variables de entorno configuradas
- [ ] 🧪 Consulta gratuita probada
- [ ] 💳 Pago MercadoPago probado
- [ ] 📊 Datos visibles en Supabase

---

**🎯 Una vez completados estos pasos, tendrás el sistema completo funcionando con emails automáticos y integración MercadoPago.**