# Plan de Ejecución: Express QR Calle (puntolegal.cl/centro)

## Objetivo
Landing de alta conversión para tráfico 100% móvil desde códigos QR en volanteo. Usuario con prisa, luz solar, busca solución legal barata ($10.000).

---

## Flujo de Usuario (Inicio a Fin)

```
QR Escaneado → /centro
    ↓
1. Sticky Banner (countdown 10 min)
2. Header "Ticket Presencial Validado" ($65.000 tachado → $10.000)
3. Selección Materia (5 botones 68px)
    ↓
4. Datos: Nombre + WhatsApp (auto-scroll al elegir)
5. Supabase Ninja: guarda lead al tener WhatsApp válido (debounce 1.5s)
6. Botón "PAGAR $10.000 Y AGENDAR AHORA"
    ↓
7. trackMetaEvent('InitiateCheckout')
8. localStorage: paymentData
9. navigate('/pago')
    ↓
10. PremiumPaymentPage → redirect /mercadopago (1.5s)
11. MercadoPagoPaymentPage → Checkout Pro
12. User paga en MercadoPago
    ↓
13. payment-success → leads_quiz pago_completado
```

---

## Rutas

| URL | Componente |
|-----|------------|
| `/centro` | ExpressPage |
| `/express` | ExpressPage (alias) |
| `/pago` | PremiumPaymentPage (redirige a /mercadopago) |
| `/mercadopago` | MercadoPagoPaymentPage |
| `/payment-success` | PaymentSuccessPage |

---

## URLs para QR

- **Producción:** `https://puntolegal.online/centro`
- **Corto (alternativo):** `puntolegal.cl/centro` (si el dominio tiene redirect)

---

## Supabase: leads_quiz

### Status del lead

| Momento | status |
|---------|--------|
| WhatsApp válido ingresado | `express_iniciado` |
| Click en "PAGAR" | `checkout_iniciado` |
| Llega a /mercadopago | `en_pago` |
| Pago aprobado | `pago_completado` |

### Campos en quiz_answers

```json
{
  "source": "QR_CALLE_CENTRO",
  "nombre": "...",
  "whatsapp": "+56912345678",
  "materia": "hogar|familia|trabajador|deudas|pyme",
  "precio": 10000,
  "precio_original": 65000
}
```

### Email placeholder

Para usuarios sin email: `express-{telefono}@puntolegal.online`  
Ejemplo: `express-91234567890@puntolegal.online`

---

## Migración Supabase

Ejecutar en Supabase SQL Editor:

```sql
-- supabase/migrations/20260126000000_add_express_status_leads_quiz.sql
ALTER TABLE public.leads_quiz DROP CONSTRAINT IF EXISTS leads_quiz_status_check;

ALTER TABLE public.leads_quiz ADD CONSTRAINT leads_quiz_status_check
CHECK (
  status IS NULL OR
  status = ANY (ARRAY[
    'lead', 'processed', 'contacted', 'converted', 'nuevo',
    'calculadora_iniciada', 'calculo_completado', 'incompleto', 'iniciado',
    'checkout_iniciado', 'en_pago', 'pago_completado',
    'urgencia_cualificacion', 'express_iniciado'
  ]::text[])
);
```

---

## Meta Events

| Evento | Momento |
|--------|---------|
| Lead | Cuando WhatsApp válido → guarda en Supabase |
| InitiateCheckout | Cuando click en "PAGAR $10.000 Y AGENDAR AHORA" |

---

## Recuperación de Ventas (Ninja)

Si el usuario cierra antes de pagar:

1. Lead ya está en `leads_quiz` con `express_iniciado`
2. Email: `express-{telefono}@puntolegal.online`
3. WhatsApp en `quiz_answers.whatsapp`
4. Al día siguiente: mensaje "Hola, escaneaste el código en Plaza de Armas ayer y se te cayó el internet antes de pagar. Te guardé tu cupo de $10.000, ¿te mando el link?"

---

## Checklist Pre-Producción

- [ ] Ejecutar migración `express_iniciado` en Supabase
- [ ] Verificar que Meta Pixel está configurado para Lead e InitiateCheckout
- [ ] Imprimir QR con URL: `https://puntolegal.online/centro`
- [ ] Probar flujo completo en móvil (luz solar simulada)
- [ ] Probar flujo de pago sin completar → verificar lead en Supabase
