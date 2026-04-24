# Mejoras comunicacionales y de prudencia jurídica (conversión)

Propuestas para el **landing**, el **agendamiento por servicio** y textos transversales. Objetivo: **más confianza**, **menos riesgo publicitario/deontológico** y **mejor conversión** sin prometer resultados que no controlamos.

> Este documento es orientación de producto/copy; la revisión final debe hacerla el **abogado titular** del estudio.

---

## Principios transversales

1. **Sustituir promesas de resultado** (“recuperamos”, “garantizamos”, “100%”) por formulaciones de **esfuerzo razonable** y **evaluación de viabilidad** según antecedentes.
2. **Alinear duración y precio** en todos los touchpoints (landing, `constants/services.ts`, `serviceInfo.ts`, confirmaciones) para evitar fricción post-clic.
3. **Testimonios y métricas:** etiqueta “Caso real” + pie de método (resultado no garantiza resultados futuros) o enlace a política de testimonios.
4. **Datos personales y sensibles:** una línea de **finalidad** (agenda, cotización, cumplimiento normativo) antes del envío; mención breve de **Meta / Mercado Pago / Supabase** donde aplique.
5. **Honorarios condicionados / tutela gratuita:** separar claramente **primera sesión / diagnóstico** vs **patrocinio** y qué activa el cobro a porcentaje.

---

## Por cluster de servicio

### Tutela laboral / laboral persona

- Ajustar “honorarios solo si recuperamos”: definir **qué es recuperación** (¿solo sentencia? ¿cobro efectivo?) y que el diagnóstico **no incluye** demanda hasta convenio escrito.
- Ley Karin: el protocolo es **adecuación legal**, no “blindaje” frente a sanciones.

### Penal y penal económico

- Suavizar “atención inmediata”: sustituir por **horario real de primera respuesta** o “primera sesión en X días hábiles”.
- Aclarar que **salidas alternativas** dependen de Fiscalía/juez y antecedentes.

### Familia / sucesorio

- Unificar **45 vs 60 minutos** entre `ServicesSection` y `serviceInfo`.
- Pensión / cálculos: “**orientativo**; el tribunal puede fijar monto distinto”.

### Tributario / holding / optimización

- Reemplazar “pagas lo justo, ni un peso más” por enfoque en **análisis de riesgos y alternativas** según información aportada; decisiones finales del cliente y criterio del SII.

### CAE / Tesorería / cobranza

- Sustituir “frenamos el embargo” por **“evaluamos medidas de suspensión/repactación según normativa y caso”**.
- Cobranza: “**gestionamos** cobro y vía ejecutiva” en lugar de “recupera”.

### Empresas (SpA, marcas, cumplimiento 20.393)

- Plazos tipo “72 h”: condicionar a **documentación completa** y **carga notarial/registral**.
- Testimonios de “certificación” modelo 20.393: verificar que sea **literalmente cierto** o reformular.

### Migratorio / consumidor

- Evitar “sin problemas”; los plazos son del **Estado**, no del estudio.

### Express / Premium intersticial

- “Pago 100% seguro” → “Pago con **Mercado Pago**” + enlace a políticas del proveedor.
- Alinear mensaje “te contactaremos para agendar” con flujos donde **ya hay fecha elegida**.

---

## Agendamiento (pasos 1–3)

- **Step 2 (Meet):** “grabación opcional” + mención de **consentimiento** / finalidad / partes.
- **Step 3:** reforzar política de **cancelación/reprogramación** (coherente con landing).
- **Códigos convenio/admin** visibles en cliente: riesgo de abuso y distorsión de métricas — mover validación a servidor o rotar códigos.

### SEO / meta del layout de agendamiento

- Evitar “garantía de satisfacción total” sin política publicada equivalente.
- Revisar claims de tiempo (“menos de 60 segundos”) si no son medibles en analytics.

---

## Sidebar y prueba social (`ConversionSidebar`, `ServicesSection`)

- Métricas fijas (“+47 esta semana”): **fuente y actualización** o suavizar redacción.
- Testimonios con cifras concretas: disclaimer de **caso pasado** / **no promesa**.

---

## Orden sugerido de implementación (impacto / esfuerzo)

1. **Duración y precio** unificados (rápido, alto impacto en confianza).
2. **Claims de resultado** en tributario, CAE, cobranza, laboral (alto impacto legal).
3. **Disclaimers** en tutela / honorarios condicionados.
4. **Testimonios y métricas** con pie o suavizado.
5. **Microcopy** agendamiento (grabación, datos personales).

---

## KPIs sugeridos post-cambio

- Tasa de abandono en **Step 3** (antes de clic en pagar).
- Reclamos / consultas WhatsApp del tipo “pensé que incluía…” (cualitativo).
- Tiempo hasta **primera sesión** agendada (ya con expectativa alineada).
