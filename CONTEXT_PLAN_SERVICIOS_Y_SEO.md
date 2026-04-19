# Plan de trabajo: unificación visual (referencia Familia) + conversión SEO

## Objetivo

Alinear **Civil**, **Laboral** y **Corporativo** (y, en una segunda fase, el resto de `/servicios/*`) con el **lenguaje visual y la experiencia** de `ServicioFamiliaPage.tsx`, sin perder la identidad temática de cada práctica, y mejorar **conversiones desde tráfico orgánico** (clics útiles, tiempo en página y acciones hacia agendamiento / contacto).

## Referencia de diseño (fuente de verdad)

**Archivo:** `src/pages/ServicioFamiliaPage.tsx`

Elementos a replicar de forma consistente:

| Aspecto | Patrón en Familia |
|--------|-------------------|
| Base | `min-h-screen bg-slate-900 text-slate-300`, fondos con gradientes radiales sutiles (pink/sky/rose) |
| Navegación | `Header` + spacer `h-20` |
| Hero | Badge glass (`bg-white/5 backdrop-blur-xl border border-white/10`), título blanco, copy claro |
| Secciones | Bordes `border-slate-800/60`, bloques `bg-slate-950/60`, acentos `pink` / `rose` / `sky` según bloque |
| Tarjetas | `GlassCard`, `ToolCard`, `PremiumHeroCard`, `FloatingIcon` donde aplique |
| Confianza | Stats, testimonios, FAQ orientados a intención de búsqueda |
| Medición | `trackMetaEvent` (`ViewContent`) al montar con `content_name` / `content_category` por página |

## Estado actual (breve)

- **Familia:** plantilla completa (glass, rutas de conversión, paquetes, FAQ, modales).
- **Civil:** layout más genérico (`from-background`, `primary`), sin el shell oscuro/glass de Familia.
- **Laboral:** acentos **naranja** propios, `Header` + `MobileLayout`; distinto del sistema Familia.
- **Corporativo:** mezcla `primary` y gradientes **amber/orange**; flujo login/dashboard es específico (mantener lógica, unificar envoltorio visual).

## Fases recomendadas

### Fase 1 — Inventario y tokens (1–2 días)

1. Listar secciones equivalentes entre páginas (hero, servicios, precios/paquetes, prueba social, FAQ, CTA final).
2. Extraer **tokens reutilizables** (clases Tailwind o pequeño mapa por vertical) en un solo lugar, por ejemplo:
   - `src/components/servicios/ServicioPageShell.tsx` (wrapper: fondo, blobs, `Header`, spacer)
   - opcional: `servicioTheme.ts` con acentos por vertical (`civil`: sky/emerald; `laboral`: amber conservado pero sobre slate-900; `corporativo`: indigo/slate)
3. Definir **un solo orden de secciones** tipo landing de alto rendimiento: valor → servicios → diferenciación → precios → testimonios → FAQ → CTA.

### Fase 2 — Paridad visual (prioridad: Civil, Laboral, Corporativo)

1. Envolver cada página con el mismo **shell** que Familia (fondo slate-900, gradientes, tipografía).
2. Sustituir bloques sueltos por componentes ya usados en Familia donde encaje (`GlassCard`, etc.).
3. **Acentos por práctica:** mantener matiz (ej. laboral puede conservar tonos cálidos) pero **sobre la misma base** slate/glass para sensación de producto único.
4. En Corporativo: no romper `CorporateDashboard` ni modales de login; solo alinear la **landing pública** al shell.

### Fase 3 — SEO orgánico + CRO

**On-page (cada URL `/servicios/...`):**

- `SEO`: `title` con keyword principal + marca + Chile; `description` 150–160 caracteres con beneficio y CTA suave.
- Un **H1** único, claro, con intención (ej. “Abogado laboral en Chile: despidos y Ley Karin”).
- Subtítulos **H2/H3** con variaciones semánticas (sin keyword stuffing).
- Párrafos cortos, listas con entidades que la gente busca (trámites, plazos, tribunales cuando aplique).
- **FAQ** alineada a “People also ask” / dudas reales (misma estructura que Familia si se usa FAQ en UI).
- Enlaces internos a calculadoras, agendamiento y artículos relacionados (`Link` con texto ancla descriptivo).

**Datos estructurados (opcional siguiente iteración):** JSON-LD `LegalService` / `FAQPage` donde la página tenga FAQ estable.

**Conversiones:**

- CTAs primarios hacia `/agendamiento?plan=...` con parámetros **consistentes** y seguimiento.
- Repetir **micro-copy de garantía** o urgencia solo si es verificable (alineado a Familia).
- Mantener **un evento de analítica** por vista de servicio (como `ViewContent` en Familia).

### Fase 4 — QA y rendimiento

- Revisar rutas en móvil (Laboral usa `MobileLayout`: validar que el shell nuevo no duplique padding/header).
- Lighthouse: LCP en hero, CLS por fuentes/imágenes.
- Revisión de contraste texto sobre `slate-900`.

## Archivos en alcance inmediato (solicitud actual)

| Página | Archivo |
|--------|---------|
| Familia (referencia) | `src/pages/ServicioFamiliaPage.tsx` |
| Civil | `src/pages/ServicioCivilPage.tsx` |
| Laboral | `src/pages/ServicioLaboralPage.tsx` |
| Corporativo | `src/pages/ServicioCorporativoPage.tsx` |

## Alcance posterior (mismo criterio)

- `ServicioDigitalPage.tsx`, `ServicioInmobiliarioPage.tsx`, `ServicioPenalPage.tsx`, `ServicioTributarioPage.tsx`, `ServicioPenalEconomicoPage.tsx`, `ServiciosEspecializadosPage.tsx`

## Criterio de “hecho”

- Misma sensación de marca que Familia (fondo, header, jerarquía tipográfica, tarjetas).
- SEO: metadatos coherentes, H1 único, contenido escaneable, FAQ donde corresponda.
- Sin regresiones en flujos específicos (login corporativo, dashboards).

---

*Documento generado como contexto de planificación; actualizar al cerrar cada fase.*
