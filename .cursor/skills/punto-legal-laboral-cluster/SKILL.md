---
name: punto-legal-laboral-cluster
description: Define el cluster Laboral personas en Punto Legal: tutela-laboral (gratis), laboral, defensa-karin-trabajador, comparendo-rm y copy prudente Ley 21.643. Usa al editar ServicesSection, PremiumServiceSelector, ServicioLaboralPage, HeaderService o textos laborales.
---

# Punto Legal — Cluster Laboral

## Mapa de planes

| Intención | Plan slug | Precio catálogo |
|-----------|-----------|-----------------|
| Diagnóstico inicial sin costo (cuando aplica) | `tutela-laboral` | $0 |
| Consulta pagada, despido/finiquito | `laboral` | $79.000 |
| Defensa Ley Karin trabajador/a | `defensa-karin-trabajador` | $79.000 |
| Comparendo DT RM + proyección de demanda | `comparendo-rm` | $35.000 |

El **header** en `/servicios/laboral` usa `agendarPlanSlug` → `tutela-laboral` (CTA global “Agendar” = gratis).

**Ley Karin empresa** sigue en `ley-karin` (protocolo); para trabajador usar `defensa-karin-trabajador` o `tutela-laboral` según etapa.

## Copy

- Citar **Ley 21.643** como “Ley Karin” cuando haga falta claridad.
- Honorarios a porcentaje: sólo “según acuerdo escrito” / “cuando aplica” (ver `docs/conversion-copia-juridica-mejoras.md`).

## Archivos clave

- [`src/components/ServicesSection.tsx`](src/components/ServicesSection.tsx) — `clusterPills` en el ítem Laboral.
- [`src/components/PremiumServiceSelector.tsx`](src/components/PremiumServiceSelector.tsx) — `intentPills` en slide laboral.
