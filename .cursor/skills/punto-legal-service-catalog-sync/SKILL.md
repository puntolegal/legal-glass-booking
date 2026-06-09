---
name: punto-legal-service-catalog-sync
description: Sincroniza cambios de catálogo y planes entre frontend, correos Supabase y WhatsApp en Punto Legal. Usa al renombrar servicios, cambiar precios o añadir planes nuevos.
---

# Punto Legal — Sincronía de catálogo

## Pasos

1. Edita `src/constants/services.ts` (precio, nombre visible).
2. Actualiza `src/config/serviceInfo.ts` (beneficios, duración, título).
3. Ajusta `src/config/serviceThemes.ts` si cambia el nombre corto en el header del agendamiento.
4. Si el servicio está en el landing, actualiza `src/components/ServicesSection.tsx` (`internalServices`).
5. Actualiza `supabase/functions/_shared/landingServiceTitles.ts` (`LANDING_SERVICE_SHORT_NAMES`).
6. Revisa `supabase/functions/_shared/puntoLegalBookingEmail.ts` y `clever-action` si el cambio afecta criterios por nombre o precio.

## Anti-patrones

- No dejes **dos nombres idénticos** para planes distintos en `serviceCatalog` sin distinguir en el string (p. ej. “— Diagnóstico gratis” vs “— Consulta”).
- Tras cambios en títulos, vuelve a desplegar Edge Functions si aplica.
