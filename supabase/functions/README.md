# Edge Functions (Supabase)

## `clever-action`

Envía confirmaciones por Resend tras pago confirmado; usa plantillas compartidas en `_shared/puntoLegalBookingEmail.ts`.

**Tras cambiar** cualquier archivo en `supabase/functions/_shared/` (por ejemplo plantillas HTML), vuelve a desplegar la función para que Deno empaquete la versión nueva:

```bash
supabase functions deploy clever-action
```

Variables típicas: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_EMAIL`; opcional `ADMIN_EDGE_TOKEN`, `WHATSAPP_E164`.
