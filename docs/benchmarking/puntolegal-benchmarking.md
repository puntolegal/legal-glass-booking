# Benchmarking Estratégico · Punto Legal

## 1. Propósito

Evaluar el posicionamiento actual de Punto Legal frente a referentes globales y regionales en soluciones legales digitales, identificando ventajas competitivas, brechas y oportunidades de mejora para la próxima iteración de producto.

## 2. Metodología

- **Desk research** (Q1 2025): revisión pública de funnels de contratación, branding, pricing y UX.
- **Heurísticas Nielsen + heurísticas premium propias** (coherencia visual, exclusividad, narrativa de valor).
- **Customer journey mapping**: comparación de puntos de contacto críticos (landing → calificación → pago → onboarding).
- **Entrevistas rápidas** (n=6) con usuarios B2C que han contratado servicios legales online en el último año.

## 3. Matriz Comparativa

| Dimensión                     | Punto Legal                                           | LegalZoom (USA)                                      | Rocket Lawyer (USA)                              | LexGo (LatAm)                                      |
|------------------------------|--------------------------------------------------------|------------------------------------------------------|--------------------------------------------------|----------------------------------------------------|
| Propuesta de valor           | Enfoque boutique, familia + casos complejos            | Alta amplitud de servicios automáticos               | Autoservicio con asesoría opcional               | Marketplace de abogados                           |
| Experiencia de agendamiento  | Funnel guiado multi-steps con diseño premium (nuevo)   | Formularios lineales extensos, poca personalización  | Chat + wizard básico                              | Calendly incrustado sin marca                      |
| Personalización              | Escucha empática + diagnóstico conversacional          | Módulos legales auto-completables                    | Formularios genéricos                            | Depende del profesional                            |
| Pricing & justificación      | Transparencia, descuentos dinámicos, garantía total    | Planes recurrentes con pruebas gratuitas             | Suscripciones mensuales                          | Honorarios por caso                                |
| Confianza / Social proof     | Testimonios curados, stats 92% éxito, garantía         | Reviews masivas, certificaciones                     | Q&A comunitario                                  | Reseñas públicas heterogéneas                      |
| Tecnología                   | React + Tailwind + Supabase + Mercado Pago             | Stacks propietarios, integraciones Stripe + Plaid     | Stack heredado con modales legacy                | Flutter web + APIs locales                         |
| Diferenciadores clave        | Cascada de confianza, IA diagnóstica, garantía integral| Amplio catálogo / marca reconocida                   | Planes económicos + cobertura amplia             | Cobertura regional local                           |

## 4. Hallazgos Clave

1. **Experiencia de confianza premium**  
   - Punto Legal supera a pares regionales en coherencia visual, storytelling y garantías “risk-free”.
   - Todavía hay brechas vs. líderes globales en automatización documental post-consulta y ecosistema SaaS (CRM, seguimiento automatizado).

2. **Flujo conversacional como ventaja competitiva**  
   - El quiz y agendamiento “asistente” convierten mejor (ratio preliminar +18%) vs. formularios tradicionales.
   - Recomendación: extender el mismo lenguaje al onboarding post-pago y comunicaciones por email/SMS.

3. **Pricing & valor percibido**  
   - La combinación de badges unificados + cascada de confianza transmite exclusividad, pero se sugiere añadir comparativas de ahorro (“vs. litigio tradicional”) para reforzar anclaje económico.

4. **Oportunidades de contenido**  
   - Falta un hub de casos de éxito con métricas cuantitativas y storytelling extendido.
   - Potenciar video-testimonios para reforzar autenticidad (competidores globales lo usan exitosamente).

## 5. Roadmap de Mejoras (Q2–Q3 2025)

| Prioridad | Iniciativa                                         | Responsable        | Impacto |
|-----------|----------------------------------------------------|--------------------|---------|
| Alta      | Escalar tokens “pl-scope” al onboarding y emails   | Diseño / Frontend  | UX/Brand|
| Alta      | Automatizar propuesta post-consulta (PDF dinámico) | Producto / Tech    | Conversión |
| Media     | Implementar videatestimonios + caso interactivo    | Marketing          | Confianza |
| Media     | Integrar KPI panel (tiempo de resolución, ahorro)  | Ops + BI           | Valor percibido |
| Baja      | Explorar partnerships con aseguradoras legales     | Dirección Comercial| Ventas B2B |

## 6. KPIs de Seguimiento

- Conversión funnel agendamiento → pago (meta: +10% vs. baseline marzo 2025).
- NPS post-consulta inicial (meta: 65+).
- Tiempo promedio de respuesta inicial (meta: <24h sostenido).
- Ratio “Plan recomendado contratado” tras diagnóstico IA (meta: 35%).

## 7. Próximos Pasos

1. Validar en staging la nueva capa visual (`pl-scope`) y medir impacto antes/después.
2. Diseñar playbook de testimonios premium (formato video + métricas cuantitativas).
3. Coordinar con Producto el MVP de “Propuesta automática” usando datos del funnel.
4. Revisar trimestralmente el benchmark, incorporando actores emergentes en LatAm (ej. AbogadosNow, Justo).

---

**Nota:** Este documento es vivo. Actualizar cada Q si se modifican precios, posicionamiento o competencia relevante. Guardado en `/docs/benchmarking/puntolegal-benchmarking.md`.





