# Punto Legal - Plataforma de Servicios Jurídicos

Plataforma moderna de servicios legales con sistema de reservas, pagos integrados y notificaciones automáticas.

## 🚀 Estado Actual del Proyecto

**Última actualización:** 25 de Enero 2025  
**Versión:** 2.1.0  
**Estado:** Productivo ✅

### ✨ Características Implementadas

#### 💳 Sistema de Pagos Integrado
- Transferencia electrónica con datos bancarios reales
- Integración con Transbank (simulada en desarrollo)
- Botón de copiar todos los datos bancarios
- Envío automático de comprobante por WhatsApp
- Flujo de pago optimizado y profesional

#### 🔔 Sistema de Notificaciones Automáticas
- **Supabase Edge Functions** para envío automático de emails
- **Resend API** como proveedor de email principal
- **Triggers SQL** para envío automático al confirmar reservas
- **Sistema de fallback** con Make.com
- Templates de email HTML profesionales
- Envío dual: cliente + administrador
- Logs detallados para monitoreo

#### 📄 Páginas Legales
- Política de Privacidad (`/privacy-policy`)
- Términos de Servicio (`/terms-of-service`)
- Cumplimiento legal para Make.com

#### 🗄️ Base de Datos
- Migración completa de Supabase
- Sistema de reservas optimizado
- Tracking de notificaciones
- Gestión de pagos

#### 🎨 UI/UX
- Diseño glassmórfico moderno
- Modo oscuro/claro
- Responsive design
- Accesibilidad mejorada

### 🔧 Tecnologías

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Shadcn/ui
- **Base de Datos:** Supabase PostgreSQL
- **Edge Functions:** Supabase (Deno)
- **Email Provider:** Resend API
- **Notificaciones:** Make.com (backup)
- **Pagos:** MercadoPago Checkout Pro
- **Animaciones:** Framer Motion
- **Deploy:** GitHub Pages Ready

## 📧 Sistema de Emails Automático

### Arquitectura
El sistema utiliza **Supabase Edge Functions** con **Resend API** para envío automático de emails:

```
Pago Exitoso → confirmReservation() → Trigger SQL → Edge Function → Resend API
     ↓
Frontend Fallback → Edge Function (si trigger falla)
```

### Componentes Implementados

#### 1. Edge Function (`send-booking-emails`)
- **Ubicación:** `supabase/functions/send-booking-emails/index.ts`
- **Función:** Envía emails de confirmación al cliente y notificación al admin
- **Proveedor:** Resend API
- **Seguridad:** Validación de token `X-Admin-Token`

#### 2. Trigger SQL (`trg_notify_email_on_paid`)
- **Ubicación:** `supabase/migrations/20250113000001-send-booking-emails-trigger.sql`
- **Función:** Detecta cambios de estado a `confirmada` y llama a Edge Function
- **Extensión:** `pg_net` para llamadas HTTP

#### 3. Frontend Fallback
- **Función:** `sendBookingEmailsSupabase()` en `reservationService.ts`
- **Propósito:** Envío manual si el trigger falla
- **Integración:** Llamada desde `PaymentSuccessPage`

### Configuración Requerida

#### Variables de Entorno en Supabase Dashboard:
```bash
RESEND_API_KEY=re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW
MAIL_FROM=Punto Legal <puntolegalelgolf@gmail.com>
ADMIN_EMAIL=puntolegalelgolf@gmail.com
SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg
EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025
```

#### Pasos de Configuración:
1. **Crear cuenta en Resend:** [resend.com](https://resend.com)
2. **Obtener API Key** y configurar en Supabase Secrets
3. **Verificar dominio** en Resend para emails `from`
4. **Desplegar Edge Function:** `supabase functions deploy send-booking-emails`
5. **Ejecutar migración:** `supabase db push`

### Testing

#### Prueba Manual de Edge Function:
```bash
curl -X POST https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-booking-emails \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: puntolegal-admin-token-2025" \
  -d '{"booking_id": "test-reservation-id"}'
```

#### Prueba de Trigger SQL:
```sql
-- Crear reserva de prueba
INSERT INTO public.reservas (nombre, email, fecha, hora, servicio, precio, estado) 
VALUES ('Test User', 'test@ejemplo.com', '2024-01-15', '10:00', 'Consulta General', '35000', 'confirmada');

-- Verificar envío
SELECT * FROM public.reservas_with_email_status;
```

### Monitoreo

#### 1. Logs de Edge Function
- Supabase Dashboard → Functions → send-booking-emails → Logs

#### 2. Dashboard de Resend
- Verificar entrega de emails en [resend.com](https://resend.com)

#### 3. Base de Datos
```sql
-- Estado de emails
SELECT * FROM public.reservas_with_email_status;

-- Estadísticas
SELECT * FROM public.get_email_stats();

-- Prueba manual
SELECT public.test_email_trigger('reservation-id');
```

### Troubleshooting

| Error | Solución |
|-------|----------|
| `RESEND_API_KEY no configurado` | Verificar variable en Supabase Secrets |
| `Reserva no encontrada` | Verificar tabla `reservas` y `booking_id` |
| `La reserva no tiene email` | Verificar columna `email` |
| `Resend error 401` | Verificar API key válida |
| `Resend error 422` | Verificar email `from` verificado |

### Archivos de Configuración

- **Edge Function:** `supabase/functions/send-booking-emails/index.ts`
- **Migración SQL:** `supabase/migrations/20250113000001-send-booking-emails-trigger.sql`
- **Frontend Service:** `src/services/reservationService.ts`
- **Configuración:** `SUPABASE_EMAIL_CONFIG.md`
- **Script de Prueba:** `scripts/test-supabase-email-system.js`

### 🌐 URLs

- **Repositorio:** https://github.com/puntolegal/legal-glass-booking
- **Local:** http://localhost:8083/
- **Documentación:** Ver archivos `.md` en el repositorio

### 📋 Próximos Pasos

1. Integración real con Transbank
2. Activar MercadoPago y Bitcoin
3. Deploy a producción en puntolegal.online
4. Testing completo del sistema de pagos

---

**Desarrollado con ❤️ para Punto Legal**
