# Notion — Hub Growth & Ads (Punto Legal)

Páginas creadas vía Zapier MCP (Notion). Convierte cada sección en **base de datos de página completa** desde Notion: `/database` en la página o “Turn into database” para gestionar filas (creativos, anuncios, causas).

## Hub principal

| Título | URL | Notas |
|--------|-----|--------|
| Growth and Ads Punto Legal | https://www.notion.so/Growth-and-Ads-Punto-Legal-34ab1391879e818b9734c4868e19bc30 | Padre del espacio |

## Hijos del hub

| Título | URL | Uso |
|--------|-----|-----|
| Creativos y Canvas | https://www.notion.so/Creativos-y-Canvas-34ab1391879e8176b71cd9d7feba037c | Biblioteca creativos + columnas sugeridas en el cuerpo |
| Anuncios Meta | https://www.notion.so/Anuncios-Meta-34ab1391879e81598e11ee84f1799491 | Seguimiento de campañas / conjuntos |
| Pipeline Causas Supabase | https://www.notion.so/Pipeline-Causas-Supabase-34ab1391879e81538f35e517d7e07e59 | Espejo operativo de ingresos |

## Subpágina de marca (bajo Creativos)

| Título | URL |
|--------|-----|
| Brief visual glass iOS | https://www.notion.so/Brief-visual-glass-iOS-34ab1391879e812297dacdf4b3de40ca |
| Plantilla registro creativo Meta | https://www.notion.so/Plantilla-registro-creativo-Meta-34ab1391879e81d9ab39eafc7ea98423 |

## Propiedades sugeridas al pasar a DB

**Creativos:** Nombre, Vertical (select), Formato (select: 1:1, 4:5, 9:16), **Link Canva (url)** — fuente editable obligatoria, **Link Drive PNG (url)** — respaldo del export 1:1 (o carpeta del lote), **Prompt Gemini versión (text)** — p. ej. `gemini-creative-variants-v1.1` + fecha o hash corto del prompt usado, Estado (select), Copy principal (text), CTA (text), Slug plan (text), URL destino (url), Compliance (select: pendiente / OK titular), Notas.

**Acción en Notion (manual):** en la base [Creativos y Canvas](https://www.notion.so/Creativos-y-Canvas-34ab1391879e8176b71cd9d7feba037c), añade las propiedades **Link Drive PNG** y **Prompt Gemini versión** si aún no existen; conserva **Link Canva** como campo principal para abrir el lienzo.

**Anuncios Meta:** Campaña, Conjunto, Objetivo, Presupuesto, Fechas, Creativo (relation → Creativos), KPI notes, CPL, CTR, Hipótesis, Resultado.

**Pipeline causas:** Fecha ingreso, Nombre, Email, Teléfono, Servicio, Plan slug, Estado pago, Intake ID, Notas seguimiento. Minimizar PII en vistas compartidas.

## Referencia repo

- Marca: `docs/brand-system-glass-ios.md`
- Conversiones Meta: `META_CONVERSIONS_SETUP.md`
