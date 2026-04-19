# Plan de trabajo — Diseño "Fintech Legal" + Conversión orgánica

## Diagnóstico actual

Tras el primer pase visual (Civil, Laboral, Corporativo bajo `ServicioPageShell`), aparecen tres problemas que están minando la sensación de marca y la conversión:

1. **Saturación cromática.** Los `sectionWash` de los temas amber/indigo crean bandas de color amplias que "sofocan" al lector. Un estudio de Stripe / Mercado Pago / Tenpo / Buk usa un único acento puntual, no fondos teñidos.
2. **Componentes inconsistentes.** Los testimonios en Laboral/Corporativo se construyeron con avatares circulares + estrellas en línea (estilo "Trustpilot 2018"), mientras que Familia ya tenía el patrón burbuja iOS con badge "Experiencia verificada". Romper ese patrón rompe la confianza.
3. **Conversión escasa.** Faltan los micro-mecanismos que sí están en Familia: pin emojis iOS, "guía de caminos" (Tool gratis vs Premium), garantías visuales y copy de bajo riesgo ("sin compromiso", "respuesta en 48h").

## Principio rector

> Estética **fintech legal**: oscuro, sobrio, espacioso. **Slate-900 como protagonista**, un único color de acento por vertical, mucho aire blanco/slate-300, micro-detalles iOS (chips, glass, emojis nativos) y CTAs hipergrandes.

## Reglas de diseño

| Regla | Aplicación |
|---|---|
| **Solo 1 acento por vertical** | El color del tema solo aparece en CTAs principales, iconos pequeños y badges. **No** en fondos amplios. |
| **Section washes casi invisibles** | `bg-slate-950/40` o `bg-slate-900/60` en lugar de `bg-amber-950/15`. La sensación de "sección" se logra con bordes sutiles, no con tinte. |
| **Tipografía con jerarquía clara** | H2 `text-3xl md:text-4xl font-bold text-white`, copy `text-slate-400`, micro-copy `text-slate-500`. |
| **Glassmorphism real iOS** | `bg-slate-950/70 backdrop-blur-xl border border-white/10` para cards. |
| **Emojis nativos iOS** | 💬 ❤️ ⚖️ 🛡️ 🚀 ✅ ⏱️ — usados como pin en cards, prefijo en CTAs y separadores. **No** emojis de Lucide ni SVGs simulando emojis. |
| **CTAs jerarquizados** | 1 primario por sección (gradiente sólido), 1 secundario glass (border + blur). Nunca 3+ CTAs compitiendo. |

## Tokens por vertical (refinados)

| Vertical | Acento principal | Trust cross-color | Emoji clave |
|---|---|---|---|
| **Civil** | `emerald-400` | `sky-300` (calculadora) | ⚖️ |
| **Laboral** | `amber-400` | `sky-300` (Ley Karin info) | 🛡️ |
| **Familia** | `pink-400` | `sky-300` (mediación) | ❤️ |
| **Corporativo** | `indigo-400` | `slate-300` (panel) | 🏢 |

## Componentes compartidos a crear

### 1. `TestimonialBubble.tsx` (estilo Familia)
- Card glass con `bg-slate-900/60 border border-slate-800 rounded-3xl`
- Header: chip "⭐️⭐️⭐️⭐️⭐️ Experiencia verificada" + role a la derecha
- Cuerpo: cita en italics
- Footer: nombre destacado
- **Sin avatares circulares** (más limpio, más iOS)

### 2. `SuccessCaseCard.tsx`
- Card con icono Lucide arriba en color del plan
- Métrica grande (`$22M`, `65%`, etc.)
- Caso resuelto + cliente

### 3. `TrustBar.tsx` (opcional, fase 2)
- Banda con: "1.000+ casos", "98% satisfacción", "Respuesta 48h", logos verificados
- Va debajo del hero para anclar confianza inmediatamente

## Mejoras de conversión (CRO orgánico)

Inspiradas en `ServicioFamiliaPage`:

1. **"Guía de caminos"** — Hero con 2 cards: ToolCard gratis (quiz/diagnóstico) y PremiumHeroCard (consulta estratégica). El visitante elige su nivel de compromiso.
2. **Pin emojis iOS** — 🆓 / 💎 sobre las tool cards para identificación instantánea.
3. **Garantía visible** — chip "Garantía 100%" o "Sin tarjetas" debajo de cada CTA.
4. **Micro-copy de bajo riesgo** — "Sin compromiso", "Respuesta automática", "Cupos limitados por agenda".
5. **Botón móvil flotante** — Bottom sheet permanente con CTA primario (ya está en Familia/Laboral).
6. **FAQ con preguntas reales de búsqueda** — Ya implementado en Civil/Laboral, mantener.
7. **Casos de éxito con cifras concretas** — `$22M recuperado`, `65% aumento pensión`. Más persuasivo que testimonios genéricos.
8. **Sticky CTA** opcional — Botón flotante en desktop con "Agendar consulta" siempre visible.

## Cambios específicos por página

### `ServicioLaboralPage` (prioridad)
- ❌ Eliminar `bg-amber-950/15` en sectionWash → reemplazar por `bg-slate-950/40`
- ❌ Eliminar testimonios con avatar circular → usar `TestimonialBubble`
- ❌ Reducir `from-amber-900/12` blob hero → `from-amber-900/6` (más sutil)
- ✅ Agregar "guía de caminos" tipo Familia: Diagnóstico Karin gratis + Consulta estratégica
- ✅ Cambiar nombres de planes: "Consulta Express", "Defensa Laboral", "Protección Integral" → mantener
- ✅ Pin emojis iOS en tool cards (🆓 ⚡ 💎)
- ✅ Sección "¿Por qué Punto Legal Laboral?" con 4 diferenciadores tipo Familia
- ✅ Casos de éxito: "$2.4M recuperado en horas extra", "100% indemnización despido", etc.
- ✅ CTA mobile flotante con emoji 🛡️

### `ServicioCivilPage`
- ✅ Cambiar testimonios actuales (avatares con iniciales) → `TestimonialBubble`
- ✅ Agregar casos de éxito con cifras concretas
- ✅ Pin emoji ⚖️ en hero card

### `ServicioCorporativoPage`
- ✅ Cambiar testimonios → `TestimonialBubble`
- ✅ Pin emoji 🏢 en hero card
- ✅ Validar que el panel azul indigo no compite con el resto (puede quedar como bloque destacado pero más sobrio)

### Fase 2 (siguiente iteración)
- Migrar `Penal`, `Tributario`, `Inmobiliario`, `Digital` al shell
- JSON-LD `LegalService` + `FAQPage` para SEO técnico
- A/B test: precio visible vs "Cotizar" en planes
- Landing por keyword (`/derecho-laboral-santiago`)

## Métricas de éxito

| Métrica | Baseline | Objetivo (30 días) |
|---|---|---|
| Tiempo en página servicios | — | +20% |
| CTR a `/agendamiento` desde servicios | — | +25% |
| Conversiones orgánicas (`ViewContent` → `Lead`) | — | +15% |
| Bounce rate móvil | — | -10% |

---

*Documento de planificación. Actualizar al cerrar cada bloque visual.*
