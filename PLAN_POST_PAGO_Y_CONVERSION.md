# Plan de Acción: Post-Pago, Emails y Conversión

## Revisión Completada — Hallazgos

### 1. Páginas de Pago (Estilo inconsistente)

| Página | Estilo actual | Estilo objetivo |
|--------|---------------|-----------------|
| MercadoPagoPaymentPage | ✅ slate-950, iOS, glassmorphism | Mantener |
| PremiumPaymentPage | ✅ slate-950, iOS | Mantener |
| **PaymentSuccessPage** | ✅ slate-950, iOS | Completado |
| **PaymentFailurePage** | ✅ slate-950, iOS | Completado |
| **PaymentPendingPage** | ✅ slate-950, iOS | Completado |

### 2. Sistema de Emails (Resend / clever-action)

- **Flujo:** PaymentSuccessPage → sendRealBookingEmails → clever-action (Supabase) → Resend
- **Problema calculadora:** ✅ Resuelto. clever-action ahora acepta `email_data` cuando `booking_id` es CALC-xxx o pending → emails se envían sin reserva en BD.
- **Estilo:** ✅ Oscuro slate, acentos pink/rose, timeline, CTA "Agendar mi sesión", WhatsApp.

### 3. Agendamiento Post-Pago

- **Sistema existente:** AgendamientoPage con Step1 (datos), Step2 (fecha/hora), Step3 (pago).
- **Oportunidad:** Tras pago exitoso, el usuario debe poder **agendar su sesión** (elegir fecha/hora). Actualmente solo hay "Ver mi agendamiento" si existe reserva.
- **Flujo propuesto:** PaymentSuccess → CTA principal "Agendar mi sesión" → /agendamiento con datos pre-cargados (o paso directo a Step2).

### 4. Rutas y Flujos

- Calculadora → /pago → /mercadopago → payment-success / payment-failure
- Agendamiento clásico → crea reserva → Step3_Payment → MercadoPago → payment-success

---

## Plan de Implementación

### Fase 1: Unificar estilo de páginas post-pago (PaymentSuccess, Failure, Pending)
- Aplicar fondo slate-950, cards con glassmorphism, bordes rgba, tipografía consistente.
- Mantener semántica de colores (verde éxito, rojo error, amarillo pendiente) pero en paleta oscura.

### Fase 2: Rediseñar emails (clever-action)
- Plantilla cliente: fondo oscuro/slate, acentos pink/rose, timeline "Hoy / 24h / 48h".
- Incluir: "¿Qué sigue?", CTA "Agendar mi sesión" (link a /agendamiento), WhatsApp.
- Plantilla admin: mantener funcionalidad, mejorar legibilidad.

### Fase 3: Crear reserva para flujo calculadora ✅
- **Implementado:** clever-action acepta `email_data` en el body cuando no hay reserva en BD (flujo calculadora).
- realEmailService envía `email_data` completo cuando `booking_id` empieza con CALC- o es 'pending'.

### Fase 4: CTA "Agendar mi sesión" post-pago
- En PaymentSuccessPage: botón principal "Agendar mi sesión" → /agendamiento?postpago=1&email=...&nombre=...
- AgendamientoPage: detectar query postpago y pre-llenar datos, ir directo a Step2 (elegir fecha/hora).

### Fase 5: Mejoras de conversión adicionales
- Social proof en PaymentSuccess: "X personas agendaron esta semana".
- Urgencia: "Un abogado te contactará en menos de 2 horas".
- WhatsApp flotante en success/failure.

---

## Orden de Ejecución

1. **Fase 1** — Páginas post-pago (Success, Failure, Pending) estilo iOS
2. **Fase 4** — CTA Agendar + integración con AgendamientoPage
3. **Fase 2** — Emails rediseñados
4. **Fase 3** — Crear reserva en flujo calculadora (para que emails funcionen)
5. **Fase 5** — Toques finales de conversión
