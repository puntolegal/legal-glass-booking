# Plantilla Gemini/Veo — videos Meta calculadora pensión (v1)

Versión: **video-calc-v1** (2026-06). Uso: pegar en Gemini (Veo 3 / generación de video) para producir clips **9:16** que llevan tráfico de Meta Ads a `https://puntolegal.online/servicios/familia/calculadora`. En Notion, campo **Prompt Gemini versión** = `gemini-video-calc-v1` + fecha.

## Estética obligatoria (espejo de la página real)

La calculadora (`src/pages/CalculadoraPensionPage.tsx`) es un squeeze oscuro de alta conversión. Todo video debe verse como una extensión de esa página:

- Fondo: gradiente **slate-950 → slate-900** (azul-negro profundo, nunca blanco).
- Acento dominante: **rosa/rose** (`#f472b6` → `#fb7185`) en titulares, barra de progreso y CTA.
- Acento secundario dato legal: **sky/cyan** (`#38bdf8` / `#22d3ee`).
- Paneles **glass iOS**: blur, borde blanco 6–10% opacidad, esquinas muy redondeadas.
- Momento firma de la página: **análisis tipo terminal** (líneas que se tipean: "> INICIANDO ANÁLISIS…", "> CONSULTANDO LEY 14.908…", "> CALCULANDO MONTO MÁXIMO EXIGIBLE…") con cursor rosa parpadeante, y **contador CLP animado** que sube hasta revelar un rango.
- Tipografía: sans moderna bold (Manrope/Inter), subtítulos grandes siempre (feed sin audio).

## Límites de agresividad (no negociables)

"Agresivo" = ritmo, contraste, pregunta directa y mecanismos legales reales (Ley 14.908, Ley 21.389: arresto hasta 15 días, retención de sueldo, arraigo, Registro de Deudores). **Nunca**:

- Prometer monto de pensión o resultado judicial ("el juez te dará X", "recuperas seguro").
- Urgencia falsa (cupos/horas inventadas) ni countdowns sin respaldo.
- Hostilidad hacia el otro progenitor ("hazlo pagar", "véngate").
- Mostrar niños identificables o rostros en conflicto.
- Cifras de rating/reseñas como claim.
- El rango que muestre el video debe rotularse **"orientativo"** o "estimación"; el tribunal fija el monto definitivo.

Tras generar, pasar copy por `punto-legal-meta-compliance-qa` antes de Canva/Notion/Meta.

## Prompt sistema (pegar antes de cualquier concepto)

```
You are generating short vertical videos (9:16, 8s per clip) for Meta Ads in Chile for "Punto Legal", a legaltech law firm. Visual system: deep slate-950/900 dark gradient background, iOS glassmorphism panels (blur, 1px white border at 8% opacity, large rounded corners), dominant pink/rose accent (#f472b6 to #fb7185) for headlines and CTA, secondary sky/cyan (#38bdf8, #22d3ee) for legal data chips. Modern bold sans-serif typography (Manrope-like). All on-screen text in Chilean Spanish, large and readable. Mood: urgent but premium and trustworthy fintech-like, NOT cheap or sensationalist. Never show identifiable children or people fighting. Never show a guaranteed money amount as a court promise; any CLP range must carry the small label "orientativo". Final frame of every ad: CTA button style "Abrir calculadora gratis" plus URL "puntolegal.online/servicios/familia/calculadora" on a glass panel.
```

## Concepto 1 — "El terminal" (hook de análisis en vivo)

El más fiel a la página: dramatiza el momento del análisis. Para 24–30 s encadenar 3 clips.

```
Clip 1 (hook, 8s): Extreme close-up of a dark phone screen in a dim room. A terminal-style interface types green and pink monospaced lines over slate-950: "> INICIANDO ANÁLISIS DE TU CASO…", "> CONSULTANDO LEY 14.908…", "> DEUDA ACUMULADA DETECTADA". A pink cursor blinks. Camera slowly pushes in. Big Spanish overlay in bold white: "¿Sabes cuánto te corresponde de pensión?" Tense but elegant electronic pulse audio.

Clip 2 (8s): Same dark UI. An animated CLP currency counter rolls up fast (blurred digits, no final number readable) inside a glass panel, with the small pink label "RANGO ORIENTATIVO". Overlay: "Calculadora gratuita · resultado en 3 minutos". Progress bar fills pink to rose at top.

Clip 3 (CTA, 8s): Glass panel centered on slate gradient. Big text: "Gratis · Confidencial · Ley 14.908". Pink CTA button slides up: "Abrir calculadora gratis". URL below: puntolegal.online/servicios/familia/calculadora. Soft pulse glow on button. Voiceover (chilean spanish, firm female voice): "Deja de adivinar. Calcula tu rango orientativo hoy."
```

## Concepto 2 — "La deuda no desaparece" (ángulo apremios, el más agresivo permitido)

```
Clip 1 (hook, 8s): Dark screen, a stack of unpaid months appears as glass cards piling up, each labeled "MES IMPAGO" in red-pink. Overlay bold: "¿Te deben meses de pensión?" Sub: "La deuda se acumula. Y es exigible." Low bass hit per card.

Clip 2 (8s): Three glass chips slide in sequentially on slate background, sky/cyan icons: "Retención de sueldo", "Arresto hasta 15 días", "Arraigo nacional". Small caption: "Medidas de apremio · Ley 21.389 · según cada caso". Overlay: "La ley contempla herramientas reales."

Clip 3 (CTA, 8s): Terminal line types: "> CALCULANDO DEUDA ACUMULADA…". Cut to glass CTA panel: "Calcula tu deuda y tu rango orientativo — gratis, 3 minutos". Button: "Abrir calculadora gratis" + URL. Voiceover: "Conocer tu caso es el primer paso. La calculadora es gratis."
```

Nota compliance: las medidas se rotulan "según cada caso"; nunca decir "lo arrestamos" o "te devolvemos la plata".

## Concepto 3 — "3 minutos vs meses de duda" (contraste temporal)

```
Clip 1 (hook, 8s): Split screen vertical. Top half: blurred calendar pages flying, gray and slow, overlay "Meses sin saber cuánto corresponde". Bottom half: vibrant dark UI with pink progress bar filling fast, overlay "3 minutos para un rango orientativo". Hard contrast in color grading: desaturated top, rich slate+pink bottom.

Clip 2 (8s): POV thumb scrolling the actual-style form: glass cards with options "Pensión de alimentos", "Aumento", "Divorcio", "Tuición" being tapped, progress bar jumping 12%→64%→89%. Overlay: "Sin registro · Confidencial".

Clip 3 (CTA, 8s): The progress bar hits 100%, screen flashes soft pink, glass result panel appears with blurred CLP range labeled "orientativo". CTA button + URL. Voiceover: "Tres minutos. Gratis. Tu rango orientativo según la Ley 14.908."
```

## Concepto 4 — "La pregunta directa" (UGC-style, cámara hablada)

```
Single clip or 2 clips (8-16s): Photorealistic chilean woman in her 30s, neutral dark clothing, sitting in a dim modern living room at night, phone in hand, speaking straight to camera (selfie framing, slight handheld). She says in chilean spanish, subtitled in big white/pink captions: "¿Llevas meses peleando la pensión sin saber siquiera cuánto corresponde? Hay una calculadora gratuita que te da un rango orientativo en 3 minutos. Es de un estudio de abogados real." Cut to screen-recording style insert of the dark calculator UI with pink progress bar. End card: glass CTA panel, button "Abrir calculadora gratis" + URL.
```

Nota: es "estilo UGC" generado; no rotular como testimonio real ni inventar nombre/caso.

## Concepto 5 — "Ocultamiento de ingresos" (dolor específico de la página)

```
Clip 1 (hook, 8s): Dark scene, a glass panel shows a salary figure that glitches and shrinks repeatedly (numbers blurring downward). Overlay bold: "¿Sospechas que oculta sus ingresos reales?" Pink alert chip: "Es más común de lo que crees". Subtle tense synth.

Clip 2 (8s): Terminal types: "> BASE ECONÓMICA DECLARADA: INCONSISTENTE", "> APLICANDO CANASTA DE CRIANZA…", "> CALCULANDO MONTO MÁXIMO EXIGIBLE…". Overlay: "La calculadora considera tu caso real, no solo lo que él declara."

Clip 3 (CTA, 8s): Glass CTA panel on slate gradient: "Rango orientativo · Gratis · Confidencial". Button + URL. Voiceover: "Responde 10 preguntas. Conoce tu rango orientativo. Gratis."
```

## Checklist de salida (por cada video)

- [ ] Subtítulos grandes en cada frase hablada.
- [ ] Rango CLP siempre borroso o rotulado "orientativo".
- [ ] End card con CTA + URL legible ≥ 2 s.
- [ ] Sin niños identificables, sin conflicto físico, sin lenguaje hostil.
- [ ] Registro en Notion (Creativos y Canvas) con `gemini-video-calc-v1` + fecha y links Drive.

## Versionado

| Versión | Cambio |
|---------|--------|
| video-calc-v1 | 5 conceptos iniciales 9:16, espejo estética calculadora, límites compliance |
