# Briefs piloto — Meta Ads → Agendamiento (Punto Legal)

Copiar bloques a Notion (DB Creativos) o a Canva como notas. Incluye laboral, CAE, penal y **familia/calculadora** (sección 4). Precios y slugs deben coincidir con `src/constants/services.ts` y `src/config/serviceInfo.ts` al publicar.

---

## 1. Laboral / diagnóstico — plan `tutela-laboral`

- **Vertical:** Personas — laboral.
- **URL destino:** `https://puntolegal.online/agendamiento?plan=tutela-laboral`
- **Hook A (primary):** “Despido, tutela o Ley Karin: necesitas claridad, no promesas vacías.”
- **Hook B:** “Primera evaluación puede ser sin costo cuando aplica. Videollamada con abogado.”
- **Cuerpo (2 líneas):** Evaluación de tu caso y vía a seguir. Secreto profesional. Agenda en minutos.
- **CTA:** “Pedir mi diagnóstico” / botón “Agendar”
- **Visual Canva:** Fondo navy, panel glass, acento teal (RGB 13 148 136), tipografía sans geométrica; texto grande en móvil.
- **Compliance:** No prometer resultado judicial ni monto de finiquito; honorarios a % solo si hay acuerdo escrito (coherente con landing).

---

## 2. Defensa CAE / Tesorería — plan `cae-tesoreria`

- **Vertical:** Patrimonio — CAE / TGR.
- **URL destino:** `https://puntolegal.online/agendamiento?plan=cae-tesoreria`
- **Hook A:** “Retención por CAE moroso: revisamos medidas y convenio según tu caso.”
- **Hook B (urgencia sobria):** “Tesorería y CAE: primer paso con abogado en videollamada.”
- **Cuerpo:** Evaluamos suspensión, repactación o vías según normativa y antecedentes. Sin garantías absolutas.
- **CTA:** “Agendar consulta” (alineado a `ctaLabel` del catálogo; evitar solo “frenar ya” en pauta — ver `docs/conversion-copia-juridica-mejoras.md`).
- **Visual Canva:** Misma línea glass/navy; acento rojo contenido (urgencia financiera) sin alarmismo tipográfico excesivo.
- **Compliance:** Sustituir “frenamos el embargo” en anuncios por formulaciones de evaluación y vías según el doc de prudencia.

---

## 3. Penal — plan `penal`

- **Vertical:** Personas — penal.
- **URL destino:** `https://puntolegal.online/agendamiento?plan=penal`
- **Hook A:** “Defensa penal: primer paso claro, con abogado litigante.”
- **Hook B:** “Querella, defensa o salidas alternativas: lo vemos en consulta.”
- **Cuerpo:** Primera sesión para ordenar hechos y estrategia. Plazos y resultados dependen de Fiscalía y tribunal.
- **CTA:** “Defender mi caso” / “Agendar consulta”
- **Visual Canva:** Navy + acento rose/gravedad sobrio; evitar imágenes sensacionalistas.
- **Compliance:** No “atención inmediata” literal si no es operativo; no prometer salidas alternativas concretas (doc conversión).

---

## 4. Familia / calculadora pensión — destino calculadora + plan post-flujo `consulta-estrategica-familia`

- **Vertical:** Personas — familia (pensión de alimentos).
- **URL destino (pauta a herramienta):** `https://puntolegal.online/servicios/familia/calculadora`
- **Plan checkout típico tras flujo:** `consulta-estrategica-familia` (coherente con `CalculadoraPensionPage`; verificar precio en `serviceInfo` al publicar).
- **Hook A (primary):** “Calcula un rango orientativo de pensión de alimentos en minutos. Luego puedes agendar consulta estratégica si lo necesitas.”
- **Hook B:** “Herramienta gratuita: ordena cifras antes de hablar con abogado. Sin promesas sobre tu tribunal.”
- **Cuerpo:** La calculadora no sustituye asesoría. Resultado depende de datos ingresados y normativa aplicable.
- **CTA:** “Abrir calculadora” / “Calcular rango”
- **Visual Canva:** Navy + glass; acentos **sky / cyan** (`#38bdf8`, `#22d3ee`) y toque **rosa suave** opcional (`#f472b6` a baja opacidad en glow). Importar plantilla base `public/meta-creatives/familia-calculadora-1080.svg`.
- **Gemini:** Variantes con `.cursor/skills/punto-legal-ceo-growth/gemini-creative-variants-v1.md` (contenido v1.1); en Notion usar campo **Prompt Gemini versión** con `gemini-creative-variants-v1.1` + fecha.
- **Compliance:** No garantizar monto de pensión ni resultado de demanda; no usar miedo al otro progenitor; clarificar que es estimación/orientación.

---

## Checklist antes de subir a Meta

- [ ] Revisión titular / abogado responsable
- [ ] Precio y duración coinciden con `serviceInfo` y checkout
- [ ] `content_ids` / URL usan el slug correcto del plan
- [ ] Sin “garantizamos”, “100%”, “recuperamos seguro”
- [ ] Disclaimer breve si testimonial o cifra
