---
name: punto-legal-brand-glass
description: Aplica el sistema visual glass iOS y tokens navy de Punto Legal en landing y flujos de foco. Usa al crear o editar componentes con glass-ios-panel-dark, service-card, landing-canvas o documentación de marca.
---

# Punto Legal — Brand glass iOS

## Instrucciones

1. Antes de nuevos estilos, lee [`docs/brand-system-glass-ios.md`](docs/brand-system-glass-ios.md) y [`src/index.css`](src/index.css) (secciones `--la-*`, `.glass-ios-panel-dark`, `.service-card`).
2. Prefiere **clases existentes** sobre CSS ad hoc en componentes.
3. Títulos: `font-display` / Manrope en `.landing-canvas`; cuerpo: Inter.
4. Para cards de servicio, respeta `--card-accent` como RGB triplete coherente con `serviceThemes`.

## Ejemplos

- Panel oscuro: `className="glass-ios-panel-dark rounded-[2rem] ..."`
- Card secundaria: `glass-ios-card-dark`

## Referencias

- [`docs/brand-system-glass-ios.md`](docs/brand-system-glass-ios.md)
