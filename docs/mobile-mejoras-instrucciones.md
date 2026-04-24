# Instrucciones de mejora — experiencia móvil (agendamiento y payment success)

Checklist accionable para implementación. Archivos principales: `PaymentSuccessPage.tsx`, `AgendamientoLayout.tsx`, `Step2_Scheduling.tsx`, `Step3_Payment.tsx`. Ya existe `viewport-fit=cover` en `index.html`; reutilizar **safe areas**.

---

## A. `PaymentSuccessPage.tsx`

### A1. FAB WhatsApp fijo (`fixed bottom-6 right-6`)

- [ ] Sustituir márgenes fijos por `max(1.5rem, env(safe-area-inset-bottom))` y `env(safe-area-inset-right)` (inline o utilidades compartidas).
- [ ] Añadir **`padding-bottom`** al contenedor de contenido (altura FAB + margen + safe area) para que CTAs finales y botón `.ics` no queden tapados al scroll.
- [ ] En viewports **≤ ~380px**, ocultar la etiqueta “Hablar ahora” o moverla arriba del círculo para evitar choques con el borde y gestos.
- [ ] Opcional: reducir FAB cuando el CTA inline de WhatsApp esté visible (Intersection Observer) para no duplicar competencia visual.

### A2. Touch targets y tipografía

- [ ] Mínimo **44×44 px** en “Unirse” (Meet), enlaces en `text-[11px]`, y controles en filas densas (`min-h-[44px]`, padding horizontal).
- [ ] Subir a `text-sm` mínimo los bloques críticos de confirmación y “próximos pasos” en `sm:` o solo móvil.
- [ ] Pasos numerados: círculos `w-8 h-8` + `text-xs` en móvil (hoy `w-6` / `text-[10px]`).
- [ ] Revisar contraste `text-slate-400/500` sobre fondos glass con brillo bajo.

### A3. Header sticky

- [ ] `padding-top: max(..., env(safe-area-inset-top))` en los tres headers (express, urgencia, principal).
- [ ] Si hay parpadeo con `backdrop-blur` en iOS Safari, reforzar opacidad mínima del fondo del header.

### A4. Overflow y textos largos

- [ ] En filas `flex` icono + texto: `min-w-0` en el contenedor del texto; `break-words` o `truncate` + `title` en emails largos.
- [ ] IDs de pago: `word-break: break-all` o scroll horizontal acotado.

### A5. Botones `Link` / `<a>`

- [ ] `w-full sm:w-auto` en CTAs de fila para consistencia entre navegadores.
- [ ] Botón **Descargar .ics**: `w-full` en móvil dentro del card de resumen.

### A6. `.ics` y descubribilidad

- [ ] Orden en columna: título → botón ancho completo → texto ayuda.
- [ ] Valorar segundo enlace “Añadir al calendario” en bloque “Próximos pasos” si las métricas muestran bajo uso.

---

## B. `AgendamientoLayout.tsx`

- [ ] Safe area **top** en header sticky (`env(safe-area-inset-top)`).
- [ ] Sustituir o complementar `pb-12` por `max(3rem, env(safe-area-inset-bottom))` en el wrapper del `main`.
- [ ] `Link` wordmark: área táctil mínima (`min-h-[44px]`, padding vertical) sin romper estilos en `index.css`.
- [ ] **Doble sidebar** en móvil (compact + testimonial): evaluar colapsar testimonial tras paso 2 o en paso 3 para acortar scroll hasta el pago.

---

## C. `Step2_Scheduling.tsx`

- [ ] Pills de hora: **`min-h-[44px]`** y centrado; en pantallas muy estrechas valorar `grid-cols-2` en lugar de `grid-cols-3`.
- [ ] “Cambiar fecha” / “Elegir otra fecha”: `min-h-[44px]`, `text-sm`.
- [ ] Días en grid: altura mínima cómoda (~72px) en touch.
- [ ] “Volver al paso anterior”: altura mínima explícita ~44px.
- [ ] Opcional: **carrusel horizontal con snap** para los 14 días + `overscroll-behavior-x: contain`.
- [ ] `scroll-margin-top` en secciones al cambiar día/hora para no quedar bajo el header sticky.

---

## D. `Step3_Payment.tsx`

- [ ] En móvil estrecho: apilar **Pagar** arriba y **Anterior** abajo, ambos `w-full` (`flex-col`).
- [ ] `min-h-[48px]` en ambos botones; separación ≥ 8px.
- [ ] `hover:scale-105` solo desde **`md:`** o sustituir por `active:` en táctil para evitar “saltos”.
- [ ] Bloque “Pago seguro”: icono `w-4` y texto `text-sm` en móvil si es copy de confianza.

---

## E. Utilidades globales (recomendación)

- [ ] Definir en `index.css` o plugin Tailwind clases **`pt-safe`**, **`pb-safe`**, **`mb-fab`** y usarlas en **todos** los layouts de flujo de pago para no duplicar valores mágicos.

---

## F. QA en dispositivos reales

- [ ] iPhone con notch / Dynamic Island + Safari.
- [ ] Android con **navegación por gestos** (home indicator).
- [ ] iPhone SE o ancho ~375px.
- [ ] Landscape en Step 2 (grillas de horas).
