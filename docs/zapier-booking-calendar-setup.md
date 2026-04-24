# Zapier + Google Calendar/Meet + confirmación Resend

Flujo tras pago aprobado en Mercado Pago: la Edge Function `mercadopago-webhook` marca la reserva en cola, llama al **Catch Hook** de Zapier, Zapier crea el evento (con Meet si aplica) y hace **POST** a `booking-calendar-callback`, que guarda enlaces y dispara **una sola vez** `clever-action` (Resend, plantillas Punto Legal).

## Requisitos en Supabase

1. Aplicar migración `supabase/migrations/20260421180000_booking_calendar_queue.sql` (columnas `google_meet_link`, `confirmation_email_status`, etc.).
2. Desplegar Edge Functions:
   - `mercadopago-webhook`
   - `clever-action`
   - `booking-calendar-callback` (nueva)

## Variables de entorno (Supabase → Edge Functions)

| Variable | Dónde | Descripción |
|----------|--------|-------------|
| `ZAPIER_BOOKING_HOOK_URL` | `mercadopago-webhook` | URL completa del Catch Hook del Zap (POST JSON). Si **no** está definida, el webhook sigue llamando a `clever-action` directo (comportamiento anterior). |
| `ZAPIER_CALLBACK_SECRET` | `booking-calendar-callback` | Secreto compartido; Zapier debe enviarlo en la cabecera `x-zapier-secret`. Obligatorio para que el callback acepte peticiones. |
| `SUPABASE_SERVICE_ROLE_KEY` | `mercadopago-webhook` (recomendado), `booking-calendar-callback` | Para actualizar `reservas` sin depender de RLS del anon. |
| `ADMIN_EDGE_TOKEN` o `EDGE_ADMIN_TOKEN` | `booking-calendar-callback` | Mismo token que usa `clever-action` (`x-admin-token`). |

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

## Estados en `reservas.confirmation_email_status`

- `pending_calendar`: webhook encoló Zapier; aún no corre `clever-action`.
- `sent`: `clever-action` completó y actualizó `email_enviado`.
- `failed`: fallo al llamar a Zapier o a `clever-action` (fallback según logs).

## Frontend

`PaymentSuccessPage` no reenvía correos si la reserva está en `pending_calendar`; hace polling hasta que `email_enviado` sea true o falle el flujo.

## Seguridad

No expongas `ZAPIER_CALLBACK_SECRET` en el cliente. Solo Zapier (servidor) y variables de Supabase.
