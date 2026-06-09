# Flujo: anuncio alta conversión → Canva → Notion

Zapier expone **Canva: Create Design** (`canva_create_design`). Usar `design_type__type: custom` con 1080x1080 (u otras medidas) en las instrucciones. **No enviar `asset_id` con una carpeta:** Canva devuelve error; dejar el campo vacío o elegir un asset concreto. Luego mover el archivo a la carpeta Punto Legal desde la app Canva si hace falta.

## Roles

| Quién | Qué hace |
|-------|-----------|
| Agente creativo (`punto-legal-meta-creative-*`) | Hooks, primary, headlines, carrusel, **spec Canva** (layout, tipos, colores). |
| `punto-legal-meta-compliance-qa` | Revisa copy vs `conversion-copia-juridica-mejoras.md` antes de publicar o guardar. |
| `punto-legal-ceo-growth` | Ordena prioridades, experimentos y que el registro en Notion no se salte. |
| Tú (o el asistente con Zapier) | Crear archivo en Canva → copiar **link de diseño** → guardar en Notion. |

## Paso 1 — Generar (en Cursor)

1. Invocar el agente de la vertical (laboral / CAE / penal), **`punto-legal-ceo-familia`** (calculadora pensión), o `punto-legal-ceo-growth` para priorizar.
2. Opcional: variantes JSON con [gemini-creative-variants-v1.md](gemini-creative-variants-v1.md) en Google Gemini.
3. Pedir salida en formato **Registro Notion** (bloque al final del agente, ver agentes).

## Paso 2 — Canva (rellenar lienzos en blanco)

Arte **SVG 1080×1080** alineado al landing (navy `#041329`, panel glass, Manrope/Inter, acentos por vertical) en el repo:

| Vertical | Archivo (importar en el lienzo correspondiente) |
|----------|--------------------------------------------------|
| Laboral / tutela | `public/meta-creatives/laboral-tutela-1080.svg` |
| CAE / TGR | `public/meta-creatives/cae-tgr-1080.svg` |
| Penal | `public/meta-creatives/penal-1080.svg` |
| Familia / calculadora pensión | `public/meta-creatives/familia-calculadora-1080.svg` |

En Canva: abre el diseño creado (p. ej. `Punto Legal META Laboral Tutela v1`) → **Subir** o **Archivo → Importar** → elige el SVG del repo (o arrastra al lienzo). Ajusta posición a página completa. Opcional: duplica página y adapta a **4:5** o **9:16** (reescalar tipografías).

1. Duplicar plantilla de marca si prefieres partir de Brand Kit (navy, glass, ver `Brief visual glass iOS` en Notion).
2. Versiones **1:1** (listas), luego **4:5**, **9:16** si la campaña lo requiere.
3. Exportar o compartir: **Enlace** al diseño (Compartir → cualquiera con el enlace).

## Paso 3 — Notion

**Opción A — Base de datos:** en [Creativos y Canvas](https://www.notion.so/Creativos-y-Canvas-34ab1391879e8176b71cd9d7feba037c), nueva fila y completar al menos: **Link Canva**, **Link Drive PNG** (export 1:1 tras aprobar), **Prompt Gemini versión** (ej. `gemini-creative-variants-v1.1` + fecha), Vertical, Formato, Copy principal, CTA, URL destino, Compliance. Ver columnas en `notion-hub-scaffold.md`.

**Opción B — Página hija:** duplicar [Plantilla registro creativo Meta](https://www.notion.so/Plantilla-registro-creativo-Meta-34ab1391879e81d9ab39eafc7ea98423) o crear página bajo Creativos con título `META | {vertical} | {fecha} | v1`.

**Opción C — Zapier MCP:** si `notion_create_page` está habilitado, instrucciones explícitas en chat: padre = página Creativos (`34ab1391-879e-8176-b71c-d9d7feba037c`), título corto, **cuerpo solo texto plano** (sin markdown con `#` para evitar errores de API).

## IDs útiles (Zapier / padres)

- **Creativos y Canvas** (padre de registros): `34ab1391-879e-8176-b71c-d9d7feba037c`
- **Hub:** `34ab1391-879e-818b-9734-c4868e19bc30`

## Enlace Anuncios Meta

Tras aprobar el creativo, crear fila en [Anuncios Meta](https://www.notion.so/Anuncios-Meta-34ab1391879e81598e11ee84f1799491) con campaña, conjunto, creativo (link) y hipótesis.

## Zapier: Canva Create Design (verificación)

Comprobar en un Zap de prueba (o MCP) la acción **Create Design** (`canva_create_design`):

| Parámetro | Valor recomendado |
|-----------|-------------------|
| Tipo / dimensiones | `custom` con **1080 × 1080** px (u otras medidas exactas del brief) |
| `asset_id` / plantilla | **Vacío** o ID de **un diseño/archivo concreto**. Si se envía el ID de una **carpeta**, Canva responde error. |
| Post-creación | Abrir el enlace devuelto en el navegador, importar el SVG del repo si aplica, aplicar fuentes del Brand Kit (Manrope/Inter) si el `@import` del SVG no cargó. |

**Errores frecuentes documentados:** carpeta como `asset_id`; token OAuth de Canva expirado (reconectar en Zapier); cuenta sin permiso de API Connect; nombre de equipo Canva incorrecto en la acción. Si el Zap falla, crear el lienzo a mano en Canva y seguir con export a Drive + fila en Notion (flujo no bloqueado).
