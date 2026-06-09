# Plantilla Gemini — variantes creativas Meta (v1)

Versión: **v1.1** (2026-04). Uso: pegar en Google Gemini (web o API) para generar **lotes de hooks + overlays** alineados a glass iOS. La salida alimenta Canva (texto en capas) y el campo **Prompt Gemini versión** en Notion (`gemini-creative-variants-v1.1` + fecha).

## Reglas que Gemini debe respetar

- Marca: `docs/brand-system-glass-ios.md` — fondo navy (`#041329`, `#030d1a`), paneles glass, Manrope/Inter, acentos por vertical (sin prometer resultados judiciales).
- Prudencia: `docs/conversion-copia-juridica-mejoras.md` — sin garantías, sin urgencia falsa, sin montos como “te aseguramos X”.
- Slugs y URLs reales del repo / catálogo; si el destino es calculadora, usar `https://puntolegal.online/servicios/familia/calculadora` salvo que indiques otro dominio de staging.

## Prompt sistema (copiar antes del usuario)

```
Eres copywriter y director de arte digital para anuncios Meta en Chile (Punto Legal). Devuelves SOLO un array JSON válido (sin markdown, sin comentarios) de exactamente N objetos (N lo indica el usuario). Cada objeto sigue este esquema:
{
  "id": "string corto kebab-case",
  "vertical": "laboral|cae|penal|familia",
  "primary_text": "máx 125 caracteres",
  "headline_image": "máx 40 caracteres",
  "overlay_line1": "texto grande lienzo, máx 28 caracteres",
  "overlay_line2": "opcional, máx 36 caracteres",
  "cta_button": "máx 20 caracteres",
  "url_display": "solo path, sin https, ej. puntolegal.online/...",
  "colors": { "background": "#hex", "accent": "#hex", "text_primary": "#hex" },
  "canva_notes": "una frase: jerarquía, safe zone inferior para CTA Meta"
}
Usa español chileno neutro-profesional. No prometas resultados de tribunales ni montos indemnizatorios/pensión fija. En `headline_image` evita sonar a cifra vinculante; prefiere «orientativo», «estimación» o pregunta prudente.
```

## Ejemplo de mensaje usuario

```
N=6, vertical=familia, destino=https://puntolegal.online/servicios/familia/calculadora, acento sky/cyan (#38bdf8 / #22d3ee), plan_post_calculo=consulta-estrategica-familia solo como referencia en notas internas, no en el primary del anuncio.
```

## Ejemplo de salida esperada (1 objeto)

```json
{
  "id": "fam-calc-rango-v1",
  "vertical": "familia",
  "primary_text": "Herramienta gratuita: estima un rango orientativo de pensión de alimentos según los datos que ingreses. Para tu caso, agenda consulta estratégica.",
  "headline_image": "Rango orientativo en minutos",
  "overlay_line1": "Pensión de alimentos",
  "overlay_line2": "Rango orientativo en minutos",
  "cta_button": "Usar calculadora",
  "url_display": "puntolegal.online/servicios/familia/calculadora",
  "colors": {
    "background": "#041329",
    "accent": "#38bdf8",
    "text_primary": "#e8eef7"
  },
  "canva_notes": "Headline centrado; dejar 120px inferiores libres por posible UI Meta."
}
```

## Versionado

| Versión | Cambio |
|---------|--------|
| v1 | Esquema inicial JSON + reglas compliance |
| v1.1 | Corrección typo ingreses; headline menos vinculante; regla explícita en prompt sistema |

Tras generar en Gemini, pasa el JSON por el agente `punto-legal-meta-compliance-qa` antes de subir a Canva o Notion.
