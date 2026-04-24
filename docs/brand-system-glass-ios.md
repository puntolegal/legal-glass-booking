# Brand system: glass iOS / Punto Legal

Referencia única para mantener coherencia entre **landing**, **agendamiento**, **pago** y **correos**. No sustituye la revisión del abogado titular ni el tono prudente de [conversion-copia-juridica-mejoras.md](./conversion-copia-juridica-mejoras.md).

## Principios

- Fondo **navy profundo** (`--la-bg`, `--la-surface-*`), sin negro puro; acentos azul/cyan **sutiles**.
- **Glassmorphism iOS**: blur + borde ghost + trazo interior claro (ver clases abajo).
- Tipografía: **Manrope** en títulos (`font-display`), **Inter** en cuerpo (ver `index.css` / `landing-canvas`).
- Una sola **fuente de verdad de precios y nombres de plan**: `src/constants/services.ts`, alineada con `ServicesSection` y `serviceInfo.ts`.

## Tokens y clases (CSS)

Definidos principalmente en [`src/index.css`](../src/index.css):

| Uso | Clase / token |
|-----|----------------|
| Canvas landing oscuro | `.landing-canvas`, variables `--la-*` |
| Panel glass oscuro (selector móvil, bloques) | `.glass-ios-panel-dark` |
| Tarjeta secundaria glass | `.glass-ios-card-dark` |
| Cards de servicio en catálogo | `.service-card`, variable por ítem `--card-accent` (RGB triplete) |
| Categorías tipo burbuja | `.cat-bubble`, `.cat-grid` |
| Separación entre secciones | `.section-flow`, `section + section::before` (hairline) |

Blur típico en paneles oscuros: **32px**, saturación ~140%, bordes `hsla(... / 0.10)`.

## Header global (`Agendar`)

En [`HeaderService.tsx`](../src/components/HeaderService.tsx), el plan del CTA **Agendar** (desktop y dock móvil) es `theme.agendarPlanSlug ?? theme.serviceSlug`. En **Derecho laboral** (`servicios/laboral`) se fuerza **`tutela-laboral`** para alinear con el diagnóstico gratis.

## Componentes de referencia

- Hero móvil: [`PremiumMobileHero.tsx`](../src/components/PremiumMobileHero.tsx)
- Selector “bola” / consultas: [`PremiumServiceSelector.tsx`](../src/components/PremiumServiceSelector.tsx) (`glass-ios-panel-dark`)
- Catálogo de servicios: [`ServicesSection.tsx`](../src/components/ServicesSection.tsx)
- Wordmark: [`BrandWordmark.tsx`](../src/components/BrandWordmark.tsx)
- Agendamiento: [`AgendamientoLayout.tsx`](../src/components/agendamiento/AgendamientoLayout.tsx), temas en [`serviceThemes.ts`](../src/config/serviceThemes.ts)

## Checklist antes de merge (touchpoints cruzados)

1. **Precio y nombre** del plan en `constants/services.ts` = copy en `config/serviceInfo.ts` = tarjeta en `ServicesSection` (si aplica).
2. **Duración de sesión** en `serviceInfo` coherente con textos “X min” en cards y selector.
3. **Títulos cortos** del catálogo: actualizar [`supabase/functions/_shared/landingServiceTitles.ts`](../supabase/functions/_shared/landingServiceTitles.ts) (WhatsApp / listados en correos).
4. **Edge Functions** que usan nombre de servicio (p. ej. seguimiento laboral gratis en `clever-action`): comprobar criterios si se renombra el producto.
5. **Meta / eventos**: `InitiateCheckout` con `content_ids` = slug de plan real.

## Cluster Laboral (personas)

- Plan **diagnóstico gratis**: `tutela-laboral` — nombre catálogo “Punto Legal Laboral — Diagnóstico gratis”.
- Plan **consulta paga**: `laboral` — “Punto Legal Laboral — Consulta” (`$79.000`, 60 min en `serviceInfo`).
- Chips en landing y selector enlazan a estos slugs; Ley Karin (trabajador) se orienta al diagnóstico cuando corresponde.

### Vertical laboral: teal apagado (no emerald neón)

El canvas sigue siendo **navy** (`--la-*`). El acento de producto laboral no usa esmeralda saturada: en código se expresa como **teal-600 / teal-300** (tokens en `src/components/servicios/servicioThemes.ts` → `laboral`, hex en `src/config/serviceThemes.ts` para `tutela-laboral` y `laboral`, y RGB `13 148 136` en la tarjeta laboral del landing). Botones y sombras privilegian **sombras neutras** (`shadow-black/*`) frente a sombras verdes. Así el glass iOS no compite con un verde “neón” en `/servicios/laboral` ni en agendamiento con esos planes.
