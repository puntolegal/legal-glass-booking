# 📧 Configuración de Variables de Entorno para Supabase Email System

## Variables Requeridas

Configura estas variables en el dashboard de Supabase (Project Settings → Configuration → Secrets):

### 1. Resend API Configuration
```
RESEND_API_KEY=re_your_resend_api_key_here
MAIL_FROM=Punto Legal <noreply@puntolegal.cl>
```

### 2. Admin Configuration
```
ADMIN_EMAIL=puntolegalelgolf@gmail.com
```

### 3. Supabase Configuration
```
SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Edge Function Security
```
EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025
```

### 5. Project Reference
```
PROJECT_REF=qrgelocijmwnxcckxbdg
```

## Pasos de Configuración

### 1. API Key de Resend (CONFIGURADA)
✅ **API Key obtenida:** `re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW`

**Pasos completados:**
1. ✅ Cuenta creada en [resend.com](https://resend.com)
2. ✅ API Key generada
3. ✅ Key copiada: `re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW`

### 2. Configurar en Supabase Dashboard
1. Ir a [supabase.com](https://supabase.com)
2. Seleccionar proyecto `qrgelocijmwnxcckxbdg`
3. Ir a Settings → Configuration
4. Ir a Secrets
5. Agregar las siguientes variables de entorno:

**Variables a configurar:**
```
RESEND_API_KEY=re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW
MAIL_FROM=Punto Legal <noreply@puntolegal.cl>
ADMIN_EMAIL=puntolegalelgolf@gmail.com
SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[obtener desde Settings → API]
EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025
```

### 3. Obtener Service Role Key
1. En Supabase Dashboard
2. Ir a Settings → API
3. Copiar "service_role" key (formato: `eyJ...`)

### 4. Verificar Configuración
```bash
# Verificar que las variables estén configuradas
supabase secrets list
```

## Testing

### 1. Probar Edge Function
```bash
# Desde el directorio del proyecto
supabase functions serve send-booking-emails

# En otra terminal, probar la función
curl -X POST http://localhost:54321/functions/v1/send-booking-emails \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: puntolegal-admin-token-2025" \
  -d '{"booking_id": "test-reservation-id"}'
```

### 2. Probar Trigger de Base de Datos
```sql
-- Crear una reserva de prueba
INSERT INTO public.reservas (
  nombre, email, telefono, fecha, hora, 
  servicio, precio, estado, tipo_reunion
) VALUES (
  'Juan Pérez', 'juan@ejemplo.com', '+56 9 1234 5678',
  '2024-01-15', '10:00', 'Consulta General', '35000',
  'confirmada', 'online'
);

-- Verificar que se ejecutó el trigger
SELECT * FROM public.reservas_with_email_status;
```

### 3. Verificar Logs
1. Ir a Supabase Dashboard
2. Ir a Functions → send-booking-emails
3. Ver Logs para verificar ejecución
4. Verificar en Resend Dashboard que los emails se enviaron

## Troubleshooting

### Error: "RESEND_API_KEY no configurado"
- Verificar que la variable esté configurada en Supabase Secrets
- Verificar que el nombre sea exacto: `RESEND_API_KEY`

### Error: "Reserva no encontrada"
- Verificar que la tabla se llame `reservas`
- Verificar que el `booking_id` sea válido
- Verificar permisos RLS

### Error: "La reserva no tiene email"
- Verificar que la columna se llame `email` o `cliente_email`
- Verificar que el email no sea null

### Error: "Resend error 401"
- Verificar que la API key de Resend sea válida
- Verificar que la cuenta de Resend esté activa

### Error: "Resend error 422"
- Verificar que el email `from` esté verificado en Resend
- Verificar que el formato del email sea correcto

## Monitoreo

### 1. Vista de Estado de Emails
```sql
SELECT * FROM public.reservas_with_email_status;
```

### 2. Estadísticas de Emails
```sql
SELECT * FROM public.get_email_stats();
```

### 3. Función de Prueba Manual
```sql
SELECT public.test_email_trigger('reservation-id-here');
```

## Seguridad

- ✅ **Service Role Key**: Solo se usa en Edge Functions (backend)
- ✅ **Admin Token**: Se usa para autorizar llamadas del trigger
- ✅ **RLS**: Las tablas mantienen RLS activado
- ✅ **CORS**: Configurado para permitir llamadas desde el frontend
- ✅ **Validación**: Se valida `booking_id` y email antes de enviar

## Arquitectura

```
Frontend → Payment Success → confirmReservation()
    ↓
Database Trigger → notify_email_on_paid()
    ↓
Edge Function → send-booking-emails
    ↓
Resend API → Email Cliente + Admin
```

## Backup System

1. **Trigger Automático**: Envía emails cuando `estado = 'confirmada'`
2. **Frontend Fallback**: Envía emails manualmente si el trigger falla
3. **Make.com Backup**: Sistema adicional para casos especiales

## Logs Importantes

- `📧 Procesando emails para reserva: {id}`
- `✅ Emails enviados exitosamente`
- `❌ Error enviando emails: {error}`
- `📧 Cliente ID: {resend_id}`
- `📧 Admin ID: {resend_id}`
