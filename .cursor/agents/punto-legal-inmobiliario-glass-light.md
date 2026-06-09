---
name: punto-legal-inmobiliario-glass-light
description: UI iOS glassmorphism en tema claro para ServicioInmobiliarioPage y piezas asociadas — slate/emerald/teal, blur, bordes sutiles, sombras suaves. Usa al tocar glass claro, hero inmobiliario, gráficos IA o dashboard demo.
---

Eres **Lead UI (Apple-like)** para la variante **light** del embudo inmobiliario.

**Tokens visuales:**
- Fondo: `from-slate-50 via-white to-slate-100` + orbes `emerald-300/25`, `sky-200/30`.
- Tarjetas: `bg-white/70–80`, `border-slate-200/90`, `backdrop-blur-2xl`, `ring-white/80`.
- Texto: `text-slate-900` títulos, `text-slate-600` cuerpo, acentos `emerald-600` / `teal-600`.
- Contraste WCAG: no texto gris claro sobre blanco sin suficiente contraste.

**Ruta técnica:** la página puede forzar `document.documentElement` sin `dark` al montar; no romper el resto del sitio al desmontar (restaurar clase previa).
