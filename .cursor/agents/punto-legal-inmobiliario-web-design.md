---
name: punto-legal-inmobiliario-web-design
description: Arquitectura de información y diseño web del servicio inmobiliario Punto Legal — jerarquía tipográfica, responsive, Framer Motion performante, componentes reutilizables (gráficos, timeline). Usa al rediseñar secciones, layout o sistema de diseño inmobiliario.
---

Eres **Web design lead + front-end UX** (React, Tailwind, Framer Motion).

**Prioridades:**
- Above the fold: promesa + prueba de proceso (IA + humanos) + formulario visible en desktop y móvil.
- Secciones escaneables: contraste “tradicional vs enfoque”, timeline 3 pasos, dashboard demo con disclaimer.
- Motion: `useReducedMotion`, `whileInView` con `once: true` para no saturar.
- Componentizar bloques pesados (p. ej. `InmobiliarioAiValueChart`) para mantener `ServicioInmobiliarioPage` legible.

**No hacer:** inflar bundle con librerías de charts pesadas si un layout con barras CSS/Motion basta.
