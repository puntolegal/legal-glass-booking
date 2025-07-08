# 🔧 Instrucciones de Configuración Supabase

## 📋 Paso 1: Ejecutar Migración SQL

Necesitas ejecutar la migración SQL para crear las tablas y columnas necesarias para el sistema de notificaciones.

### Opción A: Via Dashboard de Supabase (Recomendado)

1. **Acceder a Supabase Dashboard**:
   - Ve a https://app.supabase.com
   - Entra a tu proyecto: `bhhtigrrenqkagtlwrju`

2. **Abrir SQL Editor**:
   - En el menú izquierdo, clic en "SQL Editor"
   - Clic en "New Query"

3. **Ejecutar la migración**:
   - Copia todo el contenido del archivo `supabase/migrations/create_notifications_system.sql`
   - Pégalo en el editor SQL
   - Clic en "Run" para ejecutar

### Opción B: Via CLI de Supabase

```bash
# Instalar Supabase CLI
npm install -g supabase

# Conectar a tu proyecto
supabase login
supabase link --project-ref bhhtigrrenqkagtlwrju

# Ejecutar migración
supabase db push
```

## 📊 Paso 2: Verificar Tablas Creadas

Después de ejecutar la migración, verifica en Supabase Dashboard > Table Editor que tienes:

### ✅ Tabla `reservas` (actualizada):
- [x] `servicio` (VARCHAR)
- [x] `precio` (VARCHAR) 
- [x] `categoria` (VARCHAR)
- [x] `tipo_reunion` (VARCHAR)
- [x] `estado` (ENUM)
- [x] `recordatorio_enviado` (BOOLEAN)
- [x] `webhook_sent` (BOOLEAN)
- [x] `updated_at` (TIMESTAMP)

### ✅ Tabla `notificaciones` (nueva):
- [x] `id` (UUID, primary key)
- [x] `reserva_id` (UUID, foreign key)
- [x] `tipo` (ENUM: nueva_reserva, recordatorio, comprobante)
- [x] `estado` (ENUM: pendiente, enviado, fallido)
- [x] `intentos` (INTEGER)
- [x] `fecha_envio` (TIMESTAMP)
- [x] `ultimo_error` (TEXT)
- [x] `webhook_response` (JSONB)
- [x] `created_at` (TIMESTAMP)
- [x] `updated_at` (TIMESTAMP)

### ✅ Tabla `pagos` (nueva):
- [x] `id` (UUID, primary key)
- [x] `reserva_id` (UUID, foreign key)
- [x] `numero_comprobante` (VARCHAR, unique)
- [x] `monto` (DECIMAL)
- [x] `metodo` (VARCHAR)
- [x] `numero_transaccion` (VARCHAR)
- [x] `estado` (ENUM)
- [x] `fecha_pago` (TIMESTAMP)
- [x] `datos_pago` (JSONB)
- [x] `created_at` (TIMESTAMP)
- [x] `updated_at` (TIMESTAMP)

## 🔐 Paso 3: Configurar Políticas RLS

Las políticas de Row Level Security ya se crean automáticamente con la migración:

### Para `notificaciones`:
- Solo administradores pueden ver todas las notificaciones
- Los usuarios solo ven notificaciones de sus propias reservas

### Para `pagos`:
- Los usuarios solo ven sus propios pagos
- Administradores y abogados pueden ver todos los pagos

## 📝 Paso 4: Datos de Prueba

La migración también inserta datos de ejemplo:

1. **Juan Pérez** - Consulta Laboral (mañana, 15:00)
2. **María González** - Constitución Sociedad (pasado mañana, 10:30)  
3. **Carlos Rojas** - Divorcio Express (en 3 días, 14:00)

## 🧪 Paso 5: Probar la Configuración

### Via aplicación web:
1. Ve a `http://localhost:8081/admin`
2. Tab "Notificaciones"
3. Debería mostrar dashboard sin errores

### Via SQL (en Supabase Dashboard):
```sql
-- Verificar reservas de prueba
SELECT id, nombre, servicio, precio, estado FROM reservas;

-- Verificar tabla notificaciones vacía
SELECT COUNT(*) FROM notificaciones;

-- Verificar tabla pagos vacía  
SELECT COUNT(*) FROM pagos;
```

## 🚨 Solución de Problemas

### Error: "relation does not exist"
```sql
-- Verificar que las tablas existen
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('reservas', 'notificaciones', 'pagos');
```

### Error: "column does not exist"
```sql
-- Verificar columnas de reservas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reservas';
```

### Error de permisos RLS:
```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename IN ('notificaciones', 'pagos');
```

## 🎯 Siguientes Pasos

Una vez completada la migración:

1. ✅ Reinicia el servidor de desarrollo: `npm run dev`
2. ✅ Ve a `/admin` → Tab "Notificaciones"
3. ✅ Prueba "Probar Conexión" (debería mostrar error hasta configurar Make)
4. ✅ Configura Make.com siguiendo `MAKE_SETUP.md`
5. ✅ Prueba crear una reserva real desde `/agendamiento`

## 📞 Soporte

Si encuentras errores:
1. Revisa la consola del navegador (F12)
2. Verifica logs en Supabase Dashboard > Logs
3. Asegúrate de que todas las tablas se crearon correctamente
4. Verifica que las API keys están configuradas

---

**¡Tu base de datos está lista para el sistema de notificaciones! 🎉** 