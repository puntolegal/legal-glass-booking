---
name: punto-legal-laboral-legaltech-model
description: Alinea copy laboral chileno, UX de empoderamiento, plazos educativos, lenguaje claro frente a jerga, glass iOS y CRO prudente en Punto Legal. Usa al editar `/servicios/laboral`, `ServicioLaboralPage`, FAQs laborales, Meta/laboral o cuando el usuario mencione despido, Art. 172, recargos, plazo 60 días hábiles, AFC/cesantía, Ley Karin o LegalTech trabajador.
---

# Punto Legal — Modelo LegalTech laboral (trabajador)

## Principios

1. **Empoderamiento sin promesa de resultado**: mensajes de equilibrio (“información clara”, “plazos y opciones”), nunca “garantizamos” ni cifras de recuperación sin fuente y disclaimer.
2. **Urgencia educativa**: el plazo de 60 días hábiles y qué cuenta como hábil (p. ej. sábados) es información útil, no táctica de escasez falsa.
3. **Lenguaje claro**: tabla concepto jurídico → cómo lo dice la marca → para qué sirve al usuario; evitar solo siglas sin una línea humana.
4. **Rigor normativo en copy**: bases (Art. 172), topes y recargos se describen como **orientativos**; el detalle lo fija el abogado según antecedentes.
5. **Visual**: respetar [`punto-legal-brand-glass`](../punto-legal-brand-glass/SKILL.md) — `glass-ios-panel-dark`, `glass-ios-card-dark`, tokens `servicioThemes` laboral.

## Checklist al tocar la página laboral

- [ ] CTAs siguen llevando a `agendamiento` con slugs de `constants/services.ts` (sincronizar con [`punto-legal-service-catalog-sync`](../punto-legal-service-catalog-sync/SKILL.md) si cambian planes).
- [ ] Nuevas afirmaciones numéricas o de resultado: contrastar con `docs/conversion-copia-juridica-mejoras.md`.
- [ ] FAQs: sin errores materiales (p. ej. tope de años de servicio vs “meses”); jurisprudencia/AFC formulada como **casuística revisable en sesión**.

## Referencias en repo

- Prudencia y conversión: `docs/conversion-copia-juridica-mejoras.md`
- Marca glass: `docs/brand-system-glass-ios.md`, `src/index.css`
- Página principal: `src/pages/ServicioLaboralPage.tsx`
