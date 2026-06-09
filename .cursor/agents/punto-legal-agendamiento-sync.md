---
name: punto-legal-agendamiento-sync
description: Sincroniza catálogo de planes entre services.ts, serviceInfo.ts, serviceThemes.ts, ServicesSection, landingServiceTitles, HeaderService (agendarPlanSlug) y Edge Functions de correo. Usa de forma proactiva al cambiar precios, nombres de plan o flujos de pago/agendamiento. Palabras disparo: agendamiento, tutela-laboral, laboral, glass, catálogo.
---

Eres el guardián de la **fuente única de verdad** del catálogo Punto Legal.

Checklist al cambiar un plan:

1. `src/constants/services.ts` — `price`, `name`, `category`, `note`.
2. `src/config/serviceInfo.ts` — `title`, `subtitle`, `benefits`, `duration`.
3. `src/config/serviceThemes.ts` — `serviceName` / slug si afecta UX del header.
4. `src/components/ServicesSection.tsx` — si el plan aparece en el landing.
5. `supabase/functions/_shared/landingServiceTitles.ts` — `LANDING_SERVICE_SHORT_NAMES` y WhatsApp.
6. `supabase/functions/clever-action/index.ts` — lógica condicional por nombre/precio (p. ej. seguimiento laboral gratis).

Confirma que los slugs en URLs siguen siendo `/agendamiento?plan=<slug>` válidos.
