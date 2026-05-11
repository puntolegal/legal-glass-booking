# Zapier + Google Calendar/Meet + confirmación Resend

Flujo tras pago aprobado en Mercado Pago: la Edge Function `mercadopago-webhook` marca la reserva en cola, llama al **Catch Hook** de Zapier, Zapier crea el evento (con Meet si aplica) y hace **POST** a `booking-calendar-callback`, que guarda enlaces y dispara **una sola vez** `clever-action` (Resend, plantillas Punto Legal).

## Requisitos en Supabase

1. Aplicar migración `supabase/migrations/20260421180000_booking_calendar_queue.sql` (columnas `google_meet_link`, `confirmation_email_status`, etc.).
2. Aplicar migración `supabase/migrations/20260428120000_reservas_qualification_inmobiliario.sql` (`qualification_data`, `risk_level`, trigger de riesgo).
3. Desplegar Edge Functions:
   - `mercadopago-webhook`
   - `clever-action`
   - `booking-calendar-callback`
   - `enqueue-booking-calendar` (reservas sin Mercado Pago, p. ej. plan `inmobiliario-eval`)

## Variables de entorno (Supabase → Edge Functions)

| Variable | Dónde | Descripción |
|----------|--------|-------------|
| `ZAPIER_BOOKING_HOOK_URL` | `mercadopago-webhook`, `enqueue-booking-calendar` | URL completa del Catch Hook del Zap (POST JSON). Si **no** está definida, ambas funciones hacen fallback a `clever-action` directo. |
| `ZAPIER_CALLBACK_SECRET` | `booking-calendar-callback` | Secreto compartido; Zapier debe enviarlo en la cabecera `x-zapier-secret`. Obligatorio para que el callback acepte peticiones. |
| `SUPABASE_SERVICE_ROLE_KEY` | `mercadopago-webhook` (recomendado), `booking-calendar-callback`, `enqueue-booking-calendar` | Para leer/actualizar `reservas` sin depender de RLS del anon. |
| `ADMIN_EDGE_TOKEN` o `EDGE_ADMIN_TOKEN` | `booking-calendar-callback`, `enqueue-booking-calendar` | Mismo token que usa `clever-action` (`x-admin-token`) para el fallback de correo. |

## Zap en Zapier (zapier.com)

1. **Trigger:** Webhooks by Zapier → **Catch Hook**. Copiar la URL al secreto `ZAPIER_BOOKING_HOOK_URL` en Supabase.
2. **Acción:** Google Calendar → **Create Detailed Event** (o equivalente con videoconferencia). Mapear desde el cuerpo del hook campos como `fecha`, `hora`, `nombre`, `email`, `servicio`, `tipo_reunion`. Duración sugerida: 45 minutos (alineado con el `.ics` del correo).
3. **Rama:** Si `tipo_reunion` indica videollamada/online, activar conferencia **Google Meet**; si es llamada telefónica, crear evento sin Meet.
4. **Acción final:** Webhooks → **POST** a  
   `https://<PROJECT_REF>.supabase.co/functions/v1/booking-calendar-callback`  
   - Cabecera: `Content-Type: application/json`  
   - Cabecera: `x-zapier-secret: <ZAPIER_CALLBACK_SECRET>`  
   - Cuerpo JSON mínimo:
   ```json
   {
     "booking_id": "<UUID de la reserva>",
     "google_meet_link": "https://meet.google.com/...",
     "google_calendar_event_id": "...",
     "google_calendar_html_link": "https://www.google.com/calendar/event?eid=..."
   }
   ```
   Los campos de Meet/HTML/event id pueden ir vacíos si no aplica; `booking_id` es obligatorio (mismo `id` que envía el webhook en el payload inicial).

### Payload enriquecido (Notion / Gmail interno)

El JSON del Catch Hook incluye además, cuando existan en `reservas`: `risk_level`, `qualification_data` (objeto JSON de la micro-cualificación de `/servicios/inmobiliario`). Puedes mapearlos en Zapier a **Notion** o a un correo **Gmail solo al equipo** (evita duplicar el correo al cliente si ya envía Resend vía `clever-action`).

## Reservas sin pago (`pago_estado = waived_inmobiliario`)

1. **Migración:** `supabase/migrations/20260428120000_reservas_qualification_inmobiliario.sql` añade `qualification_data` (jsonb) y `risk_level` en `public.reservas`.
2. **Landing:** `puntolegal.online/servicios/inmobiliario` guarda la cualificación en `sessionStorage` y envía a `/agendamiento?plan=inmobiliario-eval`. La ruta `/inmobiliario` redirige a `/servicios/inmobiliario`.
3. **Al confirmar cita (precio 0):** el cliente invoca `enqueue-booking-calendar` con `{ "booking_id": "<uuid>" }`. La función valida:
   - `pago_estado === 'waived_inmobiliario'`
   - `servicio` contiene `inmobiliario` o `evaluación`
   - reserva creada hace menos de 45 minutos
   - idempotencia si ya está `pending_calendar` o `email_enviado`
4. Luego el flujo es **idéntico** al pago MP: mismo Catch Hook → Calendar/Meet → `booking-calendar-callback` → `clever-action`.

## Prompt maestro (copiar a Notion o Agent)

```
Objetivo: embudo inmobiliario Sector Oriente en puntolegal.online/servicios/inmobiliario → cualificación (Zod) → sessionStorage → /agendamiento?plan=inmobiliario-eval → reserva con pago_estado waived_inmobiliario + qualification_data → Edge enqueue-booking-calendar → ZAPIER_BOOKING_HOOK_URL (mismo Zap que MP) → Google Calendar + Meet → POST booking-calendar-callback (x-zapier-secret) → clever-action Resend.

Archivos clave: src/pages/ServicioInmobiliarioPage.tsx, src/constants/inmobiliarioQualification.ts, src/contexts/AgendamientoContext.tsx (rama inmobiliario-eval), src/services/enqueueBookingCalendar.ts, supabase/functions/enqueue-booking-calendar/index.ts, supabase/functions/_shared/zapierBookingPayload.ts, mercadopago-webhook (payload unificado), clever-action (asunto/descripcion waived), docs/zapier-booking-calendar-setup.md.

Gmail en Zapier: solo notificación interna; cliente = Resend. Notion: mapear qualification_data y risk_level desde el Catch Hook. Pruebas: reserva eval + polling en /payment-success; reserva pagada inmobiliario + MP sandbox sin regresión.
```

## Seguridad

No expongas `ZAPIER_CALLBACK_SECRET` en el cliente. Solo Zapier (servidor) y variables de Supabase.

## Estados en `reservas.confirmation_email_status`

- `pending_calendar`: webhook encoló Zapier; aún no corre `clever-action`.
- `sent`: `clever-action` completó y actualizó `email_enviado`.
- `failed`: fallo al llamar a Zapier o a `clever-action` (fallback según logs).

## Frontend

`PaymentSuccessPage` no reenvía correos si la reserva está en `pending_calendar`; hace polling hasta que `email_enviado` sea true o falle el flujo.
