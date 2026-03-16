# Plan Express QR - Flujo de Conversión Completo

## Objetivo
Landing para tráfico 100% móvil (códigos QR en calle). Flujo de inicio a fin hasta transacción y guardado en Supabase.

## Rutas
- **/centro** - URL corta para QR (puntolegal.cl/centro)
- **/express** - Alias
- **/pago** - Redirección intermedia a MercadoPago
- **/mercadopago** - Checkout MercadoPago
- **/payment-success** - Confirmación post-pago

## Flujo de Usuario

```
1. Usuario escanea QR → /centro
2. Sticky Banner (countdown 10 min)
3. Selecciona materia (5 opciones, botones 68px)
4. Auto-scroll a Paso 2
5. Ingresa nombre + WhatsApp
6. Supabase Ninja: guarda lead en leads_quiz (debounce 1.5s) con status: express_iniciado
7. Clic "PAGAR $25.000" → handlePayment
   - Upsert lead a checkout_iniciado
   - trackMetaEvent InitiateCheckout
   - localStorage paymentData
   - navigate('/pago')
8. PremiumPaymentPage → redirect /mercadopago (1.5s)
9. MercadoPagoPaymentPage → Botón MercadoPago
   - createCheckoutPreference (Edge Function)
   - Redirect a MercadoPago
10. Usuario paga en MercadoPago
11. MercadoPago redirect → /payment-success?source=mercadopago&status=approved&...
12. PaymentSuccessPage
    - findReservaByCriteria (falla para Express - no hay reserva)
    - Usa localStorage, source: express_qr
    - Vista específica GovTech (fondo #FAFAFA)
    - CTA WhatsApp
```

## Datos en Supabase

### leads_quiz
| Campo | Valor |
|-------|-------|
| email | express-{phone}@puntolegal.online |
| name | Nombre del usuario |
| status | express_iniciado → checkout_iniciado → en_pago → pago_completado |
| quiz_answers | source, nombre, whatsapp, materia, precio, precio_original |

### Migración
Ejecutar: `supabase/migrations/20260126000000_add_express_status_leads_quiz.sql`

## Tracking Meta
- **Lead**: Al guardar WhatsApp válido (ninja)
- **InitiateCheckout**: Al clic en PAGAR
- **Purchase**: En PaymentSuccessPage (vía webhook o reserva)

## Consideraciones
- Express NO crea reserva en tabla `reservas` (usa leads_quiz)
- PaymentSuccessPage usa localStorage cuando no hay reserva + status=approved
- Email placeholder: express-56912345678@puntolegal.online (MercadoPago puede aceptarlo)

## Checklist Producción

- [x] Build: `npm run build` sin errores
- [ ] **Supabase:** Ejecutar migración `20260126000000_add_express_status_leads_quiz.sql` (añade `express_iniciado` a leads_quiz)
- [ ] **MercadoPago:** Edge Function `create-mercadopago-preference` con MERCADOPAGO_ACCESS_TOKEN
- [ ] **URLs:** puntolegal.online/centro, puntolegal.online/express
- [ ] **WhatsApp contacto:** +56962321883 (confirmado en todo el flujo)
