---
name: punto-legal-ceo-growth
description: Dirige crecimiento, Meta Ads, embudo a agendamiento y operación Notion para Punto Legal con enfoque ROAS/CPL, creativos Canva alineados a glass iOS y cumplimiento deontológico. Orquesta flujo copy a Canva a Notion con agentes meta-creative. Usa al trabajar pauta Meta, Notion growth, briefs publicitarios, pipeline Supabase, captación masiva, experimentos CRO, CPL o cuando el usuario mencione CEO growth, anuncios, causas, Canva o Zapier Notion.
---

# Punto Legal — CEO Growth

## Prioridad de decisiones

1. **Compliance** — Sin promesas de resultado; alinear con `docs/conversion-copia-juridica-mejoras.md` y revisión del titular.
2. **Mensaje y oferta** — Slug de plan real, precio/duración coherentes con `src/constants/services.ts` y `src/config/serviceInfo.ts`.
3. **Creativo y canal** — Meta: hooks cortos, destino `https://puntolegal.online/agendamiento?plan=<slug>`.
4. **Medición** — Eventos en `META_CONVERSIONS_SETUP.md`; `content_ids` = slug del plan.

## Recursos en este skill

| Recurso | Uso |
|---------|-----|
| [notion-hub-scaffold.md](notion-hub-scaffold.md) | URLs del hub Notion, columnas sugeridas para DB |
| [briefs-meta-piloto.md](briefs-meta-piloto.md) | Briefs laboral, CAE, penal y familia/calculadora para Canva/Meta |
| [canva-notion-workflow.md](canva-notion-workflow.md) | **Flujo completo:** copy → SVG/listo en `public/meta-creatives/` → importar en Canva → Notion (y Zapier) |
| [gemini-creative-variants-v1.md](gemini-creative-variants-v1.md) | Prompt sistema + JSON para variantes Meta (Gemini) antes de Canva |
| [zapier-sync-evaluacion.md](zapier-sync-evaluacion.md) | Supabase → Notion: cuándo Zap vs CSV manual |

## Agentes creativos (delegación)

| Agente | Rol |
|--------|-----|
| `.cursor/agents/punto-legal-meta-creative-laboral.md` | Hooks y carruseles laboral / tutela |
| `.cursor/agents/punto-legal-meta-creative-cae.md` | Creativos CAE / TGR |
| `.cursor/agents/punto-legal-meta-creative-penal.md` | Creativos penal |
| `.cursor/agents/punto-legal-ceo-familia.md` | Embudo calculadora pensión + creativos Familia / Notion |
| `.cursor/agents/punto-legal-meta-experimentation.md` | Diseño de A/B y registro en Anuncios Meta |
| `.cursor/agents/punto-legal-meta-compliance-qa.md` | QA legal-ético antes de publicar o archivar |

Ciclo recomendado: agente vertical → **compliance QA** → Canva (humano) → **Notion** (DB o `notion_create_page` texto plano bajo Creativos).

## Docs del repo (obligatorios en copy pública)

- Marca visual: `docs/brand-system-glass-ios.md`
- Prudencia conversión: `docs/conversion-copia-juridica-mejoras.md`
- Sincronizar catálogo si cambian planes/precios: `.cursor/skills/punto-legal-service-catalog-sync/SKILL.md`

## Plantilla breve de anuncio (copiar y rellenar)

- **Plan / slug:**
- **URL:**
- **Formato Meta (1:1 / 4:5 / 9:16):**
- **Hook (≤90 caracteres):**
- **Cuerpo (2–3 líneas):**
- **CTA:**
- **Visual (tokens glass, acento vertical):**
- **Compliance checklist:** (sí/no por ítem del brief piloto)

## Límites éticos

Persuasión sin dark patterns, sin miedo fraudulento, sin garantías judiciales. Máximo beneficio al cliente con transparencia en honorarios y próximos pasos.
