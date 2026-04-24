# Contexto de experiencia de usuario: landing → agendamiento → pago → éxito

Documento de contexto para alinear producto, diseño y desarrollo. Alcance: **landing principal**, **flujo `/agendamiento`**, **intersticiales de pago** y **`/payment-success`**. Basado en auditoría de código (abril 2026).

---

## 1. Mapa del recorrido

| Etapa | Ruta / disparador | Qué hace el usuario | Qué hace el sistema |
|------|-------------------|---------------------|----------------------|
| Landing | `/` (`Index`) | Elige servicio / plan | `trackMetaEvent` + redirección a `/agendamiento?plan=…` |
| Agendamiento | `/agendamiento` | Datos personales → fecha/hora → pago o gratis | `AgendamientoContext`: crea reserva en Supabase; gratis → MP success URL; pago → preferencia MP y redirect |
| Intersticial pago | `/pago`, `/payment` (`PremiumPaymentPage`) | Espera breve | Lee `localStorage`, redirige a `/mercadopago` según flujo |
| Checkout | `/mercadopago` | Paga en MP | Éxito → `/payment-success` (a veces sin query; depende de retorno) |
| Express / QR | `/express`, `/centro` | Flujo express | `paymentData` + `source: express_qr` → `/pago` |
| Urgencia | `/urgencia` | Pago urgencia | `source: urgencia` en `localStorage`; success MP con query |
| Éxito | `/payment-success` | Lee confirmación, descarga calendario, WhatsApp | `processPaymentSuccess`: busca reserva, actualiza estado, `clever-action` para correos |

---

## 2. Ramas de `PaymentSuccessPage` (crítico para consistencia)

1. **`source === 'express_qr'`** — UI clara, sin `BrandMark`, CTA WhatsApp propio.
2. **`source === 'urgencia'`** — UI oscura, `BrandMark`, CTA distinto.
3. **Carga** — Spinner + checklist.
4. **Vista principal** — Tema oscuro “vidrio”, resumen, Mercado Pago info (si aplica), `.ics`, CTAs.
5. **Fallback `localStorage`** — Si no hay reserva en BD pero `status=approved` y hay datos guardados.

**Riesgo de coherencia:** si existe reserva en BD, el `setPaymentData` **no reinyecta `source`** desde `localStorage`; un usuario Express/Urgencia que sí tenga fila `reservas` podría ver la **vista principal** en lugar de la vista temática.

---

## 3. Hallazgos priorizados (errores / deuda)

### Alta

- **Éxito sin datos:** si `processPaymentSuccess` falla y no se setea `paymentData`, `isLoading` pasa a `false` y la UI principal puede mostrarse con textos por defecto (“Cliente”, etc.) en lugar de un estado de error claro.
- **`source` perdido con reserva en BD:** las ramas express/urgencia no se activan si `paymentData.source` no se fusiona desde el almacenamiento local al hidratar desde Supabase.

### Media

- **WhatsApp “acabo de pagar”** también en **consulta gratuita** — mensaje incorrecto vs realidad del flujo.
- **“Emails enviados”** en verde aunque `emailResult` haya fallado — desalineación confianza / realidad.
- **Fecha/hora en resumen vs variables:** `serviceDate` / `serviceTime` calculados pero no usados en JSX; copy “A coordinar” vs “No especificada” inconsistente.
- **`.ics` y formatos de hora:** si la BD devuelve hora no normalizada `HH:mm`, `hasConcreteBookingSlot` puede fallar aunque el usuario vea un slot “válido”.

### Baja

- **SEO en vista principal:** título/descripción siguen hablando de “pago” cuando `isFreeConsult` muestra “Consulta confirmada”.
- **Dominio** `www` vs sin `www` en URLs de retorno MP — riesgo menor de cookies/canonización.

---

## 4. Consistencia inicio → fin (objetivo)

| Dimensión | Estado deseado |
|-----------|----------------|
| Visual | Misma familia tipográfica; ramas especiales documentadas (Express claro es intencional) o token compartido de “éxito” |
| Copy | “Pagar / confirmar / gratis” alineados con el estado real (`isFreeConsult`, `source`) |
| Datos | Fecha/hora siempre las mismas en BD, correo, `.ics` y pantalla (una fuente de verdad + normalización) |
| Confianza | Estados de carga / error / éxito mutuamente excluyentes; feedback de email según resultado real |

---

## 5. Referencias de código

- Rutas: `src/App.tsx`
- Landing → agendamiento: `src/pages/Index.tsx`
- Lógica reserva/pago: `src/contexts/AgendamientoContext.tsx`
- Éxito: `src/pages/PaymentSuccessPage.tsx`
- Utilidades cita: `src/utils/bookingIcs.ts`
- Correos servidor: `supabase/functions/clever-action/index.ts`, `supabase/functions/_shared/puntoLegalBookingEmail.ts`

---

## 6. Próximos pasos recomendados (implementación)

1. Estado **`error` | `success`** explícito en `PaymentSuccessPage` si no hay datos válidos tras el proceso.
2. Fusionar **`source`** (y metadata crítica) desde `parsedStoredData` al armar estado con reserva de BD.
3. Mensajes WhatsApp y SEO **condicionados** a `isFreeConsult` y `source`.
4. Unificar **formato fecha/hora** en UI y usar las variables ya calculadas o eliminarlas.
5. Condicionar copy de **emails enviados** a `emailResult?.success`.
